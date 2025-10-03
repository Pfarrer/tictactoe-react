import App from "#App.tsx";
import { useStateStore } from "#state/state.ts";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { findMoveRandom } from "@tic-tac-toe/shared/algorithms";
import { describe, expect, it } from "vitest";

describe("App", () => {
  it("can play a solo game", async () => {
    render(<App />);

    // Start solo game
    fireEvent.click(screen.getByRole("button", { name: "Start" }));

    // Repeat player and computer moves until the game is finished
    while (useStateStore.getState().gameSession?.status !== "finished") {
      await waitFor(() => {
        expect(screen.getByText("It's your turn...")).toBeDefined();
      });

      // Perform human turn
      const cellIdx = findMoveRandom(useStateStore.getState().boardCells);
      expect(cellIdx).toBeDefined();
      useStateStore.getState().gameSession?.requestPlayerMove(cellIdx!);

      await waitFor(() => {
        expect(useStateStore.getState().gameSession?.nextTurn).toBe("computer");
      });
      await waitFor(() => {
        const nextTurn = useStateStore.getState().gameSession?.nextTurn;
        const status = useStateStore.getState().gameSession?.status;
        expect(nextTurn === "human" || status === "finished").toBeTruthy();
      });
    }

    expect(useStateStore.getState().gameSession?.status).toBe("finished");
  });
});
