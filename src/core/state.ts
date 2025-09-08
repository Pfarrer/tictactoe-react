import { create, rawReturn } from "mutative";

export type BoardCellValue = " " | "x" | "o";

export interface GameState {
  board: [
    BoardCellValue,
    BoardCellValue,
    BoardCellValue,
    BoardCellValue,
    BoardCellValue,
    BoardCellValue,
    BoardCellValue,
    BoardCellValue,
    BoardCellValue,
  ];
  gameStatus: "pristine" | "active" | "finished";
  nextTurn: "human" | "computer";
  winner?: "human" | "computer";
}

export type GameAction =
  | { type: "reset" }
  | { type: "playerMoved"; cellIdx: number }
  | { type: "computerMoved"; cellIdx: number };

export function reducer(state: GameState, action: GameAction): GameState {
  const [draft, finalize] = create(state);
  
  switch (action.type) {
    case "playerMoved":
      if (draft.nextTurn === "human" && draft.gameStatus !== "finished" && draft.board[action.cellIdx] === " ") {
        draft.board[action.cellIdx] = "x";
        draft.gameStatus = "active";
        draft.nextTurn = "computer";
      }
      break;
    case "computerMoved":
      if (draft.nextTurn === "computer" && draft.gameStatus !== "finished" && draft.board[action.cellIdx] === " ") {
        draft.board[action.cellIdx] = "o";
        draft.gameStatus = "active";
        draft.nextTurn = "human";
      }
      break;
    case "reset":
      return rawReturn(initState);
    default:
      console.error("Action not implemented", action);
  }
  
  return finalize();
}

export const initState: GameState = {
  board: [" ", " ", " ", " ", " ", " ", " ", " ", " "],
  gameStatus: "pristine",
  nextTurn: "human",
};
