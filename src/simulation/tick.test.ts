import { describe, it, expect } from "vitest";
import { simulateTick } from "./tick";
import type { SimulationState, Bird } from "../types/simulation-types";
import type { Vector3 } from "../types/vector";

const createBird = (
  position: Vector3,
  velocity: Vector3 = { x: 1, y: 0, z: 0 }
): Bird => ({
  position,
  velocity,
});

const createState = (birds: ReadonlyArray<Bird>): SimulationState => ({
  birds,
  obstacles: [],
  predators: [],
  parameters: {
    flocking: {
      separationWeight: 0.5,
      alignmentWeight: 0.7,
      cohesionWeight: 0.6,
    },
    neighborRadius: 50,
    separationRadius: 25,
    maxSpeed: 4,
    maxForce: 0.1,
    obstacleAvoidanceRadius: 30,
    obstacleAvoidanceWeight: 1.5,
    predatorFleeRadius: 80,
    predatorFleeWeight: 3.0,
    worldBounds: {
      min: { x: -200, y: -200, z: -200 },
      max: { x: 200, y: 200, z: 200 },
    },
  },
  playbackState: "running",
  simulationSpeed: 1.0,
});

describe("simulateTick", () => {
  it("returns a new state with updated bird positions and does not mutate the original", () => {
    const birds = [
      createBird({ x: 0, y: 0, z: 0 }, { x: 2, y: 1, z: 0 }),
      createBird({ x: 10, y: 10, z: 0 }, { x: -1, y: 0, z: 0 }),
    ];
    const state = createState(birds);
    const originalBirds = state.birds.map((b) => ({
      position: { ...b.position },
      velocity: { ...b.velocity },
    }));

    const nextState = simulateTick(state, 1 / 60);

    const hasMoved = nextState.birds.some(
      (bird, i) =>
        bird.position.x !== originalBirds[i].position.x ||
        bird.position.y !== originalBirds[i].position.y ||
        bird.position.z !== originalBirds[i].position.z
    );
    expect(hasMoved).toBe(true);

    expect(state.birds).toEqual(
      originalBirds.map((b) => ({
        position: b.position,
        velocity: b.velocity,
      }))
    );
    expect(nextState).not.toBe(state);
  });

  it("applies forces across all three axes when birds are separated in 3D", () => {
    const birds = [
      createBird({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 2 }),
      createBird({ x: 0, y: 0, z: 5 }, { x: 0, y: 0, z: -2 }),
    ];
    const state = createState(birds);

    const nextState = simulateTick(state, 1 / 60);

    const bird0 = nextState.birds[0];
    const bird1 = nextState.birds[1];
    expect(bird0.position.z).not.toBe(0);
    expect(bird1.position.z).not.toBe(5);
  });
});
