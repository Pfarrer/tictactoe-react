import { useStateStore } from "#state/state.ts";
import { serverMessageHandler } from "./receive";

let socket: WebSocket | null = null;

export function connect(serverUrl: string) {
  if (socket) {
    return;
  }
  socket = new WebSocket(serverUrl);
  socket.onopen = onOpenHandler;
  socket.onmessage = serverMessageHandler;
  // TODO onclose
  // TODO onerror
}

export function disconnect() {
  if (!socket) {
    return;
  }
  socket.close();
  socket = null;
}

export function send(raw: string) {
  if (!socket) {
    throw new Error("Not connected");
  }

  socket.send(raw);
}

function onOpenHandler() {
  useStateStore.getState().serverConnection.connectionEstablished();
}
