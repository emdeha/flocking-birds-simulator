# User Stories: Bird Flocking Simulator

---

## US-0: Walking Skeleton -- Minimal Flocking Simulation

### Problem (The Pain)

Carlos Rivera is a curious person who wants to see bird flocking behavior in
action. He has no way to observe emergent flocking patterns in a browser without
installing software or reading documentation. He wants to open a page and
immediately see something alive.

### Who (The User)

- Casual/curious user with no technical background
- Using a modern web browser on a desktop/laptop
- Motivated by immediate visual gratification and curiosity

### Solution (What We Build)

A web page that renders a 3D viewport on load with approximately 10 birds
flocking using basic separation, alignment, and cohesion rules. Each bird is
a 3D point with a velocity vector. One slider (separation) allows real-time
adjustment of bird spacing behavior.

### Domain Examples

#### Example 1: Page Load with Default Flocking

Carlos Rivera opens the simulator URL. The page loads and within 2 seconds he
sees approximately 10 birds rendered as 3D points moving in a coordinated flock.
Each bird has a line extending from it showing its direction and speed.

#### Example 2: Adjusting Separation

Carlos drags the separation slider from 0.5 to 0.9. The birds immediately
spread apart, maintaining more distance from each other. The velocity vectors
shift as birds adjust their paths to maintain spacing.

#### Example 3: Separation at Zero

Carlos drags the separation slider to 0.0. The birds no longer avoid each
other and begin overlapping, clustering unnaturally. This confirms the slider
is actually controlling behavior.

### UAT Scenarios (BDD)

#### Scenario: Birds flock on page load

Given Carlos Rivera opens the bird flocking simulator in a browser
When the page finishes loading
Then he sees a 3D viewport with approximately 10 birds rendered as 3D points
And each bird displays a velocity vector line
And the birds are moving in a coordinated flocking pattern

#### Scenario: Separation slider changes bird spacing

Given Carlos Rivera is viewing the simulation with 10 birds flocking
When he drags the separation slider from 0.5 to 0.9
Then the birds increase their distance from each other within the next rendered frame

#### Scenario: Separation at minimum removes spacing behavior

Given Carlos Rivera is viewing the simulation with 10 birds flocking
When he drags the separation slider to 0.0
Then the birds no longer maintain distance from each other

### Acceptance Criteria

- [ ] 3D viewport renders on page load without user action
- [ ] Approximately 10 birds are visible as 3D points
- [ ] Each bird displays a velocity vector (direction and magnitude line)
- [ ] Birds exhibit flocking behavior (separation, alignment, cohesion)
- [ ] Separation slider is visible and adjustable
- [ ] Changing separation slider modifies bird spacing in real-time
- [ ] Simulation maintains interactive frame rate on a modern browser

### Technical Notes

- This is the walking skeleton: validates that 3D rendering, simulation engine,
  and UI-to-engine communication all work end-to-end
- Reduced bird count (~10) to minimize performance risk in initial slice
- Only one slider (separation) to minimize UI complexity in initial slice
- Architecture decisions made here constrain all subsequent stories

---

## US-1: Full Flocking Parameter Controls

### Problem (The Pain)

Priya Sharma is a curious user watching birds flock in the simulator. She can
only adjust separation, but she wants to explore how alignment and cohesion
affect behavior. Without these controls, she can only see one dimension of
flocking and quickly loses interest.

### Who (The User)

- Casual user who has already experienced the walking skeleton
- Wants to experiment with different flocking "personalities"
- Motivated by discovering surprising emergent behaviors

### Solution (What We Build)

Add alignment and cohesion sliders to the side panel. All three flocking
parameter sliders (separation, alignment, cohesion) are visible with labeled
values and adjust simulation behavior in real-time.

### Domain Examples

#### Example 1: High Alignment Creates Uniform Direction

Priya Sharma sets alignment to 0.95 while keeping separation and cohesion at
defaults. The birds quickly align their velocity vectors and move in nearly
the same direction, forming a stream-like pattern.

#### Example 2: High Cohesion Creates Tight Cluster

Priya sets cohesion to 1.0 and separation to 0.2. The birds collapse into a
tight, dense cluster that moves together as a single mass.

#### Example 3: Extreme Settings Create Chaos

