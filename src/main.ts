import { createInitialState } from "./state/simulation-state";
import { updateFlockingParam, addBird, addBirdRandom, removeBird, addObstacle, clearObstacles, addPredator } from "./state/state-transitions";
import { simulateTick } from "./simulation/tick";
import { createSceneManager } from "./renderer/scene-manager";
import { createBirdRenderer } from "./renderer/bird-renderer";
import { createCameraController } from "./renderer/camera-controller";
import { createSliderWithDisplay, bindBirdButtons } from "./ui/controls-panel";
import { createViewportInputHandler } from "./ui/viewport-input";
import { screenToWorldPosition } from "./renderer/raycaster";
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
  const addBirdBtn = getRequiredElement("add-bird-btn") as HTMLButtonElement;
  const removeBirdBtn = getRequiredElement("remove-bird-btn") as HTMLButtonElement;
  const clearObstaclesBtn = getRequiredElement("clear-obstacles-btn") as HTMLButtonElement;
  const addPredatorBtn = getRequiredElement("add-predator-btn") as HTMLButtonElement;
  const viewportHint = getRequiredElement("viewport-hint");

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

  const updateHintVisibility = (): void => {
    viewportHint.style.display = state.birds.length === 0 ? "block" : "none";
    removeBirdBtn.disabled = state.birds.length === 0;
  };

  bindBirdButtons(addBirdBtn, removeBirdBtn, {
    onAdd: () => {
      if (state.birds.length < MAX_BIRDS) {
        state = addBirdRandom(state);
        updateHintVisibility();
      }
    },
    onRemove: () => {
      state = removeBird(state);
      updateHintVisibility();
    },
  });

  const randomVelocityComponent = (): number => (Math.random() - 0.5) * 4;

  const OBSTACLE_RADIUS_SCALE = 20;

  createViewportInputHandler(sceneManager.renderer.domElement, {
    onClick: (normalizedX: number, normalizedY: number) => {
      if (state.birds.length >= MAX_BIRDS) {
        return;
      }
      const worldPos = screenToWorldPosition(
        normalizedX,
        normalizedY,
        sceneManager.camera.position,
        { x: 0, y: 0, z: 0 },
        sceneManager.camera.fov,
        sceneManager.camera.aspect
      );
      const velocity = {
        x: randomVelocityComponent(),
        y: randomVelocityComponent(),
        z: randomVelocityComponent(),
      };
      state = addBird(state, worldPos, velocity);
      updateHintVisibility();
    },
    onDrag: (centerNormX: number, centerNormY: number, normalizedRadius: number) => {
      const worldPos = screenToWorldPosition(
        centerNormX,
        centerNormY,
        sceneManager.camera.position,
        { x: 0, y: 0, z: 0 },
        sceneManager.camera.fov,
        sceneManager.camera.aspect
      );
      const worldRadius = normalizedRadius * OBSTACLE_RADIUS_SCALE;
      state = addObstacle(state, worldPos, Math.max(worldRadius, 3));
    },
  });

  addPredatorBtn.addEventListener("click", () => {
    const { min, max } = state.parameters.worldBounds;
    const position = {
      x: min.x + Math.random() * (max.x - min.x),
      y: min.y + Math.random() * (max.y - min.y),
      z: min.z + Math.random() * (max.z - min.z),
    };
    state = addPredator(state, position);
  });

  clearObstaclesBtn.addEventListener("click", () => {
    state = clearObstacles(state);
  });

  updateHintVisibility();

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
