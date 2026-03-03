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

  it("maps vertical screen offset to world z displacement", () => {
    const cameraPosition = { x: 0, y: 100, z: 300 };
    const cameraTarget = { x: 0, y: 0, z: 0 };
    const fov = 60;
    const aspect = 800 / 600;

    const top = screenToWorldPosition(0, 0.5, cameraPosition, cameraTarget, fov, aspect);
    const bottom = screenToWorldPosition(0, -0.5, cameraPosition, cameraTarget, fov, aspect);

    expect(top.z).not.toBeCloseTo(bottom.z, 0);
  });

  it("produces wider spread with larger FOV", () => {
    const cameraPosition = { x: 0, y: 100, z: 300 };
    const cameraTarget = { x: 0, y: 0, z: 0 };
    const aspect = 800 / 600;

    const narrowLeft = screenToWorldPosition(-0.5, 0, cameraPosition, cameraTarget, 30, aspect);
    const wideLeft = screenToWorldPosition(-0.5, 0, cameraPosition, cameraTarget, 90, aspect);

    expect(Math.abs(wideLeft.x)).toBeGreaterThan(Math.abs(narrowLeft.x));
  });

  it("produces wider spread with larger aspect ratio", () => {
    const cameraPosition = { x: 0, y: 100, z: 300 };
    const cameraTarget = { x: 0, y: 0, z: 0 };
    const fov = 60;

    const narrow = screenToWorldPosition(-0.5, 0, cameraPosition, cameraTarget, fov, 1.0);
    const wide = screenToWorldPosition(-0.5, 0, cameraPosition, cameraTarget, fov, 2.0);

    expect(Math.abs(wide.x)).toBeGreaterThan(Math.abs(narrow.x));
  });
});
