import type { Bird, WorldBounds } from "../types/simulation-types";
import type { Vector3 } from "../types/vector";
import {
  vectorAdd,
  vectorScale,
  vectorMagnitude,
  vectorNormalize,
} from "../types/vector";

const clampMagnitude = (v: Vector3, max: number): Vector3 => {
  const mag = vectorMagnitude(v);
  if (mag <= max) return v;
  return vectorScale(vectorNormalize(v), max);
};

const wrapAxis = (value: number, min: number, max: number): number => {
  const range = max - min;
  if (value > max) return min + ((value - min) % range);
  if (value < min) return max - ((min - value) % range);
  return value;
};

const wrapPosition = (position: Vector3, bounds: WorldBounds): Vector3 => ({
  x: wrapAxis(position.x, bounds.min.x, bounds.max.x),
  y: wrapAxis(position.y, bounds.min.y, bounds.max.y),
  z: wrapAxis(position.z, bounds.min.z, bounds.max.z),
});

const integrateBird = (
  bird: Bird,
  force: Vector3,
  deltaTime: number,
  maxSpeed: number,
  maxForce: number,
  worldBounds: WorldBounds
): Bird => {
  const clampedForce = clampMagnitude(force, maxForce);
  const newVelocity = clampMagnitude(
    vectorAdd(bird.velocity, vectorScale(clampedForce, deltaTime * 60)),
    maxSpeed
  );
  const newPosition = wrapPosition(
    vectorAdd(bird.position, vectorScale(newVelocity, deltaTime * 60)),
    worldBounds
  );

  return { position: newPosition, velocity: newVelocity };
};

export { integrateBird };
