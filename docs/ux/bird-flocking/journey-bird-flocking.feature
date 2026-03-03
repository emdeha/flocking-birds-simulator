Feature: Bird Flocking Simulator
  As a casual/curious user
  I want to observe and interact with a 3D bird flocking simulation
  So that I can explore emergent behavior and creatively shape the flock

  Background:
    Given Carlos Rivera opens the bird flocking simulator in a web browser

  # --- Page Load and Default State ---

  Scenario: Simulation starts immediately on page load
    When the page finishes loading
    Then Carlos sees a 3D viewport with approximately 50 birds flocking
    And each bird is rendered as a 3D point with a velocity vector
    And the simulation is running at 1.0x speed
    And the side panel is visible with all controls at default values

  Scenario: Status bar shows live simulation counts
    When the page finishes loading
    Then the status bar displays "Birds: 50"
    And the status bar displays "Predators: 0"
    And the status bar displays "Obstacles: 0"
    And the status bar displays the current FPS

  # --- Flocking Parameter Controls ---

  Scenario: Adjusting separation changes bird spacing in real-time
    Given the simulation is running with 50 birds
    When Carlos drags the separation slider from 0.5 to 0.9
    Then the birds increase their distance from each other in real-time
    And the separation slider displays the value 0.9

  Scenario: Adjusting alignment changes flock direction uniformity
    Given the simulation is running with 50 birds
    When Carlos drags the alignment slider from 0.7 to 0.2
    Then the birds show less tendency to match their neighbors' direction
    And velocity vectors point in more varied directions

  Scenario: Adjusting cohesion changes flock tightness
    Given the simulation is running with 50 birds
    When Carlos drags the cohesion slider from 0.6 to 1.0
    Then the birds cluster more tightly together
    And the flock forms a denser group in the viewport

  Scenario: Extreme separation disperses the flock
    Given the simulation is running with 50 birds
    When Carlos sets separation to 1.0, alignment to 0.0, and cohesion to 0.0
    Then the birds scatter away from each other across the viewport

  Scenario: Extreme cohesion with no separation creates a tight cluster
    Given the simulation is running with 50 birds
    When Carlos sets separation to 0.0, alignment to 0.5, and cohesion to 1.0
    Then the birds converge into a tight cluster

  # --- Adding and Removing Birds ---

  Scenario: Click to add a bird at click position
    Given the simulation is running with 50 birds
    When Carlos clicks on an empty area in the 3D viewport
    Then a new bird appears at the clicked position with a random velocity vector
    And the status bar updates to "Birds: 51"

  Scenario: Increment bird count from side panel
    Given the simulation is running with 50 birds
    When Carlos clicks the [+] button next to bird count
    Then a new bird spawns at a random position in the viewport
    And the status bar updates to "Birds: 51"

  Scenario: Decrement bird count from side panel
    Given the simulation is running with 50 birds
    When Carlos clicks the [-] button next to bird count
    Then one bird is removed from the simulation
    And the status bar updates to "Birds: 49"

  Scenario: Cannot decrement below zero birds
    Given the simulation is running with 1 bird
    When Carlos clicks the [-] button next to bird count
    Then the last bird is removed
    And the status bar updates to "Birds: 0"
    And the [-] button becomes disabled
    And the viewport shows a hint "Click to add birds"

  # --- Obstacles ---

  Scenario: Drag to create an obstacle
    Given the simulation is running with 50 birds
    When Carlos clicks and drags in an empty area of the viewport
    Then an obstacle appears in the dragged region
    And the status bar updates to "Obstacles: 1"
    And nearby birds begin avoiding the obstacle

  Scenario: Clear all obstacles
    Given there are 3 obstacles in the scene
    When Carlos clicks the "Clear obstacles" button in the side panel
    Then all obstacles are removed from the viewport
    And the status bar updates to "Obstacles: 0"

  # --- Predators ---

  Scenario: Add a predator
    Given the simulation is running with 50 birds
    When Carlos clicks the "Add Predator" button in the side panel
    Then a predator entity appears in the viewport
    And the status bar updates to "Predators: 1"
    And nearby birds begin fleeing from the predator

  Scenario: Birds flee from predator but still flock
    Given the simulation is running with 50 birds
    And there is 1 predator in the scene
    Then birds near the predator move away from it
    And birds far from the predator continue normal flocking behavior

  # --- Playback Controls ---

  Scenario: Pause the simulation
    Given the simulation is running
    When Carlos clicks the pause button
    Then all birds freeze in their current position
    And velocity vectors remain visible
    And the pause button changes to a play button

  Scenario: Resume the simulation
    Given the simulation is paused
    When Carlos clicks the play button
    Then the birds resume flocking from their frozen positions
    And the play button changes to a pause button

  Scenario: Adjust simulation speed
    Given the simulation is running at 1.0x speed
    When Carlos drags the speed slider to 2.5x
    Then the simulation runs 2.5 times faster than real-time
    And the speed slider displays "2.5x"

  Scenario: Add birds while paused
    Given the simulation is paused with 50 birds
    When Carlos clicks on an empty area in the 3D viewport
    Then a new bird appears at the clicked position with a velocity vector
    And the bird remains frozen until Carlos resumes the simulation
    And the status bar updates to "Birds: 51"

  # --- Camera Controls ---

  Scenario: Orbit camera around the scene
    Given the simulation is running
    When Carlos right-click-drags in the viewport
    Then the camera orbits around the scene center
    And the birds and controls remain unaffected

  Scenario: Zoom in and out
    Given the simulation is running
    When Carlos scrolls the mouse wheel in the viewport
    Then the camera zooms in or out relative to the scene

  # --- Reset ---

  Scenario: Reset to defaults
    Given Carlos has modified multiple parameters and added predators and obstacles
    When Carlos clicks the "Reset" button
    Then the simulation returns to the default state
    And bird count returns to approximately 50
    And all sliders return to default values
    And all predators and obstacles are removed
    And the simulation is running at 1.0x speed
