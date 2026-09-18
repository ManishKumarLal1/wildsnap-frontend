export type ToastType =
  | "success"
  | "error"
  | "warning"
  | "info";

export interface ToastData {
  title: string;
  message?: string;
  type: ToastType;
  duration?: number;
}

type ToastListener = (
  toast: ToastData
) => void;

const listeners = new Set<ToastListener>();

export function addToastListener(
  listener: ToastListener
) {
  listeners.add(listener);
}

export function removeToastListener(
  listener: ToastListener
) {
  listeners.delete(listener);
}

export function showToast(
  title: string,
  message?: string,
  type: ToastType = "success",
  duration = 3000
) {
  const toast: ToastData = {
    title,
    message,
    type,
    duration,
  };

  listeners.forEach((listener) => {
    listener(toast);
  });
}

export const Toast = {
  success(
    title: string,
    message?: string
  ) {
    showToast(
      title,
      message,
      "success"
    );
  },

  error(
    title: string,
    message?: string
  ) {
    showToast(
      title,
      message,
      "error"
    );
  },

  warning(
    title: string,
    message?: string
  ) {
    showToast(
      title,
      message,
      "warning"
    );
  },

  info(
    title: string,
    message?: string
  ) {
    showToast(
      title,
      message,
      "info"
    );
  },
};