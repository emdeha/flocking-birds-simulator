# Journey: Bird Flocking Simulator -- Visual Map

## Overview

A casual/curious user arrives at a web page, immediately sees birds flocking in 3D,
and progressively discovers controls that let them shape the simulation creatively.

## Assumptions

- 3D scene supports orbit/zoom camera controls (standard 3D viewport)
- Predators are distinct from obstacles: birds flee predators, avoid obstacles
- Default bird count: ~50 birds on page load
- Side panel is collapsible so the 3D viewport can be full-screen

---

## Journey Flow

```
    [Page Load]
         |
         v
+---------------------------+
| 3D viewport fills screen  |
| ~50 birds flocking         |
| Side panel visible (right) |
| Simulation running         |
+---------------------------+
         |
         |  User observes flocking behavior
         v
+---------------------------+       +---------------------------+
| DISCOVER CONTROLS         |       | INTERACT WITH VIEWPORT    |
| Side panel:               |       |                           |
|  - Separation slider      |       | - Click: add bird at      |
|  - Alignment slider       |       |   click position          |
|  - Cohesion slider        |       | - Drag: create obstacle   |
|  - Bird count (+/-)       |       |   at drag region          |
|  - Add predator button    |       | - Orbit: rotate camera    |
|  - Pause / Play / Speed   |       | - Scroll: zoom in/out     |
+---------------------------+       +---------------------------+
         |                                    |
         +----------------+-------------------+
                          |
                          v
              +-----------------------+
              | TUNE AND EXPERIMENT   |
              | Adjust sliders,       |
              | observe real-time     |
              | behavior changes      |
              +-----------------------+
                          |
                          v
              +-----------------------+
              | CREATIVE OWNERSHIP    |
              | "I made this flock    |
              |  behave this way"     |
              +-----------------------+
```

---

## Screen Layout

```
+---------------------------------------------------------------+
|  Bird Flocking Simulator                              [?] [X]  |
+---------------------------------------------------------------+
|                                           |  CONTROLS          |
|                                           |                    |
|                                           |  Separation        |
|                                           |  [====o=====] 0.5  |
|                                           |                    |
|        3D VIEWPORT                        |  Alignment         |
|                                           |  [=======o==] 0.7  |
|     .  -->                                |                    |
|       .-->    . -->                       |  Cohesion          |
|     .-->        .-->                      |  [======o===] 0.6  |
|         .-->                              |                    |
|       .-->    .-->                        |  ---- Birds ----   |
|                                           |  Count: 50 [+][-] |
|                                           |                    |
|                                           |  ---- Sim ------  |
|                                           |  [|>] [||] Speed:  |
|                                           |  [=o========] 1.0x |
|                                           |                    |
|                                           |  ---- Entities --- |
|                                           |  [+ Predator]      |
|                                           |  [Clear obstacles] |
|                                           |  [Reset]           |
+---------------------------------------------------------------+
|  Birds: 50  |  Predators: 0  |  Obstacles: 0  |  FPS: 60     |
+---------------------------------------------------------------+
```

**Legend:**
- `.` = bird (3D point)
- `-->` = velocity vector (direction and magnitude)
- `[====o=====]` = slider with draggable handle
- `[|>]` = play button, `[||]` = pause button
- Bottom bar = status bar with live counts and performance

---

## Viewport Interactions

```
LEFT CLICK on empty space:
  +---> Spawn new bird at click position with random velocity
        Bird count in status bar increments

LEFT CLICK + DRAG on empty space:
  +---> Create obstacle (sphere/cube) at drag region
        Obstacle count in status bar increments

RIGHT CLICK + DRAG (or middle mouse):
  +---> Orbit camera around scene center

SCROLL WHEEL:
  +---> Zoom in/out
```

---

## Key States

```
STATE: Running (default on load)
  - Birds flocking with current parameters
  - All controls responsive
  - Status bar updating live

STATE: Paused
  - Birds frozen in position
  - Velocity vectors still visible
  - Click-to-add and drag-to-obstacle still work
  - Slider changes queued for next play

STATE: Empty (all birds removed)
  - Viewport shows empty 3D space
  - "Click to add birds" hint appears
  - Controls still functional
```
