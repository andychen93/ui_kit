export type NotificationType = "primary" | "success" | "error" | "warning" | "info";

export interface NotificationOptions {
  title: string;
  content?: string;
  duration?: number;
  onClose?: () => void;
}

const ICON_PATHS: Record<NotificationType, string> = {
  primary:
    '<path d="M12 8v5M12 16.5v.5"/><circle cx="12" cy="12" r="9.2"/>',
  success:
    '<path d="m8 12.5 2.7 2.7L16.5 9.5"/>',
  error:
    '<path d="M9.5 9.5l5 5M14.5 9.5l-5 5"/><circle cx="12" cy="12" r="9.2"/>',
  warning:
    '<path d="M12 8v5M12 16.5v.5"/><path d="M12 3.5 21 19.5H3z"/>',
  info:
    '<path d="M12 8v.5M12 11v5"/><circle cx="12" cy="12" r="9.2"/>',
};

let root: HTMLElement | null = null;

function ensureRoot() {
  if (typeof document === "undefined") return null;
  if (root?.isConnected) return root;
  root = document.createElement("div");
  root.className = "ag-notification-container";
  document.body.appendChild(root);
  return root;
}

function iconSvg(type: NotificationType) {
  return `<svg class="ag-notification__icon ag-notification__icon--${type}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATHS[type]}</svg>`;
}

function show(type: NotificationType, options: NotificationOptions) {
  const host = ensureRoot();
  if (!host) return;
  const duration = options.duration ?? 4500;

  const el = document.createElement("div");
  el.className = `ag-notification ag-notification--${type}`;
  el.setAttribute("role", "alert");

  const accent = document.createElement("span");
  accent.className = "ag-notification__accent";
  el.appendChild(accent);

  el.insertAdjacentHTML("beforeend", iconSvg(type));

  const main = document.createElement("div");
  main.className = "ag-notification__main";
  const title = document.createElement("p");
  title.className = "ag-notification__title";
  title.textContent = options.title;
  main.appendChild(title);
  if (options.content) {
    const content = document.createElement("p");
    content.className = "ag-notification__content";
    content.textContent = options.content;
    main.appendChild(content);
  }
  el.appendChild(main);

  const close = document.createElement("button");
  close.className = "ag-notification__close";
  close.type = "button";
  close.setAttribute("aria-label", "close");
  close.textContent = "×";
  el.appendChild(close);

  let closed = false;
  const dismiss = () => {
    if (closed) return;
    closed = true;
    el.classList.add("is-closing");
    window.setTimeout(() => el.remove(), 200);
    options.onClose?.();
  };

  close.addEventListener("click", dismiss);
  if (duration > 0) window.setTimeout(dismiss, duration);

  host.appendChild(el);
}

export const notification = {
  primary: (options: NotificationOptions) => show("primary", options),
  success: (options: NotificationOptions) => show("success", options),
  error: (options: NotificationOptions) => show("error", options),
  warning: (options: NotificationOptions) => show("warning", options),
  info: (options: NotificationOptions) => show("info", options),
};
