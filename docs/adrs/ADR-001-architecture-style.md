# ADR-001: Architecture Style -- Modular Monolith with Dependency Inversion

## Status

Accepted

## Context

We need to structure a single-page web application that contains a real-time simulation engine, 3D renderer, UI controls, and state management. The application has one developer, ships as static files, and must maintain 60 FPS with 200 birds. Testability via TDD is a non-negotiable constraint.

## Decision

Modular monolith with dependency inversion (ports-and-adapters). Five containers (Simulation Engine, Simulation State, UI Layer, 3D Renderer, Game Loop) in a single deployable bundle. Dependencies point inward toward the simulation engine. Boundaries enforced by directory structure and import discipline, not runtime mechanisms.

## Alternatives Considered

### 1. Flat script (no explicit boundaries)

All logic in a few files with no container separation. Fast to start, but simulation logic becomes entangled with rendering and DOM code. TDD becomes impossible because testing any logic requires a browser environment. Rejected: testability is a hard constraint.

### 2. Microservices / Web Workers

Simulation engine in a Web Worker, communicating with the main thread via `postMessage`. Provides true isolation and could improve performance via parallelism.

Rejected because:
- `postMessage` serialization adds latency incompatible with "next frame" responsiveness
- Structured clone of 200 birds' positions/velocities per frame is wasteful
- Single developer does not benefit from deployment independence
- Complexity is not justified by the performance profile (200 birds is achievable on main thread)

If the bird count requirement grows to 1000+, revisit this decision.

## Consequences

### Positive
- Simulation engine is 100% testable in Node.js (no DOM, no WebGL)
- Zero serialization overhead (direct function calls)
- Simple build: one Vite entry point, one bundle
- Boundaries are lightweight (directory + import rules, not runtime enforcement)

### Negative
- Boundary violations are caught by developer discipline, not by tooling (acceptable for single developer)
- All code runs on main thread; if simulation exceeds frame budget, rendering stutters
- Cannot independently deploy or scale containers (not needed for a static SPA)
