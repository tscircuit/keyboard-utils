// Define the types for keyboard-layout-editor.com JSON format

import { getRefDesForKey } from "./getRefDesForKey"

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

  let current = {
    x: 0, y: 0, x2: 0, y2: 0,
    width: 1, height: 1, width2: 1, height2: 1,
    rotation_angle: 0, rotation_x: 0, rotation_y: 0,
    labels: [], textColor: [], textSize: [],
    default: { textColor: "#000000", textSize: 3 },
    color: "#cccccc", profile: "", nub: false,
    ghost: false, stepped: false, decal: false,
    sm: "", sb: "", st: ""
  }
  let cluster = { x: 0, y: 0 }
  let align = 4
  let keyId = 0

  const nameCounters = new Map<string, number>()

  // Process each row
  for (let r = 0; r < layout.length; r++) {
    if (layout[r] instanceof Array) {
      let colIndex = 0

      // Process each item in the row
      for (let k = 0; k < layout[r].length; k++) {
        const item = layout[r][k]

        if (typeof item === 'string') {
          // This is a key
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

          const newKey = {
            name: refDes,
            x: (current.x + current.width / 2) * KEY_SIZE,
            y: -(current.y + current.height / 2) * KEY_SIZE,
            width: current.width * KEY_SIZE,
            height: current.height * KEY_SIZE,
            rotation: current.rotation_angle,
            rotationX: current.rotation_x * KEY_SIZE,
            rotationY: -current.rotation_y * KEY_SIZE,
            row: r,
            col: colIndex,
          }

          keys.push(newKey)

          // Set up for the next key (from KLE logic)
          current.x += current.width
          current.width = current.height = 1
          current.x2 = current.y2 = current.width2 = current.height2 = 0
          current.nub = current.stepped = current.decal = false
          colIndex++

        } else {
          // This is a property object
          if (item.r != null) {
            if (k != 0) throw new Error("'r' can only be used on the first key in a row")
            current.rotation_angle = item.r
          }
          if (item.rx != null) {
            if (k != 0) throw new Error("'rx' can only be used on the first key in a row")
            current.rotation_x = cluster.x = item.rx
            // Extend current with cluster (reset position to rotation center)
            current.x = cluster.x
            current.y = cluster.y
          }
          if (item.ry != null) {
            if (k != 0) throw new Error("'ry' can only be used on the first key in a row")
            current.rotation_y = cluster.y = item.ry
            // Extend current with cluster (reset position to rotation center)
            current.x = cluster.x
            current.y = cluster.y
          }
          if (item.a != null) { align = item.a }
          if (item.x) { current.x += item.x }
          if (item.y) { current.y += item.y }
          if (item.w) { current.width = current.width2 = item.w }
          if (item.h) { current.height = current.height2 = item.h }
          // ... other properties would go here
        }
      }

      // End of the row (from KLE logic)
      current.y++
    }
    // Reset x to rotation_x at end of row (from KLE logic)
    current.x = current.rotation_x
  }

  return keys
}
