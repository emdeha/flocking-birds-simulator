import type { Vector3 } from "../types/vector";

type SpatialGrid = {
  readonly cellSize: number;
  readonly cells: ReadonlyMap<string, ReadonlyArray<number>>;
};

const cellKey = (x: number, y: number, z: number): string =>
  `${x},${y},${z}`;

const buildSpatialGrid = (
  positions: ReadonlyArray<Vector3>,
  cellSize: number
): SpatialGrid => {
  const cells = new Map<string, Array<number>>();

  for (let index = 0; index < positions.length; index++) {
    const pos = positions[index];
    const cx = Math.floor(pos.x / cellSize);
    const cy = Math.floor(pos.y / cellSize);
    const cz = Math.floor(pos.z / cellSize);
    const key = cellKey(cx, cy, cz);
    const existing = cells.get(key);
    if (existing) {
      existing.push(index);
    } else {
      cells.set(key, [index]);
    }
  }

  return { cellSize, cells };
};

const queryNeighbors = (
  grid: SpatialGrid,
  positions: ReadonlyArray<Vector3>,
  index: number,
  radius: number
): ReadonlyArray<number> => {
  const pos = positions[index];
  const radiusSq = radius * radius;
  const cellRadius = Math.ceil(radius / grid.cellSize);
  const cx = Math.floor(pos.x / grid.cellSize);
  const cy = Math.floor(pos.y / grid.cellSize);
  const cz = Math.floor(pos.z / grid.cellSize);

  const neighbors: Array<number> = [];

  for (let dx = -cellRadius; dx <= cellRadius; dx++) {
    for (let dy = -cellRadius; dy <= cellRadius; dy++) {
      for (let dz = -cellRadius; dz <= cellRadius; dz++) {
        const key = cellKey(cx + dx, cy + dy, cz + dz);
        const cell = grid.cells.get(key);
        if (!cell) continue;
        for (let ci = 0; ci < cell.length; ci++) {
          const candidateIndex = cell[ci];
          if (candidateIndex === index) continue;
          const candidate = positions[candidateIndex];
          const ddx = pos.x - candidate.x;
          const ddy = pos.y - candidate.y;
          const ddz = pos.z - candidate.z;
          if (ddx * ddx + ddy * ddy + ddz * ddz <= radiusSq) {
            neighbors.push(candidateIndex);
          }
        }
      }
    }
  }

  return neighbors;
};

export { buildSpatialGrid, queryNeighbors };
export type { SpatialGrid };
