import { describe, it, expect } from "vitest";
import { integrateBird } from "./integrator";
import type { Bird } from "../types/simulation-types";
import type { Vector3 } from "../types/vector";
import type { WorldBounds } from "../types/simulation-types";

const createBird = (
  position: Vector3,
  velocity: Vector3 = { x: 0, y: 0, z: 0 }
): Bird => ({
  position,
  velocity,
});

const defaultBounds: WorldBounds = {
  min: { x: -200, y: -200, z: -200 },
  max: { x: 200, y: 200, z: 200 },
};

describe("Physics integrator", () => {
  it("applies force to velocity and velocity to position within speed and force limits", () => {
    const bird = createBird({ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 });
    const force: Vector3 = { x: 0.05, y: 0.05, z: 0 };

    const result = integrateBird(bird, force, 1 / 60, 4, 0.1, defaultBounds);

    expect(result.position.x).toBeGreaterThan(0);
    expect(result.velocity.x).toBeGreaterThan(1);
    expect(result.velocity.y).toBeGreaterThan(0);
  });

  it("wraps position toroidally when exceeding world bounds", () => {
    const bird = createBird({ x: 199, y: 0, z: 0 }, { x: 100, y: 0, z: 0 });
    const force: Vector3 = { x: 0, y: 0, z: 0 };

    const result = integrateBird(bird, force, 1 / 60, 200, 0.1, defaultBounds);

    expect(result.position.x).toBeLessThan(200);
    expect(result.position.x).toBeGreaterThanOrEqual(-200);
  });
});
