import type { ServerWebSocket } from "bun";
import { create } from "zustand";
import { mutative } from "zustand-mutative";
import { sendServerStatistics } from "./rooms/lobby";

interface State {
  clients: ServerWebSocket<unknown>[];
}

interface Actions {
  clientConnected: (ws: ServerWebSocket<unknown>) => void;
  clientDisconnected: (ws: ServerWebSocket<unknown>) => void;
}

export const stateStore = create<State & Actions>()(
  mutative((set) => ({
    clients: [],

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
