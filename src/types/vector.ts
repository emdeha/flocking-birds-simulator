type Vector3 = {
  readonly x: number;
  readonly y: number;
  readonly z: number;
};

const vectorAdd = (a: Vector3, b: Vector3): Vector3 => ({
  x: a.x + b.x,
  y: a.y + b.y,
  z: a.z + b.z,
});

const vectorSubtract = (a: Vector3, b: Vector3): Vector3 => ({
  x: a.x - b.x,
  y: a.y - b.y,
  z: a.z - b.z,
});

const vectorScale = (v: Vector3, scalar: number): Vector3 => ({
  x: v.x * scalar,
  y: v.y * scalar,
  z: v.z * scalar,
});

const vectorMagnitude = (v: Vector3): number =>
  Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);

const vectorNormalize = (v: Vector3): Vector3 => {
  const mag = vectorMagnitude(v);
  if (mag === 0) return { x: 0, y: 0, z: 0 };
  return vectorScale(v, 1 / mag);
};

const vectorDistance = (a: Vector3, b: Vector3): number =>
  vectorMagnitude(vectorSubtract(a, b));

export type { Vector3 };

export {
  vectorAdd,
  vectorSubtract,
  vectorScale,
  vectorMagnitude,
  vectorNormalize,
  vectorDistance,
};
