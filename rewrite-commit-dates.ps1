#Requires -Version 5.1
<#
.SYNOPSIS
    Rewrites all git commit dates to appear as personal-time work.

.DESCRIPTION
    Moves every commit timestamp that falls on a weekday between
    08:00 and 18:59 (heure française, CET/CEST) to either :
      - le même soir entre 19:00 et 23:59, ou
      - un samedi ou dimanche proche (10:00–22:59).

    L'ordre chronologique des commits est conservé.
    Un backup est automatiquement créé par git dans refs/original/.

.NOTES
    - Réécrit l'historique git (author date + committer date).
    - Nécessite Git for Windows (Git Bash).
    - Un "force push" sera nécessaire après : git push --force-with-lease
    - Lancer le script depuis la racine du dépôt git.
#>

$ErrorActionPreference = "Stop"

# ── Fuseau horaire & helpers de dates ─────────────────────────────────────────

$Script:FrenchTz = [TimeZoneInfo]::FindSystemTimeZoneById("Romance Standard Time")

function Get-FrenchTime([DateTimeOffset]$dt) {
    [TimeZoneInfo]::ConvertTime($dt, $Script:FrenchTz)
}

function New-FrenchDateTimeOffset([datetime]$localDt) {
    $offset = $Script:FrenchTz.GetUtcOffset($localDt)
    [DateTimeOffset]::new($localDt, $offset)
}

# Renvoie $true si le timestamp tombe un jour de semaine entre 08h et 18h59 (heure fr)
function Test-WorkHours([DateTimeOffset]$dt) {
    $ft  = Get-FrenchTime $dt
    $dow = $ft.DayOfWeek
    ($dow -ne "Saturday" -and $dow -ne "Sunday") -and
    ($ft.Hour -ge 8 -and $ft.Hour -lt 19)
}

function Get-EveningDate([DateTimeOffset]$dt) {
    $ft    = Get-FrenchTime $dt
    $hour  = Get-Random -Minimum 19 -Maximum 24
    $min   = Get-Random -Minimum 0  -Maximum 60
    $sec   = Get-Random -Minimum 0  -Maximum 60
    $local = [datetime]::new($ft.Year, $ft.Month, $ft.Day, $hour, $min, $sec)
    New-FrenchDateTimeOffset $local
}

function Get-WeekendDate([DateTimeOffset]$dt) {
    $ft  = Get-FrenchTime $dt
    $dow = [int]$ft.DayOfWeek   # Sun=0, Mon=1, …, Sat=6

    # Nombre de jours à reculer pour atteindre le dernier samedi (valide pour lun–ven)
    # Mon→2, Tue→3, Wed→4, Thu→5, Fri→6
    $toLastSat = ($dow - 6 + 7) % 7

    $lastSat = $ft.Date.AddDays(-$toLastSat)
    $options = @(
        $lastSat,              # samedi précédent
        $lastSat.AddDays(1),   # dimanche précédent
        $lastSat.AddDays(7),   # samedi suivant
        $lastSat.AddDays(8)    # dimanche suivant
    )
    $day = $options[(Get-Random -Minimum 0 -Maximum 4)]

    $hour  = Get-Random -Minimum 10 -Maximum 23
    $min   = Get-Random -Minimum 0  -Maximum 60
    $sec   = Get-Random -Minimum 0  -Maximum 60
    $local = [datetime]::new($day.Year, $day.Month, $day.Day, $hour, $min, $sec)
    New-FrenchDateTimeOffset $local
}

function Get-FakeDate([DateTimeOffset]$dt) {
    if (-not (Test-WorkHours $dt)) { return $dt }
    # 50 % soir / 50 % week-end
    if ((Get-Random -Minimum 0 -Maximum 2) -eq 0) { return Get-EveningDate $dt }
    return Get-WeekendDate $dt
}

# Formate une date au format Unix timestamp que git accepte toujours sans ambiguïté
function Format-GitDate([DateTimeOffset]$dt) {
    $epoch  = [DateTimeOffset]::new(1970, 1, 1, 0, 0, 0, [TimeSpan]::Zero)
    $ts     = [long]($dt.ToUniversalTime() - $epoch).TotalSeconds
    $offset = $dt.Offset
    $sign   = if ($offset.TotalMinutes -ge 0) { "+" } else { "-" }
    $hh     = [Math]::Abs($offset.Hours).ToString("00")
    $mm     = [Math]::Abs($offset.Minutes).ToString("00")
    return "@$ts $sign$hh$mm"
}

function ConvertTo-UnixPath([string]$winPath) {
    $drive = $winPath[0].ToString().ToLower()
    $rest  = $winPath.Substring(2) -replace "\\", "/"
    return "/$drive$rest"
}

# ── Point d'entrée ────────────────────────────────────────────────────────────

if (-not (Test-Path ".git")) {
    Write-Error "Pas un dépôt git. Lance ce script depuis la racine du repo."
    exit 1
}

Write-Host "`n=== Git Commit Date Rewriter ===" -ForegroundColor Cyan

# Lecture des commits du plus ancien au plus récent
Write-Host "Lecture de l'historique..." -ForegroundColor Yellow
$logLines = & git log --format="%H|%aI" --reverse 2>&1
if ($LASTEXITCODE -ne 0) { Write-Error "git log a échoué : $logLines"; exit 1 }

