import { findMoveMinimax, findMoveRandom } from "@tic-tac-toe/shared/algorithms";
import { useStateStore } from "./state";

export function playNextTurn() {
  const { gameSession, boardCells } = useStateStore.getState();
  if (!gameSession || gameSession.status !== "active" || gameSession.mode !== "solo") {
    console.error("Called playNextTurn without active solo game session!");
    return;
  }

  let move = -1;
  if (gameSession.difficulty === "random") {
    move = findMoveRandom(boardCells) || -1;
  } else if (gameSession.difficulty === "fair") {
    move = findMoveMinimax(boardCells, "computer", 1);
  } else {
    move = findMoveMinimax(boardCells, "computer", -1);
  }

  if (move !== -1) {
    gameSession.requestComputerMove(move);
  }
}
