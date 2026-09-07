import { expect, test } from "bun:test"
import { parseKLELayout } from "../lib/KLELayout"
import { getRefDesForKey } from "../lib/getRefDesForKey"

for (const labels of [
  ["A", "A1", "A"],
  ["A1", "A", "A"],
  ["A", "A", "A1"],
]) {
  test(`numbered duplicate names avoid explicit labels: ${labels.join(",")}`, () => {
    const keys = parseKLELayout([labels])
    const names = keys.map((key) => key.name)
    expect(new Set(names).size).toBe(labels.length)
    expect(names[labels.indexOf("A1")]).toBe("K_A1")
    expect(names.filter((_, index) => labels[index] === "A")).toEqual([
      "K_A2",
      "K_A3",
    ])
  })
}

test("number allocation reserves names across rows and multiple duplicate groups", () => {
  const names = parseKLELayout([
    ["A", "A1", "A2"],
    ["A", "A1"],
  ]).map((key) => key.name)
  expect(new Set(names).size).toBe(5)
  expect(names[2]).toBe("K_A2")
})

test("ordinary duplicate and unique names remain unchanged", () => {
  expect(parseKLELayout([["A", "A", "B"]]).map((key) => key.name)).toEqual([
    "K_A1",
    "K_A2",
    "K_B",
  ])
})

test("an alphanumeric prototype member is treated as a label", () => {
  expect(getRefDesForKey("constructor")).toBe("K_CONSTRUCTOR")
  expect(
    parseKLELayout([["constructor", "constructor"]]).map((key) => key.name),
  ).toEqual(["K_CONSTRUCTOR1", "K_CONSTRUCTOR2"])
})

test("an inherited property cannot override a valid second legend", () => {
  expect(getRefDesForKey("__proto__\nA")).toBe("K_A")
})

test("an unsupported prototype-property label follows the normal error path", () => {
  expect(() => getRefDesForKey("__proto__")).toThrow()
})
