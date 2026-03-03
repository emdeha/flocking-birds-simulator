import type { Bird, Obstacle } from "../types/simulation-types";
import type { Vector3 } from "../types/vector";
import {
  vectorSubtract,
  vectorScale,
  vectorMagnitude,
  vectorNormalize,
  vectorAdd,
} from "../types/vector";

const ZERO: Vector3 = { x: 0, y: 0, z: 0 };

const computeObstacleAvoidance = (
  bird: Bird,
  obstacles: ReadonlyArray<Obstacle>,
  avoidanceRadius: number,
  weight: number
): Vector3 => {
  if (obstacles.length === 0) {
    return ZERO;
  }

  const totalForce = obstacles.reduce<Vector3>((acc, obstacle) => {
    const fromObstacleToBird = vectorSubtract(bird.position, obstacle.position);
    const distance = vectorMagnitude(fromObstacleToBird);
    const effectiveRadius = avoidanceRadius + obstacle.radius;

    if (distance >= effectiveRadius || distance === 0) {
      return acc;
    }

    const proximity = 1 - distance / effectiveRadius;
    const direction = vectorNormalize(fromObstacleToBird);
    const force = vectorScale(direction, proximity * weight);

    return vectorAdd(acc, force);
  }, ZERO);

  return totalForce;
};

export { computeObstacleAvoidance };
