import { Layer, Line } from "react-konva";
import { BOARD_PADDING, CELL_SIZE, STAGE_SIZE } from "#/constants";

export function Grid() {
  return (
    <Layer listening={false}>
      <VerticalGridLine idx={1} />
      <VerticalGridLine idx={2} />
      <HorizontalGridLine idx={1} />
      <HorizontalGridLine idx={2} />
    </Layer>
  );
}

function VerticalGridLine({ idx }: { idx: 1 | 2 }) {
  return (
    <GridLine
      points={[
        BOARD_PADDING + idx * CELL_SIZE,
        BOARD_PADDING,
        BOARD_PADDING + idx * CELL_SIZE,
        STAGE_SIZE - BOARD_PADDING,
      ]}
    ></GridLine>
  );
}

function HorizontalGridLine({ idx }: { idx: 1 | 2 }) {
  return (
    <GridLine
      points={[
        BOARD_PADDING,
        BOARD_PADDING + idx * CELL_SIZE,
        STAGE_SIZE - BOARD_PADDING,
        BOARD_PADDING + idx * CELL_SIZE,
      ]}
    ></GridLine>
  );
}

function GridLine({ points }: { points: number[] }) {
  return <Line points={points} stroke="black" strokeWidth={1} />;
}
