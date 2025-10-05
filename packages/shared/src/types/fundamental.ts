export type PlayerType = "human" | "computer" | "player1" | "player2";
export type GameMode = "Human-vs-Computer";
export type GameStatus = "pristine" | "active" | "finished";

export type BoardCell = " " | "x" | "o";
export type BoardCells = BoardCell[] & { length: 9 };

export const DifficultyValues = ["random", "fair", "hard"] as const;
export type Difficulty = (typeof DifficultyValues)[number];
