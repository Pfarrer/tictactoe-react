import { describe, expect, it } from "vitest";
import { reducer } from "./state";
import { hasWinner } from "@tic-tac-toe/shared/core";
import type { BoardCells, GameMode, GameState, PlayerType } from "@tic-tac-toe/shared/types";

describe("state", () => {
  it("game finsihed when there are no empty cells left", () => {
    const board = parseBoard("xxo", "oxx", "xo ");
    expect(hasWinner(board)).toBeUndefined();

    const initialState = initActiveGameState(board, "computer");
    const updatedState = reducer(initialState, {
      type: "computer_move_requested",
      cellIdx: 8,
    });
    expect(updatedState.gameStatus).toBe("finished");
    expect(updatedState.winner).toBeUndefined();
  });
});

function initActiveGameState(
  board: BoardCells,
  nextTurn: PlayerType,
  gameMode: GameMode = "Human-vs-Computer",
): GameState {
  return {
    board,
    gameMode,
    gameStatus: "active",
    difficulty: "Luck",
    nextTurn,
  };
}

function parseBoard(row1: string, row2: string, row3: string): BoardCells {
  return row1.split("").concat(row2.split("")).concat(row3.split("")) as BoardCells;
}
