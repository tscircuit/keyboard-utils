/// <reference types="bun" />
import { expect, test } from "bun:test";
import { Circuit } from "tscircuit";

import { KeyMatrix } from "../lib/KeyMatrix";
import { parseKLELayout, type KLELayout } from "../lib/KLELayout";
const unit = 19.05;
// KLE applies rotation in Y-down coordinates. After reflecting into PCB Y-up,
// horizontal key spacing transforms to (cos(angle), -sin(angle)) times one unit.
const cases = [
	{ angle: 0, dx: unit, dy: 0 },
	{ angle: 90, dx: 0, dy: -unit },
	{ angle: -90, dx: 0, dy: unit },
	{ angle: 30, dx: (unit * Math.sqrt(3)) / 2, dy: -unit / 2 },
	{ angle: -30, dx: (unit * Math.sqrt(3)) / 2, dy: unit / 2 },
];
const layoutFor = (angle: number): KLELayout => [
	["Z"],
	[{ r: angle, rx: 4, ry: 3, x: 1, y: -1 }, "A", "B"],
];

for (const { angle, dx, dy } of cases) {
	for (const [pcbX, pcbY] of [
		[0, 0],
		[31, -17],
	] as const) {
		test(`KLE ${angle} degrees preserves key displacement at ${pcbX},${pcbY}`, () => {
			const circuit = new Circuit();
			circuit.add(
				<board routingDisabled>
					<KeyMatrix layout={layoutFor(angle)} pcbX={pcbX} pcbY={pcbY} />
				</board>,
			);
			circuit.render();
			const soup = circuit.getCircuitJson();
			const center = (name: string) => {
				const source = soup
					.filter((element) => element.type === "source_component")
					.find((element) => element.name === name);
				if (!source) throw new Error(`Missing source component ${name}`);
				const component = soup
					.filter((element) => element.type === "pcb_component")
					.find(
						(element) =>
							element.source_component_id === source.source_component_id,
					);
				if (!component) throw new Error(`Missing PCB component ${name}`);
				return component.center;
			};
			const a = center("K_A");
			const b = center("K_B");
			expect(b.x - a.x).toBeCloseTo(dx, 6);
			expect(b.y - a.y).toBeCloseTo(dy, 6);
		});
	}
}

test("raw KLE angles and electrical matrix assignments are preserved", () => {
	for (const angle of [-90, -30, 30, 90]) {
		const keys = parseKLELayout(layoutFor(angle));
		expect(keys.map((key) => key.rotation)).toEqual([0, angle, angle]);
		expect(keys.map((key) => [key.row, key.col])).toEqual(
			angle < 0
				? [
						[0, 0],
						[1, 0],
						[1, 1],
					]
				: [
						[0, 0],
						[1, 1],
						[1, 2],
					],
		);
		const rotated = keys[1];
		if (!rotated) throw new Error("Missing rotated key");
		expect(rotated.rotationX).toBe(4 * unit);
		expect(rotated.rotationY).toBe(-3 * unit);
	}
});
