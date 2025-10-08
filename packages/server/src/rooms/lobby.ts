import type { ServerMessage, ServerStatistics } from "@tic-tac-toe/shared/types";
import type { ServerWebSocket } from "bun";

export function sendServerStatistics(sockets: ServerWebSocket<unknown>[], serverStatistics: ServerStatistics) {
  const serverMessage: ServerMessage = {
    name: "statistics",
    data: serverStatistics,
  };

  const msg = JSON.stringify(serverMessage);
  sockets.forEach((ws) => ws.send(msg));
}
