import { describe, it, expect } from "vitest";
import { createSliderBinding } from "./controls-panel";

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
