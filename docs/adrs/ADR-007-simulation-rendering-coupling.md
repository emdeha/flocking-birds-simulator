# ADR-007: Simulation-Rendering Coupling -- Synchronous Single-Thread Loop

## Status

Accepted

## Context

The simulation engine and 3D renderer must cooperate to produce 60 FPS output. Two primary patterns exist:

1. **Synchronous**: Simulation and rendering happen sequentially in the same `requestAnimationFrame` callback. Simple. Deterministic. But if the combined time exceeds 16.67ms, frames are dropped.

2. **Asynchronous**: Simulation runs in a Web Worker on a separate thread. Rendering runs on the main thread. They communicate via `postMessage`. Simulation can run ahead of rendering. But data transfer adds latency and complexity.

Key requirements:
- Parameter changes must be reflected in the next rendered frame (NFR2)
- 200 birds at 60 FPS (NFR1)
- Counts must update on the same frame as the visual change (AC-8.3)

## Decision

Synchronous single-thread loop. The game loop runs this sequence per frame:

```
1. Read state
2. If running: simulateTick(state, dt) -> nextState; write nextState
3. render(state)
4. Compute FPS
```

All steps complete within a single `requestAnimationFrame` callback.

## Alternatives Considered

### 1. Web Worker for simulation

Simulation runs in a worker thread. Main thread handles rendering and UI. Worker posts updated positions/velocities to main thread each tick.

Benefits: true parallelism, simulation cannot block UI.

Rejected because:
- `postMessage` requires serializing/deserializing `SimulationState` every frame. For 200 birds with positions and velocities (1200 floats), this is ~10KB per frame. Serialization overhead can exceed the simulation cost itself.
- "Same frame" count update guarantee (AC-8.3) is impossible with async communication -- there is always at least one frame of lag.
- Parameter changes cannot be guaranteed to take effect in "the next frame" (NFR2) because the worker may be mid-tick when the parameter changes.
- Single developer cannot justify the debugging complexity of concurrent state.

### 2. Fixed timestep with interpolation

Simulation runs at a fixed rate (e.g., 60Hz) while rendering runs as fast as possible, interpolating positions between simulation steps. Common in game development.

Rejected because:
- Adds interpolation complexity
- At 60Hz fixed step and 60 FPS target, the fixed step equals the render step, making interpolation a no-op
- Only beneficial when simulation rate differs significantly from render rate
- Premature optimization for this use case

If the simulation budget exceeds 8ms at 200 birds, revisit this decision. The first mitigation would be to optimize the simulation (spatial index tuning, typed arrays). The second mitigation would be a fixed timestep. Web Worker is the last resort.

## Consequences

### Positive
- Simplest possible loop: read, compute, render, repeat
- Deterministic: state and rendering are always in sync
- Parameter changes are guaranteed to take effect in the next frame
- Entity counts are guaranteed to match the visual state
- No serialization overhead
- Easy to debug (single call stack)

### Negative
- If simulation + rendering exceeds 16.67ms, frames drop (user sees stutter)
- Cannot utilize multiple CPU cores
- Long simulation ticks block UI responsiveness (e.g., slider dragging could feel sluggish)

### Mitigation Budget

Target allocation per frame (16.67ms total):
- Simulation: 8ms max
- Rendering: 6ms max
- Overhead (GC, browser, event handling): 2.67ms

Profile early in US-0 to validate these budgets with 50 and 200 birds.
