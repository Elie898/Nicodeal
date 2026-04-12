"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useSyncExternalStore } from "react";
import Navbar from "../../components/Navbar";
import { useCart } from "../../context/CartContext";

function subscribe() {
  return () => {};
}

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    totalItems,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  if (!isClient) return null;

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.pricePerCan * item.quantity,
    0,
  );

  const shippingCost = totalPrice >= 399 ? 0 : 69;
  const finalTotal = totalPrice + shippingCost;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-100 text-slate-900">
        <section className="mx-auto max-w-6xl px-6 py-10">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">
                Din beställning
              </p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">
                Varukorg
              </h1>
            </div>

            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
              >
                Töm varukorg
              </button>
            )}
          </div>

          {cartItems.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 shadow">
              <h2 className="text-2xl font-bold text-slate-900">
                Din varukorg är tom
              </h2>
              <p className="mt-3 text-slate-600">
                Lägg till produkter för att fortsätta.
              </p>

              <Link
                href="/products"
                className="mt-6 inline-block rounded-2xl bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-cyan-600"
              >
                Tillbaka till produkter
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <article
                    key={item.id}
                    className="flex flex-col gap-4 rounded-3xl bg-white p-5 shadow md:flex-row md:items-center"
                  >
                    <div className="flex h-36 w-full items-center justify-center rounded-2xl bg-slate-50 md:w-40">
                      {item.image?.url && (
                        <img
                          src={`http://localhost:1337${item.image.url}`}
                          alt={item.name}
                          className="h-28 w-full object-contain"
                        />
                      )}
                    </div>

                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-slate-900">
                        {item.name}
                      </h2>

                      <p className="mt-2 text-sm text-slate-600">
                        Pris per dosa: {item.pricePerCan} kr
                      </p>

                      <div className="mt-3 flex items-center gap-3">
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-lg font-bold text-slate-700 transition hover:bg-slate-100"
                        >
                          -
                        </button>

                        <span className="min-w-8 text-center text-sm font-semibold text-slate-900">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => increaseQuantity(item.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-lg font-bold text-slate-700 transition hover:bg-slate-100"
                        >
                          +
                        </button>
                      </div>

                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        Summa: {item.pricePerCan * item.quantity} kr
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      Ta bort
                    </button>
                  </article>
                ))}
              </div>

              <aside className="h-fit rounded-3xl bg-white p-6 shadow">
                <h2 className="text-xl font-bold text-slate-900">
                  Sammanfattning
                </h2>

                <div className="mt-5 space-y-3 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Antal produkter</span>
                    <span>{totalItems}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Varor</span>
                    <span>{totalPrice} kr</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Frakt</span>
                    <span>
                      {shippingCost === 0 ? "Fri frakt" : `${shippingCost} kr`}
                    </span>
                  </div>

                  <div className="flex justify-between text-base font-bold text-slate-900">
                    <span>Totalt</span>
                    <span>{finalTotal} kr</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="mt-6 block w-full rounded-2xl bg-slate-950 px-4 py-3 text-center font-semibold text-white transition hover:bg-cyan-600"
                >
                  Gå till kassan
                </Link>
              </aside>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
