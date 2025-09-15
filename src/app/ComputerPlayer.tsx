import { useContext } from "react";
import { GameStateContext, GameStateDispatchContext } from "./GameStateConext";
import { findBestMove } from "./core/minimax";
import type { Board } from "./core/state";

export function ComputerPlayer() {
    const gameState = useContext(GameStateContext);
    const dispatch = useContext(GameStateDispatchContext);

    if (gameState.gameStatus !== "finished" && gameState.nextTurn === "computer") {
        let move = -1;

        if (gameState.difficulty === "Luck") {
            move = findRandomMove(gameState.board) || -1;
        } else if (gameState.difficulty === "Simple") {
            move = findBestMove(gameState.board, 1);
        } else {
            move = findBestMove(gameState.board, -1);
        }

        if (move !== -1) {
            dispatch({ type: "computer_move_requested", cellIdx: move });
        }
    }
    
    return <></>;
}

function findRandomMove(board: Board): number | null {
    for (let i=0;i<1000;i++) {
        const idx = Math.round(Math.random() * 8);
        if (board[idx] === " ") {
            return idx;
        }
    }
    return null;
}