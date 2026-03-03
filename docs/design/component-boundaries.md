# Component Boundaries: Bird Flocking Simulator

## Overview

Five containers, each with clear responsibilities and dependency direction. The simulation engine is the domain core with zero outward dependencies.

---

## Container 1: Simulation Engine

### Boundary

Pure TypeScript functions that compute the next simulation state from the current state. No DOM, no WebGL, no browser APIs. Testable in Node.js without any environment setup.

### Responsibility

- Compute flocking forces (separation, alignment, cohesion) per bird
- Compute obstacle avoidance forces per bird
- Compute predator flee forces per bird
- Combine forces and integrate physics (velocity + position update)
- Maintain spatial index for efficient neighbor lookup
- Enforce world bounds (birds wrap or bounce at boundaries)

### Dependencies

- **Depends on**: Nothing. This is the innermost layer.
- **Depended on by**: Game Loop (calls `simulateTick`)

### Port Contract

```
Input:  SimulationState + SimulationParameters + deltaTime (number)
Output: SimulationState (new immutable state with updated positions/velocities)
```

The simulation engine is a single pure function at its outermost boundary. Internally it decomposes into sub-functions (flocking, avoidance, flee, integration, spatial), but the game loop only sees the top-level `simulateTick` entry point.

### Sub-Components

| Sub-Component | Responsibility |
|---|---|
| Flocking Rules | Separation, alignment, cohesion force computation |
| Obstacle Avoidance | Steering force away from obstacles |
| Predator Flee | Flee force away from predators (stronger than avoidance) |
| Physics Integrator | Apply forces to velocity, velocity to position, enforce bounds |
| Spatial Index | Grid-based neighbor lookup. Rebuilt each tick. |

### Testing Approach

100% TDD. Each sub-component tested via pure function inputs/outputs. Deterministic. No mocks.

---

## Container 2: Simulation State

### Boundary

Immutable data structures representing the entire simulation state. Provides factory functions for state creation and transition functions for state updates.

### Responsibility

- Define the canonical shape of simulation state (birds, predators, obstacles, parameters, playback)
- Provide state creation (initial defaults, reset)
- Provide state transition functions (add bird, remove bird, update parameter, etc.)
- Enforce invariants (bird count >= 0, parameters within range)

### Dependencies

- **Depends on**: Nothing (pure data + pure functions)
- **Depended on by**: UI Layer (writes commands), Game Loop (reads/writes state)

### Port Contract

```
State transitions are pure functions:
  createInitialState() -> SimulationState
  addBird(state, position, velocity) -> SimulationState
  removeBird(state) -> SimulationState
  updateParameter(state, paramName, value) -> SimulationState
  addObstacle(state, position, radius) -> SimulationState
  clearObstacles(state) -> SimulationState
  addPredator(state, position) -> SimulationState
  togglePlayback(state) -> SimulationState
  setSpeed(state, speed) -> SimulationState
  resetState() -> SimulationState
```

All functions return new state objects. No mutation.

### Testing Approach

100% TDD. Each transition function tested as pure function.

---

## Container 3: UI Layer

### Boundary

DOM event handlers and HTML element bindings. Thin adapter between browser events and the state store. Contains click/drag detection logic and viewport event translation.

### Responsibility

- Bind slider elements to parameter update commands
- Bind buttons to entity commands (add predator, clear obstacles, reset, +/- birds)
- Detect click vs. drag in viewport (time/distance threshold)
- Convert 2D click position to 3D world position (via raycasting through renderer)
- Update status bar text from state
- Show/hide empty state hint

### Dependencies

- **Depends on**: Simulation State (writes commands), 3D Renderer (raycasting for click-to-3D)
- **Depended on by**: Nothing (leaf node, receives browser events)

### Port Contract

```
Inbound: Browser DOM events (click, mousemove, mouseup, scroll, input)
Outbound: State transition function calls on Simulation State
Outbound: Raycasting queries to 3D Renderer for 3D position from 2D click
```

### Testing Approach

Thin layer. Test click/drag detection logic as pure function (given mouse events, classify as click or drag). Test state bar update logic. DOM integration tests with happy-dom for slider/button bindings.

---

## Container 4: 3D Renderer

### Boundary

Three.js adapter that translates simulation state into visual output. Owns the WebGL context, scene graph, camera, and all Three.js objects.

### Responsibility

