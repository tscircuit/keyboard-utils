import { test, expect } from "bun:test";
import { KeyMatrix } from "../lib/KeyMatrix";
import { layouts } from "../lib/layouts";
import { Circuit } from "tscircuit";
import { convertCircuitJsonToPcbSvg} from "circuit-to-svg"

test("ergodox", () => {
	const circuit = new Circuit();

	circuit.add(
		<board routingDisabled>
			<KeyMatrix layout={layouts.ergodox} />
		</board>,
	);

    circuit.render()

    expect(convertCircuitJsonToPcbSvg(circuit.getCircuitJson())).toMatchSvgSnapshot(import.meta.path)
});
