import { describe, expect, it } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { MainMenu } from "./MainMenu";

describe("MainMenu", () => {
  it("shows MainMenu with game title and tab Solo selected by default", async () => {
    const doc = render(<MainMenu />);
    expect(doc.queryByRole("heading", { name: "TicTacToe" })).toBeDefined();

    const soloTab = doc.queryByRole("tab", { name: "Solo" });
    expect(soloTab).toBeDefined();
    expect(soloTab).toHaveAttribute("aria-selected", "true");
  });

  it.skip("selects online tab when user clicks on it", async () => {
    const doc = render(<MainMenu />);

    const onlineTab = doc.getByRole("tab", { name: "Online" });
    expect(onlineTab).toHaveAttribute("aria-selected", "false");

    await fireEvent.click(onlineTab);
    expect(doc.getByRole("tab", { name: "Online" })).toHaveAttribute("aria-selected", "true");
  });
});
