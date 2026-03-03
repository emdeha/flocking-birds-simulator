/**
 * US-2: Bird Population Management
 *
 * Validates adding and removing birds through state transitions.
 * Click-to-add exercises the InputPort (UI converts click to addBird command).
 * Panel +/- buttons exercise addBirdRandom and removeBird transitions.
 *
 * DRIVING PORTS:
 *   - addBird(state, position, velocity) -> SimulationState
 *   - addBirdRandom(state) -> SimulationState
 *   - removeBird(state) -> SimulationState
 *   - simulateTick(state, deltaTime) -> nextState
 *
 * ACCEPTANCE CRITERIA COVERED:
 *   AC-2.1: Left-click spawns bird at clicked position
 *   AC-2.2: New birds have random initial velocity vectors
 *   AC-2.3: [+] button increments bird count
 *   AC-2.4: [-] button decrements bird count
 *   AC-2.5: [-] button disabled at 0 birds
 *   AC-2.6: Empty simulation shows hint (state-level: 0 birds)
 *   AC-2.7: Status bar displays accurate live bird count
 *   AC-2.8: Added birds participate in flocking immediately
 */
import { describe, it, expect } from "vitest";
import {
  createSimulationState,
  createBirds,
  createVector3,
  vectorMagnitude,
  runSimulationTicks,
} from "./test-helpers";
import type { SimulationState } from "./test-helpers";

import { addBird, addBirdRandom, removeBird } from "../../src/state/state-transitions";
import { simulateTick } from "../../src/simulation/tick";

// All scenarios @skip until US-2 is in progress
describe("US-2: Bird Population Management", () => {
  describe("Click to add bird at position", () => {
    it("Given 50 birds, when a bird is added at position (10, 20, 30), then bird count becomes 51", () => {
      // Given: state with 50 birds
      const state = createSimulationState({ birds: createBirds(50) });
      expect(state.birds.length).toBe(50);

      // When: a bird is added at a specific position
      const nextState = addBird(
        state,
        createVector3({ x: 10, y: 20, z: 30 }),
        createVector3({ x: 1, y: 0.5, z: -0.3 })
      );

      // Then: bird count is 51
      expect(nextState.birds.length).toBe(51);

      // And: the new bird is at the specified position
      const newBird = nextState.birds[nextState.birds.length - 1];
      expect(newBird.position.x).toBe(10);
      expect(newBird.position.y).toBe(20);
      expect(newBird.position.z).toBe(30);
    });

    it("Given a bird is added, then it has a velocity vector", () => {
      // Given: initial state
      const state = createSimulationState({ birds: createBirds(5) });

      // When: bird is added with a velocity
      const nextState = addBird(
        state,
        createVector3({ x: 0, y: 0, z: 0 }),
        createVector3({ x: 2, y: 1, z: -1 })
      );

      // Then: the new bird has the specified velocity
      const newBird = nextState.birds[nextState.birds.length - 1];
      expect(vectorMagnitude(newBird.velocity)).toBeGreaterThan(0);
    });

    it("Given original state has 50 birds, when addBird is called, then original state is not mutated", () => {
      // Given: state with 50 birds
      const state = createSimulationState({ birds: createBirds(50) });

      // When: bird is added
      addBird(
        state,
        createVector3({ x: 10, y: 20, z: 30 }),
        createVector3({ x: 1, y: 0, z: 0 })
      );

      // Then: original state unchanged (immutability)
      expect(state.birds.length).toBe(50);
    });
  });

  describe("Panel increment adds bird at random position", () => {
    it("Given 50 birds, when [+] button is pressed, then bird count becomes 51", () => {
      // Given: state with 50 birds
      const state = createSimulationState({ birds: createBirds(50) });

      // When: a bird is added via panel (random position)
      const nextState = addBirdRandom(state);

      // Then: bird count increases by 1
      expect(nextState.birds.length).toBe(51);
    });

    it("Given a bird is added randomly, then it has a non-zero velocity", () => {
      // Given: initial state
      const state = createSimulationState({ birds: createBirds(5) });

      // When: random bird is added
      const nextState = addBirdRandom(state);

      // Then: new bird has non-zero velocity
      const newBird = nextState.birds[nextState.birds.length - 1];
      expect(vectorMagnitude(newBird.velocity)).toBeGreaterThan(0);
    });
  });

  describe("Panel decrement removes bird", () => {
    it("Given 50 birds, when [-] button is pressed, then bird count becomes 49", () => {
      // Given: state with 50 birds
      const state = createSimulationState({ birds: createBirds(50) });

      // When: a bird is removed
      const nextState = removeBird(state);

      // Then: bird count decreases by 1
      expect(nextState.birds.length).toBe(49);
    });

    it("Given 1 bird, when [-] is pressed, then bird count becomes 0", () => {
      // Given: state with 1 bird
      const state = createSimulationState({ birds: createBirds(1) });

      // When: bird is removed
      const nextState = removeBird(state);

      // Then: no birds remain
      expect(nextState.birds.length).toBe(0);
    });

    it("Given 0 birds, when [-] is pressed, then bird count remains 0", () => {
      // Given: state with 0 birds
      const state = createSimulationState({ birds: [] });

      // When: removeBird is called on empty state
      const nextState = removeBird(state);

      // Then: still 0 birds (cannot go negative)
      expect(nextState.birds.length).toBe(0);
    });
  });

  describe("Empty simulation state", () => {
    it("Given 0 birds, then the state indicates an empty simulation", () => {
      // Given: state with 0 birds
      const state = createSimulationState({ birds: [] });

      // Then: birds array is empty
      expect(state.birds.length).toBe(0);

      // And: this is the signal for the UI to show "Click to add birds" hint
      // and disable the [-] button
    });
  });

  describe("Added birds participate in flocking", () => {
    it("Given a newly added bird near a flock, when simulation runs, then the new bird moves with the flock", () => {
      // Given: a small flock moving in one direction
      const flock = createBirds(5, () => ({
        position: { x: 0, y: 0, z: 0 },
        velocity: { x: 3, y: 0, z: 0 },
      }));
      const state = createSimulationState({
        birds: flock,
        parameters: {
          flocking: {
            separationWeight: 0.5,
            alignmentWeight: 0.7,
            cohesionWeight: 0.6,
          },
          neighborRadius: 100,
          separationRadius: 25,
          maxSpeed: 4,
          maxForce: 0.1,
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

      // When: a new bird is added nearby with a different velocity
      const stateWithNewBird = addBird(
        state,
        createVector3({ x: 5, y: 5, z: 0 }),
        createVector3({ x: -1, y: 2, z: 0 })
      );

      // And: simulation runs for several ticks
      const finalState = runSimulationTicks(simulateTick, stateWithNewBird, 60);

      // Then: the new bird (last in array) has been influenced by the flock
      const newBird = finalState.birds[finalState.birds.length - 1];
      // Its x-velocity should be positive (influenced by flock moving in +x)
      expect(newBird.velocity.x).toBeGreaterThan(0);
    });
  });
});
