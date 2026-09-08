/// <reference types="bun" />
import { expect, test } from "bun:test";
import { Children, type ReactElement, type ReactNode } from "react";
import { KeyMatrix } from "../lib/KeyMatrix";

type Group = ReactElement<{
	children?: ReactNode;
	pcbX?: number;
	pcbY?: number;
	pcbRotation?: number;
}>;
const groups = (element: Group) =>
	Children.toArray(element.props.children) as Group[];
const unit = 19.05;

test("a single key is centered at the requested keyboard position", () => {
	const matrix = KeyMatrix({ layout: [["A"]], pcbX: 42, pcbY: -7 });
	const key = groups(groups(matrix)[0]!)[0]!;
	expect(matrix.props.pcbX).toBe(42);
	expect(matrix.props.pcbY).toBe(-7);
	expect(key.props.pcbX).toBeCloseTo(0);
	expect(key.props.pcbY).toBeCloseTo(0);
});

test("a 2x2 keyboard has symmetric key centers", () => {
	const matrix = KeyMatrix({
		layout: [
			["A", "B"],
			["C", "D"],
		],
	});
	const keys = groups(groups(matrix)[0]!);
	const expected = [
		[-0.5, 0.5],
		[0.5, 0.5],
		[-0.5, -0.5],
		[0.5, -0.5],
	];
	keys.forEach((key, index) => {
		expect(key.props.pcbX).toBeCloseTo(expected[index]![0]! * unit);
		expect(key.props.pcbY).toBeCloseTo(expected[index]![1]! * unit);
	});
});

test("centering includes both halves of variable-size keys", () => {
	const matrix = KeyMatrix({ layout: [[{ w: 2, h: 2 }, "A", "B"]] });
	const [wide, normal] = groups(groups(matrix)[0]!);
	expect(wide!.props.pcbX).toBeCloseTo(-0.5 * unit);
	expect(wide!.props.pcbY).toBeCloseTo(0);
	expect(normal!.props.pcbX).toBeCloseTo(unit);
	expect(normal!.props.pcbY).toBeCloseTo(0.5 * unit);
});

test("a rotated key is centered using its transformed geometry", () => {
	const matrix = KeyMatrix({ layout: [[{ r: 90, rx: 2, ry: 3, w: 2 }, "A"]] });
	const cluster = groups(matrix)[0]!;
	const key = groups(cluster)[0]!;
	expect(cluster.props.pcbRotation).toBe(90);
	expect(cluster.props.pcbX).toBeCloseTo(-0.5 * unit);
	expect(cluster.props.pcbY).toBeCloseTo(-unit);
	expect(key.props.pcbX).toBeCloseTo(unit);
	expect(key.props.pcbY).toBeCloseTo(-0.5 * unit);
});

test("rotated and unrotated clusters share one visual center", () => {
	const matrix = KeyMatrix({ layout: [["A"], [{ r: 90, rx: 2, ry: 0 }, "B"]] });
	const [main, rotated] = groups(matrix);
	const key = groups(main!)[0]!;
	expect(key.props.pcbX).toBeCloseTo(-unit);
	expect(key.props.pcbY).toBeCloseTo(-0.5 * unit);
	expect(rotated!.props.pcbX).toBeCloseTo(0.5 * unit);
	expect(rotated!.props.pcbY).toBeCloseTo(0);
});

test("an empty keyboard still renders an empty group", () => {
	expect(groups(KeyMatrix({ layout: [] }))).toEqual([]);
});
