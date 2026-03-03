import { describe, it, expect } from "vitest";
import { updateFlockingParam } from "./state-transitions";
import { createInitialState } from "./simulation-state";

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
