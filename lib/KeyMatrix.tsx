import React from 'react';
import { parseKLELayout } from "./KLELayout";
import type { KLELayout } from "./KLELayout";
import { A_1N4148WS } from "imports/A1N4148WS";
import { Key } from "../components/Key";

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

  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity

  for (const key of keys) {
    const angle = key.rotation * Math.PI / 180
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    for (const dx of [-key.width / 2, key.width / 2]) {
      for (const dy of [-key.height / 2, key.height / 2]) {
        const localX = key.x + dx - key.rotationX
        const localY = key.y + dy - key.rotationY
        const x = key.rotationX + localX * cos - localY * sin
        const y = key.rotationY + localX * sin + localY * cos
        minX = Math.min(minX, x)
        maxX = Math.max(maxX, x)
        minY = Math.min(minY, y)
        maxY = Math.max(maxY, y)
      }
    }
  }

  const keyboardCenterX = keys.length ? (minX + maxX) / 2 : 0
  const keyboardCenterY = keys.length ? (minY + maxY) / 2 : 0

  // Group keys by rotation and rotation center
  const keyGroups = new Map<string, typeof keys>()

  keys.forEach(key => {
    const groupKey = `${key.rotation}_${key.rotationX}_${key.rotationY}`
    if (!keyGroups.has(groupKey)) {
      keyGroups.set(groupKey, [])
    }
    keyGroups.get(groupKey)!.push(key)
  })

  return (
    <group pcbX={pcbX} pcbY={pcbY} schX={schX} schY={schY}>
      {Array.from(keyGroups.entries()).map(([groupKey, groupKeys]) => {
        const firstKey = groupKeys[0]
        const hasRotation = firstKey.rotation !== 0

        if (hasRotation) {
          // For rotated key groups (thumb clusters), position at absolute rotation center
          const rotationCenterX = firstKey.rotationX - keyboardCenterX
          const rotationCenterY = firstKey.rotationY - keyboardCenterY

          return (
            <group
              key={groupKey}
              pcbX={rotationCenterX}
              pcbY={rotationCenterY}
              pcbRotation={firstKey.rotation}
            >
              {groupKeys.map((key) => {
                // Position keys relative to their rotation center
                const relX = key.x - key.rotationX
                const relY = key.y - key.rotationY

                return (
                  <group
                    key={key.name}
                    pcbX={relX}
                    pcbY={relY}
                    schX={relX / 5}
                    schY={relY / 7}
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
        } else {
          // For non-rotated key groups, position relative to keyboard center
          return (
            <group key={groupKey}>
              {groupKeys.map((key) => {
                const relX = key.x - keyboardCenterX
                const relY = key.y - keyboardCenterY

                return (
                  <group
                    key={key.name}
                    pcbX={relX}
                    pcbY={relY}
                    schX={relX / 5}
                    schY={relY / 7}
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
      })}
    </group>
  )
}
