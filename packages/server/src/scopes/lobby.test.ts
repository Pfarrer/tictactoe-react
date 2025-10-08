import type { ServerMessage, ServerStatistics } from "@tic-tac-toe/shared/types";
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { WebSocket } from "ws";
import { startServerWorker, waitFor } from "../../test/test-utils";

describe("Scope lobby", () => {
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

  describe("server statistics", () => {
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

  describe("readyForNextGame", () => {
    test("should match two ready clients for a game", async () => {
      class Client {
        ws: WebSocket;

        constructor() {
          this.ws = new WebSocket(serverUrl);
          clients.push(this.ws);
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

        sendReadyForNextGame(isReady: boolean) {
          const message = {
            scope: "lobby",
            name: "readyForNextGame",
            data: { isReady },
          };
          this.ws.send(JSON.stringify(message));
        }

        async waitForNextMessage(filter: (message: ServerMessage) => boolean): Promise<ServerMessage> {
          return new Promise((resolve, reject) => {
            const messageHandler = (data: string) => {
              try {
                const message = JSON.parse(data.toString()) as ServerMessage;
                if (filter(message)) {
                  this.ws.off("message", messageHandler);
                  resolve(message);
                }
              } catch (error) {
                this.ws.off("message", messageHandler);
                reject(error);
              }
            };

            this.ws.on("message", messageHandler);
            this.ws.on("error", reject);
          });
        }

        close() {
          this.ws.close();
          this.ws = null!;
        }
      }

      const client1 = await new Client().waitUntilReady();
      const client2 = await new Client().waitUntilReady();

      client1.sendReadyForNextGame(true);
      client2.sendReadyForNextGame(true);

      const gameJoinedMessage1 = await client1.waitForNextMessage((msg) => msg.name === "gameJoined");
      const gameJoinedMessage2 = await client2.waitForNextMessage((msg) => msg.name === "gameJoined");

      expect(gameJoinedMessage1.scope).toStartWith("g-");
      expect(gameJoinedMessage1.scope).toEqual(gameJoinedMessage2.scope);
    });
  });
});
