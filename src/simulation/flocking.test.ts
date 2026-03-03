import { describe, it, expect } from "vitest";
import {
  computeSeparation,
  computeAlignment,
  computeCohesion,
} from "./flocking";
import type { Bird } from "../types/simulation-types";
import type { Vector3 } from "../types/vector";
import { vectorMagnitude } from "../types/vector";

const createBird = (
  position: Vector3,
  velocity: Vector3 = { x: 0, y: 0, z: 0 }
): Bird => ({
  position,
  velocity,
});

describe("Flocking rules", () => {
  describe("Separation", () => {
    it("produces a non-zero force steering away from nearby birds", () => {
      const bird = createBird({ x: 0, y: 0, z: 0 });
      const neighbors = [
        createBird({ x: 3, y: 0, z: 0 }),
        createBird({ x: -3, y: 0, z: 0 }),
        createBird({ x: 0, y: 3, z: 0 }),
      ];

      const force = computeSeparation(bird, neighbors, 25);

      expect(vectorMagnitude(force)).toBeGreaterThan(0);
      expect(force.y).toBeLessThan(0);
    });
  });

  describe("Alignment", () => {
    it("produces a force toward the average velocity direction of neighbors", () => {
      const bird = createBird({ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 });
      const neighbors = [
        createBird({ x: 5, y: 0, z: 0 }, { x: 0, y: 1, z: 0 }),
        createBird({ x: -5, y: 0, z: 0 }, { x: 0, y: 1, z: 0 }),
      ];

      const force = computeAlignment(bird, neighbors);

      expect(force.y).toBeGreaterThan(0);
    });
  });

  describe("Cohesion", () => {
    it("produces a force toward the average position of neighbors", () => {
      const bird = createBird({ x: 0, y: 0, z: 0 });
      const neighbors = [
        createBird({ x: 10, y: 10, z: 0 }),
        createBird({ x: 20, y: 10, z: 0 }),
      ];

      const force = computeCohesion(bird, neighbors);

      expect(force.x).toBeGreaterThan(0);
      expect(force.y).toBeGreaterThan(0);
    });
  });
});
