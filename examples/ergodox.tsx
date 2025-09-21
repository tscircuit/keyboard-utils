import { KeyMatrix } from "../lib/KeyMatrix"
import {layouts} from "../lib/layouts"
import { PICO } from "@tsci/seveibar.PICO";

export default () => (
  <board
    routingDisabled
    width={380}
    height={170}
  >
    <KeyMatrix
      layout={layouts.ergodox}
      colToMicroPin={["net.COL0", "net.COL1", "net.COL2", "net.COL3", "net.COL4", "net.COL5", "net.COL6", "net.COL7", "net.COL8", "net.COL9", "net.COL10", "net.COL11", "net.COL12", "net.COL13"]}
      rowToMicroPin={[
        "net.ROW0",
        "net.ROW1",
        "net.ROW2",
        "net.ROW3",
        "net.ROW4",
        "net.ROW5",
        "net.ROW6"
      ]}
      pcbX={15}
      pcbY={22}
    />
		<PICO
			name="U1"
			pcbRotation={-90}
			layer="bottom"
			pcbX={0}
			pcbY={60}
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
				GP15: "net.ROW0",
				GP16: "net.ROW1",
				GP17: "net.ROW2",
				GP18: "net.ROW3",
				GP19: "net.ROW4",
				GP20: "net.ROW5",
				GP21: "net.ROW6",
			}}
		/>
    <hole diameter={2.2} pcbX={-186} pcbY={82} />
    <hole diameter={2.2} pcbX={186} pcbY={82} />
    <hole diameter={2.2} pcbX={-186} pcbY={-82} />
    <hole diameter={2.2} pcbX={186} pcbY={-82} />
  </board>
)
