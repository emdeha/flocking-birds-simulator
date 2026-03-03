# ADR-002: 3D Rendering Library -- Three.js

## Status

Accepted

## Context

The application requires 3D rendering of birds (points), velocity vectors (lines), obstacles (geometric shapes), predators (distinct shapes), camera orbit/zoom controls, and raycasting (2D click to 3D position). Must work in all modern evergreen browsers via WebGL. Open source required.

## Decision

Three.js (MIT license) for all 3D rendering. Version 0.170+ (latest stable at time of implementation).

Three.js provides built-in solutions for every rendering requirement:
- `Points` + `BufferGeometry` for efficient bird rendering
- `LineSegments` for velocity vectors
- `OrbitControls` for camera orbit and zoom (US-6)
- `Raycaster` for 2D-to-3D coordinate conversion (US-2, US-3)
- `SphereGeometry` / `BoxGeometry` for obstacles and predators
- WebGL abstraction across all target browsers

## Alternatives Considered

### 1. Babylon.js (Apache-2.0)

Full game engine with built-in physics, particle systems, and material editor. Heavier than needed. The simulator does not require physics engine integration (we compute our own flocking physics), particle systems, or material complexity. Babylon's game-engine architecture adds concepts (scenes, meshes, materials pipeline) that are over-engineered for point/line rendering. Rejected: over-engineered for the requirements.

### 2. Raw WebGL (no library)

Maximum control over performance. Zero dependency. However, implementing camera controls, raycasting, scene management, and buffer management from scratch requires significant effort. Single developer cannot justify the time investment when Three.js provides all of this out of the box. Rejected: time-to-market for a single developer.

## Consequences

### Positive
- Proven library with extensive documentation and community support
- Built-in solutions for camera controls and raycasting reduce implementation effort
- Tree-shakeable via Vite (only import what is used)
- MIT license has no restrictions

### Negative
- Bundle size impact (~150KB gzipped after tree-shaking)
- Imperative API requires careful object lifecycle management (reuse objects, avoid allocation per frame)
- Three.js version upgrades occasionally include breaking changes (pin version)
