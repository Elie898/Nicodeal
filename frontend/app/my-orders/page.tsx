"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";

type OrderItem = {
  id?: number;
  productName: string;
  purchaseType: string;
  quantity: number;
  unitPrice: number;
  imageUrl: string;
};

type Order = {
  id: number;
  documentId: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  customerPhone?: string | null;
  totalPrice: number;
  orderStatus: string;
  orderItems?: OrderItem[];
  createdAt?: string;
};

export default function MyOrdersPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    setAuthorized(true);
  }, [router]);

  useEffect(() => {
    if (!authorized) return;

    const fetchMyOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:1337/api/orders/my-orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data?.error?.message || "Kunde inte hämta beställningar.",
          );
        }

        setOrders(data.data || []);
      } catch (err) {
        console.error(err);
        setError("Något gick fel när dina beställningar skulle hämtas.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [authorized]);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Väntar";
      case "confirmed":
        return "Bekräftad";
      case "shipped":
        return "Skickad";
      case "completed":
        return "Slutförd";
      default:
        return status;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const pendingCount = orders.filter(
    (order) => order.orderStatus === "pending",
  ).length;

  const shippedCount = orders.filter(
    (order) => order.orderStatus === "shipped",
  ).length;

  const completedCount = orders.filter(
    (order) => order.orderStatus === "completed",
  ).length;

  const toggleOrder = (orderId: number) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  if (!authorized || loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-slate-100 px-6 py-10 text-slate-900">
          <section className="mx-auto max-w-6xl rounded-3xl bg-white p-8 shadow">
            Laddar dina beställningar...
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-100 px-6 py-10 text-slate-900">
        <section className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
                Kundkonto
              </p>
              <h1 className="mt-2 text-4xl font-extrabold text-slate-900">
                Mina beställningar
              </h1>
              <p className="mt-3 max-w-2xl text-slate-600">
                Här ser du dina tidigare beställningar och status.
              </p>
            </div>

            <div className="rounded-2xl bg-white px-5 py-4 shadow">
              <p className="text-sm text-slate-500">Antal beställningar</p>
              <p className="text-2xl font-bold text-slate-900">
                {orders.length}
              </p>
            </div>
          </div>

          {!error && orders.length > 0 && (
            <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl bg-white p-5 shadow">
                <p className="text-sm text-slate-500">Totala beställningar</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {orders.length}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow">
                <p className="text-sm text-slate-500">Väntar</p>
                <p className="mt-2 text-2xl font-bold text-yellow-700">
                  {pendingCount}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow">
                <p className="text-sm text-slate-500">Skickade</p>
                <p className="mt-2 text-2xl font-bold text-purple-700">
                  {shippedCount}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow">
                <p className="text-sm text-slate-500">Slutförda</p>
                <p className="mt-2 text-2xl font-bold text-emerald-700">
                  {completedCount}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-3xl bg-white p-8 shadow">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {!error && orders.length === 0 && (
            <div className="rounded-3xl bg-white p-10 shadow">
              <h2 className="text-2xl font-bold text-slate-900">
                Du har inga beställningar ännu
              </h2>
              <p className="mt-3 text-slate-600">
                När du har gjort ett köp kommer dina beställningar att visas
                här.
              </p>
              <Link
                href="/products"
                className="mt-6 inline-block rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-cyan-600"
              >
                Se produkter
              </Link>
            </div>
          )}

          <div className="space-y-6">
            {orders.map((order) => {
              const isExpanded = expandedOrderId === order.id;

              return (
                <article
                  key={order.id}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md"
                >
                  <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
                          Order #{order.id}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleString("sv-SE")
                            : ""}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`rounded-full border px-4 py-2 text-sm font-semibold ${getStatusStyle(order.orderStatus)}`}
                        >
                          {getStatusLabel(order.orderStatus)}
                        </span>

                        <span className="rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-800">
                          Totalt: {order.totalPrice} kr
                        </span>

                        <button
                          onClick={() => toggleOrder(order.id)}
                          className="rounded-full bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-300"
                        >
                          {isExpanded ? "Dölj detaljer" : "Visa detaljer"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="grid gap-8 px-6 py-6 lg:grid-cols-[1fr_2fr]">
                      <div className="rounded-2xl bg-slate-50 p-5">
                        <h2 className="text-lg font-bold text-slate-900">
                          Leveransuppgifter
                        </h2>

                        <div className="mt-4 space-y-3 text-sm text-slate-700">
                          <p>
                            <span className="font-semibold">Namn:</span>{" "}
                            {order.customerName}
                          </p>
                          <p>
                            <span className="font-semibold">Email:</span>{" "}
                            {order.customerEmail}
                          </p>
                          <p>
                            <span className="font-semibold">Adress:</span>{" "}
                            {order.customerAddress}
                          </p>
                          <p>
                            <span className="font-semibold">Telefon:</span>{" "}
                            {order.customerPhone || "Ej angivet"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h2 className="mb-4 text-lg font-bold text-slate-900">
                          Produkter
                        </h2>

                        <div className="space-y-4">
                          {order.orderItems?.map((item, index) => (
                            <div
                              key={item.id ?? `${order.id}-${index}`}
                              className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 md:flex-row md:items-center"
                            >
                              <div className="flex h-24 w-full items-center justify-center rounded-2xl bg-slate-50 md:w-28">
                                {item.imageUrl ? (
                                  <img
                                    src={`http://localhost:1337${item.imageUrl}`}
                                    alt={item.productName}
                                    className="h-20 w-full object-contain"
                                  />
                                ) : (
                                  <span className="text-sm text-slate-400">
                                    Ingen bild
                                  </span>
                                )}
                              </div>

                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-slate-900">
                                  {item.productName}
                                </h3>

                                <div className="mt-2 flex flex-wrap gap-2">
                                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                    {item.purchaseType}
                                  </span>

                                  <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-800">
                                    Antal: {item.quantity}
                                  </span>

                                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                                    Styckpris: {item.unitPrice} kr
                                  </span>
                                </div>
                              </div>

                              <div className="text-right">
                                <p className="text-sm text-slate-500">
                                  Radtotal
                                </p>
                                <p className="text-lg font-bold text-slate-900">
                                  {item.unitPrice * item.quantity} kr
                                </p>
                              </div>
                            </div>
                          ))}

                          {(!order.orderItems ||
                            order.orderItems.length === 0) && (
                            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                              Inga orderrader hittades.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}
