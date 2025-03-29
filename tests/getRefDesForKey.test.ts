import { describe, expect, test } from "bun:test";
import { getRefDesForKey } from "../lib/getRefDesForKey";

describe("getRefDesForKey", () => {
  test("should handle basic letters", () => {
    expect(getRefDesForKey("a")).toBe("K_A");
    expect(getRefDesForKey("Z")).toBe("K_Z");
  });
  
  test("should handle numbers", () => {
    expect(getRefDesForKey("1")).toBe("K_N1");
    expect(getRefDesForKey("0")).toBe("K_N0");
  });
  
  test("should handle special characters", () => {
    expect(getRefDesForKey("~")).toBe("K_TILDE");
    expect(getRefDesForKey("!")).toBe("K_EXCLAMATION");
    expect(getRefDesForKey("@")).toBe("K_AT");
  });
  
  test("should handle special keys", () => {
    expect(getRefDesForKey("backspace")).toBe("K_BACKSPACE");
    expect(getRefDesForKey("enter")).toBe("K_ENTER");
    expect(getRefDesForKey("shift")).toBe("K_SHIFT");
  });
  
  test("should handle empty string", () => {
    expect(getRefDesForKey("")).toBe("K_SPACE");
  });
  
  test("should handle multiple labels", () => {
    expect(getRefDesForKey("a\nb")).toBe("K_A");
    expect(getRefDesForKey("!\n1")).toBe("K_EXCLAMATION");
  });
  
  test("should be case-insensitive", () => {
    expect(getRefDesForKey("SHIFT")).toBe("K_SHIFT");
    expect(getRefDesForKey("Backspace")).toBe("K_BACKSPACE");
  });
  
  test("should throw error for undefined keys", () => {
    expect(() => getRefDesForKey("nonexistent_key")).toThrow();
    expect(() => getRefDesForKey("€")).toThrow();
  });
  
  test("should handle alphanumeric combinations", () => {
    expect(getRefDesForKey("F1")).toBe("K_F1");
    expect(getRefDesForKey("ABC123")).toBe("K_ABC123");
  });
});