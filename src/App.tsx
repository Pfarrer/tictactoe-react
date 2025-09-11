import { useReducer } from "react";
import "./App.css";
import { Cells } from "./Cells";
import { ComputerPlayer } from "./ComputerPlayer";
import { GameStage } from "./GameStage";
import { GameStateContext, GameStateDispatchContext } from "./GameStateConext";
import { Grid } from "./Grid";
import { initState, reducer } from "./core/state";
import { MenuDialog } from "./MenuDialog";

function App() {
  const [state, dispatch] = useReducer(reducer, initState());
  console.log(state);
  
  return (
    <GameStateContext value={state}>
      <GameStateDispatchContext value={dispatch}>
        <GameStage>
          <Cells />
          <Grid />
          <ComputerPlayer />
        </GameStage>
        <MenuDialog />
      </GameStateDispatchContext>
    </GameStateContext>
  );
}

export default App;
