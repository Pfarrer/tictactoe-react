import type { ServerMessage, ServerStatistics } from "@tic-tac-toe/shared/types";
import type { ServerWebSocket } from "bun";
import { stateStore } from "../state";

export function sendServerStatistics(sockets: ServerWebSocket<unknown>[], serverStatistics: ServerStatistics) {
  const serverMessage: ServerMessage = {
    name: "statistics",
    data: serverStatistics,
  };

  const msg = JSON.stringify(serverMessage);
  sockets.forEach((ws) => ws.send(msg));
}

export function handleReadyForNextGame(ws: ServerWebSocket<unknown>, isReady: boolean) {
  console.log(`Client ${ws.remoteAddress} ready for next game: ${isReady}`);

  if (isReady) {
    stateStore.getState().lobby.setClientReadyForNewGame(ws);
  } else {
    stateStore.getState().lobby.setClientNotReadyForNewGame(ws);
    console.log(`Client ${ws.remoteAddress} is not ready for a new game`);
  }
}
