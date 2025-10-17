import { Button } from "#components/Button.tsx";
import { useStateStore } from "#state/state.ts";

export function GameSummary() {
  const winner = useStateStore((state) => state.gameSession?.winner);
  const navigateToPage = useStateStore((state) => state.navigateToPage);

  return (
    <section className="absolute top-0 left-1/2 -translate-x-1/2 p-4 bg-neutral-100/75 rounded-xl">
      <p className="text-md font-bold mb-4">
        {winner === "human" && "Congrats! You won!"}
        {winner === "computer" && "Ugh! You lost..."}
        {winner === undefined && "Unfortunately, a draw..."}
      </p>
      <Button onClick={() => navigateToPage("server-lobby")}>Back to the menu</Button>
    </section>
  );
}
