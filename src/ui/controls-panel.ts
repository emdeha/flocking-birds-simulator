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

export { createSliderBinding, createSliderWithDisplay };
