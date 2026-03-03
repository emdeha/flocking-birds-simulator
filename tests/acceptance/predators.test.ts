/**
 * US-4: Predator Entities
 *
 * Validates predator creation and flee behavior. Birds near predators
 * flee rapidly; birds far away continue normal flocking. Flee force
 * is stronger/faster than obstacle avoidance.
 *
 * DRIVING PORTS:
 *   - addPredator(state, position) -> SimulationState
 *   - simulateTick(state, deltaTime) -> nextState
 *
 * ACCEPTANCE CRITERIA COVERED:
 *   AC-4.1: "Add Predator" spawns a predator entity
 *   AC-4.2: Birds within flee range move away from predators
 *   AC-4.3: Birds outside flee range are unaffected
 *   AC-4.4: Flee behavior is distinct from obstacle avoidance
 *   AC-4.5: Status bar displays predator count
 *   AC-4.6: Multiple predators produce cumulative flee effects
 */
import { describe, it, expect } from "vitest";
import {
  createSimulationState,
  createBirds,
  createVector3,
  createPredator,
  createObstacle,
  vectorDistance,
  runSimulationTicks,
} from "./test-helpers";
import type { SimulationState } from "./test-helpers";

// Placeholder imports -- crafter replaces with real implementations
// import { addPredator } from "../../src/state/state-transitions";
// import { simulateTick } from "../../src/simulation/tick";
const addPredator = (
  state: SimulationState,
  _position: { x: number; y: number; z: number }
): SimulationState => state;
const simulateTick = (state: SimulationState, _deltaTime: number): SimulationState => state;

