import { useReducer } from "react";
import { Cells } from "./Cells";
import { ComputerPlayer } from "./ComputerPlayer";
import { GameStage } from "./GameStage";
import { GameStateContext, GameStateDispatchContext } from "./GameStateConext";
import { Grid } from "./Grid";
import { initState, reducer } from "./core/state";
import { MenuDialog } from "./MenuDialog";

function App() {
  const [state, dispatch] = useReducer(reducer, initState());
  
  return (
    <GameStateContext value={state}>
      <GameStateDispatchContext value={dispatch}>
        <GameStage>
          <Cells />
          <Grid />
          </GameStage>
        <MenuDialog />
        <ComputerPlayer />
      </GameStateDispatchContext>
    </GameStateContext>
  );
}

export default App;
