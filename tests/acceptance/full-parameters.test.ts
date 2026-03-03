import { describe, it, expect } from "vitest";
import {
  createSimulationState,
  createBirds,
  averagePairwiseDistance,
  velocityDirectionVariance,
  runSimulationTicks,
} from "./test-helpers";
import { simulateTick } from "../../src/simulation/tick";
import { updateFlockingParam } from "../../src/state/state-transitions";

describe("US-1: Full Flocking Parameter Controls", () => {
  describe("Alignment slider affects direction uniformity", () => {
    it("Given 50 birds with varied directions, when alignment is set to 0.95, then velocity directions become more uniform", () => {
      const variedBirds = createBirds(20, (i) => ({
        position: { x: i * 5, y: i * 3, z: 0 },
        velocity: {
          x: Math.cos((i * Math.PI) / 10),
          y: Math.sin((i * Math.PI) / 10),
          z: 0,
        },
      }));

      const highAlignState = createSimulationState({
        birds: variedBirds,
        parameters: {
          flocking: {
            separationWeight: 0.0,
            alignmentWeight: 0.95,
            cohesionWeight: 0.0,
          },
          neighborRadius: 100,
          separationRadius: 25,
          maxSpeed: 4,
          maxForce: 0.1,
          obstacleAvoidanceRadius: 30,
          obstacleAvoidanceWeight: 1.5,
          predatorFleeRadius: 80,
          predatorFleeWeight: 3.0,
          worldBounds: {
            min: { x: -500, y: -500, z: -500 },
            max: { x: 500, y: 500, z: 500 },
          },
        },
      });
      const initialVariance = velocityDirectionVariance(highAlignState.birds);

      const finalState = runSimulationTicks(simulateTick, highAlignState, 120);
      const finalVariance = velocityDirectionVariance(finalState.birds);

      expect(finalVariance).toBeLessThan(initialVariance);
    });

    it("Given 50 birds, when alignment is set to 0.2, then velocity directions remain varied", () => {
      const variedBirds = createBirds(20, (i) => ({
        position: { x: i * 5, y: i * 3, z: 0 },
        velocity: {
          x: Math.cos((i * Math.PI) / 10),
          y: Math.sin((i * Math.PI) / 10),
          z: 0,
        },
      }));

      const lowAlignState = createSimulationState({
        birds: variedBirds,
        parameters: {
          flocking: {
            separationWeight: 0.0,
            alignmentWeight: 0.2,
            cohesionWeight: 0.0,
          },
          neighborRadius: 100,
          separationRadius: 25,
          maxSpeed: 4,
          maxForce: 0.1,
          obstacleAvoidanceRadius: 30,
          obstacleAvoidanceWeight: 1.5,
          predatorFleeRadius: 80,
          predatorFleeWeight: 3.0,
          worldBounds: {
            min: { x: -500, y: -500, z: -500 },
            max: { x: 500, y: 500, z: 500 },
          },
        },
      });

      const finalState = runSimulationTicks(simulateTick, lowAlignState, 120);
      const finalVariance = velocityDirectionVariance(finalState.birds);

      const highAlignState = createSimulationState({
        birds: variedBirds,
        parameters: {
          ...lowAlignState.parameters,
          flocking: {
            separationWeight: 0.0,
            alignmentWeight: 0.95,
            cohesionWeight: 0.0,
          },
        },
      });
      const highAlignFinal = runSimulationTicks(simulateTick, highAlignState, 120);
      const highAlignVariance = velocityDirectionVariance(highAlignFinal.birds);

      expect(finalVariance).toBeGreaterThan(highAlignVariance);
    });
  });

  describe("Cohesion slider affects flock density", () => {
    it("Given spread-out birds, when cohesion is set to 1.0, then birds cluster more tightly", () => {
      const spreadBirds = createBirds(20, (i) => ({
        position: { x: i * 50, y: i * 30, z: 0 },
        velocity: { x: 0, y: 0, z: 0 },
      }));
      const highCohesionState = createSimulationState({
        birds: spreadBirds,
        parameters: {
          flocking: {
            separationWeight: 0.0,
            alignmentWeight: 0.0,
            cohesionWeight: 1.0,
          },
          neighborRadius: 500,
          separationRadius: 25,
          maxSpeed: 4,
          maxForce: 0.1,
          obstacleAvoidanceRadius: 30,
          obstacleAvoidanceWeight: 1.5,
          predatorFleeRadius: 80,
          predatorFleeWeight: 3.0,
          worldBounds: {
            min: { x: -1000, y: -1000, z: -1000 },
            max: { x: 1000, y: 1000, z: 1000 },
          },
        },
      });
      const initialDistance = averagePairwiseDistance(highCohesionState.birds);

      const finalState = runSimulationTicks(simulateTick, highCohesionState, 300);
      const finalDistance = averagePairwiseDistance(finalState.birds);

      expect(finalDistance).toBeLessThan(initialDistance);
    });

    it("Given clustered birds, when cohesion is 0.0 and separation is 1.0, then birds scatter", () => {
      const clusteredBirds = createBirds(20, (i) => ({
        position: { x: i * 2, y: i * 2, z: 0 },
        velocity: { x: 1, y: 0, z: 0 },
      }));
      const scatterState = createSimulationState({
        birds: clusteredBirds,
        parameters: {
          flocking: {
            separationWeight: 1.0,
            alignmentWeight: 0.0,
            cohesionWeight: 0.0,
          },
          neighborRadius: 100,
          separationRadius: 50,
          maxSpeed: 4,
          maxForce: 0.1,
          obstacleAvoidanceRadius: 30,
          obstacleAvoidanceWeight: 1.5,
          predatorFleeRadius: 80,
          predatorFleeWeight: 3.0,
          worldBounds: {
            min: { x: -500, y: -500, z: -500 },
            max: { x: 500, y: 500, z: 500 },
          },
        },
      });
      const initialDistance = averagePairwiseDistance(scatterState.birds);

      const finalState = runSimulationTicks(simulateTick, scatterState, 120);
      const finalDistance = averagePairwiseDistance(finalState.birds);

      expect(finalDistance).toBeGreaterThan(initialDistance);
    });
  });

  describe("Combined extreme settings produce expected behavior", () => {
    it("Given all parameters at extreme values, when separation=1.0, alignment=0.0, cohesion=0.0, then birds scatter with no coordination", () => {
      const clusteredBirds = createBirds(15, (i) => ({
        position: { x: i * 3, y: i * 3, z: 0 },
        velocity: { x: 1, y: 0.5, z: 0 },
      }));

      const extremeState = createSimulationState({
        birds: clusteredBirds,
        parameters: {
          flocking: {
            separationWeight: 1.0,
            alignmentWeight: 0.0,
            cohesionWeight: 0.0,
          },
          neighborRadius: 100,
          separationRadius: 50,
          maxSpeed: 4,
          maxForce: 0.1,
          obstacleAvoidanceRadius: 30,
          obstacleAvoidanceWeight: 1.5,
          predatorFleeRadius: 80,
          predatorFleeWeight: 3.0,
          worldBounds: {
            min: { x: -500, y: -500, z: -500 },
            max: { x: 500, y: 500, z: 500 },
          },
        },
      });
      const initialDistance = averagePairwiseDistance(extremeState.birds);
      const initialVariance = velocityDirectionVariance(extremeState.birds);

      const finalState = runSimulationTicks(simulateTick, extremeState, 120);
      const finalDistance = averagePairwiseDistance(finalState.birds);
      const finalVariance = velocityDirectionVariance(finalState.birds);

      expect(finalDistance).toBeGreaterThan(initialDistance);

      expect(finalVariance).toBeGreaterThanOrEqual(initialVariance * 0.5);
    });

    it("Given birds, when separation=0.0, alignment=0.5, cohesion=1.0, then birds converge into tight cluster", () => {
      const spreadBirds = createBirds(15, (i) => ({
        position: { x: i * 40, y: i * 20, z: 0 },
        velocity: { x: 0, y: 0, z: 0 },
      }));

      const tightState = createSimulationState({
        birds: spreadBirds,
        parameters: {
          flocking: {
            separationWeight: 0.0,
            alignmentWeight: 0.5,
            cohesionWeight: 1.0,
          },
          neighborRadius: 500,
          separationRadius: 25,
          maxSpeed: 4,
          maxForce: 0.1,
          obstacleAvoidanceRadius: 30,
          obstacleAvoidanceWeight: 1.5,
          predatorFleeRadius: 80,
          predatorFleeWeight: 3.0,
          worldBounds: {
            min: { x: -1000, y: -1000, z: -1000 },
            max: { x: 1000, y: 1000, z: 1000 },
          },
        },
      });
      const initialDistance = averagePairwiseDistance(tightState.birds);

      const finalState = runSimulationTicks(simulateTick, tightState, 300);
      const finalDistance = averagePairwiseDistance(finalState.birds);

      expect(finalDistance).toBeLessThan(initialDistance * 0.5);
    });
  });

  describe("Parameter state management", () => {
    it("Given default parameters, when alignment is updated, then only alignment changes", () => {
      const state = createSimulationState();

      const updatedState = updateFlockingParam(state, "alignmentWeight", 0.95);

      expect(updatedState.parameters.flocking.alignmentWeight).toBe(0.95);

      expect(updatedState.parameters.flocking.separationWeight).toBe(0.5);
      expect(updatedState.parameters.flocking.cohesionWeight).toBe(0.6);

      expect(state.parameters.flocking.alignmentWeight).toBe(0.7);
    });

    it("Given default parameters, when cohesion is updated, then only cohesion changes", () => {
      const state = createSimulationState();

      const updatedState = updateFlockingParam(state, "cohesionWeight", 1.0);

      expect(updatedState.parameters.flocking.cohesionWeight).toBe(1.0);

      expect(updatedState.parameters.flocking.separationWeight).toBe(0.5);
      expect(updatedState.parameters.flocking.alignmentWeight).toBe(0.7);
    });
  });
});