Priya sets separation to 1.0, alignment to 0.0, and cohesion to 0.0. The
birds scatter in all directions with no coordination, each avoiding neighbors
but having no drive to align or group.

### UAT Scenarios (BDD)

#### Scenario: Alignment slider affects direction uniformity

Given Priya Sharma is viewing the simulation with 50 birds flocking
When she drags the alignment slider from 0.7 to 0.95
Then the birds' velocity vectors become more uniform in direction

#### Scenario: Cohesion slider affects flock density

Given Priya Sharma is viewing the simulation with 50 birds flocking
When she drags the cohesion slider from 0.6 to 1.0
Then the birds cluster more tightly together

#### Scenario: Combined extreme settings produce expected behavior

Given Priya Sharma is viewing the simulation with 50 birds flocking
When she sets separation to 1.0, alignment to 0.0, and cohesion to 0.0
Then the birds scatter away from each other with no coordinated movement

#### Scenario: Slider values are displayed

Given Priya Sharma is viewing the side panel
Then each slider displays its current numeric value
And each slider is labeled (Separation, Alignment, Cohesion)

### Acceptance Criteria

- [ ] Alignment slider visible in side panel with range [0.0, 1.0]
- [ ] Cohesion slider visible in side panel with range [0.0, 1.0]
- [ ] Alignment changes affect direction uniformity in real-time
- [ ] Cohesion changes affect flock density in real-time
- [ ] Each slider displays its current numeric value
- [ ] All three sliders are labeled

### Technical Notes

- Depends on US-0 (walking skeleton with separation slider)
- Alignment and cohesion use the same slider-to-engine communication path as separation

---

## US-2: Bird Population Management

### Problem (The Pain)

Marcus Chen is exploring the flocking simulator and wants to see how the flock
behaves with more or fewer birds. He cannot add or remove birds, so he is
stuck with the default count and cannot explore density-dependent behaviors
like large-flock murmuration patterns or small-group dynamics.

### Who (The User)

- Casual user who has adjusted flocking parameters and now wants to experiment with scale
- Interested in seeing how bird count affects emergent behavior
- Wants both precise control (panel buttons) and playful interaction (click to add)

### Solution (What We Build)

Users can add birds by clicking in the 3D viewport (spawns bird at clicked
position) or using [+]/[-] buttons in the side panel. Status bar displays
live bird count.

### Domain Examples

#### Example 1: Click to Add Bird at Position

Marcus Chen clicks in the upper-left area of the 3D viewport. A new bird
appears exactly where he clicked, with a random velocity vector. The status
bar updates from "Birds: 50" to "Birds: 51".

#### Example 2: Remove Birds via Panel

Marcus clicks the [-] button three times. Three birds are removed from the
simulation. The status bar updates to "Birds: 47".

#### Example 3: Empty Simulation Shows Hint

Marcus removes all birds using the [-] button until the count reaches 0. The
viewport shows a hint: "Click to add birds". The [-] button is disabled.

### UAT Scenarios (BDD)

#### Scenario: Click in viewport adds bird at position

Given Marcus Chen is viewing the simulation with 50 birds
When he left-clicks on an empty area in the 3D viewport
Then a new bird appears at the clicked 3D position with a random velocity vector
And the status bar updates to "Birds: 51"

#### Scenario: Panel increment adds bird

Given Marcus Chen is viewing the simulation with 50 birds
When he clicks the [+] button next to bird count
Then a new bird spawns at a random position in the viewport
And the status bar updates to "Birds: 51"

#### Scenario: Panel decrement removes bird

Given Marcus Chen is viewing the simulation with 50 birds
When he clicks the [-] button next to bird count
Then one bird is removed from the simulation
And the status bar updates to "Birds: 49"

#### Scenario: Cannot decrement below zero

Given Marcus Chen is viewing the simulation with 0 birds
Then the [-] button is disabled
And the viewport displays "Click to add birds"

#### Scenario: Added birds participate in flocking

Given Marcus Chen has added 5 birds by clicking in the viewport
Then all added birds exhibit the same flocking behavior as original birds

### Acceptance Criteria

- [ ] Left-click in viewport spawns bird at the clicked 3D position
- [ ] New birds have random initial velocity vectors
- [ ] [+] button increments bird count (spawns at random position)
- [ ] [-] button decrements bird count
- [ ] [-] button disabled at 0 birds
- [ ] Empty simulation shows "Click to add birds" hint
- [ ] Status bar displays accurate live bird count
- [ ] Added birds participate in flocking immediately

