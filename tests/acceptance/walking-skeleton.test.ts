/**
 * US-0: Walking Skeleton -- Minimal Flocking Simulation
 *
 * Walking skeleton acceptance tests. These are the FIRST tests to be enabled.
 * They validate that the core architecture works end-to-end:
 *   - Simulation engine computes flocking behavior
 *   - State transitions produce correct immutable state
 *   - A user can observe birds flocking and adjust separation
 *
 * DRIVING PORTS:
 *   - simulateTick(state, deltaTime) -> nextState
 *   - createInitialState() -> SimulationState
 *   - updateFlockingParam(state, paramName, value) -> SimulationState
 *
 * ACCEPTANCE CRITERIA COVERED:
 *   AC-0.1: 3D viewport renders on page load (validated by state creation)
 *   AC-0.2: Approximately 10 birds visible (walking skeleton uses ~10)
 *   AC-0.3: Each bird has a velocity vector
 *   AC-0.4: Birds exhibit flocking behavior
 *   AC-0.5: Separation slider is adjustable
 *   AC-0.6: Changing separation modifies bird spacing in real-time
 *   AC-0.7: Interactive frame rate (deterministic tick completes)
 */
import { describe, it, expect } from "vitest";
import {
  createBirds,
  createSimulationState,
  vectorMagnitude,
  averagePairwiseDistance,
  runSimulationTicks,
} from "./test-helpers";
import type { SimulationState } from "./test-helpers";

// These imports will resolve once production code is implemented.
// For now they serve as the contract the crafter must fulfill.
//
// import { simulateTick } from "../../src/simulation/tick";
// import { createInitialState } from "../../src/state/simulation-state";
// import { updateFlockingParam } from "../../src/state/state-transitions";

// Placeholder: the crafter replaces these with real imports.
// The tests define the contract; production code fulfills it.
const simulateTick = (state: SimulationState, _deltaTime: number): SimulationState => state;
const createInitialState = (): SimulationState => createSimulationState({ birds: createBirds(10) });
const updateFlockingParam = (
  state: SimulationState,
  _param: string,
  _value: number
): SimulationState => state;

// ---------------------------------------------------------------------------
// WALKING SKELETON SCENARIOS -- These are ACTIVE (no skip)
// ---------------------------------------------------------------------------

