# Strudel Complete Reference (for AI Code Generation)

> Strudel is a live-coding music environment running in the browser. Code is JavaScript-based. Patterns are built using **mini-notation** strings and **chained functions**. Everything revolves around **cycles** (default: 1 cycle = 2 seconds = 0.5 CPS = 120 BPM with 4 beats/cycle).

---

## 1. Core Concepts

### Cycles & Tempo
- Default tempo: **0.5 CPS** (cycles per second) = 1 cycle every 2s.
- `setcpm(x)` — set cycles per minute. `setcpm(120/4)` = 120 BPM in 4/4.
- `setcps(x)` — set cycles per second.
- `.cpm(x)` — per-pattern tempo. `.cpm(90)` = 90 BPM.
- Formula: `setcpm(bpm / beats_per_cycle)`.

### Multiple Patterns
- Use `$:` before each pattern to play them simultaneously:
```js
$: s("bd sd").bank("RolandTR909")
$: note("c2 eb3 g3").s("sawtooth")
```
- Prefix with `_$:` to mute a pattern.
- `stack(pat1, pat2)` also plays patterns simultaneously.

### Coding Syntax
- Functions are chained with `.`: `note("c a f e").s("piano").lpf(800)`
- Double quotes `"..."` or backticks `` `...` `` → mini-notation (parsed as pattern).
- Single quotes `'...'` → plain string (NOT parsed as pattern).
- `//` comments out a line. `/* ... */` for block comments.
- `register('name', (pat) => ...)` creates reusable chained functions.

---

## 2. Mini-Notation (Pattern Language)

The mini-notation is written inside double quotes or backticks as arguments to functions like `sound()`, `note()`, `n()`, etc.

| Syntax | Meaning | Example |
|--------|---------|---------|
| `space` | Sequence (events share 1 cycle equally) | `"bd sd hh cp"` |
| `[x y]` | Sub-sequence (squished into parent slot) | `"bd [hh hh] sd"` |
| `[[x y]]` | Nested sub-sequence | `"bd [[hh cp] sd]"` |
| `x*n` | Speed up / multiply | `"hh*4"` (4 hihats) |
| `x/n` | Slow down / divide | `"[c d e f]/2"` (over 2 cycles) |
| `<x y z>` | Alternate: one per cycle | `"<bd sd cp>"` |
| `x,y` | Parallel / polyphony | `"bd*2, hh*4"` |
| `~` or `-` | Rest / silence | `"bd ~ sd ~"` |
| `x@n` | Elongate (weight n, default 1) | `"c@3 e"` (c is 3x longer) |
| `x!n` | Replicate (repeat without speedup) | `"c!3 e"` = `"c c c e"` |
| `x?` | 50% chance of removal | `"hh*8?"` |
| `x?0.2` | 20% chance of removal | `"hh*8?0.2"` |
| `x\|y` | Random choice | `"bd \| sd \| cp"` |
| `x:n` | Sample number | `"hh:0 hh:1 hh:2"` |
| `x(k,n)` | Euclidean rhythm (k beats in n steps) | `"bd(3,8)"` |
| `x(k,n,r)` | Euclidean with rotation | `"bd(3,8,2)"` |
| `{x y z}%n` | Polymeter: n steps/cycle | `"{a b c}%4"` |

### Key Rules
- Adding more elements to a sequence makes each element shorter (cycle stays same length).
- `<x y z>` plays one per cycle; equivalent to `[x y z]/3`.
- `<x y z>*8` plays 8 per cycle from the alternating sequence.
- Backticks allow multiline patterns.
- Commas inside brackets = parallel: `"[bd, hh*2]"`.

---

## 3. Sound Functions

### sound / s
```js
sound("bd sd hh cp")    // play samples by name
s("bd sd hh cp")         // shorthand alias
```

### Default Drum Sounds
| Name | Sound |
|------|-------|
| `bd` | bass drum / kick |
| `sd` | snare drum |
| `hh` | closed hi-hat |
| `oh` | open hi-hat |
| `cp` | clap |
| `rim` | rimshot |
| `lt` | low tom |
| `mt` | mid tom |
| `ht` | high tom |
| `cr` | crash |
| `rd` | ride |
| `cb` | cowbell |
| `sh` | shaker |
| `perc` | percussion |
| `misc` | miscellaneous |

