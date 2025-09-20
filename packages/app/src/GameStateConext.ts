import { createContext, type ActionDispatch } from "react";
import type { AppAction, AppState } from "./core/state";

export const GameStateContext = createContext<AppState>(null!);
export const GameStateDispatchContext = createContext<ActionDispatch<[action: AppAction]>>(null!);
