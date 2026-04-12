"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 mt-20">
      <div className="mx-auto max-w-7xl px-6 py-12 grid gap-10 md:grid-cols-4">
        {/* LOGO */}
        <div>
          <h2 className="text-xl font-bold text-cyan-400">Nicodeal</h2>
          <p className="mt-3 text-sm text-slate-400">
            Snus & nikotinpåsar online.
            <br />
            Modern e-handel med snabb leverans.
          </p>
        </div>

        {/* NAVIGATION */}
        <div>
          <h3 className="font-semibold text-white mb-3">Navigation</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-cyan-400">
                Hem
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-cyan-400">
                Produkter
              </Link>
            </li>
            <li>
              <Link href="/categories" className="hover:text-cyan-400">
                Kategorier
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-cyan-400">
                Varukorg
              </Link>
            </li>
          </ul>
        </div>

        {/* KUND */}
        <div>
          <h3 className="font-semibold text-white mb-3">Kund</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/profile" className="hover:text-cyan-400">
                Min profil
              </Link>
            </li>
            <li>
              <Link href="/my-orders" className="hover:text-cyan-400">
                Mina beställningar
              </Link>
            </li>
          </ul>
        </div>

        {/* INFO */}
        <div>
          <h3 className="font-semibold text-white mb-3">Information</h3>
          <ul className="space-y-2 text-sm">
            <li>Fri frakt över 399 kr</li>
            <li>Snabba leveranser</li>
            <li>Support 24/7</li>
          </ul>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-slate-800 text-center text-sm text-slate-500 py-4">
        © {new Date().getFullYear()} Nicodeal – Alla rättigheter förbehållna
      </div>
    </footer>
  );
}
