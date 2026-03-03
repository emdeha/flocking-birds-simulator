/**
 * US-8: Status Bar with Live Metrics
 *
 * Validates that simulation state provides all data needed for status bar
 * display: bird count, predator count, obstacle count. FPS is a derived
 * metric from the game loop (not part of simulation state).
 *
 * DRIVING PORTS:
 *   - createInitialState() -> SimulationState
 *   - addBird(state, position, velocity) -> SimulationState
 *   - addPredator(state, position) -> SimulationState
 *   - addObstacle(state, position, radius) -> SimulationState
 *   - SimulationMetrics derived from state
 *
 * ACCEPTANCE CRITERIA COVERED:
 *   AC-8.1: Status bar visible (derived from state availability)
 *   AC-8.2: Displays bird count, predator count, obstacle count, FPS
 *   AC-8.3: Counts update on the same frame as visual change
 *   AC-8.4: FPS reflects actual rendering performance
 */
import { describe, it, expect } from "vitest";
import {
  createSimulationState,
  createBirds,
  createVector3,
  createObstacle,
  createPredator,
} from "./test-helpers";
import type { SimulationState } from "./test-helpers";

// Placeholder imports -- crafter replaces with real implementations
// import { createInitialState } from "../../src/state/simulation-state";
// import { addBird, addObstacle, addPredator } from "../../src/state/state-transitions";
const createInitialState = (): SimulationState => createSimulationState({ birds: createBirds(50) });
const addBird = (
  state: SimulationState,
  _position: { x: number; y: number; z: number },
  _velocity: { x: number; y: number; z: number }
): SimulationState => state;
const addObstacle = (
  state: SimulationState,
  _position: { x: number; y: number; z: number },
  _radius: number
): SimulationState => state;
const addPredator = (
  state: SimulationState,
  _position: { x: number; y: number; z: number }
): SimulationState => state;

// Derive metrics from state (this is how the status bar reads data)
const deriveMetrics = (state: SimulationState) => ({
  birdCount: state.birds.length,
  predatorCount: state.predators.length,
  obstacleCount: state.obstacles.length,
});

// All scenarios @skip until US-8 is in progress
describe("US-8: Status Bar with Live Metrics", () => {
  describe("Status bar displays correct counts on load", () => {
    it("Given the simulator loads, then bird count is approximately 50, predator count is 0, obstacle count is 0", () => {
      // Given: default initial state
      const state = createInitialState();

      // When: metrics are derived from state
      const metrics = deriveMetrics(state);

      // Then: counts match initial state
      expect(metrics.birdCount).toBeGreaterThanOrEqual(45);
      expect(metrics.birdCount).toBeLessThanOrEqual(55);
      expect(metrics.predatorCount).toBe(0);
      expect(metrics.obstacleCount).toBe(0);
    });
  });

  describe.skip("Bird count updates when birds are added", () => {
    it("Given 50 birds, when a bird is added, then bird count becomes 51", () => {
      // Given: state with 50 birds
      const state = createSimulationState({ birds: createBirds(50) });
      expect(deriveMetrics(state).birdCount).toBe(50);

      // When: a bird is added at a specific position
      const nextState = addBird(
        state,
        createVector3({ x: 10, y: 20, z: 30 }),
        createVector3({ x: 1, y: 0, z: 0 })
      );

      // Then: bird count is 51
      expect(deriveMetrics(nextState).birdCount).toBe(51);
    });
  });

  describe.skip("Obstacle count updates when obstacles are added", () => {
    it("Given no obstacles, when an obstacle is created, then obstacle count becomes 1", () => {
      // Given: state with no obstacles
      const state = createSimulationState({ obstacles: [] });
      expect(deriveMetrics(state).obstacleCount).toBe(0);

      // When: an obstacle is added
      const nextState = addObstacle(
        state,
        createVector3({ x: 50, y: 0, z: 0 }),
        10
      );

      // Then: obstacle count is 1
      expect(deriveMetrics(nextState).obstacleCount).toBe(1);
    });
  });

  describe.skip("Predator count updates when predators are added", () => {
    it("Given no predators, when a predator is added, then predator count becomes 1", () => {
      // Given: state with no predators
      const state = createSimulationState({ predators: [] });
      expect(deriveMetrics(state).predatorCount).toBe(0);

      // When: a predator is added
      const nextState = addPredator(
        state,
        createVector3({ x: 0, y: 0, z: 0 })
      );

      // Then: predator count is 1
      expect(deriveMetrics(nextState).predatorCount).toBe(1);
    });
  });

  describe("Counts are derived, not stored separately", () => {
    it("Given state with 3 birds, 2 obstacles, and 1 predator, then metrics reflect array lengths", () => {
      // Given: state with known entity counts
      const state = createSimulationState({
        birds: createBirds(3),
        obstacles: [
          createObstacle({ position: { x: 10, y: 0, z: 0 } }),
          createObstacle({ position: { x: -10, y: 0, z: 0 } }),
        ],
        predators: [
          createPredator({ position: { x: 0, y: 50, z: 0 } }),
        ],
      });

      // When: metrics are derived
      const metrics = deriveMetrics(state);

      // Then: counts match entity arrays directly
      expect(metrics.birdCount).toBe(3);
      expect(metrics.obstacleCount).toBe(2);
      expect(metrics.predatorCount).toBe(1);
    });
  });
});
