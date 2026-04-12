"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

type Product = {
  id: number;
  name: string;
  price?: number;
  pricePerCan?: number;
  image?: {
    url: string;
  };
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "http://localhost:1337/api/products?populate=image",
          { cache: "no-store" },
        );

        if (!res.ok) {
          throw new Error("Kunde inte hämta produkter");
        }

        const data = await res.json();
        setProducts(data.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  const featuredProducts = products.slice(0, 4);

  const getProductPrice = (product: Product) =>
    product.pricePerCan ?? product.price ?? 0;

  return (
    <>
      <Navbar />

      <main className="bg-slate-100 text-slate-900">
        <section className="bg-[linear-gradient(90deg,#020617_0%,#04153a_45%,#155e75_100%)] text-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 md:grid-cols-2 md:items-center md:py-20">
            <div>
              <p className="inline-flex rounded-full border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300">
                Modern e-handel för nikotinprodukter
              </p>

              <h1 className="mt-8 text-4xl font-extrabold leading-tight md:text-6xl">
                Upptäck populära
                <br />
                produkter från
                <br />
                ledande märken
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-200 md:text-lg">
                Nicodeal erbjuder vitt snus, tobakssnus och nikotinfria
                alternativ i en modern och lättanvänd webbshop. Byggd för att ge
                en tydlig, stilren och professionell köpupplevelse.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/products"
                  className="rounded-2xl bg-cyan-500 px-7 py-3 text-base font-semibold text-slate-950 transition hover:bg-cyan-400"
                >
                  Se produkter
                </Link>

                <Link
                  href="/categories"
                  className="rounded-2xl border border-slate-500 bg-transparent px-7 py-3 text-base font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-300"
                >
                  Kategorier
                </Link>
              </div>
            </div>

            <div>
              <div className="rounded-4xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-sm">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-700/60 p-5">
                    <p className="text-base text-slate-200">Snabba köp</p>
                    <h3 className="mt-3 text-2xl font-bold text-white">
                      Smidig checkout
                    </h3>
                  </div>

                  <div className="rounded-3xl bg-slate-700/60 p-5">
                    <p className="text-base text-slate-200">Populära märken</p>
                    <h3 className="mt-3 text-2xl font-bold text-white">
                      VELO, ZYN, LOOP
                    </h3>
                  </div>

                  <div className="rounded-3xl bg-slate-700/60 p-5">
                    <p className="text-base text-slate-200">Flexibla köp</p>
                    <h3 className="mt-3 text-2xl font-bold text-white">
                      Dosa & stock
                    </h3>
                  </div>

                  <div className="rounded-3xl bg-slate-700/60 p-5">
                    <p className="text-base text-slate-200">Modern webbshop</p>
                    <h3 className="mt-3 text-2xl font-bold text-white">
                      Snabb & modern shopping
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* POPULÄRA PRODUKTER */}
        <section className="mx-auto max-w-7xl px-6 py-14">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
                Sortiment
              </p>
              <h2 className="mt-2 text-4xl font-extrabold text-slate-900">
                Populära produkter
              </h2>
            </div>

            <Link
              href="/products"
              className="text-sm font-semibold text-cyan-700 hover:underline"
            >
              Visa alla →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="rounded-2xl bg-white p-4 shadow transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-40 items-center justify-center rounded-xl bg-slate-50">
                  {product.image?.url ? (
                    <img
                      src={`http://localhost:1337${product.image.url}`}
                      alt={product.name}
                      className="h-32 object-contain"
                    />
                  ) : (
                    <span className="text-sm text-slate-400">Ingen bild</span>
                  )}
                </div>

                <h3 className="mt-4 font-semibold text-slate-900">
                  {product.name}
                </h3>

                <p className="mt-1 text-sm text-slate-600">
                  {getProductPrice(product)} kr
                </p>

                <Link
                  href="/products"
                  className="mt-4 block rounded-xl bg-slate-950 py-2 text-center text-sm font-semibold text-white transition hover:bg-cyan-600"
                >
                  Köp
                </Link>
              </div>
            ))}

            {featuredProducts.length === 0 && (
              <div className="col-span-full rounded-2xl bg-white p-8 text-center shadow">
                Inga produkter hittades ännu.
              </div>
            )}
          </div>
        </section>

        {/* ERBJUDANDEN */}
        <section className="mx-auto max-w-7xl px-6 pb-14">
          <h2 className="mb-8 text-2xl font-bold text-slate-900">
            Erbjudanden
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 shadow">
              <h3 className="text-lg font-bold text-slate-900">
                Fri frakt över 399 kr
              </h3>
              <p className="mt-2 text-slate-600">
                Handla mer och få fri frakt på din beställning.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow">
              <h3 className="text-lg font-bold text-slate-900">
                Populära märken
              </h3>
              <p className="mt-2 text-slate-600">
                Upptäck favoriter från ZYN, VELO, LOOP och fler.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow">
              <h3 className="text-lg font-bold text-slate-900">
                Snabb beställning
              </h3>
              <p className="mt-2 text-slate-600">
                Lägg i varukorg och slutför köpet snabbt och enkelt.
              </p>
            </div>
          </div>
        </section>

        {/* NYHET */}
        <section className="mx-auto max-w-7xl px-6 pb-16">
          <div className="grid gap-8 rounded-3xl bg-white p-6 shadow md:grid-cols-2 md:items-center">
            <div className="overflow-hidden rounded-2xl">
              <img
                src="/velo-nyhet.jpg"
                alt="VELO nyhet"
                className="h-full w-full rounded-2xl object-cover"
              />
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
                Nyhet
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                VELO Shift Hot Dragon Fruit
              </h2>
              <p className="mt-4 text-slate-600">
                Upptäck en spännande ny smak med modern design och förbättrad
                komfort. En nyhet i sortimentet som ger startsidan mer liv och
                butiken en tydligare premiumkänsla.
              </p>

              <Link
                href="/products?category=nyheter"
                className="mt-6 inline-block rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-cyan-600"
              >
                Se nyheter i butiken
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
