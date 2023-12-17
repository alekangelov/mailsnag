"use client";
import clsx from "clsx";
import { Search } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const { pathname: path } = useLocation();
  return (
    <header className="sticky top-0 left-0 w-full h-24 p-4">
      <div className="border-2 dark:border-neutral-700 shadow-2xl shadow-black/10 px-8 gap-4 w-full h-full rounded-xl !bg-opacity-50 bg-neutral-50 dark:bg-neutral-900 backdrop-blur-lg flex items-center justify-between">
        <Link to="/" className="flex gap-4 items-center">
          <img src="/icon.png" className="w-10 h-10" />
          <span className="font-extrabold tracking-tight">MailSnag</span>
          <span className="text-sm text-neutral-500 dark:text-neutral-400 hidden md:flex">
            The email client I hope you&apos;ll never use.
          </span>
        </Link>
        <form
          className="relative flex-1 flex"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const search = formData.get("search") as string;

            if (!search) return navigate(`/${path}`);
            navigate(`/${path}?search=${search}`);
          }}
        >
          <input
            className={clsx(
              "hide-clear all-unset bg-white dark:bg-neutral-800",
              "px-4 py-2 rounded-xl w-full ml-auto max-w-xs",
              "text-neutral-600 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-500",
              "outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
              "focus:ring-offset-neutral-100 dark:focus:ring-offset-neutral-800",
              "border-2 dark:border-neutral-700"
            )}
            name="search"
            autoComplete="off"
            type="text"
            placeholder="Search"
          />
          <span className="absolute top-1/2 right-4 transform -translate-y-1/2 w-6 h-6">
            <Search className="text-neutral-500 dark:text-neutral-400 w-6 h-6" />
          </span>
        </form>
      </div>
    </header>
  );
}
