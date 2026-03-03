import { describe, it, expect } from "vitest";
import { formatStatusText } from "./status-bar";

describe("Status bar", () => {
  it("should display all four metrics as formatted text", () => {
    const result = formatStatusText({
      birdCount: 10,
      predatorCount: 2,
      obstacleCount: 3,
      fps: 60,
    });

    expect(result).toBe("Birds: 10 | Predators: 2 | Obstacles: 3 | FPS: 60");
  });

  it("should round FPS to nearest integer", () => {
    const result = formatStatusText({
      birdCount: 25,
      predatorCount: 1,
      obstacleCount: 0,
      fps: 59.7,
    });

    expect(result).toBe("Birds: 25 | Predators: 1 | Obstacles: 0 | FPS: 60");
  });

  it("should display zero counts correctly", () => {
    const result = formatStatusText({
      birdCount: 0,
      predatorCount: 0,
      obstacleCount: 0,
      fps: 0,
    });

    expect(result).toBe("Birds: 0 | Predators: 0 | Obstacles: 0 | FPS: 0");
  });
});
