"use client";
import { useEffect } from "react";
import { useSyncStore } from "./store/sync";
import { showToast } from "./components/ui-lib";
export default function SyncOnFirstLoad() {
  const syncStore = useSyncStore();

  useEffect(() => {
    // Parse cookies using the cookie library
    // const cookies = cookie.parse(document.cookie || "");
    // const authToken = cookies["sb-zzgkylsbdgwoohcbompi-auth-token"] || null;

    console.log("[Auth Check] Checking user authentication status");

    fetch("/api/auth/check")
      .then((res) => {
        if (res.status === 401) {
          console.log("[Auth Check] User is not authenticated");
          // Handle unauthenticated user - redirect or show login modal

          showToast("Please login first");

          //   setTimeout(() => {
          //     window.location.href = AUTHEN_PAGE;
          //   }, 500);

          return;
        }

        return res.json();
      })
      .then((data) => {
        if (data) {
          console.log("[Auth Check] User is authenticated:", data.user);

          // Assuming data.user contains the user information(user email)
          const email = data.user.email || "";

          // Only update upstash.username, keep other params
          syncStore.update((config) => (config.upstash.username = email));

          // You can now use the user data as needed
          //   syncStore.sync();
          // console.log("[Sync] User data synced successfully");
        }
      })
      .catch((e) => {
        console.error("[Auth Check] Error checking authentication:", e);
        // Handle error appropriately
      });
  }, []);

  return null;
}
