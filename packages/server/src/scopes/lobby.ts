import type { ServerMessage, ServerStatistics } from "@tic-tac-toe/shared/types";
import type { ServerWebSocket } from "bun";
import { stateStore } from "../state/state";

export function sendServerStatistics(sockets: ServerWebSocket<unknown>[], serverStatistics: ServerStatistics) {
  const serverMessage: ServerMessage = {
    scope: "lobby",
    name: "statistics",
    data: serverStatistics,
  };

  const msg = JSON.stringify(serverMessage);
  sockets.forEach((ws) => ws.send(msg));
}

export function handleReadyForNextGame(ws: ServerWebSocket<unknown>, isReady: boolean) {
  if (isReady) {
    stateStore.getState().lobby.setClientReadyForNewGame(ws);
  } else {
    stateStore.getState().lobby.setClientNotReadyForNewGame(ws);
  }
}

export function sendReadyStateUpdatedMessage(socket: ServerWebSocket<unknown>, isReady: boolean) {
  const serverMessage: ServerMessage = {
    scope: "lobby",
    name: "readyStateUpdated",
    data: {
      isReady,
    },
  };

  socket.send(JSON.stringify(serverMessage));
}
