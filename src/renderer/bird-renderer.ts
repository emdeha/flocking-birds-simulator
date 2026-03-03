import * as THREE from "three";
import type { Bird } from "../types/simulation-types";

type BirdRenderer = {
  readonly update: (birds: ReadonlyArray<Bird>) => void;
  readonly dispose: () => void;
};

const VELOCITY_LINE_SCALE = 5;

const createBirdRenderer = (scene: THREE.Scene, maxBirds: number): BirdRenderer => {
  const pointGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(maxBirds * 3);
  pointGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  pointGeometry.setDrawRange(0, 0);

  const pointMaterial = new THREE.PointsMaterial({
    color: 0x00ccff,
    size: 5,
    sizeAttenuation: true,
  });
  const points = new THREE.Points(pointGeometry, pointMaterial);
  scene.add(points);

  const lineGeometry = new THREE.BufferGeometry();
  const linePositions = new Float32Array(maxBirds * 6);
  lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
  lineGeometry.setDrawRange(0, 0);

  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff88, linewidth: 1 });
  const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lines);

  const update = (birds: ReadonlyArray<Bird>): void => {
    const birdCount = Math.min(birds.length, maxBirds);

    const posAttr = pointGeometry.getAttribute("position") as THREE.BufferAttribute;
    const lineAttr = lineGeometry.getAttribute("position") as THREE.BufferAttribute;

    for (let i = 0; i < birdCount; i++) {
      const bird = birds[i];

      posAttr.array[i * 3] = bird.position.x;
      posAttr.array[i * 3 + 1] = bird.position.y;
      posAttr.array[i * 3 + 2] = bird.position.z;

      lineAttr.array[i * 6] = bird.position.x;
      lineAttr.array[i * 6 + 1] = bird.position.y;
      lineAttr.array[i * 6 + 2] = bird.position.z;
      lineAttr.array[i * 6 + 3] = bird.position.x + bird.velocity.x * VELOCITY_LINE_SCALE;
      lineAttr.array[i * 6 + 4] = bird.position.y + bird.velocity.y * VELOCITY_LINE_SCALE;
      lineAttr.array[i * 6 + 5] = bird.position.z + bird.velocity.z * VELOCITY_LINE_SCALE;
    }

    posAttr.needsUpdate = true;
    lineAttr.needsUpdate = true;
    pointGeometry.setDrawRange(0, birdCount);
    lineGeometry.setDrawRange(0, birdCount * 2);
  };

  const dispose = (): void => {
    scene.remove(points);
    scene.remove(lines);
    pointGeometry.dispose();
    pointMaterial.dispose();
    lineGeometry.dispose();
    lineMaterial.dispose();
  };

  return { update, dispose };
};

export { createBirdRenderer };
export type { BirdRenderer };
