import { describe, expect, it } from "bun:test";
import type { BoardCells } from "../../types";
import { findWinningCells, hasWinner } from "./hasWinner";

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
    expect(hasWinner(board)).toBe("x");
  });

  it.each([0, 1, 2])("finds winner in vertical column %i", (col: number) => {
    const board = parseBoard("   ", "   ", "   ");
    board[col] = "x";
    board[col + 3] = "x";
    board[col + 6] = "x";
    expect(hasWinner(board)).toBe("x");
  });

  it("finds winner diagonally top-left to bottom-right", () => {
    const board = parseBoard("x  ", " x ", "  x");
    expect(hasWinner(board)).toBe("x");
  });

  it("finds winner diagonally bottom-right to top-left", () => {
    const board = parseBoard("  x", " x ", "x  ");
    expect(hasWinner(board)).toBe("x");
  });

  it("finds winner diagonally in real board", () => {
    const board: BoardCells = ["x", "o", "o", "o", "x", "x", "x", "o", "x"];
    expect(hasWinner(board)).toBe("x");
  });
});

describe("findWinningCells", () => {
  it("finds no winning cells on an empty board", () => {
    const board = parseBoard("   ", "   ", "   ");
    expect(findWinningCells(board)).toBeUndefined();
  });

  it.each([0, 1, 2])("finds winning cells in horizontal row %i", (row: number) => {
    const emptyRow = "   ";
    const checkedRow = "xxx";
    const board = parseBoard(
      row === 0 ? checkedRow : emptyRow,
      row === 1 ? checkedRow : emptyRow,
      row === 2 ? checkedRow : emptyRow,
    );
    expect(findWinningCells(board)).toEqual([row * 3, row * 3 + 1, row * 3 + 2]);
  });

  it.each([0, 1, 2])("finds winning cells in vertical column %i", (col: number) => {
    const board = parseBoard("   ", "   ", "   ");
    board[col] = "x";
    board[col + 3] = "x";
    board[col + 6] = "x";
    expect(findWinningCells(board)).toEqual([col, col + 3, col + 6]);
  });

  it("finds winning cells diagonally top-left to bottom-right", () => {
    const board = parseBoard("x  ", " x ", "  x");
    expect(findWinningCells(board)).toEqual([0, 4, 8]);
  });

  it("finds winning cells diagonally bottom-right to top-left", () => {
    const board = parseBoard("  x", " x ", "x  ");
    expect(findWinningCells(board)).toEqual([2, 4, 6]);
  });
});

function parseBoard(row1: string, row2: string, row3: string): BoardCells {
  return row1.split("").concat(row2.split("")).concat(row3.split("")) as BoardCells;
}
