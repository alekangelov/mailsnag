/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo } from "react";
import { create } from "zustand";
import { useQuery } from "./usePromise";
import { useSettings } from "./useSettings";

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

const shouldSendSound = () => useSettings.getState().settings.sounds;
const shouldSendNotification = () =>
  useSettings.getState().settings.notifications;

const createEvent = (
  url: string,
  onMessage: (data: any) => void,
  onError: (error: any) => void
) => {
  const eventSource = new EventSource(url);
  const audio = new Audio("/notification.mp3");
  let audioIsPlaying = false;
  let notificationTimeout: number | null = null;
  let notificationsInQueue = 0;

  const xE = () => {
    audioIsPlaying = false;
  };

  audio.addEventListener("ended", xE);
  eventSource.onmessage = (event) => {
    try {
      const m = JSON.parse(event.data);
      try {
        if (shouldSendSound() && !audioIsPlaying && audio) {
          audio.currentTime = 0;
          audio.play();
        }
        if (shouldSendNotification()) {
          if (notificationTimeout) {
            notificationsInQueue++;
            clearTimeout(notificationTimeout);
          }
          notificationTimeout = setTimeout(() => {
            new Notification("New Email", {
              body: `Recieved an email from: ${m.from} and ${notificationsInQueue} more.}`,
            });
            notificationsInQueue = 0;
          }, 1000);
        }
      } catch {
        console.log("Failed to send notification");
      }
      onMessage(m);
    } catch (e) {
      console.error(e);
    }
  };
  eventSource.onerror = (error) => onError(error);
  return () => {
    eventSource.close?.();
    audio.removeEventListener("ended", xE);
    audio.remove();
  };
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
  const res = await fetch(import.meta.env.VITE_DATA_URL + "/emails");
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
        data.forEach(add);
      },
    }),
    [add]
  );
  useQuery(fetchEmails, EMPTY_ARRAY, x);

  useEffect(() => {
    return createEvent(url, add, (error) => console.log(error));
  }, [add, url]);

  return data;
};

export const DataProvider = () => {
  if (!import.meta.env.VITE_DATA_URL) {
    throw new Error("import.meta.env.VITE_DATA_URL is not defined");
  }

  useCreateEventSource(import.meta.env.VITE_DATA_URL + "/events");

  return null;
};
