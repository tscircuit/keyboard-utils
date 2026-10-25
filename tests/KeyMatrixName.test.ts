import { describe, expect, test } from "bun:test"
import { KeyMatrix } from "../lib/KeyMatrix"
import type { KLELayout } from "../lib/KLELayout"

// Inspect the component's returned React element, not Circuit rendering.
describe("KeyMatrix root group", () => {
  test.each([
    [undefined, "KB"],
    ["LEFT", "LEFT"],
    ["", ""],
  ])("forwards name %p as %p", (name, expectedName) => {
    const group = KeyMatrix({ layout: [["A"]], name })

    expect(group.type).toBe("group")
    expect(group.props.name).toBe(expectedName)
  })

  test("keeps the default name and placement when props are omitted", () => {
    const group = KeyMatrix({ layout: [["A"]] })

    expect(group.props).toMatchObject({
      name: "KB",
      pcbX: 0,
      pcbY: 0,
      schX: 0,
      schY: 0,
    })
  })

  test("preserves placement and children when naming rotated and ordinary keys", () => {
    const layout: KLELayout = [["A"], [{ r: 30, rx: 2, ry: 2 }, "Space"]]
    const props = {
      layout,
      pcbX: 12.5,
      pcbY: -8,
      schX: -3,
      schY: 4.5,
      rowToMicroPin: ["net.ROW0", "net.ROW1"],
      colToMicroPin: ["net.COL0", "net.COL1"],
    }
    const unnamed = KeyMatrix(props)
    const named = KeyMatrix({ ...props, name: "LEFT" })

    expect(named.props).toMatchObject({
      name: "LEFT",
      pcbX: 12.5,
      pcbY: -8,
      schX: -3,
      schY: 4.5,
    })
    expect(named.props.children).toEqual(unnamed.props.children)
  })
})
