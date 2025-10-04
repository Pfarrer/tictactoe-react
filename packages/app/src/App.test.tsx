import App from "#App.tsx";
import { useStateStore } from "#state/state.ts";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("App", () => {
  it("can play a solo game - human wins", async ({ annotate }) => {
    const testMoves = [0, 3, 4, 5];

    render(<App />);

    // Start solo game
    fireEvent.click(screen.getByRole("button", { name: "Start" }));

    // Repeat player and computer moves until the game is finished
    for (const testMove of testMoves) {
      await annotate(`move ${testMove}...`);

      await waitFor(() => {
        expect(screen.getByText("It's your turn...")).toBeDefined();
      });

      // Perform human turn
      useStateStore.getState().gameSession?.requestPlayerMove(testMove);

      await waitFor(() => {
        expect(useStateStore.getState().gameSession?.nextTurn).toBe("computer");
      });
      await waitFor(() => {
        const nextTurn = useStateStore.getState().gameSession?.nextTurn;
        const status = useStateStore.getState().gameSession?.status;
        expect(nextTurn === "human" || status === "finished").toBeTruthy();
      });
    }

    expect(screen.getByText("Congrats! You won!")).toBeDefined();
  });
});
