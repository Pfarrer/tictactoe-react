import { Spinner } from "#components/Spinner.tsx";
import { useStateStore } from "#state/state.ts";

export function GameInProgressMenu() {
  const nextTurn = useStateStore((state) => state.gameSession?.nextTurn);

  return (
    <section className="absolute top-0 left-1/2 -translate-x-1/2 p-4 bg-neutral-100/75 rounded-xl">
      {nextTurn === "human" && "It's your turn..."}
      {nextTurn === "computer" && (
        <>
          Waiting for your opponent...
          <Spinner />
        </>
      )}
    </section>
  );
}
