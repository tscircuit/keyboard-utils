import { describe, expect, test } from "bun:test";
import * as KeyboardUtils from "../lib/index";

describe("Exports", () => {
  test("should export all expected modules", () => {
    // Check for KLELayout exports
    expect(KeyboardUtils.parseKLELayout).toBeDefined();
    expect(typeof KeyboardUtils.parseKLELayout).toBe("function");
    
    // Check for KeyMatrix exports
    expect(KeyboardUtils.KeyMatrix).toBeDefined();
    expect(typeof KeyboardUtils.KeyMatrix).toBe("function");
    
    // Check for getRefDesForKey exports
    expect(KeyboardUtils.getRefDesForKey).toBeDefined();
    expect(typeof KeyboardUtils.getRefDesForKey).toBe("function");
  });
});