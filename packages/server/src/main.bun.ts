import type { ServerMessage, ServerStatistics } from "@tic-tac-toe/shared/types";
import type { ServerWebSocket } from "bun";

const connectedPlayers: ServerWebSocket<unknown>[] = [];

Bun.serve({
  port: 4680,

  fetch(req, server) {
    // Upgrade the request to a WebSocket
    if (server.upgrade(req)) {
      return;
    }
    return new Response("Upgrade Required", { status: 426 });
  },

  websocket: {
    message(_ws, message) {
      console.log("message received", message);
    },
    open(ws) {
      connectedPlayers.push(ws);
      publishServerStatistics();
    },
    close(ws, _code, _message) {
      const idx = connectedPlayers.indexOf(ws);
      if (idx !== -1) connectedPlayers.splice(idx, 1);
      publishServerStatistics();
    },
    drain(_ws) {},
  },
});

function publishServerStatistics() {
  const serverStatistics: ServerStatistics = {
    connectedPlayersCount: connectedPlayers.length,
    activeGamesCount: 0,
  };
  const serverMessage: ServerMessage = {
    name: "statistics",
    data: serverStatistics,
  };

  const msg = JSON.stringify(serverMessage);
  connectedPlayers.forEach((ws) => ws.send(msg));
}
