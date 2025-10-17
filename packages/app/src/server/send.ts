import type { ClientMessage, GameId } from "@tic-tac-toe/shared/types";
import { send } from "./websocket";

export function sendReadyForNextGame(isReady: boolean): string {
  return sendMessage({
    scope: "lobby",
    name: "readyForNextGame",
    data: {
      isReady,
    },
  });
}

export function sendRequestMove(gameId: GameId, cellIdx: number): string {
  return sendMessage({
    scope: gameId,
    name: "requestMove",
    data: {
      cellIdx,
    },
  });
}

function sendMessage(message: Omit<ClientMessage, "id">): string {
  const id = `m-${Math.random().toString(36).substring(2, 9)}`;
  const msg = JSON.stringify({
    ...message,
    id,
  });

  send(msg);

  return id;
}
