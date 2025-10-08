import type { GameId } from "@tic-tac-toe/shared/types";
import type { ServerWebSocket } from "bun";

export interface Game {
  id: GameId;
  client1: ServerWebSocket<unknown>;
  client2: ServerWebSocket<unknown>;
  createdAt: Date;
}