### Technical Notes

- Requires raycasting (or equivalent) to convert 2D screen click to 3D world position
- Depends on US-0 (3D viewport and simulation engine)

---

## US-3: Obstacles via Drag Interaction

### Problem (The Pain)

Aisha Okonkwo is watching birds flock and wants to see how they react to
barriers in their path. Without obstacles, the birds move freely and she
cannot observe avoidance behavior, which is one of the most visually
interesting aspects of flocking.

### Who (The User)

- Casual user who wants to create scenarios and watch the flock respond
- Motivated by "what happens if I put a wall here?"
- Expects intuitive drag-to-create interaction

### Solution (What We Build)

Users drag in the viewport to create obstacles. Birds avoid obstacles by
steering around them. A "Clear obstacles" button removes all obstacles.
Status bar shows obstacle count.

### Domain Examples

#### Example 1: Drag to Create Obstacle

Aisha Okonkwo clicks and drags across a section of the viewport. An obstacle
appears in the dragged region. Birds approaching the obstacle steer around it,
splitting the flock into two streams that rejoin on the other side.

#### Example 2: Multiple Obstacles Create a Corridor

Aisha creates two parallel obstacles, forming a narrow corridor. The flock
funnels through the gap, compressing and then expanding on the other side.

#### Example 3: Clear All Obstacles

Aisha has placed 5 obstacles. She clicks "Clear obstacles" in the side panel.
All obstacles disappear and the birds resume unobstructed flocking. Status bar
updates to "Obstacles: 0".

### UAT Scenarios (BDD)

#### Scenario: Drag creates obstacle in viewport

Given Aisha Okonkwo is viewing the simulation with 50 birds
When she left-click-drags across a region in the 3D viewport
Then an obstacle appears in the dragged region
And the status bar updates to "Obstacles: 1"

#### Scenario: Birds avoid obstacles

Given there is 1 obstacle in the scene
When birds approach the obstacle
Then they steer around it rather than passing through it

#### Scenario: Clear obstacles removes all

Given there are 3 obstacles in the scene
When Aisha clicks the "Clear obstacles" button
Then all obstacles are removed from the viewport
And the status bar updates to "Obstacles: 0"

#### Scenario: Obstacles persist through parameter changes

Given there are 2 obstacles in the scene
When Aisha adjusts the separation slider
Then the obstacles remain in place
And birds continue to avoid them with updated flocking parameters

### Acceptance Criteria

- [ ] Left-click-drag in viewport creates an obstacle in the dragged region
- [ ] Birds steer around obstacles (avoidance behavior)
- [ ] "Clear obstacles" button removes all obstacles
- [ ] Status bar displays accurate live obstacle count
- [ ] Obstacles persist when flocking parameters are changed

### Technical Notes

- Requires distinguishing click (add bird) from click-drag (add obstacle) -- likely a distance/time threshold
- Depends on US-0 (viewport and simulation) and US-2 (click interaction precedent)

---

## US-4: Predator Entities

### Problem (The Pain)

Tomoko Hayashi has tuned her flock's parameters and created obstacles, but the
flock behavior feels static -- the birds follow the same patterns. She wants to
introduce a dynamic threat that causes the flock to react with urgency, creating
dramatic splitting and reforming behaviors.

### Who (The User)

- Engaged user who has explored parameters and obstacles
- Wants to see dramatic, dynamic flock reactions
- Expects predators to create visually distinct behavior from obstacles

### Solution (What We Build)

An "Add Predator" button in the side panel spawns a predator entity in the scene.
Birds near a predator flee from it (distinct from obstacle avoidance -- flee is
faster and more urgent). Status bar shows predator count.

### Domain Examples

#### Example 1: Add Predator Causes Flee Response

Tomoko Hayashi clicks "Add Predator". A predator appears in the center of the
flock. Nearby birds scatter rapidly away from the predator, splitting the flock.
Birds far from the predator continue normal flocking.

#### Example 2: Predator Among Obstacles

Tomoko has obstacles forming a corridor and adds a predator at one end. Birds
in the corridor flee toward the other end, creating a stampede effect through
the corridor.

