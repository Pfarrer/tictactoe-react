import { create } from "mutative";
import { hasWinner } from "./hasWinner";

export type GameMode = "Human-vs-Computer";

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
  gameMode: GameMode;
  gameStatus: "pristine" | "active" | "finished";
  nextTurn: "human" | "computer";
  winner?: "human" | "computer";
}

export const initState = () => ({
  board: [" ", " ", " ", " ", " ", " ", " ", " ", " "],
  gameMode: "Human-vs-Computer",
  gameStatus: "pristine",
  nextTurn: "human",
} as GameState);

export type GameAction =
  | { type: "reset_requested" }
  | { type: "start_requested"; gameMode: GameMode }
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
    case "start_requested":
      draft.gameMode = action.gameMode;
      draft.gameStatus = "active";
      break;
    case "reset_requested":
      return initState();
    default:
      console.error("Action not implemented", action);
  }

  updateGameStatus(draft);
  return finalize();
}

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
