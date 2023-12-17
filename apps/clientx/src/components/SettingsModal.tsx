"use client";
import { useSettings } from "@/hooks/useSettings";
import clsx from "clsx";
import Modal from "./Modal";

export const SETTINGS_MODAL_ID = "settings-modal";

const Setting = ({
  name,
  label,
  description,
  ...rest
}: {
  name: string;
  label: string;
  description?: string;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) => {
  return (
    <div className="flex flex-col gap-1 mb-4">
      <div className="flex items-center gap-2">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            name={name}
            className="sr-only peer"
            {...rest}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-400 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
          <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            {label}
          </span>
        </label>
      </div>
      <span className="text-sm text-neutral-500 dark:text-neutral-400">
        {description}
      </span>
    </div>
  );
};

export default function SettingsModal() {
  const { settings, setSettings } = useSettings();
  return (
    <Modal id={SETTINGS_MODAL_ID} title="Settings">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          const { systemTheme, darkTheme, notifications, sounds } =
            Object.fromEntries(formData.entries());
          console.log({ systemTheme, darkTheme, notifications, sounds });
          setSettings({
            systemTheme: systemTheme === "on",
            darkTheme: darkTheme === "on",
            notifications: notifications === "on",
            sounds: sounds === "on",
          });
          (
            document.querySelector(`#${SETTINGS_MODAL_ID}`) as HTMLDialogElement
          )?.close();
        }}
      >
        {/* <Setting
          name="systemTheme"
          label="System Mode"
          defaultChecked={settings.systemTheme}
          disabled
        />
        <Setting
          name="darkTheme"
          label="Dark Mode"
          defaultChecked={settings.darkTheme}
          disabled
        /> */}
        <Setting
          name="notifications"
          description={`Send a notification when you receive a new email.`}
          label="Notifications"
          defaultChecked={settings.notifications}
        />
        <Setting
          description={`Play a sound when you recieve an email.`}
          name="sounds"
          label="Sound"
          defaultChecked={settings.sounds}
        />
        <hr className="border-neutral-200 dark:border-neutral-800 mb-4" />
        <div className="flex justify-end">
          <button
            className={clsx(
              "bg-blue-500 hover:bg-blue-600 text-white font-bold",
              "py-2 px-6 rounded-lg"
            )}
            type="submit"
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
}
