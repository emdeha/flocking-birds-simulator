import { describe, it, expect } from "vitest";
import { computeNextFrame } from "./game-loop";
import type { SimulationState } from "../types/simulation-types";

const createTestState = (overrides?: Partial<SimulationState>): SimulationState => ({
  birds: [
    { position: { x: 0, y: 0, z: 0 }, velocity: { x: 1, y: 0, z: 0 } },
    { position: { x: 10, y: 0, z: 0 }, velocity: { x: -1, y: 0, z: 0 } },
  ],
  obstacles: [],
  predators: [],
  parameters: {
    flocking: { separationWeight: 0.5, alignmentWeight: 0.7, cohesionWeight: 0.6 },
    neighborRadius: 50,
    separationRadius: 25,
    maxSpeed: 4,
    maxForce: 0.1,
    obstacleAvoidanceRadius: 30,
    obstacleAvoidanceWeight: 1.5,
    predatorFleeRadius: 80,
    predatorFleeWeight: 3.0,
    worldBounds: { min: { x: -200, y: -200, z: -200 }, max: { x: 200, y: 200, z: 200 } },
  },
  playbackState: "running" as const,
  simulationSpeed: 1.0,
  ...overrides,
});

describe("Game loop frame computation", () => {
  it("should produce a new state by running simulateTick when playback is running", () => {
    const state = createTestState();
    const tickCalls: Array<{ state: SimulationState; deltaTime: number }> = [];

    const fakeTick = (s: SimulationState, dt: number): SimulationState => {
      tickCalls.push({ state: s, deltaTime: dt });
      return {
        ...s,
        birds: s.birds.map((b) => ({
          ...b,
          position: { x: b.position.x + 1, y: b.position.y, z: b.position.z },
        })),
      };
    };

    const result = computeNextFrame(state, 1 / 60, fakeTick);

    expect(tickCalls).toHaveLength(1);
    expect(tickCalls[0].deltaTime).toBeCloseTo(1 / 60);
    expect(result.birds[0].position.x).toBe(1);
  });

  it("should return the same state unchanged when playback is paused", () => {
    const state = createTestState({ playbackState: "paused" });
    const tickCalls: Array<{ state: SimulationState; deltaTime: number }> = [];

    const fakeTick = (s: SimulationState, dt: number): SimulationState => {
      tickCalls.push({ state: s, deltaTime: dt });
      return s;
    };

    const result = computeNextFrame(state, 1 / 60, fakeTick);

    expect(tickCalls).toHaveLength(0);
    expect(result).toBe(state);
  });

  it("should scale deltaTime by simulationSpeed", () => {
    const state = createTestState({ simulationSpeed: 2.0 });
    const capturedDeltas: Array<number> = [];

    const fakeTick = (s: SimulationState, dt: number): SimulationState => {
      capturedDeltas.push(dt);
      return s;
    };

    computeNextFrame(state, 1 / 60, fakeTick);

    expect(capturedDeltas[0]).toBeCloseTo(2 / 60);
  });
});
