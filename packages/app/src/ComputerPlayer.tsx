import { useContext } from "react";
import { GameStateContext, GameStateDispatchContext } from "./GameStateConext";
import { findMoveMinimax, findMoveRandom } from "@tic-tac-toe/shared/algorithms";

export function ComputerPlayer() {
  const gameState = useContext(GameStateContext);
  const dispatch = useContext(GameStateDispatchContext);

  if (gameState.gameStatus !== "finished" && gameState.nextTurn === "computer") {
    let move = -1;

    if (gameState.difficulty === "Luck") {
      move = findMoveRandom(gameState.board) || -1;
    } else if (gameState.difficulty === "Simple") {
      move = findMoveMinimax(gameState.board, "computer", 1);
    } else {
      move = findMoveMinimax(gameState.board, "computer", -1);
    }

    if (move !== -1) {
      dispatch({ type: "computer_move_requested", cellIdx: move });
    }
  }

  return "";
}
