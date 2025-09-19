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
    expect(parsed[0].rotationY).toBe(-1 * 19.05);
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

  test("should handle rotation center positioning correctly", () => {
    // Simplified thumb cluster layout similar to ergodox
    const layout: KLELayout = [
      [
        { r: 30, rx: 2, ry: 2, x: 1, y: -1 },
        "Space"
      ]
    ];

    const parsed = parseKLELayout(layout);

    expect(parsed.length).toBe(1);
    expect(parsed[0].name).toBe("K_SPACE");
    expect(parsed[0].rotation).toBe(30);

    // With proper KLE behavior, position starts from rotation center (rx: 2, ry: 2)
    // then applies offsets (x: 1, y: -1) and centers the key (+ 0.5, + 0.5)
    const KEY_SIZE = 19.05;
    const expectedX = (2 + 1 + 0.5) * KEY_SIZE; // rx + x + width/2
    const expectedY = -(2 + (-1) + 0.5) * KEY_SIZE; // -(ry + y + height/2)

    // Position should match KLE positioning logic
    expect(parsed[0].x).toBeCloseTo(expectedX);
    expect(parsed[0].y).toBeCloseTo(expectedY);

    // Verify the rotation center is stored correctly
    expect(parsed[0].rotationX).toBe(2 * KEY_SIZE);
    expect(parsed[0].rotationY).toBe(-2 * KEY_SIZE);
  });

  test("should handle full ergodox-style layout with thumb clusters", () => {
    // Simplified version of the ergodox layout from your reference
    const layout: KLELayout = [
      // Main keyboard area (simplified)
      ["Q", "W", "E"],
      ["A", "S", "D"],
      ["Z", "X", "C"],

      // Left thumb cluster
      [
        { r: -45, rx: 6.5, ry: 4.25, y: -1, x: 1 },
        "Alt",
        "Ctrl"
      ],
      [
        { h: 2 },
        "Space",
        { h: 2 },
        "Enter",
        "Shift"
      ],
      [
        { x: 2 },
        "Fn"
      ],

      // Right thumb cluster
      [
        { r: 45, rx: 13, y: -1, x: -3 },
        "Left",
        "Right"
      ],
      [
        { x: -3 },
        "Up",
        { h: 2 },
        "Down",
        { h: 2 },
        "PgUp"
      ],
      [
        { x: -3 },
        "PgDn"
      ]
    ];

    const parsed = parseKLELayout(layout);

    // Should have all keys
    expect(parsed.length).toBe(21);

    // Check main keyboard keys are positioned normally
    const qKey = parsed.find(k => k.name === "K_Q");
    const aKey = parsed.find(k => k.name === "K_A");
    const zKey = parsed.find(k => k.name === "K_Z");

    expect(qKey?.rotation).toBe(0);
    expect(aKey?.rotation).toBe(0);
    expect(zKey?.rotation).toBe(0);

    // Check left thumb cluster keys have correct rotation and are positioned relative to rx/ry
    const altKey = parsed.find(k => k.name === "K_ALT");
    const spaceKey = parsed.find(k => k.name === "K_SPACE");

    expect(altKey?.rotation).toBe(-45);
    expect(altKey?.rotationX).toBe(6.5 * 19.05);
    expect(altKey?.rotationY).toBe(-4.25 * 19.05);

    expect(spaceKey?.rotation).toBe(-45); // Should inherit rotation from previous row
    expect(spaceKey?.height).toBe(2 * 19.05); // Should be double height

    // Check right thumb cluster keys have correct negative rotation
    const leftKey = parsed.find(k => k.name === "K_LEFT");
    const upKey = parsed.find(k => k.name === "K_UP");

    expect(leftKey?.rotation).toBe(45);
    expect(leftKey?.rotationX).toBe(13 * 19.05);

    expect(upKey?.rotation).toBe(45); // Should inherit rotation
  });
});