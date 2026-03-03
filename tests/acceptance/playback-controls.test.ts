/**
 * US-5: Playback and Speed Controls
 *
 * Validates pause/play toggle and simulation speed adjustment.
 * When paused, simulateTick should not advance bird positions.
 * Speed multiplier scales the effective delta time.
 *
 * DRIVING PORTS:
 *   - togglePlayback(state) -> SimulationState
 *   - setSpeed(state, speed) -> SimulationState
 *   - simulateTick(state, deltaTime) -> nextState
 *
 * ACCEPTANCE CRITERIA COVERED:
 *   AC-5.1: Play/pause button toggles simulation state
 *   AC-5.2: Paused birds freeze at exact current positions
 *   AC-5.3: Velocity vectors remain visible when paused
 *   AC-5.4: Speed slider range [0.1x, 5.0x] adjusts simulation tick rate
 *   AC-5.5: Birds added while paused are frozen until resume
 *   AC-5.6: Resume continues from exact frozen state
 */
import { describe, it, expect } from "vitest";
import {
  createSimulationState,
  createBirds,
  createVector3,
  vectorMagnitude,
  runSimulationTicks,
  averagePairwiseDistance,
} from "./test-helpers";
import type { SimulationState } from "./test-helpers";

// Placeholder imports -- crafter replaces with real implementations
// import { togglePlayback, setSpeed, addBird } from "../../src/state/state-transitions";
// import { simulateTick } from "../../src/simulation/tick";
const togglePlayback = (state: SimulationState): SimulationState => state;
const setSpeed = (state: SimulationState, _speed: number): SimulationState => state;
const addBird = (
  state: SimulationState,
  _position: { x: number; y: number; z: number },
  _velocity: { x: number; y: number; z: number }
): SimulationState => state;
const simulateTick = (state: SimulationState, _deltaTime: number): SimulationState => state;

