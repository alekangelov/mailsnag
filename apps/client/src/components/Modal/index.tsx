import clsx from "clsx";
import { XIcon } from "lucide-react";
import { PropsWithChildren } from "react";
export default function Modal({
  id,
  children,
  title = "",
  ...rest
}: PropsWithChildren<{ id: string; title?: string }> &
  JSX.IntrinsicElements["dialog"]) {
  return (
    <dialog
      id={id}
      className={clsx(
        " fixed z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        "bg-white dark:bg-neutral-800 rounded-xl shadow-2xl p-8 m-0",
        "w-10/12 max-w-md"
      )}
      {...rest}
    >
      <form method="dialog">
        <button className="absolute top-2 right-2 p-2 z-20 hover:bg-neutral-100 hover:dark:bg-neutral-700 rounded-lg">
          <XIcon className="w-6 h-6" />
        </button>
      </form>
      <h4
        className={clsx(
          "text-2xl font-bold",
          "mb-4",
          "text-neutral-900 dark:text-neutral-200"
        )}
      >
        {title}
      </h4>
      <hr className="border-neutral-200 dark:border-neutral-800 mb-4" />
      {children}
    </dialog>
  );
}
