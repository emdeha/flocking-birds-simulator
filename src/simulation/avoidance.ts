import type { Bird, Obstacle } from "../types/simulation-types";
import type { Vector3 } from "../types/vector";
import { computeRepulsiveForce } from "./repulsive-force";

const computeObstacleAvoidance = (
  bird: Bird,
  obstacles: ReadonlyArray<Obstacle>,
  avoidanceRadius: number,
  weight: number
): Vector3 =>
  computeRepulsiveForce(
    bird.position,
    obstacles,
    (obstacle) => avoidanceRadius + obstacle.radius,
    weight
  );

export { computeObstacleAvoidance };
