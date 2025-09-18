export type PlayerType = "human" | "computer";
export type GameMode = "Human-vs-Computer";
export type GameStatus = "pristine" | "active" | "finished";

export type BoardCell = " " | "x" | "o";
export type BoardCells = BoardCell[] & { length: 9 };

export type Difficulty = "Luck" | "Simple" | "Hard";
