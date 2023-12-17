"use client";
import { useData } from "@/hooks/useData";
import clsx from "clsx";
import { Inbox, Mail, MailOpen } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PropsWithChildren } from "react";

function SidebarItem({
  icon,
  name,
  href,
  isActive = false,
}: {
  icon: React.ReactNode;
  name: string;
  href: string;
  isActive?: boolean;
}) {
  return (
    <li className={clsx("flex items-center gap-4", "rounded-lg", {})}>
      <Link
        href={href}
        className={clsx(
          "group",
          { "bg-neutral-50 dark:bg-neutral-900 group is-active": isActive },
          "flex-1 flex gap-4",
          "text-neutral-600 dark:text-neutral-400",
          "hover:bg-white dark:hover:bg-neutral-800",
          "transition-colors duration-200",
          "rounded-lg",
          "p-2 px-4"
        )}
      >
        <span className="transition-all group-hover:dark:text-white group-[.is-active]:text-black group-[.is-active]:dark:text-white">
          {icon}
        </span>
        <span className="transition-all group-hover:dark:text-white group-[.is-active]:text-black group-[.is-active]:dark:text-white">
          {name}
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

function Sidebar() {
  const { data } = useData();
  const total = data.length;
  const unread = data.filter((email) => !email.read).length;
  const read = total - unread;
  const params = useSearchParams();
  const filter = {
    read: params.get("read") == "true",
    unread: params.get("read") == "false",
    base: params.get("read") == null,
  };
  return (
    <div
      className={clsx(
        "w-96 max-w-xs bg-neutral-100 dark:bg-neutral-950",
        "!bg-opacity-50 backdrop-blur-lg",
        "p-4 rounded-lg",
        "sticky top-24"
      )}
    >
      <ul>
        <SidebarItem
          icon={<Inbox />}
          name={`All (${unread}/${total})`}
          href="/"
          isActive={filter.base}
        />
        <Divider />
        <SidebarItem
          icon={<Mail />}
          name={`Unread (${unread})`}
          href="/?read=false"
          isActive={filter.unread}
        />
        <Divider />
        <SidebarItem
          icon={<MailOpen />}
          name={`Read (${read})`}
          href="/?read=true"
          isActive={filter.read}
        />
      </ul>
    </div>
  );
}

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className={clsx("px-4", "flex", "w-full", "items-start", "gap-4")}>
      <Sidebar />
      {children}
    </div>
  );
}
