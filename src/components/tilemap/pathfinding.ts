import { isWalkable } from "./tiles";

export interface Point {
  x: number;
  y: number;
}

/**
 * BFS pathfinding — returns a list of steps from `start` to `end`,
 * not including `start`. Returns [] if no path or same position.
 */
export function findPath(
  start: Point,
  end: Point,
  map: number[][],
  scene: "OUTSIDE" | "INSIDE",
  maxVisited = 200
): Point[] {
  if (start.x === end.x && start.y === end.y) return [];

  const rows = map.length;
  const cols = map[0].length;

  const canWalk = (x: number, y: number) => {
    if (y < 0 || y >= rows || x < 0 || x >= cols) return false;
    return isWalkable(map[y][x], scene);
  };

  const queue: Array<{ x: number; y: number; path: Point[] }> = [
    { x: start.x, y: start.y, path: [] },
  ];
  const visited = new Set<number>();
  visited.add(start.y * cols + start.x);

  const DIRS = [
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 },
  ];

  while (queue.length > 0) {
    const current = queue.shift()!;

    for (const { dx, dy } of DIRS) {
      const nx = current.x + dx;
      const ny = current.y + dy;
      const key = ny * cols + nx;

      if (visited.has(key) || !canWalk(nx, ny)) continue;

      const newPath = [...current.path, { x: nx, y: ny }];

      if (nx === end.x && ny === end.y) return newPath;

      queue.push({ x: nx, y: ny, path: newPath });
      visited.add(key);

      if (visited.size > maxVisited) return [];
    }
  }

  return [];
}
