import { MAIN_MENU_SERVER_URL_DEFAULT, SOLO_GAME_COMPUTER_MOVE_DELAY_MS } from "#constants.ts";
import * as websocket from "#server/websocket.ts";
import {
  type BoardCells,
  type Difficulty,
  DifficultyValues,
  type GameStatus,
  type PlayerType,
  type ServerStatistics,
} from "@tic-tac-toe/shared/types";
import { create } from "zustand";
import { mutative } from "zustand-mutative";
import { devtools } from "zustand/middleware";
import { playNextTurn } from "./computerPlayer";
import { type AppPage, AppPageValues, type MainMenuTab, MainMenuTabValues, type ServerStatus } from "./types";
import { requireValidType } from "./utils";

function findWinningCell(board: BoardCells): undefined | "x" | "o" {
  // Check horizontally
  for (let row = 0; row < 3; row++) {
    const offset = 3 * row;
    const cell = board[offset + 0];
    if (cell !== " " && cell === board[offset + 1] && cell === board[offset + 2]) {
      return cell as "x" | "o";
    }
  }

  // Check vertically
  for (let column = 0; column < 3; column++) {
    const cell = board[0 + column];
    if (cell !== " " && cell === board[3 + column] && cell === board[6 + column]) {
      return cell as "x" | "o";
    }
  }

  // Check diagonally "/"
  const diag1Cell = board[2];
  if (diag1Cell !== " " && diag1Cell === board[4] && board[4] === board[6]) {
    return diag1Cell as "x" | "o";
  }

  // Check diagonally "\"
  const diag2Cell = board[0];
  if (diag2Cell !== " " && diag2Cell === board[4] && board[4] === board[8]) {
    return diag2Cell as "x" | "o";
  }

  return undefined;
}

type State = {
  activePage: AppPage;
  mainMenu: {
    selectedTab: MainMenuTab;
    soloDifficulty: Difficulty;
  };
  gameSession:
    | null
    | {
        mode: "solo";
        status: GameStatus;
        difficulty: Difficulty;
        nextTurn: PlayerType;
        winner?: PlayerType;
      }
    | {
        mode: "hotseat";
        status: GameStatus;
        nextTurn: PlayerType;
        winner?: PlayerType;
      };
  serverConnection: {
    url: string;
    status: ServerStatus;
    statistics?: ServerStatistics;
  };
  boardCells: BoardCells;
};

type Actions = {
  navigateToPage(page: AppPage): void;

  mainMenu: {
    selectTab(name: string): void;
    setSoloDifficulty: (difficulty: string) => void;
    startSoloGame: () => void;
    startHotseatGame: () => void;
  };

  gameSession:
    | null
    | {
        mode: "solo";
        requestPlayerMove: (cellIdx: number) => void;
        requestComputerMove: (cellIdx: number) => void;
      }
    | {
        mode: "hotseat";
        requestHotseatMove: (cellIdx: number) => void;
      };

  serverConnection: {
    setUrl(url: string): void;
    connectToServer(): void;
    connectionEstablished(): void;
    disconnectFromServer(): void;
  };

  setBoardCells(board: BoardCells): void;
};

type StateSetFn = (updater: (draft: State & Actions) => void, replace?: boolean, name?: string) => void;

export const useStateStore = create<State & Actions>()(
  mutative(
    devtools((set) => ({
      activePage: "main-menu",
      navigateToPage: (page: string) =>
        set(
          (state) => {
            state.activePage = requireValidType(page, AppPageValues);
            if (state.gameSession) {
              state.gameSession = null;
            }
          },
          true,
          "navigateToPage",
        ),

      mainMenu: {
        selectedTab: "solo",
        soloDifficulty: "fair",

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
                status: "pristine",
                difficulty: state.mainMenu.soloDifficulty,
                nextTurn: "human",

                requestPlayerMove: requestPlayerMove(set, "gameSession/requestPlayerMove"),
                requestComputerMove: requestComputerMove(set, "gameSession/requestComputerMove"),
              };
              state.boardCells = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
              state.activePage = "solo-game";
            },
            true,
            "mainMenu/startSoloGame",
          ),

        startHotseatGame: () =>
          set(
            (state) => {
              state.gameSession = {
                mode: "hotseat",
                status: "pristine",
                nextTurn: "player1",

                requestHotseatMove: requestHotseatMove(set, "gameSession/requestHotseatMove"),
              };
              state.boardCells = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
              state.activePage = "hotseat-game";
            },
            true,
            "mainMenu/startHotseatGame",
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

const requestComputerMove = (set: StateSetFn, actionName: string) => (cellIdx: number) =>
  set(
    (state) => {
      const gameSession = state.gameSession;
      if (!gameSession) return;
      if (gameSession.status !== "pristine" && gameSession.status !== "active") return;
      if (gameSession.nextTurn !== "computer") return;
      if (state.boardCells[cellIdx] !== " ") return;

      gameSession.status = "active";
      state.boardCells[cellIdx] = "o";
      gameSession.nextTurn = "human";

      checkAndUpdateIfGameIsFinished(state);
    },
    true,
    actionName,
  );

const requestPlayerMove = (set: StateSetFn, actionName: string) => (cellIdx: number) =>
  set(
    (state) => {
      const gameSession = state.gameSession;
      if (!gameSession) return;
      if (gameSession.status !== "pristine" && gameSession.status !== "active") return;
      if (gameSession.nextTurn !== "human") return;
      if (state.boardCells[cellIdx] !== " ") return;

      gameSession.status = "active";
      state.boardCells[cellIdx] = "x";
      gameSession.nextTurn = "computer";

      if (!checkAndUpdateIfGameIsFinished(state)) {
        setTimeout(playNextTurn, SOLO_GAME_COMPUTER_MOVE_DELAY_MS);
      }
    },
    true,
    actionName,
  );

const requestHotseatMove = (set: StateSetFn, actionName: string) => (cellIdx: number) =>
  set(
    (state) => {
      const gameSession = state.gameSession;
      if (!gameSession) return;
      if (gameSession.mode !== "hotseat") return;
      if (gameSession.status !== "pristine" && gameSession.status !== "active") return;
      if (state.boardCells[cellIdx] !== " ") return;

      gameSession.status = "active";
      const playerSymbol = gameSession.nextTurn === "player1" ? "x" : "o";
      state.boardCells[cellIdx] = playerSymbol;
      gameSession.nextTurn = gameSession.nextTurn === "player1" ? "player2" : "player1";

      checkAndUpdateIfGameIsFinished(state);
    },
    true,
    actionName,
  );

function checkAndUpdateIfGameIsFinished(state: State): boolean {
  const gameSession = state.gameSession;
  if (gameSession?.status !== "active") {
    return false;
  }

  const winningCell = findWinningCell(state.boardCells);
  if (winningCell !== undefined) {
    if (gameSession.mode === "hotseat") {
      // For hotseat games, convert board cell to player type
      gameSession.winner = winningCell === "x" ? "player1" : "player2";
    } else {
      // For solo games, use the original logic
      gameSession.winner = winningCell === "x" ? "human" : ("computer" as PlayerType);
    }
    gameSession.status = "finished";
  } else {
    const hasEmptyCell = state.boardCells.find((cell) => cell === " ") !== undefined;
    if (!hasEmptyCell) {
      gameSession.status = "finished";
    }
  }

  return gameSession.status === "finished";
}
