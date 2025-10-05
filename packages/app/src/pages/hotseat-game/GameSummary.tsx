import { useStateStore } from "#/state/state";
import { Button } from "#components/Button.tsx";

export function GameSummary() {
  const winner = useStateStore((state) => state.gameSession?.winner);
  const navigateToPage = useStateStore((state) => state.navigateToPage);

  return (
    <section className="absolute top-0 left-1/2 -translate-x-1/2 p-4 bg-neutral-100/75 rounded-xl">
      <p className="text-md font-bold mb-4">
        {winner === "player1" && "Player X wins!"}
        {winner === "player2" && "Player O wins!"}
        {winner === undefined && "It's a draw!"}
      </p>
      <Button onClick={() => navigateToPage("main-menu")}>Back to the menu</Button>
    </section>
  );
}
