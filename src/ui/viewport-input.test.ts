import { describe, it, expect } from "vitest";
import { createViewportClickHandler } from "./viewport-input";

const createMockCanvas = (): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  Object.defineProperty(canvas, "getBoundingClientRect", {
    value: () => ({ left: 0, top: 0, width: 800, height: 600 }),
  });
  return canvas;
};

describe("Viewport click handler", () => {
  it("invokes the callback with normalized coordinates on a short click within threshold", () => {
    const canvas = createMockCanvas();
    const capturedClicks: Array<{ normalizedX: number; normalizedY: number }> = [];

    createViewportClickHandler(canvas, (normalizedX, normalizedY) => {
      capturedClicks.push({ normalizedX, normalizedY });
    });

    canvas.dispatchEvent(new MouseEvent("mousedown", { clientX: 400, clientY: 300 }));
    canvas.dispatchEvent(new MouseEvent("mouseup", { clientX: 402, clientY: 301 }));

    expect(capturedClicks.length).toBe(1);
    expect(capturedClicks[0].normalizedX).toBeCloseTo(0, 1);
    expect(capturedClicks[0].normalizedY).toBeCloseTo(0, 1);
  });

  it("does not invoke the callback when mouse moves beyond the distance threshold", () => {
    const canvas = createMockCanvas();
    const capturedClicks: Array<{ normalizedX: number; normalizedY: number }> = [];

    createViewportClickHandler(canvas, (normalizedX, normalizedY) => {
      capturedClicks.push({ normalizedX, normalizedY });
    });

    canvas.dispatchEvent(new MouseEvent("mousedown", { clientX: 400, clientY: 300 }));
    canvas.dispatchEvent(new MouseEvent("mouseup", { clientX: 420, clientY: 320 }));

    expect(capturedClicks.length).toBe(0);
  });

  it("normalizes coordinates to range [-1, 1] based on canvas dimensions", () => {
    const canvas = createMockCanvas();
    const capturedClicks: Array<{ normalizedX: number; normalizedY: number }> = [];

    createViewportClickHandler(canvas, (normalizedX, normalizedY) => {
      capturedClicks.push({ normalizedX, normalizedY });
    });

    canvas.dispatchEvent(new MouseEvent("mousedown", { clientX: 0, clientY: 0 }));
    canvas.dispatchEvent(new MouseEvent("mouseup", { clientX: 0, clientY: 0 }));

    expect(capturedClicks.length).toBe(1);
    expect(capturedClicks[0].normalizedX).toBeCloseTo(-1, 1);
    expect(capturedClicks[0].normalizedY).toBeCloseTo(1, 1);
  });
});
