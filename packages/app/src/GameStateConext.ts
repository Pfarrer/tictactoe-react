import { createContext, type ActionDispatch } from "react";
import type { GameAction, GameState } from "./core/state";

export const GameStateContext = createContext<GameState>(null!);
export const GameStateDispatchContext = createContext<ActionDispatch<[action: GameAction]>>(null!);
