import type { Vector3 } from "./vector";

type Bird = {
  readonly position: Vector3;
  readonly velocity: Vector3;
};

type Obstacle = {
  readonly position: Vector3;
  readonly radius: number;
};

type Predator = {
  readonly position: Vector3;
};

type FlockingParameters = {
  readonly separationWeight: number;
  readonly alignmentWeight: number;
  readonly cohesionWeight: number;
};

type WorldBounds = {
  readonly min: Vector3;
  readonly max: Vector3;
};

type SimulationParameters = {
  readonly flocking: FlockingParameters;
  readonly neighborRadius: number;
  readonly separationRadius: number;
  readonly maxSpeed: number;
  readonly maxForce: number;
  readonly obstacleAvoidanceRadius: number;
  readonly obstacleAvoidanceWeight: number;
  readonly predatorFleeRadius: number;
  readonly predatorFleeWeight: number;
  readonly worldBounds: WorldBounds;
};

type PlaybackState = "running" | "paused";

type SimulationState = {
  readonly birds: ReadonlyArray<Bird>;
  readonly obstacles: ReadonlyArray<Obstacle>;
  readonly predators: ReadonlyArray<Predator>;
  readonly parameters: SimulationParameters;
  readonly playbackState: PlaybackState;
  readonly simulationSpeed: number;
};

export type {
  Bird,
  Obstacle,
  Predator,
  FlockingParameters,
  WorldBounds,
  SimulationParameters,
  PlaybackState,
  SimulationState,
};
