import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { TestManager } from "../../test/test-manager";
import { waitFor } from "../../test/test-utils";

describe("Scope lobby", () => {
  let testManager: TestManager;

  beforeEach(async () => {
    testManager = await TestManager.initialize();
  });

  afterEach(() => {
    testManager.cleanup();
  });

  describe("server statistics", () => {
    test("should send server statistics message immediately after client connects", async () => {
      const client = await testManager.createClient();

      const message = await waitFor(() => client.receivedMessages[0]);
      expect(message?.data).toHaveProperty("connectedPlayersCount", 1);
      expect(message?.data).toHaveProperty("activeGamesCount", 0);
    });

    test("should send statistics update to all clients when a new connection is established", async () => {
      const client1 = await testManager.createClient();
      const client2 = await testManager.createClient();

      expect(client1.receivedMessages).toHaveLength(2);
      expect(client2.receivedMessages).toHaveLength(1);

      const client3 = await testManager.createClient();

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
      const client1 = await testManager.createClient();

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
      const [client1, client2] = await testManager.createClients(2);

      client1.sendMessage({ scope: "lobby", name: "readyForNextGame", data: { isReady: true } });
      client2.sendMessage({ scope: "lobby", name: "readyForNextGame", data: { isReady: true } });

      const gameJoinedMessage1 = await client1.waitForNextMessage((msg) => msg.name === "gameJoined");
      const gameJoinedMessage2 = await client2.waitForNextMessage((msg) => msg.name === "gameJoined");

      expect(gameJoinedMessage1.scope).toStartWith("g-");
      expect(gameJoinedMessage1.scope).toEqual(gameJoinedMessage2.scope);
    });
  });
});
