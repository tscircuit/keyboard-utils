import { describe, expect, test } from "bun:test"
import { parseKLELayout } from "../lib/KLELayout"
import { getRefDesForKey } from "../lib/getRefDesForKey"
import { layouts } from "../lib/layouts"

describe("bundled KLE layouts", () => {
  // Physical keys counted from the bundled string legends, not property objects.
  const keyCounts = {
    default60: 61,
    ansi104: 104,
    iso105: 105,
    iso60: 62,
    jd40: 40,
    ergodox: 76,
    atreus: 42,
    planck: 47,
    keycool84: 84,
    leopold_fc660m: 66,
    apple_wireless: 78,
  } as const

  for (const name of Object.keys(keyCounts) as Array<keyof typeof keyCounts>) {
    test(`${name} produces every physical key`, () => {
      const keys = parseKLELayout(layouts[name])
      expect(keys).toHaveLength(keyCounts[name])
      for (const key of keys) {
        expect(key.name).toMatch(/^K_[A-Z0-9_]+$/)
        expect(Number.isFinite(key.x) && Number.isFinite(key.y)).toBe(true)
      }
    })
  }
})

describe("bundled KLE legends", () => {
  test.each([
    ["Scroll Lock", "K_SCROLL_LOCK"],
    ["Num Lock", "K_NUM_LOCK"],
    ["Back Space", "K_BACKSPACE"],
    ["Back<br>Space", "K_BACKSPACE"],
    ["Page Up", "K_PGUP"],
    ["Page Down", "K_PGDN"],
    ["¬\n`", "K_BACKQUOTE"],
    [",", "K_COMMA"],
    [".\nDel", "K_PERIOD"],
    ["↑", "K_ARROW_UP"],
    ["↓", "K_ARROW_DOWN"],
    ["←", "K_ARROW_LEFT"],
    ["→", "K_ARROW_RIGHT"],
    ["&uarr;", "K_ARROW_UP"],
    ["&darr;", "K_ARROW_DOWN"],
    ["&larr;", "K_ARROW_LEFT"],
    ["&rarr;", "K_ARROW_RIGHT"],
    ["&uArr;", "K_DOUBLE_ARROW_UP"],
    ["&dArr;", "K_DOUBLE_ARROW_DOWN"],
    ["<i class='fa fa-eject'></i>", "K_EJECT"],
  ])("recognizes %p as %p", (legend, expected) => {
    expect(getRefDesForKey(legend)).toBe(expected)
  })

  test.each([
    ["Pause\nBreak", "K_PAUSE"],
    ["PrtSc\nNmLk", "K_PRTSC"],
    ["Pause\nScrLk", "K_PAUSE"],
    ["Delete\nInsert", "K_DELETE"],
    ["\n\n\nF1", "K_F1"],
    ["\n\n\nF8\n\n\n\n\n\n<i class='fa fa-play'></i><i class='fa fa-pause'></i>", "K_F8"],
    ["\n\n\ndelete", "K_DELETE"],
    ["\nfn", "K_FN"],
    ["\ncontrol", "K_CONTROL"],
    ["⌘\ncommand", "K_COMMAND"],
  ])("uses a nonempty alphanumeric legend in %p", (legend, expected) => {
    expect(getRefDesForKey(legend)).toBe(expected)
  })

  test("keeps established legend priority and ordinary names", () => {
    expect(getRefDesForKey("F1\n!")).toBe("K_EXCLAMATION")
    expect(getRefDesForKey("<\n,")).toBe("K_LT")
    expect(getRefDesForKey(">\n.")).toBe("K_GT")
    expect(getRefDesForKey("!\n1")).toBe("K_EXCLAMATION")
    expect(getRefDesForKey("\n\nenter\nreturn")).toBe("K_ENTER")
    expect(getRefDesForKey("SHIFT")).toBe("K_SHIFT")
    expect(getRefDesForKey("ABC123")).toBe("K_ABC123")
    expect(getRefDesForKey("")).toBe("K_SPACE")
  })

  test.each([
    ["SCROLL LOCK", "K_SCROLL_LOCK"],
    ["NUM LOCK", "K_NUM_LOCK"],
    ["BaCk SpAcE", "K_BACKSPACE"],
    ["PAGE UP", "K_PGUP"],
    ["PAGE DOWN", "K_PGDN"],
  ])("keeps text alias %p case-insensitive", (legend, expected) => {
    expect(getRefDesForKey(legend)).toBe(expected)
  })

  test.each([
    "&lArr;",
    "&rArr;",
    "&UARR;",
    "&DARR;",
    "Back<BR>Space",
    "<i class='fa fa-EJECT'></i>",
  ])("rejects unlisted case-sensitive entity or HTML legend %p", (legend) => {
    expect(() => getRefDesForKey(legend)).toThrow()
  })

  test.each(["nonexistent_key", "€", "\n\n", "<b>unrecognized</b>", "&unknown;"])(
    "continues to reject unsupported legend %p",
    (legend) => expect(() => getRefDesForKey(legend)).toThrow(),
  )
})