$commits = @(
    $logLines |
    Where-Object { $_ -match "^[0-9a-f]{40}\|" } |
    ForEach-Object {
        $p = $_ -split "\|", 2
        [PSCustomObject]@{ Hash = $p[0]; Date = [DateTimeOffset]::Parse($p[1]) }
    }
)

Write-Host "Trouvé $($commits.Count) commit(s)." -ForegroundColor Green

# Calcul des nouvelles dates
Write-Host "Calcul des nouveaux horodatages (CET/CEST)..." -ForegroundColor Yellow

$mappings = [System.Collections.Generic.List[PSCustomObject]]::new()
$prevNew  = [DateTimeOffset]::MinValue
$nChanged = 0

foreach ($c in $commits) {
    $new = Get-FakeDate $c.Date

    # Garantir l'ordre chronologique après déplacement
    if ($new -le $prevNew) {
        $gap = Get-Random -Minimum 10 -Maximum 90   # minutes
        $new = $prevNew.AddMinutes($gap)
        if (Test-WorkHours $new) { $new = Get-EveningDate $new }
        if ($new -le $prevNew)   { $new = $prevNew.AddMinutes(15) }
    }

    if ($new -ne $c.Date) { $nChanged++ }
    $prevNew = $new

    $mappings.Add([PSCustomObject]@{ Hash = $c.Hash; OldDate = $c.Date; NewDate = $new })
}

# Aperçu
$sample = @($mappings | Where-Object { $_.NewDate -ne $_.OldDate } | Select-Object -First 30)
Write-Host "`n$nChanged commit(s) seront déplacés. Aperçu (30 premiers) :" -ForegroundColor Green
foreach ($m in $sample) {
    $old = (Get-FrenchTime $m.OldDate).ToString("yyyy-MM-dd HH:mm zzz")
    $new = (Get-FrenchTime $m.NewDate).ToString("yyyy-MM-dd HH:mm zzz")
    Write-Host ("  " + $m.Hash.Substring(0, 8) + "  $old  ->  $new") -ForegroundColor DarkGray
}
if ($nChanged -gt 30) {
    Write-Host "  … et $($nChanged - 30) de plus." -ForegroundColor DarkGray
}

# Confirmation
Write-Host ""
Write-Host "ATTENTION : cette opération réécrit l'historique git." -ForegroundColor Red
Write-Host "  Un backup est conservé sous refs/original/" -ForegroundColor DarkGray
Write-Host "  Pour le supprimer ensuite :" -ForegroundColor DarkGray
Write-Host "    git for-each-ref --format='%(refname)' refs/original | ForEach-Object { git update-ref -d `$_ }" -ForegroundColor DarkGray
Write-Host ""
$ans = Read-Host "Réécrire l'historique ? (yes/no)"
if ($ans -ne "yes") { Write-Host "Annulé." -ForegroundColor Yellow; exit 0 }

# Construction du script bash env-filter (case statement)
$filterPath = [System.IO.Path]::Combine(
    [System.IO.Path]::GetTempPath(),
    "git_date_filter_$(Get-Random -Minimum 10000 -Maximum 99999).sh"
)
$sb = [System.Text.StringBuilder]::new()
[void]$sb.AppendLine('case "$GIT_COMMIT" in')
foreach ($m in $mappings) {
    $gitDate = Format-GitDate $m.NewDate
    [void]$sb.AppendLine("  $($m.Hash)) D='$gitDate' ;;")
}
[void]$sb.AppendLine('  *) D="$GIT_AUTHOR_DATE" ;;')
[void]$sb.AppendLine('esac')
[void]$sb.AppendLine('export GIT_AUTHOR_DATE="$D"')
[void]$sb.AppendLine('export GIT_COMMITTER_DATE="$D"')

# Ecrire en UTF-8 sans BOM
$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($filterPath, $sb.ToString(), $Utf8NoBom)
$bashFilterPath = ConvertTo-UnixPath $filterPath

# Localisation de Git Bash
$bash = $null
foreach ($candidate in @(
    "C:\Program Files\Git\bin\bash.exe",
    "C:\Program Files (x86)\Git\bin\bash.exe"
)) {
    if (Test-Path $candidate) { $bash = $candidate; break }
}
if (-not $bash) {
    $cmd = Get-Command bash -ErrorAction SilentlyContinue
    if ($cmd) { $bash = $cmd.Source }
}
if (-not $bash) {
    Remove-Item $filterPath -ErrorAction SilentlyContinue
    Write-Error "Git Bash introuvable. Installe Git for Windows."
    exit 1
}

# Lancement de git filter-branch
Write-Host "`nLancement de git filter-branch via Git Bash (peut prendre quelques minutes)..." -ForegroundColor Yellow

$cmd = "git filter-branch -f --env-filter '. $bashFilterPath' -- --all"
& $bash -c $cmd
$exitCode = $LASTEXITCODE

Remove-Item $filterPath -ErrorAction SilentlyContinue

if ($exitCode -eq 0) {
    Write-Host "`n[OK] Historique reecrit !" -ForegroundColor Green
    Write-Host ""
    Write-Host "Verifier  : git log --format=%h %ai %s"
    Write-Host "Pousser   : git push --force-with-lease"
} else {
    Write-Host "`n[ERREUR] git filter-branch a echoue (code $exitCode)." -ForegroundColor Red
    exit 1
}
