export interface ServerStatus {
  connectedPlayersCount: number;
  activeGamesCount: number;
}

export type GameMode = "Human-vs-Computer";
export type GameStatus = "pristine" | "active" | "finished";

export type BoardCellValue = " " | "x" | "o";
export type Board = BoardCellValue[] & { length: 9 };

export type Difficulty = "Luck" | "Simple" | "Hard";

export interface GameState {
  board: Board;
  difficulty: Difficulty;
  gameMode: GameMode;
  gameStatus: GameStatus;
  nextTurn: "human" | "computer";
  winner?: "human" | "computer";
}

export type GameAction =
  | { type: "reset_requested" }
  | { type: "start_requested"; gameMode: GameMode, difficulty: Difficulty }
  | { type: "connect_requested"; serverUrl: string }
  | { type: "player_move_requested"; cellIdx: number }
  | { type: "computer_move_requested"; cellIdx: number };
