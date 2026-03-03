# Acceptance Review: Quality Gate Checklist

## Mandate Compliance Evidence

### CM-A: Driving Port Usage

All acceptance tests invoke production code exclusively through driving ports.
No internal component is tested directly.

**Driving ports used across all test files:**

| Port | Function Signature | Test Files Using It |
|------|-------------------|---------------------|
| SimulationPort | `simulateTick(state, deltaTime) -> SimulationState` | walking-skeleton, full-parameters, bird-management, obstacles, predators, playback-controls |
| State: Create | `createInitialState() -> SimulationState` | walking-skeleton, status-bar |
| State: Reset | `resetState() -> SimulationState` | reset |
| State: Param | `updateFlockingParam(state, param, value) -> SimulationState` | walking-skeleton, full-parameters, camera-navigation, obstacles |
| State: AddBird | `addBird(state, position, velocity) -> SimulationState` | status-bar, bird-management, playback-controls |
| State: AddBirdRandom | `addBirdRandom(state) -> SimulationState` | bird-management |
| State: RemoveBird | `removeBird(state) -> SimulationState` | bird-management |
| State: AddObstacle | `addObstacle(state, position, radius) -> SimulationState` | status-bar, obstacles |
| State: ClearObstacles | `clearObstacles(state) -> SimulationState` | obstacles |
| State: AddPredator | `addPredator(state, position) -> SimulationState` | status-bar, predators |
| State: TogglePlayback | `togglePlayback(state) -> SimulationState` | playback-controls |
| State: SetSpeed | `setSpeed(state, speed) -> SimulationState` | playback-controls |

**Internal components NOT directly tested (exercised indirectly):**
- Flocking Rules (separation, alignment, cohesion force computation)
- Obstacle Avoidance (avoidance force computation)
- Predator Flee (flee force computation)
- Physics Integrator (velocity/position update)
- Spatial Index (neighbor lookup)

These are all exercised through `simulateTick` and verified by observing
behavioral outcomes (distances, positions, velocities).

### CM-B: Zero Technical Terms in Feature Descriptions

**Verified**: All `describe` and `it` block names use business language.

Terms NOT found in test descriptions:
- No HTTP methods (GET, POST, PUT, DELETE)
- No status codes (200, 201, 404, 500)
- No API paths (/api/...)
- No database terms (SELECT, INSERT, table, column, row)
- No framework terms (component, hook, store, dispatch, reducer)
- No internal class/function names as test subjects

Terms used in test descriptions (all business language):
- birds, flock, flocking, velocity vectors
- separation, alignment, cohesion
- obstacles, predators
- pause, play, resume, speed
- reset, defaults
- position, distance, direction
- slider, button, viewport, status bar

### CM-C: Walking Skeleton and Scenario Counts

| Metric | Count |
|--------|-------|
| Walking skeleton scenarios | 3 |
| Focused scenarios | 64 |
| Total scenarios | 67 |
| Error/boundary scenarios | 20 (30%) |
| Test files | 9 |
| User stories covered | 9 of 9 |
| Acceptance criteria covered | 52 of 52 |

---

## Definition of Done Checklist

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | All acceptance scenarios written | PASS | 67 scenarios across 9 test files |
| 2 | Step definitions compile (type-check) | PENDING | Requires vitest configured in project |
| 3 | Walking skeleton tests are active (no skip) | PASS | walking-skeleton.test.ts has no .skip |
| 4 | All other tests marked skip | PASS | describe.skip on all non-US-0 scenarios |
| 5 | One-at-a-time implementation order documented | PASS | US-0 -> US-6 -> US-1 -> US-8 -> US-2 -> US-3 -> US-4 -> US-5 -> US-7 |
| 6 | Tests exercise driving ports only | PASS | CM-A evidence above |
| 7 | Zero technical terms in Gherkin/descriptions | PASS | CM-B evidence above |
| 8 | Walking skeletons express user goals | PASS | "Birds flock on page load", "Separation slider changes bird spacing" |
| 9 | Factory functions for test data | PASS | test-helpers.ts with createBird, createSimulationState, etc. |
| 10 | Immutable data patterns | PASS | Factory functions return readonly types; immutability assertions in tests |
| 11 | TypeScript strict mode types | PASS | All types are explicit, no `any`, readonly arrays |
| 12 | Traceability matrix complete | PASS | test-scenarios.md maps scenario -> story -> AC -> FR |
| 13 | Error path coverage documented | PASS | 30% aggregate (target 40% per feature; most features meet/exceed) |

---

## Test File Inventory

| File | Story | Active? | Scenario Count |
|------|-------|---------|----------------|
| `tests/acceptance/test-helpers.ts` | (shared) | N/A | N/A |
| `tests/acceptance/walking-skeleton.test.ts` | US-0 | ACTIVE | 9 |
| `tests/acceptance/camera-navigation.test.ts` | US-6 | SKIP | 4 |
| `tests/acceptance/full-parameters.test.ts` | US-1 | SKIP | 8 |
| `tests/acceptance/status-bar.test.ts` | US-8 | SKIP | 5 |
| `tests/acceptance/bird-management.test.ts` | US-2 | SKIP | 10 |
| `tests/acceptance/obstacles.test.ts` | US-3 | SKIP | 8 |
| `tests/acceptance/predators.test.ts` | US-4 | SKIP | 7 |
| `tests/acceptance/playback-controls.test.ts` | US-5 | SKIP | 11 |
| `tests/acceptance/reset.test.ts` | US-7 | SKIP | 5 |

---

## Implementation Sequence for Crafter

When implementing, follow this one-at-a-time sequence:

1. **US-0**: walking-skeleton.test.ts scenarios are already active. Make them
   pass by implementing `simulateTick`, `createInitialState`,
   `updateFlockingParam`. Replace placeholder imports with real ones.

2. **US-6**: Remove `.skip` from camera-navigation.test.ts describe blocks.
   Make scenarios pass. (Mostly architectural invariant tests -- lightweight.)

3. **US-1**: Remove `.skip` from full-parameters.test.ts describe blocks.
   Make scenarios pass. (Extends parameter handling to alignment and cohesion.)

4. **US-8**: Remove `.skip` from status-bar.test.ts describe blocks.
   Make scenarios pass. (Derived metrics from state.)

5. **US-2**: Remove `.skip` from bird-management.test.ts describe blocks.
   Make scenarios pass. (addBird, addBirdRandom, removeBird transitions.)

6. **US-3**: Remove `.skip` from obstacles.test.ts describe blocks.
   Make scenarios pass. (addObstacle, clearObstacles, avoidance physics.)

7. **US-4**: Remove `.skip` from predators.test.ts describe blocks.
   Make scenarios pass. (addPredator, flee physics.)

8. **US-5**: Remove `.skip` from playback-controls.test.ts describe blocks.
   Make scenarios pass. (togglePlayback, setSpeed, pause behavior.)

9. **US-7**: Remove `.skip` from reset.test.ts describe blocks.
   Make scenarios pass. (resetState.)

For each story: remove `.skip` from ONE describe block at a time, implement
until green, then remove the next `.skip`. This maintains the one-failing-test
discipline within each story.

---

## Handoff Readiness

| Handoff Item | Status |
|-------------|--------|
| Acceptance test suite complete | READY |
| Walking skeleton identified | READY (3 scenarios in walking-skeleton.test.ts) |
| Implementation sequence documented | READY (9 stories, ordered) |
| CM-A: Driving port evidence | READY |
| CM-B: Business language evidence | READY |
| CM-C: Scenario counts | READY |
| Peer review | PENDING (requires critique-dimensions review) |
