Bun.serve({
  port: 8080,

  fetch(req, server) {
    // Upgrade the request to a WebSocket
    if (server.upgrade(req)) {
      return;
    }
    return new Response('Upgrade Required', { status: 426 });
  },
  
  websocket: {
    message(ws, message) {
      console.log('message', message);
    },
    open(ws) {
      console.log('open');
      ws.send('hello');
    },
    close(ws, code, message) {
      console.log('close');
      ws.send('bye');
    },
    drain(ws) {
      console.log('drain');
    },
  },
});
