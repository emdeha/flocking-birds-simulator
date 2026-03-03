type StatusBarInput = {
  readonly birdCount: number;
  readonly fps: number;
};

const formatStatusText = (input: StatusBarInput): string => {
  const roundedFps = Math.round(input.fps);
  return `Birds: ${input.birdCount} | FPS: ${roundedFps}`;
};

const updateStatusBar = (element: HTMLElement, input: StatusBarInput): void => {
  element.textContent = formatStatusText(input);
};

export { formatStatusText, updateStatusBar };
export type { StatusBarInput };
