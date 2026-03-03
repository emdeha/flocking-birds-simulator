import type { Vector3 } from "../types/vector";
import { vectorSubtract, vectorNormalize, vectorAdd, vectorScale } from "../types/vector";

const GROUND_PLANE_Y = 0;

const screenToWorldPosition = (
  normalizedX: number,
  normalizedY: number,
  cameraPosition: Vector3,
  cameraTarget: Vector3,
  fovDegrees: number,
  aspectRatio: number
): Vector3 => {
  const forward = vectorNormalize(vectorSubtract(cameraTarget, cameraPosition));

  const worldUp: Vector3 = { x: 0, y: 1, z: 0 };
  const right = vectorNormalize(cross(forward, worldUp));
  const up = cross(right, forward);

  const fovRadians = (fovDegrees * Math.PI) / 180;
  const halfHeight = Math.tan(fovRadians / 2);
  const halfWidth = halfHeight * aspectRatio;

  const rayDirection = vectorNormalize(
    vectorAdd(
      vectorAdd(forward, vectorScale(right, normalizedX * halfWidth)),
      vectorScale(up, normalizedY * halfHeight)
    )
  );

  const t = (GROUND_PLANE_Y - cameraPosition.y) / rayDirection.y;

  if (t <= 0) {
    return vectorAdd(cameraPosition, vectorScale(forward, 100));
  }

  return vectorAdd(cameraPosition, vectorScale(rayDirection, t));
};

const cross = (a: Vector3, b: Vector3): Vector3 => ({
  x: a.y * b.z - a.z * b.y,
  y: a.z * b.x - a.x * b.z,
  z: a.x * b.y - a.y * b.x,
});

export { screenToWorldPosition };
