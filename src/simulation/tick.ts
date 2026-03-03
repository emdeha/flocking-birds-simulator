import type { SimulationState, Bird } from "../types/simulation-types";
import type { Vector3 } from "../types/vector";
import { vectorAdd, vectorScale } from "../types/vector";
import { buildSpatialGrid, queryNeighbors } from "./spatial-index";
import {
  computeSeparation,
  computeAlignment,
  computeCohesion,
} from "./flocking";
import { integrateBird } from "./integrator";
import { computeObstacleAvoidance } from "./avoidance";

const ZERO: Vector3 = { x: 0, y: 0, z: 0 };

const simulateTick = (
  state: SimulationState,
  deltaTime: number
): SimulationState => {
  const { birds, obstacles, parameters } = state;
  const { flocking, neighborRadius, separationRadius, maxSpeed, maxForce, worldBounds,
    obstacleAvoidanceRadius, obstacleAvoidanceWeight } =
    parameters;

  const positions = birds.map((b) => b.position);
  const grid = buildSpatialGrid(positions, neighborRadius);

  const updatedBirds: ReadonlyArray<Bird> = birds.map((bird, index) => {
    const neighborIndices = queryNeighbors(grid, positions, index, neighborRadius);
    const neighborBirds = neighborIndices.map((i) => birds[i]);

    const separation = computeSeparation(bird, neighborBirds, separationRadius);
    const alignment = computeAlignment(bird, neighborBirds);
    const cohesion = computeCohesion(bird, neighborBirds);
    const avoidance = computeObstacleAvoidance(bird, obstacles, obstacleAvoidanceRadius, obstacleAvoidanceWeight);

    const combinedForce = [
      vectorScale(separation, flocking.separationWeight),
      vectorScale(alignment, flocking.alignmentWeight),
      vectorScale(cohesion, flocking.cohesionWeight),
      avoidance,
    ].reduce((acc, f) => vectorAdd(acc, f), ZERO);

    return integrateBird(bird, combinedForce, deltaTime, maxSpeed, maxForce, worldBounds);
  });

  return { ...state, birds: updatedBirds };
};

export { simulateTick };
