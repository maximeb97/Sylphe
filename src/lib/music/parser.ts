import type { SequenceBlock, MusicTrack } from "./types";

/**
 * Parse a raw Strudel script into named sequence blocks.
 *
 * Blocks are delimited by lines starting with `$:` (active) or `_$:` (muted).
 * Each block can be tagged with `// @id:some-name` on the `$:` line or the
 * line immediately before it. If no @id is found, an auto-generated id is used.
 *
 * Everything before the first `$:` / `_$:` is considered the preamble
 * (e.g. `setcpm(...)`, global settings).
 */
export function parseStrudelScript(
  script: string,
): { preamble: string; sequences: SequenceBlock[] } {
  const lines = script.split("\n");
  const sequences: SequenceBlock[] = [];
  const preambleLines: string[] = [];
  let currentBlock: string[] = [];
  let currentId: string | null = null;
  let currentActive = true;
  let seenFirstBlock = false;
  let autoIdx = 0;

  const flushBlock = () => {
    if (currentBlock.length === 0) return;
    const code = currentBlock.join("\n").trim();
    if (!code) return;
    sequences.push({
      id: currentId ?? `seq-${autoIdx++}`,
      code,
      defaultActive: currentActive,
    });
    currentBlock = [];
    currentId = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trimStart();

    // Detect a new block
    const isActive = trimmed.startsWith("$:");
    const isMuted = trimmed.startsWith("_$:");

    if (isActive || isMuted) {
      if (!seenFirstBlock) seenFirstBlock = true;
      flushBlock();
      currentActive = isActive && !isMuted;

      // Look for @id on this line or the previous comment line
      const idOnLine = trimmed.match(/@id:([\w-]+)/);
      if (idOnLine) {
        currentId = idOnLine[1];
      } else if (
        preambleLines.length > 0 ||
        currentBlock.length > 0 ||
        i > 0
      ) {
        const prevLine = lines[i - 1]?.trim() ?? "";
        const idOnPrev = prevLine.match(/@id:([\w-]+)/);
        if (idOnPrev) currentId = idOnPrev[1];
      }

      currentBlock.push(line);
      continue;
    }

    if (!seenFirstBlock) {
      preambleLines.push(line);
    } else {
      currentBlock.push(line);
    }
  }

  flushBlock();

  return {
    preamble: preambleLines.join("\n").trim(),
    sequences,
  };
}

/**
 * Build an evaluable Strudel script from a track's preamble and a set of
 * active sequence IDs.
 */
export function buildActiveScript(
  track: MusicTrack,
  activeIds: Set<string>,
): string {
  const parts: string[] = [];
  if (track.preamble) parts.push(track.preamble);

  for (const seq of track.sequences) {
    if (activeIds.has(seq.id)) {
      // Ensure the code starts with `$:` (not `_$:`)
      const cleanCode = seq.code.replace(/^_\$:/, "$:");
      parts.push(cleanCode);
    }
  }

  return parts.join("\n\n");
}
