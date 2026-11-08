/// <reference types="bun" />
import { expect, test } from "bun:test";
import { Circuit } from "tscircuit";
import { KeyMatrix } from "../lib/KeyMatrix";

test("KeyMatrix connects a 4x4 layout to sixteen distinct row/column pairs", () => {
	const layout = [
		["A", "B", "C", "D"],
		["E", "F", "G", "H"],
		["I", "J", "K", "L"],
		["M", "N", "O", "P"],
	];
	const circuit = new Circuit();
	circuit.add(
		<board routingDisabled>
			<KeyMatrix
				layout={layout}
				rowToMicroPin={["net.ROW0", "net.ROW1", "net.ROW2", "net.ROW3"]}
				colToMicroPin={["net.COL0", "net.COL1", "net.COL2", "net.COL3"]}
			/>
		</board>,
	);
	circuit.render();
	const soup = circuit.getCircuitJson();
	const components = soup.filter(
		(element) => element.type === "source_component",
	);
	const ports = soup.filter((element) => element.type === "source_port");
	const traces = soup.filter((element) => element.type === "source_trace");
	const nets = soup.filter((element) => element.type === "source_net");

	const connectedNets = (name: string, pin: string) => {
		const component = components.find((component) => component.name === name);
		if (!component) throw new Error(`Missing component ${name}`);
		const port = ports.find(
			(port) =>
				port.source_component_id === component.source_component_id &&
				port.name === pin,
		);
		if (!port) throw new Error(`Missing port ${name}.${pin}`);
		const ids = traces
			.filter((trace) =>
				trace.connected_source_port_ids.includes(port.source_port_id),
			)
			.flatMap((trace) => trace.connected_source_net_ids);
		return nets
			.filter((net) => ids.includes(net.source_net_id))
			.map((net) => net.name);
	};

	for (const [row, labels] of layout.entries()) {
		for (const [col, label] of labels.entries()) {
			expect(connectedNets(`K_${label}_DIO`, "C")).toEqual([`ROW${row}`]);
			expect(connectedNets(`K_${label}`, "pin2")).toEqual([`COL${col}`]);
		}
	}
});
