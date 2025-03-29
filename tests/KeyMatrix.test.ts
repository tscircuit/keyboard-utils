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
});