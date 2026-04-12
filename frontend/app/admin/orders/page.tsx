"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

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

export default function AdminOrdersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

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
          "http://localhost:1337/api/orders?populate=orderItems&sort=createdAt:desc",
          { cache: "no-store" },
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

  const handleStatusChange = async (
    orderId: number,
    documentId: string,
    newStatus: string,
  ) => {
    try {
      const res = await fetch(
        `http://localhost:1337/api/orders/${documentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              orderStatus: newStatus,
            },
          }),
        },
      );

      if (!res.ok) {
        throw new Error("Kunde inte uppdatera status");
      }

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, orderStatus: newStatus } : order,
        ),
      );
    } catch (error) {
      console.error(error);
      alert("Det gick inte att uppdatera status");
    }
  };

  const handleDeleteOrder = async (orderId: number, documentId: string) => {
    const confirmed = window.confirm("Vill du verkligen ta bort ordern?");
    if (!confirmed) return;

    try {
      const res = await fetch(
        `http://localhost:1337/api/orders/${documentId}`,
        {
          method: "DELETE",
        },
      );

      if (!res.ok) {
        throw new Error("Kunde inte ta bort ordern");
      }

      setOrders((prev) => prev.filter((order) => order.id !== orderId));

      if (expandedOrderId === orderId) {
        setExpandedOrderId(null);
      }
    } catch (error) {
      console.error(error);
      alert("Det gick inte att ta bort ordern");
    }
  };

  const toggleOrder = (orderId: number) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
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

  const pendingCount = orders.filter(
    (order) => order.orderStatus === "pending",
  ).length;

  const shippedCount = orders.filter(
    (order) => order.orderStatus === "shipped",
  ).length;

  const completedCount = orders.filter(
    (order) => order.orderStatus === "completed",
  ).length;

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

  const filteredOrders = useMemo(() => {
    const now = new Date();

    const filtered = orders.filter((order) => {
      const customerName = (order.customerName || "").toLowerCase();
      const searchLower = searchTerm.trim().toLowerCase();

      const statusMatch =
        statusFilter === "all" || order.orderStatus === statusFilter;

      let dateMatch = true;

      if (order.createdAt && dateFilter !== "all") {
        const orderDate = new Date(order.createdAt);

        if (dateFilter === "today") {
          dateMatch =
            orderDate.getFullYear() === now.getFullYear() &&
            orderDate.getMonth() === now.getMonth() &&
            orderDate.getDate() === now.getDate();
        } else if (dateFilter === "last7days") {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(now.getDate() - 7);
          dateMatch = orderDate >= sevenDaysAgo;
        } else if (dateFilter === "thisMonth") {
          dateMatch =
            orderDate.getFullYear() === now.getFullYear() &&
            orderDate.getMonth() === now.getMonth();
        }
      }

      const searchMatch =
        searchLower === "" || customerName.includes(searchLower);

      return statusMatch && dateMatch && searchMatch;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.createdAt || "").getTime() -
          new Date(a.createdAt || "").getTime()
        );
      }

      if (sortBy === "oldest") {
        return (
          new Date(a.createdAt || "").getTime() -
          new Date(b.createdAt || "").getTime()
        );
      }

      if (sortBy === "highestPrice") {
        return b.totalPrice - a.totalPrice;
      }

      if (sortBy === "lowestPrice") {
        return a.totalPrice - b.totalPrice;
      }

      return 0;
    });
  }, [orders, statusFilter, dateFilter, searchTerm, sortBy]);

  const filteredRevenue = filteredOrders.reduce(
    (sum, order) => sum + order.totalPrice,
    0,
  );

  if (!authorized || loading) {
    return (
      <main className="min-h-screen bg-slate-100 px-6 py-10">
        <div className="mx-auto max-w-7xl rounded-3xl bg-white p-8 shadow">
          Laddar adminpanel...
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
              href="/admin/orders"
              className="text-2xl font-extrabold tracking-wide text-cyan-400"
            >
              Nicodeal
            </Link>
            <p className="text-xs text-slate-400">Admin – Orders</p>
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
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
              Adminpanel
            </p>
            <h1 className="mt-2 text-4xl font-extrabold text-slate-900">
              Beställningar
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Här visas alla ordrar från Strapi med kunduppgifter, status och
              beställda produkter.
            </p>
          </div>

          <div className="rounded-2xl bg-white px-5 py-4 shadow">
            <p className="text-sm text-slate-500">Totalt antal ordrar</p>
            <p className="text-2xl font-bold text-slate-900">{orders.length}</p>
          </div>
        </div>

        {orders.length > 0 && (
          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
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

            <div className="rounded-2xl bg-white p-5 shadow">
              <p className="text-sm text-slate-500">Total omsättning</p>
              <p className="mt-2 text-2xl font-bold text-cyan-700">
                {totalRevenue} kr
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow">
              <p className="text-sm text-slate-500">Filtrerad omsättning</p>
              <p className="mt-2 text-2xl font-bold text-cyan-700">
                {filteredRevenue} kr
              </p>
            </div>
          </div>
        )}

        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-600">
            Visar {filteredOrders.length} av {orders.length} beställningar
          </p>
        </div>

        <div className="mb-8 grid gap-4 rounded-2xl bg-white p-5 shadow md:grid-cols-4">
          <div>
            <p className="mb-2 text-sm text-slate-500">Sök kund</p>
            <input
              type="text"
              placeholder="Sök namn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none"
            />
          </div>

          <div>
            <p className="mb-2 text-sm text-slate-500">Filtrera på status</p>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none"
            >
              <option value="all">Alla statusar</option>
              <option value="pending">Väntar</option>
              <option value="confirmed">Bekräftad</option>
              <option value="shipped">Skickad</option>
              <option value="completed">Slutförd</option>
            </select>
          </div>

          <div>
            <p className="mb-2 text-sm text-slate-500">Filtrera på datum</p>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none"
            >
              <option value="all">Alla datum</option>
              <option value="today">Idag</option>
              <option value="last7days">Senaste 7 dagarna</option>
              <option value="thisMonth">Denna månad</option>
            </select>
          </div>

          <div>
            <p className="mb-2 text-sm text-slate-500">Sortera</p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none"
            >
              <option value="newest">Senaste först</option>
              <option value="oldest">Äldsta först</option>
              <option value="highestPrice">Högst pris</option>
              <option value="lowestPrice">Lägst pris</option>
            </select>
          </div>
        </div>

        {filteredOrders.length === 0 && (
          <div className="rounded-3xl bg-white p-8 shadow">
            Inga ordrar hittades för de valda filtren.
          </div>
        )}

        <div className="space-y-8">
          {filteredOrders.map((order) => {
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
                      <h2 className="mt-1 text-2xl font-bold text-slate-900">
                        {order.customerName}
                      </h2>
                      <p className="mt-1 text-sm text-slate-600">
                        {order.customerEmail}
                      </p>
                      {order.createdAt && (
                        <p className="mt-1 text-xs text-slate-500">
                          Skapad:{" "}
                          {new Date(order.createdAt).toLocaleString("sv-SE")}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          handleStatusChange(
                            order.id,
                            order.documentId,
                            e.target.value,
                          )
                        }
                        className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 outline-none"
                      >
                        <option value="pending">Väntar</option>
                        <option value="confirmed">Bekräftad</option>
                        <option value="shipped">Skickad</option>
                        <option value="completed">Slutförd</option>
                      </select>

                      <button
                        onClick={() => toggleOrder(order.id)}
                        className="rounded-full bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-300"
                      >
                        {isExpanded ? "Dölj detaljer" : "Visa detaljer"}
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteOrder(order.id, order.documentId)
                        }
                        className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                      >
                        Ta bort
                      </button>

                      <div
                        className={`rounded-full px-4 py-2 text-sm font-semibold ${getStatusStyle(order.orderStatus)}`}
                      >
                        {getStatusLabel(order.orderStatus)}
                      </div>

                      <div className="rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-800">
                        Totalt: {order.totalPrice} kr
                      </div>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="grid gap-8 px-6 py-6 lg:grid-cols-[1fr_2fr]">
                    <div className="rounded-2xl bg-slate-50 p-5">
                      <h3 className="text-lg font-bold text-slate-900">
                        Kunduppgifter
                      </h3>

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
                        <p>
                          <span className="font-semibold">Status:</span>{" "}
                          <span
                            className={`ml-2 rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(order.orderStatus)}`}
                          >
                            {getStatusLabel(order.orderStatus)}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-4 text-lg font-bold text-slate-900">
                        Beställda produkter
                      </h3>

                      <div className="space-y-4">
                        {order.orderItems?.map((item, index) => (
                          <div
                            key={item.id ?? `${order.id}-${index}`}
                            className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 md:flex-row md:items-center"
                          >
                            <div className="flex h-28 w-full items-center justify-center rounded-2xl bg-slate-50 md:w-32">
                              {item.imageUrl ? (
                                <img
                                  src={`http://localhost:1337${item.imageUrl}`}
                                  alt={item.productName}
                                  className="h-24 w-full object-contain"
                                />
                              ) : (
                                <span className="text-sm text-slate-400">
                                  Ingen bild
                                </span>
                              )}
                            </div>

                            <div className="flex-1">
                              <h4 className="text-xl font-bold text-slate-900">
                                {item.productName}
                              </h4>

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
                              <p className="text-sm text-slate-500">Radtotal</p>
                              <p className="text-xl font-bold text-slate-900">
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
  );
}
