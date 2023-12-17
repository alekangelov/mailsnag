"use client";
import { useEffect, useMemo } from "react";
import { create } from "zustand";
import { useQuery } from "./usePromise";

type Email = {
  id: number;
  headers: Record<string, string[]>;
  attachments: string[];
  from: string;
  to: string[];
  subject: string;
  body: string;
  read: boolean;
  time: number;
};

const createEvent = (
  url: string,
  onMessage: (data: any) => void,
  onError: (error: any) => void
) => {
  const eventSource = new EventSource(url);
  eventSource.onmessage = (event) => onMessage(JSON.parse(event.data));
  eventSource.onerror = (error) => onError(error);
  return eventSource;
};

export const useData = create<{
  data: Email[];
  setData: (data: any) => void;
  add: (email: Email) => void;
}>((set) => ({
  data: [],
  setData: set,
  add: (email: Email) =>
    set((state) => {
      const index = state.data.findIndex((e) => e.id === email.id);
      if (index !== -1) {
        const data = [...state.data];
        data[index] = email;
        return { data };
      }
      const data = [email, ...state.data];
      return { data };
    }),
}));

const fetchEmails = async () => {
  const res = await fetch(process.env.NEXT_PUBLIC_DATA_URL + "/emails");
  if (res.ok) {
    return res.json();
  }
  throw new Error("Failed to fetch emails");
};

const EMPTY_ARRAY = [] as [];

export const useCreateEventSource = (url: string) => {
  const { data, add } = useData();
  const x = useMemo(
    () => ({
      onSuccess: (data: Email[]) => {
        console.log(data);
        data.forEach(add);
      },
    }),
    [add]
  );
  useQuery(fetchEmails, EMPTY_ARRAY, x);

  useEffect(() => {
    const eventSource = createEvent(url, add, (error) => console.log(error));
    return () => eventSource.close();
  }, [add, url]);

  return data;
};

export const DataProvider = () => {
  if (!process.env.NEXT_PUBLIC_DATA_URL) {
    throw new Error("NEXT_PUBLIC_DATA_URL is not defined");
  }

  useCreateEventSource(process.env.NEXT_PUBLIC_DATA_URL + "/events");

  return <></>;
};
