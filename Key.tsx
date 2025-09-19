import { KeyHotSocket } from "@tsci/seveibar.KeyHotSocket"
import { KeyShaftForHotSocket } from "@tsci/seveibar.KeyShaftForHotSocket"

export const Key = (props: {
  pcbX?: number
  pcbY?: number
  schX?: number
  schY?: number
  pcbRotation?: number
  name: string
  connections?: {
    pin1?: string
    pin2?: string
  }
}) => {
  return (
    <group
      pcbX={props.pcbX}
      pcbY={props.pcbY}
      schX={props.schX}
      schY={props.schY}
    >
      <KeyHotSocket name={props.name} connections={props.connections} pcbRotation={props.pcbRotation} />
      <KeyShaftForHotSocket
        name={`${props.name}_shaft`}
        pcbX={0}
        pcbY={-0.52}
        pcbRotation={props.pcbRotation}
      />
      <footprint>
        <silkscreentext text={props.name} pcbY={5} />
      </footprint>
    </group>
  )
}
