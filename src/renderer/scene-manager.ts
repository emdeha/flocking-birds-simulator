import * as THREE from "three";

type SceneManager = {
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;
  readonly renderer: THREE.WebGLRenderer;
  readonly render: () => void;
  readonly resize: () => void;
};

const createSceneManager = (container: HTMLElement): SceneManager => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a2e);

  const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    2000
  );
  camera.position.set(0, 100, 300);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  const gridHelper = new THREE.GridHelper(400, 20, 0x444466, 0x333355);
  scene.add(gridHelper);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const render = (): void => {
    renderer.render(scene, camera);
  };

  const resize = (): void => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };

  return { scene, camera, renderer, render, resize };
};

export { createSceneManager };
export type { SceneManager };
