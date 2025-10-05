import type { GameStatus, PlayerType } from "@tic-tac-toe/shared/types";

export const AppPageValues = ["main-menu", "server-lobby", "solo-game", "hotseat-game"] as const;
export type AppPage = (typeof AppPageValues)[number];

export const MainMenuTabValues = ["solo", "hotseat", "online"] as const;
export type MainMenuTab = (typeof MainMenuTabValues)[number];

export const ServerStatusValues = ["disconnected", "connecting", "connected", "error"] as const;
export type ServerStatus = (typeof ServerStatusValues)[number];

export const GameModeValues = MainMenuTabValues;
export type GameMode = (typeof GameModeValues)[number];

export type HotseatGameSession = {
  mode: "hotseat";
  status: GameStatus;
  nextTurn: PlayerType;
  winner?: "player1" | "player2";
};
