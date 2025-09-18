import { useReducer } from "react";
import { ComputerPlayer } from "./ComputerPlayer";
import { GameStateContext, GameStateDispatchContext } from "./GameStateConext";
import { initState, reducer } from "./core/state";
import { MenuDialog } from "./MenuDialog";
import { GameBoard } from "./components/game-board";

function App() {
  const [state, dispatch] = useReducer(reducer, initState());

  return (
    <GameStateContext value={state}>
      <GameStateDispatchContext value={dispatch}>
        <GameBoard />
        <MenuDialog />
        <ComputerPlayer />
      </GameStateDispatchContext>
    </GameStateContext>
  );
}

export default App;
