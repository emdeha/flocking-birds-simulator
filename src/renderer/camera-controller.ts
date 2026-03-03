import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

type CameraController = {
  readonly controls: OrbitControls;
  readonly update: () => void;
  readonly dispose: () => void;
};

const createCameraController = (
  camera: THREE.PerspectiveCamera,
  domElement: HTMLElement
): CameraController => {
  const controls = new OrbitControls(camera, domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.mouseButtons = {
    LEFT: undefined as unknown as THREE.MOUSE,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.ROTATE,
  };
  controls.enableZoom = true;
  controls.minDistance = 10;
  controls.maxDistance = 1000;

  const update = (): void => {
    controls.update();
  };

  const dispose = (): void => {
    controls.dispose();
  };

  return { controls, update, dispose };
};

export { createCameraController };
export type { CameraController };