#### Example 3: Multiple Predators

Tomoko adds 3 predators at different positions. The flock fragments into small
groups, each seeking space away from the nearest predator. The status bar shows
"Predators: 3".

### UAT Scenarios (BDD)

#### Scenario: Add predator via side panel

Given Tomoko Hayashi is viewing the simulation with 50 birds and no predators
When she clicks the "Add Predator" button
Then a predator entity appears in the viewport
And the status bar updates to "Predators: 1"

#### Scenario: Birds flee from predator

Given there is 1 predator in the scene with 50 birds
Then birds within flee range of the predator move rapidly away from it
And birds outside flee range continue normal flocking behavior

#### Scenario: Flee is distinct from obstacle avoidance

Given there is 1 predator and 1 obstacle in the scene
Then birds near the predator flee with urgency (faster speed change)
And birds near the obstacle steer around it gradually

#### Scenario: Multiple predators fragment the flock

Given Tomoko has added 3 predators at different positions
Then the flock splits into smaller groups
And each group maintains distance from the nearest predator

### Acceptance Criteria

- [ ] "Add Predator" button spawns a predator entity in the scene
- [ ] Birds within flee range move rapidly away from predators
- [ ] Birds outside flee range are unaffected by predators
- [ ] Flee behavior is visually distinct from obstacle avoidance
- [ ] Status bar displays accurate live predator count
- [ ] Multiple predators produce cumulative flee effects

### Technical Notes

- Predator flee behavior needs a larger influence radius and stronger force than obstacle avoidance
- Depends on US-0 (simulation engine) and US-3 (obstacle precedent for entity interaction)

---

## US-5: Playback and Speed Controls

### Problem (The Pain)

Diego Fernandez is watching a complex flock interaction near an obstacle and
wants to slow it down or pause to study the bird positions and velocity vectors.
Without playback controls, the simulation runs at a fixed speed and he cannot
examine interesting moments or speed through uninteresting ones.

### Who (The User)

- User who wants to study specific moments in detail
- Wants to slow down dramatic events (flock splitting around obstacle)
- Wants to speed up to reach interesting states faster

### Solution (What We Build)

Play/pause toggle and speed slider [0.1x, 5.0x] in the side panel. Pausing
freezes all birds in position with velocity vectors still visible. Adding
birds/obstacles while paused queues them for the next play.

### Domain Examples

#### Example 1: Pause to Study Flock Split

Diego Fernandez watches birds split around an obstacle. He clicks pause at the
moment of splitting. All birds freeze in their current positions. He can orbit
the camera to examine the formation from different angles. Velocity vectors show
where each bird was heading.

#### Example 2: Slow Motion for Predator Flee

Diego sets speed to 0.2x and adds a predator. He watches in slow motion as the
birds near the predator begin to flee, observing the wave of reaction propagate
through the flock.

#### Example 3: Speed Up to Fill Scene

Diego sets speed to 5.0x and uses [+] to rapidly add birds, watching the flock
grow and form patterns at accelerated speed.

### UAT Scenarios (BDD)

#### Scenario: Pause freezes all birds

Given Diego Fernandez is viewing a running simulation with 50 birds
When he clicks the pause button
Then all birds freeze in their current positions
And velocity vectors remain visible
And the pause button changes to a play button

#### Scenario: Resume from paused state

Given the simulation is paused with 50 birds frozen
When Diego clicks the play button
Then the birds resume from their exact frozen positions and velocities

#### Scenario: Speed slider adjusts simulation rate

Given the simulation is running at 1.0x speed
When Diego drags the speed slider to 0.2x
Then the simulation runs at one-fifth real-time speed

#### Scenario: Adding birds while paused

Given the simulation is paused
When Diego clicks in the viewport to add a bird
Then the bird appears frozen at the clicked position
And it begins moving when Diego resumes the simulation

### Acceptance Criteria

- [ ] Play/pause button toggles simulation state
- [ ] Paused birds freeze at exact current positions
- [ ] Velocity vectors remain visible when paused
- [ ] Speed slider range [0.1x, 5.0x] adjusts simulation tick rate
- [ ] Birds/obstacles added while paused are frozen until resume
- [ ] Resume continues from exact frozen state (no discontinuity)

### Technical Notes

