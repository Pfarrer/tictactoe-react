import { useReducer } from "react";
import { GameStateContext, GameStateDispatchContext } from "./GameStateConext";
import { initState, reducer } from "#/state/state";
import { GameBoard } from "./components/game-board";
import { MainMenu } from "#pages/main-menu/MainMenu.tsx";

function App() {
  const [state, dispatch] = useReducer(reducer, initState());

  return (
    <GameStateContext value={state}>
      <GameStateDispatchContext value={dispatch}>
        <GameBoard />
        <MainMenu />
      </GameStateDispatchContext>
    </GameStateContext>
  );
}

export default App;
