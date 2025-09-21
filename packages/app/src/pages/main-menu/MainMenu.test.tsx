import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MainMenu } from "./MainMenu";
import { MainMenuTabValues, type MainMenuTab } from "#state/types.ts";

describe("MainMenu", () => {
  it("shows MainMenu with game title and tab Solo selected by default", () => {
    const doc = render(<MainMenu />);
    expect(doc.queryByRole("heading", { name: "TicTacToe" })).toBeDefined();

    const soloTab = doc.queryByRole("tab", { name: "Solo" });
    expect(soloTab).toBeDefined();
    expect(soloTab).toHaveAttribute("aria-selected", "true");
  });

  it.each(MainMenuTabValues)("selects %s tab when user clicks on it", (tabName: MainMenuTab) => {
    // Capitalize the first letter
    const tabText = tabName.charAt(0).toUpperCase() + tabName.slice(1);

    render(<MainMenu />);

    const tab = screen.getByRole("tab", { name: tabText });
    if (tabName === "solo") {
      // Solo is the default tab
      expect(tab).toHaveAttribute("aria-selected", "true");
    } else {
      expect(tab).toHaveAttribute("aria-selected", "false");
    }

    fireEvent.click(tab);
    expect(tab).toHaveAttribute("aria-selected", "true");
  });
});
