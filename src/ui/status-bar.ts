type StatusBarInput = {
  readonly birdCount: number;
  readonly predatorCount: number;
  readonly obstacleCount: number;
  readonly fps: number;
};

const formatStatusText = (input: StatusBarInput): string => {
  const roundedFps = Math.round(input.fps);
  return `Birds: ${input.birdCount} | Predators: ${input.predatorCount} | Obstacles: ${input.obstacleCount} | FPS: ${roundedFps}`;
};

const updateStatusBar = (element: HTMLElement, input: StatusBarInput): void => {
  element.textContent = formatStatusText(input);
};

export { formatStatusText, updateStatusBar };
export type { StatusBarInput };
