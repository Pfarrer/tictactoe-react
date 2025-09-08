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
  naxtTurn: "human" | "computer";
  winner?: "human" | "computer";
}

// export interface GameAction {
//   type: GameActionKind;
//   payload: any;
// }
export type GameAction =
  | { type: "reset" }
  | { type: "playerMoved"; cellIdx: number }
  | { type: "computerMoved"; cellIdx: number };

export function reducer(state: GameState, action: GameAction): GameState {
  console.log(action);
  return state;
}

export const initState: GameState = {
  board: [" ", " ", " ", " ", " ", " ", " ", " ", " "],
  gameStatus: "pristine",
  naxtTurn: "human",
};
