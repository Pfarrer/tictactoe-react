import { Button } from "#components/Button.tsx";
import { DialogBody, DialogRoot, DialogTitle } from "#components/Dialog.tsx";
import { useStateStore } from "#state/state.ts";

export function GameSummary() {
  const winner = useStateStore((state) => state.gameSession?.winner);
  const navigateToPage = useStateStore((state) => state.navigateToPage);

  return (
    <DialogRoot anchor="top" backdrop={false}>
      {winner === "human" && <DialogTitle text="Congrats! You won!" />}
      {winner === "computer" && <DialogTitle text="Ugh! You lost..." />}
      {winner === undefined && <DialogTitle text="Unfortunately, a draw..." />}

      <DialogBody>
        <Button onClick={() => navigateToPage("main-menu")}>Back to the menu</Button>
      </DialogBody>
    </DialogRoot>
  );
}
