import { describe, expect, it } from "vitest";
import { findBestMove } from "./minimax";
import type { BoardCells } from "../../types";

describe("minimax", () => {
  const board = ["o", "o", " ", "x", " ", " ", " ", " ", " "] as BoardCells;

  it("should return the winning move", () => {
    const move = findBestMove(board, "computer");
    expect(move).toBe(2);
  });

  it("should block the opponent from winning", () => {
    const move = findBestMove(board, "human");
    expect(move).toBe(2);
  });
});
