"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";

type OrderItem = {
  id: number;
  productName: string;
  purchaseType: string;
  quantity: number;
  unitPrice: number;
  imageUrl?: string;
};

type Order = {
  id: number;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  customerPhone?: string | null;
  totalPrice: number;
  orderStatus: string;
  orderItems: OrderItem[];
};

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError("Inget ordernummer hittades.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:1337/api/orders?filters[id][$eq]=${orderId}&populate=*`,
          {
            cache: "no-store",
          },
        );

        if (!res.ok) {
          throw new Error("Kunde inte hämta ordern.");
        }

        const data = await res.json();
        const foundOrder = data.data?.[0];

        if (!foundOrder) {
          setError("Ordern kunde inte hittas.");
        } else {
          setOrder(foundOrder);
        }
      } catch (err) {
        console.error(err);
        setError("Något gick fel när ordern skulle hämtas.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-100 px-6 py-16 text-slate-900">
        <div className="mx-auto max-w-4xl rounded-3xl bg-white p-10 shadow-lg">
          {loading ? (
            <div className="text-center">
              <p className="text-lg font-medium">Laddar orderbekräftelse...</p>
            </div>
          ) : error ? (
            <div className="text-center">
              <h1 className="text-3xl font-bold text-slate-900">
                Kunde inte visa ordern
              </h1>
              <p className="mt-4 text-slate-600">{error}</p>

              <div className="mt-8">
                <Link
                  href="/"
                  className="rounded-2xl bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-cyan-600"
                >
                  Tillbaka till startsidan
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                  <span className="text-4xl">✓</span>
                </div>

                <h1 className="text-4xl font-bold text-slate-900">
                  Tack för din beställning!
                </h1>

                <p className="mt-4 text-lg text-slate-700">
                  Ordernummer: <span className="font-bold">#{order?.id}</span>
                </p>

                <p className="mt-4 text-slate-600">
                  Din beställning har mottagits och behandlas så snart som
                  möjligt.
                </p>
              </div>

              <div className="mt-10 grid gap-8 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-6">
                  <h2 className="mb-4 text-xl font-semibold">Kunduppgifter</h2>

                  <div className="space-y-3 text-sm text-slate-700">
                    <p>
                      <span className="font-semibold">Namn:</span>{" "}
                      {order?.customerName}
                    </p>
                    <p>
                      <span className="font-semibold">Email:</span>{" "}
                      {order?.customerEmail}
                    </p>
                    <p>
                      <span className="font-semibold">Adress:</span>{" "}
                      {order?.customerAddress}
                    </p>
                    <p>
                      <span className="font-semibold">Telefon:</span>{" "}
                      {order?.customerPhone || "Ej angivet"}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-6">
                  <h2 className="mb-4 text-xl font-semibold">
                    Orderinformation
                  </h2>

                  <div className="space-y-3 text-sm text-slate-700">
                    <p>
                      <span className="font-semibold">Status:</span>{" "}
                      <span className="capitalize">{order?.orderStatus}</span>
                    </p>
                    <p>
                      <span className="font-semibold">Totalt:</span>{" "}
                      {order?.totalPrice} kr
                    </p>
                    <p>
                      <span className="font-semibold">Antal produkter:</span>{" "}
                      {order?.orderItems?.length || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h2 className="mb-4 text-2xl font-bold text-slate-900">
                  Produkter i ordern
                </h2>

                <div className="space-y-4">
                  {order?.orderItems?.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          {item.productName}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {item.purchaseType} • Antal: {item.quantity}
                        </p>
                      </div>

                      <p className="text-sm font-bold text-slate-900">
                        {item.unitPrice * item.quantity} kr
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10 text-center">
                <Link
                  href="/"
                  className="rounded-2xl bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-cyan-600"
                >
                  Tillbaka till startsidan
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
