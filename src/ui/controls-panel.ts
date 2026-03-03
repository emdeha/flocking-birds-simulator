const createSliderBinding = (
  slider: HTMLInputElement,
  onChange: (value: number) => void
): void => {
  slider.addEventListener("input", () => {
    onChange(parseFloat(slider.value));
  });
};

export { createSliderBinding };
