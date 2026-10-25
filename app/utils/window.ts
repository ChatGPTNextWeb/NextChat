/**
 * Multi-window support for the Tauri desktop app.
 *
 * Every window carries its own label (the main window is "main", additional
 * windows are "window-N"). The label is passed to the frontend through the
 * `window_label` query parameter so it can be read synchronously at module
 * init time — this is what allows each window to namespace its persisted
 * stores (see indexedDB-storage.ts) and therefore keep an independent
 * server configuration, as requested in #4886.
 *
 * This module intentionally has no app-internal imports to avoid circular
 * dependencies with the storage layer.
 */

const WINDOW_LABEL_PARAM = "window_label";
const MAIN_WINDOW_LABEL = "main";
const WINDOW_LABEL_PREFIX = "window-";
// Matches Tauri's label constraints and keeps the value safe for storage keys.
const LABEL_SAFE_CHARS = /[^a-zA-Z0-9_-]/g;

function sanitizeWindowLabel(label: string): string {
  return label.replace(LABEL_SAFE_CHARS, "");
}

/**
 * Returns the label of the current window. Falls back to "main" when the
 * parameter is absent (web builds, first window) or unreadable.
 */
export function getWindowLabel(): string {
  if (typeof window === "undefined") {
    return MAIN_WINDOW_LABEL;
  }
  try {
    const label = new URLSearchParams(window.location.search).get(
      WINDOW_LABEL_PARAM,
    );
    if (label) {
      return sanitizeWindowLabel(label);
    }
  } catch (e) {
    console.error("[Window] failed to read window label:", e);
  }
  return MAIN_WINDOW_LABEL;
}

export function isMainWindow(): boolean {
  return getWindowLabel() === MAIN_WINDOW_LABEL;
}

/**
 * Prefix applied to every persisted store key. The main window keeps the
 * historical unprefixed keys so existing user data is untouched; secondary
 * windows read/write their own isolated copies.
 */
export function getStoragePrefix(): string {
  const label = getWindowLabel();
  return label === MAIN_WINDOW_LABEL ? "" : `${label}::`;
}

/**
 * Opens a new app window with an independent configuration namespace.
 * Labels are recycled (window-2, window-3, ...): the smallest free index is
 * used, so reopening "the second window" after a restart restores the same
 * settings it had before.
 *
 * No-op outside the Tauri app.
 */
export async function openNewChatWindow(): Promise<void> {
  const tauri = typeof window !== "undefined" ? window.__TAURI__ : undefined;
  const tauriWindow = tauri?.window;
  if (!tauriWindow?.WebviewWindow) {
    return;
  }

  let label: string;
  let index = 0;
  try {
    const existing = new Set(
      (tauriWindow.getAll?.() ?? []).map((w) => w.label),
    );
    existing.add(MAIN_WINDOW_LABEL);
    index = 2;
    label = `${WINDOW_LABEL_PREFIX}${index}`;
    while (existing.has(label)) {
      index += 1;
      label = `${WINDOW_LABEL_PREFIX}${index}`;
    }
  } catch (e) {
    // getAll() unavailable (older allowlist) — fall back to a unique label.
    console.warn("[Window] failed to enumerate windows:", e);
    label = `${WINDOW_LABEL_PREFIX}${Date.now()}`;
  }

  const webview = new tauriWindow.WebviewWindow(label, {
    url: `/?${WINDOW_LABEL_PARAM}=${label}`,
    title: index > 0 ? `NextChat #${index}` : "NextChat",
    width: 960,
    height: 600,
    resizable: true,
    fullscreen: false,
  });

  await new Promise<void>((resolve) => {
    webview.once("tauri://created", () => resolve());
    webview.once("tauri://error", (e) => {
      console.error("[Window] failed to create window:", e);
      resolve();
    });
  });
}
