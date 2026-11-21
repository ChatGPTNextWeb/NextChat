import { create } from "zustand";

export type Account = { username: string; balanceUsd: number };
type AccountResult = { user?: Account | null; error?: string };

export async function accountRequest(
  action: "send-code" | "register" | "login" | "redeem" | "logout",
  body: object = {},
) {
  const response = await fetch("/api/account/" + action, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const data: AccountResult = await response.json();
  if (!response.ok) {
    if (action === "redeem" && response.status === 401) {
      useAccountStore.getState().setUser(null);
    }
    throw new Error(data.error || "服务暂时不可用，请稍后再试。");
  }
  return data;
}

let pending: Promise<void> | undefined;
let revision = 0;

export const useAccountStore = create<{
  user: Account | null;
  ready: boolean;
  error: boolean;
  setUser: (user: Account | null) => void;
  refresh: () => Promise<void>;
}>((set) => ({
  user: null,
  ready: false,
  error: false,
  setUser(user) {
    revision++;
    pending = undefined;
    set({ user, ready: true, error: false });
  },
  refresh() {
    if (pending) return pending;
    const version = revision;
    const operation = (async () => {
      try {
        const response = await fetch("/api/account/me", { cache: "no-store" });
        if (!response.ok && response.status !== 401) throw new Error();
        const data: AccountResult = await response.json();
        if (version === revision)
          set({ user: data.user ?? null, ready: true, error: false });
      } catch {
        if (version === revision) set({ ready: true, error: true });
      }
    })().finally(() => {
      if (pending === operation) pending = undefined;
    });
    pending = operation;
    return operation;
  },
}));
