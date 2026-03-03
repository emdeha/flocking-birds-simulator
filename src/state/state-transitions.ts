import type { FlockingParameters, SimulationState, Bird, Obstacle, Predator } from "../types/simulation-types";
import type { Vector3 } from "../types/vector";

const updateFlockingParam = (
  state: SimulationState,
  paramName: keyof FlockingParameters,
  value: number
): SimulationState => ({
  ...state,
  parameters: {
    ...state.parameters,
    flocking: {
      ...state.parameters.flocking,
      [paramName]: value,
    },
  },
});

const addBird = (
  state: SimulationState,
  position: Vector3,
  velocity: Vector3
): SimulationState => ({
  ...state,
  birds: [...state.birds, { position, velocity }],
});

const randomInRange = (min: number, max: number): number =>
  min + Math.random() * (max - min);

const createRandomBird = (state: SimulationState): Bird => {
  const { min, max } = state.parameters.worldBounds;
  const position: Vector3 = {
    x: randomInRange(min.x, max.x),
    y: randomInRange(min.y, max.y),
    z: randomInRange(min.z, max.z),
  };
  const velocity: Vector3 = {
    x: randomInRange(-1, 1),
    y: randomInRange(-1, 1),
    z: randomInRange(-1, 1),
  };
  return { position, velocity };
};

const addBirdRandom = (state: SimulationState): SimulationState => ({
  ...state,
  birds: [...state.birds, createRandomBird(state)],
});

const removeBird = (state: SimulationState): SimulationState => {
  if (state.birds.length === 0) {
    return state;
  }
  return {
    ...state,
    birds: state.birds.slice(0, -1),
  };
};

const addObstacle = (
  state: SimulationState,
  position: Vector3,
  radius: number
): SimulationState => ({
  ...state,
  obstacles: [...state.obstacles, { position, radius }],
});

const clearObstacles = (state: SimulationState): SimulationState => ({
  ...state,
  obstacles: [],
});

const addPredator = (
  state: SimulationState,
  position: Vector3
): SimulationState => ({
  ...state,
  predators: [...state.predators, { position }],
});

const MIN_SPEED = 0.1;
const MAX_SPEED = 5.0;

const togglePlayback = (state: SimulationState): SimulationState => ({
  ...state,
  playbackState: state.playbackState === "running" ? "paused" : "running",
});

const setSpeed = (
  state: SimulationState,
  speed: number
): SimulationState => ({
  ...state,
  simulationSpeed: Math.min(MAX_SPEED, Math.max(MIN_SPEED, speed)),
});

export { updateFlockingParam, addBird, addBirdRandom, removeBird, addObstacle, clearObstacles, addPredator, togglePlayback, setSpeed };