### bank(name)
Switch drum machine: `s("bd sd").bank("RolandTR909")`  
Common banks: `RolandTR808`, `RolandTR909`, `RolandTR707`, `RolandTR505`, `AkaiLinn`, `RhythmAce`, `ViscoSpaceDrum`, `CasioRZ1`, `RolandCompurhythm1000`.

### n(pattern)
Select sample number: `n("0 1 2 3").sound("jazz")`  
Numbers wrap around if exceeding available samples.

### samples(source)
Load custom samples:
```js
samples('github:tidalcycles/dirt-samples')
samples({ kick: 'path/to/file.wav' }, 'https://base-url/')
```

---

## 4. Notes & Pitch

### note(pattern)
```js
note("c e g b")           // note letters (a-g), default octave 3
note("c4 e4 g4")          // with octave number
note("c# db eb f#")       // sharps and flats
note("48 52 55 59")       // MIDI numbers
note("c2 c3").sound("piano")
```
- MIDI 60 = C4, 69 = A4 (440Hz).
- Decimal values work: `note("55.5")`.
- Without `.sound()`, default sound is `triangle`.

### freq(pattern)
Direct frequency control: `freq("220 330 440")`

### scale(name)
```js
n("0 2 4 6").scale("C:minor").sound("piano")
```
Format: `"Root:ScaleType"`, e.g. `C:major`, `A2:minor`, `D:dorian`, `G:mixolydian`, `F:major:pentatonic`, `C:minor:pentatonic`, `C:chromatic`.  
Negative numbers and sharps/flats (`-1`, `4#`, `7b`) work to escape the scale.

### transpose(semitones)
```js
note("c e g").transpose("<0 -2 5 3>")
```

### scaleTranspose(steps)
Transpose within the current scale by scale degrees.

---

## 5. Audio Effects

### Filters
```js
.lpf(freq)       // low-pass filter cutoff (0-20000)
.hpf(freq)       // high-pass filter cutoff
.bpf(freq)       // band-pass filter center freq
.lpq(q)          // low-pass resonance (0-50)
.hpq(q)          // high-pass resonance
.bpq(q)          // band-pass resonance
.ftype(type)     // filter type: 0=12db, 1=ladder, 2=24db
.vowel(v)        // formant filter: "a e i o u"
```
Mini-notation shorthand: `.lpf("1000:10")` = cutoff 1000, Q 10.

### Amplitude Envelope (ADSR)
```js
.attack(t)       // attack time (seconds)
.decay(t)        // decay time (seconds)
.sustain(level)  // sustain level (0-1)
.release(t)      // release time (seconds)
.adsr("a:d:s:r") // shorthand: .adsr(".1:.1:.5:.2")
```

### Filter Envelope
```js
.lpf(300).lpenv(4)          // LP filter env depth
.lpa(.1).lpd(.2).lps(.5).lpr(.1)  // LP env ADSR
// Same for hp: .hpenv(), .hpa(), .hpd(), .hps(), .hpr()
// Same for bp: .bpenv(), .bpa(), .bpd(), .bps(), .bpr()
```

### Pitch Envelope
```js
.penv(semitones)   // pitch env depth
.pattack(t)        // pitch env attack
.pdecay(t)         // pitch env decay
.prelease(t)       // pitch env release
.pcurve(type)      // 0=linear, 1=exponential
.panchor(n)        // 0=up from note, 1=down to note
```

### Dynamics
```js
.gain(amount)      // exponential gain
.velocity(v)       // 0-1, multiplied with gain
.postgain(amount)  // gain after all effects
.compressor("threshold:ratio:knee:attack:release")
```

### Delay (global per orbit)
```js
.delay(level)              // 0-1
.delaytime(time)           // delay time
.delayfeedback(fb)         // 0-1 (< 1!)
.delay(".5:.125:.8")       // shorthand: level:time:feedback
```

### Reverb (global per orbit)
```js
.room(level)       // reverb amount 0-1
.roomsize(size)    // alias: .size(), .rsize() — 0-10
.roomfade(sec)     // alias: .rfade()
.roomlp(freq)      // alias: .rlp()
.roomdim(freq)     // alias: .rdim()
.room(".9:4")      // shorthand: level:size
```

### Panning
```js
.pan(pos)          // 0=left, 0.5=center, 1=right
.jux(fn)           // apply fn to right channel only
.juxBy(width, fn)  // jux with adjustable stereo width (0=mono, 1=full)
```

