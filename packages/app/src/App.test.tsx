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
      const gameSession = useStateStore.getState().gameSession;
      expect(gameSession).not.toBeNull();
      expect(gameSession?.mode).toBe("solo");
      if (gameSession && gameSession.mode === "solo") {
        gameSession.requestPlayerMove(testMove);
      }

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

describe("Hotseat Game", () => {
  it("starts a hotseat game and allows players to take turns", () => {
    // Start a hotseat game
    useStateStore.getState().mainMenu.startHotseatGame();

    const gameSession = useStateStore.getState().gameSession;
    expect(gameSession).not.toBeNull();
    expect(gameSession?.mode).toBe("hotseat");
    expect(gameSession?.status).toBe("pristine");
    expect(gameSession?.nextTurn).toBe("player1");

    // Player 1 makes a move
    if (gameSession?.mode === "hotseat") {
      gameSession.requestHotseatMove(0);

      // Check that the board is updated and turn switched
      expect(useStateStore.getState().boardCells[0]).toBe("x");
      expect(useStateStore.getState().gameSession?.nextTurn).toBe("player2");
      expect(useStateStore.getState().gameSession?.status).toBe("active");

      // Player 2 makes a move
      const secondGameSession = useStateStore.getState().gameSession;
      if (secondGameSession?.mode === "hotseat") {
        secondGameSession.requestHotseatMove(1);

        // Check that the board is updated and turn switched
        expect(useStateStore.getState().boardCells[1]).toBe("o");
        expect(useStateStore.getState().gameSession?.nextTurn).toBe("player1");
      }
    }
  });

  it("detects winner correctly in hotseat game", () => {
    // Start a hotseat game
    useStateStore.getState().mainMenu.startHotseatGame();

    const gameSession = useStateStore.getState().gameSession;
    expect(gameSession?.mode).toBe("hotseat");

    if (gameSession?.mode === "hotseat") {
      // Simulate a winning game for player 1 (X)
      // X wins horizontally: X X X on top row
      gameSession.requestHotseatMove(0); // X
      gameSession.requestHotseatMove(3); // O
      gameSession.requestHotseatMove(1); // X
      gameSession.requestHotseatMove(4); // O
      gameSession.requestHotseatMove(2); // X wins

      expect(useStateStore.getState().gameSession?.status).toBe("finished");
      expect(useStateStore.getState().gameSession?.winner).toBe("player1");
    }
  });
});
