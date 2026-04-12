"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";

type UserData = {
  id?: number;
  username?: string;
  email?: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");

    if (!token) {
      router.push("/login");
      return;
    }

    if (userRaw) {
      try {
        const parsedUser = JSON.parse(userRaw);
        setUser(parsedUser);
      } catch (error) {
        console.error(error);
      }
    }

    setAuthorized(true);
  }, [router]);

  if (!authorized) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-slate-100 px-6 py-10 text-slate-900">
          <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 shadow">
            Laddar profil...
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-100 px-6 py-10 text-slate-900">
        <section className="mx-auto max-w-5xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
                Kundkonto
              </p>
              <h1 className="mt-2 text-4xl font-extrabold text-slate-900">
                Min profil
              </h1>
              <p className="mt-3 max-w-2xl text-slate-600">
                Här ser du information om ditt konto och kan snabbt gå vidare
                till dina beställningar eller butiken.
              </p>
            </div>

            <div className="rounded-2xl bg-white px-5 py-4 shadow">
              <p className="text-sm text-slate-500">Kontostatus</p>
              <p className="text-2xl font-bold text-emerald-700">Aktiv</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
            <div className="space-y-6">
              <div className="rounded-3xl bg-white p-8 shadow">
                <h2 className="text-2xl font-bold text-slate-900">
                  Kontoinformation
                </h2>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-sm text-slate-500">Användarnamn</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {user?.username || "Ej tillgängligt"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-sm text-slate-500">Email</p>
                    <p className="mt-2 break-all text-xl font-bold text-slate-900">
                      {user?.email || "Ej tillgängligt"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow">
                <h2 className="text-xl font-bold text-slate-900">
                  Kontoöversikt
                </h2>

                <p className="mt-2 text-slate-600">
                  Ditt konto är aktivt. Härifrån kan du hantera dina
                  beställningar eller fortsätta handla produkter.
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href="/my-orders"
                    className="rounded-full bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700"
                  >
                    Mina beställningar
                  </Link>

                  <Link
                    href="/products"
                    className="rounded-full bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-300"
                  >
                    Fortsätt handla
                  </Link>
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-3xl bg-white p-6 shadow">
                <h2 className="text-xl font-bold text-slate-900">Snabbval</h2>

                <div className="mt-5 space-y-3">
                  <Link
                    href="/my-orders"
                    className="block rounded-2xl bg-slate-950 px-5 py-3 text-center font-semibold text-white transition hover:bg-cyan-600"
                  >
                    Mina beställningar
                  </Link>

                  <Link
                    href="/products"
                    className="block rounded-2xl border border-slate-300 bg-white px-5 py-3 text-center font-semibold text-slate-900 transition hover:border-cyan-500 hover:text-cyan-700"
                  >
                    Till produkter
                  </Link>
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow">
                <h2 className="text-xl font-bold text-slate-900">
                  Kontoöversikt
                </h2>

                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Profil</p>
                    <p className="mt-1 font-semibold text-slate-900">
                      Kundkonto aktivt
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Beställningar</p>
                    <p className="mt-1 font-semibold text-slate-900">
                      Se orderhistorik i Mina beställningar
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Butik</p>
                    <p className="mt-1 font-semibold text-slate-900">
                      Fortsätt handla från produktsidan
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}
