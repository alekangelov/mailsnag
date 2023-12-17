"use client";
import { useData } from "@/hooks/useData";
import clsx from "clsx";
import { Inbox, Mail, MailOpen } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function NoData() {
  return (
    <div className="mt-12 flex flex-col items-center justify-center h-full w-full">
      <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-400">
        No emails found!
      </h1>
      <p className="text-lg text-neutral-900 dark:text-neutral-400">
        Try sending some over 📩
      </p>
    </div>
  );
}

export default function EmailList() {
  const { data } = useData();
  const params = useSearchParams();
  const filterRead = params.get("read") === "true";
  const filterUnread = params.get("read") === "false";
  const search = params.get("search") || "";
  if (!data.length) {
    return <NoData />;
  }
  return (
    <main className={clsx("flex-1")}>
      {data.map((email) => {
        const time = new Date(email.time);
        // between now and 30s ago
        const isRecent = time.getTime() > Date.now() - 30 * 1000;
        if (filterRead && !email.read) return null;
        if (filterUnread && email.read) return null;
        const subjectContainsSearch = email.subject
          .toLowerCase()
          .includes(search.toLowerCase());
        const toContainsSearch = email.to.some((e) =>
          e.toLowerCase().includes(search.toLowerCase())
        );
        const bodyContainsSearch = email.body
          .toLowerCase()
          .includes(search.toLowerCase());

        if (
          search &&
          !subjectContainsSearch &&
          !toContainsSearch &&
          !bodyContainsSearch
        )
          return null;
        return (
          <Link
            href={`/${email.id}`}
            key={email.id + ".email"}
            className={clsx(
              "border-2 dark:border-neutral-700",
              "group",
              "text-neutral-600 dark:text-neutral-300 hover:text-black hover:dark:text-neutral-200",
              "p-4 px-6 flex items-center h-full w-full rounded-lg cursor-pointer",
              "bg-white dark:bg-neutral-950",
              "mb-4 last-of-type:mb-0",
              "hover:bg-white dark:hover:bg-neutral-900 transition-all duration-200",
              "hover:shadow-xl",
              email.read ? "opacity-50 hover:opacity-100" : ""
            )}
          >
            <div className="flex items-center mr-4">
              <div
                className={clsx(
                  email.read
                    ? "bg-rose-600 group-hover:bg-rose-700"
                    : "bg-blue-500 group-hover:bg-blue-700",
                  "p-4 rounded-lg text-white transition-colors"
                )}
              >
                {email.read ? (
                  <MailOpen className="w-8 h-8" />
                ) : (
                  <Mail className="w-8 h-8" />
                )}
              </div>
            </div>
            <div className="flex-1">
              <h4 className={clsx("text-sm mb-1")}>{email.to.join(",")}</h4>
              <h3 className={clsx("text-lg font-bold")}>
                {email.subject || "No Subject"}
              </h3>
            </div>
            <div>
              <p className={clsx("text-sm", "mb-1")}>
                {time.toLocaleDateString()}
              </p>
              <p className={clsx("text-sm", "mb-1")}>
                {time.toLocaleTimeString()}
              </p>
            </div>
          </Link>
        );
      })}
    </main>
  );
}
