import { describe, expect, test } from "bun:test";
import { TestManager } from "../../test/test-manager";
import { waitUntil } from "../../test/test-utils";

describe("Lobby scope", async () => {
  const testManager: TestManager = await TestManager.registerTestHooks();

  describe("server statistics", () => {
    test("should send server statistics message immediately after client connects", async () => {
      const client = await testManager.createClient();

      const message = await client.waitForMessage((msg) => msg.name === "statistics");
      expect(message.data).toHaveProperty("connectedPlayersCount", 1);
      expect(message.data).toHaveProperty("activeGamesCount", 0);
    });

    test("should send statistics update to all clients when a new connection is established", async () => {
      const client1 = await testManager.createClient();
      const client2 = await testManager.createClient();

      await waitUntil(() => {
        expect(client1.receivedMessages).toHaveLength(2);
        expect(client2.receivedMessages).toHaveLength(1);
      });

      const client3 = await testManager.createClient();

      await waitUntil(() => {
        expect(client1.receivedMessages).toHaveLength(3);
        expect(client2.receivedMessages).toHaveLength(2);
        expect(client3.receivedMessages).toHaveLength(1);
      });

      client1.close();

      await waitUntil(() => {
        expect(client2.receivedMessages).toHaveLength(3);
        expect(client3.receivedMessages).toHaveLength(2);
      });
    });
  });

  describe("readyForNextGame", () => {
    test("should send readyStateUpdated server messages to the client", async () => {
      const client1 = await testManager.createClient();

      client1.sendMessage({ id: "msg-ready-1", scope: "lobby", name: "readyForNextGame", data: { isReady: true } });
      const readyStateUpdatedMessage1 = await client1.waitForNextMessage((msg) => msg.name === "readyStateUpdated");
      expect(readyStateUpdatedMessage1.scope).toStartWith("lobby");
      expect(readyStateUpdatedMessage1.data).toEqual({ isReady: true });

      client1.sendMessage({ id: "msg-ready-2", scope: "lobby", name: "readyForNextGame", data: { isReady: false } });
      const readyStateUpdatedMessage2 = await client1.waitForNextMessage((msg) => msg.name === "readyStateUpdated");
      expect(readyStateUpdatedMessage2.scope).toStartWith("lobby");
      expect(readyStateUpdatedMessage2.data).toEqual({ isReady: false });
    });
  });
});
