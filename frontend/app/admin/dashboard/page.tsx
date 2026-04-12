"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Order = {
  id: number;
  totalPrice: number;
  orderStatus: string;
  customerName?: string;
  customerEmail?: string;
  createdAt?: string;
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [authorized, setAuthorized] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedIn = localStorage.getItem("adminLoggedIn");

    if (loggedIn !== "true") {
      router.push("/admin/login");
      return;
    }

    setAuthorized(true);
  }, [router]);

  useEffect(() => {
    if (!authorized) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(
          "http://localhost:1337/api/orders?sort=createdAt:desc",
          {
            cache: "no-store",
          },
        );

        if (!res.ok) {
          throw new Error("Kunde inte hämta orders");
        }

        const data = await res.json();
        setOrders(data.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [authorized]);

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    router.push("/admin/login");
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

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

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

  const pending = orders.filter((o) => o.orderStatus === "pending").length;
  const confirmed = orders.filter((o) => o.orderStatus === "confirmed").length;
  const shipped = orders.filter((o) => o.orderStatus === "shipped").length;
  const completed = orders.filter((o) => o.orderStatus === "completed").length;

  const latestOrders = useMemo(() => {
    return [...orders].slice(0, 5);
  }, [orders]);

  const revenuePerDayData = useMemo(() => {
    const revenueMap = new Map<string, number>();

    orders.forEach((order) => {
      if (!order.createdAt) return;

      const rawDate = new Date(order.createdAt);
      const key = rawDate.toISOString().split("T")[0];
      const currentValue = revenueMap.get(key) || 0;

      revenueMap.set(key, currentValue + order.totalPrice);
    });

    return Array.from(revenueMap.entries())
      .map(([isoDate, revenue]) => {
        const d = new Date(isoDate);
        const formattedDate = d.toLocaleDateString("sv-SE", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });

        return {
          isoDate,
          date: formattedDate,
          revenue,
        };
      })
      .sort(
        (a, b) => new Date(a.isoDate).getTime() - new Date(b.isoDate).getTime(),
      );
  }, [orders]);

  if (!authorized || loading) {
    return (
      <main className="min-h-screen bg-slate-100 px-6 py-10">
        <div className="mx-auto max-w-7xl rounded-3xl bg-white p-8 shadow">
          Laddar dashboard...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950 text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <Link
              href="/admin/dashboard"
              className="text-2xl font-extrabold tracking-wide text-cyan-400"
            >
              Nicodeal
            </Link>
            <p className="text-xs text-slate-400">Admin – Dashboard</p>
          </div>

          <nav className="hidden gap-6 text-sm font-medium md:flex">
            <Link
              href="/admin/dashboard"
              className={`transition ${
                pathname === "/admin/dashboard"
                  ? "text-cyan-400"
                  : "hover:text-cyan-400"
              }`}
            >
              Dashboard
            </Link>

            <Link
              href="/admin/orders"
              className={`transition ${
                pathname === "/admin/orders"
                  ? "text-cyan-400"
                  : "hover:text-cyan-400"
              }`}
            >
              Orders
            </Link>

            <button
              onClick={handleLogout}
              className="transition hover:text-cyan-400"
            >
              Logga ut
            </button>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
            Adminpanel
          </p>
          <h1 className="mt-2 text-4xl font-extrabold text-slate-900">
            Dashboard
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Här ser du en snabb översikt över beställningar och omsättning.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">Totala orders</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {orders.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">Väntar</p>
            <p className="mt-2 text-2xl font-bold text-yellow-700">{pending}</p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">Bekräftade</p>
            <p className="mt-2 text-2xl font-bold text-blue-700">{confirmed}</p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">Skickade</p>
            <p className="mt-2 text-2xl font-bold text-purple-700">{shipped}</p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">Slutförda</p>
            <p className="mt-2 text-2xl font-bold text-emerald-700">
              {completed}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-white p-5 shadow">
          <p className="text-sm text-slate-500">Total omsättning</p>
          <p className="mt-2 text-3xl font-bold text-cyan-700">
            {totalRevenue} kr
          </p>
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl bg-white p-6 shadow">
            <h2 className="text-2xl font-bold text-slate-900">Omsättning</h2>
            <p className="mt-2 text-slate-600">
              Här ser du omsättning per dag. Datum visas som dag/månad/år.
            </p>

            <div className="mt-6 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenuePerDayData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                Senaste ordrar
              </h2>
              <Link
                href="/admin/orders"
                className="text-sm font-semibold text-cyan-700 hover:underline"
              >
                Visa alla
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              {latestOrders.length === 0 && (
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                  Inga ordrar hittades.
                </div>
              )}

              {latestOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-900">
                        Order #{order.id}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {order.customerName || "Okänd kund"}
                      </p>
                      <p className="text-sm text-slate-500">
                        {order.customerEmail || "Ingen email"}
                      </p>
                      {order.createdAt && (
                        <p className="mt-1 text-xs text-slate-500">
                          {new Date(order.createdAt).toLocaleString("sv-SE")}
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(order.orderStatus)}`}
                      >
                        {getStatusLabel(order.orderStatus)}
                      </span>
                      <p className="mt-2 text-sm font-bold text-slate-900">
                        {order.totalPrice} kr
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
