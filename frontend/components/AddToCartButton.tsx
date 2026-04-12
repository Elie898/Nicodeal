"use client";

import { useCart } from "../context/CartContext";

type Product = {
  id: number;
  name: string;
  pricePerCan: number;
  image?: {
    url: string;
  };
};

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart, cartItems, increaseQuantity, decreaseQuantity } =
    useCart();

  const itemInCart = cartItems.find((item) => item.id === product.id);

  if (itemInCart) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-3 py-2 text-white">
        <button
          onClick={() => decreaseQuantity(product.id)}
          className="flex h-7 w-7 items-center justify-center rounded-md bg-white/10 text-sm font-bold transition hover:bg-white/20"
        >
          -
        </button>

        <span className="min-w-5 text-center text-sm font-bold">
          {itemInCart.quantity}
        </span>

        <button
          onClick={() => increaseQuantity(product.id)}
          className="flex h-7 w-7 items-center justify-center rounded-md bg-white/10 text-sm font-bold transition hover:bg-white/20"
        >
          +
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => addToCart(product)}
      className="w-full rounded-xl bg-slate-950 py-2 text-sm font-semibold text-white hover:bg-cyan-600"
    >
      Lägg i varukorg
    </button>
  );
}
