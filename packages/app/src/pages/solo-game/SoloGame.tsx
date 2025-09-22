import { useStateStore } from "#state/state.ts";
import { GameInProgressMenu } from "./GameInProgressMenu";
import { GameSummary } from "./GameSummary";

export function SoloGame() {
  const status = useStateStore((state) => state.gameSession?.status);
  return (
    <>
      {status !== "finished" && <GameInProgressMenu />}
      {status === "finished" && <GameSummary />}
    </>
  );
}
