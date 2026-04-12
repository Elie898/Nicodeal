"use client";

import Link from "next/link";
import Navbar from "../../components/Navbar";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Fyll i alla fält");
      return;
    }

    try {
      const res = await fetch("http://localhost:1337/api/auth/local", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: email,
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data);
        alert("Fel email eller lösenord");
        return;
      }

      localStorage.setItem("token", data.jwt);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.removeItem("adminLoggedIn");
      window.dispatchEvent(new Event("auth-changed"));

      alert("Inloggad!");
      router.push("/");
    } catch (error) {
      console.error(error);
      alert("Något gick fel");
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-100 px-6 py-10 text-slate-900">
        <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow">
          <h1 className="text-3xl font-bold text-slate-900">Logga in</h1>
          <p className="mt-2 text-slate-600">
            Logga in för att se dina beställningar och hantera ditt konto.
          </p>

          <div className="mt-6 space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500"
            />

            <input
              type="password"
              placeholder="Lösenord"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500"
            />

            <button
              onClick={handleLogin}
              className="w-full rounded-xl bg-slate-950 py-3 font-semibold text-white transition hover:bg-cyan-600"
            >
              Logga in
            </button>
          </div>

          <p className="mt-6 text-sm text-slate-600">
            Har du inget konto?{" "}
            <Link
              href="/register"
              className="font-semibold text-cyan-700 hover:underline"
            >
              Skapa konto
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
