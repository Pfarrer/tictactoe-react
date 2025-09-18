import type { BoardCells } from "../../types";

export function findNextMove(board: BoardCells): number | null {
  for (let i = 0; i < 1000; i++) {
    const idx = Math.round(Math.random() * 8);
    if (board[idx] === " ") {
      return idx;
    }
  }
  return null;
}
