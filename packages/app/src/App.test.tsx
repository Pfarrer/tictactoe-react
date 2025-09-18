import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("shows MainMenu with game title when opened freshly", async () => {
    const doc = render(<App />);
    expect(doc.queryByRole("heading", { name: "TicTacToe" })).toBeDefined();
  });
});
