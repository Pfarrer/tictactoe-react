import { describe, expect, it } from "vitest";
import { hasWinner } from "./hasWinner";
import type { BoardCells } from "../../types";

describe("hasWinner", () => {
  it("finds no winner on an empty board", () => {
    const board = parseBoard("   ", "   ", "   ");
    expect(hasWinner(board)).toBeUndefined();
  });

  it.each([0, 1, 2])("finds winner in horizontal row %i", (row: number) => {
    const emptyRow = "   ";
    const checkedRow = "xxx";
    const board = parseBoard(
      row === 0 ? checkedRow : emptyRow,
      row === 1 ? checkedRow : emptyRow,
      row === 2 ? checkedRow : emptyRow,
    );
    expect(hasWinner(board)).toBe("human");
  });

  it.each([0, 1, 2])("finds winner in vertical column %i", (col: number) => {
    const board = parseBoard("   ", "   ", "   ");
    board[col] = "x";
    board[col + 3] = "x";
    board[col + 6] = "x";
    expect(hasWinner(board)).toBe("human");
  });

  it("finds winner diagonally top-left to bottom-right", () => {
    const board = parseBoard("x  ", " x ", "  x");
    expect(hasWinner(board)).toBe("human");
  });

  it("finds winner diagonally bottom-right to top-left", () => {
    const board = parseBoard("  x", " x ", "x  ");
    expect(hasWinner(board)).toBe("human");
  });

  it("finds winner diagonally in real board", () => {
    const board: BoardCells = ["x", "o", "o", "o", "x", "x", "x", "o", "x"];
    expect(hasWinner(board)).toBe("human");
  });
});

function parseBoard(row1: string, row2: string, row3: string): BoardCells {
  return row1.split("").concat(row2.split("")).concat(row3.split("")) as BoardCells;
}
