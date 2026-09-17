/// <reference types="bun" />

import { expect, test } from "bun:test"
import { Circuit } from "tscircuit"
import { parseKLELayout } from "../lib/KLELayout"
import { KeyMatrix } from "../lib/KeyMatrix"

const KEY_SIZE = 19.05

test("decorative labels do not become keys or consume reference names", () => {
  const keys = parseKLELayout([["A", { d: true }, "A", "B"]])

  expect(keys.map((key) => key.name)).toEqual(["K_A", "K_B"])
  expect(keys[1]!.x).toBeCloseTo(2.5 * KEY_SIZE)
  expect(keys.map((key) => key.col)).toEqual([0, 1])
})

test("decals still advance the cursor and reset one-key properties", () => {
  const keys = parseKLELayout([
    [{ d: true, x: 0.25, y: 0.5, w: 2, h: 2 }, "Logo", "A"],
    ["B"],
  ])

  expect(keys.map((key) => key.name)).toEqual(["K_A", "K_B"])
  expect(keys[0]!.x).toBeCloseTo(2.75 * KEY_SIZE)
  expect(keys[0]!.y).toBeCloseTo(-KEY_SIZE)
  expect(keys[0]!.width).toBe(KEY_SIZE)
  expect(keys[0]!.height).toBe(KEY_SIZE)
  expect(keys[1]!.x).toBeCloseTo(0.5 * KEY_SIZE)
  expect(keys[1]!.y).toBeCloseTo(-2 * KEY_SIZE)
})

test("consecutive decals and decal-only rows preserve following key positions", () => {
  const keys = parseKLELayout([
    [{ d: true }, "Logo", { d: true }, "Label"],
    ["A"],
  ])

  expect(keys).toHaveLength(1)
  expect(keys[0]!.name).toBe("K_A")
  expect(keys[0]!.x).toBeCloseTo(0.5 * KEY_SIZE)
  expect(keys[0]!.y).toBeCloseTo(-1.5 * KEY_SIZE)
  expect(keys[0]!.row).toBe(0)
  expect(keys[0]!.col).toBe(0)
})

test("a layout containing only decals has no physical keys", () => {
  expect(parseKLELayout([[{ d: true }, "Logo"]])).toEqual([])
})

test("explicitly disabling decals and ghost styling retain physical keys", () => {
  const keys = parseKLELayout([[{ d: false, g: true }, "A", "B"]])

  expect(keys.map((key) => key.name)).toEqual(["K_A", "K_B"])
})

test("KeyMatrix emits no circuit components for decorative labels", () => {
  const circuit = new Circuit()
  circuit.add(
    <board routingDisabled>
      <KeyMatrix layout={[[{ d: true }, "Logo", "A"]]} />
    </board>,
  )
  circuit.render()

  const componentNames = circuit.getCircuitJson()
    .filter((element) => element.type === "source_component")
    .map((component) => component.name)
  expect(componentNames.sort()).toEqual(["K_A", "K_A_shaft"])
})

test.each([
  ["a right-side key", [[{ d: true }, "Logo", { x: 8 }, "A"]]],
  ["a left thumb key", [[{ d: true }, "Logo"], [{ r: -30 }, "A"]]],
  ["a right thumb key", [[{ d: true }, "Logo"], [{ r: 30 }, "A"]]],
] as const)("removing a decal leaves valid matrix indices for %s", (_, layout) => {
  const keys = parseKLELayout(layout.map((row) => [...row]))

  expect(keys).toHaveLength(1)
  expect(keys[0]!.name).toBe("K_A")
  expect(keys[0]!.row).toBe(0)
  expect(keys[0]!.col).toBe(0)
})

test("removing the only main-section decal leaves distinct thumb columns", () => {
  const keys = parseKLELayout([
    [{ d: true }, "Logo"],
    [{ r: -30 }, "A", "B"],
    [{ r: 30, rx: 8 }, "C"],
  ])

  expect(keys.map(({ name, row, col }) => ({ name, row, col }))).toEqual([
    { name: "K_A", row: 0, col: 0 },
    { name: "K_B", row: 0, col: 1 },
    { name: "K_C", row: 0, col: 2 },
  ])
})
