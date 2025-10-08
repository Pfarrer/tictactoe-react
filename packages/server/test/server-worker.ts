import { startServer } from "../src/webSocketServer";

// declare var self: Worker;

const { stopServer, port } = startServer();
process.on("exit", stopServer);

postMessage(port);
