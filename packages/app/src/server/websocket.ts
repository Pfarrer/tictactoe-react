import { useStateStore } from "#state/state.ts";
import type { ServerMessage } from "@tic-tac-toe/shared/types";

let socket: WebSocket | null = null;

export function connect(serverUrl: string) {
  if (socket) {
    return;
  }
  socket = new WebSocket(serverUrl);
  socket.onopen = onOpenHandler;
  socket.onmessage = onMessageHandler;
}

export function disconnect() {
  if (!socket) {
    return;
  }
  socket.close();
  socket = null;
}

function onOpenHandler() {
  useStateStore.getState().serverConnection.connectionEstablished();
}

function onMessageHandler(ev: MessageEvent) {
  if (!socket) {
    return;
  }

  const serverMessage: ServerMessage = JSON.parse(ev.data);
  if (serverMessage.name === "statistics") {
    useStateStore.setState((state) => {
      state.serverConnection.statistics = serverMessage.data;
    });
  }
}
