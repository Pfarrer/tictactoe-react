import { stateStore } from "./state/state";
import { startServer } from "./webSocketServer";

const port = Bun.env.SERVER_PORT ? Number(Bun.env.SERVER_PORT) : 4680;
startServer(port);
console.log(`Server started on port ${port}`);

setInterval(() => {
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  process.stdout.write(`${stateStore.getState().clients.length} client(s) connected ...`);
}, 1000);
