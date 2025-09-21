import { layouts } from "../lib/layouts"
import { PICO } from "@tsci/seveibar.PICO"
import { KeyMatrix } from "../lib/KeyMatrix"

export default () => (
	<board>
		<KeyMatrix
			layout={layouts.default60}
			colToMicroPin={[
				"net.COL0",
				"net.COL1",
				"net.COL2",
				"net.COL3",
				"net.COL4",
				"net.COL5",
				"net.COL6",
				"net.COL7",
				"net.COL8",
				"net.COL9",
				"net.COL10",
				"net.COL11",
				"net.COL12",
				"net.COL13",
				"net.COL14",
			]}
			rowToMicroPin={[
				"net.ROW1",
				"net.ROW2",
				"net.ROW3",
				"net.ROW4",
				"net.ROW5",
			]}
		/>
		<PICO
			name="U1"
			pcbRotation="90deg"
			layer="bottom"
			pcbX={-175}
			pcbY={7}
			connections={{
				GP0: "net.COL0",
				GP1: "net.COL1",
				GP2: "net.COL2",
				GP3: "net.COL3",
				GP4: "net.COL4",
				GP5: "net.COL5",
				GP6: "net.COL6",
				GP7: "net.COL7",
				GP8: "net.COL8",
				GP9: "net.COL9",
				GP10: "net.COL10",
				GP11: "net.COL11",
				GP12: "net.COL12",
				GP13: "net.COL13",
				GP14: "net.COL14",
				GP15: "net.ROW1",
				GP16: "net.ROW2",
				GP17: "net.ROW3",
				GP18: "net.ROW4",
				GP19: "net.ROW5",
			}}
		/>
		<hole pcbX={-180} pcbY={-56} diameter="2.2mm" />
		<hole pcbX={115} pcbY={-32} diameter="2.2mm" />
		<hole pcbX={119} pcbY={26} diameter="2.2mm" />
	</board>
)
