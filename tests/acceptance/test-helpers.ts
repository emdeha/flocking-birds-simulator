/**
 * Shared test helpers and factory functions for acceptance tests.
 *
 * These factories create deterministic test data for simulation state.
 * All functions return immutable data. No mutable shared state.
 *
 * DRIVING PORTS EXERCISED:
 *   - SimulationPort: simulateTick(state, deltaTime) -> nextState
 *   - State transitions: createInitialState, addBird, removeBird,
 *     updateFlockingParam, addObstacle, clearObstacles, addPredator,
 *     togglePlayback, setSpeed, resetState
 *   - InputPort: UI event handlers that write to state store
 */

// -- Vector3 Factory --

type Vector3 = {
  readonly x: number;
  readonly y: number;
  readonly z: number;
};

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

type PlaybackState = "running" | "paused";

type SimulationState = {
  readonly birds: ReadonlyArray<Bird>;
  readonly obstacles: ReadonlyArray<Obstacle>;
  readonly predators: ReadonlyArray<Predator>;
  readonly parameters: {
    readonly flocking: FlockingParameters;
    readonly neighborRadius: number;
    readonly separationRadius: number;
    readonly maxSpeed: number;
    readonly maxForce: number;
    readonly obstacleAvoidanceRadius: number;
    readonly obstacleAvoidanceWeight: number;
    readonly predatorFleeRadius: number;
    readonly predatorFleeWeight: number;
    readonly worldBounds: {
      readonly min: Vector3;
      readonly max: Vector3;
    };
  };
  readonly playbackState: PlaybackState;
  readonly simulationSpeed: number;
};

type SimulationMetrics = {
  readonly birdCount: number;
  readonly predatorCount: number;
  readonly obstacleCount: number;
  readonly fps: number;
};

// -- Factory Functions --

const createVector3 = (
  overrides?: Partial<Vector3>
): Vector3 => ({
  x: 0,
  y: 0,
  z: 0,
  ...overrides,
});

const createBird = (
  overrides?: Partial<Bird>
): Bird => ({
  position: createVector3(overrides?.position),
  velocity: createVector3({ x: 1, y: 0, z: 0, ...overrides?.velocity }),
});

const createObstacle = (
  overrides?: Partial<Obstacle>
): Obstacle => ({
  position: createVector3(overrides?.position),
  radius: overrides?.radius ?? 5,
});

const createPredator = (
  overrides?: Partial<Predator>
): Predator => ({
  position: createVector3(overrides?.position),
});

const createDefaultFlockingParameters = (
  overrides?: Partial<FlockingParameters>
): FlockingParameters => ({
  separationWeight: 0.5,
  alignmentWeight: 0.7,
  cohesionWeight: 0.6,
  ...overrides,
});

const createBirds = (
  count: number,
  birdFactory?: (index: number) => Bird
): ReadonlyArray<Bird> => {
  const factory = birdFactory ?? ((i: number) =>
    createBird({
      position: { x: i * 10, y: i * 5, z: i * 3 },
      velocity: { x: 1, y: 0.5, z: -0.2 },
    })
  );
  return Array.from({ length: count }, (_, i) => factory(i));
};

const createSimulationState = (
  overrides?: Partial<SimulationState>
): SimulationState => ({
  birds: overrides?.birds ?? createBirds(10),
  obstacles: overrides?.obstacles ?? [],
  predators: overrides?.predators ?? [],
  parameters: {
    flocking: createDefaultFlockingParameters(overrides?.parameters?.flocking),
    neighborRadius: overrides?.parameters?.neighborRadius ?? 50,
    separationRadius: overrides?.parameters?.separationRadius ?? 25,
    maxSpeed: overrides?.parameters?.maxSpeed ?? 4,
    maxForce: overrides?.parameters?.maxForce ?? 0.1,
    obstacleAvoidanceRadius: overrides?.parameters?.obstacleAvoidanceRadius ?? 30,
    obstacleAvoidanceWeight: overrides?.parameters?.obstacleAvoidanceWeight ?? 1.5,
    predatorFleeRadius: overrides?.parameters?.predatorFleeRadius ?? 80,
    predatorFleeWeight: overrides?.parameters?.predatorFleeWeight ?? 3.0,
    worldBounds: overrides?.parameters?.worldBounds ?? {
      min: createVector3({ x: -200, y: -200, z: -200 }),
      max: createVector3({ x: 200, y: 200, z: 200 }),
    },
  },
  playbackState: overrides?.playbackState ?? "running",
  simulationSpeed: overrides?.simulationSpeed ?? 1.0,
});