- Depends on US-0 (simulation engine with tick-based update loop)
- Pause must freeze the simulation loop, not just hide movement

---

## US-6: Camera Navigation

### Problem (The Pain)

Lin Wei is viewing a 3D flocking simulation but can only see it from one fixed
angle. She cannot rotate around the flock to see its 3D structure, and she
cannot zoom in to observe individual birds or zoom out to see the full pattern.
The 3D nature of the simulation is wasted on a fixed camera.

### Who (The User)

- Any user of the 3D simulation
- Expects standard 3D viewport controls (orbit, zoom)
- Wants to examine the flock from multiple perspectives

### Solution (What We Build)

Standard 3D camera controls: right-click-drag to orbit around scene center,
scroll wheel to zoom in/out. Camera changes do not affect simulation state
or controls.

### Domain Examples

#### Example 1: Orbit to See Flock Structure

Lin Wei right-click-drags to rotate the camera 90 degrees. She can now see
the flock from the side, revealing that it has a flat, disc-like shape rather
than the spherical shape she assumed from the front view.

#### Example 2: Zoom In on Individual Birds

Lin scrolls to zoom in close to a few birds. She can see individual velocity
vectors clearly and observe how each bird responds to its neighbors.

#### Example 3: Camera Unaffected by Simulation Controls

Lin orbits to a specific angle, then adjusts the cohesion slider. The flock
behavior changes but her camera position remains exactly where she placed it.

### UAT Scenarios (BDD)

#### Scenario: Orbit camera with right-click-drag

Given Lin Wei is viewing the simulation
When she right-click-drags in the viewport
Then the camera orbits around the scene center

#### Scenario: Zoom with scroll wheel

Given Lin Wei is viewing the simulation
When she scrolls the mouse wheel forward
Then the camera zooms in toward the scene

#### Scenario: Camera is independent of simulation

Given Lin Wei has orbited to a custom camera angle
When she adjusts flocking parameter sliders
Then the camera position and angle remain unchanged

### Acceptance Criteria

- [ ] Right-click-drag orbits camera around scene center
- [ ] Scroll wheel zooms in/out
- [ ] Camera state is independent of simulation state
- [ ] Camera controls work both when simulation is running and paused

### Technical Notes

- Depends on US-0 (3D viewport)
- Must not conflict with left-click (add bird) and left-click-drag (add obstacle) interactions

---

## US-7: Reset to Defaults

### Problem (The Pain)

Kenji Nakamura has been experimenting extensively -- 200 birds, 5 predators,
12 obstacles, extreme slider values, 0.1x speed. The simulation is chaotic and
he wants to start fresh without reloading the page. Without a reset, he has to
manually undo each change or refresh the browser, losing his session context.

### Who (The User)

- User who has experimented heavily and wants a clean slate
- Expects "Reset" to return to the exact initial state
- Does not want to reload the page

### Solution (What We Build)

"Reset" button in the side panel returns the simulation to its default state:
~50 birds, default slider values, no predators, no obstacles, running at 1.0x.

### Domain Examples

#### Example 1: Reset from Complex State

Kenji Nakamura has 200 birds, 5 predators, 12 obstacles, separation at 0.1,
alignment at 0.9, cohesion at 0.0, speed at 3.0x. He clicks "Reset". The scene
returns to ~50 birds flocking with default parameters, no predators, no
obstacles, speed 1.0x. All sliders snap to their default positions.

#### Example 2: Reset from Paused State

Kenji has the simulation paused with birds frozen. He clicks "Reset". The
simulation returns to defaults and resumes running (not paused).

#### Example 3: Reset from Empty State

Kenji has removed all birds. He clicks "Reset". The simulation returns to
~50 birds flocking.

### UAT Scenarios (BDD)

#### Scenario: Reset restores default bird count

Given Kenji Nakamura has added birds until the count is 200
When he clicks the "Reset" button
Then the bird count returns to approximately 50
And the status bar reflects the new count

#### Scenario: Reset removes predators and obstacles

Given there are 5 predators and 12 obstacles in the scene
When Kenji clicks the "Reset" button
Then all predators and obstacles are removed
And the status bar shows "Predators: 0" and "Obstacles: 0"

#### Scenario: Reset restores default slider values

