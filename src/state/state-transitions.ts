import type { FlockingParameters, SimulationState } from "../types/simulation-types";

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

export { updateFlockingParam };
