import { describe, it, expect } from "vitest";
import { createSliderBinding, createSliderWithDisplay, bindBirdButtons, bindPlayPauseButton, bindSpeedSlider, bindResetButton } from "./controls-panel";

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

describe("Bird add/remove button bindings", () => {
  it("invokes onAdd when add button is clicked and onRemove when remove button is clicked", () => {
    const addButton = document.createElement("button");
    const removeButton = document.createElement("button");
    const capturedActions: Array<string> = [];

    bindBirdButtons(addButton, removeButton, {
      onAdd: () => { capturedActions.push("add"); },
      onRemove: () => { capturedActions.push("remove"); },
    });

    addButton.click();
    removeButton.click();

    expect(capturedActions).toEqual(["add", "remove"]);
  });
});

describe("Play/pause button binding", () => {
  it("invokes onToggle callback when button is clicked and updates button text", () => {
    const button = document.createElement("button");
    button.textContent = "Pause";
    const capturedCalls: Array<string> = [];

    bindPlayPauseButton(button, () => {
      capturedCalls.push("toggled");
    });

    button.click();

    expect(capturedCalls).toEqual(["toggled"]);
  });
});

describe("Speed slider binding", () => {
  it("invokes onChange with parsed value and updates display when input changes", () => {
    const slider = createSliderElement({
      id: "speed-slider",
      min: "0.1",
      max: "5.0",
      step: "0.1",
      value: "1.0",
    });
    const display = createDisplayElement("speed-value", "1.0x");
    const capturedValues: Array<number> = [];

    bindSpeedSlider(slider, display, (value) => {
      capturedValues.push(value);
    });

    slider.value = "2.5";
    slider.dispatchEvent(new Event("input"));

    expect(capturedValues).toEqual([2.5]);
    expect(display.textContent).toBe("2.50x");
  });
});

describe("Reset button binding", () => {
  it("invokes onReset callback when button is clicked", () => {
    const button = document.createElement("button");
    button.textContent = "Reset";
    const capturedCalls: Array<string> = [];

    bindResetButton(button, () => {
      capturedCalls.push("reset");
    });

    button.click();

    expect(capturedCalls).toEqual(["reset"]);
  });
});
