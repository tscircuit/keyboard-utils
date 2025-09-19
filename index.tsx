import { KeyMatrix } from "./lib/KeyMatrix"
import {layouts} from "./lib/layouts"

export default () => (
  <board
    routingDisabled
  >
    <KeyMatrix
      layout={layouts.ergodox}
    //   colToMicroPin={["net.COL0", "net.COL1", "net.COL2"]}
    //   rowToMicroPin={[
    //     "net.ROW1",
    //     "net.ROW2",
    //     "net.ROW3",
    //     "net.ROW4",
    //     "net.ROW5",
    //     "net.ROW6",
    //     "net.ROW7",
    //     "net.ROW8",
    //     "net.ROW9",
    //     "net.ROW10",
    //     "net.ROW11",
    //     "net.ROW12",
    //     "net.ROW13",
    //     "net.ROW14",
    //     "net.ROW15",
    //     "net.ROW16",
    //     "net.ROW17",
    //   ]}
      pcbX={0}
      pcbY={10}
    />

  </board>
)
