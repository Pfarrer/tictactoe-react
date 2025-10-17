import { useStateStore } from "#state/state.ts";
import type { PlayerType, ServerMessage } from "@tic-tac-toe/shared/types";

export function serverMessageHandler(ev: MessageEvent) {
  const serverMessage: ServerMessage = JSON.parse(ev.data);
  if (serverMessage.name === "statistics") {
    useStateStore.setState((state) => {
      state.serverLobby.statistics = serverMessage.data;
    });
  } else if (serverMessage.name === "readyStateUpdated") {
    useStateStore.setState((state) => {
      state.serverLobby.isReady = serverMessage.data.isReady;
    });
  } else if (serverMessage.name === "gameJoined") {
    useStateStore.getState().serverLobby.startOnlineGame(serverMessage.scope, serverMessage.data.firstMove);
  } else if (serverMessage.name === "movePlayed") {
    const gameSession = useStateStore.getState().gameSession;
    if (gameSession?.mode == "online" && gameSession?.gameId === serverMessage.scope) {
      gameSession.movePlayed(serverMessage.data.isYourMove, serverMessage.data.cellIdx);
    }
  } else if (serverMessage.name === "gameOver") {
    const gameSession = useStateStore.getState().gameSession;
    if (gameSession?.mode == "online" && gameSession?.gameId === serverMessage.scope) {
      const winner: PlayerType | undefined =
        serverMessage.data.result === "youWon"
          ? "human"
          : serverMessage.data.result === "youLost"
            ? "computer"
            : undefined;
      gameSession.receivedGameOver(winner);
    }
  } else {
    console.warn("Unexpected serverMessage:", serverMessage);
  }
}
