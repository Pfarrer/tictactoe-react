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

  const victoriousCellValue = findVictoriousCellValue(draft.board);
  if (victoriousCellValue !== undefined) {
    draft.winner = victoriousCellValue === "x" ? "human" : "computer";
    draft.gameStatus = "finished";
  }
}

function findVictoriousCellValue(b: GameState["board"]): undefined | BoardCellValue {
  // Check horizontally
  for (let row = 0; row < 3; row++) {
    if (b[row + 0] !== " " && b[row + 0] == b[row + 1] && b[row + 1] == b[row + 2]) {
      return b[row + 0];
    }
  }

  // Check vertically
  for (let column = 0; column < 3; column++) {
    if (b[0 + column] !== " " && b[0 + column] == b[3 + column] && b[3 + column] == b[6 + column]) {
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