describe("US-0: Walking Skeleton -- Minimal Flocking Simulation", () => {
  describe("@walking_skeleton: Birds flock on page load", () => {
    it("Given the simulator initializes, then approximately 10 birds are present with velocity vectors", () => {
      // Given: the simulation creates its initial state
      const state = createInitialState();

      // Then: approximately 10 birds are present
      expect(state.birds.length).toBeGreaterThanOrEqual(8);
      expect(state.birds.length).toBeLessThanOrEqual(12);

      // And: each bird has a position and velocity vector
      state.birds.forEach((bird) => {
        expect(bird.position).toBeDefined();
        expect(bird.velocity).toBeDefined();
        expect(typeof bird.position.x).toBe("number");
        expect(typeof bird.position.y).toBe("number");
        expect(typeof bird.position.z).toBe("number");
      });

      // And: each bird has a non-zero velocity (it is moving)
      state.birds.forEach((bird) => {
        const speed = vectorMagnitude(bird.velocity);
        expect(speed).toBeGreaterThan(0);
      });
    });

    it("Given the simulator initializes, then the simulation is running at 1.0x speed", () => {
      // Given: default initial state
      const state = createInitialState();

      // Then: playback is running
      expect(state.playbackState).toBe("running");

      // And: speed is 1.0x
      expect(state.simulationSpeed).toBe(1.0);
    });

    it("Given the simulator initializes, then default flocking parameters are set", () => {
      // Given: default initial state
      const state = createInitialState();

      // Then: flocking parameters are at documented defaults
      expect(state.parameters.flocking.separationWeight).toBe(0.5);
      expect(state.parameters.flocking.alignmentWeight).toBe(0.7);
      expect(state.parameters.flocking.cohesionWeight).toBe(0.6);
    });
  });

  describe("@walking_skeleton: Birds exhibit flocking behavior over time", () => {
    it("Given 10 birds with varied positions, when simulation runs for several ticks, then birds change position", () => {
      // Given: a state with birds at varied positions
      const initialState = createSimulationState({
        birds: createBirds(10),
      });
      const initialPositions = initialState.birds.map((b) => ({ ...b.position }));

      // When: simulation runs for 60 ticks (1 second at 60fps)
      const nextState = runSimulationTicks(simulateTick, initialState, 60);

      // Then: at least some birds have moved from their initial positions
      const movedBirds = nextState.birds.filter((bird, i) => {
        const initial = initialPositions[i];
        return (
          bird.position.x !== initial.x ||
          bird.position.y !== initial.y ||
          bird.position.z !== initial.z
        );
      });
      expect(movedBirds.length).toBeGreaterThan(0);
    });

    it("Given birds spread far apart with high cohesion, when simulation runs, then average distance decreases", () => {
      // Given: birds spread far apart with maximum cohesion
      const spreadBirds = createBirds(10, (i) => ({
        position: { x: i * 100, y: i * 100, z: 0 },
        velocity: { x: 0, y: 0, z: 0 },
      }));
      const initialState = createSimulationState({
        birds: spreadBirds,
        parameters: {
          flocking: {
            separationWeight: 0.0,
            alignmentWeight: 0.0,
            cohesionWeight: 1.0,
          },
          neighborRadius: 500,
          separationRadius: 25,
          maxSpeed: 4,
          maxForce: 0.1,
          obstacleAvoidanceRadius: 30,
          obstacleAvoidanceWeight: 1.5,
          predatorFleeRadius: 80,
          predatorFleeWeight: 3.0,
          worldBounds: {
            min: { x: -1000, y: -1000, z: -1000 },
            max: { x: 1000, y: 1000, z: 1000 },
          },
        },
      });
      const initialAvgDistance = averagePairwiseDistance(initialState.birds);

      // When: simulation runs for many ticks
      const nextState = runSimulationTicks(simulateTick, initialState, 300);

      // Then: average pairwise distance has decreased (birds are clustering)
      const finalAvgDistance = averagePairwiseDistance(nextState.birds);
      expect(finalAvgDistance).toBeLessThan(initialAvgDistance);
    });

    it("Given birds close together with high separation, when simulation runs, then average distance increases", () => {
      // Given: birds clustered together with maximum separation
      const clusteredBirds = createBirds(10, (i) => ({
        position: { x: i * 2, y: i * 2, z: 0 },
        velocity: { x: 1, y: 0, z: 0 },
      }));
      const initialState = createSimulationState({
        birds: clusteredBirds,
        parameters: {
          flocking: {
            separationWeight: 1.0,
            alignmentWeight: 0.0,
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
            min: { x: -500, y: -500, z: -500 },
            max: { x: 500, y: 500, z: 500 },
          },
        },
      });
      const initialAvgDistance = averagePairwiseDistance(initialState.birds);

      // When: simulation runs for several ticks
      const nextState = runSimulationTicks(simulateTick, initialState, 120);

      // Then: average pairwise distance has increased (birds are spreading apart)
      const finalAvgDistance = averagePairwiseDistance(nextState.birds);
      expect(finalAvgDistance).toBeGreaterThan(initialAvgDistance);
    });
  });

  describe("@walking_skeleton: Separation slider changes bird spacing", () => {
    it("Given birds flocking with default separation, when separation is increased to 0.9, then birds spread further apart", () => {
      // Given: initial state with default parameters and clustered birds
      const clusteredBirds = createBirds(10, (i) => ({
        position: { x: i * 3, y: i * 3, z: 0 },
        velocity: { x: 1, y: 0.5, z: 0 },
      }));
      const defaultState = createSimulationState({ birds: clusteredBirds });

      // Run a few ticks with default separation (0.5)
      const stateAfterDefault = runSimulationTicks(simulateTick, defaultState, 60);
      const distanceWithDefault = averagePairwiseDistance(stateAfterDefault.birds);

      // When: separation is increased to 0.9
      const highSepState = updateFlockingParam(defaultState, "separationWeight", 0.9);

      // And: simulation runs the same number of ticks
      const stateAfterHighSep = runSimulationTicks(simulateTick, highSepState, 60);
      const distanceWithHighSep = averagePairwiseDistance(stateAfterHighSep.birds);

      // Then: birds with higher separation are further apart
      expect(distanceWithHighSep).toBeGreaterThan(distanceWithDefault);
    });

    it("Given birds flocking, when separation is set to 0.0, then birds no longer maintain distance from each other", () => {
      // Given: birds with some initial spread
      const spreadBirds = createBirds(10, (i) => ({
        position: { x: i * 20, y: 0, z: 0 },
        velocity: { x: 0, y: 0, z: 0 },
      }));

      // When: separation is 0.0 with high cohesion
      const noSepState = createSimulationState({
        birds: spreadBirds,
        parameters: {
          flocking: {
            separationWeight: 0.0,
            alignmentWeight: 0.0,
            cohesionWeight: 1.0,
          },
          neighborRadius: 200,
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
      const initialDistance = averagePairwiseDistance(noSepState.birds);

      // And: simulation runs
      const finalState = runSimulationTicks(simulateTick, noSepState, 300);
      const finalDistance = averagePairwiseDistance(finalState.birds);

      // Then: birds converge (distance decreases) because there is no separation force
      expect(finalDistance).toBeLessThan(initialDistance);
    });

    it("Given the separation slider is updated, then the state reflects the new value", () => {
      // Given: default state
      const state = createInitialState();
      expect(state.parameters.flocking.separationWeight).toBe(0.5);

      // When: separation slider is changed to 0.9
      const updatedState = updateFlockingParam(state, "separationWeight", 0.9);

      // Then: state reflects the new separation weight
      expect(updatedState.parameters.flocking.separationWeight).toBe(0.9);

      // And: original state is unchanged (immutability)
      expect(state.parameters.flocking.separationWeight).toBe(0.5);
    });
  });
});
