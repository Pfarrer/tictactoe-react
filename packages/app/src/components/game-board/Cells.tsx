import type Konva from "konva";
import { useRef } from "react";
import { Circle, Group, Layer, Line, Rect } from "react-konva";
import { BOARD_PADDING, CELL_SIZE } from "#/constants";
import type { BoardCell } from "@tic-tac-toe/shared/types";
import { useStateStore } from "#state/state.ts";

export function Cells() {
  const boardCells = useStateStore((state) => state.boardCells);
  const isGameActive = useStateStore((state) => state.gameSession?.status === "active");

  const onCellClick = (idx: number) => {
    // dispatch({ type: "player_move_requested", cellIdx: idx });
  };

  return (
    // <Layer listening={isGameActive && gameState.nextTurn === "human"}>
    <Layer listening={false}>
      {boardCells.map((cellState: BoardCell, idx: number) => (
        <Group
          key={idx}
          x={BOARD_PADDING + CELL_SIZE * (idx % 3)}
          y={BOARD_PADDING + CELL_SIZE * Math.floor(idx / 3)}
          onClick={() => onCellClick(idx)}
          onTap={() => onCellClick(idx)}
        >
          <Cell cellState={cellState} isClickable={isGameActive && cellState === " "}></Cell>
        </Group>
      ))}
    </Layer>
  );
}

const CELL_COLOR_DEFAULT = "white";
const CELL_COLOR_HOVER = "gray";

export function Cell({ cellState, isClickable }: { cellState: BoardCell; isClickable: boolean }) {
  const rectRef = useRef<Konva.Rect>(null as never);

  const onHover = (isHovered: boolean) => {
    if (cellState !== " ") return;

    rectRef.current.to({
      fill: isHovered ? CELL_COLOR_HOVER : CELL_COLOR_DEFAULT,
      duration: 0.1,
    });
  };

  return (
    <>
      <Rect
        ref={rectRef}
        width={CELL_SIZE}
        height={CELL_SIZE}
        fill={isClickable ? CELL_COLOR_DEFAULT : "transparent"}
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
      />
      {cellState === "o" && <ComputerCellMark />}
      {cellState === "x" && <HumanCellMark />}
    </>
  );
}

function ComputerCellMark() {
  return <Circle x={CELL_SIZE / 2} y={CELL_SIZE / 2} radius={CELL_SIZE / 4} strokeWidth={0.7} stroke={"red"} />;
}

function HumanCellMark() {
  return (
    <>
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
    </>
  );
}
