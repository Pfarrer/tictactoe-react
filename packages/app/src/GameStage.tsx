import { Stage } from "react-konva";
import { STAGE_SIZE } from "./constants";
import { useLayoutEffect, useState, type JSX } from "react";

export function GameStage({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  const windowSize = useWindowSize();

  return (
    <Stage
      width={windowSize.width}
      height={windowSize.height}
      scaleX={windowSize.width / STAGE_SIZE}
      scaleY={windowSize.height / STAGE_SIZE}
      style={{ background: "var(--color-emerald-100)" }}
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
