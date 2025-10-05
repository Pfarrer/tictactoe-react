import { useStateStore } from "#/state/state";

export function GameInProgressMenu() {
  const nextTurn = useStateStore((state) => state.gameSession?.nextTurn);

  return (
    <section className="absolute top-0 left-1/2 -translate-x-1/2 p-4 bg-neutral-100/75 rounded-xl">
      {nextTurn === "player1" && "Player X's turn..."}
      {nextTurn === "player2" && "Player O's turn..."}
    </section>
  );
}
