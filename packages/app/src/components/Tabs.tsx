import type { Children } from "#utils.ts";
import type { ReactNode } from "react";

function Root({ children }: Children) {
  return (
    <ul className="flex flex-wrap text-md font-medium text-center text-inactive border-b-1 border-inactive">
      {children}
    </ul>
  );
}

type ItemProps = {
  icon: ReactNode;
  active: boolean;
  onActivate: () => void;
} & Children;

function Item({ icon, active, onActivate, children }: ItemProps) {
  return (
    <li className="me-2">
      <a
        href="#"
        data-variant={active ? 'active' : 'default'}
        className="inline-flex items-center justify-center p-4 border-b-1 border-transparent hover:text-hover hover:border-hover data-[variant=active]:text-active data-[variant=active]:border-active"
        onClick={onActivate}
      >
        <div className="mr-2">{icon}</div>
        {children}
      </a>
    </li>
  );
}

function Content({ children }: Children) {
  return (
    <main className="">
      {children}
    </main>
  );
}

export const Tabs = {
  Root,
  Item,
  Content,
};
