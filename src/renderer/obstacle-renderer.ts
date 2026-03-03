import * as THREE from "three";
import type { Obstacle } from "../types/simulation-types";

type ObstacleRenderer = {
  readonly update: (obstacles: ReadonlyArray<Obstacle>) => void;
  readonly dispose: () => void;
};

const OBSTACLE_COLOR = 0xff4444;
const OBSTACLE_OPACITY = 0.3;
const SPHERE_SEGMENTS = 16;

const createObstacleRenderer = (scene: THREE.Scene): ObstacleRenderer => {
  const meshes: THREE.Mesh[] = [];
  const material = new THREE.MeshBasicMaterial({
    color: OBSTACLE_COLOR,
    transparent: true,
    opacity: OBSTACLE_OPACITY,
    depthWrite: false,
  });

  const syncMeshCount = (targetCount: number): void => {
    while (meshes.length < targetCount) {
      const geometry = new THREE.SphereGeometry(1, SPHERE_SEGMENTS, SPHERE_SEGMENTS);
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

  const update = (obstacles: ReadonlyArray<Obstacle>): void => {
    syncMeshCount(obstacles.length);

    for (let i = 0; i < obstacles.length; i++) {
      const obstacle = obstacles[i];
      const mesh = meshes[i];
      mesh.position.set(obstacle.position.x, obstacle.position.y, obstacle.position.z);
      mesh.scale.setScalar(obstacle.radius);
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

export { createObstacleRenderer };
export type { ObstacleRenderer };
