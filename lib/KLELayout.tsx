// Define the types for keyboard-layout-editor.com JSON format

import { getRefDesForKey } from "lib/getRefDesForKey"

export type KLEKey =
  | string
  | {
      x?: number
      y?: number
      w?: number
      h?: number
      x2?: number
      y2?: number
      w2?: number
      h2?: number
      r?: number
      rx?: number
      ry?: number
      n?: boolean
      l?: boolean
      d?: boolean
      g?: boolean
      sm?: string
      sb?: string
      st?: string
      a?: number
    }

export type KLELayout = KLEKey[][]
// Helper function to parse keyboard-layout-editor JSON

export const parseKLELayout = (layout: KLELayout) => {
  // Default key size in millimeters
  const KEY_SIZE = 19.05 // Standard keycap size (19.05mm or 0.75 inches)
  const keys: Array<{
    name: string
    x: number
    y: number
    width: number
    height: number
    rotation: number
    rotationX: number
    rotationY: number
    row: number
    col: number
  }> = []

  let currentX = 0
  let currentY = 0
  let currentRotation = 0
  let currentRotationX = 0
  let currentRotationY = 0
  let keyCount = 1

  // Default properties for keys
  let currentProps = {
    width: 1,
    height: 1,
    x: 0,
    y: 0,
    align: undefined as undefined | number,
  }

  const nameCounters = new Map<string, number>()
  layout.forEach((row, rowIndex) => {
    currentX = 0
    let colIndex = 0

    // Process each item in the row
    row.forEach((item) => {
      // If it's an object, it's a key with special properties
      if (typeof item === "object") {
        // Update current properties based on the item
        if (item.x !== undefined) currentX += item.x
        if (item.y !== undefined) currentY += item.y
        if (item.w !== undefined) currentProps.width = item.w
        if (item.h !== undefined) currentProps.height = item.h
        if (item.r !== undefined) currentRotation = item.r
        if (item.rx !== undefined) currentRotationX = item.rx
        if (item.ry !== undefined) currentRotationY = item.ry
        if (item.a !== undefined) currentProps.align = item.a
      }

      // If it's a string, it's a key label
      else if (typeof item === "string") {
        let refDes = getRefDesForKey(item)

        if (nameCounters.has(refDes)) {
          // Edit the original item to include the counter (if it doesn't have it)
          const ogKey = keys.find((k) => k.name === refDes)
          if (ogKey) {
            ogKey.name = `${refDes}${nameCounters.get(refDes)!}`
          }

          nameCounters.set(refDes, nameCounters.get(refDes)! + 1)
          refDes = `${refDes}${nameCounters.get(refDes)!}`
        } else {
          nameCounters.set(refDes, 1)
        }

        keys.push({
          name: refDes,
          x: (currentX + currentProps.width / 2) * KEY_SIZE,
          y: -(currentY + currentProps.height / 2) * KEY_SIZE,
          width: currentProps.width * KEY_SIZE,
          height: currentProps.height * KEY_SIZE,
          rotation: currentRotation,
          rotationX: currentRotationX * KEY_SIZE,
          rotationY: currentRotationY * KEY_SIZE,
          row: rowIndex,
          col: colIndex,
        })

        // Move to the next position
        currentX += currentProps.width
        keyCount++
        colIndex++

        // Reset width and height to default for the next key
        currentProps.width = 1
        currentProps.height = 1
      }
    })

    // Move to the next row
    currentY++
  })

  return keys
}
