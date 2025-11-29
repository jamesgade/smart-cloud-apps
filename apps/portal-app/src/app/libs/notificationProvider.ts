import { NotificationProvider,  } from "@refinedev/core";
import { toast, TypeOptions } from "react-toastify";

export const customNotificationProvider: NotificationProvider = {
  open: ({ message, key, type }) => {
    const toastType: TypeOptions = type === "progress" ? "info" : type;

    toast(message, {
      toastId: key,
      type: toastType,
    });
  },
  close(key) {
    toast.dismiss(key);
  },
};
