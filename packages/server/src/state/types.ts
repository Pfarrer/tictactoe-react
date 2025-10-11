import type { GameId } from "@tic-tac-toe/shared/types";
import type { ServerWebSocket } from "bun";

export interface Game {
  id: GameId;
  client1: ServerWebSocket<unknown>;
  client2: ServerWebSocket<unknown>;
  createdAt: Date;
  board: (number | null)[]; // null: empty, 0: client1, 1: client2
  currentTurn: number; // 0: client1's turn, 1: client2's turn
  gameOver: boolean;
  winner: number | null; // 0: client1, 1: client2, null: draw or ongoing
  winningCells: number[] | null; // Array of 3 cell indices for winning combination
}
