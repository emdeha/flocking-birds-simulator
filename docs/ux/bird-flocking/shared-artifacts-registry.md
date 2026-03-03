# Shared Artifacts Registry: Bird Flocking Simulator

## Purpose

This registry tracks every piece of data that appears in more than one place
across the bird flocking simulator. Each artifact has a single source of truth
and one or more consumers. Untracked shared data is an integration failure
waiting to happen.

---

## Artifact Registry

| ID   | Name               | Type                 | Source                      | Consumers                                  | Default Value |
|------|--------------------|----------------------|-----------------------------|-------------------------------------------|---------------|
| SA1  | bird-positions     | Array of 3D vectors  | Simulation engine           | 3D viewport renderer, status bar (count)  | ~50 random    |
| SA2  | velocity-vectors   | Array of 3D vectors  | Simulation engine           | 3D viewport renderer (drawn as lines)     | Random        |
| SA3  | separation-weight  | Float [0.0, 1.0]     | Side panel slider           | Simulation engine                         | 0.5           |
| SA4  | alignment-weight   | Float [0.0, 1.0]     | Side panel slider           | Simulation engine                         | 0.7           |
| SA5  | cohesion-weight    | Float [0.0, 1.0]     | Side panel slider           | Simulation engine                         | 0.6           |
| SA6  | simulation-speed   | Float [0.1, 5.0]     | Side panel slider           | Simulation engine (tick rate multiplier)  | 1.0           |
| SA7  | bird-count         | Integer >= 0         | Panel counter + click-to-add| Simulation engine, status bar             | 50            |
| SA8  | predator-entities  | Array of entities    | Side panel "Add Predator"   | Simulation engine, viewport, status bar   | [] (empty)    |
| SA9  | obstacle-entities  | Array of entities    | Viewport drag interaction   | Simulation engine, viewport, status bar   | [] (empty)    |
| SA10 | simulation-state   | Enum: running/paused | Playback controls           | Simulation engine, play/pause button      | running       |
| SA11 | camera-position    | 3D vector + target   | Mouse orbit/scroll          | 3D viewport renderer                     | Default orbit |
| SA12 | fps                | Integer              | Renderer performance loop   | Status bar                                | N/A (live)    |

---

## Integration Checkpoints

These are the critical points where shared artifacts flow between components.

### Checkpoint 1: Slider to Simulation Engine

- **Artifacts**: SA3 (separation), SA4 (alignment), SA5 (cohesion), SA6 (speed)
- **Flow**: Side panel slider value change --> simulation engine parameter update
- **Requirement**: Changes must apply within the next simulation frame (real-time feel)
- **Risk**: If slider updates are batched or delayed, the user loses the sense of direct control

### Checkpoint 2: Click/Drag to Simulation Engine

- **Artifacts**: SA7 (bird-count via click), SA9 (obstacles via drag)
- **Flow**: Viewport mouse event --> position calculation in 3D space --> entity creation in simulation
- **Requirement**: 3D position must be accurately derived from 2D screen coordinates (raycasting or similar)
- **Risk**: If click position doesn't match where the bird appears, the interaction feels broken

### Checkpoint 3: Simulation Engine to Renderer

- **Artifacts**: SA1 (bird-positions), SA2 (velocity-vectors), SA8 (predators), SA9 (obstacles)
- **Flow**: Simulation engine computes frame --> renderer draws all entities
- **Requirement**: Renderer must consume positions and vectors every frame with no visible lag
- **Risk**: If simulation and rendering are out of sync, birds appear to "jump"

### Checkpoint 4: Entity Counts to Status Bar

- **Artifacts**: SA7, SA8, SA9, SA12
- **Flow**: Simulation engine state --> status bar display
- **Requirement**: Counts must update on the same frame as the visual change
- **Risk**: If count updates lag behind the visual (e.g., bird appears but count still says 50), it feels buggy

### Checkpoint 5: Playback State to Simulation Engine

- **Artifacts**: SA10 (simulation-state)
- **Flow**: Play/pause button --> simulation engine loop control
- **Requirement**: Pause must freeze all bird movement instantly; play must resume from exact frozen state
- **Risk**: If birds move one extra frame after pause, the user loses trust in the control

---

## Assumptions Tracked

| ID | Assumption | Impact if Wrong |
|----|-----------|-----------------|
| A1 | 3D scene supports orbit/zoom | Camera controls won't work; viewport interactions need redesign |
| A2 | Predators are distinct from obstacles | If combined, "Add Predator" and drag-to-obstacle collapse into one interaction |
| A3 | Default ~50 birds | Performance may differ; status bar default changes |
| A4 | Side panel is collapsible | If not, viewport size is permanently reduced |
| A5 | Velocity vectors rendered as lines from bird points | If not, user loses speed/direction visibility |
