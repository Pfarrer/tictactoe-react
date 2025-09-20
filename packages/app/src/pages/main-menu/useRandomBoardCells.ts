import { MAIN_MENU_RANDOM_BOARD_CELLS_REFRESH_MS } from "#constants.ts";
import { useStateStore } from "#state/state.ts";
import { findMoveRandom } from "@tic-tac-toe/shared/algorithms";
import type { BoardCells } from "@tic-tac-toe/shared/types";
import { useEffect } from "react";

export function useRandomBoardCells() {
  const setBoardCells = useStateStore(state => state.setBoardCells);

  useEffect(() => {
    setBoardCells(makeRandomBoardCells());

    const intervalId = setInterval(() => {
      setBoardCells(makeRandomBoardCells());
    }, MAIN_MENU_RANDOM_BOARD_CELLS_REFRESH_MS);

    return () => clearInterval(intervalId);
  }, []);
}

function makeRandomBoardCells(): BoardCells {
  const boardCells = new Array(9).fill(" ") as BoardCells;
  for (let i=0; i<Math.random()*2+1; i++) {
    boardCells[findMoveRandom(boardCells)!] = 'x';
    boardCells[findMoveRandom(boardCells)!] = 'o';
  }
  return boardCells;
}
