import { Stage } from "react-konva";
import "./App.css";
import { useReducer, useRef } from "react";
import Konva from "konva";
import { useWindowSize } from "./hooks/useWindowSize";
import { Grid } from "./Grid";
import { STAGE_SIZE } from "./constants";
import { reducer, initState } from "./core/state";
import { Cells } from "./Cells";
import { GameStateContext, GameStateDispatchContext } from "./GameStateConext";

function App() {
  const stageRef = useRef<Konva.Stage>(null);
  const windowSize = useWindowSize();
  const [state, dispatch] = useReducer(reducer, initState);
  
  return (
    <GameStateContext value={state}>
      <GameStateDispatchContext value={dispatch}>
        <Stage
          width={windowSize.width}
          height={windowSize.height}
          scaleX={windowSize.width / STAGE_SIZE}
          scaleY={windowSize.height / STAGE_SIZE}
          style={{ background: "lightgreen" }}
          ref={stageRef}
        >
          <Cells />
          <Grid />
          
        </Stage>
      </GameStateDispatchContext>
    </GameStateContext>
  );
}

export default App;
