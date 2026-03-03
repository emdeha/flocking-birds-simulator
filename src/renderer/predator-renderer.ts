import * as THREE from "three";
import type { Predator } from "../types/simulation-types";

type PredatorRenderer = {
  readonly update: (predators: ReadonlyArray<Predator>) => void;
  readonly dispose: () => void;
};

const PREDATOR_COLOR = 0xff0000;
const PREDATOR_RADIUS = 4;
const PREDATOR_HEIGHT = 10;
const CONE_RADIAL_SEGMENTS = 8;

const createPredatorRenderer = (scene: THREE.Scene): PredatorRenderer => {
  const meshes: THREE.Mesh[] = [];
  const material = new THREE.MeshBasicMaterial({ color: PREDATOR_COLOR });

  const syncMeshCount = (targetCount: number): void => {
    while (meshes.length < targetCount) {
      const geometry = new THREE.ConeGeometry(
        PREDATOR_RADIUS,
        PREDATOR_HEIGHT,
        CONE_RADIAL_SEGMENTS
      );
      const mesh = new THREE.Mesh(geometry, material);
      meshes.push(mesh);
      scene.add(mesh);
    }

    while (meshes.length > targetCount) {
      const mesh = meshes.pop();
      if (mesh) {
        scene.remove(mesh);
        mesh.geometry.dispose();
      }
    }
  };

  const update = (predators: ReadonlyArray<Predator>): void => {
    syncMeshCount(predators.length);

    for (let i = 0; i < predators.length; i++) {
      const predator = predators[i];
      const mesh = meshes[i];
      mesh.position.set(predator.position.x, predator.position.y, predator.position.z);
    }
  };

  const dispose = (): void => {
    for (const mesh of meshes) {
      scene.remove(mesh);
      mesh.geometry.dispose();
    }
    meshes.length = 0;
    material.dispose();
  };

  return { update, dispose };
};

export { createPredatorRenderer };
export type { PredatorRenderer };
