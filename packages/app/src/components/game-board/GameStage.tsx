import { STAGE_SIZE } from "#/constants";
import { useLayoutEffect, useState, type JSX } from "react";
import { Stage } from "react-konva";

export function GameStage({ children }: { children: JSX.Element | JSX.Element[] }) {
  const windowSize = useWindowSize();
  const { scale, offsetX, offsetY } = calculateScaleAndOffset(windowSize);

  return (
    <Stage
      width={windowSize.width}
      height={windowSize.height}
      scaleX={scale}
      scaleY={scale}
      offsetX={-offsetX}
      offsetY={-offsetY}
    >
      {children}
    </Stage>
  );
}

function useWindowSize(): {
  width: number;
  height: number;
} {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    function updateSize() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", updateSize);
    updateSize();

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return size;
}

function calculateScaleAndOffset(windowSize: ReturnType<typeof useWindowSize>): {
  scale: number;
  offsetX: number;
  offsetY: number;
} {
  const minDimensions = Math.min(windowSize.width, windowSize.height);
  const scale = minDimensions / STAGE_SIZE;

  const offsetX = Math.round((windowSize.width / scale - STAGE_SIZE) / 2) || 0;
  const offsetY = Math.round((windowSize.height / scale - STAGE_SIZE) / 2) || 0;

  return {
    scale,
    offsetX,
    offsetY,
  };
}
