import type { ReactNode } from "react";

export function Button({ children }: { children: ReactNode | ReactNode[] }) {
  return (
    <button className="bg-lime-400 border border-lime-500 focus:outline-none hover:bg-lime-500 focus:ring-4 focus:ring-lime-500 font-medium rounded-lg text-sm px-4 py-2 me-2 my-2;">
      {children}
    </button>
  );
}
