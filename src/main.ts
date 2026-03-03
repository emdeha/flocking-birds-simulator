import { createInitialState } from "./state/simulation-state";
import { updateFlockingParam, addBird, addBirdRandom, removeBird, addObstacle, clearObstacles, addPredator, togglePlayback, setSpeed, resetState } from "./state/state-transitions";
import { simulateTick } from "./simulation/tick";
import { createSceneManager } from "./renderer/scene-manager";
import { createBirdRenderer } from "./renderer/bird-renderer";
import { createObstacleRenderer } from "./renderer/obstacle-renderer";
import { createPredatorRenderer } from "./renderer/predator-renderer";
import { createCameraController } from "./renderer/camera-controller";
import { createSliderWithDisplay, bindBirdButtons, bindPlayPauseButton, bindSpeedSlider, bindResetButton } from "./ui/controls-panel";
import { createViewportInputHandler } from "./ui/viewport-input";
import { screenToWorldPosition } from "./renderer/raycaster";
import { updateStatusBar } from "./ui/status-bar";
import { computeNextFrame, computeFps } from "./loop/game-loop";
import type { SimulationState } from "./types/simulation-types";
import type { FlockingParameters } from "./types/simulation-types";

const MAX_BIRDS = 1000;
const FPS_SMOOTHING = 0.9;
const OBSTACLE_RADIUS_SCALE = 50;

