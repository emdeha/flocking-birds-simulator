# ADR-005: State Management -- Immutable Plain Objects with Pure Transition Functions

## Status

Accepted

## Context

The simulation state (birds, obstacles, predators, parameters, playback) must be:
1. Read once per frame by the game loop
2. Written once per frame by the game loop (simulation result)
3. Written sporadically by the UI layer (parameter changes, entity additions)
4. Read by the status bar for display
5. Fully resettable to defaults
6. Immutable (per project functional programming guidelines)

The state is synchronous -- there are no async state transitions, no server round-trips, no optimistic updates.

## Decision

Plain immutable TypeScript objects with pure transition functions. No state management library.

State shape: a single `SimulationState` type.
Transitions: pure functions `(currentState, ...args) -> nextState`.
Storage: a module-level `let` variable holding the current state reference (the only mutable binding in the application).

## Alternatives Considered

### 1. Zustand (MIT)

Lightweight state management with subscriptions. Provides `get()`/`set()` API and selector-based subscriptions. However, the simulation reads state once per frame (pull model), not in response to state changes (push model). Subscriptions add overhead for a use case where polling is the natural pattern. The game loop already runs every frame -- it does not need to be notified of state changes. Rejected: subscription model does not match the frame-based read pattern.

### 2. Redux (MIT)

Provides immutable state with actions and reducers. The reducer pattern closely matches our pure transition functions. However, Redux adds middleware, action creators, action types, and dispatch overhead that provide no benefit for a single-developer, single-thread, synchronous state model. The concepts are isomorphic to our pure functions but wrapped in ceremony. Rejected: unnecessary abstraction.

## Consequences

### Positive
- Zero dependency for state management
- State transitions are trivially testable (pure functions on plain data)
- No subscription/notification overhead
- Full alignment with project's functional programming and immutability guidelines
- State is serializable (could support undo/redo or save/load in future)

### Negative
- No built-in devtools (acceptable; state can be logged or inspected via browser console)
- No automatic UI re-rendering on state change (handled explicitly by the game loop's per-frame render call)
- The single mutable `let` binding requires discipline to avoid direct mutation (mitigated by `Readonly` types)
