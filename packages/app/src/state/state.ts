import { hasWinner } from "@tic-tac-toe/shared/core";
import type { BoardCells, Difficulty, GameMode, GameStatus, PlayerType } from "@tic-tac-toe/shared/types";
import { create } from "zustand";
import { mutative } from "zustand-mutative";
import { create as mutativeCreate } from "mutative";
import { type MainMenuTab, type AppPage, MainMenuTabValues, AppPageValues } from "./types";
import { requireValidType } from "./utils";

type State = {
  activePage: AppPage;
  boardCells: BoardCells;
  mainMenu: {
    selectedTab: MainMenuTab,
  },
};

type Actions = {
  setBoardCells(board: BoardCells): void;

  mainMenu: {
    selectTab(name: string): void;
  }
};

export const useStateStore = create<State & Actions>()(
  mutative((set) => ({
    activePage: AppPageValues[0],

    mainMenu: {
      selectedTab: MainMenuTabValues[0],

      selectTab: (name) => set((state) => {
          state.mainMenu.selectedTab = requireValidType(name, MainMenuTabValues);
      }),
    },

    boardCells: [" ", " ", " ", " ", " ", " ", " ", " ", " "],
    setBoardCells: (boardCells) => set((state) => {
      state.boardCells = boardCells;
    }),
  }))
);


///////////////
// Old State
///////////////


export interface GameState {
  board: BoardCells;
  difficulty: Difficulty;
  gameMode: GameMode;
  gameStatus: GameStatus;
  nextTurn: PlayerType;
  winner?: PlayerType;
}

export type GameAction =
  | { type: "reset_requested" }
  | { type: "start_requested"; gameMode: GameMode; difficulty: Difficulty }
  | { type: "connect_requested"; serverUrl: string }
  | { type: "player_move_requested"; cellIdx: number }
  | { type: "computer_move_requested"; cellIdx: number };

export const initState: () => GameState = () => ({
  board: [" ", " ", " ", " ", " ", " ", " ", " ", " "],
  difficulty: "Luck",
  gameMode: "Human-vs-Computer",
  gameStatus: "pristine",
  nextTurn: "human",
});

export function reducer(state: GameState, action: GameAction): GameState {
  const [draft, finalize] = mutativeCreate(state);

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
    const hasEmptyCell = draft.board.find((cell) => cell === " ") !== undefined;
    if (!hasEmptyCell) {
      delete draft.winner;
      draft.gameStatus = "finished";
    }
  }
}