### Distortion & Waveshaping
```js
.distort(amount)   // alias: .dist()
.shape(amount)     // soft waveshaper
.crush(depth)      // bit crusher (1=extreme, 16=none)
.coarse(factor)    // sample rate reduction
```

### Other
```js
.speed(n)          // sample playback speed (-n = reverse)
.pan(pos)          // stereo position 0-1
.orbit(n)          // route to effect bus n (separate reverb/delay per orbit)
```

---

## 6. Synths

### Basic Waveforms
Use with `sound()` or `s()`:
```js
note("c e g").s("sawtooth")   // also: sine, square, triangle
```
Without `.s()`, `note()` defaults to `triangle`.

### Noise
```js
s("white")  // also: pink, brown
s("crackle").density(0.1)
```

### FM Synthesis
```js
note("c e g").fm(4)           // modulation index (brightness)
.fmh(1.5)                     // harmonicity ratio
.fmattack(.05).fmdecay(.1)    // FM envelope
.fmsustain(.4).fmenv("lin")   // FM sustain & env type
```

### Vibrato
```js
.vib(freq)       // vibrato frequency in Hz
.vibmod(depth)   // vibrato depth in semitones
.vib("4:12")     // shorthand: freq:depth
```

### Additive Synthesis
```js
.partials([1, 0, 0.3, 0, 0.1])  // harmonic magnitudes
.phases([0, 0, 0.5])             // harmonic phases
s("user").partials([1,0,.5])     // custom waveform
```

### Wavetable
Any sample prefixed `wt_` loops automatically:
```js
samples('github:bubobubobubobubo/dough-waveforms')
note("c eb g").s("wt_dbass")
```

---

## 7. Sampler Controls

```js
.begin(0.25)       // skip first 25% of sample
.end(0.5)          // cut at 50% of sample
.speed(2)          // double speed (pitch up)
.speed(-1)         // play in reverse
.clip(factor)      // alias: .legato() — duration multiplier
.cut(group)        // cut group (stop previous in same group)
.loop(1)           // loop the sample
.loopBegin(pos)    // loop start point (0-1)
.loopEnd(pos)      // loop end point (0-1)
.chop(n)           // granular: cut sample into n parts
.striate(n)        // progressive slicing
.slice(n, pat)     // slice into n, play pattern of indices
.splice(n, pat)    // like slice but adjusts speed to fit
.fit()             // fit sample to event duration
.loopAt(n)         // fit sample to n cycles
```

---

## 8. Pattern Factories (JS Functions)

| Function | Mini-notation equiv | Description |
|----------|-------------------|-------------|
| `seq("a","b","c")` | `"a b c"` | Sequence in 1 cycle |
| `cat("a","b","c")` | `"<a b c>"` | One per cycle |
| `stack("a","b")` | `"a, b"` | Play simultaneously |
| `silence` | `"~"` | Nothing |
| `run(n)` | — | Numbers 0 to n-1 |
| `arrange([4,pat1],[2,pat2])` | — | Multi-cycle arrangement |
| `polymeter("a b c","x y")` | `"{a b c, x y}"` | Polymeter |
| `stepcat(pat1, pat2)` | — | Step-proportional concat |

---

## 9. Time Modifiers

```js
.fast(n)           // speed up (* in mini-notation)
.slow(n)           // slow down (/ in mini-notation)
.early(cycles)     // shift earlier in time
.late(cycles)      // shift later in time
.rev()             // reverse pattern
.palindrome()      // alternate forward/backward each cycle
.iter(n)           // rotate subdivisions each cycle
.iterBack(n)       // iter in reverse
.ply(n)            // repeat each event n times
.segment(n)        // sample continuous pattern at n events/cycle
.euclid(k, n)      // euclidean rhythm (k, n) — same as (k,n) in mini
.euclidRot(k,n,r)  // with rotation
.euclidLegato(k,n) // held notes
.compress(a, b)    // compress into timespan [a,b]
.zoom(a, b)        // play only portion [a,b]
.linger(frac)      // repeat fraction of pattern
.fastGap(n)        // speed up but leave gap
.inside(n, fn)     // apply fn inside time subdivision
.outside(n, fn)    // apply fn outside time subdivision
.swingBy(amount,n) // swing rhythm
.swing(n)          // shorthand for .swingBy(1/3, n)
.ribbon(offset, n) // loop n cycles starting at offset
```

