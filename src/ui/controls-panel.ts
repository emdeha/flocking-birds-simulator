const createSliderBinding = (
  slider: HTMLInputElement,
  onChange: (value: number) => void
): void => {
  slider.addEventListener("input", () => {
    onChange(parseFloat(slider.value));
  });
};

const createSliderWithDisplay = (
  slider: HTMLInputElement,
  display: HTMLElement,
  onChange: (value: number) => void
): void => {
  createSliderBinding(slider, (value) => {
    display.textContent = value.toFixed(2);
    onChange(value);
  });
};

type BirdButtonCallbacks = {
  readonly onAdd: () => void;
  readonly onRemove: () => void;
};

const bindBirdButtons = (
  addButton: HTMLButtonElement,
  removeButton: HTMLButtonElement,
  callbacks: BirdButtonCallbacks
): void => {
  addButton.addEventListener("click", () => {
    callbacks.onAdd();
  });

  removeButton.addEventListener("click", () => {
    callbacks.onRemove();
  });
};

export { createSliderBinding, createSliderWithDisplay, bindBirdButtons };
