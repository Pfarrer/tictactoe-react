import type { Children } from "#utils.ts";

export function DialogRoot({ children }: Children) {
  return (
    <dialog
      open
      className="top-0 left-0 w-full h-full flex flex-col place-content-center items-center bg-neutral-200/20 backdrop-blur-md"
    >
      <section className="p-4 bg-neutral-100/75 drop-shadow-lg rounded-xl">{children}</section>
    </dialog>
  );
}

export function DialogTitle({ children }: Children) {
  return <h2 className="">{children}</h2>;
}

export function DialogDescription({ children }: Children) {
  return <p className="">{children}</p>;
}
