import type { ClientMessage } from "@tic-tac-toe/shared/types";
import { handleReadyForNextGame } from "./scopes/lobby";
import { stateStore } from "./state/state";

export function startServer(port: number = 0) {
  const server = Bun.serve({
    hostname: "localhost",
    port,

    fetch(req, server) {
      // Upgrade the request to a WebSocket
      if (server.upgrade(req)) {
        return;
      }
      return new Response("Upgrade Required", { status: 426 });
    },

    websocket: {
      message(ws, message) {
        try {
          const clientMessage: ClientMessage = JSON.parse(message.toString());

          switch (clientMessage.name) {
            case "readyForNextGame":
              handleReadyForNextGame(ws, clientMessage.data.isReady);
              break;
            default:
              console.warn("Unknown message type:", clientMessage);
          }
        } catch (error) {
          console.error("Failed to parse message:", error);
        }
      },
      open(ws) {
        stateStore.getState().clientConnected(ws);
      },
      close(ws, _code, _message) {
        stateStore.getState().clientDisconnected(ws);
      },
      drain(_ws) {},
    },
  });

  return {
    stopServer: () => server.stop(),
    port: server.port,
  };
}
