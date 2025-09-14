import { useContext } from "react";
import { GameStateContext, GameStateDispatchContext } from "./GameStateConext";

export function ComputerPlayer() {
    const gameState = useContext(GameStateContext);
    const dispatch = useContext(GameStateDispatchContext);

    if (gameState.gameStatus !== "finished" && gameState.nextTurn === "computer") {
        for (let i=0;i<1000;i++) {
            const idx = Math.round(Math.random() * 8);
            if (gameState.board[idx] === " ") {
                dispatch({ type: "computer_move_requested", cellIdx: idx });
                break;
            }
        }
    }
    
    return <></>;
}