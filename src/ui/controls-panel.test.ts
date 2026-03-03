import { describe, it, expect } from "vitest";
import { createSliderBinding, createSliderWithDisplay } from "./controls-panel";

const createSliderElement = (attrs: {
  id: string;
  min: string;
  max: string;
  step: string;
  value: string;
}): HTMLInputElement => {
  const slider = document.createElement("input");
  slider.type = "range";
  slider.id = attrs.id;
  slider.min = attrs.min;
  slider.max = attrs.max;
  slider.step = attrs.step;
  slider.value = attrs.value;
  return slider;
};

const createDisplayElement = (id: string, initialText: string): HTMLSpanElement => {
  const span = document.createElement("span");
  span.id = id;
  span.textContent = initialText;
  return span;
};

describe("Controls panel slider binding", () => {
  it("should invoke the change handler with the slider value when input changes", () => {
    const capturedValues: Array<number> = [];
    const onChangeHandler = (value: number) => {
      capturedValues.push(value);
    };

    const container = document.createElement("div");
    container.innerHTML = '<input type="range" class="separation-slider" min="0" max="1" step="0.1" value="0.5" />';
    const slider = container.querySelector(".separation-slider") as HTMLInputElement;

    createSliderBinding(slider, onChangeHandler);

    slider.value = "0.8";
    slider.dispatchEvent(new Event("input"));

    expect(capturedValues).toEqual([0.8]);
  });

  it("should invoke the change handler for each subsequent input event", () => {
    const capturedValues: Array<number> = [];
    const onChangeHandler = (value: number) => {
      capturedValues.push(value);
    };

    const container = document.createElement("div");
    container.innerHTML = '<input type="range" class="separation-slider" min="0" max="1" step="0.1" value="0.5" />';
    const slider = container.querySelector(".separation-slider") as HTMLInputElement;

    createSliderBinding(slider, onChangeHandler);

    slider.value = "0.3";
    slider.dispatchEvent(new Event("input"));

    slider.value = "0.9";
    slider.dispatchEvent(new Event("input"));

    expect(capturedValues).toEqual([0.3, 0.9]);
  });
});

describe("Slider with display binding", () => {
  it("should update the display element text with formatted value when slider changes", () => {
    const slider = createSliderElement({
      id: "alignment-slider",
      min: "0",
      max: "1",
      step: "0.05",
      value: "0.70",
    });
    const display = createDisplayElement("alignment-value", "0.70");
    const capturedValues: Array<number> = [];

    createSliderWithDisplay(slider, display, (value) => {
      capturedValues.push(value);
    });

    slider.value = "0.35";
    slider.dispatchEvent(new Event("input"));

    expect(display.textContent).toBe("0.35");
    expect(capturedValues).toEqual([0.35]);
  });

  it("should invoke the change callback and update display for each input event", () => {
    const slider = createSliderElement({
      id: "cohesion-slider",
      min: "0",
      max: "1",
      step: "0.05",
      value: "0.60",
    });
    const display = createDisplayElement("cohesion-value", "0.60");
    const capturedValues: Array<number> = [];

    createSliderWithDisplay(slider, display, (value) => {
      capturedValues.push(value);
    });

    slider.value = "0.10";
    slider.dispatchEvent(new Event("input"));

    slider.value = "0.95";
    slider.dispatchEvent(new Event("input"));

    expect(display.textContent).toBe("0.95");
    expect(capturedValues).toEqual([0.1, 0.95]);
  });
});
