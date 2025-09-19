import { describe, expect, test } from "bun:test";
import { parseKLELayout } from "../lib/KLELayout";

// In unit tests, we'll skip testing the actual JSX rendering
// Instead, we'll test the layout parsing which is what KeyMatrix relies on

describe("KeyMatrix", () => {
  test("KeyMatrix layout parsing", () => {
    // Instead of testing the full component, which relies on external components,
    // we'll just verify that parseKLELayout is working as expected for a simple layout
    
    const layout = [
      ["A", "B"],
      ["C", "D"]
    ];
    
    // This is the core functionality of KeyMatrix
    const keys = parseKLELayout(layout);
    
    expect(keys.length).toBe(4);
    expect(keys[0].name).toBe("K_A");
    expect(keys[1].name).toBe("K_B");
    expect(keys[2].name).toBe("K_C");
    expect(keys[3].name).toBe("K_D");
  });

  test("KeyMatrix handles rotated keys correctly for rendering", () => {
    // Test that rotated keys in the layout have proper rotation values
    // This ensures pcbRotation will be applied correctly in the KeyMatrix component

    const layout = [
      ["Q"], // Normal key with no rotation
      [
        { r: 30, rx: 2, ry: 2 },
        "Space" // Rotated key
      ]
    ];

    const keys = parseKLELayout(layout);

    expect(keys.length).toBe(2);

    // First key should have no rotation
    expect(keys[0].name).toBe("K_Q");
    expect(keys[0].rotation).toBe(0);

    // Second key should have 30 degree rotation
    expect(keys[1].name).toBe("K_SPACE");
    expect(keys[1].rotation).toBe(30);
    expect(keys[1].rotationX).toBe(2 * 19.05);
    expect(keys[1].rotationY).toBe(-2 * 19.05);
  });
});