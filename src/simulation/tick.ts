import type { SimulationState, Bird } from "../types/simulation-types";
import type { Vector3 } from "../types/vector";
import { vectorScale } from "../types/vector";
import { buildSpatialGrid, queryNeighbors } from "./spatial-index";
import {
  computeSeparation,
  computeAlignment,
  computeCohesion,
} from "./flocking";
import { integrateBird } from "./integrator";
import { computeObstacleAvoidance } from "./avoidance";
import { computePredatorFlee } from "./flee";

const simulateTick = (
  state: SimulationState,
  deltaTime: number
): SimulationState => {
  if (state.playbackState === "paused") {
    return state;
  }

  const { birds, obstacles, predators, parameters } = state;
  const { flocking, neighborRadius, separationRadius, maxSpeed, maxForce, worldBounds,
    obstacleAvoidanceRadius, obstacleAvoidanceWeight,
    predatorFleeRadius, predatorFleeWeight } =
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
    const flee = computePredatorFlee(bird, predators, predatorFleeRadius, predatorFleeWeight);

    const sepForce = vectorScale(separation, flocking.separationWeight);
    const alignForce = vectorScale(alignment, flocking.alignmentWeight);
    const cohForce = vectorScale(cohesion, flocking.cohesionWeight);

    const combinedForce: Vector3 = {
      x: sepForce.x + alignForce.x + cohForce.x + avoidance.x + flee.x,
      y: sepForce.y + alignForce.y + cohForce.y + avoidance.y + flee.y,
      z: sepForce.z + alignForce.z + cohForce.z + avoidance.z + flee.z,
    };

    return integrateBird(bird, combinedForce, deltaTime, maxSpeed, maxForce, worldBounds);
  });

  return { ...state, birds: updatedBirds };
};

export { simulateTick };
