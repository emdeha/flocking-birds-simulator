import { createInitialState } from "./state/simulation-state";
import { updateFlockingParam } from "./state/state-transitions";
import { simulateTick } from "./simulation/tick";
import { createSceneManager } from "./renderer/scene-manager";
import { createBirdRenderer } from "./renderer/bird-renderer";
import { createCameraController } from "./renderer/camera-controller";
import { createSliderBinding } from "./ui/controls-panel";
import { updateStatusBar } from "./ui/status-bar";
import { computeNextFrame, computeFps } from "./loop/game-loop";
import type { SimulationState } from "./types/simulation-types";

const MAX_BIRDS = 200;

const initialize = (): void => {
  const viewportContainer = document.getElementById("viewport");
  const statusBarElement = document.getElementById("status-bar");
  const separationSlider = document.getElementById("separation-slider") as HTMLInputElement | null;

  if (!viewportContainer || !statusBarElement || !separationSlider) {
    throw new Error("Required DOM elements not found");
  }

  let state: SimulationState = createInitialState();

  const sceneManager = createSceneManager(viewportContainer);
  const birdRenderer = createBirdRenderer(sceneManager.scene, MAX_BIRDS);
  const cameraController = createCameraController(
    sceneManager.camera,
    sceneManager.renderer.domElement
  );

  const separationValueDisplay = document.getElementById("separation-value");

  separationSlider.value = String(state.parameters.flocking.separationWeight);

  createSliderBinding(separationSlider, (value: number) => {
    state = updateFlockingParam(state, "separationWeight", value);
    if (separationValueDisplay) {
      separationValueDisplay.textContent = value.toFixed(2);
    }
  });

  let previousTime = performance.now();
  let fps = 60;

  const FPS_SMOOTHING = 0.9;

  const frame = (currentTime: number): void => {
    const deltaTime = (currentTime - previousTime) / 1000;
    const rawFps = computeFps(currentTime, previousTime);
    fps = FPS_SMOOTHING * fps + (1 - FPS_SMOOTHING) * rawFps;
    previousTime = currentTime;

    state = computeNextFrame(state, deltaTime, simulateTick);

    birdRenderer.update(state.birds);
    cameraController.update();
    sceneManager.render();

    updateStatusBar(statusBarElement, {
      birdCount: state.birds.length,
      fps,
    });

    requestAnimationFrame(frame);
  };

  window.addEventListener("resize", () => {
    sceneManager.resize();
  });

  requestAnimationFrame(frame);
};

initialize();
