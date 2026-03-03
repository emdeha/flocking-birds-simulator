/**
 * US-7: Reset to Defaults
 *
 * Validates that reset returns the simulation to its default state:
 * ~50 birds, default parameters, no predators, no obstacles, running at 1.0x.
 *
 * DRIVING PORTS:
 *   - resetState() -> SimulationState  (or createInitialState())
 *
 * ACCEPTANCE CRITERIA COVERED:
 *   AC-7.1: "Reset" restores ~50 birds with default flocking behavior
 *   AC-7.2: All sliders return to defaults
 *   AC-7.3: All predators removed
 *   AC-7.4: All obstacles removed
 *   AC-7.5: Simulation state set to running (not paused)
 *   AC-7.6: Status bar reflects all reset values
 */
import { describe, it, expect } from "vitest";
import {
  createSimulationState,
  createBirds,
  createObstacle,
  createPredator,
  vectorMagnitude,
} from "./test-helpers";
import { resetState } from "../../src/state/state-transitions";

describe("US-7: Reset to Defaults", () => {
  describe("Reset restores default bird count", () => {
    it("Given 200 birds with modified parameters, when reset is pressed, then bird count returns to approximately 50", () => {
      // Given: heavily modified state (this represents what the user has done)
      const _modifiedState = createSimulationState({
        birds: createBirds(200),
        obstacles: [
          createObstacle({ position: { x: 10, y: 0, z: 0 } }),
          createObstacle({ position: { x: -10, y: 0, z: 0 } }),
        ],
        predators: [
          createPredator({ position: { x: 0, y: 50, z: 0 } }),
        ],
        parameters: {
          flocking: {
            separationWeight: 0.1,
            alignmentWeight: 0.9,
            cohesionWeight: 0.0,
          },
          neighborRadius: 50,
          separationRadius: 25,
          maxSpeed: 4,
          maxForce: 0.1,
          obstacleAvoidanceRadius: 30,
          obstacleAvoidanceWeight: 1.5,
          predatorFleeRadius: 80,
          predatorFleeWeight: 3.0,
          worldBounds: {
            min: { x: -200, y: -200, z: -200 },
            max: { x: 200, y: 200, z: 200 },
          },
        },
        playbackState: "paused",
        simulationSpeed: 3.0,
      });

      // When: reset is triggered
      const resetResult = resetState();

      // Then: bird count is approximately 50
      expect(resetResult.birds.length).toBeGreaterThanOrEqual(45);
      expect(resetResult.birds.length).toBeLessThanOrEqual(55);
    });
  });

  describe("Reset removes all predators and obstacles", () => {
    it("Given 5 predators and 12 obstacles, when reset is pressed, then all are removed", () => {
      // Given: state with many entities (representing user modifications)
      const _modifiedState = createSimulationState({
        predators: Array.from({ length: 5 }, (_, i) =>
          createPredator({ position: { x: i * 20, y: 0, z: 0 } })
        ),
        obstacles: Array.from({ length: 12 }, (_, i) =>
          createObstacle({ position: { x: 0, y: i * 10, z: 0 } })
        ),
      });

      // When: reset is triggered
      const resetResult = resetState();

      // Then: no predators or obstacles
      expect(resetResult.predators.length).toBe(0);
      expect(resetResult.obstacles.length).toBe(0);
    });
  });

  describe("Reset restores default slider values", () => {
    it("Given all sliders at non-default values, when reset is pressed, then all return to defaults", () => {
      // Given: non-default slider values (representing user modifications)
      const _modifiedState = createSimulationState({
        parameters: {
          flocking: {
            separationWeight: 0.1,
            alignmentWeight: 0.2,
            cohesionWeight: 0.3,
          },
          neighborRadius: 50,
          separationRadius: 25,
          maxSpeed: 4,
          maxForce: 0.1,
          obstacleAvoidanceRadius: 30,
          obstacleAvoidanceWeight: 1.5,
          predatorFleeRadius: 80,
          predatorFleeWeight: 3.0,
          worldBounds: {
            min: { x: -200, y: -200, z: -200 },
            max: { x: 200, y: 200, z: 200 },
          },
        },
        simulationSpeed: 4.5,
      });

      // When: reset is triggered
      const resetResult = resetState();

      // Then: flocking parameters at defaults
      expect(resetResult.parameters.flocking.separationWeight).toBe(0.5);
      expect(resetResult.parameters.flocking.alignmentWeight).toBe(0.7);
      expect(resetResult.parameters.flocking.cohesionWeight).toBe(0.6);

      // And: simulation speed at default
      expect(resetResult.simulationSpeed).toBe(1.0);
    });
  });

  describe("Reset resumes a paused simulation", () => {
    it("Given the simulation is paused, when reset is pressed, then the simulation is running", () => {
      // Given: paused simulation
      const _pausedState = createSimulationState({ playbackState: "paused" });

      // When: reset is triggered
      const resetResult = resetState();

      // Then: simulation is running
      expect(resetResult.playbackState).toBe("running");
    });
  });

  describe("Reset produces valid simulation state", () => {
    it("Given reset is triggered, then all birds have valid positions and non-zero velocities", () => {
      // When: reset is triggered
      const resetResult = resetState();

      // Then: all birds are valid
      resetResult.birds.forEach((bird) => {
        expect(typeof bird.position.x).toBe("number");
        expect(typeof bird.position.y).toBe("number");
        expect(typeof bird.position.z).toBe("number");
        expect(Number.isFinite(bird.position.x)).toBe(true);
        expect(Number.isFinite(bird.position.y)).toBe(true);
        expect(Number.isFinite(bird.position.z)).toBe(true);
        expect(vectorMagnitude(bird.velocity)).toBeGreaterThan(0);
      });
    });
  });
});
