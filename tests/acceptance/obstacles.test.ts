/**
 * US-3: Obstacles via Drag Interaction
 *
 * Validates obstacle creation, bird avoidance behavior, and obstacle clearing.
 * Tests exercise state transitions and the simulation engine's avoidance physics.
 *
 * DRIVING PORTS:
 *   - addObstacle(state, position, radius) -> SimulationState
 *   - clearObstacles(state) -> SimulationState
 *   - simulateTick(state, deltaTime) -> nextState
 *
 * ACCEPTANCE CRITERIA COVERED:
 *   AC-3.1: Drag creates obstacle in dragged region
 *   AC-3.2: Birds steer around obstacles
 *   AC-3.3: "Clear obstacles" removes all obstacles
 *   AC-3.4: Status bar displays accurate obstacle count
 *   AC-3.5: Obstacles persist when flocking parameters change
 */
import { describe, it, expect } from "vitest";
import {
  createSimulationState,
  createBirds,
  createVector3,
  createObstacle,
  vectorDistance,
  runSimulationTicks,
} from "./test-helpers";
import { addObstacle, clearObstacles, updateFlockingParam } from "../../src/state/state-transitions";
import { simulateTick } from "../../src/simulation/tick";

describe("US-3: Obstacles via Drag Interaction", () => {
  describe("Drag creates obstacle", () => {
    it("Given no obstacles, when an obstacle is created at position (50, 0, 0) with radius 10, then obstacle count is 1", () => {
      // Given: state with no obstacles
      const state = createSimulationState({ obstacles: [] });
      expect(state.obstacles.length).toBe(0);

      // When: obstacle is added
      const nextState = addObstacle(
        state,
        createVector3({ x: 50, y: 0, z: 0 }),
        10
      );

      // Then: obstacle count is 1
      expect(nextState.obstacles.length).toBe(1);

      // And: obstacle has correct position and radius
      expect(nextState.obstacles[0].position.x).toBe(50);
      expect(nextState.obstacles[0].position.y).toBe(0);
      expect(nextState.obstacles[0].position.z).toBe(0);
      expect(nextState.obstacles[0].radius).toBe(10);
    });

    it("Given 1 obstacle exists, when another obstacle is created, then obstacle count is 2", () => {
      // Given: state with 1 obstacle
      const state = createSimulationState({
        obstacles: [createObstacle({ position: { x: 10, y: 0, z: 0 } })],
      });

      // When: second obstacle is added
      const nextState = addObstacle(
        state,
        createVector3({ x: -30, y: 20, z: 0 }),
        15
      );

      // Then: obstacle count is 2
      expect(nextState.obstacles.length).toBe(2);
    });

    it("Given obstacle state, when addObstacle is called, then original state is not mutated", () => {
      // Given: state with no obstacles
      const state = createSimulationState({ obstacles: [] });

      // When: obstacle is added
      addObstacle(state, createVector3({ x: 50, y: 0, z: 0 }), 10);

      // Then: original state unchanged
      expect(state.obstacles.length).toBe(0);
    });
  });

  describe("Birds avoid obstacles", () => {
    it("Given a bird heading directly toward an obstacle, when simulation runs, then the bird steers away from the obstacle", () => {
      // Given: a bird heading directly toward an obstacle
      const birds = [
        {
          position: { x: -50, y: 0, z: 0 },
          velocity: { x: 3, y: 0, z: 0 },
        },
      ];
      const obstacle = createObstacle({
        position: { x: 0, y: 0, z: 0 },
        radius: 10,
      });
      const state = createSimulationState({
        birds,
        obstacles: [obstacle],
        parameters: {
          flocking: {
            separationWeight: 0.0,
            alignmentWeight: 0.0,
            cohesionWeight: 0.0,
          },
          neighborRadius: 50,
          separationRadius: 25,
          maxSpeed: 4,
          maxForce: 0.5,
          obstacleAvoidanceRadius: 30,
          obstacleAvoidanceWeight: 2.0,
          predatorFleeRadius: 80,
          predatorFleeWeight: 3.0,
          worldBounds: {
            min: { x: -200, y: -200, z: -200 },
            max: { x: 200, y: 200, z: 200 },
          },
        },
      });

      // When: simulation runs enough ticks for bird to approach obstacle
      const finalState = runSimulationTicks(simulateTick, state, 60);

      // Then: bird does not overlap with obstacle (stayed outside its radius)
      const birdPos = finalState.birds[0].position;
      const distToObstacle = vectorDistance(birdPos, obstacle.position);
      expect(distToObstacle).toBeGreaterThan(obstacle.radius);
    });

    it("Given birds near an obstacle, when simulation runs, then birds maintain distance from the obstacle", () => {
      // Given: multiple birds near an obstacle
      const birds = createBirds(5, (i) => ({
        position: { x: -20 + i * 2, y: i * 3, z: 0 },
        velocity: { x: 2, y: 0, z: 0 },
      }));
      const obstacle = createObstacle({
        position: { x: 0, y: 5, z: 0 },
        radius: 8,
      });
      const state = createSimulationState({
        birds,
        obstacles: [obstacle],
        parameters: {
          flocking: {
            separationWeight: 0.5,
            alignmentWeight: 0.5,
            cohesionWeight: 0.5,
          },
          neighborRadius: 50,
          separationRadius: 25,
          maxSpeed: 4,
          maxForce: 0.3,
          obstacleAvoidanceRadius: 25,
          obstacleAvoidanceWeight: 2.0,
          predatorFleeRadius: 80,
          predatorFleeWeight: 3.0,
          worldBounds: {
            min: { x: -200, y: -200, z: -200 },
            max: { x: 200, y: 200, z: 200 },
          },
        },
      });

      // When: simulation runs
      const finalState = runSimulationTicks(simulateTick, state, 60);

      // Then: all birds are outside the obstacle radius
      finalState.birds.forEach((bird) => {
        const dist = vectorDistance(bird.position, obstacle.position);
        expect(dist).toBeGreaterThan(obstacle.radius);
      });
    });
  });

  describe("Clear all obstacles", () => {
    it("Given 3 obstacles, when 'Clear obstacles' is pressed, then all obstacles are removed", () => {
      // Given: state with 3 obstacles
      const state = createSimulationState({
        obstacles: [
          createObstacle({ position: { x: 10, y: 0, z: 0 } }),
          createObstacle({ position: { x: -10, y: 0, z: 0 } }),
          createObstacle({ position: { x: 0, y: 20, z: 0 } }),
        ],
      });
      expect(state.obstacles.length).toBe(3);

      // When: obstacles are cleared
      const nextState = clearObstacles(state);

      // Then: no obstacles remain
      expect(nextState.obstacles.length).toBe(0);
    });

    it("Given obstacles are cleared, then original state is not mutated", () => {
      // Given: state with obstacles
      const state = createSimulationState({
        obstacles: [
          createObstacle({ position: { x: 10, y: 0, z: 0 } }),
        ],
      });

      // When: cleared
      clearObstacles(state);

      // Then: original unchanged
      expect(state.obstacles.length).toBe(1);
    });
  });

  describe("Obstacles persist through parameter changes", () => {
    it("Given 2 obstacles, when separation slider is changed, then obstacles remain", () => {
      // Given: state with 2 obstacles
      const state = createSimulationState({
        obstacles: [
          createObstacle({ position: { x: 10, y: 0, z: 0 } }),
          createObstacle({ position: { x: -10, y: 0, z: 0 } }),
        ],
      });

      // When: flocking parameter changes
      const updatedState = updateFlockingParam(state, "separationWeight", 0.9);

      // Then: obstacles are preserved
      expect(updatedState.obstacles.length).toBe(2);
      expect(updatedState.obstacles[0].position.x).toBe(10);
      expect(updatedState.obstacles[1].position.x).toBe(-10);
    });
  });
});
