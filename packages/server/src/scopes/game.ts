import { findWinningCells, hasWinner } from "@tic-tac-toe/shared/core";
import type { GameId, ServerMessage } from "@tic-tac-toe/shared/types";
import type { ServerWebSocket } from "bun";
import { stateStore } from "../state/state";
import type { Game } from "../state/types";
import { sendRejection } from "../webSocketServer";

export function createGame(client1: ServerWebSocket<unknown>, client2: ServerWebSocket<unknown>): Game {
  return {
    id: `g-${Math.random().toString(36).substring(2, 9)}`,
    client1,
    client2,
    createdAt: new Date(),
    board: Array(9).fill(null),
    currentTurn: 1, // client2 starts first
    gameOver: false,
    winner: null,
    winningCells: null,
  };
}

export function sendGameJoinedMessage(game: Game) {
  const gameJoinedMessage1: ServerMessage = {
    scope: game.id,
    name: "gameJoined",
    data: {
      firstMove: game.currentTurn === 0,
    },
  };
  const gameJoinedMessage2: ServerMessage = {
    scope: game.id,
    name: "gameJoined",
    data: {
      firstMove: game.currentTurn === 1,
    },
  };

  game.client1.send(JSON.stringify(gameJoinedMessage1));
  game.client2.send(JSON.stringify(gameJoinedMessage2));
}

export function isValidMove(game: Game, cellIdx: number): boolean {
  return !game.gameOver && cellIdx >= 0 && cellIdx < 9 && game.board[cellIdx] === null;
}

export function makeMove(game: Game, cellIdx: number, playerIndex: number): boolean {
  if (!isValidMove(game, cellIdx) || game.currentTurn !== playerIndex) {
    return false;
  }

  game.board[cellIdx] = playerIndex;

  // Convert server board to shared format for winner detection
  const sharedBoard = game.board.map((cell) => (cell === null ? " " : cell === 0 ? "x" : "o")) as Array<
    " " | "x" | "o"
  >;
  const winner = hasWinner(sharedBoard as any);

  if (winner !== undefined) {
    game.gameOver = true;
    game.winner = playerIndex;
    game.winningCells = findWinningCells(sharedBoard as any) || null;
    return true;
  }

  // Check for draw
  if (game.board.every((cell) => cell !== null)) {
    game.gameOver = true;
    game.winner = null;
    game.winningCells = null;
    return true;
  }

  // Switch turns only if game is not over
  game.currentTurn = 1 - playerIndex;
  return true;
}

export function getPlayerIndex(game: Game, ws: ServerWebSocket<unknown>): number | null {
  if (ws === game.client1) return 0;
  if (ws === game.client2) return 1;
  return null;
}

export function handleRequestMove(ws: ServerWebSocket<unknown>, gameId: GameId, cellIdx: number, messageId: string) {
  const game = stateStore.getState().games.find((g) => g.id === gameId);
  if (!game) {
    sendRejection(ws, messageId, `Game ${gameId} not found`);
    return;
  }

  const playerIndex = getPlayerIndex(game, ws);
  if (playerIndex === null) {
    sendRejection(ws, messageId, `Client is not part of game ${gameId}`);
    return;
  }

  if (game.currentTurn !== playerIndex) {
    sendRejection(ws, messageId, "Not your turn to move");
    return;
  }

  const moveSuccessful = makeMove(game, cellIdx, playerIndex);
  if (!moveSuccessful) {
    sendRejection(ws, messageId, "Invalid move: cell is occupied or game is over");
    return;
  }

  // Send movePlayed messages to both clients
  const moveMessageForPlayer1: ServerMessage = {
    scope: gameId,
    name: "movePlayed",
    data: {
      cellIdx,
      isYourMove: playerIndex === 0,
    },
  };

  const moveMessageForPlayer2: ServerMessage = {
    scope: gameId,
    name: "movePlayed",
    data: {
      cellIdx,
      isYourMove: playerIndex === 1,
    },
  };

  game.client1.send(JSON.stringify(moveMessageForPlayer1));
  game.client2.send(JSON.stringify(moveMessageForPlayer2));

  // Send gameOver message if game ended
  if (game.gameOver) {
    sendGameOverMessage(game);
  }
}

function sendGameOverMessage(game: Game) {
  const gameOverMessageForPlayer1: ServerMessage = {
    scope: game.id,
    name: "gameOver",
    data: {
      result: game.winner === null ? "draw" : game.winner === 0 ? "youWon" : "youLost",
      winningCells: game.winningCells || undefined,
    },
  };

  const gameOverMessageForPlayer2: ServerMessage = {
    scope: game.id,
    name: "gameOver",
    data: {
      result: game.winner === null ? "draw" : game.winner === 1 ? "youWon" : "youLost",
      winningCells: game.winningCells || undefined,
    },
  };

  game.client1.send(JSON.stringify(gameOverMessageForPlayer1));
  game.client2.send(JSON.stringify(gameOverMessageForPlayer2));
}
