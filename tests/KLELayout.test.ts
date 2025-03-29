import { describe, expect, test } from "bun:test";
import { KLELayout, parseKLELayout } from "../lib/KLELayout";

describe("KLELayout Parser", () => {
  test("should parse simple 2x2 grid", () => {
    const layout: KLELayout = [
      ["A", "B"],
      ["C", "D"]
    ];
    
    const parsed = parseKLELayout(layout);
    
    expect(parsed.length).toBe(4);
    
    // Check key names
    expect(parsed[0].name).toBe("K_A");
    expect(parsed[1].name).toBe("K_B");
    expect(parsed[2].name).toBe("K_C");
    expect(parsed[3].name).toBe("K_D");
    
    // Check positions - first row
    expect(parsed[0].row).toBe(0);
    expect(parsed[0].col).toBe(0);
    expect(parsed[1].row).toBe(0);
    expect(parsed[1].col).toBe(1);
    
    // Check positions - second row
    expect(parsed[2].row).toBe(1);
    expect(parsed[2].col).toBe(0);
    expect(parsed[3].row).toBe(1);
    expect(parsed[3].col).toBe(1);
    
    // Standard key size should be 19.05mm
    const KEY_SIZE = 19.05;
    expect(parsed[0].width).toBe(KEY_SIZE);
    expect(parsed[0].height).toBe(KEY_SIZE);
  });
  
  test("should handle special key properties", () => {
    const layout: KLELayout = [
      [
        { w: 1.5 },
        "Tab",
        "Q"
      ]
    ];
    
    const parsed = parseKLELayout(layout);
    
    expect(parsed.length).toBe(2);
    expect(parsed[0].name).toBe("K_TAB");
    expect(parsed[1].name).toBe("K_Q");
    
    // Tab should be 1.5u wide
    const KEY_SIZE = 19.05;
    expect(parsed[0].width).toBe(1.5 * KEY_SIZE);
    expect(parsed[1].width).toBe(KEY_SIZE);
  });
  
  test("should handle rotations", () => {
    const layout: KLELayout = [
      [
        { r: 15, rx: 1, ry: 1 },
        "R"
      ]
    ];
    
    const parsed = parseKLELayout(layout);
    
    expect(parsed.length).toBe(1);
    expect(parsed[0].name).toBe("K_R");
    expect(parsed[0].rotation).toBe(15);
    expect(parsed[0].rotationX).toBe(1 * 19.05);
    expect(parsed[0].rotationY).toBe(1 * 19.05);
  });
  
  test("should handle duplicate key labels with counters", () => {
    const layout: KLELayout = [
      ["A", "A"]
    ];
    
    const parsed = parseKLELayout(layout);
    
    expect(parsed.length).toBe(2);
    expect(parsed[0].name).toBe("K_A1");
    expect(parsed[1].name).toBe("K_A2");
  });
  
  test("should handle special characters", () => {
    const layout: KLELayout = [
      ["!", "@", "#", "$"]
    ];
    
    const parsed = parseKLELayout(layout);
    
    expect(parsed.length).toBe(4);
    expect(parsed[0].name).toBe("K_EXCLAMATION");
    expect(parsed[1].name).toBe("K_AT");
    expect(parsed[2].name).toBe("K_HASH");
    expect(parsed[3].name).toBe("K_DOLLAR");
  });
  
  test("should handle x/y offsets", () => {
    const layout: KLELayout = [
      [
        { x: 0.5 },
        "A",
        { x: 0.25 },
        "B"
      ]
    ];
    
    const parsed = parseKLELayout(layout);
    
    expect(parsed.length).toBe(2);
    
    // First key should be offset by 0.5u
    const KEY_SIZE = 19.05;
    expect(parsed[0].x).toBeCloseTo((0.5 + 0.5) * KEY_SIZE);
    // Second key should be 1.25u to the right of first key
    expect(parsed[1].x).toBeCloseTo((0.5 + 1 + 0.25 + 0.5) * KEY_SIZE);
  });
});