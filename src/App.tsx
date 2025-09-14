import { Layer, Rect, Stage } from "react-konva";
import "./App.css";

function App() {
  return (
    <>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <Rect
            x={20}
            y={50}
            width={100}
            height={100}
            fill="red"
            shadowBlur={10}
            draggable
          />
        </Layer>
      </Stage>
    </>
  );
}

export default App;
