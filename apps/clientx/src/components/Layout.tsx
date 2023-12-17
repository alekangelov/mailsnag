"use client";
import clsx from "clsx";
import { PropsWithChildren } from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className={clsx("px-4", "flex", "w-full", "items-start", "gap-4")}>
      <Sidebar />
      {children}
    </div>
  );
}
