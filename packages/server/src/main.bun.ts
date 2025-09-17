import type { ServerStatus } from "@tic-tac-toe/shared/state";
import type { ServerWebSocket } from "bun";

const connectedPlayers: ServerWebSocket<unknown>[] = [];

Bun.serve({
  port: 8080,

  fetch(req, server) {
    // Upgrade the request to a WebSocket
    if (server.upgrade(req)) {
      return;
    }
    return new Response("Upgrade Required", { status: 426 });
  },

  websocket: {
    message(_ws, message) {
      console.log("message", message);
    },
    open(ws) {
      const serverStatus: ServerStatus = {
        connectedPlayersCount: connectedPlayers.length,
        activeGamesCount: 0,
      };
      connectedPlayers.push(ws);

      ws.send(JSON.stringify(serverStatus));
    },
    close(ws, _code, _message) {
      const idx = connectedPlayers.indexOf(ws);
      if (idx !== -1) connectedPlayers.splice(idx, 1);
    },
    drain(_ws) {},
  },
});