const getRequiredElement = (id: string): HTMLElement => {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Required DOM element not found: ${id}`);
  }
  return element;
};

type DomElements = {
  readonly viewportContainer: HTMLElement;
  readonly statusBarElement: HTMLElement;
  readonly separationSlider: HTMLInputElement;
  readonly separationDisplay: HTMLElement;
  readonly alignmentSlider: HTMLInputElement;
  readonly alignmentDisplay: HTMLElement;
  readonly cohesionSlider: HTMLInputElement;
  readonly cohesionDisplay: HTMLElement;
  readonly playPauseBtn: HTMLButtonElement;
  readonly speedSlider: HTMLInputElement;
  readonly speedDisplay: HTMLElement;
  readonly addBirdBtn: HTMLButtonElement;
  readonly removeBirdBtn: HTMLButtonElement;
  readonly clearObstaclesBtn: HTMLButtonElement;
  readonly addPredatorBtn: HTMLButtonElement;
  readonly resetBtn: HTMLButtonElement;
  readonly viewportHint: HTMLElement;
};

const queryDomElements = (): DomElements => ({
  viewportContainer: getRequiredElement("viewport"),
  statusBarElement: getRequiredElement("status-bar"),
  separationSlider: getRequiredElement("separation-slider") as HTMLInputElement,
  separationDisplay: getRequiredElement("separation-value"),
  alignmentSlider: getRequiredElement("alignment-slider") as HTMLInputElement,
  alignmentDisplay: getRequiredElement("alignment-value"),
  cohesionSlider: getRequiredElement("cohesion-slider") as HTMLInputElement,
  cohesionDisplay: getRequiredElement("cohesion-value"),
  playPauseBtn: getRequiredElement("play-pause-btn") as HTMLButtonElement,
  speedSlider: getRequiredElement("speed-slider") as HTMLInputElement,
  speedDisplay: getRequiredElement("speed-value"),
  addBirdBtn: getRequiredElement("add-bird-btn") as HTMLButtonElement,
  removeBirdBtn: getRequiredElement("remove-bird-btn") as HTMLButtonElement,
  clearObstaclesBtn: getRequiredElement("clear-obstacles-btn") as HTMLButtonElement,
  addPredatorBtn: getRequiredElement("add-predator-btn") as HTMLButtonElement,
  resetBtn: getRequiredElement("reset-btn") as HTMLButtonElement,
  viewportHint: getRequiredElement("viewport-hint"),
});

type StateRef = {
  current: SimulationState;
};

const setupFlockingSliders = (
  elements: DomElements,
  stateRef: StateRef
): void => {
  const bindFlockingSlider = (
    slider: HTMLInputElement,
    display: HTMLElement,
    paramName: keyof FlockingParameters
  ): void => {
    slider.value = String(stateRef.current.parameters.flocking[paramName]);
    createSliderWithDisplay(slider, display, (value: number) => {
      stateRef.current = updateFlockingParam(stateRef.current, paramName, value);
    });
  };

  bindFlockingSlider(elements.separationSlider, elements.separationDisplay, "separationWeight");
  bindFlockingSlider(elements.alignmentSlider, elements.alignmentDisplay, "alignmentWeight");
  bindFlockingSlider(elements.cohesionSlider, elements.cohesionDisplay, "cohesionWeight");
};

const setupPlaybackControls = (
  elements: DomElements,
  stateRef: StateRef
): void => {
  bindPlayPauseButton(elements.playPauseBtn, () => {
    stateRef.current = togglePlayback(stateRef.current);
    elements.playPauseBtn.textContent = stateRef.current.playbackState === "running" ? "Pause" : "Play";
  });

  bindSpeedSlider(elements.speedSlider, elements.speedDisplay, (value: number) => {
    stateRef.current = setSpeed(stateRef.current, value);
  });
};

const setupBirdManagement = (
  elements: DomElements,
  stateRef: StateRef,
  updateHintVisibility: () => void
): void => {
  bindBirdButtons(elements.addBirdBtn, elements.removeBirdBtn, {
    onAdd: () => {
      if (stateRef.current.birds.length < MAX_BIRDS) {
        stateRef.current = addBirdRandom(stateRef.current);
        updateHintVisibility();
      }
    },
    onRemove: () => {
      stateRef.current = removeBird(stateRef.current);
      updateHintVisibility();
    },
  });
};

const randomVelocityComponent = (): number => (Math.random() - 0.5) * 4;

const setupViewportInput = (
  canvas: HTMLCanvasElement,
  sceneManager: ReturnType<typeof createSceneManager>,
  stateRef: StateRef,
  updateHintVisibility: () => void
): void => {
  createViewportInputHandler(canvas, {
    onClick: (normalizedX: number, normalizedY: number) => {
      if (stateRef.current.birds.length >= MAX_BIRDS) {
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
      stateRef.current = addBird(stateRef.current, worldPos, velocity);
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
      stateRef.current = addObstacle(stateRef.current, worldPos, Math.max(worldRadius, 3));
    },
  });
};

const setupEntityButtons = (
  elements: DomElements,
  stateRef: StateRef
): void => {
  elements.addPredatorBtn.addEventListener("click", () => {
    const { min, max } = stateRef.current.parameters.worldBounds;
    const position = {
      x: min.x + Math.random() * (max.x - min.x),
      y: min.y + Math.random() * (max.y - min.y),
      z: min.z + Math.random() * (max.z - min.z),
    };
    stateRef.current = addPredator(stateRef.current, position);
  });

  elements.clearObstaclesBtn.addEventListener("click", () => {
    stateRef.current = clearObstacles(stateRef.current);
  });
};

const syncSlidersToState = (
  elements: DomElements,
  stateRef: StateRef
): void => {
  elements.separationSlider.value = String(stateRef.current.parameters.flocking.separationWeight);
  elements.separationDisplay.textContent = stateRef.current.parameters.flocking.separationWeight.toFixed(2);
  elements.alignmentSlider.value = String(stateRef.current.parameters.flocking.alignmentWeight);
  elements.alignmentDisplay.textContent = stateRef.current.parameters.flocking.alignmentWeight.toFixed(2);
  elements.cohesionSlider.value = String(stateRef.current.parameters.flocking.cohesionWeight);
  elements.cohesionDisplay.textContent = stateRef.current.parameters.flocking.cohesionWeight.toFixed(2);
  elements.speedSlider.value = String(stateRef.current.simulationSpeed);
  elements.speedDisplay.textContent = `${stateRef.current.simulationSpeed.toFixed(2)}x`;
  elements.playPauseBtn.textContent = stateRef.current.playbackState === "running" ? "Pause" : "Play";
};

const startFrameLoop = (
  stateRef: StateRef,
  sceneManager: ReturnType<typeof createSceneManager>,
  birdRenderer: ReturnType<typeof createBirdRenderer>,
  obstacleRenderer: ReturnType<typeof createObstacleRenderer>,
  predatorRenderer: ReturnType<typeof createPredatorRenderer>,
  cameraController: ReturnType<typeof createCameraController>,
  statusBarElement: HTMLElement
): void => {
  let previousTime = performance.now();
  let fps = 60;

  const frame = (currentTime: number): void => {
    const deltaTime = (currentTime - previousTime) / 1000;
    const rawFps = computeFps(currentTime, previousTime);
    fps = FPS_SMOOTHING * fps + (1 - FPS_SMOOTHING) * rawFps;
    previousTime = currentTime;

    stateRef.current = computeNextFrame(stateRef.current, deltaTime, simulateTick);

    birdRenderer.update(stateRef.current.birds);
    obstacleRenderer.update(stateRef.current.obstacles);
    predatorRenderer.update(stateRef.current.predators);
    cameraController.update();
    sceneManager.render();

    updateStatusBar(statusBarElement, {
      birdCount: stateRef.current.birds.length,
      predatorCount: stateRef.current.predators.length,
      obstacleCount: stateRef.current.obstacles.length,
      fps,
    });

    requestAnimationFrame(frame);
  };

  requestAnimationFrame(frame);
};

const initialize = (): void => {
  const elements = queryDomElements();
  const stateRef: StateRef = { current: createInitialState() };

  const sceneManager = createSceneManager(elements.viewportContainer);
  const birdRenderer = createBirdRenderer(sceneManager.scene, MAX_BIRDS);
  const obstacleRenderer = createObstacleRenderer(sceneManager.scene);
  const predatorRenderer = createPredatorRenderer(sceneManager.scene);
  const cameraController = createCameraController(
    sceneManager.camera,
    sceneManager.renderer.domElement
  );

  const updateHintVisibility = (): void => {
    elements.viewportHint.style.display = stateRef.current.birds.length === 0 ? "block" : "none";
    elements.removeBirdBtn.disabled = stateRef.current.birds.length === 0;
  };

  setupFlockingSliders(elements, stateRef);
  setupPlaybackControls(elements, stateRef);
  setupBirdManagement(elements, stateRef, updateHintVisibility);
  setupViewportInput(sceneManager.renderer.domElement, sceneManager, stateRef, updateHintVisibility);
  setupEntityButtons(elements, stateRef);

  bindResetButton(elements.resetBtn, () => {
    stateRef.current = resetState();
    syncSlidersToState(elements, stateRef);
    updateHintVisibility();
  });

  updateHintVisibility();

  window.addEventListener("resize", () => {
    sceneManager.resize();
  });

  startFrameLoop(stateRef, sceneManager, birdRenderer, obstacleRenderer, predatorRenderer, cameraController, elements.statusBarElement);
};

initialize();