const createMetrics = (
  overrides?: Partial<SimulationMetrics>
): SimulationMetrics => ({
  birdCount: overrides?.birdCount ?? 50,
  predatorCount: overrides?.predatorCount ?? 0,
  obstacleCount: overrides?.obstacleCount ?? 0,
  fps: overrides?.fps ?? 60,
});

// -- Assertion Helpers --

const vectorMagnitude = (v: Vector3): number =>
  Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);

const vectorDistance = (a: Vector3, b: Vector3): number =>
  vectorMagnitude({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });

const averagePosition = (birds: ReadonlyArray<Bird>): Vector3 => {
  const sum = birds.reduce(
    (acc, bird) => ({
      x: acc.x + bird.position.x,
      y: acc.y + bird.position.y,
      z: acc.z + bird.position.z,
    }),
    createVector3()
  );
  const count = birds.length;
  return { x: sum.x / count, y: sum.y / count, z: sum.z / count };
};

const averagePairwiseDistance = (birds: ReadonlyArray<Bird>): number => {
  if (birds.length < 2) return 0;
  let totalDistance = 0;
  let pairCount = 0;
  for (let i = 0; i < birds.length; i++) {
    for (let j = i + 1; j < birds.length; j++) {
      totalDistance += vectorDistance(birds[i].position, birds[j].position);
      pairCount++;
    }
  }
  return totalDistance / pairCount;
};

const velocityDirectionVariance = (birds: ReadonlyArray<Bird>): number => {
  if (birds.length < 2) return 0;
  const normalizedVelocities = birds.map((bird) => {
    const mag = vectorMagnitude(bird.velocity);
    return mag > 0
      ? { x: bird.velocity.x / mag, y: bird.velocity.y / mag, z: bird.velocity.z / mag }
      : createVector3();
  });
  const avgDir = {
    x: normalizedVelocities.reduce((sum, v) => sum + v.x, 0) / birds.length,
    y: normalizedVelocities.reduce((sum, v) => sum + v.y, 0) / birds.length,
    z: normalizedVelocities.reduce((sum, v) => sum + v.z, 0) / birds.length,
  };
  return normalizedVelocities.reduce(
    (variance, v) =>
      variance +
      (v.x - avgDir.x) ** 2 +
      (v.y - avgDir.y) ** 2 +
      (v.z - avgDir.z) ** 2,
    0
  ) / birds.length;
};

const runSimulationTicks = (
  simulateTick: (state: SimulationState, deltaTime: number) => SimulationState,
  initialState: SimulationState,
  tickCount: number,
  deltaTime: number = 1 / 60
): SimulationState => {
  let state = initialState;
  for (let i = 0; i < tickCount; i++) {
    state = simulateTick(state, deltaTime);
  }
  return state;
};

export {
  createVector3,
  createBird,
  createObstacle,
  createPredator,
  createDefaultFlockingParameters,
  createBirds,
  createSimulationState,
  createMetrics,
  vectorMagnitude,
  vectorDistance,
  averagePosition,
  averagePairwiseDistance,
  velocityDirectionVariance,
  runSimulationTicks,
};

export type {
  Vector3,
  Bird,
  Obstacle,
  Predator,
  FlockingParameters,
  PlaybackState,
  SimulationState,
  SimulationMetrics,
};
