import { stateStore } from "./state";

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
      message(_ws, message) {
        console.log("message received", message);
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
