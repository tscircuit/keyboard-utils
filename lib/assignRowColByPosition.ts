/**
 * Assigns logical row/col coordinates to keys based on their physical positions
 * for the ergodox keyboard layout
 */
export function assignRowColByPosition(keys: Array<{
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
}>) {
  const keysWithNewRowCol = keys.map(key => ({ ...key }));

  // Separate keys by section
  const leftMainKeys = keysWithNewRowCol.filter(key => key.rotation === 0 && key.x < 150);
  const rightMainKeys = keysWithNewRowCol.filter(key => key.rotation === 0 && key.x > 150);
  const thumbClusterKeys = keysWithNewRowCol.filter(key => key.rotation !== 0);

  // Function to assign row/col based on position grid
  function assignRowColByPosition(keys: typeof leftMainKeys, isRightSide = false) {
    // Create a position-based grid
    const GRID_SIZE = 19.05; // Standard key unit size

    function roundToGrid(position: number) {
      const lower = Math.floor(position / GRID_SIZE);
      // Compare in millimeters: 3.5 * GRID_SIZE / GRID_SIZE can be just below
      // 3.5. Reconstructing the midpoint preserves ties without an epsilon.
      return position < (lower + 0.5) * GRID_SIZE ? lower : lower + 1;
    }

    keys.forEach(key => {
      // Calculate grid position based on physical coordinates
      const gridRow = roundToGrid(-key.y); // Negative y because y increases downward
      const gridCol = roundToGrid(key.x);

      key.row = gridRow;
      key.col = isRightSide ? gridCol : gridCol; // Keep original columns for now
    });
  }

  // Assign positions for main keys
  assignRowColByPosition(leftMainKeys, false);
  assignRowColByPosition(rightMainKeys, true);

  // Normalize row numbers to start from 0
  const allMainKeys = [...leftMainKeys, ...rightMainKeys];
  const minRow = Math.min(...allMainKeys.map(k => k.row));
  allMainKeys.forEach(key => {
    key.row = key.row - minRow;
  });

  // For ergodox specifically, we want to organize columns better
  // Left side: find the actual column positions
  const leftCols = [...new Set(leftMainKeys.map(k => k.col))].sort((a, b) => a - b);
  const rightCols = [...new Set(rightMainKeys.map(k => k.col))].sort((a, b) => a - b);

  // Remap left side columns to 0-based indexing
  leftMainKeys.forEach(key => {
    key.col = leftCols.indexOf(key.col);
  });

  // Remap right side columns to continue after left side
  const maxLeftCol = Math.max(...leftMainKeys.map(k => k.col));
  rightMainKeys.forEach(key => {
    const rightIndex = rightCols.indexOf(key.col);
    key.col = maxLeftCol + 1 + rightIndex;
  });

  // Handle thumb clusters
  const leftThumbKeys = thumbClusterKeys.filter(key => key.rotation < 0);
  const rightThumbKeys = thumbClusterKeys.filter(key => key.rotation > 0);

  // Sort thumb keys by Y position first, then X
  leftThumbKeys.sort((a, b) => a.y - b.y || a.x - b.x);
  rightThumbKeys.sort((a, b) => a.y - b.y || a.x - b.x);

  // Assign thumb cluster rows (starting after main key rows)
  const maxMainRow = Math.max(...allMainKeys.map(k => k.row));

  leftThumbKeys.forEach((key, index) => {
    key.row = maxMainRow + 1 + Math.floor(index / 3);
    key.col = index % 3;
  });

  const maxLeftThumbCol = Math.max(...leftMainKeys.map(k => k.col));
  rightThumbKeys.forEach((key, index) => {
    key.row = maxMainRow + 1 + Math.floor(index / 3);
    key.col = maxLeftThumbCol + 1 + (index % 3);
  });

  return keysWithNewRowCol;
}