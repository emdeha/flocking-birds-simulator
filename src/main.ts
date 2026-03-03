import { createInitialState } from "./state/simulation-state";
import { updateFlockingParam } from "./state/state-transitions";
import { simulateTick } from "./simulation/tick";
import { createSceneManager } from "./renderer/scene-manager";
import { createBirdRenderer } from "./renderer/bird-renderer";
import { createCameraController } from "./renderer/camera-controller";
import { createSliderWithDisplay } from "./ui/controls-panel";
import { updateStatusBar } from "./ui/status-bar";
import { computeNextFrame, computeFps } from "./loop/game-loop";
import type { SimulationState } from "./types/simulation-types";
import type { FlockingParameters } from "./types/simulation-types";

const MAX_BIRDS = 200;

const getRequiredElement = (id: string): HTMLElement => {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Required DOM element not found: ${id}`);
  }
  return element;
};

const initialize = (): void => {
  const viewportContainer = getRequiredElement("viewport");
  const statusBarElement = getRequiredElement("status-bar");
  const separationSlider = getRequiredElement("separation-slider") as HTMLInputElement;
  const separationDisplay = getRequiredElement("separation-value");
  const alignmentSlider = getRequiredElement("alignment-slider") as HTMLInputElement;
  const alignmentDisplay = getRequiredElement("alignment-value");
  const cohesionSlider = getRequiredElement("cohesion-slider") as HTMLInputElement;
  const cohesionDisplay = getRequiredElement("cohesion-value");

  let state: SimulationState = createInitialState();

  const sceneManager = createSceneManager(viewportContainer);
  const birdRenderer = createBirdRenderer(sceneManager.scene, MAX_BIRDS);
  const cameraController = createCameraController(
    sceneManager.camera,
    sceneManager.renderer.domElement
  );

  const bindFlockingSlider = (
    slider: HTMLInputElement,
    display: HTMLElement,
    paramName: keyof FlockingParameters
  ): void => {
    slider.value = String(state.parameters.flocking[paramName]);
    createSliderWithDisplay(slider, display, (value: number) => {
      state = updateFlockingParam(state, paramName, value);
    });
  };

  bindFlockingSlider(separationSlider, separationDisplay, "separationWeight");
  bindFlockingSlider(alignmentSlider, alignmentDisplay, "alignmentWeight");
  bindFlockingSlider(cohesionSlider, cohesionDisplay, "cohesionWeight");

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
      predatorCount: state.predators.length,
      obstacleCount: state.obstacles.length,
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
