import type { FlockingParameters, SimulationState, Bird } from "../types/simulation-types";
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

export { updateFlockingParam, addBird, addBirdRandom, removeBird };
