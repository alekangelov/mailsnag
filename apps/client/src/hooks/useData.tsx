"use client";
import { useEffect } from "react";
import { create } from "zustand";

const dummyEmail = {
  ID: 6,
  Headers: {
    Received: [
      "from localhost (localhost [127.0.0.1]) by Alek-Desktop (MailSnag) with SMTP for \u003csome@email.com\u003e; Sat, 16 Dec 2023 22:35:21 +0100 (CET)",
    ],
    To: ["some@email.comSubject: discount Gophers!"],
  },
  Attachments: [],
  From: "example@email.com",
  To: ["some@email.com"],
  Subject: "",
  Body: "This is the email body.\r\n",
};

type Email = {
  ID: number;
  Headers: Record<string, string[]>;
  Attachments: string[];
  From: string;
  To: string[];
  Subject: string;
  Body: string;
};

const createEvent = (
  url: string,
  onMessage: (data: any) => void,
  onError: (error: any) => void
) => {
  const eventSource = new EventSource(url);
  eventSource.onmessage = (event) => onMessage(event.data);
  eventSource.onerror = (error) => onError(error);
  return eventSource;
};

const useData = create<{
  data: Email[];
  setData: (data: any) => void;
  add: (email: Email) => void;
}>((set) => ({
  data: [],
  setData: set,
  add: (email: Email) => set((state) => ({ data: [...state.data, email] })),
}));

export const useCreateEventSource = (url: string) => {
  const { data, add } = useData();

  useEffect(() => {
    const eventSource = createEvent(url, add, (error) => console.log(error));
    return () => eventSource.close();
  }, [add, url]);
  console.log(data);
  return data;
};

export const DataProvider = () => {
  if (!process.env.NEXT_PUBLIC_DATA_URL) {
    throw new Error("NEXT_PUBLIC_DATA_URL is not defined");
  }

  useCreateEventSource(process.env.NEXT_PUBLIC_DATA_URL);

  return <></>;
};
