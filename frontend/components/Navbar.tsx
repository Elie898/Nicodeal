"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import CartCount from "./CartCount";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateAuthState = () => {
      const token = localStorage.getItem("token");
      const userRaw = localStorage.getItem("user");

      setIsLoggedIn(!!token);

      if (userRaw) {
        try {
          const user = JSON.parse(userRaw);
          setUsername(user.username || user.name || "");
        } catch {
          setUsername("");
        }
      } else {
        setUsername("");
      }
    };

    updateAuthState();

    window.addEventListener("storage", updateAuthState);
    window.addEventListener("auth-changed", updateAuthState);

    return () => {
      window.removeEventListener("storage", updateAuthState);
      window.removeEventListener("auth-changed", updateAuthState);
    };
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("adminLoggedIn");
    window.dispatchEvent(new Event("auth-changed"));
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950 text-white shadow-lg">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/"
              className="text-2xl font-extrabold tracking-wide text-cyan-400"
            >
              Nicodeal
            </Link>
            <p className="text-xs text-slate-400">Snus & nikotinpåsar online</p>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="rounded-xl border border-slate-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 md:hidden"
          >
            {isMobileMenuOpen ? "Stäng" : "Meny"}
          </button>

          <nav className="hidden gap-6 text-sm font-medium md:flex md:items-center">
            <Link
              href="/"
              className={
                pathname === "/" ? "text-cyan-400" : "hover:text-cyan-400"
              }
            >
              Hem
            </Link>

            <Link
              href="/products"
              className={
                pathname.startsWith("/products")
                  ? "text-cyan-400"
                  : "hover:text-cyan-400"
              }
            >
              Produkter
            </Link>

            <Link
              href="/categories"
              className={
                pathname === "/categories"
                  ? "text-cyan-400"
                  : "hover:text-cyan-400"
              }
            >
              Kategorier
            </Link>
            <Link
              href="/contact"
              className={
                pathname === "/contact"
                  ? "text-cyan-400"
                  : "hover:text-cyan-400"
              }
            >
              Kontakt
            </Link>

            <Link
              href="/cart"
              className={
                pathname === "/cart"
                  ? "flex items-center text-cyan-400"
                  : "flex items-center hover:text-cyan-400"
              }
            >
              Varukorg
              <CartCount />
            </Link>

            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="rounded-full bg-slate-800 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-slate-700"
                >
                  Hej {username || "vän"}
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-52 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
                    <Link
                      href="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-3 text-sm text-white transition hover:bg-slate-800"
                    >
                      Min profil
                    </Link>

                    <Link
                      href="/my-orders"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-3 text-sm text-white transition hover:bg-slate-800"
                    >
                      Mina beställningar
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-3 text-left text-sm text-red-300 transition hover:bg-slate-800"
                    >
                      Logga ut
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className={
                  pathname === "/login" || pathname === "/register"
                    ? "text-cyan-400"
                    : "hover:text-cyan-400"
                }
              >
                Logga in
              </Link>
            )}
          </nav>
        </div>

        {isMobileMenuOpen && (
          <div className="mt-4 space-y-2 rounded-2xl border border-slate-800 bg-slate-900 p-4 md:hidden">
            <Link
              href="/"
              className={`block rounded-xl px-3 py-2 ${
                pathname === "/"
                  ? "bg-slate-800 text-cyan-400"
                  : "hover:bg-slate-800"
              }`}
            >
              Hem
            </Link>

            <Link
              href="/products"
              className={`block rounded-xl px-3 py-2 ${
                pathname.startsWith("/products")
                  ? "bg-slate-800 text-cyan-400"
                  : "hover:bg-slate-800"
              }`}
            >
              Produkter
            </Link>

            <Link
              href="/categories"
              className={`block rounded-xl px-3 py-2 ${
                pathname === "/categories"
                  ? "bg-slate-800 text-cyan-400"
                  : "hover:bg-slate-800"
              }`}
            >
              Kategorier
            </Link>

            <Link
              href="/cart"
              className={`flex items-center rounded-xl px-3 py-2 ${
                pathname === "/cart"
                  ? "bg-slate-800 text-cyan-400"
                  : "hover:bg-slate-800"
              }`}
            >
              Varukorg
              <CartCount />
            </Link>

            {isLoggedIn ? (
              <>
                <div className="px-3 pt-2 text-sm font-semibold text-cyan-300">
                  Hej {username || "vän"}
                </div>

                <Link
                  href="/profile"
                  className={`block rounded-xl px-3 py-2 ${
                    pathname === "/profile"
                      ? "bg-slate-800 text-cyan-400"
                      : "hover:bg-slate-800"
                  }`}
                >
                  Min profil
                </Link>

                <Link
                  href="/my-orders"
                  className={`block rounded-xl px-3 py-2 ${
                    pathname === "/my-orders"
                      ? "bg-slate-800 text-cyan-400"
                      : "hover:bg-slate-800"
                  }`}
                >
                  Mina beställningar
                </Link>

                <button
                  onClick={handleLogout}
                  className="block w-full rounded-xl px-3 py-2 text-left text-red-300 hover:bg-slate-800"
                >
                  Logga ut
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className={`block rounded-xl px-3 py-2 ${
                  pathname === "/login" || pathname === "/register"
                    ? "bg-slate-800 text-cyan-400"
                    : "hover:bg-slate-800"
                }`}
              >
                Logga in
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
