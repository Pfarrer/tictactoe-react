import type { Children } from "#utils.ts";
import type { ReactNode } from "react";

export function TabsRoot({ children }: Children) {
  return (
    <ul
      role="tablist"
      className="flex flex-wrap my-2 text-md font-medium text-center text-inactive border-b-1 border-inactive"
    >
      {children}
    </ul>
  );
}

type ItemProps = {
  icon: ReactNode;
  active: boolean;
  onActivate: () => void;
} & Children;

export function TabsItem({ icon, active, onActivate, children }: ItemProps) {
  return (
    <li
      role="tab"
      aria-selected={active}
      onClick={onActivate}
      data-variant={active ? "active" : "default"}
      className="inline-flex items-center justify-center px-4 py-2 me-2 cursor-pointer select-none border-b-1 border-transparent hover:text-hover hover:border-hover data-[variant=active]:text-active data-[variant=active]:border-active"
    >
      <div className="mr-2">{icon}</div>
      {children}
    </li>
  );
}

export function TabsContent({ children }: Children) {
  return <main className="">{children}</main>;
}
