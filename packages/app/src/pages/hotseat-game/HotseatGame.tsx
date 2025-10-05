import { GameBoard } from "#/components/game-board";
import { useStateStore } from "#/state/state";

import { GameInProgressMenu } from "./GameInProgressMenu";
import { GameSummary } from "./GameSummary";

export function HotseatGame() {
  const gameSession = useStateStore((state) => state.gameSession);

  if (gameSession?.status === "finished") {
    return <GameSummary />;
  }

  return (
    <div className="flex flex-col items-center">
      <GameInProgressMenu />
      <GameBoard />
    </div>
  );
}
