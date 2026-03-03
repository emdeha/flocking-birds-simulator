import { describe, it, expect } from "vitest";
import { createViewportInputHandler } from "./viewport-input";

type DragResult = {
  readonly centerX: number;
  readonly centerY: number;
  readonly radius: number;
};

const createMockCanvas = (): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  Object.defineProperty(canvas, "getBoundingClientRect", {
    value: () => ({ left: 0, top: 0, width: 800, height: 600 }),
  });
  return canvas;
};

describe("Viewport input handler", () => {
  it("invokes the click callback with normalized coordinates on a short click within threshold", () => {
    const canvas = createMockCanvas();
    const capturedClicks: Array<{ normalizedX: number; normalizedY: number }> = [];

    createViewportInputHandler(canvas, {
      onClick: (normalizedX, normalizedY) => {
        capturedClicks.push({ normalizedX, normalizedY });
      },
      onDrag: () => {},
    });

    canvas.dispatchEvent(new MouseEvent("mousedown", { clientX: 400, clientY: 300 }));
    canvas.dispatchEvent(new MouseEvent("mouseup", { clientX: 402, clientY: 301 }));

    expect(capturedClicks.length).toBe(1);
    expect(capturedClicks[0].normalizedX).toBeCloseTo(0, 1);
    expect(capturedClicks[0].normalizedY).toBeCloseTo(0, 1);
  });

  it("invokes the drag callback with center and radius when mouse moves beyond distance threshold", () => {
    const canvas = createMockCanvas();
    const capturedDrags: Array<DragResult> = [];
    const capturedClicks: Array<{ normalizedX: number; normalizedY: number }> = [];

    createViewportInputHandler(canvas, {
      onClick: (normalizedX, normalizedY) => {
        capturedClicks.push({ normalizedX, normalizedY });
      },
      onDrag: (centerX, centerY, radius) => {
        capturedDrags.push({ centerX, centerY, radius });
      },
    });

    canvas.dispatchEvent(new MouseEvent("mousedown", { clientX: 400, clientY: 300 }));
    canvas.dispatchEvent(new MouseEvent("mouseup", { clientX: 420, clientY: 320 }));

    expect(capturedClicks.length).toBe(0);
    expect(capturedDrags.length).toBe(1);
    expect(capturedDrags[0].radius).toBeGreaterThan(0);
  });

  it("normalizes coordinates to range [-1, 1] based on canvas dimensions", () => {
    const canvas = createMockCanvas();
    const capturedClicks: Array<{ normalizedX: number; normalizedY: number }> = [];

    createViewportInputHandler(canvas, {
      onClick: (normalizedX, normalizedY) => {
        capturedClicks.push({ normalizedX, normalizedY });
      },
      onDrag: () => {},
    });

    canvas.dispatchEvent(new MouseEvent("mousedown", { clientX: 0, clientY: 0 }));
    canvas.dispatchEvent(new MouseEvent("mouseup", { clientX: 0, clientY: 0 }));

    expect(capturedClicks.length).toBe(1);
    expect(capturedClicks[0].normalizedX).toBeCloseTo(-1, 1);
    expect(capturedClicks[0].normalizedY).toBeCloseTo(1, 1);
  });

  it("computes drag center as midpoint and radius as half the drag distance in normalized coordinates", () => {
    const canvas = createMockCanvas();
    const capturedDrags: Array<DragResult> = [];

    createViewportInputHandler(canvas, {
      onClick: () => {},
      onDrag: (centerX, centerY, radius) => {
        capturedDrags.push({ centerX, centerY, radius });
      },
    });

    canvas.dispatchEvent(new MouseEvent("mousedown", { clientX: 100, clientY: 100 }));
    canvas.dispatchEvent(new MouseEvent("mouseup", { clientX: 300, clientY: 100 }));

    expect(capturedDrags.length).toBe(1);
    const startNormX = (100 / 800) * 2 - 1;
    const endNormX = (300 / 800) * 2 - 1;
    const expectedCenterX = (startNormX + endNormX) / 2;
    expect(capturedDrags[0].centerX).toBeCloseTo(expectedCenterX, 4);
    expect(capturedDrags[0].radius).toBeGreaterThan(0);
  });

  it("computes drag center Y and radius correctly for vertical drags", () => {
    const canvas = createMockCanvas();
    const capturedDrags: Array<DragResult> = [];

    createViewportInputHandler(canvas, {
      onClick: () => {},
      onDrag: (centerX, centerY, radius) => {
        capturedDrags.push({ centerX, centerY, radius });
      },
    });

    canvas.dispatchEvent(new MouseEvent("mousedown", { clientX: 400, clientY: 100 }));
    canvas.dispatchEvent(new MouseEvent("mouseup", { clientX: 400, clientY: 300 }));

    expect(capturedDrags.length).toBe(1);
    const startNormY = -((100 / 600) * 2 - 1);
    const endNormY = -((300 / 600) * 2 - 1);
    const expectedCenterY = (startNormY + endNormY) / 2;
    const ndy = endNormY - startNormY;
    const expectedRadius = Math.abs(ndy) / 2;

    expect(capturedDrags[0].centerY).toBeCloseTo(expectedCenterY, 4);
    expect(capturedDrags[0].radius).toBeCloseTo(expectedRadius, 4);
  });

  it("treats exactly threshold distance movement as a click, not a drag", () => {
    const canvas = createMockCanvas();
    const capturedClicks: Array<{ normalizedX: number; normalizedY: number }> = [];
    const capturedDrags: Array<DragResult> = [];

    createViewportInputHandler(canvas, {
      onClick: (normalizedX, normalizedY) => {
        capturedClicks.push({ normalizedX, normalizedY });
      },
      onDrag: (centerX, centerY, radius) => {
        capturedDrags.push({ centerX, centerY, radius });
      },
    });

    canvas.dispatchEvent(new MouseEvent("mousedown", { clientX: 400, clientY: 300 }));
    canvas.dispatchEvent(new MouseEvent("mouseup", { clientX: 403, clientY: 304 }));

    expect(capturedClicks.length).toBe(1);
    expect(capturedDrags.length).toBe(0);
  });
});
