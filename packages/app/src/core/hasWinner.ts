import type { BoardCellValue, GameState } from "@tic-tac-toe/shared/state";

const DIMENSIONS = 3;

export function hasWinner(board: GameState["board"]): GameState["winner"] {
  const victoriousCellValue = findVictoriousCellValue(board);
  if (victoriousCellValue) {
    return victoriousCellValue === "x" ? "human" : "computer";
  } else {
    return undefined;
  }
}

function findVictoriousCellValue(
  b: GameState["board"],
): undefined | BoardCellValue {
  // Check horizontally
  for (let row = 0; row < DIMENSIONS; row++) {
    const offset = DIMENSIONS * row;
    if (
      b[offset + 0] !== " " &&
      b[offset + 0] == b[offset + 1] &&
      b[offset + 1] == b[offset + 2]
    ) {
      return b[offset + 0];
    }
  }

  // Check vertically
  for (let column = 0; column < DIMENSIONS; column++) {
    if (
      b[0 + column] !== " " &&
      b[0 + column] == b[3 + column] &&
      b[3 + column] == b[6 + column]
    ) {
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
