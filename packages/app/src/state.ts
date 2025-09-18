import type { GameState } from "@tic-tac-toe/shared/state";
import { create } from "zustand";
import { mutative } from "zustand-mutative";

type Actions = {
  playerMoveRequested: (cellIdx: number) => void;
};

export const useStore = create<GameState & Actions>()(
  mutative((set) => ({
    ...initState(),

    playerMoveRequested: (cellIdx: number) =>
      set((state) => {
        if (state.gameStatus === "active" && state.nextTurn === "human" && state.board[cellIdx] === " ") {
          state.board[cellIdx] = "x";
          state.nextTurn = "computer";
        }
      }),
  })),
);

const initState: () => GameState = () => ({
  board: [" ", " ", " ", " ", " ", " ", " ", " ", " "],
  difficulty: "Luck",
  gameMode: "Human-vs-Computer",
  gameStatus: "pristine",
  nextTurn: "human",
});
