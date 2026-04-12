/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import AgeVerification from "../../../components/AgeVerification";
import AddToCartButton from "../../../components/AddToCartButton";
import Navbar from "../../../components/Navbar";

type Product = {
  id: number;
  documentId?: string;
  name: string;
  description: string;
  pricePerCan: number;
  pricePerRoll: number;
  strength: string;
  stock: number;
  image?: {
    url: string;
    alternativeText?: string | null;
  };
};

async function getProduct(documentId: string): Promise<Product | null> {
  const res = await fetch(
    `http://localhost:1337/api/products/${documentId}?populate=image`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  return data.data || null;
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <main className="min-h-screen bg-slate-100">
        <AgeVerification />
        <Navbar />

        <div className="px-6 py-10">
          <div className="mx-auto max-w-4xl rounded-3xl bg-white p-10 shadow">
            <h1 className="text-3xl font-bold text-slate-900">
              Produkten hittades inte
            </h1>

            <Link
              href="/products"
              className="mt-6 inline-flex rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-600"
            >
              ← Tillbaka till produkter
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <AgeVerification />
      <Navbar />

      <section className="px-6 py-10">
        <div className="mx-auto mb-6 max-w-6xl">
          <Link
            href="/products"
            className="inline-flex rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow transition hover:bg-slate-50"
          >
            ← Tillbaka till produkter
          </Link>
        </div>

        <div className="mx-auto grid max-w-6xl gap-10 rounded-3xl bg-white p-8 shadow-lg md:grid-cols-2">
          <div className="rounded-3xl bg-slate-50 p-8">
            {product.image?.url && (
              <img
                src={`http://localhost:1337${product.image.url}`}
                alt={product.image.alternativeText || product.name}
                className="mx-auto h-96 w-full object-contain"
              />
            )}
          </div>

          <div className="flex flex-col justify-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-cyan-700">
              Produktdetaljer
            </p>

            <h1 className="text-4xl font-bold text-slate-900">
              {product.name}
            </h1>

            <p className="mt-5 text-base leading-7 text-slate-600">
              {product.description}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Pris per dosa</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {product.pricePerCan} kr
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Pris per stock</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {product.pricePerRoll} kr
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Styrka</p>
                <p className="mt-1 text-xl font-bold text-slate-900">
                  {product.strength}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Lagerstatus</p>
                <p className="mt-1 text-xl font-bold text-emerald-700">
                  {product.stock > 0
                    ? `I lager: ${product.stock}`
                    : "Slut i lager"}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
