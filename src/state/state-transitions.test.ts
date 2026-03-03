import { describe, it, expect } from "vitest";
import { updateFlockingParam, addBird, addBirdRandom, removeBird } from "./state-transitions";
import { createInitialState } from "./simulation-state";
import type { SimulationState } from "../types/simulation-types";
import { vectorMagnitude } from "../types/vector";

const createEmptyState = (): SimulationState => ({
  ...createInitialState(),
  birds: [],
});

const createStateWithBirds = (count: number): SimulationState => ({
  ...createInitialState(),
  birds: Array.from({ length: count }, (_, i) => ({
    position: { x: i * 10, y: i * 5, z: i * 3 },
    velocity: { x: 1, y: 0.5, z: -0.2 },
  })),
});

describe("updateFlockingParam", () => {
  it("returns new state with updated flocking parameter value", () => {
    const state = createInitialState();

    const updated = updateFlockingParam(state, "separationWeight", 0.9);

    expect(updated.parameters.flocking.separationWeight).toBe(0.9);
  });

  it("does not mutate the original state", () => {
    const state = createInitialState();

    updateFlockingParam(state, "separationWeight", 0.9);

    expect(state.parameters.flocking.separationWeight).toBe(0.5);
  });
});

describe("addBird", () => {
  it("appends a bird with the given position and velocity, returning immutable new state", () => {
    const state = createStateWithBirds(5);
    const position = { x: 10, y: 20, z: 30 };
    const velocity = { x: 2, y: 1, z: -1 };

    const nextState = addBird(state, position, velocity);

    expect(nextState.birds.length).toBe(6);
    const newBird = nextState.birds[nextState.birds.length - 1];
    expect(newBird.position).toEqual(position);
    expect(newBird.velocity).toEqual(velocity);
    expect(state.birds.length).toBe(5);
  });
});

describe("addBirdRandom", () => {
  it("appends a bird within world bounds with a non-zero velocity", () => {
    const state = createStateWithBirds(3);

    const nextState = addBirdRandom(state);

    expect(nextState.birds.length).toBe(4);
    const newBird = nextState.birds[nextState.birds.length - 1];
    const { min, max } = state.parameters.worldBounds;
    expect(newBird.position.x).toBeGreaterThanOrEqual(min.x);
    expect(newBird.position.x).toBeLessThanOrEqual(max.x);
    expect(newBird.position.y).toBeGreaterThanOrEqual(min.y);
    expect(newBird.position.y).toBeLessThanOrEqual(max.y);
    expect(newBird.position.z).toBeGreaterThanOrEqual(min.z);
    expect(newBird.position.z).toBeLessThanOrEqual(max.z);
    expect(vectorMagnitude(newBird.velocity)).toBeGreaterThan(0);
    expect(state.birds.length).toBe(3);
  });
});

describe("removeBird", () => {
  it("removes the last bird from a non-empty state, returning unchanged state when empty", () => {
    const stateWith3 = createStateWithBirds(3);

    const stateWith2 = removeBird(stateWith3);
    expect(stateWith2.birds.length).toBe(2);
    expect(stateWith3.birds.length).toBe(3);

    const emptyState = createEmptyState();
    const stillEmpty = removeBird(emptyState);
    expect(stillEmpty.birds.length).toBe(0);
  });
});
