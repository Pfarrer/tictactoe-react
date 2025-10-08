import type { ServerStatistics } from "@tic-tac-toe/shared/types";
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { WebSocket } from "ws";
import { startServerWorker, waitFor } from "../../test/test-utils";

describe("WebSocket Server", () => {
  let serverUrl: string;
  let stopServer: () => void;
  let clients: WebSocket[] = [];

  beforeEach(async () => {
    const server = await startServerWorker();
    stopServer = server.stopServer;
    serverUrl = server.serverUrl;
  });

  afterEach(() => {
    // Clean up any remaining WebSocket connections
    clients.forEach((ws) => {
      if (ws && ws.readyState === WebSocket.OPEN && typeof ws.close === "function") {
        ws.close();
      }
    });
    clients = [];

    stopServer();
  });

  test("should send server statistics message immediately after client connects", async () => {
    return new Promise<void>((done, reject) => {
      const ws = new WebSocket(serverUrl);
      clients.push(ws);

      ws.on("message", (data) => {
        const message = JSON.parse(data.toString());
        expect(message.data).toHaveProperty("connectedPlayersCount", 1);
        expect(message.data).toHaveProperty("activeGamesCount", 0);

        done();
      });

      ws.on("error", reject);
    });
  });

  test("should send statistics update to all clients when a new connection is established", async () => {
    class Client {
      ws: WebSocket;
      statisticsMessages: ServerStatistics[] = [];

      constructor() {
        this.ws = new WebSocket(serverUrl);
        clients.push(this.ws);
        this.registerCallbacks();
      }

      registerCallbacks() {
        this.ws.on("message", (data: string) => {
          const message = JSON.parse(data.toString());
          if (message.name === "statistics") {
            this.statisticsMessages.push(message);
          }
        });
        this.ws.on("error", (e) => {
          throw e;
        });
      }

      async waitUntilReady() {
        await new Promise<void>((resolve) => {
          if (this.ws.readyState === WebSocket.OPEN) {
            resolve();
            return;
          }

          this.ws.once("open", resolve);
        });
        return this;
      }

      close() {
        this.ws.close();
        this.ws = null!;
      }
    }

    const client1 = await new Client().waitUntilReady();
    const client2 = await new Client().waitUntilReady();

    expect(client1.statisticsMessages).toHaveLength(2);
    expect(client2.statisticsMessages).toHaveLength(1);

    const client3 = await new Client().waitUntilReady();

    expect(client1.statisticsMessages).toHaveLength(3);
    expect(client2.statisticsMessages).toHaveLength(2);
    expect(client3.statisticsMessages).toHaveLength(1);

    client1.close();

    await waitFor(() => {
      expect(client2.statisticsMessages).toHaveLength(3);
      expect(client3.statisticsMessages).toHaveLength(2);
    });
  });
});
