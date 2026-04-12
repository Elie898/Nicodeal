"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import AddToCartButton from "../../components/AddToCartButton";

type Product = {
  id: number;
  documentId?: string;
  name: string;
  description?: string;
  pricePerCan: number;
  image?: {
    url: string;
  };
};

type ProductWithBrand = Product & {
  brand: string;
  isNew: boolean;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductWithBrand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState("Alla");

  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategoryFromUrl = searchParams.get("category");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "http://localhost:1337/api/products?populate=image&pagination[pageSize]=100",
          { cache: "no-store" },
        );

        if (!res.ok) {
          throw new Error("Kunde inte hämta produkter");
        }

        const data = await res.json();

        const normalizedProducts: ProductWithBrand[] = (data.data || []).map(
          (product: Product) => {
            const firstWord = product.name?.split(" ")[0] || "";
            const brand = firstWord.toUpperCase();

            const lowerName = product.name.toLowerCase();

            const isNew =
              lowerName.includes("velo shift hot grape") ||
              lowerName.includes("velo shift hot dragonfruit") ||
              lowerName.includes("velo shift hot dragon fruit");

            return {
              ...product,
              brand,
              isNew,
            };
          },
        );

        setProducts(normalizedProducts);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  const brands = useMemo(() => {
    const uniqueBrands = Array.from(
      new Set(products.map((product) => product.brand).filter(Boolean)),
    );

    return ["Alla", "Nyheter", ...uniqueBrands];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedBrand === "Nyheter") {
      result = result.filter((product) => product.isNew);
    } else if (selectedBrand !== "Alla") {
      result = result.filter((product) => product.brand === selectedBrand);
    }

    if (selectedCategoryFromUrl) {
      if (selectedCategoryFromUrl === "nyheter") {
        result = result.filter((product) => product.isNew);
      }

      if (selectedCategoryFromUrl === "nikotinfria") {
        result = result.filter((product) =>
          product.name.toLowerCase().includes("nikotinfritt"),
        );
      }

      if (selectedCategoryFromUrl === "tobakssnus") {
        result = result.filter((product) =>
          product.name.toLowerCase().includes("general"),
        );
      }

      if (selectedCategoryFromUrl === "vittsnus") {
        result = result.filter(
          (product) =>
            !product.name.toLowerCase().includes("nikotinfritt") &&
            !product.name.toLowerCase().includes("general"),
        );
      }
    }

    return result;
  }, [products, selectedBrand, selectedCategoryFromUrl]);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-100 px-6 py-10 text-slate-900">
        <section className="mx-auto max-w-7xl">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
              Sortiment
            </p>
            <h1 className="mt-2 text-4xl font-extrabold text-slate-900">
              Produkter
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Utforska vårt sortiment och filtrera efter märke.
            </p>
          </div>

          <div className="mb-8 rounded-3xl bg-white p-5 shadow">
            <h2 className="text-lg font-bold text-slate-900">
              Filtrera på märke
            </h2>

            <div className="mt-4 flex flex-wrap gap-3">
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => {
                    setSelectedBrand(brand);
                    router.push("/products");
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    selectedBrand === brand
                      ? "bg-slate-950 text-white"
                      : "bg-slate-200 text-slate-800 hover:bg-slate-300"
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6 text-sm font-semibold text-slate-600">
            Visar {filteredProducts.length} produkter
            {selectedBrand !== "Alla" && ` för ${selectedBrand}`}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="rounded-3xl bg-white p-5 shadow transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative">
                  <Link
                    href={`/products/${product.documentId}`}
                    className="flex h-44 items-center justify-center rounded-2xl bg-slate-50 transition hover:opacity-90"
                  >
                    {product.image?.url ? (
                      <img
                        src={`http://localhost:1337${product.image.url}`}
                        alt={product.name}
                        className="h-32 object-contain"
                      />
                    ) : (
                      <span className="text-sm text-slate-400">Ingen bild</span>
                    )}
                  </Link>

                  {product.isNew && (
                    <span className="absolute right-3 top-3 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-900 shadow-sm">
                      Nyhet
                    </span>
                  )}
                </div>

                <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-700">
                    {product.brand}
                  </p>

                  <Link
                    href={`/products/${product.documentId}`}
                    className="mt-2 block text-lg font-bold text-slate-900 transition hover:text-cyan-700"
                  >
                    {product.name}
                  </Link>

                  <p className="mt-2 text-base font-semibold text-slate-700">
                    {product.pricePerCan} kr
                  </p>
                </div>

                <div className="mt-5">
                  <AddToCartButton product={product} />
                </div>
              </article>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="mt-8 rounded-3xl bg-white p-8 text-center shadow">
              <h3 className="text-xl font-bold text-slate-900">
                Inga produkter hittades
              </h3>
              <p className="mt-2 text-slate-600">
                Det finns inga produkter för det valda filtret ännu.
              </p>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
