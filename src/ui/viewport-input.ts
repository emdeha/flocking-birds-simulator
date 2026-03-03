const CLICK_DISTANCE_THRESHOLD = 5;

type ClickCallback = (normalizedX: number, normalizedY: number) => void;

const createViewportClickHandler = (
  canvas: HTMLCanvasElement,
  onClick: ClickCallback
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

    if (distance > CLICK_DISTANCE_THRESHOLD) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const normalizedX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const normalizedY = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    onClick(normalizedX, normalizedY);
  });
};

export { createViewportClickHandler };
export type { ClickCallback };
