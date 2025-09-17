import { createContext, type ActionDispatch } from "react";
import type { GameAction, GameState } from '@tic-tac-toe/shared/state';

export const GameStateContext = createContext<GameState>(null!);
export const GameStateDispatchContext = createContext<ActionDispatch<[action: GameAction]>>(null!);
