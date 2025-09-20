import type { Children } from "#utils.ts";
import { Spinner } from "./Spinner";

type ButtonProps = {
  isEnabled?: boolean;
  showSpinner?: boolean;
  onClick: () => void;
} & Children;

export function Button({ isEnabled, showSpinner, onClick, children }: ButtonProps) {
  return (
    <button
      disabled={isEnabled === false}
      onClick={onClick}
      className="bg-lime-400 border border-lime-500 focus:outline-none hover:bg-lime-500 focus:ring-4 focus:ring-lime-500 font-medium rounded-lg text-sm px-4 py-2 me-2 my-2;"
    >
      {showSpinner === true && <Spinner />}
      {children}
    </button>
  );
}
