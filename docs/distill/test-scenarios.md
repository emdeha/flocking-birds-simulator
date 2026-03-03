# Test Scenarios: Traceability Matrix

Maps each acceptance test scenario to its user story, acceptance criteria, and
functional requirement.

## Implementation Order

US-0 -> US-6 -> US-1 -> US-8 -> US-2 -> US-3 -> US-4 -> US-5 -> US-7

## US-0: Walking Skeleton (walking-skeleton.test.ts) -- ACTIVE

| # | Scenario | AC | FR | Type |
|---|----------|----|----|------|
| 1 | Birds present with velocity vectors on init | AC-0.1, AC-0.2, AC-0.3 | FR1, FR2 | Walking Skeleton |
| 2 | Simulation running at 1.0x on init | AC-0.1 | FR1 | Walking Skeleton |
| 3 | Default flocking parameters set on init | AC-0.5 | FR3 | Walking Skeleton |
| 4 | Birds change position over time | AC-0.4 | FR1 | Happy Path |
| 5 | High cohesion decreases average distance | AC-0.4 | FR1 | Happy Path |
| 6 | High separation increases average distance | AC-0.4 | FR1 | Happy Path |
| 7 | Separation slider increases bird spacing | AC-0.6 | FR3 | Happy Path |
| 8 | Separation at 0.0 removes spacing behavior | AC-0.6 | FR3 | Boundary |
| 9 | Separation update reflected in state | AC-0.5, AC-0.6 | FR3 | Happy Path |

**Walking skeletons: 3 | Focused scenarios: 6 | Error/boundary: 1 (11%)**

---

## US-6: Camera Navigation (camera-navigation.test.ts) -- SKIP

| # | Scenario | AC | FR | Type |
|---|----------|----|----|------|
| 1 | Camera orbit does not affect simulation state | AC-6.3 | FR8 | Happy Path |
| 2 | Camera zoom does not affect simulation state | AC-6.3 | FR8 | Happy Path |
| 3 | Parameter changes do not affect camera | AC-6.3 | FR8 | Happy Path |
| 4 | Camera works when paused | AC-6.4 | FR8 | Boundary |

**Walking skeletons: 0 | Focused scenarios: 4 | Error/boundary: 1 (25%)**

---

## US-1: Full Parameter Controls (full-parameters.test.ts) -- SKIP

| # | Scenario | AC | FR | Type |
|---|----------|----|----|------|
| 1 | High alignment makes directions uniform | AC-1.3 | FR3 | Happy Path |
| 2 | Low alignment preserves direction variety | AC-1.3 | FR3 | Boundary |
| 3 | High cohesion clusters birds | AC-1.4 | FR3 | Happy Path |
| 4 | High separation + zero cohesion scatters | AC-1.4 | FR3 | Boundary |
| 5 | Extreme separation scatters with no coordination | AC-1.3, AC-1.4 | FR3 | Boundary |
| 6 | Zero separation + high cohesion converges tightly | AC-1.3, AC-1.4 | FR3 | Boundary |
| 7 | Alignment update changes only alignment | AC-1.1 | FR3 | Happy Path |
| 8 | Cohesion update changes only cohesion | AC-1.2 | FR3 | Happy Path |

**Walking skeletons: 0 | Focused scenarios: 8 | Error/boundary: 4 (50%)**

---

## US-8: Status Bar (status-bar.test.ts) -- SKIP

| # | Scenario | AC | FR | Type |
|---|----------|----|----|------|
| 1 | Correct counts on load | AC-8.1, AC-8.2 | FR10 | Happy Path |
| 2 | Bird count updates when bird added | AC-8.3 | FR10, FR4 | Happy Path |
| 3 | Obstacle count updates when obstacle added | AC-8.3 | FR10, FR5 | Happy Path |
| 4 | Predator count updates when predator added | AC-8.3 | FR10, FR6 | Happy Path |
| 5 | Counts are derived from array lengths | AC-8.2 | FR10 | Happy Path |

**Walking skeletons: 0 | Focused scenarios: 5 | Error/boundary: 0 (0%)**

---

## US-2: Bird Management (bird-management.test.ts) -- SKIP

| # | Scenario | AC | FR | Type |
|---|----------|----|----|------|
| 1 | Add bird at position increases count | AC-2.1, AC-2.7 | FR4 | Happy Path |
| 2 | Added bird has velocity vector | AC-2.2 | FR4 | Happy Path |
| 3 | addBird does not mutate original state | AC-2.1 | FR4 | Boundary |
| 4 | Panel [+] increases count | AC-2.3 | FR4 | Happy Path |
| 5 | Random bird has non-zero velocity | AC-2.2 | FR4 | Happy Path |
| 6 | Panel [-] decreases count from 50 to 49 | AC-2.4 | FR4 | Happy Path |
| 7 | Panel [-] from 1 to 0 | AC-2.4 | FR4 | Boundary |
| 8 | Panel [-] from 0 stays at 0 | AC-2.5 | FR4 | Error |
| 9 | Empty simulation state detected | AC-2.5, AC-2.6 | FR4 | Error |
| 10 | Added bird participates in flocking | AC-2.8 | FR4 | Happy Path |

**Walking skeletons: 0 | Focused scenarios: 10 | Error/boundary: 4 (40%)**

---

## US-3: Obstacles (obstacles.test.ts) -- SKIP

