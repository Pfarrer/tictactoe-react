import type { GameId, ServerMessage } from "@tic-tac-toe/shared/types";
import type { ServerWebSocket } from "bun";
import { handleRequestMove } from "./scopes/game";
import { handleReadyForNextGame } from "./scopes/lobby";
import { stateStore } from "./state/state";
import { validateMessageWithErrorId, type ValidatedClientMessage } from "./validation/messageSchemas";

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
          const parsedMessage = JSON.parse(message.toString());

          // Validate with Zod while preserving message ID
          const validation = validateMessageWithErrorId(parsedMessage);

          if (!validation.isValid) {
            sendRejection(ws, validation.messageId, validation.error || "Invalid message format");
            return;
          }

          // Now we know it's valid, so we can safely cast it
          const clientMessage = parsedMessage as ValidatedClientMessage;

          // Type-safe message handling
          switch (clientMessage.name) {
            case "readyForNextGame":
              handleReadyForNextGame(ws, clientMessage.data.isReady);
              break;
            case "requestMove":
              handleRequestMove(ws, clientMessage.scope as GameId, clientMessage.data.cellIdx, clientMessage.id);
              break;
          }
        } catch (error) {
          // Handle different error types
          if (error instanceof SyntaxError) {
            sendRejection(ws, "unknown", "Invalid JSON: message must be valid JSON");
          } else if (error instanceof Error) {
            sendRejection(ws, "unknown", `Error processing message: ${error.message}`);
          } else {
            sendRejection(ws, "unknown", "Error processing message");
          }
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
