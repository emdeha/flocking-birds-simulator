import type { Bird } from "../types/simulation-types";
import type { Vector3 } from "../types/vector";
import {
  vectorAdd,
  vectorSubtract,
  vectorScale,
  vectorNormalize,
} from "../types/vector";

const ZERO: Vector3 = { x: 0, y: 0, z: 0 };

const computeSeparation = (
  bird: Bird,
  neighbors: ReadonlyArray<Bird>,
  separationRadius: number
): Vector3 => {
  const sepRadiusSq = separationRadius * separationRadius;
  let steerX = 0;
  let steerY = 0;
  let steerZ = 0;
  let closeCount = 0;

  for (let i = 0; i < neighbors.length; i++) {
    const n = neighbors[i];
    const dx = bird.position.x - n.position.x;
    const dy = bird.position.y - n.position.y;
    const dz = bird.position.z - n.position.z;
    const distSq = dx * dx + dy * dy + dz * dz;

    if (distSq >= sepRadiusSq || distSq === 0) continue;

    const dist = Math.sqrt(distSq);
    const scale = separationRadius / (dist * dist);
    steerX += dx * scale;
    steerY += dy * scale;
    steerZ += dz * scale;
    closeCount++;
  }

  if (closeCount === 0) return ZERO;

  const invCount = 1 / closeCount;
  return { x: steerX * invCount, y: steerY * invCount, z: steerZ * invCount };
};

const computeAlignment = (
  bird: Bird,
  neighbors: ReadonlyArray<Bird>
): Vector3 => {
  if (neighbors.length === 0) return ZERO;

  const avgVelocity = vectorScale(
    neighbors.reduce((acc, n) => vectorAdd(acc, n.velocity), ZERO),
    1 / neighbors.length
  );

  return vectorNormalize(vectorSubtract(avgVelocity, bird.velocity));
};

const computeCohesion = (
  bird: Bird,
  neighbors: ReadonlyArray<Bird>
): Vector3 => {
  if (neighbors.length === 0) return ZERO;

  const center = vectorScale(
    neighbors.reduce((acc, n) => vectorAdd(acc, n.position), ZERO),
    1 / neighbors.length
  );

  const toCenter = vectorSubtract(center, bird.position);
  return vectorNormalize(toCenter);
};

export { computeSeparation, computeAlignment, computeCohesion };
