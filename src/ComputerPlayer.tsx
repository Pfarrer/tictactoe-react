import { useContext, useEffect } from "react";
import { GameStateContext, GameStateDispatchContext } from "./GameStateConext";

export function ComputerPlayer() {
    const gameState = useContext(GameStateContext);
    const dispatch = useContext(GameStateDispatchContext);

    if (gameState.gameStatus !== "finished" && gameState.nextTurn === "computer") {
        for (var i=0;i<1000;i++) {
            const idx = Math.round(Math.random() * 8);
            if (gameState.board[idx] === " ") {
                dispatch({ type: "computerMoved", cellIdx: idx });
                break;
            }
        }
    }
    
    return <></>;
}