# Technology Stack: Bird Flocking Simulator

## Summary

| Category | Choice | Version | License | Rationale |
|---|---|---|---|---|
| Language | TypeScript | 5.x (latest stable) | Apache-2.0 | Strict mode required by project guidelines. Type safety for simulation data structures. |
| 3D Rendering | Three.js | 0.170+ (latest stable) | MIT | Dominant open-source WebGL library. Mature, well-documented, large community. |
| Build Tool | Vite | 6.x (latest stable) | MIT | Fast dev server with HMR. Native TypeScript support. Tree-shaking for production. |
| Test Framework | Vitest | 3.x (latest stable) | MIT | Native Vite integration. Jest-compatible API. Fast execution. TypeScript-first. |
| Test Environment | happy-dom | latest | MIT | Lightweight DOM implementation for UI layer tests. Faster than jsdom. |
| Package Manager | npm | (bundled with Node) | Artistic-2.0 | Default. No justification for alternatives. |
| Runtime | Node.js | 22 LTS | MIT | Build tooling and test execution only. Not a runtime dependency. |

---

## Detailed Rationale

### TypeScript (strict mode)

**Decision**: TypeScript with full strict mode enabled.

Required by project development guidelines. Provides:
- Compile-time type safety for simulation state (3D vectors, entity arrays, parameters)
- Strict null checks prevent runtime errors in the hot simulation loop
- Interface types define port contracts between containers

No alternatives considered -- this is a hard constraint from the user.

### Three.js

**Decision**: Three.js for all 3D rendering.

**Alternatives evaluated**:

| Library | License | Pros | Cons | Verdict |
|---|---|---|---|---|
| **Three.js** | MIT | Dominant market share. Extensive docs. Built-in OrbitControls (camera), Raycaster (click-to-3D), Points/Lines (bird rendering). Active maintenance. | Large bundle (tree-shakeable). Imperative API. | Selected |
| **Babylon.js** | Apache-2.0 | Full game engine. Physics built in. | Heavier than needed. Game-engine complexity not justified for this simulator. Smaller community for non-game use cases. | Rejected: over-engineered |
| **Raw WebGL** | N/A | Zero dependencies. Maximum performance control. | Enormous implementation effort for camera, raycasting, scene management. Single developer cannot justify. | Rejected: time-to-market |
| **PlayCanvas** | MIT | Good performance. | Editor-focused workflow. Less suited to code-first TDD approach. | Rejected: workflow mismatch |
| **React Three Fiber** | MIT | Declarative React wrapper for Three.js. | Adds React as dependency (large). Abstraction layer reduces performance control. Framework choice not justified for a single-page simulator. | Rejected: unnecessary abstraction |

**Three.js provides built-in solutions for**:
- `THREE.Points` + `THREE.BufferGeometry` -- efficient bird rendering
- `THREE.LineSegments` -- velocity vector rendering
- `THREE.OrbitControls` -- camera orbit and zoom (US-6)
- `THREE.Raycaster` -- click-to-3D position conversion (US-2, US-3)
- `THREE.SphereGeometry` / `THREE.BoxGeometry` -- obstacle and predator rendering

### Vite

**Decision**: Vite as build tool and dev server.

**Alternatives evaluated**:

| Tool | License | Pros | Cons | Verdict |
|---|---|---|---|---|
| **Vite** | MIT | Instant HMR. Native TS. Tree-shaking. Vitest integration. | Newer than webpack. | Selected |
| **webpack** | MIT | Most mature. Largest ecosystem. | Slower dev server. More configuration. No native TS. | Rejected: slower DX |
| **esbuild** | MIT | Extremely fast builds. | No HMR dev server. No plugin ecosystem for testing integration. | Rejected: incomplete DX |
| **Parcel** | MIT | Zero config. | Less control over output. Smaller community. | Rejected: less mature |

### Vitest

**Decision**: Vitest as test framework.

**Alternatives evaluated**:

| Framework | License | Pros | Cons | Verdict |
|---|---|---|---|---|
| **Vitest** | MIT | Native Vite config sharing. Same transform pipeline. Jest-compatible API. Fast. TypeScript-first. | Newer than Jest. | Selected |
| **Jest** | MIT | Most popular. Huge ecosystem. | Requires separate TS transform (ts-jest or swc). Slower. Config duplication with Vite. | Rejected: config friction |

### No UI Framework

**Decision**: Vanilla TypeScript + HTML for the UI layer. No React, Vue, Svelte, or other framework.

**Rationale**:
- The UI is a side panel with ~10 controls (sliders, buttons) and a status bar
- No complex state management, routing, or component composition needed
- A framework would add bundle size, build complexity, and testing overhead for minimal benefit
- Sliders and buttons are native HTML elements
- The viewport is a Three.js canvas, not a framework-managed DOM tree
- Keeping the UI thin aligns with the architecture: UI is a thin adapter over the state store

**This is the simplest solution that satisfies the requirements.**

If UI complexity grows beyond the current scope (e.g., modal dialogs, multi-page navigation, complex forms), revisit this decision.

### No State Management Library

**Decision**: Plain immutable TypeScript objects for state management. No Redux, Zustand, MobX, or signals library.

**Rationale**:
- State is a single `SimulationState` object updated once per frame
- State transitions are pure functions: `(currentState, action) -> nextState`
- No async state, no derived state subscriptions, no middleware needed
- The game loop reads and writes state synchronously each frame
- A state library would add abstraction without solving a problem that exists

---

## Dependencies Summary

### Production Dependencies

| Package | Purpose | Size Impact |
|---|---|---|
| `three` | 3D rendering, camera controls, raycasting | ~150KB gzipped (tree-shaken) |

**Total production dependencies: 1**

### Development Dependencies

| Package | Purpose |
|---|---|
| `typescript` | Compiler and type checking |
| `vite` | Build tool and dev server |
| `vitest` | Test framework |
| `happy-dom` | DOM environment for UI tests |
| `@types/three` | TypeScript definitions for Three.js |

**Total development dependencies: 5**

---

## Build Configuration

### TypeScript Configuration (tsconfig.json shape)

- `strict: true` (all strict flags enabled)
- `target: ES2020` (covers all evergreen browsers)
- `module: ESNext` (for Vite tree-shaking)
- `moduleResolution: bundler` (Vite-native)

### Vite Configuration

- Entry: `index.html`
- Output: single JS bundle + HTML
- Tree-shaking: enabled (default)
- Source maps: enabled in dev, optional in prod

### Vitest Configuration

- Environment: `happy-dom` (for UI tests)
- Globals: disabled (explicit imports preferred)
- Coverage: enabled
- Include: `src/**/*.test.ts`

---

## License Compliance

All selected technologies use permissive open-source licenses (MIT, Apache-2.0). No copyleft (GPL) or proprietary licenses in the dependency tree. The project can be distributed under any license.
