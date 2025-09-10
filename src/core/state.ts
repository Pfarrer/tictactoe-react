import { create, rawReturn } from "mutative";
import { hasWinner } from "./hasWinner";

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
  | { type: "reset_requested" }
  | { type: "player_move_requested"; cellIdx: number }
  | { type: "computer_move_requested"; cellIdx: number };

export function reducer(state: GameState, action: GameAction): GameState {
  const [draft, finalize] = create(state);
  
  switch (action.type) {
    case "player_move_requested":
      if (draft.nextTurn === "human" && draft.gameStatus !== "finished" && draft.board[action.cellIdx] === " ") {
        draft.board[action.cellIdx] = "x";
        draft.gameStatus = "active";
        draft.nextTurn = "computer";
      }
      break;
    case "computer_move_requested":
      if (draft.nextTurn === "computer" && draft.gameStatus !== "finished" && draft.board[action.cellIdx] === " ") {
        draft.board[action.cellIdx] = "o";
        draft.gameStatus = "active";
        draft.nextTurn = "human";
      }
      break;
    case "reset_requested":
      return rawReturn(initState);
    default:
      console.error("Action not implemented", action);
  }

  updateGameStatus(draft);

  return finalize();
}

export const initState: GameState = {
  board: [" ", " ", " ", " ", " ", " ", " ", " ", " "],
  gameStatus: "pristine",
  nextTurn: "human",
};

function updateGameStatus(draft: GameState) {
  if (draft.gameStatus !== "active") {
    return;
  }

  const winner = hasWinner(draft.board);
  if (winner !== undefined) {
    draft.winner = winner;
    draft.gameStatus = "finished";
  }
}
