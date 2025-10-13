import type { ClientMessage, ServerMessage } from "@tic-tac-toe/shared/types";
import type { ServerWebSocket } from "bun";
import { handleRequestMove } from "./scopes/game";
import { handleReadyForNextGame } from "./scopes/lobby";
import { stateStore } from "./state/state";

export function sendRejection(ws: ServerWebSocket<unknown>, messageId: string, reason: string) {
  const rejectionMessage: ServerMessage = {
    scope: "server",
    name: "messageRejected",
    data: {
      messageId,
      reason,
    },
  };
  ws.send(JSON.stringify(rejectionMessage));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateClientMessage(message: any): message is ClientMessage {
  return (
    message &&
    typeof message.id === "string" &&
    message.id.length > 0 &&
    typeof message.scope === "string" &&
    typeof message.name === "string" &&
    message.data !== undefined
  );
}

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
          const clientMessage = JSON.parse(message.toString());

          if (!validateClientMessage(clientMessage)) {
            sendRejection(
              ws,
              clientMessage?.id || "unknown",
              "Invalid message format: missing required fields (id, scope, name, data)",
            );
            return;
          }

          switch (clientMessage.name) {
            case "readyForNextGame":
              if (clientMessage.scope !== "lobby") {
                sendRejection(ws, clientMessage.id, "Invalid scope: readyForNextGame requires scope 'lobby'");
                return;
              }
              if (typeof clientMessage.data?.isReady !== "boolean") {
                sendRejection(ws, clientMessage.id, "Invalid data: readyForNextGame requires boolean isReady field");
                return;
              }
              handleReadyForNextGame(ws, clientMessage.data.isReady);
              break;
            case "requestMove":
              if (typeof clientMessage.scope !== "string" || !clientMessage.scope.startsWith("g-")) {
                sendRejection(
                  ws,
                  clientMessage.id,
                  "Invalid scope: requestMove requires valid game ID (starts with 'g-')",
                );
                return;
              }
              if (
                typeof clientMessage.data?.cellIdx !== "number" ||
                clientMessage.data.cellIdx < 0 ||
                clientMessage.data.cellIdx > 8
              ) {
                sendRejection(ws, clientMessage.id, "Invalid data: requestMove requires cellIdx between 0 and 8");
                return;
              }
              handleRequestMove(ws, clientMessage.scope, clientMessage.data.cellIdx, clientMessage.id);
              break;
            default:
              /* eslint-disable @typescript-eslint/no-explicit-any */
              sendRejection(
                ws,
                (clientMessage as any).id,
                `Unknown message type: ${(clientMessage as any).name}: ${clientMessage}`,
              );
          }
        } catch (error) {
          // Expected for invalid JSON tests - handle gracefully without console.error
          sendRejection(ws, "unknown", "Invalid JSON: message must be valid JSON");
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
