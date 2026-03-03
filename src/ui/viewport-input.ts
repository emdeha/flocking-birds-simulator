const CLICK_DISTANCE_THRESHOLD = 5;

type ClickCallback = (normalizedX: number, normalizedY: number) => void;
type DragCallback = (centerNormX: number, centerNormY: number, radius: number) => void;

type ViewportInputCallbacks = {
  readonly onClick: ClickCallback;
  readonly onDrag: DragCallback;
};

const normalizeCoordinate = (
  clientVal: number,
  rectOffset: number,
  rectSize: number,
  invert: boolean
): number => {
  const normalized = ((clientVal - rectOffset) / rectSize) * 2 - 1;
  return invert ? -normalized : normalized;
};

const createViewportInputHandler = (
  canvas: HTMLCanvasElement,
  callbacks: ViewportInputCallbacks
): void => {
  let downX = 0;
  let downY = 0;

  canvas.addEventListener("mousedown", (event: MouseEvent) => {
    downX = event.clientX;
    downY = event.clientY;
  });

  canvas.addEventListener("mouseup", (event: MouseEvent) => {
    const dx = event.clientX - downX;
    const dy = event.clientY - downY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const rect = canvas.getBoundingClientRect();

    if (distance <= CLICK_DISTANCE_THRESHOLD) {
      const normalizedX = normalizeCoordinate(event.clientX, rect.left, rect.width, false);
      const normalizedY = normalizeCoordinate(event.clientY, rect.top, rect.height, true);
      callbacks.onClick(normalizedX, normalizedY);
      return;
    }

    const startNormX = normalizeCoordinate(downX, rect.left, rect.width, false);
    const startNormY = normalizeCoordinate(downY, rect.top, rect.height, true);
    const endNormX = normalizeCoordinate(event.clientX, rect.left, rect.width, false);
    const endNormY = normalizeCoordinate(event.clientY, rect.top, rect.height, true);

    const centerX = (startNormX + endNormX) / 2;
    const centerY = (startNormY + endNormY) / 2;
    const ndx = endNormX - startNormX;
    const ndy = endNormY - startNormY;
    const radius = Math.sqrt(ndx * ndx + ndy * ndy) / 2;

    callbacks.onDrag(centerX, centerY, radius);
  });
};

const createViewportClickHandler = (
  canvas: HTMLCanvasElement,
  onClick: ClickCallback
): void => {
  createViewportInputHandler(canvas, {
    onClick,
    onDrag: () => {},
  });
};

export { createViewportClickHandler, createViewportInputHandler };
export type { ClickCallback, DragCallback, ViewportInputCallbacks };