Given Kenji has changed all sliders to non-default values
When he clicks the "Reset" button
Then separation returns to 0.5, alignment to 0.7, cohesion to 0.6
And simulation speed returns to 1.0x

#### Scenario: Reset resumes a paused simulation

Given the simulation is paused
When Kenji clicks the "Reset" button
Then the simulation is running (not paused) with default values

### Acceptance Criteria

- [ ] "Reset" button restores ~50 birds with default flocking behavior
- [ ] All sliders return to default values (sep 0.5, align 0.7, coh 0.6, speed 1.0x)
- [ ] All predators removed
- [ ] All obstacles removed
- [ ] Simulation state set to running (not paused)
- [ ] Status bar reflects all reset values

### Technical Notes

- Depends on all previous stories (resets everything they introduce)
- Must reset every piece of shared state in the artifact registry

---

## US-8: Status Bar with Live Metrics

### Problem (The Pain)

Fatima Al-Hassan is interacting with the simulation but has no way to know how
many birds, predators, or obstacles are currently in the scene without counting
them visually. She also has no indication of whether the simulation is performing
well or struggling. Without metrics, she is flying blind.

### Who (The User)

- Any user of the simulation
- Wants at-a-glance awareness of simulation state
- Needs to know if performance is degrading (too many entities)

### Solution (What We Build)

Persistent status bar at the bottom of the viewport showing: bird count,
predator count, obstacle count, and FPS -- all updated in real-time.

### Domain Examples

#### Example 1: Counts Update as Entities Change

Fatima Al-Hassan clicks in the viewport to add 3 birds. The status bar updates
from "Birds: 50" to "Birds: 51", then "Birds: 52", then "Birds: 53" with each
click.

#### Example 2: FPS Drops Signal Performance Issue

Fatima adds birds rapidly until the count reaches 500. She notices the FPS
counter dropping from 60 to 25, signaling that performance is degrading. She
removes birds until FPS recovers.

#### Example 3: All Counts After Reset

Fatima clicks "Reset". The status bar immediately shows "Birds: 50 | Predators: 0 | Obstacles: 0 | FPS: 60".

### UAT Scenarios (BDD)

#### Scenario: Status bar visible on load

Given Fatima Al-Hassan opens the bird flocking simulator
When the page loads
Then a status bar is visible at the bottom of the viewport
And it displays "Birds: 50", "Predators: 0", "Obstacles: 0", and the current FPS

#### Scenario: Bird count updates in real-time

Given Fatima is viewing the simulation with 50 birds
When she clicks in the viewport to add a bird
Then the bird count in the status bar updates to 51 on the same frame the bird appears

#### Scenario: FPS reflects actual performance

Given the simulation is running
Then the FPS value in the status bar reflects the actual rendering frame rate
And updates continuously

### Acceptance Criteria

- [ ] Status bar is visible at the bottom of the viewport at all times
- [ ] Displays bird count, predator count, obstacle count, and FPS
- [ ] Counts update on the same frame as the visual change
- [ ] FPS reflects actual rendering performance

### Technical Notes

- Depends on US-0 (viewport rendering) for FPS measurement
- Depends on US-2, US-3, US-4 for entity counts
- Can be implemented incrementally: bird count in US-0, other counts added as entities are introduced

---

## Story Dependency Map

```
US-0 (Walking Skeleton)
  |
  +---> US-1 (Full Parameter Controls)
  |
  +---> US-2 (Bird Population Management)
  |       |
  |       +---> US-3 (Obstacles)
  |               |
  |               +---> US-4 (Predators)
  |
  +---> US-5 (Playback Controls)
  |
  +---> US-6 (Camera Navigation)
  |
  +---> US-8 (Status Bar) -- incremental, starts with US-0
  |
  US-7 (Reset) -- depends on all above (resets everything)
```

## Suggested Implementation Order

1. **US-0** -- Walking skeleton (validates architecture)
2. **US-6** -- Camera navigation (essential for 3D usability)
3. **US-1** -- Full parameter controls (core interaction)
4. **US-8** -- Status bar (live feedback)
5. **US-2** -- Bird population management (click-to-add)
6. **US-3** -- Obstacles (drag-to-create)
7. **US-4** -- Predators (dynamic entities)
8. **US-5** -- Playback controls (study and speed)
9. **US-7** -- Reset (depends on everything else existing)
