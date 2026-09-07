/// <reference types="bun" />
import { expect, test } from "bun:test"
import { assignRowColByPosition } from "../lib/assignRowColByPosition"
import { parseKLELayout } from "../lib/KLELayout"

const key = (name: string, x: number, y = 0, rotation = 0) => ({
  name,
  x,
  y,
  rotation,
  width: 19.05,
  height: 19.05,
  rotationX: 0,
  rotationY: 0,
  row: 99,
  col: 99,
})

test("right-only keys receive finite zero-based columns", () => {
  const result = assignRowColByPosition([key("A", 170), key("B", 190)])
  expect(result.map(({ row, col }) => [row, col])).toEqual([
    [0, 0],
    [0, 1],
  ])
})

for (const rotation of [-30, 30]) {
  test(`thumb-only keys start at row zero (${rotation} degrees)`, () => {
    const result = assignRowColByPosition([
      key("A", 0, 0, rotation),
      key("B", 20, 0, rotation),
    ])
    expect(result.map(({ row, col }) => [row, col])).toEqual([
      [0, 0],
      [0, 1],
    ])
  })
}

test("two thumb-only clusters receive non-overlapping column indices", () => {
  const result = assignRowColByPosition([
    key("L1", 0, 0, -30),
    key("L2", 20, 0, -30),
    key("R1", 170, 0, 30),
    key("R2", 190, 0, 30),
  ])
  expect(result.map(({ row, col }) => [row, col])).toEqual([
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
  ])
})

test("a key exactly on the section boundary is assigned once", () => {
  const result = assignRowColByPosition([key("A", 150)])
  expect(result[0]?.row).toBe(0)
  expect(result[0]?.col).toBe(0)
})

test("existing main sections stay contiguous and input keys stay unchanged", () => {
  const input = [key("L1", 0), key("L2", 19.05), key("R1", 170)]
  const result = assignRowColByPosition(input)
  expect(result.map(({ row, col }) => [row, col])).toEqual([
    [0, 0],
    [0, 1],
    [0, 2],
  ])
  expect(input.map(({ row, col }) => [row, col])).toEqual([
    [99, 99],
    [99, 99],
    [99, 99],
  ])
  expect(assignRowColByPosition([])).toEqual([])
})

test("public KLE parsing supports right-only and rotated-only layouts", () => {
  const right = parseKLELayout([[{ x: 10 }, "A", "B"]])
  expect(right.map(({ row, col }) => [row, col])).toEqual([
    [0, 0],
    [0, 1],
  ])
  const thumb = parseKLELayout([[{ r: 30 }, "A", "B"]])
  expect(thumb.map(({ row, col }) => [row, col])).toEqual([
    [0, 0],
    [0, 1],
  ])
})
