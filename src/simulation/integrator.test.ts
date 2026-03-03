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

  it.each([
    {
      direction: "positive",
      startPosition: { x: 199, y: 0, z: 0 },
      velocity: { x: 100, y: 0, z: 0 },
      expectedSide: "negative",
    },
    {
      direction: "negative",
      startPosition: { x: -199, y: 0, z: 0 },
      velocity: { x: -100, y: 0, z: 0 },
      expectedSide: "positive",
    },
  ])(
    "wraps position toroidally to the $expectedSide side when exiting the $direction boundary",
    ({ startPosition, velocity, expectedSide }) => {
      const bird = createBird(startPosition, velocity);
      const force: Vector3 = { x: 0, y: 0, z: 0 };

      const result = integrateBird(bird, force, 1 / 60, 200, 0.1, defaultBounds);

      expect(result.position.x).toBeGreaterThanOrEqual(-200);
      expect(result.position.x).toBeLessThan(200);

      if (expectedSide === "negative") {
        expect(result.position.x).toBeLessThan(0);
      } else {
        expect(result.position.x).toBeGreaterThan(0);
      }
    }
  );

  it("clamps force magnitude to maxForce when force exceeds the limit", () => {
    const bird = createBird({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 });
    const largeForce: Vector3 = { x: 10, y: 0, z: 0 };
    const smallForce: Vector3 = { x: 0.01, y: 0, z: 0 };
    const dt = 1 / 60;

    const resultLarge = integrateBird(bird, largeForce, dt, 100, 0.1, defaultBounds);
    const resultSmall = integrateBird(bird, smallForce, dt, 100, 0.1, defaultBounds);

    expect(resultLarge.velocity.x).toBeCloseTo(0.1, 4);
    expect(resultSmall.velocity.x).toBeCloseTo(0.01, 4);
  });

  it("clamps velocity to maxSpeed after force is applied", () => {
    const bird = createBird({ x: 0, y: 0, z: 0 }, { x: 3.99, y: 0, z: 0 });
    const force: Vector3 = { x: 0.05, y: 0, z: 0 };

    const result = integrateBird(bird, force, 1, 4, 0.1, defaultBounds);

    const speed = Math.sqrt(
      result.velocity.x ** 2 + result.velocity.y ** 2 + result.velocity.z ** 2
    );
    expect(speed).toBeLessThanOrEqual(4 + 0.001);
  });
});
