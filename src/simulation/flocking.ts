import type { Bird } from "../types/simulation-types";
import type { Vector3 } from "../types/vector";
import {
  vectorAdd,
  vectorSubtract,
  vectorScale,
  vectorNormalize,
  vectorMagnitude,
} from "../types/vector";

const ZERO: Vector3 = { x: 0, y: 0, z: 0 };

const computeSeparation = (
  bird: Bird,
  neighbors: ReadonlyArray<Bird>,
  separationRadius: number
): Vector3 => {
  const closeNeighbors = neighbors.filter(
    (n) =>
      vectorMagnitude(vectorSubtract(bird.position, n.position)) <
      separationRadius
  );

  if (closeNeighbors.length === 0) return ZERO;

  const steer = closeNeighbors.reduce((acc, neighbor) => {
    const diff = vectorSubtract(bird.position, neighbor.position);
    const dist = vectorMagnitude(diff);
    if (dist === 0) return acc;
    return vectorAdd(acc, vectorScale(vectorNormalize(diff), separationRadius / dist));
  }, ZERO);

  return vectorScale(steer, 1 / closeNeighbors.length);
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
