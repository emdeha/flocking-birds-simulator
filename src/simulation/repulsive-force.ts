import type { Vector3 } from "../types/vector";
import {
  vectorSubtract,
  vectorScale,
  vectorMagnitude,
  vectorNormalize,
  vectorAdd,
} from "../types/vector";

const ZERO: Vector3 = { x: 0, y: 0, z: 0 };

type RepulsiveSource = {
  readonly position: Vector3;
};

const computeRepulsiveForce = <T extends RepulsiveSource>(
  targetPosition: Vector3,
  sources: ReadonlyArray<T>,
  effectiveRadiusFn: (source: T) => number,
  weight: number
): Vector3 => {
  if (sources.length === 0) {
    return ZERO;
  }

  return sources.reduce<Vector3>((acc, source) => {
    const fromSourceToTarget = vectorSubtract(targetPosition, source.position);
    const distance = vectorMagnitude(fromSourceToTarget);
    const effectiveRadius = effectiveRadiusFn(source);

    if (distance >= effectiveRadius || distance === 0) {
      return acc;
    }

    const proximity = 1 - distance / effectiveRadius;
    const direction = vectorNormalize(fromSourceToTarget);
    const force = vectorScale(direction, proximity * weight);

    return vectorAdd(acc, force);
  }, ZERO);
};

export { computeRepulsiveForce };
export type { RepulsiveSource };
