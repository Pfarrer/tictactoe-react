import type { ServerWebSocket } from "bun";
import { create } from "zustand";
import { mutative } from "zustand-mutative";
import { createGame, sendGameJoinedMessage } from "../scopes/game";
import { sendServerStatistics } from "../scopes/lobby";
import type { Game } from "./types";

interface Lobby {
  clientReadyForNewGame: ServerWebSocket<unknown> | null;
  setClientReadyForNewGame: (ws: ServerWebSocket<unknown>) => void;
  setClientNotReadyForNewGame: (ws: ServerWebSocket<unknown>) => void;
}

export interface State {
  clients: ServerWebSocket<unknown>[];
  lobby: Lobby;
  games: Game[];
  clientConnected: (ws: ServerWebSocket<unknown>) => void;
  clientDisconnected: (ws: ServerWebSocket<unknown>) => void;
}

export const stateStore = create<State>()(
  mutative((set) => ({
    clients: [],
    games: [],
    lobby: {
      clientReadyForNewGame: null,
      setClientReadyForNewGame: (ws: ServerWebSocket<unknown>) =>
        set((state) => {
          if (state.lobby.clientReadyForNewGame === null) {
            state.lobby.clientReadyForNewGame = ws;
          } else {
            // Create a game with both clients
            const client1 = state.lobby.clientReadyForNewGame;
            const client2 = ws;
            const game = createGame(client1, client2);
            state.games.push(game);
            sendGameJoinedMessage(game);

            state.lobby.clientReadyForNewGame = null;
          }
        }),
      setClientNotReadyForNewGame: (ws: ServerWebSocket<unknown>) =>
        set((state) => {
          if (state.lobby.clientReadyForNewGame === ws) {
            state.lobby.clientReadyForNewGame = null;
          }
        }),
    },

    clientConnected: (ws: ServerWebSocket<unknown>) =>
      set((state) => {
        state.clients.push(ws);

        sendServerStatistics(state.clients, {
          connectedPlayersCount: state.clients.length,
          activeGamesCount: state.games.length,
        });
      }),

    clientDisconnected: (ws: ServerWebSocket<unknown>) =>
      set((state) => {
        const idx = state.clients.indexOf(ws);
        if (idx !== -1) state.clients.splice(idx, 1);

        // Remove from lobby if they were ready
        if (state.lobby.clientReadyForNewGame === ws) {
          state.lobby.clientReadyForNewGame = null;
        }

        // Remove games involving this client
        state.games = state.games.filter((game) => game.client1 !== ws && game.client2 !== ws);

        sendServerStatistics(state.clients, {
          connectedPlayersCount: state.clients.length,
          activeGamesCount: state.games.length,
        });
      }),
  })),
);