- Initialize Three.js scene, camera, renderer, lighting
- Render birds as points (using `BufferGeometry` + `Points`)
- Render velocity vectors as line segments
- Render obstacles as semi-transparent geometric shapes
- Render predators as distinct geometric shapes (different color/shape from obstacles)
- Manage camera (orbit controls via `OrbitControls`)
- Provide raycasting API (2D screen coordinates -> 3D world position)
- Update object positions from state each frame (reuse objects, no create/destroy)

### Dependencies

- **Depends on**: Three.js (external library)
- **Depended on by**: Game Loop (calls `render`), UI Layer (calls raycasting)

### Port Contract

```
render(state: SimulationState, camera: CameraState) -> void
  Side effect: updates WebGL canvas

raycast(screenX: number, screenY: number) -> Vector3
  Returns 3D world position for a 2D screen coordinate

getCamera() -> CameraState
  Returns current camera position/target for state queries
```

### Performance Constraints

- Reuse `BufferGeometry` and update positions via buffer attribute writes (no object allocation per frame)
- Reuse `Points` and `LineSegments` objects across frames
- Only create/destroy Three.js objects when entity count changes
- Target: <8ms per render call at 200 birds

### Testing Approach

Minimal automated testing. The renderer is a thin adapter over Three.js. Verify visually during development. Automated tests would test Three.js itself, which is not our code.

---

## Container 5: Game Loop

### Boundary

Orchestrator that ties all containers together via `requestAnimationFrame`. Thin coordination logic.

### Responsibility

- Run `requestAnimationFrame` loop
- Read current state from State Store
- If simulation is running: compute delta time, call simulation engine, write next state
- Call renderer with current state
- Compute FPS (rolling average)
- Push FPS to status bar

### Dependencies

- **Depends on**: Simulation State (reads/writes), Simulation Engine (calls `simulateTick`), 3D Renderer (calls `render`), UI Layer (pushes FPS)
- **Depended on by**: Nothing (top-level orchestrator)

### Port Contract

```
start() -> void   // Begins requestAnimationFrame loop
stop() -> void    // Stops loop (for cleanup/testing)
```

### Testing Approach

Integration test: verify that one tick reads state, calls simulation, writes state, calls render. Mock the renderer (it has side effects). Use real simulation engine and state.

---

## Dependency Graph

```
                    +------------+
                    |  Game Loop |
                    +-----+------+
                    |     |      |
            reads/  |     | calls|  calls
            writes  |     |      |
                    v     v      v
    +--------+  +--------+  +----------+
    |   UI   |  |  Sim   |  |    3D    |
    | Layer  |  | Engine |  | Renderer |
    +---+----+  +--------+  +----+-----+
        |                        ^
        |     writes             |
        v                        |
    +--------+        raycasts   |
    |  Sim   | <-----------------+
    | State  |
    +--------+
```

**Key invariant**: Simulation Engine depends on nothing. All dependencies point toward or away from it, never through it.

---

## Boundary Enforcement

Since this is a single-developer project with no runtime module boundaries, boundaries are enforced by:

1. **Directory structure**: Each container in its own directory under `src/`
2. **Import rules**: Simulation engine directory must have zero imports from other containers or browser APIs
3. **Type contracts**: Port types defined in a shared `types/` directory. Containers import types, not implementations.
4. **Code review discipline**: The developer verifies import direction during TDD refactor steps

Suggested directory structure:

```
src/
  simulation/        # Simulation Engine (pure functions, zero deps)
    flocking.ts
    avoidance.ts
    flee.ts
    integrator.ts
    spatial-index.ts
    tick.ts
  state/             # Simulation State (pure data + transitions)
    simulation-state.ts
    state-transitions.ts
  renderer/          # 3D Renderer (Three.js adapter)
    scene-manager.ts
    bird-renderer.ts
    obstacle-renderer.ts
    predator-renderer.ts
    camera-controller.ts
    raycaster.ts
  ui/                # UI Layer (DOM bindings)
    controls-panel.ts
    status-bar.ts
    viewport-input.ts
  loop/              # Game Loop (orchestrator)
    game-loop.ts
  types/             # Shared type definitions
    simulation-types.ts
    vector.ts
  main.ts            # Entry point: wire everything together
index.html
```

**Note**: File names and internal structure are suggestions for the acceptance-designer and crafter. The crafter owns the final file organization decisions. The architectural invariant is the dependency direction, not the file layout.