---

## 10. Value Operators

```js
.add(n)            // add to numeric values (notes treated as MIDI)
.sub(n)            // subtract
.mul(n)            // multiply
.div(n)            // divide
.round()           // round to nearest integer
.range(min, max)   // scale 0-1 signal to [min, max]
.rangex(min, max)  // exponential range scaling
```

---

## 11. Continuous Signals

Signals oscillate between 0 and 1 (or -1 to 1 for `*2` variants):

```js
sine               // smooth sine wave
saw                // sawtooth 0→1
tri                // triangle wave
square             // square wave (0 or 1)
rand               // random 0-1
perlin             // smooth random (Perlin noise)
irand(n)           // random integer 0 to n-1
```
Variants: `sine2`, `saw2`, `tri2`, `square2`, `rand2` → range -1 to 1.

### Usage
```js
s("hh*16").gain(sine)                      // modulate gain
s("hh*16").lpf(saw.range(200, 4000))       // modulate filter
note("c e g").lpf(sine.range(100,2000).slow(4))  // slow modulation
```
**Important**: Signals are continuous but sampled only at event times. Use `.segment(n)` to discretize.

---

## 12. Random Modifiers

```js
.degradeBy(amount)   // randomly remove events (0-1 probability)
.degrade()           // .degradeBy(0.5)
.sometimesBy(p, fn)  // apply fn with probability p
.sometimes(fn)       // .sometimesBy(0.5, fn)
.often(fn)           // .sometimesBy(0.75, fn)
.rarely(fn)          // .sometimesBy(0.25, fn)
.almostAlways(fn)    // .sometimesBy(0.9, fn)
.almostNever(fn)     // .sometimesBy(0.1, fn)
.someCycles(fn)      // apply fn to ~50% of cycles
.someCyclesBy(p, fn) // apply fn to p% of cycles
choose("a","b","c")  // random selection per event
chooseCycles("a","b") // random selection per cycle
wchoose(["a",5],["b",1]) // weighted random
```

---

## 13. Conditional Modifiers

```js
.firstOf(n, fn)     // apply fn every n cycles (starting 1st)
.lastOf(n, fn)      // apply fn every n cycles (starting last)
.when(boolPat, fn)  // apply fn when pattern is truthy
.struct(binPat)     // apply binary structure: .struct("x ~ x ~ x")
.mask(binPat)       // silence where pattern is 0/~
.chunk(n, fn)       // divide into n parts, apply fn to one per cycle
.hush()             // silence the pattern
.pick(list)         // select pattern by index
.inhabit(map)       // select by name: .inhabit({a: "bd", b: "sd"})
.squeeze(pat, list) // pick + squeeze duration
```

---

## 14. Accumulation (Layering)

```js
.superimpose(fn)    // layer modified copy on top of original
.layer(fn1, fn2)    // like superimpose but without original
.off(time, fn)      // superimpose with time offset
.echo(times, time, feedback)  // decreasing echoes
.echoWith(times, time, fn)    // echoes with custom transform
.add(note(7))       // add interval (works inside mini-notation too)
```

---

## 15. Pattern Effects (Unique to Tidal/Strudel)

```js
.rev()              // reverse
.jux(fn)            // left=original, right=fn(original)
.juxBy(w, fn)       // adjustable stereo width
.add(pattern)       // add values (notes, numbers)
.ply(n)             // repeat each event n times
.off(t, fn)         // offset copy: .off(1/8, x=>x.add(7))
```

### off pattern example
```js
n("0 [4 3] 2 1"
  .off(1/16, x=>x.add(4))
  .off(1/8, x=>x.add(7))
).scale("C5:minor").s("triangle")
```

---

## 16. Tonal Functions

### scale
```js
n("0 2 4 6").scale("C:minor")
```
Common scales: `major`, `minor`, `dorian`, `mixolydian`, `pentatonic`, `minor:pentatonic`, `major:pentatonic`, `chromatic`, `blues`, `bebop`, `ritusen`, etc.

### chord + voicing
```js
chord("<C^7 A7 Dm7 G7>").voicing()
```
Chord symbols follow iReal Pro convention. Root + type, e.g.: `C`, `Cm`, `C7`, `C^7` (=CM7), `C-7` (=Cm7), `Cm7b5`, `C7#9`, etc.