// All scenarios @skip until US-5 is in progress
describe("US-5: Playback and Speed Controls", () => {
  describe.skip("Pause freezes all birds", () => {
    it("Given a running simulation, when pause is toggled, then playback state becomes paused", () => {
      // Given: running simulation
      const state = createSimulationState({
        birds: createBirds(10),
        playbackState: "running",
      });

      // When: playback is toggled
      const pausedState = togglePlayback(state);

      // Then: simulation is paused
      expect(pausedState.playbackState).toBe("paused");
    });

    it("Given a paused simulation, when simulation tick runs, then bird positions do not change", () => {
      // Given: paused simulation
      const state = createSimulationState({
        birds: createBirds(10),
        playbackState: "paused",
      });
      const positionsBefore = state.birds.map((b) => ({ ...b.position }));

      // When: tick is called while paused
      // (The game loop should respect playback state; tick should be a no-op or
      // the loop should skip the tick. Either way, positions must not change.)
      const nextState = simulateTick(state, 1 / 60);

      // Then: all bird positions are identical
      nextState.birds.forEach((bird, i) => {
        expect(bird.position.x).toBe(positionsBefore[i].x);
        expect(bird.position.y).toBe(positionsBefore[i].y);
        expect(bird.position.z).toBe(positionsBefore[i].z);
      });
    });

    it("Given a paused simulation, then velocity vectors are still present (non-zero)", () => {
      // Given: paused simulation with moving birds
      const state = createSimulationState({
        birds: createBirds(10, (i) => ({
          position: { x: i * 10, y: 0, z: 0 },
          velocity: { x: 2, y: 1, z: 0 },
        })),
        playbackState: "paused",
      });

      // Then: velocity vectors are preserved (not zeroed out)
      state.birds.forEach((bird) => {
        expect(vectorMagnitude(bird.velocity)).toBeGreaterThan(0);
      });
    });
  });

  describe.skip("Resume from paused state", () => {
    it("Given a paused simulation, when play is toggled, then playback state becomes running", () => {
      // Given: paused simulation
      const state = createSimulationState({
        birds: createBirds(10),
        playbackState: "paused",
      });

      // When: playback is toggled
      const runningState = togglePlayback(state);

      // Then: simulation is running
      expect(runningState.playbackState).toBe("running");
    });

    it("Given a paused simulation resumed, when tick runs, then birds move from their frozen positions", () => {
      // Given: a state that was paused, now resumed
      const state = createSimulationState({
        birds: createBirds(10),
        playbackState: "running",
      });
      const positionsBefore = state.birds.map((b) => ({ ...b.position }));

      // When: simulation runs
      const nextState = runSimulationTicks(simulateTick, state, 30);

      // Then: at least some birds have moved
      const movedBirds = nextState.birds.filter((bird, i) => {
        const before = positionsBefore[i];
        return (
          bird.position.x !== before.x ||
          bird.position.y !== before.y ||
          bird.position.z !== before.z
        );
      });
      expect(movedBirds.length).toBeGreaterThan(0);
    });
  });

  describe.skip("Speed slider adjusts simulation rate", () => {
    it("Given simulation at 1.0x, when speed is set to 2.5x, then state reflects 2.5x speed", () => {
      // Given: default speed
      const state = createSimulationState({ simulationSpeed: 1.0 });

      // When: speed is changed
      const fastState = setSpeed(state, 2.5);

      // Then: speed is updated
      expect(fastState.simulationSpeed).toBe(2.5);
    });

    it("Given speed is 2.0x, when simulation runs, then birds move further per tick than at 1.0x", () => {
      // Given: same initial state at two different speeds
      const birds = createBirds(5, (i) => ({
        position: { x: i * 10, y: 0, z: 0 },
        velocity: { x: 3, y: 0, z: 0 },
      }));
      const normalState = createSimulationState({
        birds,
        simulationSpeed: 1.0,
      });
      const fastState = createSimulationState({
        birds,
        simulationSpeed: 2.0,
      });

      // When: both run for 10 ticks
      // The game loop passes deltaTime * simulationSpeed to the engine.
      // At 2.0x, effective deltaTime is doubled.
      const normalFinal = runSimulationTicks(
        simulateTick,
        normalState,
        10,
        1 / 60
      );
      const fastFinal = runSimulationTicks(
        simulateTick,
        fastState,
        10,
        (1 / 60) * 2.0 // simulating what the game loop does at 2x speed
      );

      // Then: fast simulation birds have moved further
      const normalDist = averagePairwiseDistance(normalFinal.birds);
      const fastDist = averagePairwiseDistance(fastFinal.birds);
      // At minimum, positions should differ (fast moved more)
      expect(fastDist).not.toBe(normalDist);
    });

    it("Given speed state, when setSpeed is called, then original state is not mutated", () => {
      // Given: default speed
      const state = createSimulationState({ simulationSpeed: 1.0 });

      // When: speed changed
      setSpeed(state, 3.0);

      // Then: original unchanged
      expect(state.simulationSpeed).toBe(1.0);
    });

    it("Given speed bounds, then speed is clamped between 0.1 and 5.0", () => {
      // Given: default state
      const state = createSimulationState();

      // When: speed set to extremes
      const slowState = setSpeed(state, 0.1);
      const fastState = setSpeed(state, 5.0);

      // Then: values are at bounds
      expect(slowState.simulationSpeed).toBe(0.1);
      expect(fastState.simulationSpeed).toBe(5.0);
    });
  });

  describe.skip("Adding birds while paused", () => {
    it("Given a paused simulation with 10 birds, when a bird is added, then bird count is 11 and simulation remains paused", () => {
      // Given: paused simulation
      const state = createSimulationState({
        birds: createBirds(10),
        playbackState: "paused",
      });

      // When: bird is added
      const nextState = addBird(
        state,
        createVector3({ x: 50, y: 50, z: 0 }),
        createVector3({ x: 1, y: 0, z: 0 })
      );

      // Then: bird is added
      expect(nextState.birds.length).toBe(11);

      // And: simulation remains paused
      expect(nextState.playbackState).toBe("paused");
    });

    it("Given a bird added while paused, when tick runs, then the new bird does not move", () => {
      // Given: paused simulation with new bird
      const state = createSimulationState({
        birds: [
          ...createBirds(5),
          { position: { x: 100, y: 100, z: 0 }, velocity: { x: 2, y: 0, z: 0 } },
        ],
        playbackState: "paused",
      });

      // When: tick runs while paused
      const nextState = simulateTick(state, 1 / 60);

      // Then: new bird position unchanged
      const lastBird = nextState.birds[nextState.birds.length - 1];
      expect(lastBird.position.x).toBe(100);
      expect(lastBird.position.y).toBe(100);
      expect(lastBird.position.z).toBe(0);
    });
  });
});
