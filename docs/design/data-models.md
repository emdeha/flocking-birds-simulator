# Data Models: Bird Flocking Simulator

## Overview

All data models are immutable TypeScript types. The simulation engine operates exclusively on these types. No classes, no methods on data -- pure data structures with separate functions that operate on them.

---

## Core Geometric Type

### Vector3

Represents a point or direction in 3D space.

```
Vector3:
  x: number
  y: number
  z: number
```

All vector operations (add, subtract, scale, normalize, magnitude, distance) are pure functions that accept and return `Vector3` values. No mutation.

---

## Entity Types

### Bird

```
Bird:
  position: Vector3
  velocity: Vector3
```

Birds are the primary simulation entities. Position is updated each tick by the physics integrator. Velocity is modified by combined flocking, avoidance, and flee forces.

No ID field needed -- birds are anonymous. They are identified by array index within a single frame. The simulation engine processes all birds uniformly.

### Obstacle

```
Obstacle:
  position: Vector3
  radius: number
```

Obstacles are static spherical volumes that birds steer around. Created by viewport drag interaction. Position is the center of the dragged region; radius is derived from drag distance.

### Predator

```
Predator:
  position: Vector3
```

Predators are point entities that exert flee force on nearby birds. Predators are stationary (they do not move autonomously in the current requirements). If predator movement is added later, a `velocity: Vector3` field would be added.

---

## Parameter Types

### FlockingParameters

```
FlockingParameters:
  separationWeight: number   // [0.0, 1.0], default 0.5
  alignmentWeight: number    // [0.0, 1.0], default 0.7
  cohesionWeight: number     // [0.0, 1.0], default 0.6
```

### SimulationParameters

```
SimulationParameters:
  flocking: FlockingParameters
  neighborRadius: number            // Distance within which birds influence each other
  separationRadius: number          // Distance within which separation force applies (< neighborRadius)
  maxSpeed: number                  // Maximum bird velocity magnitude
  maxForce: number                  // Maximum steering force magnitude per tick
  obstacleAvoidanceRadius: number   // Distance at which birds start avoiding obstacles
  obstacleAvoidanceWeight: number   // Strength of obstacle avoidance force
  predatorFleeRadius: number        // Distance at which birds start fleeing predators
  predatorFleeWeight: number        // Strength of predator flee force (larger than avoidance)
  worldBounds: WorldBounds          // Simulation boundary dimensions
```

**Note**: `neighborRadius`, `separationRadius`, `maxSpeed`, `maxForce`, avoidance/flee radii and weights are internal simulation constants -- not exposed to the user via UI. They are part of SimulationParameters to allow tuning during development and testing, but the UI only exposes `FlockingParameters` (the three sliders) and `simulationSpeed`.

### WorldBounds

```
WorldBounds:
  min: Vector3
  max: Vector3
```

Defines the 3D bounding box of the simulation. Birds that exit bounds are wrapped to the opposite side (toroidal wrapping) or reflected (bounce). The crafter chooses the boundary behavior.

---

## State Types

### PlaybackState

```
PlaybackState: "running" | "paused"
```

### SimulationState

The single canonical state object. Immutable. Replaced wholesale each tick.

```
SimulationState:
  birds: ReadonlyArray<Bird>
  obstacles: ReadonlyArray<Obstacle>
  predators: ReadonlyArray<Predator>
  parameters: SimulationParameters
  playbackState: PlaybackState
  simulationSpeed: number           // [0.1, 5.0], default 1.0
```

### SimulationMetrics

Derived data, not stored in state. Computed by the game loop each frame.

```
SimulationMetrics:
  birdCount: number
  predatorCount: number
  obstacleCount: number
  fps: number
```

---

## Default Values

```
DEFAULT_FLOCKING_PARAMETERS:
  separationWeight: 0.5
  alignmentWeight: 0.7
  cohesionWeight: 0.6

DEFAULT_SIMULATION_STATE:
  birds: ~50 birds with random positions within world bounds and random velocities
  obstacles: [] (empty)
  predators: [] (empty)
  parameters: (default SimulationParameters with default FlockingParameters)
  playbackState: "running"
  simulationSpeed: 1.0
```

---

## State Transition Summary

All transitions are pure functions: `(currentState, ...args) -> newState`

| Transition | Input | Effect |
|---|---|---|
| `createInitialState` | (none) | Returns default state with ~50 random birds |
| `addBird` | position: Vector3, velocity: Vector3 | Appends bird to birds array |
| `addBirdRandom` | (none) | Appends bird at random position with random velocity |
| `removeBird` | (none) | Removes last bird from array (or specific index) |
| `updateFlockingParam` | param name, value | Returns state with updated parameter |
| `updateSimulationSpeed` | speed: number | Returns state with updated speed |
| `addObstacle` | position: Vector3, radius: number | Appends obstacle to obstacles array |
| `clearObstacles` | (none) | Returns state with empty obstacles array |
| `addPredator` | position: Vector3 | Appends predator to predators array |
| `togglePlayback` | (none) | Flips playbackState between "running" and "paused" |
| `resetState` | (none) | Returns `createInitialState()` |

---

## Spatial Index Data

The spatial index is a transient data structure, rebuilt each tick. It is not part of `SimulationState`.

```
SpatialGrid:
  cellSize: number
  cells: Map<string, ReadonlyArray<number>>   // cell key -> array of bird indices
```

Cell key is derived from discretized 3D position (e.g., `"3,7,2"` for grid cell at x=3, y=7, z=2).

Neighbor query: given a position and radius, return all bird indices in overlapping grid cells within that radius.

---

## Data Flow Mapping to Shared Artifacts

| Shared Artifact (from DISCUSS) | Data Model Field |
|---|---|
| SA1: bird-positions | `SimulationState.birds[].position` |
| SA2: velocity-vectors | `SimulationState.birds[].velocity` |
| SA3: separation-weight | `SimulationState.parameters.flocking.separationWeight` |
| SA4: alignment-weight | `SimulationState.parameters.flocking.alignmentWeight` |
| SA5: cohesion-weight | `SimulationState.parameters.flocking.cohesionWeight` |
| SA6: simulation-speed | `SimulationState.simulationSpeed` |
| SA7: bird-count | `SimulationState.birds.length` (derived) |
| SA8: predator-entities | `SimulationState.predators` |
| SA9: obstacle-entities | `SimulationState.obstacles` |
| SA10: simulation-state | `SimulationState.playbackState` |
| SA11: camera-position | Managed by renderer (Three.js OrbitControls), not in SimulationState |
| SA12: fps | `SimulationMetrics.fps` (derived in game loop) |

**SA11 (camera-position)** is intentionally excluded from `SimulationState` because camera state is rendering concern only. It has no effect on simulation. It is managed by Three.js OrbitControls and read by the renderer directly.

**SA7 (bird-count)** and **SA12 (fps)** are derived values, not stored. Bird count is `birds.length`. FPS is computed by the game loop from frame timing. This avoids redundant state that could become inconsistent.