### voicing controls
```js
.anchor("c5")              // alignment note
.mode("below")             // below | above | duck | root
.dict('ireal')             // voicing dictionary
.offset(1)                 // shift to next voicing
```

### rootNotes
```js
chord("<C^7 Dm7 G7>").rootNotes(2).note()  // bass line from roots
```

---

## 17. Cycles & Tempo in Practice

```js
setcpm(120/4)  // 120 BPM, 4 beats per cycle (standard 4/4)
setcpm(90/4)   // 90 BPM in 4/4
setcpm(140/2)  // 140 BPM, 2 beats per cycle  
```
- Default is ~120 BPM (0.5 CPS, 30 CPM → 4 beats = 120 BPM).
- No concept of bars/measures — only cycles. Use `<>` for multi-cycle patterns.

---

## 18. Common Patterns & Recipes

### Basic Drum Beat (4/4 Rock)
```js
s("[bd sd]*2, hh*8").bank("RolandTR505")
```

### House Beat
```js
s("bd*4, [~ cp]*2, [~ hh]*4").bank("RolandTR909")
```

### Bassline with Notes
```js
note("<[c2 c3]*4 [bb1 bb2]*4 [f2 f3]*4 [eb2 eb3]*4>")
  .sound("sawtooth").lpf(800)
```

### Full Track (Multiple Patterns)
```js
$: note("<[c2 c3]*4 [bb1 bb2]*4 [f2 f3]*4 [eb2 eb3]*4>")
  .sound("sawtooth").lpf(800)

$: n("<[~ 0] 2 [0 2] [~ 2]>*4")
  .scale("C4:minor").sound("gm_synth_strings_1")

$: sound("bd*4, [~ <sd cp>]*2, [~ hh]*4")
  .bank("RolandTR909")
```

### Arpeggio
```js
n("0 2 4 7").scale("C:minor").clip(2).s("gm_electric_guitar_clean")
```

### Filter Envelope Bass
```js
note("g1 bb1 c2 d2").s("sawtooth").lpf(400).lpenv(4)
```

### Layering Sounds
```js
note("c2").s("sawtooth, square").add(note("0, .1"))  // detuned chorus
```

### Shuffle/Swing
```js
s("hh*8").swing(4)
// or: s("hh*8").swingBy(1/3, 4)
```

### Euclidean Rhythms
```js
s("bd(3,8), cp(2,8), hh(5,8)")
```

---

## 19. Available GM Sounds (General MIDI Samples)

Use with `.sound()`: `gm_acoustic_bass`, `gm_electric_guitar_muted`, `gm_electric_guitar_clean`, `gm_electric_guitar_jazz`, `gm_acoustic_bass`, `gm_synth_bass_1`, `gm_synth_strings_1`, `gm_voice_oohs`, `gm_blown_bottle`, `gm_xylophone`, `gm_accordion`, `piano`, etc.

---

## 20. Critical Rules for Error-Free Code

1. **Always use double quotes or backticks for patterns** (mini-notation), single quotes for plain strings like scale names.
2. **Functions must be chained with `.`** — no spaces between function calls.
3. **`sound()` / `s()` and `note()` are the main entry points** — at least one is required per pattern.
4. **`$:` prefix** required when playing multiple patterns simultaneously.
5. **Mini-notation spaces = sequence elements** — `"bd sd"` is 2 events, `"bd"` is 1 event.
6. **`<>` creates alternation** — exactly one element per cycle. Don't confuse with `[]`.
7. **Signals (sine, saw, etc.) are bare identifiers**, not strings: `.gain(sine)` NOT `.gain("sine")`.
8. **`.range(min, max)` must be called on signals**: `sine.range(200, 2000)`.
9. **Lambda functions** for pattern effects: `.sometimes(x => x.speed(2))`.
10. **Reverb and delay are global per orbit** — use `.orbit(n)` to separate.
11. **Sample names are case-sensitive**.
12. **`.scale()` requires colon syntax**: `"C:minor"` not `"C minor"` (or use single quotes for full name `'C minor'`).
13. **`setcpm()` is a standalone call**, not chained: `setcpm(120/4)` on its own line or with `;`.
14. **Numbers in mini-notation**: `"hh:2"` selects sample 2, `"c3"` is note C octave 3.
15. **Empty `.s()` / `.note()` call** wraps a plain pattern: `"c e g".note()` is valid.
