import { MAIN_MENU_SERVER_URL_DEFAULT } from "#constants.ts";
import * as websocket from "#server/websocket.ts";
import { hasWinner } from "@tic-tac-toe/shared/core";
import {
  DifficultyValues,
  type BoardCells,
  type Difficulty,
  type GameMode,
  type GameStatus,
  type PlayerType,
  type ServerStatistics,
} from "@tic-tac-toe/shared/types";
import { create as mutativeCreate } from "mutative";
import { create } from "zustand";
import { mutative } from "zustand-mutative";
import { devtools } from "zustand/middleware";
import { type AppPage, AppPageValues, type MainMenuTab, MainMenuTabValues, type ServerStatus } from "./types";
import { requireValidType } from "./utils";

type State = {
  activePage: AppPage;
  mainMenu: {
    selectedTab: MainMenuTab;
    soloDifficulty: Difficulty;
  };
  gameSession: null | {
    mode: "solo";
    difficulty: Difficulty;
  };
  serverConnection: {
    url: string;
    status: ServerStatus;
    statistics?: ServerStatistics;
  };
  boardCells: BoardCells;
};

type Actions = {
  navigateTo(page: AppPage): void;

  mainMenu: {
    selectTab(name: string): void;
    setSoloDifficulty: (difficulty: string) => void;
    startSoloGame: () => void;
  };

  serverConnection: {
    setUrl(url: string): void;
    connectToServer(): void;
    connectionEstablished(): void;
    disconnectFromServer(): void;
  };

  setBoardCells(board: BoardCells): void;
};

export const useStateStore = create<State & Actions>()(
  mutative(
    devtools((set) => ({
      activePage: "main-menu",
      navigateToselectTab: (page: string) =>
        set(
          (state) => {
            state.activePage = requireValidType(page, AppPageValues);
          },
          true,
          "mainMenu/selectTab",
        ),

      mainMenu: {
        selectedTab: "solo",
        soloDifficulty: "random",

        selectTab: (name) =>
          set(
            (state) => {
              state.mainMenu.selectedTab = requireValidType(name, MainMenuTabValues);
            },
            true,
            "mainMenu/selectTab",
          ),

        setSoloDifficulty: (difficulty) =>
          set(
            (state) => {
              state.mainMenu.soloDifficulty = requireValidType(difficulty, DifficultyValues);
            },
            true,
            "mainMenu/setSoloDifficulty",
          ),

        startSoloGame: () =>
          set(
            (state) => {
              state.gameSession = {
                mode: "solo",
                difficulty: state.mainMenu.soloDifficulty,
              };
              state.activePage = "solo-game";
            },
            true,
            "mainMenu/startSoloGame",
          ),
      },

      gameSession: null,

      serverConnection: {
        url: MAIN_MENU_SERVER_URL_DEFAULT,
        status: "disconnected",

        setUrl: (url) =>
          set(
            (state) => {
              state.serverConnection.url = url;
              if (state.serverConnection.status === "connected") {
                websocket.disconnect();
              }
            },
            true,
            "serverConnection/setUrl",
          ),

        connectToServer: () =>
          set(
            (state) => {
              state.serverConnection.status = "connecting";
              websocket.connect(state.serverConnection.url);
            },
            true,
            "serverConnection/connectToServer",
          ),

        connectionEstablished: () =>
          set(
            (state) => {
              state.serverConnection.status = "connected";
              state.activePage = "server-lobby";
            },
            true,
            "serverConnection/connectionEstablished",
          ),

        disconnectFromServer: () =>
          set(
            (state) => {
              websocket.disconnect();
              state.serverConnection.status = "disconnected";
              state.activePage = "main-menu";
            },
            true,
            "serverConnection/disconnectFromServer",
          ),

        connectionClosed: () =>
          set(
            (state) => {
              state.serverConnection.status = "disconnected";
              state.serverConnection.statistics = undefined;
              state.activePage = "main-menu";
            },
            true,
            "serverConnection/connectionClosed",
          ),
      },

      boardCells: [" ", " ", " ", " ", " ", " ", " ", " ", " "],
      setBoardCells: (boardCells) =>
        set((state) => {
          state.boardCells = boardCells;
        }),
    })),
  ),
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
  | { type: "start_requested"; gameMode: GameMode; difficulty: Difficulty }
  | { type: "connect_requested"; serverUrl: string }
  | { type: "player_move_requested"; cellIdx: number }
  | { type: "computer_move_requested"; cellIdx: number };

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
