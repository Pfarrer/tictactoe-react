import type { ServerMessage } from "@tic-tac-toe/shared/types";
import type { ServerWebSocket } from "bun";
import type { Game } from "../state/types";

export function createGame(client1: ServerWebSocket<unknown>, client2: ServerWebSocket<unknown>): Game {
  return {
    id: `g-${Math.random().toString(36).substring(2, 9)}`,
    client1,
    client2,
    createdAt: new Date(),
  };
}

export function sendGameJoinedMessage(game: Game) {
  const gameJoinedMessage1: ServerMessage = {
    scope: game.id,
    name: "gameJoined",
    data: {
      firstMove: false,
    },
  };
  const gameJoinedMessage2: ServerMessage = {
    scope: game.id,
    name: "gameJoined",
    data: {
      firstMove: true,
    },
  };

  game.client1.send(JSON.stringify(gameJoinedMessage1));
  game.client2.send(JSON.stringify(gameJoinedMessage2));
}
