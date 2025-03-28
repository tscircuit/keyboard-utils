import { Key } from "@tsci/seveibar.Key"
import { KLELayout, parseKLELayout } from "./KLELayout"
import { A_1N4148WS } from "imports/A1N4148WS"

interface KeyMatrixProps {
  layout: KLELayout
  rowToMicroPin?: string[]
  colToMicroPin?: string[]
  name?: string
  pcbX?: number
  pcbY?: number
  schX?: number
  schY?: number
}

export const KeyMatrix = ({
  layout,
  rowToMicroPin,
  colToMicroPin,
  name = "KB",
  pcbX = 0,
  pcbY = 0,
  schX = 0,
  schY = 0,
}: KeyMatrixProps) => {
  const keys = parseKLELayout(layout)

  const minX = Math.min(...keys.map((k) => k.x))
  const maxX = Math.max(...keys.map((k) => k.x + k.width))
  const minY = Math.min(...keys.map((k) => k.y))
  const maxY = Math.max(...keys.map((k) => k.y + k.height))

  return (
    <group pcbX={pcbX} pcbY={pcbY} schX={schX} schY={schY}>
      {keys.map((key, index) => {
        // Calculate the relative position from the center of the keyboard
        const relX = key.x - (minX + maxX) / 2
        const relY = key.y - (minY + maxY) / 2

        return (
          <group
            key={key.name}
            pcbX={relX}
            pcbY={relY}
            schX={35 + relX / 5} // Scale down for schematic view
            schY={relY / 7} // Scale down for schematic view
          >
            <Key name={key.name} />
            {rowToMicroPin?.[key.row] !== undefined && (
              <A_1N4148WS
                name={`${key.name}_DIO`}
                connections={{
                  A: `.${key.name} .pin1`,
                  C: rowToMicroPin[key.row],
                }}
                pcbX={0.5}
                pcbY={-13.5}
                schY={-1}
                layer="bottom"
              />
            )}
            {colToMicroPin?.[key.col] !== undefined && (
              <trace from={`.${key.name} .pin2`} to={colToMicroPin[key.col]} />
            )}
          </group>
        )
      })}
    </group>
  )
}
