import { useStateStore } from "#state/state.ts";
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Mock the computer move delay to be instant in tests
vi.mock("#constants.ts", async () => {
  const actual = await vi.importActual("#constants.ts");
  return {
    ...actual,
    SOLO_GAME_COMPUTER_MOVE_DELAY_MS: 0,
  };
});

afterEach(() => {
  cleanup();

  // Reset state after each test
  useStateStore.setState(useStateStore.getInitialState());
});