// All scenarios @skip until US-4 is in progress
describe("US-4: Predator Entities", () => {
  describe.skip("Add predator via side panel", () => {
    it("Given no predators, when 'Add Predator' is pressed, then predator count becomes 1", () => {
      // Given: state with no predators
      const state = createSimulationState({ predators: [] });
      expect(state.predators.length).toBe(0);

      // When: predator is added
      const nextState = addPredator(state, createVector3({ x: 0, y: 0, z: 0 }));

      // Then: predator count is 1
      expect(nextState.predators.length).toBe(1);
    });

    it("Given 1 predator, when another is added, then predator count becomes 2", () => {
      // Given: state with 1 predator
      const state = createSimulationState({
        predators: [createPredator({ position: { x: 10, y: 0, z: 0 } })],
      });

      // When: second predator added
      const nextState = addPredator(state, createVector3({ x: -50, y: 0, z: 0 }));

      // Then: predator count is 2
      expect(nextState.predators.length).toBe(2);
    });

    it("Given state, when addPredator is called, then original state is not mutated", () => {
      // Given: state with no predators
      const state = createSimulationState({ predators: [] });

      // When: predator added
      addPredator(state, createVector3({ x: 0, y: 0, z: 0 }));

      // Then: original unchanged
      expect(state.predators.length).toBe(0);
    });
  });

  describe.skip("Birds flee from predator", () => {
    it("Given a bird near a predator, when simulation runs, then the bird moves away from the predator", () => {
      // Given: a bird near a predator
      const birds = [{
        position: { x: 10, y: 0, z: 0 },
        velocity: { x: 0, y: 0, z: 0 },
      }];
      const predator = createPredator({ position: { x: 0, y: 0, z: 0 } });
      const state = createSimulationState({
        birds,
        predators: [predator],
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
          obstacleAvoidanceWeight: 1.5,
          predatorFleeRadius: 80,
          predatorFleeWeight: 3.0,
          worldBounds: {
            min: { x: -200, y: -200, z: -200 },
            max: { x: 200, y: 200, z: 200 },
          },
        },
      });
      const initialDistance = vectorDistance(
        state.birds[0].position,
        predator.position
      );

      // When: simulation runs
      const finalState = runSimulationTicks(simulateTick, state, 30);

      // Then: bird has moved away from predator
      const finalDistance = vectorDistance(
        finalState.birds[0].position,
        predator.position
      );
      expect(finalDistance).toBeGreaterThan(initialDistance);
    });

    it("Given a bird far from a predator (outside flee range), when simulation runs, then the bird is unaffected by the predator", () => {
      // Given: a bird far outside predator flee radius (80)
      const birds = [{
        position: { x: 200, y: 0, z: 0 },
        velocity: { x: 0, y: 0, z: 0 },
      }];
      const predator = createPredator({ position: { x: 0, y: 0, z: 0 } });
      const stateWithPredator = createSimulationState({
        birds,
        predators: [predator],
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
          obstacleAvoidanceWeight: 1.5,
          predatorFleeRadius: 80,
          predatorFleeWeight: 3.0,
          worldBounds: {
            min: { x: -500, y: -500, z: -500 },
            max: { x: 500, y: 500, z: 500 },
          },
        },
      });
      const stateWithoutPredator = createSimulationState({
        ...stateWithPredator,
        predators: [],
      });

      // When: simulation runs both scenarios for same ticks
      const finalWithPredator = runSimulationTicks(simulateTick, stateWithPredator, 30);
      const finalWithout = runSimulationTicks(simulateTick, stateWithoutPredator, 30);

      // Then: bird position is the same whether predator exists or not
      // (because it is outside flee radius)
      expect(finalWithPredator.birds[0].position.x).toBeCloseTo(
        finalWithout.birds[0].position.x,
        1
      );
      expect(finalWithPredator.birds[0].position.y).toBeCloseTo(
        finalWithout.birds[0].position.y,
        1
      );
    });
  });

  describe.skip("Flee is distinct from obstacle avoidance", () => {
    it("Given a bird near a predator vs near an obstacle at same distance, then flee produces a larger displacement than avoidance", () => {
      // Given: a bird near a predator at distance 15
      const birdNearPredator = [{
        position: { x: 15, y: 0, z: 0 },
        velocity: { x: 0, y: 0, z: 0 },
      }];
      const predator = createPredator({ position: { x: 0, y: 0, z: 0 } });
      const stateWithPredator = createSimulationState({
        birds: birdNearPredator,
        predators: [predator],
        obstacles: [],
        parameters: {
          flocking: {
            separationWeight: 0.0,
            alignmentWeight: 0.0,
            cohesionWeight: 0.0,
          },
          neighborRadius: 50,
          separationRadius: 25,
          maxSpeed: 10,
          maxForce: 1.0,
          obstacleAvoidanceRadius: 30,
          obstacleAvoidanceWeight: 1.5,
          predatorFleeRadius: 80,
          predatorFleeWeight: 3.0,
          worldBounds: {
            min: { x: -200, y: -200, z: -200 },
            max: { x: 200, y: 200, z: 200 },
          },
        },
      });

      // And: a bird near an obstacle at the same distance
      const birdNearObstacle = [{
        position: { x: 15, y: 0, z: 0 },
        velocity: { x: 0, y: 0, z: 0 },
      }];
      const obstacle = createObstacle({ position: { x: 0, y: 0, z: 0 }, radius: 5 });
      const stateWithObstacle = createSimulationState({
        birds: birdNearObstacle,
        predators: [],
        obstacles: [obstacle],
        parameters: stateWithPredator.parameters,
      });

      // When: simulation runs same number of ticks for both
      const finalPredator = runSimulationTicks(simulateTick, stateWithPredator, 10);
      const finalObstacle = runSimulationTicks(simulateTick, stateWithObstacle, 10);

      // Then: bird fleeing predator has moved further than bird avoiding obstacle
      const fleeDist = vectorDistance(
        finalPredator.birds[0].position,
        { x: 15, y: 0, z: 0 }
      );
      const avoidDist = vectorDistance(
        finalObstacle.birds[0].position,
        { x: 15, y: 0, z: 0 }
      );
      expect(fleeDist).toBeGreaterThan(avoidDist);
    });
  });

  describe.skip("Multiple predators fragment the flock", () => {
    it("Given 3 predators at different positions, when simulation runs with nearby birds, then birds move away from all predators", () => {
      // Given: 3 predators spread across the scene
      const predators = [
        createPredator({ position: { x: -50, y: 0, z: 0 } }),
        createPredator({ position: { x: 50, y: 0, z: 0 } }),
        createPredator({ position: { x: 0, y: 50, z: 0 } }),
      ];
      // Birds placed near each predator
      const birds = [
        { position: { x: -40, y: 0, z: 0 }, velocity: { x: 0, y: 0, z: 0 } },
        { position: { x: 40, y: 0, z: 0 }, velocity: { x: 0, y: 0, z: 0 } },
        { position: { x: 0, y: 40, z: 0 }, velocity: { x: 0, y: 0, z: 0 } },
      ];
      const state = createSimulationState({
        birds,
        predators,
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
          obstacleAvoidanceWeight: 1.5,
          predatorFleeRadius: 80,
          predatorFleeWeight: 3.0,
          worldBounds: {
            min: { x: -200, y: -200, z: -200 },
            max: { x: 200, y: 200, z: 200 },
          },
        },
      });

      // When: simulation runs
      const finalState = runSimulationTicks(simulateTick, state, 30);

      // Then: each bird has moved further from its nearest predator
      finalState.birds.forEach((bird, i) => {
        const nearestPredator = predators[i];
        const initialDist = vectorDistance(birds[i].position, nearestPredator.position);
        const finalDist = vectorDistance(bird.position, nearestPredator.position);
        expect(finalDist).toBeGreaterThan(initialDist);
      });
    });
  });
});
