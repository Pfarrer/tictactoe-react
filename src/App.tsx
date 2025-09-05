import { Stage } from "react-konva";
import "./App.css";
import { useRef } from "react";
import Konva from "konva";
import { useWindowSize } from "./hooks/useWindowSize";
import { Grid } from "./Grid";
import { STAGE_SIZE } from "./constants";

function App() {
  const stageRef = useRef<Konva.Stage>(null);
  const windowSize = useWindowSize();

  return (
    <>
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
