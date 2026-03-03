import { describe, it, expect } from "vitest";
import { buildSpatialGrid, queryNeighbors } from "./spatial-index";
import type { Vector3 } from "../types/vector";

const createPosition = (x: number, y: number, z: number): Vector3 => ({
  x,
  y,
  z,
});

describe("Spatial index", () => {
  it("returns indices of positions within query radius and excludes those outside", () => {
    const positions: ReadonlyArray<Vector3> = [
      createPosition(0, 0, 0),
      createPosition(5, 0, 0),
      createPosition(50, 0, 0),
      createPosition(100, 0, 0),
    ];

    const grid = buildSpatialGrid(positions, 10);
    const neighbors = queryNeighbors(grid, positions, 0, 10);

    expect(neighbors).toContain(1);
    expect(neighbors).not.toContain(0);
    expect(neighbors).not.toContain(2);
    expect(neighbors).not.toContain(3);
  });

  it("returns empty array when no neighbors are within radius", () => {
    const positions: ReadonlyArray<Vector3> = [
      createPosition(0, 0, 0),
      createPosition(100, 100, 100),
    ];

    const grid = buildSpatialGrid(positions, 10);
    const neighbors = queryNeighbors(grid, positions, 0, 10);

    expect(neighbors).toEqual([]);
  });
});
