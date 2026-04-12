"use client";

import { useSyncExternalStore } from "react";
import { useCart } from "../context/CartContext";

function subscribe() {
  return () => {};
}

export default function CartCount() {
  const { totalItems } = useCart();

  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  if (!isClient) return null;
  if (totalItems === 0) return null;

  return (
    <span className="ml-2 inline-flex min-w-6 items-center justify-center rounded-full bg-cyan-500 px-2 py-0.5 text-xs font-bold text-slate-950">
      {totalItems}
    </span>
  );
}
