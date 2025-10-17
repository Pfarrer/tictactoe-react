import { useStateStore } from "#state/state.ts";
import { GameInProgressMenu } from "./GameInProgressMenu";
import { GameSummary } from "./GameSummary";

export function OnlineGame() {
  const status = useStateStore((state) => state.gameSession?.status);
  return (
    <>
      {status !== "finished" && <GameInProgressMenu />}
      {status === "finished" && <GameSummary />}
    </>
  );
}
