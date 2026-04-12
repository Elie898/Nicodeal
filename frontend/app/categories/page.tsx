"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/Navbar";

type Category = {
  id: number;
  name: string;
};

type Product = {
  id: number;
  name: string;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          fetch("http://localhost:1337/api/categories", {
            cache: "no-store",
          }),
          fetch("http://localhost:1337/api/products?pagination[pageSize]=100", {
            cache: "no-store",
          }),
        ]);

        const categoriesData = await categoriesRes.json();
        const productsData = await productsRes.json();

        setCategories(categoriesData.data || []);
        setProducts(productsData.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const categoryProductCounts = useMemo(() => {
    const counts: Record<string, number> = {
      nikotinfria: 0,
      tobakssnus: 0,
      vittsnus: 0,
    };

    products.forEach((product) => {
      const name = product.name.toLowerCase();

      if (name.includes("nikotinfritt")) {
        counts.nikotinfria += 1;
      } else if (name.includes("general")) {
        counts.tobakssnus += 1;
      } else {
        counts.vittsnus += 1;
      }
    });

    return counts;
  }, [products]);

  const getCategoryDescription = (categoryName: string) => {
    const normalized = categoryName.toLowerCase().replace(/\s/g, "");

    if (normalized === "nikotinfria") {
      return "Smak och känsla utan nikotin.";
    }

    if (normalized === "tobakssnus") {
      return "Klassiska produkter med tydlig tobakskaraktär.";
    }

    if (normalized === "vittsnus") {
      return "Moderna nikotinpåsar i flera smaker och styrkor.";
    }

    return "Utforska produkter i denna kategori.";
  };

  const getCategoryCount = (categoryName: string) => {
    const normalized = categoryName.toLowerCase().replace(/\s/g, "");
    return categoryProductCounts[normalized] || 0;
  };

  const getCategoryStyle = (categoryName: string) => {
    const normalized = categoryName.toLowerCase().replace(/\s/g, "");

    if (normalized === "nikotinfria") {
      return "from-emerald-500/20 via-teal-500/10 to-slate-900";
    }

    if (normalized === "tobakssnus") {
      return "from-amber-500/20 via-orange-500/10 to-slate-900";
    }

    return "from-cyan-500/20 via-blue-500/10 to-slate-900";
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-100 text-slate-900">
        <section className="bg-[linear-gradient(90deg,#020617_0%,#04153a_45%,#155e75_100%)] text-white">
          <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
            <p className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300">
              Hitta rätt kategori direkt
            </p>

            <h1 className="mt-6 text-4xl font-extrabold md:text-6xl">
              Utforska sortimentet
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-200 md:text-lg">
              Välj mellan nikotinfria alternativ, klassiskt tobakssnus och
              modernt vitt snus. Kategorisidan hjälper dig att snabbt hitta rätt
              produkter i butiken.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-6 md:grid-cols-3">
            {categories.map((category) => {
              const normalizedCategory = category.name
                .toLowerCase()
                .replace(/\s/g, "");

              return (
                <Link
                  key={category.id}
                  href={`/products?category=${normalizedCategory}`}
                  className={`group relative overflow-hidden rounded-4xl bg-[linear-gradient(135deg,var(--tw-gradient-stops))] ${getCategoryStyle(
                    category.name,
                  )} p-px shadow-lg transition hover:-translate-y-1 hover:shadow-2xl`}
                >
                  <div className="h-full rounded-4xl bg-slate-950 p-7 text-white">
                    <div className="flex items-start justify-between gap-4">
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                        Kategori
                      </span>

                      <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-bold text-white">
                        {getCategoryCount(category.name)} st
                      </span>
                    </div>

                    <h2 className="mt-8 text-3xl font-extrabold">
                      {category.name}
                    </h2>

                    <p className="mt-4 max-w-xs text-sm leading-7 text-slate-300">
                      {getCategoryDescription(category.name)}
                    </p>

                    <div className="mt-10 flex items-center justify-between">
                      <span className="text-sm font-semibold text-cyan-300">
                        Visa produkter
                      </span>

                      <span className="text-2xl font-bold text-white transition group-hover:translate-x-1">
                        →
                      </span>
                    </div>

                    <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-cyan-400/10 blur-2xl" />
                    <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}
