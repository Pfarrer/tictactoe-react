import type { ClientMessage, GameId } from "@tic-tac-toe/shared/types";
import { beforeEach, describe, expect, test } from "bun:test";
import { TestClient } from "../../test/test-client";
import { TestManager } from "../../test/test-manager";

describe("Game scope", async () => {
  const testManager: TestManager = await TestManager.registerTestHooks();
  // clients are ordered: client1 has the right to move first
  let client1: TestClient, client2: TestClient;
  let gameId: GameId;

  beforeEach(async () => {
    const init = await initializeGameWithTwoClients();
    gameId = init[0];
    client1 = init[1];
    client2 = init[2];
  });

  describe("play a game", () => {
    test("gameJoinedMessage are send to both clients", async () => {
      const gameJoinedMessage1 = await client1.waitForMessage(({ name }) => name === "gameJoined");
      const gameJoinedMessage2 = await client2.waitForMessage(({ name }) => name === "gameJoined");
      if (gameJoinedMessage1.name !== "gameJoined" || gameJoinedMessage2.name !== "gameJoined") {
        expect.unreachable();
      }

      expect(gameJoinedMessage1.scope).toBe(gameJoinedMessage2.scope);
      // One client must have the first move, but not both
      expect(gameJoinedMessage1.data.firstMove || gameJoinedMessage2.data.firstMove).toBe(true);
      expect(gameJoinedMessage1.data.firstMove && gameJoinedMessage2.data.firstMove).toBe(false);
    });

    test("valid move is accepted and published to both clients", async () => {
      client1.sendMessage({
        id: "msg-1",
        scope: gameId,
        name: "requestMove",
        data: { cellIdx: 4 },
      });

      const moveMessage1 = await client1.waitForMessage(({ name }) => name === "movePlayed");
      const moveMessage2 = await client2.waitForMessage(({ name }) => name === "movePlayed");
      if (moveMessage1.name !== "movePlayed" || moveMessage2.name !== "movePlayed") return expect.unreachable();

      expect(moveMessage1.data.cellIdx).toBe(4);
      expect(moveMessage1.data.isYourMove).toBe(true);
      expect(moveMessage2.data.cellIdx).toBe(4);
      expect(moveMessage2.data.isYourMove).toBe(false);
    });

    test("move is rejected when it's not client's turn", async () => {
      client1.clearReceivedMessages();
      client2.clearReceivedMessages();

      // Client1 is on the move, not client2
      client2.sendMessage({
        id: "msg-invalid-turn",
        scope: gameId,
        name: "requestMove",
        data: { cellIdx: 4 },
      });

      // Should receive a messageRejected message
      const rejectionMessage = await client2.waitForMessage(({ name }) => name === "messageRejected");
      if (rejectionMessage.name !== "messageRejected") return expect.unreachable();
      expect(rejectionMessage.name).toBe("messageRejected");
      expect(rejectionMessage.data.messageId).toBe("msg-invalid-turn");
      expect(rejectionMessage.data.reason).toBe("Not your turn to move");

      // Should not receive any movePlayed messages
      expect(client1.receivedMessages.filter(({ name }) => name === "movePlayed")).toBeEmpty();
      expect(client2.receivedMessages.filter(({ name }) => name === "movePlayed")).toBeEmpty();
    });

    test("invalid move is rejected with messageRejected", async () => {
      // Simple test: just verify that invalid moves are rejected with messageRejected
      // This tests the rejection system without needing to complete a game

      // Try to make a move to an invalid cell (out of bounds)
      client1.sendMessage({
        id: "move-invalid-cell",
        scope: gameId,
        name: "requestMove",
        data: { cellIdx: 99 }, // Invalid cell index
      });

      // Should receive a messageRejected message
      const rejectionMessage = await client1.waitForMessage((msg) => msg.name === "messageRejected");
      if (rejectionMessage.name !== "messageRejected") return expect.unreachable();
      expect(rejectionMessage.name).toBe("messageRejected");
      expect(rejectionMessage.data.messageId).toBe("move-invalid-cell");
      expect(rejectionMessage.data.reason).toBe("requestMove requires cellIdx between 0 and 8");

      // Should not receive any movePlayed messages
      expect(client1.receivedMessages.filter((msg) => msg.name === "movePlayed")).toBeEmpty();
      expect(client2.receivedMessages.filter((msg) => msg.name === "movePlayed")).toBeEmpty();
    });
  });

  describe("message validation", () => {
    test("invalid JSON is rejected", async () => {
      client1.clearReceivedMessages();

      // Send invalid JSON
      client1.sendRaw("invalid json");

      const rejectionMessage = await client1.waitForMessage(({ name }) => name === "messageRejected");
      if (rejectionMessage.name !== "messageRejected") return expect.unreachable();
      expect(rejectionMessage.name).toBe("messageRejected");
      expect(rejectionMessage.data.messageId).toBe("unknown");
      expect(rejectionMessage.data.reason).toBe("Invalid JSON: message must be valid JSON");
    });

    test("message missing required fields is rejected", async () => {
      client1.clearReceivedMessages();

      // Send message missing id
      client1.sendRaw(JSON.stringify({ scope: "lobby", name: "readyForNextGame", data: { isReady: true } }));

      const rejectionMessage = await client1.waitForMessage(({ name }) => name === "messageRejected");
      if (rejectionMessage.name !== "messageRejected") return expect.unreachable();
      expect(rejectionMessage.name).toBe("messageRejected");
      expect(rejectionMessage.data.reason).toBe("id must be a non-empty string");
    });

    test("invalid message type is rejected", async () => {
      client1.clearReceivedMessages();

      client1.sendMessage({
        id: "msg-unknown-type",
        scope: "lobby",
        name: "unknownMessage",
        data: { something: true },
      } as unknown as ClientMessage);

      const rejectionMessage = await client1.waitForMessage(({ name }) => name === "messageRejected");
      if (rejectionMessage.name !== "messageRejected") return expect.unreachable();
      expect(rejectionMessage.name).toBe("messageRejected");
      expect(rejectionMessage.data.messageId).toBe("msg-unknown-type");
      expect(rejectionMessage.data.reason).toStartWith("Unknown message type");
    });

    test("invalid scope for readyForNextGame is rejected", async () => {
      client1.clearReceivedMessages();

      client1.sendMessage({
        id: "msg-wrong-scope",
        scope: gameId, // Should be "lobby"
        name: "readyForNextGame",
        data: { isReady: true },
      } as unknown as ClientMessage);

      const rejectionMessage = await client1.waitForMessage(({ name }) => name === "messageRejected");
      if (rejectionMessage.name !== "messageRejected") return expect.unreachable();
      expect(rejectionMessage.name).toBe("messageRejected");
      expect(rejectionMessage.data.messageId).toBe("msg-wrong-scope");
      expect(rejectionMessage.data.reason).toBe("readyForNextGame requires scope 'lobby'");
    });

    test("invalid data for requestMove is rejected", async () => {
      client1.clearReceivedMessages();

      client1.sendMessage({
        id: "msg-invalid-cell",
        scope: gameId,
        name: "requestMove",
        data: { cellIdx: 10 }, // Invalid cell index
      });

      const rejectionMessage = await client1.waitForMessage(({ name }) => name === "messageRejected");
      if (rejectionMessage.name !== "messageRejected") return expect.unreachable();
      expect(rejectionMessage.name).toBe("messageRejected");
      expect(rejectionMessage.data.messageId).toBe("msg-invalid-cell");
      expect(rejectionMessage.data.reason).toBe("requestMove requires cellIdx between 0 and 8");
    });
  });

  async function initializeGameWithTwoClients(): Promise<[GameId, TestClient, TestClient]> {
    const [client1, client2] = await testManager.createClients(2);
    client1.clearReceivedMessages();
    client2.clearReceivedMessages();

    client1.sendMessage({ id: "msg-ready-1", scope: "lobby", name: "readyForNextGame", data: { isReady: true } });
    client2.sendMessage({ id: "msg-ready-2", scope: "lobby", name: "readyForNextGame", data: { isReady: true } });

    const gameJoinedMessage1 = await client1.waitForMessage((msg) => msg.name === "gameJoined");
    if (gameJoinedMessage1.name !== "gameJoined") return expect.unreachable();
    if (gameJoinedMessage1.data.firstMove) return [gameJoinedMessage1.scope, client1, client2];
    else return [gameJoinedMessage1.scope, client2, client1];
  }
});
