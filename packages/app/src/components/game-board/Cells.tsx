import { BOARD_PADDING, CELL_SIZE } from "#/constants";
import { useStateStore } from "#state/state.ts";
import type { BoardCell } from "@tic-tac-toe/shared/types";
import type Konva from "konva";
import { useRef } from "react";
import { Circle, Group, Layer, Line, Rect } from "react-konva";

export function Cells() {
  const boardCells = useStateStore((state) => state.boardCells);
  const gameSession = useStateStore((state) => state.gameSession);
  const isGameActive = gameSession?.status === "pristine" || gameSession?.status === "active";

  // Use whatever move handler is available for the current game mode
  const requestMove = gameSession?.mode === "solo" ? gameSession?.requestPlayerMove : gameSession?.requestHotseatMove;

  return (
    <Layer listening={isGameActive && !!requestMove}>
      {boardCells.map((cellState: BoardCell, idx: number) => (
        <Group
          key={idx}
          x={BOARD_PADDING + CELL_SIZE * (idx % 3)}
          y={BOARD_PADDING + CELL_SIZE * Math.floor(idx / 3)}
          onClick={() => requestMove?.(idx)}
          onTap={() => requestMove?.(idx)}
        >
          <Cell isClickable={isGameActive && cellState === " "} />
          {cellState === "o" && <ComputerCellMark />}
          {cellState === "x" && <HumanCellMark />}
        </Group>
      ))}
    </Layer>
  );
}

export function Cell({ isClickable }: { isClickable: boolean }) {
  const rectRef = useRef<Konva.Rect>(null as never);

  const onHover = (isHovered: boolean) => {
    rectRef.current.to({
      fill: isHovered && isClickable ? "rgba(73, 125, 0, 0.2)" : "rgba(0,0,0,0)",
      duration: 0.1,
    });
  };

  return (
    <Rect
      ref={rectRef}
      width={CELL_SIZE}
      height={CELL_SIZE}
      fill="rgba(0,0,0,0)"
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    />
  );
}

function ComputerCellMark() {
  return <Circle x={CELL_SIZE / 2} y={CELL_SIZE / 2} radius={CELL_SIZE / 4} strokeWidth={0.7} stroke={"red"} />;
}

function HumanCellMark() {
  return (
    <Group>
      <Line
        points={[CELL_SIZE / 4, CELL_SIZE / 4, (3 * CELL_SIZE) / 4, (3 * CELL_SIZE) / 4]}
        strokeWidth={0.7}
        stroke={"black"}
      />
      <Line
        points={[(3 * CELL_SIZE) / 4, CELL_SIZE / 4, CELL_SIZE / 4, (3 * CELL_SIZE) / 4]}
        strokeWidth={0.7}
        stroke={"black"}
      />
    </Group>
  );
}
