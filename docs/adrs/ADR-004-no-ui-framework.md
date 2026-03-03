# ADR-004: No UI Framework -- Vanilla TypeScript for UI Layer

## Status

Accepted

## Context

The UI layer consists of:
- 3 labeled sliders (separation, alignment, cohesion) with numeric display
- 1 speed slider
- 3 buttons (Add Predator, Clear Obstacles, Reset)
- 2 buttons (+/- bird count)
- 1 play/pause toggle
- 1 status bar with 4 text fields (bird count, predator count, obstacle count, FPS)
- Click/drag event handling on the viewport canvas

This is approximately 10 interactive controls and 4 read-only displays. No routing, no complex component composition, no async data fetching, no form validation.

## Decision

Vanilla TypeScript with native HTML elements. No React, Vue, Svelte, Angular, or other UI framework.

The UI layer is a thin adapter: it binds DOM events to state transition functions and reads state to update display text. The viewport canvas is owned by Three.js, not by any UI framework.

## Alternatives Considered

### 1. React (MIT)

Would provide component model, state management hooks, and declarative rendering. However, for 10 controls and a status bar, React adds ~40KB gzipped to the bundle, introduces a virtual DOM layer between the controls and the real DOM, requires JSX/TSX compilation, and adds a testing dependency (React Testing Library). The overhead is not justified by the UI complexity. Rejected: over-engineered.

### 2. Svelte (MIT)

Compiles away at build time, so no runtime overhead. Provides reactivity. However, it adds build-time compilation complexity, a new file format (.svelte), and a testing story that is less mature than vanilla DOM testing. For 10 controls, the compile-time approach doesn't provide meaningful benefit. Rejected: unnecessary complexity.

### Revisit Trigger

If the UI grows to include:
- Multiple panels/pages/tabs
- Complex form validation
- Dynamic lists with sorting/filtering
- Modal dialogs with complex state

Then reconsider a lightweight framework (Preact or Svelte).

## Consequences

### Positive
- Zero UI framework bundle size
- No framework-specific tooling or plugins
- Controls are native HTML elements (accessible by default)
- Testing is straightforward DOM assertions with happy-dom
- No abstraction layer between developer and the browser

### Negative
- Manual DOM manipulation for state-to-display synchronization (acceptable for ~4 text updates per frame)
- No component model for reuse (not needed at this scale)
- If UI complexity grows, refactoring to a framework will require rewriting the UI layer (mitigated by keeping it thin)
