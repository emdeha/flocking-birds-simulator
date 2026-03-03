import { describe, it, expect } from "vitest";
import { computePredatorFlee } from "./flee";
import type { Bird, Predator } from "../types/simulation-types";
import { vectorMagnitude } from "../types/vector";

const createBird = (overrides?: Partial<Bird>): Bird => ({
  position: { x: 0, y: 0, z: 0, ...overrides?.position },
  velocity: { x: 1, y: 0, z: 0, ...overrides?.velocity },
});

const createPredator = (overrides?: Partial<Predator>): Predator => ({
  position: { x: 0, y: 0, z: 0, ...overrides?.position },
});

describe("computePredatorFlee", () => {
  it("produces a repulsive force pushing the bird away from a predator within flee radius", () => {
    const bird = createBird({ position: { x: 20, y: 0, z: 0 } });
    const predator = createPredator({ position: { x: 0, y: 0, z: 0 } });

    const force = computePredatorFlee(bird, [predator], 80, 3.0);

    expect(force.x).toBeGreaterThan(0);
    expect(vectorMagnitude(force)).toBeGreaterThan(0);
  });

  it("returns zero force when bird is outside the flee radius of all predators", () => {
    const bird = createBird({ position: { x: 200, y: 0, z: 0 } });
    const predator = createPredator({ position: { x: 0, y: 0, z: 0 } });

    const force = computePredatorFlee(bird, [predator], 80, 3.0);

    expect(force.x).toBe(0);
    expect(force.y).toBe(0);
    expect(force.z).toBe(0);
  });

  it("accumulates flee forces from multiple predators", () => {
    const bird = createBird({ position: { x: 0, y: 0, z: 0 } });
    const singlePredator = createPredator({ position: { x: 30, y: 0, z: 0 } });
    const twoPredators = [
      createPredator({ position: { x: 30, y: 0, z: 0 } }),
      createPredator({ position: { x: -30, y: 0, z: 0 } }),
    ];

    const singleForce = computePredatorFlee(bird, [singlePredator], 80, 3.0);
    const doubleForce = computePredatorFlee(bird, twoPredators, 80, 3.0);

    expect(vectorMagnitude(singleForce)).toBeGreaterThan(0);
    expect(singleForce.x).toBeLessThan(0);
    expect(doubleForce.x).toBeCloseTo(0, 5);
    expect(vectorMagnitude(doubleForce)).toBeLessThan(vectorMagnitude(singleForce));
  });

  it("returns zero force when there are no predators", () => {
    const bird = createBird({ position: { x: 0, y: 0, z: 0 } });

    const force = computePredatorFlee(bird, [], 80, 3.0);

    expect(force.x).toBe(0);
    expect(force.y).toBe(0);
    expect(force.z).toBe(0);
  });
});
