import { describe, it, expect } from "vitest";
import { computeObstacleAvoidance } from "./avoidance";
import type { Bird, Obstacle } from "../types/simulation-types";
import { vectorMagnitude } from "../types/vector";

const createBird = (overrides?: Partial<Bird>): Bird => ({
  position: { x: 0, y: 0, z: 0, ...overrides?.position },
  velocity: { x: 1, y: 0, z: 0, ...overrides?.velocity },
});

const createObstacle = (overrides?: Partial<Obstacle>): Obstacle => ({
  position: { x: 0, y: 0, z: 0, ...overrides?.position },
  radius: overrides?.radius ?? 5,
});

describe("computeObstacleAvoidance", () => {
  it("produces a repulsive force pushing the bird away from an obstacle within avoidance radius", () => {
    const bird = createBird({ position: { x: 10, y: 0, z: 0 } });
    const obstacle = createObstacle({
      position: { x: 20, y: 0, z: 0 },
      radius: 5,
    });

    const force = computeObstacleAvoidance(bird, [obstacle], 15, 1.0);

    expect(force.x).toBeLessThan(0);
    expect(vectorMagnitude(force)).toBeGreaterThan(0);
  });

  it("returns zero force when bird is outside the avoidance radius of all obstacles", () => {
    const bird = createBird({ position: { x: 0, y: 0, z: 0 } });
    const obstacle = createObstacle({
      position: { x: 100, y: 0, z: 0 },
      radius: 5,
    });

    const force = computeObstacleAvoidance(bird, [obstacle], 20, 1.0);

    expect(force.x).toBe(0);
    expect(force.y).toBe(0);
    expect(force.z).toBe(0);
  });

  it("produces stronger force when bird is closer to obstacle", () => {
    const closeBird = createBird({ position: { x: 12, y: 0, z: 0 } });
    const farBird = createBird({ position: { x: 5, y: 0, z: 0 } });
    const obstacle = createObstacle({
      position: { x: 20, y: 0, z: 0 },
      radius: 5,
    });

    const closeForce = computeObstacleAvoidance(closeBird, [obstacle], 15, 1.0);
    const farForce = computeObstacleAvoidance(farBird, [obstacle], 15, 1.0);

    expect(vectorMagnitude(closeForce)).toBeGreaterThan(vectorMagnitude(farForce));
  });

  it("returns zero force when there are no obstacles", () => {
    const bird = createBird({ position: { x: 0, y: 0, z: 0 } });

    const force = computeObstacleAvoidance(bird, [], 20, 1.0);

    expect(force.x).toBe(0);
    expect(force.y).toBe(0);
    expect(force.z).toBe(0);
  });
});
