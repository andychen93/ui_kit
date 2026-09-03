export type MessageType = "success" | "error" | "warning" | "info";

let root: HTMLElement | null = null;

function ensureRoot() {
  if (typeof document === "undefined") return null;
  if (root?.isConnected) return root;
  root = document.createElement("div");
  root.className = "ag-message-root";
  document.body.appendChild(root);
  return root;
}

function show(type: MessageType, content: string, duration = 3000) {
  const host = ensureRoot();
  if (!host) return;
  const el = document.createElement("div");
  el.className = `ag-message ag-message--${type}`;
  el.setAttribute("role", "status");
  el.textContent = content;
  host.appendChild(el);
  window.setTimeout(() => {
    el.remove();
  }, duration);
}

export const message = {
  success: (content: string, duration?: number) => show("success", content, duration),
  error: (content: string, duration?: number) => show("error", content, duration),
  warning: (content: string, duration?: number) => show("warning", content, duration),
  info: (content: string, duration?: number) => show("info", content, duration),
};
