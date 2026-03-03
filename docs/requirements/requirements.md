# Requirements: Bird Flocking Simulator

## Overview

A web-based 3D bird flocking simulator where casual/curious users observe and
interact with emergent flocking behavior. The simulation runs immediately on
page load with sensible defaults and provides controls for creative exploration.

## Feature Type

User-facing (UI/UX functionality -- visual simulation visible to end users)

## User Profile

- **Type**: Casual/curious person exploring emergent behavior for fun
- **Prior knowledge**: None required
- **Motivation**: Creative ownership -- "I tuned parameters and made something cool"
- **Context**: Web browser, mouse-based interaction

## Functional Requirements

### FR1: Immediate Simulation on Page Load

The simulation must be running with default parameters when the page loads.
No setup screen, no configuration wizard, no "click to start" gate.

- Default ~50 birds
- Default parameter values: separation 0.5, alignment 0.7, cohesion 0.6
- Default speed: 1.0x
- Simulation state: running

### FR2: 3D Visualization with Velocity Vectors

Each bird is rendered as a 3D point in the viewport. Each bird displays a
velocity vector (line extending from the bird in its direction of travel,
with length proportional to speed).

### FR3: Flocking Parameter Controls

Side panel sliders for:
- **Separation** [0.0, 1.0]: How strongly birds avoid crowding neighbors
- **Alignment** [0.0, 1.0]: How strongly birds match direction of neighbors
- **Cohesion** [0.0, 1.0]: How strongly birds move toward center of neighbors

Changes apply in real-time (within the next simulation frame).

### FR4: Bird Management

- **Click to add**: Left-click in viewport spawns a bird at the 3D position
- **Panel counter**: [+] and [-] buttons to increment/decrement bird count
- **Status bar**: Displays current bird count, updated in real-time

### FR5: Obstacle Interaction

- **Drag to create**: Left-click-drag in viewport creates an obstacle in the dragged region
- **Birds avoid**: Birds path around obstacles
- **Clear all**: "Clear obstacles" button removes all obstacles
- **Status bar**: Displays current obstacle count

### FR6: Predator Entities

- **Add predator**: Button in side panel spawns a predator in the scene
- **Birds flee**: Birds near a predator move away from it
- **Distinct from obstacles**: Predators trigger flee behavior; obstacles trigger avoidance
- **Status bar**: Displays current predator count

### FR7: Playback Controls

- **Play/Pause**: Toggle button freezes/resumes all bird movement
- **Speed**: Slider [0.1x, 5.0x] controls simulation tick rate
- **Interactions while paused**: Click-to-add and drag-to-obstacle still work; new entities are frozen until play resumes

### FR8: Camera Controls

- **Orbit**: Right-click-drag (or middle-mouse-drag) rotates camera around scene center
- **Zoom**: Scroll wheel zooms in/out
- Camera changes do not affect simulation state

### FR9: Reset

"Reset" button returns simulation to default state: ~50 birds, default slider
values, no predators, no obstacles, running at 1.0x speed.

### FR10: Status Bar

Persistent bottom bar displaying:
- Bird count (live)
- Predator count (live)
- Obstacle count (live)
- FPS (live)

---

## Non-Functional Requirements

### NFR1: Performance

Simulation must maintain interactive frame rate (target 60 FPS) with up to
200 birds on a modern consumer device.

### NFR2: Responsiveness

Parameter changes (slider adjustments) must be reflected in the next
rendered frame -- no perceptible delay between input and visual response.

### NFR3: Browser Compatibility

Must work in modern evergreen browsers (Chrome, Firefox, Safari, Edge).
No plugins or extensions required.

---

## Walking Skeleton Scope (Feature 0)

The walking skeleton validates the architecture by delivering the thinnest
possible vertical slice:

1. 3D viewport renders on page load
2. A small number of birds (~10) flock using basic separation/alignment/cohesion
3. One slider (e.g., separation) modifies behavior in real-time
4. Birds rendered as 3D points with velocity vectors

This slice proves: 3D rendering pipeline works, simulation engine runs,
UI controls communicate with the engine, and the feedback loop is real-time.
