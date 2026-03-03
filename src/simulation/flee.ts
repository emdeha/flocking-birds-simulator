import type { Bird, Predator } from "../types/simulation-types";
import type { Vector3 } from "../types/vector";
import {
  vectorSubtract,
  vectorScale,
  vectorMagnitude,
  vectorNormalize,
  vectorAdd,
} from "../types/vector";

const ZERO: Vector3 = { x: 0, y: 0, z: 0 };

const computePredatorFlee = (
  bird: Bird,
  predators: ReadonlyArray<Predator>,
  fleeRadius: number,
  weight: number
): Vector3 => {
  if (predators.length === 0) {
    return ZERO;
  }

  const totalForce = predators.reduce<Vector3>((acc, predator) => {
    const fromPredatorToBird = vectorSubtract(bird.position, predator.position);
    const distance = vectorMagnitude(fromPredatorToBird);

    if (distance >= fleeRadius || distance === 0) {
      return acc;
    }

    const proximity = 1 - distance / fleeRadius;
    const direction = vectorNormalize(fromPredatorToBird);
    const force = vectorScale(direction, proximity * weight);

    return vectorAdd(acc, force);
  }, ZERO);

  return totalForce;
};

export { computePredatorFlee };
