import type { SimulationState } from "../types/simulation-types";

type TickFunction = (state: SimulationState, deltaTime: number) => SimulationState;

const computeNextFrame = (
  state: SimulationState,
  deltaTime: number,
  tick: TickFunction
): SimulationState => {
  if (state.playbackState === "paused") {
    return state;
  }
  const scaledDelta = deltaTime * state.simulationSpeed;
  return tick(state, scaledDelta);
};

type FrameMetrics = {
  readonly fps: number;
  readonly lastFrameTime: number;
};

const computeFps = (currentTime: number, previousTime: number): number => {
  const elapsed = currentTime - previousTime;
  if (elapsed <= 0) return 60;
  return 1000 / elapsed;
};

export { computeNextFrame, computeFps };
export type { TickFunction, FrameMetrics };
