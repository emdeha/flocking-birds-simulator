import { describe, it, expect } from "vitest";
import { formatStatusText } from "./status-bar";

describe("Status bar", () => {
  it("should display bird count and FPS as formatted text", () => {
    const result = formatStatusText({ birdCount: 10, fps: 60 });

    expect(result).toBe("Birds: 10 | FPS: 60");
  });

  it("should round FPS to nearest integer", () => {
    const result = formatStatusText({ birdCount: 25, fps: 59.7 });

    expect(result).toBe("Birds: 25 | FPS: 60");
  });
});
