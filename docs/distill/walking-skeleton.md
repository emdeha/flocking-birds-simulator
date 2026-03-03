# Walking Skeleton: What It Proves Architecturally

## Overview

The walking skeleton for US-0 is the thinnest vertical slice through all five
architectural containers. It validates that the core architectural boundaries
work before any additional features are built.

## Architectural Boundaries Validated

### 1. Simulation Engine (Pure Functions, Zero Dependencies)

**What the skeleton proves**: The `simulateTick` function accepts a
`SimulationState` and `deltaTime`, returns a new `SimulationState` with updated
bird positions and velocities. It operates on plain data with no DOM, no WebGL,
no browser APIs.

**Walking skeleton tests that validate this**:
- "Birds change position over time" -- proves `simulateTick` returns modified state
- "High cohesion decreases average distance" -- proves cohesion force computation works
- "High separation increases average distance" -- proves separation force computation works

**Architectural invariant**: The simulation engine has zero imports from
`renderer/`, `ui/`, `loop/`, or any browser API. This is enforceable by
inspecting the import graph of `src/simulation/`.

### 2. Simulation State (Immutable Data, Pure Transitions)

**What the skeleton proves**: State transitions (`createInitialState`,
`updateFlockingParam`) return new state objects without mutating the original.
The state shape matches the documented data models.

**Walking skeleton tests that validate this**:
- "Default flocking parameters set on init" -- proves `createInitialState`
  returns correct defaults
- "Separation update reflected in state" -- proves `updateFlockingParam` returns
  new state with updated value
- Immutability assertion: original state unchanged after transition

### 3. UI Layer -> State Store Communication

**What the skeleton proves**: The separation slider maps to a
`updateFlockingParam(state, "separationWeight", value)` call. The UI layer
writes commands to the state store through well-defined transition functions.

**Walking skeleton tests that validate this**:
- "Separation slider increases bird spacing" -- proves that changing the
  separation parameter in state causes observable behavioral change in
  simulation output

### 4. Simulation Engine -> Renderer Data Flow

**What the skeleton proves**: The simulation engine produces state with bird
positions and velocities that the renderer can consume. Each bird has a
`position: Vector3` and `velocity: Vector3` -- the data contract the renderer
needs to draw points and velocity vector lines.

**Walking skeleton tests that validate this**:
- "Birds present with velocity vectors on init" -- proves birds have position
  and velocity data suitable for rendering

### 5. Game Loop Orchestration

**What the skeleton proves**: The game loop can read state, call
`simulateTick`, and write the result back. The `runSimulationTicks` helper
in the test suite mirrors what the game loop does: repeatedly call
`simulateTick` with state and deltaTime.

**Walking skeleton tests that validate this**:
- All simulation-over-time tests use `runSimulationTicks`, which exercises the
  same read-tick-write cycle the game loop performs.

## What the Walking Skeleton Does NOT Prove

1. **Three.js rendering** -- Visual output is not testable in Node.js. The
   renderer is a thin adapter verified manually.
2. **Browser DOM interactions** -- Slider elements, button clicks, and viewport
   mouse events are UI layer concerns tested separately with happy-dom.
3. **requestAnimationFrame timing** -- The game loop's frame scheduling is a
   thin orchestrator tested via integration test.
4. **Performance (60 FPS)** -- Performance is a non-functional requirement
   validated through profiling, not acceptance tests.

## Skeleton-to-Feature Expansion Path

```
US-0 Walking Skeleton
  |
  +-- US-6: Camera Navigation
  |     Adds: Camera state independence from simulation state
  |     Proves: Renderer container handles camera separately
  |
  +-- US-1: Full Parameter Controls
  |     Adds: Alignment + cohesion sliders
  |     Proves: Slider-to-engine path generalizes beyond separation
  |
  +-- US-8: Status Bar
  |     Adds: Derived metrics (bird/predator/obstacle count, FPS)
  |     Proves: Metrics port works, counts are derived from state
  |
  +-- US-2: Bird Management
  |     Adds: addBird, addBirdRandom, removeBird transitions
  |     Proves: Entity creation commands and raycasting input
  |
  +-- US-3: Obstacles
  |     Adds: addObstacle, clearObstacles, avoidance physics
  |     Proves: Drag interaction and obstacle avoidance in engine
  |
  +-- US-4: Predators
  |     Adds: addPredator, flee physics
  |     Proves: Flee distinct from avoidance (different force weights)
  |
  +-- US-5: Playback Controls
  |     Adds: togglePlayback, setSpeed
  |     Proves: Simulation freeze/resume, speed scaling
  |
  +-- US-7: Reset
        Adds: resetState
        Proves: Full state reset across all containers
```

Each subsequent story adds behavior within the architectural boundaries
established by the walking skeleton. No architectural changes are needed after
US-0 is complete.

## Demo Script for Stakeholders

The walking skeleton is demonstrable:

1. Open the page -- birds appear and flock (US-0: init + flocking)
2. Drag the separation slider to 0.9 -- birds spread apart (US-0: parameter control)
3. Drag the separation slider to 0.0 -- birds cluster unnaturally (US-0: boundary)

This takes approximately 30 seconds and demonstrates:
- Real-time 3D visualization works
- Simulation engine computes flocking behavior
- UI controls communicate with the engine
- Changes are reflected within the next frame
