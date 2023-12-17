import { useData } from "@/hooks/useData";
import clsx from "clsx";
import { Delete, Inbox, Mail, MailOpen, Settings } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { PropsWithChildren } from "react";
import { SETTINGS_MODAL_ID } from "./SettingsModal";

function SidebarItem({
  icon,
  name,
  href,
  isActive = false,
  extra = "",
  ...rest
}: {
  icon: React.ReactNode;
  name: string;
  href: string;
  isActive?: boolean;
  extra?: string;
  onClick?: VoidFunction;
} & React.HTMLAttributes<HTMLAnchorElement>) {
  return (
    <li className={clsx("flex items-center gap-4", "rounded-lg", {})}>
      <Link
        to={href}
        className={clsx(
          "group",
          { "bg-white dark:bg-neutral-900 group is-active": isActive },
          "flex-1 flex gap-4",
          "text-neutral-600 dark:text-neutral-400",
          "hover:bg-white dark:hover:bg-neutral-800",
          "transition-colors duration-200",
          "rounded-lg",
          "p-2 px-4"
        )}
        {...rest}
      >
        <span className="transition-all group-hover:dark:text-white group-[.is-active]:text-black group-[.is-active]:dark:text-white">
          {icon}
        </span>
        <span className="transition-all group-hover:dark:text-white group-[.is-active]:text-black group-[.is-active]:dark:text-white">
          <b>{name}</b> {extra}
        </span>
      </Link>
    </li>
  );
}

function Divider() {
  return (
    <li className={clsx("flex items-center gap-4", "rounded-lg", "my-2")}>
      <hr className="flex-1 border-neutral-200 dark:border-neutral-800" />
    </li>
  );
}

const Card = ({ children }: PropsWithChildren) => (
  <div
    className={clsx(
      "w-96 max-w-xs bg-neutral-100 dark:bg-neutral-950",
      "!bg-opacity-50 backdrop-blur-lg",
      "p-4 rounded-lg",
      "border-2 dark:border-neutral-700 shadow-2xl shadow-black/10",
      "mb-4"
    )}
  >
    {children}
  </div>
);

export default function Sidebar() {
  const { data } = useData();
  const total = data.length;
  const unread = data.filter((email) => !email.read).length;
  const read = total - unread;
  const [params] = useSearchParams();
  const filter = {
    read: params.get("read") == "true",
    unread: params.get("read") == "false",
    base: params.get("read") == null,
  };
  return (
    <div className="sticky top-24">
      <Card>
        <ul>
          <SidebarItem
            icon={<Inbox />}
            name={`All`}
            extra={`(${total})`}
            href="/"
            isActive={filter.base}
          />
          <Divider />
          <SidebarItem
            icon={<Mail />}
            name={`Unread`}
            extra={`(${unread})`}
            href="/?read=false"
            isActive={filter.unread}
          />
          <Divider />
          <SidebarItem
            icon={<MailOpen />}
            name={`Read`}
            extra={`(${read})`}
            href="/?read=true"
            isActive={filter.read}
          />
        </ul>
      </Card>
      <Card>
        <ul>
          <SidebarItem
            icon={<Settings />}
            name={`Settings`}
            href="#"
            onClick={() => {
              const modal = document.querySelector(
                `#${SETTINGS_MODAL_ID}`
              ) as HTMLDialogElement;
              if (!modal) return;
              modal.showModal();
            }}
          />
          <SidebarItem
            icon={<Delete />}
            name={`Clear All`}
            href="#"
            onClick={() => {
              fetch(import.meta.env.VITE_DATA_URL + "/emails", {
                method: "DELETE",
              }).then(() => {
                useData.setState({ data: [] });
              });
            }}
          />
        </ul>
      </Card>
    </div>
  );
}
