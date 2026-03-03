# Acceptance Criteria: Bird Flocking Simulator

This document consolidates all acceptance criteria across user stories for
quick reference and validation tracking.

---

## US-0: Walking Skeleton

| ID     | Criterion                                                          | Status |
|--------|--------------------------------------------------------------------|--------|
| AC-0.1 | 3D viewport renders on page load without user action               | [ ]    |
| AC-0.2 | Approximately 10 birds are visible as 3D points                    | [ ]    |
| AC-0.3 | Each bird displays a velocity vector (direction and magnitude)     | [ ]    |
| AC-0.4 | Birds exhibit flocking behavior (separation, alignment, cohesion)  | [ ]    |
| AC-0.5 | Separation slider is visible and adjustable                        | [ ]    |
| AC-0.6 | Changing separation slider modifies bird spacing in real-time      | [ ]    |
| AC-0.7 | Simulation maintains interactive frame rate on a modern browser    | [ ]    |

---

## US-1: Full Flocking Parameter Controls

| ID     | Criterion                                                          | Status |
|--------|--------------------------------------------------------------------|--------|
| AC-1.1 | Alignment slider visible in side panel with range [0.0, 1.0]      | [ ]    |
| AC-1.2 | Cohesion slider visible in side panel with range [0.0, 1.0]       | [ ]    |
| AC-1.3 | Alignment changes affect direction uniformity in real-time         | [ ]    |
| AC-1.4 | Cohesion changes affect flock density in real-time                 | [ ]    |
| AC-1.5 | Each slider displays its current numeric value                     | [ ]    |
| AC-1.6 | All three sliders are labeled                                      | [ ]    |

---

## US-2: Bird Population Management

| ID     | Criterion                                                          | Status |
|--------|--------------------------------------------------------------------|--------|
| AC-2.1 | Left-click in viewport spawns bird at the clicked 3D position      | [ ]    |
| AC-2.2 | New birds have random initial velocity vectors                     | [ ]    |
| AC-2.3 | [+] button increments bird count (spawns at random position)       | [ ]    |
| AC-2.4 | [-] button decrements bird count                                   | [ ]    |
| AC-2.5 | [-] button disabled at 0 birds                                     | [ ]    |
| AC-2.6 | Empty simulation shows "Click to add birds" hint                   | [ ]    |
| AC-2.7 | Status bar displays accurate live bird count                       | [ ]    |
| AC-2.8 | Added birds participate in flocking immediately                    | [ ]    |

---

## US-3: Obstacles via Drag Interaction

| ID     | Criterion                                                          | Status |
|--------|--------------------------------------------------------------------|--------|
| AC-3.1 | Left-click-drag in viewport creates an obstacle in the dragged region | [ ] |
| AC-3.2 | Birds steer around obstacles (avoidance behavior)                  | [ ]    |
| AC-3.3 | "Clear obstacles" button removes all obstacles                     | [ ]    |
| AC-3.4 | Status bar displays accurate live obstacle count                   | [ ]    |
| AC-3.5 | Obstacles persist when flocking parameters are changed             | [ ]    |

---

## US-4: Predator Entities

| ID     | Criterion                                                          | Status |
|--------|--------------------------------------------------------------------|--------|
| AC-4.1 | "Add Predator" button spawns a predator entity in the scene        | [ ]    |
| AC-4.2 | Birds within flee range move rapidly away from predators           | [ ]    |
| AC-4.3 | Birds outside flee range are unaffected by predators               | [ ]    |
| AC-4.4 | Flee behavior is visually distinct from obstacle avoidance         | [ ]    |
| AC-4.5 | Status bar displays accurate live predator count                   | [ ]    |
| AC-4.6 | Multiple predators produce cumulative flee effects                 | [ ]    |

---

## US-5: Playback and Speed Controls

| ID     | Criterion                                                          | Status |
|--------|--------------------------------------------------------------------|--------|
| AC-5.1 | Play/pause button toggles simulation state                         | [ ]    |
| AC-5.2 | Paused birds freeze at exact current positions                     | [ ]    |
| AC-5.3 | Velocity vectors remain visible when paused                        | [ ]    |
| AC-5.4 | Speed slider range [0.1x, 5.0x] adjusts simulation tick rate      | [ ]    |
| AC-5.5 | Birds/obstacles added while paused are frozen until resume         | [ ]    |
| AC-5.6 | Resume continues from exact frozen state (no discontinuity)        | [ ]    |

---

## US-6: Camera Navigation

| ID     | Criterion                                                          | Status |
|--------|--------------------------------------------------------------------|--------|
| AC-6.1 | Right-click-drag orbits camera around scene center                 | [ ]    |
| AC-6.2 | Scroll wheel zooms in/out                                          | [ ]    |
| AC-6.3 | Camera state is independent of simulation state                    | [ ]    |
| AC-6.4 | Camera controls work both when running and paused                  | [ ]    |

---

## US-7: Reset to Defaults

| ID     | Criterion                                                          | Status |
|--------|--------------------------------------------------------------------|--------|
| AC-7.1 | "Reset" button restores ~50 birds with default flocking behavior   | [ ]    |
| AC-7.2 | All sliders return to defaults (sep 0.5, align 0.7, coh 0.6, speed 1.0x) | [ ] |
| AC-7.3 | All predators removed                                              | [ ]    |
| AC-7.4 | All obstacles removed                                              | [ ]    |
| AC-7.5 | Simulation state set to running (not paused)                       | [ ]    |
| AC-7.6 | Status bar reflects all reset values                               | [ ]    |

---

## US-8: Status Bar with Live Metrics

| ID     | Criterion                                                          | Status |
|--------|--------------------------------------------------------------------|--------|
| AC-8.1 | Status bar is visible at the bottom of the viewport at all times   | [ ]    |
| AC-8.2 | Displays bird count, predator count, obstacle count, and FPS       | [ ]    |
| AC-8.3 | Counts update on the same frame as the visual change               | [ ]    |
| AC-8.4 | FPS reflects actual rendering performance                          | [ ]    |

---

## Summary

| Story | Criteria Count | Dependencies        |
|-------|---------------|----------------------|
| US-0  | 7             | None                 |
| US-1  | 6             | US-0                 |
| US-2  | 8             | US-0                 |
| US-3  | 5             | US-0, US-2           |
| US-4  | 6             | US-0, US-3           |
| US-5  | 6             | US-0                 |
| US-6  | 4             | US-0                 |
| US-7  | 6             | US-0 through US-6    |
| US-8  | 4             | US-0 (incremental)   |
| **Total** | **52**    |                      |
