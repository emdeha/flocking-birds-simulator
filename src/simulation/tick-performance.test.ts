import { describe, it, expect } from "vitest";
import { simulateTick } from "./tick";
import type { SimulationState, Bird } from "../types/simulation-types";

const createRandomBird = (worldSize: number): Bird => ({
  position: {
    x: (Math.random() - 0.5) * worldSize,
    y: (Math.random() - 0.5) * worldSize,
    z: (Math.random() - 0.5) * worldSize,
  },
  velocity: {
    x: (Math.random() - 0.5) * 4,
    y: (Math.random() - 0.5) * 4,
    z: (Math.random() - 0.5) * 4,
  },
});

const BIRD_COUNT = 200;
const WORLD_SIZE = 400;

const createPerformanceState = (birdCount: number): SimulationState => ({
  birds: Array.from({ length: birdCount }, () => createRandomBird(WORLD_SIZE)),
  obstacles: [],
  predators: [],
  parameters: {
    flocking: {
      separationWeight: 1.5,
      alignmentWeight: 1.0,
      cohesionWeight: 1.0,
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
      min: { x: -200, y: -200, z: -200 },
      max: { x: 200, y: 200, z: 200 },
    },
  },
  playbackState: "running",
  simulationSpeed: 1.0,
});

describe("simulateTick performance with 200 birds", () => {
  it("completes a tick under 8ms averaged over multiple frames", () => {
    const WARM_UP_TICKS = 5;
    const MEASURED_TICKS = 20;
    const MAX_TICK_MS = 8;
    const deltaTime = 1 / 60;

    let state = createPerformanceState(BIRD_COUNT);

    for (let i = 0; i < WARM_UP_TICKS; i++) {
      state = simulateTick(state, deltaTime);
    }

    const tickTimes: Array<number> = [];
    for (let i = 0; i < MEASURED_TICKS; i++) {
      const start = performance.now();
      state = simulateTick(state, deltaTime);
      const elapsed = performance.now() - start;
      tickTimes.push(elapsed);
    }

    const averageTickMs =
      tickTimes.reduce((sum, t) => sum + t, 0) / tickTimes.length;
    const maxTickMs = Math.max(...tickTimes);

    console.log(
      `[PERF] 200 birds avg tick: ${averageTickMs.toFixed(2)}ms, max: ${maxTickMs.toFixed(2)}ms`
    );

    expect(averageTickMs).toBeLessThan(MAX_TICK_MS);
  });

  it("maintains consistent performance across successive ticks without degradation", () => {
    const TOTAL_TICKS = 50;
    const deltaTime = 1 / 60;
    const MAX_TICK_MS = 8;

    let state = createPerformanceState(BIRD_COUNT);

    for (let i = 0; i < 5; i++) {
      state = simulateTick(state, deltaTime);
    }

    const firstBatchTimes: Array<number> = [];
    for (let i = 0; i < TOTAL_TICKS / 2; i++) {
      const start = performance.now();
      state = simulateTick(state, deltaTime);
      const elapsed = performance.now() - start;
      firstBatchTimes.push(elapsed);
    }

    const secondBatchTimes: Array<number> = [];
    for (let i = 0; i < TOTAL_TICKS / 2; i++) {
      const start = performance.now();
      state = simulateTick(state, deltaTime);
      const elapsed = performance.now() - start;
      secondBatchTimes.push(elapsed);
    }

    const avgFirst =
      firstBatchTimes.reduce((sum, t) => sum + t, 0) / firstBatchTimes.length;
    const avgSecond =
      secondBatchTimes.reduce((sum, t) => sum + t, 0) /
      secondBatchTimes.length;

    console.log(
      `[PERF] Consistency check - first batch avg: ${avgFirst.toFixed(2)}ms, second batch avg: ${avgSecond.toFixed(2)}ms`
    );

    expect(avgFirst).toBeLessThan(MAX_TICK_MS);
    expect(avgSecond).toBeLessThan(MAX_TICK_MS);
    expect(avgSecond).toBeLessThan(avgFirst * 2);
  });
});
