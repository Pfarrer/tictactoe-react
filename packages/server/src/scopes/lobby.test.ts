import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { TestClient } from "../../test/test-client";
import { startServerWorker, waitFor } from "../../test/test-utils";

describe("Scope lobby", () => {
  let serverUrl: string;
  let stopServer: () => void;
  let clients: TestClient[] = [];

  beforeEach(async () => {
    const server = await startServerWorker();
    stopServer = server.stopServer;
    serverUrl = server.serverUrl;
  });

  afterEach(() => {
    // Clean up any remaining WebSocket connections
    clients.forEach((client) => {
      client.close();
    });
    clients = [];

    stopServer();
  });

  describe("server statistics", () => {
    test("should send server statistics message immediately after client connects", async () => {
      const client = new TestClient(serverUrl);
      clients.push(client);

      const message = await client.waitForNextMessage((msg) => msg.name === "statistics");
      expect(message.data).toHaveProperty("connectedPlayersCount", 1);
      expect(message.data).toHaveProperty("activeGamesCount", 0);
    });

    test("should send statistics update to all clients when a new connection is established", async () => {
      const client1 = await new TestClient(serverUrl).waitUntilReady();
      const client2 = await new TestClient(serverUrl).waitUntilReady();
      clients.push(client1, client2);

      expect(client1.receivedMessages).toHaveLength(2);
      expect(client2.receivedMessages).toHaveLength(1);

      const client3 = await new TestClient(serverUrl).waitUntilReady();
      clients.push(client3);

      expect(client1.receivedMessages).toHaveLength(3);
      expect(client2.receivedMessages).toHaveLength(2);
      expect(client3.receivedMessages).toHaveLength(1);

      client1.close();

      await waitFor(() => {
        expect(client2.receivedMessages).toHaveLength(3);
        expect(client3.receivedMessages).toHaveLength(2);
      });
    });
  });

  describe("readyForNextGame", () => {
    test("should match two ready clients for a game", async () => {
      const client1 = await new TestClient(serverUrl).waitUntilReady();
      clients.push(client1);

      client1.sendMessage({ scope: "lobby", name: "readyForNextGame", data: { isReady: true } });
      const readyStateUpdatedMessage1 = await client1.waitForNextMessage((msg) => msg.name === "readyStateUpdated");
      expect(readyStateUpdatedMessage1.scope).toStartWith("lobby");
      expect(readyStateUpdatedMessage1.data).toEqual({ isReady: true });

      client1.sendMessage({ scope: "lobby", name: "readyForNextGame", data: { isReady: false } });
      const readyStateUpdatedMessage2 = await client1.waitForNextMessage((msg) => msg.name === "readyStateUpdated");
      expect(readyStateUpdatedMessage2.scope).toStartWith("lobby");
      expect(readyStateUpdatedMessage2.data).toEqual({ isReady: false });
    });

    test("should match two ready clients for a game", async () => {
      const [client1, client2] = await TestClient.newAndReady(serverUrl, 2);
      clients.push(client1, client2);

      client1.sendMessage({ scope: "lobby", name: "readyForNextGame", data: { isReady: true } });
      client2.sendMessage({ scope: "lobby", name: "readyForNextGame", data: { isReady: true } });

      const gameJoinedMessage1 = await client1.waitForNextMessage((msg) => msg.name === "gameJoined");
      const gameJoinedMessage2 = await client2.waitForNextMessage((msg) => msg.name === "gameJoined");

      expect(gameJoinedMessage1.scope).toStartWith("g-");
      expect(gameJoinedMessage1.scope).toEqual(gameJoinedMessage2.scope);
    });
  });
});
