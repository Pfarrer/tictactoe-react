import { describe, expect, it } from "vitest";
import { findByLabelText, fireEvent, getByLabelText, queryByLabelText, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MainMenu } from "./MainMenu";
import { MainMenuTabValues, type MainMenuTab } from "#state/types.ts";
import { useStateStore } from "#state/state.ts";
import { DifficultyValues, type Difficulty } from "@tic-tac-toe/shared/types";

describe("MainMenu", () => {
  it("shows MainMenu with game title and tab Solo selected by default", () => {
    const doc = render(<MainMenu />);
    expect(doc.queryByRole("heading", { name: "TicTacToe" })).toBeDefined();

    const soloTab = doc.queryByRole("tab", { name: "Solo" });
    expect(soloTab).toBeDefined();
    expect(soloTab).toHaveAttribute("aria-selected", "true");
  });

  it.each(MainMenuTabValues)("selects %s tab when user clicks on it", (tabName: MainMenuTab) => {
    render(<MainMenu />);

    // Capitalize the first letter
    const tabText = tabName.charAt(0).toUpperCase() + tabName.slice(1);
    const tab = screen.getByRole("tab", { name: tabText });

    // Check if the tab was selected before clicking it
    if (tabName === "solo") {
      // Solo is the default tab
      expect(tab).toHaveAttribute("aria-selected", "true");
    } else {
      expect(tab).toHaveAttribute("aria-selected", "false");
    }

    fireEvent.click(tab);

    // The tab should be selected after clicking it
    expect(tab).toHaveAttribute("aria-selected", "true");
  });

  describe("Solo", () => {
    it.each(DifficultyValues)("starts a game with difficulty %s", async (difficulty: Difficulty) => {
      const user = userEvent.setup();

      render(<MainMenu />);

      const difficultySelect = screen.getByLabelText("Difficulty");
      await user.selectOptions(difficultySelect, difficulty);

      const startButton = screen.getByRole("button", { name: "Start" });
      fireEvent.click(startButton);

      expect(useStateStore.getState().activePage).toBe("solo-game");
      expect(useStateStore.getState().gameSession).toHaveProperty("mode", "solo");
      expect(useStateStore.getState().gameSession).toHaveProperty("difficulty", difficulty);
    });
  });
});
