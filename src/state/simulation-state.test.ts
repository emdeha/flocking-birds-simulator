import { describe, it, expect } from "vitest";
import { createInitialState } from "./simulation-state";
import { vectorMagnitude } from "../types/vector";

describe("createInitialState", () => {
  it("returns approximately 10 birds each with position and non-zero velocity", () => {
    const state = createInitialState();

    expect(state.birds.length).toBeGreaterThanOrEqual(8);
    expect(state.birds.length).toBeLessThanOrEqual(12);

    state.birds.forEach((bird) => {
      expect(bird.position).toBeDefined();
      expect(bird.velocity).toBeDefined();

      const speed = vectorMagnitude(bird.velocity);
      expect(speed).toBeGreaterThan(0);
    });
  });

  it("returns default flocking parameters and playback state", () => {
    const state = createInitialState();

    expect(state.parameters.flocking.separationWeight).toBe(0.5);
    expect(state.parameters.flocking.alignmentWeight).toBe(0.7);
    expect(state.parameters.flocking.cohesionWeight).toBe(0.6);
    expect(state.playbackState).toBe("running");
    expect(state.simulationSpeed).toBe(1.0);
  });
});
