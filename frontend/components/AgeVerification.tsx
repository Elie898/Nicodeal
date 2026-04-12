"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot() {
  if (typeof window === "undefined") return true;
  return !window.localStorage.getItem("ageVerified");
}

function getServerSnapshot() {
  return false;
}

export default function AgeVerification() {
  const isOpen = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const handleAccept = () => {
    window.localStorage.setItem("ageVerified", "true");
    window.dispatchEvent(new Event("storage"));
  };

  const handleDecline = () => {
    window.location.href = "https://www.google.com";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-slate-900">
          18+ Ålderskontroll
        </h2>

        <p className="mt-4 text-sm leading-6 text-slate-600">
          Denna webbplats innehåller nikotinprodukter och är endast avsedd för
          personer som är 18 år eller äldre.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleAccept}
            className="flex-1 rounded-2xl bg-slate-950 px-4 py-3 font-semibold text-white transition hover:bg-cyan-600"
          >
            Jag är 18+
          </button>

          <button
            onClick={handleDecline}
            className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Jag är under 18
          </button>
        </div>
      </div>
    </div>
  );
}
