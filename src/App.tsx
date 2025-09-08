import { Stage } from "react-konva";
import "./App.css";
import { useReducer, useRef } from "react";
import Konva from "konva";
import { useWindowSize } from "./hooks/useWindowSize";
import { Grid } from "./Grid";
import { STAGE_SIZE } from "./constants";
import { reducer, initState } from "./core/state";

function App() {
  const stageRef = useRef<Konva.Stage>(null);
  const windowSize = useWindowSize();
  const [state, dispatch] = useReducer(reducer, initState);

  return (
    <>
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
      <Stage
        width={windowSize.width}
        height={windowSize.height}
        scaleX={windowSize.width / STAGE_SIZE}
        scaleY={windowSize.height / STAGE_SIZE}
        style={{ background: "lightgreen" }}
        ref={stageRef}
      >
        <Grid />
      </Stage>
    </>
  );
}

export default App;
