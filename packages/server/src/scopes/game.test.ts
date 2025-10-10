import { beforeEach, describe, expect, test } from "bun:test";
import { TestClient } from "../../test/test-client";
import { TestManager } from "../../test/test-manager";

describe("Game scope", async () => {
  const testManager: TestManager = await TestManager.registerTestHooks();
  let clients: [TestClient, TestClient];

  beforeEach(async () => {
    clients = await initializeGameWithTwoClients();
  });

  describe("play a game", () => {
    test("gameJoinedMessage are send to both clients", async () => {
      const gameJoinedMessage1 = await clients[0].waitForMessage(({ name }) => name === "gameJoined");
      const gameJoinedMessage2 = await clients[1].waitForMessage(({ name }) => name === "gameJoined");
      if (gameJoinedMessage1.name !== "gameJoined" || gameJoinedMessage2.name !== "gameJoined") {
        expect.unreachable();
      }

      expect(gameJoinedMessage1.scope).toBe(gameJoinedMessage2.scope);
      // One client must have the first move, but not both
      expect(gameJoinedMessage1.data.firstMove || gameJoinedMessage2.data.firstMove).toBe(true);
      expect(gameJoinedMessage1.data.firstMove && gameJoinedMessage2.data.firstMove).toBe(false);
    });
  });

  async function initializeGameWithTwoClients(): Promise<[TestClient, TestClient]> {
    const [client1, client2] = await testManager.createClients(2);
    client1.clearReceivedMessages();
    client2.clearReceivedMessages();

    client1.sendMessage({ scope: "lobby", name: "readyForNextGame", data: { isReady: true } });
    client2.sendMessage({ scope: "lobby", name: "readyForNextGame", data: { isReady: true } });

    const gameJoinedMessage1 = await client1.waitForMessage((msg) => msg.name === "gameJoined");
    const gameJoinedMessage2 = await client2.waitForMessage((msg) => msg.name === "gameJoined");

    expect(gameJoinedMessage1.scope).toStartWith("g-");
    expect(gameJoinedMessage1.scope).toEqual(gameJoinedMessage2.scope);

    return [client1, client2];
  }
});
