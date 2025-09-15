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
    message(_ws, message) {
      console.log('message', message);
    },
    open(ws) {
      console.log('open');
      ws.send('hello');
    },
    close(ws, _code, _message) {
      console.log('close');
      ws.send('bye');
    },
    drain(_ws) {
      console.log('drain');
    },
  },
});
