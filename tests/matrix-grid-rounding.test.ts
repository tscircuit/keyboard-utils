/// <reference types="bun" />
import { expect, test } from "bun:test";
import { assignRowColByPosition } from "../lib/assignRowColByPosition";
import { parseKLELayout } from "../lib/KLELayout";
import { layouts } from "../lib/layouts";

const unit = 19.05;
const key = (name: string, x: number, y = 0) => ({
	name,
	x,
	y,
	width: unit,
	height: unit,
	rotation: 0,
	rotationX: 0,
	rotationY: 0,
	row: 99,
	col: 99,
});

test("a regular 4x4 layout has four distinct rows and columns", () => {
	const keys = parseKLELayout([
		["A", "B", "C", "D"],
		["E", "F", "G", "H"],
		["I", "J", "K", "L"],
		["M", "N", "O", "P"],
	]);

	expect(keys.map(({ row, col }) => [row, col])).toEqual([
		[0, 0],
		[0, 1],
		[0, 2],
		[0, 3],
		[1, 0],
		[1, 1],
		[1, 2],
		[1, 3],
		[2, 0],
		[2, 1],
		[2, 2],
		[2, 3],
		[3, 0],
		[3, 1],
		[3, 2],
		[3, 3],
	]);
});

test("default60 keeps its five physical rows and adjacent number keys separate", () => {
	const keys = parseKLELayout(layouts.default60);
	let index = 0;
	for (const [row, entries] of layouts.default60.entries()) {
		for (const entry of entries) {
			if (typeof entry !== "string") continue;
			expect(keys[index++]!.row).toBe(row);
		}
	}
	expect(keys.find((key) => key.name === "K_AT")!.col).toBe(2);
	expect(keys.find((key) => key.name === "K_HASH")!.col).toBe(3);
	expect(new Set(keys.map(({ row, col }) => `${row},${col}`)).size).toBe(61);
});

test("Ergodox's vertically adjacent middle-finger keys use different rows", () => {
	const keys = parseKLELayout(layouts.ergodox);
	for (const [top, bottom] of [
		["K_D", "K_C"],
		["K_K", "K_LT"],
	]) {
		const a = keys.find((key) => key.name === top)!;
		const b = keys.find((key) => key.name === bottom)!;
		expect(a.x).toBe(b.x);
		expect(a.y - b.y).toBeCloseTo(unit);
		expect(b.row).toBe(a.row + 1);
		expect(b.col).toBe(a.col);
	}
});

// The middle entry in each triple is a grid midpoint generated in millimeters.
// Its neighbors are the immediately adjacent representable numbers, not an
// arbitrary epsilon. Even these closest non-ties must keep their own bucket.
const boundaries = [
	{ lower: 3, positions: [66.67499999999998, 66.675, 66.67500000000001] },
	{
		lower: -16,
		positions: [-295.2750000000001, -295.27500000000003, -295.275],
	},
	{ lower: 30, positions: [581.0249999999999, 581.025, 581.0250000000001] },
];

for (const { lower, positions } of boundaries) {
	test(`column midpoint ${lower + 0.5} and its neighbors preserve the boundary`, () => {
		for (const [index, position] of positions.entries()) {
			// Include a left-section anchor when testing the right section. Missing
			// sections are a separate concern, covered by the existing sparse fix.
			const anchor = lower > 20 ? [key("left", 0)] : [];
			const input = [
				...anchor,
				key("low", lower * unit),
				key("probe", position),
				key("high", (lower + 1) * unit),
			];
			const original = structuredClone(input);
			const result = assignRowColByPosition(input).slice(anchor.length);
			expect(result.map(({ col }) => col)).toEqual([
				anchor.length,
				anchor.length + (index === 0 ? 0 : 1),
				anchor.length + 1,
			]);
			expect(input).toEqual(original);
			expect(result.map(({ row, col, ...geometry }) => geometry)).toEqual(
				original
					.slice(anchor.length)
					.map(({ row, col, ...geometry }) => geometry),
			);
		}
	});

	test(`row midpoint ${lower + 0.5} and its neighbors preserve the boundary`, () => {
		for (const [index, position] of positions.entries()) {
			const result = assignRowColByPosition([
				key("low", 0, -lower * unit),
				key("probe", 0, -position),
				key("high", 0, -(lower + 1) * unit),
			]);
			expect(result.map(({ row }) => row)).toEqual([0, index === 0 ? 0 : 1, 1]);
		}
	});
}

test("ordinary staggered positions retain their nearest-grid assignments", () => {
	const input = [
		key("A", -0.75 * unit, 0.75 * unit),
		key("B", -0.25 * unit, 0.25 * unit),
		key("C", 0.25 * unit, -0.25 * unit),
		key("D", 0.75 * unit, -0.75 * unit),
	];
	expect(
		assignRowColByPosition(input).map(({ row, col }) => [row, col]),
	).toEqual([
		[0, 0],
		[1, 1],
		[1, 1],
		[2, 2],
	]);
});
