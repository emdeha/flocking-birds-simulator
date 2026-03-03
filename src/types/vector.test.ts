import { describe, it, expect } from "vitest";
import {
  vectorAdd,
  vectorSubtract,
  vectorScale,
  vectorNormalize,
  vectorMagnitude,
  vectorDistance,
} from "./vector";

describe("Vector3 math operations", () => {
  it("adds two vectors component-wise", () => {
    const result = vectorAdd({ x: 1, y: 2, z: 3 }, { x: 4, y: 5, z: 6 });

    expect(result).toEqual({ x: 5, y: 7, z: 9 });
  });

  it("subtracts two vectors component-wise", () => {
    const result = vectorSubtract({ x: 5, y: 7, z: 9 }, { x: 1, y: 2, z: 3 });

    expect(result).toEqual({ x: 4, y: 5, z: 6 });
  });

  it("scales a vector by a scalar factor", () => {
    const result = vectorScale({ x: 1, y: 2, z: 3 }, 2);

    expect(result).toEqual({ x: 2, y: 4, z: 6 });
  });

  it("normalizes a vector to unit length", () => {
    const result = vectorNormalize({ x: 3, y: 0, z: 4 });
    const magnitude = vectorMagnitude(result);

    expect(magnitude).toBeCloseTo(1.0, 10);
    expect(result.x).toBeCloseTo(0.6, 10);
    expect(result.y).toBeCloseTo(0, 10);
    expect(result.z).toBeCloseTo(0.8, 10);
  });

  it("returns zero vector when normalizing a zero vector", () => {
    const result = vectorNormalize({ x: 0, y: 0, z: 0 });

    expect(result).toEqual({ x: 0, y: 0, z: 0 });
  });

  it("computes the magnitude of a vector", () => {
    const result = vectorMagnitude({ x: 3, y: 4, z: 0 });

    expect(result).toBe(5);
  });

  it("computes the distance between two vectors", () => {
    const result = vectorDistance(
      { x: 1, y: 2, z: 3 },
      { x: 4, y: 6, z: 3 }
    );

    expect(result).toBe(5);
  });
});
