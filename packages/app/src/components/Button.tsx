import type { Children } from "#utils.ts";
import { Spinner } from "./Spinner";

type ButtonProps = {
  isEnabled?: boolean;
  showSpinner?: boolean;
  onClick: () => void;
} & Children;

export function Button({ isEnabled = true, showSpinner = false, onClick, children }: ButtonProps) {
  return (
    <button
      disabled={isEnabled === false}
      onClick={onClick}
      className="font-medium rounded-lg text-sm px-4 py-2 my-2 cursor-pointer select-none bg-lime-400 border border-lime-500 focus:outline-none hover:bg-lime-500 focus:ring-4 focus:ring-lime-500"
    >
      {showSpinner === true && <Spinner />}
      {children}
    </button>
  );
}
