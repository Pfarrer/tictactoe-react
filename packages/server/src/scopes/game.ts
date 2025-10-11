import type { GameId, ServerMessage } from "@tic-tac-toe/shared/types";
import type { ServerWebSocket } from "bun";
import { stateStore } from "../state/state";
import type { Game } from "../state/types";

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

  // Check for win condition first (before switching turns)
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // columns
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ];

  for (const pattern of winPatterns) {
    if (pattern.every((idx) => game.board[idx] === playerIndex)) {
      game.gameOver = true;
      game.winner = playerIndex;
      game.winningCells = pattern;
      return true;
    }
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

export function handleRequestMove(ws: ServerWebSocket<unknown>, gameId: GameId, cellIdx: number) {
  const game = stateStore.getState().games.find((g) => g.id === gameId);
  if (!game) {
    console.warn(`handleRequestMove called for ${gameId} which is not known`);
    return;
  }

  const playerIndex = getPlayerIndex(game, ws);
  if (playerIndex === null) {
    console.warn(`handleRequestMove called for client which is not part of game ${gameId}`);
    return;
  }

  if (game.currentTurn !== playerIndex) {
    return; // Silently reject moves when it's not the player's turn
  }

  const moveSuccessful = makeMove(game, cellIdx, playerIndex);
  if (!moveSuccessful) {
    return; // Silently reject invalid moves
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
