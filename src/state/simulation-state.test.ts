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

  it("spaces initial birds with distinct positions across all three axes", () => {
    const state = createInitialState();

    const bird0 = state.birds[0];
    const bird1 = state.birds[1];

    expect(bird0.position.x).toBe(0);
    expect(bird0.position.y).toBe(0);
    expect(bird0.position.z).toBe(0);

    expect(bird1.position.x).toBe(10);
    expect(bird1.position.y).toBe(5);
    expect(bird1.position.z).toBe(3);

    expect(bird0.velocity.z).toBe(-0.2);
  });

  it("sets world bounds symmetrically with negative minimums", () => {
    const state = createInitialState();

    expect(state.parameters.worldBounds.min.x).toBe(-200);
    expect(state.parameters.worldBounds.min.y).toBe(-200);
    expect(state.parameters.worldBounds.min.z).toBe(-200);
    expect(state.parameters.worldBounds.max.x).toBe(200);
    expect(state.parameters.worldBounds.max.y).toBe(200);
    expect(state.parameters.worldBounds.max.z).toBe(200);
  });
});
