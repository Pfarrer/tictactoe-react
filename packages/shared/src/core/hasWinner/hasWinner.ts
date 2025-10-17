import type { BoardCell, BoardCells } from "../../types/fundamental";

const DIMENSIONS = 3;

export function hasWinner(board: BoardCells): BoardCell | undefined {
  return findVictoriousCellValue(board);
}

export function findWinningCells(board: BoardCells): number[] | undefined {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // columns
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ];

  for (const pattern of winPatterns) {
    const firstIndex = pattern[0];
    if (firstIndex !== undefined) {
      const firstCell = board[firstIndex];
      if (firstCell !== " " && pattern.every((idx) => board[idx] === firstCell)) {
        return pattern;
      }
    }
  }

  return undefined;
}

function findVictoriousCellValue(b: BoardCells): undefined | BoardCell {
  // Check horizontally
  for (let row = 0; row < DIMENSIONS; row++) {
    const offset = DIMENSIONS * row;
    if (b[offset + 0] !== " " && b[offset + 0] == b[offset + 1] && b[offset + 1] == b[offset + 2]) {
      return b[offset + 0];
    }
  }

  // Check vertically
  for (let column = 0; column < DIMENSIONS; column++) {
    if (b[0 + column] !== " " && b[0 + column] == b[3 + column] && b[3 + column] == b[6 + column]) {
      return b[0 + column];
    }
  }

  // Check diagonally "/"
  if (b[2] !== " " && b[2] == b[4] && b[4] == b[6]) {
    return b[2];
  }

  // Check diagonally "\"
  if (b[0] !== " " && b[0] == b[4] && b[4] == b[8]) {
    return b[0];
  }

  return undefined;
}
