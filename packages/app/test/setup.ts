import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { useStateStore } from "#state/state.ts";

afterEach(() => {
  cleanup();

  // Reset state after each test
  useStateStore.setState(useStateStore.getInitialState());
});
