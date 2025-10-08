import type { ServerWebSocket } from "bun";
import { create } from "zustand";
import { mutative } from "zustand-mutative";
import { sendServerStatistics } from "./scopes/lobby";

interface Lobby {
  clientReadyForNewGame: ServerWebSocket<unknown> | null;
  setClientReadyForNewGame: (ws: ServerWebSocket<unknown>) => void;
  setClientNotReadyForNewGame: (ws: ServerWebSocket<unknown>) => void;
}

export interface State {
  clients: ServerWebSocket<unknown>[];
  lobby: Lobby;
  clientConnected: (ws: ServerWebSocket<unknown>) => void;
  clientDisconnected: (ws: ServerWebSocket<unknown>) => void;
}

export const stateStore = create<State>()(
  mutative((set) => ({
    clients: [],
    lobby: {
      clientReadyForNewGame: null,
      setClientReadyForNewGame: (ws: ServerWebSocket<unknown>) =>
        set((state) => {
          if (state.lobby.clientReadyForNewGame === null) {
            state.lobby.clientReadyForNewGame = ws;
          } else {
            // Start a game with both clients
            const client1 = state.lobby.clientReadyForNewGame;
            const client2 = ws;
            console.log(`Starting game between clients ${client1.remoteAddress} and ${client2.remoteAddress}`);
            // TODO: Implement game start logic
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
          activeGamesCount: 0,
        });
      }),

    clientDisconnected: (ws: ServerWebSocket<unknown>) =>
      set((state) => {
        const idx = state.clients.indexOf(ws);
        if (idx !== -1) state.clients.splice(idx, 1);

        sendServerStatistics(state.clients, {
          connectedPlayersCount: state.clients.length,
          activeGamesCount: 0,
        });
      }),
  })),
);
