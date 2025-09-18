import { Cells } from "./Cells";
import { GameStage } from "./GameStage";
import { Grid } from "./Grid";

export function GameBoard() {
  return (
    <GameStage>
      <Cells />
      <Grid />
    </GameStage>
  );
}
