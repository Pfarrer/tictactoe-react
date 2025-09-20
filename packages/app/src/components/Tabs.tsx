import type { Children } from "#utils.ts";
import type { ReactNode } from "react";

export function TabsRoot({ children }: Children) {
  return (
    <ul
      role="tablist"
      className="flex flex-wrap mb-4 text-md font-medium text-center text-inactive border-b-1 border-inactive"
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
    <li role="tab" className="me-2" aria-selected={active}>
      <a
        href="#"
        data-variant={active ? "active" : "default"}
        className="inline-flex items-center justify-center p-4 border-b-1 border-transparent hover:text-hover hover:border-hover data-[variant=active]:text-active data-[variant=active]:border-active"
        onClick={onActivate}
      >
        <div className="mr-2">{icon}</div>
        {children}
      </a>
    </li>
  );
}

export function TabsContent({ children }: Children) {
  return <main className="">{children}</main>;
}
