"use client";

import Link from "next/link";
import Navbar from "../../components/Navbar";
import { useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-100 px-6 py-10 text-slate-900">
        <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow">
          <h1 className="text-3xl font-bold text-slate-900">Skapa konto</h1>
          <p className="mt-2 text-slate-600">
            Registrera dig för att kunna följa dina beställningar och handla
            enklare.
          </p>

          <div className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="Namn"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500"
            />

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
              onClick={async () => {
                if (!name || !email || !password) {
                  alert("Fyll i alla fält");
                  return;
                }

                try {
                  const res = await fetch(
                    "http://localhost:1337/api/auth/local/register",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        username: name,
                        email: email,
                        password: password,
                      }),
                    },
                  );

                  const data = await res.json();

                  if (!res.ok) {
                    console.log(data);
                    alert("Registrering misslyckades");
                    return;
                  }

                  alert("Konto skapat!");

                  // valfritt: redirect till login
                  window.location.href = "/login";
                } catch (error) {
                  console.error(error);
                  alert("Något gick fel");
                }
              }}
              className="w-full rounded-xl bg-slate-950 py-3 font-semibold text-white transition hover:bg-cyan-600"
            >
              Skapa konto
            </button>
          </div>

          <p className="mt-6 text-sm text-slate-600">
            Har du redan konto?{" "}
            <Link
              href="/login"
              className="font-semibold text-cyan-700 hover:underline"
            >
              Logga in
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
