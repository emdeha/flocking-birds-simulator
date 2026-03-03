import type { Bird, Predator } from "../types/simulation-types";
import type { Vector3 } from "../types/vector";
import { computeRepulsiveForce } from "./repulsive-force";

const computePredatorFlee = (
  bird: Bird,
  predators: ReadonlyArray<Predator>,
  fleeRadius: number,
  weight: number
): Vector3 =>
  computeRepulsiveForce(
    bird.position,
    predators,
    () => fleeRadius,
    weight
  );

export { computePredatorFlee };
