import type { Children } from "#utils.ts";
import classNames from "classnames";
import { Spinner } from "./Spinner";

type ButtonProps = {
  kind?: "primary" | "secondary";
  isEnabled?: boolean;
  showSpinner?: boolean;
  onClick: () => void;
} & Children;

export function Button({ kind = "primary", isEnabled = true, showSpinner = false, onClick, children }: ButtonProps) {
  return (
    <button
      type="button"
      disabled={isEnabled === false}
      onClick={onClick}
      className={classNames(
        "font-medium rounded-lg text-sm px-4 py-2 my-2 cursor-pointer select-none border focus:outline-none focus:ring-4",
        {
          "bg-lime-400 border-lime-500 hover:bg-lime-500 focus:ring-lime-500": kind === "primary",
          "bg-gray-400 border-gray-500 hover:bg-gray-500 focus:ring-gray-500": kind === "secondary",
        },
      )}
    >
      {showSpinner === true && <Spinner />}
      {children}
    </button>
  );
}
