import type { Bird, SimulationState } from "../types/simulation-types";

const BIRD_COUNT = 10;

const createBird = (index: number): Bird => ({
  position: {
    x: index * 10,
    y: index * 5,
    z: index * 3,
  },
  velocity: {
    x: 1,
    y: 0.5,
    z: -0.2,
  },
});

const createInitialBirds = (): ReadonlyArray<Bird> =>
  Array.from({ length: BIRD_COUNT }, (_, i) => createBird(i));

const createInitialState = (): SimulationState => ({
  birds: createInitialBirds(),
  obstacles: [],
  predators: [],
  parameters: {
    flocking: {
      separationWeight: 0.5,
      alignmentWeight: 0.7,
      cohesionWeight: 0.6,
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

export { createInitialState };
