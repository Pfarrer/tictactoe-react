import { create } from "mutative";
import { hasWinner } from "./hasWinner";
import type { GameAction, GameState } from "@tic-tac-toe/shared/state";

export const initState: () => GameState = () => ({
  board: [" ", " ", " ", " ", " ", " ", " ", " ", " "],
  difficulty: "Luck",
  gameMode: "Human-vs-Computer",
  gameStatus: "pristine",
  nextTurn: "human",
});

export function reducer(state: GameState, action: GameAction): GameState {
  const [draft, finalize] = create(state);
  
  switch (action.type) {
    case "player_move_requested":
      if (draft.gameStatus === "active" && draft.nextTurn === "human" && draft.board[action.cellIdx] === " ") {
        draft.board[action.cellIdx] = "x";
        draft.nextTurn = "computer";
      }
      break;
    case "computer_move_requested":
      if (draft.gameStatus === "active" && draft.nextTurn === "computer" && draft.board[action.cellIdx] === " ") {
        draft.board[action.cellIdx] = "o";
        draft.nextTurn = "human";
      }
      break;
    case "start_requested":
      draft.gameMode = action.gameMode;
      draft.difficulty = action.difficulty;
      draft.gameStatus = "active";
      break;
    // case "connect_requested":
    //   break;
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
  } else {
    const hasEmptyCell = draft.board.find(cell => cell === " ") !== undefined;
    if (!hasEmptyCell) {
      delete draft.winner;
      draft.gameStatus = "finished";
    }
  }
}
