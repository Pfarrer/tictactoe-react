import type { Children } from "#utils.ts";
import classNames from "classnames";

type DialogRootProps = {
  anchor?: "center" | "top";
  backdrop?: boolean;
} & Children;

export function DialogRoot({ anchor = "center", backdrop = true, children }: DialogRootProps) {
  return (
    <dialog
      open
      className={classNames("top-0 left-0 w-full h-full flex flex-col items-center bg-neutral-200/20", {
        "place-content-center": anchor === "center",
        "place-content-start": anchor === "top",
        "backdrop-blur-md": backdrop,
      })}
    >
      <section className="p-4 bg-neutral-100/75 drop-shadow-lg rounded-xl">{children}</section>
    </dialog>
  );
}

type DialogTitleProps = {
  text: string;
};

export function DialogTitle({ text }: DialogTitleProps) {
  return <h2 className="">{text}</h2>;
}

export function DialogBody({ children }: Children) {
  return <p className="flex flex-col">{children}</p>;
}
