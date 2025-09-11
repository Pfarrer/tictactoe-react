import type Konva from 'konva';
import { useContext, useRef } from 'react';
import { Circle, Group, Layer, Line, Rect } from 'react-konva';
import { BOARD_PADDING, CELL_SIZE } from './constants';
import { GameStateContext, GameStateDispatchContext } from './GameStateConext';
import type { BoardCellValue } from './core/state';

export function Cells() {
  const gameState = useContext(GameStateContext);

  return (
    <Layer
      listening={
        gameState.gameStatus === 'active' && gameState.nextTurn === 'human'
      }
    >
      {gameState.board.map((cellState, idx) => (
        <Cell key={idx} idx={idx} cellState={cellState}></Cell>
      ))}
    </Layer>
  );
}

const CELL_COLOR_DEFAULT = 'white';
const CELL_COLOR_HOVER = 'gray';

export function Cell({
  idx,
  cellState,
}: {
  idx: number;
  cellState: BoardCellValue;
}) {
  const rectRef = useRef<Konva.Rect>(null as never);
  const dispatch = useContext(GameStateDispatchContext);

  function isCellClickable() {
    return cellState === ' ';
  }

  const onHover = (isHovered: boolean) => {
    if (cellState !== ' ') return;

    rectRef.current.to({
      fill: isHovered ? CELL_COLOR_HOVER : CELL_COLOR_DEFAULT,
      duration: 0.1,
    });
  };
  const onClick = () => {
    if (cellState !== ' ') return;
    dispatch({ type: 'player_move_requested', cellIdx: idx });
  };

  return (
    <Group
      x={BOARD_PADDING + CELL_SIZE * (idx % 3)}
      y={BOARD_PADDING + CELL_SIZE * Math.floor(idx / 3)}
      onClick={onClick}
    >
      <Rect
        ref={rectRef}
        width={CELL_SIZE}
        height={CELL_SIZE}
        fill={isCellClickable() ? CELL_COLOR_DEFAULT : 'transparent'}
        onMouseEnter={(_) => onHover(true)}
        onMouseLeave={(_) => onHover(false)}
      />

      {cellState === 'o' && <ComputerCellMark />}
      {cellState === 'x' && <HumanCellMark />}
    </Group>
  );
}

function ComputerCellMark() {
  return (
    <Circle
      x={CELL_SIZE / 2}
      y={CELL_SIZE / 2}
      radius={CELL_SIZE / 4}
      strokeWidth={0.7}
      stroke={'red'}
    />
  );
}

function HumanCellMark() {
  return (
    <>
      <Line
        points={[
          CELL_SIZE / 4,
          CELL_SIZE / 4,
          (3 * CELL_SIZE) / 4,
          (3 * CELL_SIZE) / 4,
        ]}
        strokeWidth={0.7}
        stroke={'black'}
      />
      <Line
        points={[
          (3 * CELL_SIZE) / 4,
          CELL_SIZE / 4,
          CELL_SIZE / 4,
          (3 * CELL_SIZE) / 4,
        ]}
        strokeWidth={0.7}
        stroke={'black'}
      />
    </>
  );
}