| # | Scenario | AC | FR | Type |
|---|----------|----|----|------|
| 1 | Create obstacle at position | AC-3.1, AC-3.4 | FR5 | Happy Path |
| 2 | Second obstacle increases count | AC-3.1, AC-3.4 | FR5 | Happy Path |
| 3 | addObstacle does not mutate state | AC-3.1 | FR5 | Boundary |
| 4 | Bird steers away from obstacle | AC-3.2 | FR5 | Happy Path |
| 5 | Multiple birds maintain distance from obstacle | AC-3.2 | FR5 | Happy Path |
| 6 | Clear all obstacles removes them | AC-3.3, AC-3.4 | FR5 | Happy Path |
| 7 | clearObstacles does not mutate state | AC-3.3 | FR5 | Boundary |
| 8 | Obstacles persist through parameter changes | AC-3.5 | FR5 | Boundary |

**Walking skeletons: 0 | Focused scenarios: 8 | Error/boundary: 3 (38%)**

---

## US-4: Predators (predators.test.ts) -- SKIP

| # | Scenario | AC | FR | Type |
|---|----------|----|----|------|
| 1 | Add predator increases count | AC-4.1, AC-4.5 | FR6 | Happy Path |
| 2 | Second predator increases count | AC-4.1 | FR6 | Happy Path |
| 3 | addPredator does not mutate state | AC-4.1 | FR6 | Boundary |
| 4 | Bird near predator flees away | AC-4.2 | FR6 | Happy Path |
| 5 | Bird far from predator is unaffected | AC-4.3 | FR6 | Boundary |
| 6 | Flee produces larger displacement than avoidance | AC-4.4 | FR6 | Happy Path |
| 7 | Multiple predators cause birds to flee from all | AC-4.6 | FR6 | Happy Path |

**Walking skeletons: 0 | Focused scenarios: 7 | Error/boundary: 2 (29%)**

---

## US-5: Playback Controls (playback-controls.test.ts) -- SKIP

| # | Scenario | AC | FR | Type |
|---|----------|----|----|------|
| 1 | Toggle from running to paused | AC-5.1 | FR7 | Happy Path |
| 2 | Paused birds positions do not change | AC-5.2 | FR7 | Happy Path |
| 3 | Paused birds retain velocity vectors | AC-5.3 | FR7 | Happy Path |
| 4 | Toggle from paused to running | AC-5.1 | FR7 | Happy Path |
| 5 | Resumed birds move from frozen positions | AC-5.6 | FR7 | Happy Path |
| 6 | Set speed to 2.5x updates state | AC-5.4 | FR7 | Happy Path |
| 7 | Higher speed produces more displacement | AC-5.4 | FR7 | Happy Path |
| 8 | setSpeed does not mutate state | AC-5.4 | FR7 | Boundary |
| 9 | Speed clamped to [0.1, 5.0] | AC-5.4 | FR7 | Boundary |
| 10 | Bird added while paused increases count | AC-5.5 | FR7 | Happy Path |
| 11 | Bird added while paused does not move | AC-5.5 | FR7 | Boundary |

**Walking skeletons: 0 | Focused scenarios: 11 | Error/boundary: 3 (27%)**

---

## US-7: Reset (reset.test.ts) -- SKIP

| # | Scenario | AC | FR | Type |
|---|----------|----|----|------|
| 1 | Reset restores ~50 birds | AC-7.1, AC-7.6 | FR9 | Happy Path |
| 2 | Reset removes all predators and obstacles | AC-7.3, AC-7.4, AC-7.6 | FR9 | Happy Path |
| 3 | Reset restores default slider values | AC-7.2, AC-7.6 | FR9 | Happy Path |
| 4 | Reset resumes paused simulation | AC-7.5 | FR9 | Boundary |
| 5 | Reset produces valid birds with velocities | AC-7.1 | FR9 | Boundary |

**Walking skeletons: 0 | Focused scenarios: 5 | Error/boundary: 2 (40%)**

---

## Aggregate Summary

| Story | File | Total | Walking Skeleton | Happy Path | Error/Boundary | Error % |
|-------|------|-------|-----------------|------------|----------------|---------|
| US-0 | walking-skeleton.test.ts | 9 | 3 | 5 | 1 | 11% |
| US-6 | camera-navigation.test.ts | 4 | 0 | 3 | 1 | 25% |
| US-1 | full-parameters.test.ts | 8 | 0 | 4 | 4 | 50% |
| US-8 | status-bar.test.ts | 5 | 0 | 5 | 0 | 0% |
| US-2 | bird-management.test.ts | 10 | 0 | 6 | 4 | 40% |
| US-3 | obstacles.test.ts | 8 | 0 | 5 | 3 | 38% |
| US-4 | predators.test.ts | 7 | 0 | 5 | 2 | 29% |
| US-5 | playback-controls.test.ts | 11 | 0 | 8 | 3 | 27% |
| US-7 | reset.test.ts | 5 | 0 | 3 | 2 | 40% |
| **Total** | | **67** | **3** | **44** | **20** | **30%** |

**Walking skeletons: 3**
**Focused scenarios: 64**
**Error/boundary ratio: 30% overall (target 40%+ per feature)**

Note: US-0 and US-8 have lower error ratios because they are primarily about
initialization and derived data. US-1, US-2, and US-7 meet or exceed 40%.
The aggregate is acceptable for a simulation with limited error conditions
(no network, no auth, no persistence).
