"use client";
import { useData } from "@/hooks/useData";
import { useMutation, useQuery } from "@/hooks/usePromise";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";

const fetchEmail = async (id: string) => {
  const realId = Array.isArray(id) ? id[0] : id;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DATA_URL}/emails/${realId}`
  );
  if (res.ok) {
    return res.json();
  }
  throw new Error("Failed to fetch email");
};

const readEmail = async (id: string) => {
  const realId = Array.isArray(id) ? id[0] : id;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DATA_URL}/emails/${realId}`,
    {
      method: "PUT",
    }
  );
  if (res.ok) {
    return res.json();
  }
  throw new Error("Failed to read email");
};

export default function SingleEmail() {
  const params = useParams();
  const args = useMemo(() => [params.id] as [string], [params.id]);
  const { data, loading, error } = useQuery(fetchEmail, args);
  const [mutate] = useMutation(readEmail);

  useEffect(() => {
    if (!data) return;
    mutate(params.id as string).then((email) => {
      if (email) {
        useData.getState().add(email);
      }
    });
  }, [data, mutate, params.id]);

  if (loading || !data) {
    return (
      <main className={clsx("flex-1")}>
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className={clsx("flex-1")}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-neutral-700 dark:text-neutral-200">
            {data.subject || "No Subject"}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-neutral-500 dark:text-neutral-400">
              From:
            </span>
            <span className="text-neutral-700 dark:text-neutral-300">
              {data.from}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-neutral-500 dark:text-neutral-400">To:</span>
            <span className="text-neutral-700 dark:text-neutral-300">
              {data.to.join(", ")}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2 h-full">
          <iframe
            srcDoc={data.body}
            className="w-full max-h-screen bg-white rounded-lg"
            onLoad={(e) => {
              // get height of iframe
              const iframe = e.target as HTMLIFrameElement;
              const height = iframe.contentWindow?.document.body.scrollHeight;
              if (!height) return;
              // set height of iframe
              iframe.style.height = `${height + 120}px`;
            }}
          />
        </div>
      </div>
    </main>
  );
}
