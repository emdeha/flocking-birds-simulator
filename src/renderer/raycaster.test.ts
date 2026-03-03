import { describe, it, expect } from "vitest";
import { screenToWorldPosition } from "./raycaster";

describe("screenToWorldPosition", () => {
  it("converts center screen coordinates to a world position on the ground plane", () => {
    const cameraPosition = { x: 0, y: 100, z: 300 };
    const cameraTarget = { x: 0, y: 0, z: 0 };
    const fov = 60;
    const aspect = 800 / 600;

    const worldPos = screenToWorldPosition(0, 0, cameraPosition, cameraTarget, fov, aspect);

    expect(worldPos.y).toBeCloseTo(0, 0);
    expect(typeof worldPos.x).toBe("number");
    expect(typeof worldPos.z).toBe("number");
  });

  it("returns different world positions for different screen coordinates", () => {
    const cameraPosition = { x: 0, y: 100, z: 300 };
    const cameraTarget = { x: 0, y: 0, z: 0 };
    const fov = 60;
    const aspect = 800 / 600;

    const left = screenToWorldPosition(-0.5, 0, cameraPosition, cameraTarget, fov, aspect);
    const right = screenToWorldPosition(0.5, 0, cameraPosition, cameraTarget, fov, aspect);

    expect(left.x).toBeLessThan(right.x);
  });
});
