import { useStateStore } from "#state/state.ts";
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();

  // Reset state after each test
  useStateStore.setState(useStateStore.getInitialState());
});
