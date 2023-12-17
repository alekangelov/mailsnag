import { create } from "zustand";
import { persist } from "zustand/middleware";

type Settings = {
  systemTheme: boolean;
  darkTheme: boolean;
  notifications: boolean;
  sounds: boolean;
};

type Action = <T extends keyof Settings>(name: T, value: Settings[T]) => void;

export const useSettings = create(
  persist<{
    settings: Settings;
    setSetting: Action;
    setSettings: (settings: Settings) => void;
  }>(
    (set) => ({
      settings: {
        systemTheme: true,
        darkTheme: false,
        notifications: true,
        sounds: true,
      },
      setSetting: (name, value) =>
        set((state) => ({
          settings: {
            ...state.settings,
            [name]: value,
          },
        })),
      setSettings: (settings) => {
        if (settings.notifications) {
          console.log("ask for permissions");
          Notification.requestPermission((permission) => {
            if (permission === "granted") {
              console.log("Notifications granted");
            }
          });
        }

        set({
          settings,
        });
      },
    }),
    {
      name: "mailsnag-settings",
    }
  )
);
