import type { GameId } from "@tic-tac-toe/shared/types";
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
        scope: gameId,
        name: "requestMove",
        data: { cellIdx: 4 },
      });

      // Should not receive a movePlayed message
      await new Promise((resolve) => setTimeout(resolve, 50)); // 50 ms should be enough, right?
      expect(client1.receivedMessages).toBeEmpty();
      expect(client2.receivedMessages).toBeEmpty();
    });

    test("move is rejected when game is over", async () => {
      client1.clearReceivedMessages();
      client2.clearReceivedMessages();

      // Manually trigger a game over by making a move and checking if gameOver message appears
      // First, let's see what happens with a simple draw scenario
      const drawMoves = [0, 1, 2, 4, 3, 5, 7, 6, 8]; // Fill all cells for a draw

      // Make all moves to complete the game
      for (let i = 0; i < drawMoves.length; i++) {
        const cellIdx = drawMoves[i]!;
        const currentClient = i % 2 === 0 ? client1 : client2;
        const otherClient = i % 2 === 0 ? client2 : client1;

        currentClient.sendMessage({
          scope: gameId,
          name: "requestMove",
          data: { cellIdx },
        });

        // Wait for movePlayed message from both clients
        const moveMessage1 = await currentClient.waitForMessage(({ name }) => name === "movePlayed");
        const moveMessage2 = await otherClient.waitForMessage(({ name }) => name === "movePlayed");
        if (moveMessage1.name !== "movePlayed" || moveMessage2.name !== "movePlayed") return expect.unreachable();

        // Check if this was the final move (i == 8 means last move)
        if (i === 8) {
          // Wait a bit for gameOver message
          await new Promise((resolve) => setTimeout(resolve, 20));

          // Check if gameOver message was sent
          const gameOverMessage1 = client1.receivedMessages.find(({ name }) => name === "gameOver");
          const gameOverMessage2 = client2.receivedMessages.find(({ name }) => name === "gameOver");

          if (!gameOverMessage1 || !gameOverMessage2) {
            console.log("No gameOver message found after draw");
            return expect.unreachable();
          }
        }
      }

      // Clear messages after game ends
      client1.clearReceivedMessages();
      client2.clearReceivedMessages();

      // Try to make a move after game is over
      client1.sendMessage({
        scope: gameId,
        name: "requestMove",
        data: { cellIdx: 0 }, // Any cell, should be rejected
      });

      // Should not receive any messages (movePlayed or gameOver)
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(client1.receivedMessages).toBeEmpty();
      expect(client2.receivedMessages).toBeEmpty();
    });
  });

  async function initializeGameWithTwoClients(): Promise<[GameId, TestClient, TestClient]> {
    const [client1, client2] = await testManager.createClients(2);
    client1.clearReceivedMessages();
    client2.clearReceivedMessages();

    client1.sendMessage({ scope: "lobby", name: "readyForNextGame", data: { isReady: true } });
    client2.sendMessage({ scope: "lobby", name: "readyForNextGame", data: { isReady: true } });

    const gameJoinedMessage1 = await client1.waitForMessage((msg) => msg.name === "gameJoined");
    if (gameJoinedMessage1.name !== "gameJoined") return expect.unreachable();
    if (gameJoinedMessage1.data.firstMove) return [gameJoinedMessage1.scope, client1, client2];
    else return [gameJoinedMessage1.scope, client2, client1];
  }
});
