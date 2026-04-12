"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import Navbar from "../../components/Navbar";
import { useCart } from "../../context/CartContext";

function subscribe() {
  return () => {};
}

type FormErrors = {
  name: string;
  email: string;
  streetAddress: string;
  postalCode: string;
  city: string;
  phoneNumber: string;
};

export default function CheckoutPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const [errors, setErrors] = useState<FormErrors>({
    name: "",
    email: "",
    streetAddress: "",
    postalCode: "",
    city: "",
    phoneNumber: "",
  });

  const { cartItems, clearCart } = useCart();
  const router = useRouter();

  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  if (!isClient) return null;

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.pricePerCan * item.quantity,
    0,
  );
  const shippingCost = totalPrice >= 399 ? 0 : 69;
  const finalTotal = totalPrice + shippingCost;

  const validateForm = () => {
    const newErrors: FormErrors = {
      name: "",
      email: "",
      streetAddress: "",
      postalCode: "",
      city: "",
      phoneNumber: "",
    };

    if (!name.trim()) {
      newErrors.name = "Namn krävs";
    }

    if (!email.trim()) {
      newErrors.email = "Email krävs";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Ogiltig email";
    }

    if (!streetAddress.trim()) {
      newErrors.streetAddress = "Gatuadress krävs";
    }

    if (!postalCode.trim()) {
      newErrors.postalCode = "Postnummer krävs";
    } else if (!/^[0-9 ]{5,8}$/.test(postalCode.trim())) {
      newErrors.postalCode = "Ogiltigt postnummer";
    }

    if (!city.trim()) {
      newErrors.city = "Ort krävs";
    }

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Telefonnummer krävs";
    } else if (!/^[0-9+\-\s()]{7,20}$/.test(phoneNumber.trim())) {
      newErrors.phoneNumber = "Ogiltigt telefonnummer";
    }

    setErrors(newErrors);

    return Object.values(newErrors).every((value) => value === "");
  };

  const validatePayment = () => {
    if (paymentMethod === "card") {
      if (
        !cardNumber.trim() ||
        !cardName.trim() ||
        !expiry.trim() ||
        !cvc.trim()
      ) {
        alert("Fyll i alla kortuppgifter");
        return false;
      }
    }

    return true;
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    if (!validateForm()) return;
    if (!validatePayment()) return;

    setIsSubmitting(true);

    const formattedOrderItems = cartItems.map((item) => ({
      productName: item.name,
      purchaseType: item.name.includes("Stock") ? "Stock" : "Dosa",
      quantity: item.quantity,
      unitPrice: item.pricePerCan,
      imageUrl: item.image?.url || "",
    }));

    const orderData = {
      data: {
        customerName: name,
        customerEmail: email,
        customerAddress: `${streetAddress}, ${postalCode} ${city}`,
        customerPhone: phoneNumber,
        totalPrice: finalTotal,
        orderItems: formattedOrderItems,
        orderStatus: "pending",
        paymentMethod: paymentMethod,
      },
    };

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:1337/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.log("Strapi error:", errorText);
        throw new Error("Order failed");
      }

      const result = await res.json();
      const orderId = result.data.id;

      clearCart();
      router.push(`/order-confirmation?id=${orderId}`);
    } catch (error) {
      console.error(error);
      alert("Något gick fel när ordern skulle skickas.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-100 px-6 py-10 text-slate-900">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/cart"
            className="mb-6 inline-block text-sm text-cyan-600 hover:underline"
          >
            ← Tillbaka till varukorgen
          </Link>

          <h1 className="mb-8 text-3xl font-bold text-slate-900">Kassan</h1>

          {cartItems.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 shadow">
              <h2 className="text-xl font-semibold">Varukorgen är tom</h2>
              <p className="mt-2 text-slate-600">
                Lägg till produkter innan du går till kassan.
              </p>

              <Link
                href="/products"
                className="mt-6 inline-block rounded-xl bg-slate-950 px-5 py-3 text-white transition hover:bg-cyan-600"
              >
                Gå till produkter
              </Link>
            </div>
          ) : (
            <div className="grid gap-10 md:grid-cols-2">
              <div className="rounded-2xl bg-white p-6 shadow">
                <h2 className="mb-4 text-xl font-semibold">Kunduppgifter</h2>

                <div className="mb-6">
                  <h3 className="mb-3 text-lg font-semibold">
                    Betalningsmetod
                  </h3>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                        paymentMethod === "card"
                          ? "bg-slate-950 text-white"
                          : "bg-slate-200 text-slate-800"
                      }`}
                    >
                      Kort
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("swish")}
                      className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                        paymentMethod === "swish"
                          ? "bg-slate-950 text-white"
                          : "bg-slate-200 text-slate-800"
                      }`}
                    >
                      Swish
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("invoice")}
                      className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                        paymentMethod === "invoice"
                          ? "bg-slate-950 text-white"
                          : "bg-slate-200 text-slate-800"
                      }`}
                    >
                      Faktura
                    </button>
                  </div>
                </div>

                {paymentMethod === "card" && (
                  <div className="mb-6 rounded-2xl border border-slate-300 p-4">
                    <h3 className="mb-4 text-lg font-semibold">
                      Kortuppgifter
                    </h3>

                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Kortnummer"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 p-3 outline-none"
                      />

                      <input
                        type="text"
                        placeholder="Namn på kort"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 p-3 outline-none"
                      />

                      <div className="flex gap-3">
                        <input
                          type="text"
                          placeholder="MM/ÅÅ"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          className="w-1/2 rounded-lg border border-slate-300 p-3 outline-none"
                        />

                        <input
                          type="text"
                          placeholder="CVC"
                          value={cvc}
                          onChange={(e) => setCvc(e.target.value)}
                          className="w-1/2 rounded-lg border border-slate-300 p-3 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "swish" && (
                  <div className="mb-6 rounded-2xl border border-slate-300 bg-slate-50 p-4 text-sm text-slate-700">
                    Du har valt Swish. Detta är en demo-betalning för projektet.
                  </div>
                )}

                {paymentMethod === "invoice" && (
                  <div className="mb-6 rounded-2xl border border-slate-300 bg-slate-50 p-4 text-sm text-slate-700">
                    Du har valt Faktura. Detta är en demo-betalning för
                    projektet.
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Namn"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full rounded-lg border p-3 outline-none ${
                        errors.name ? "border-red-500" : "border-slate-300"
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full rounded-lg border p-3 outline-none ${
                        errors.email ? "border-red-500" : "border-slate-300"
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Gatuadress"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      className={`w-full rounded-lg border p-3 outline-none ${
                        errors.streetAddress
                          ? "border-red-500"
                          : "border-slate-300"
                      }`}
                    />
                    {errors.streetAddress && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.streetAddress}
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Postnummer"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className={`w-full rounded-lg border p-3 outline-none ${
                        errors.postalCode
                          ? "border-red-500"
                          : "border-slate-300"
                      }`}
                    />
                    {errors.postalCode && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.postalCode}
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Ort"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className={`w-full rounded-lg border p-3 outline-none ${
                        errors.city ? "border-red-500" : "border-slate-300"
                      }`}
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <input
                      type="tel"
                      placeholder="Telefonnummer"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className={`w-full rounded-lg border p-3 outline-none ${
                        errors.phoneNumber
                          ? "border-red-500"
                          : "border-slate-300"
                      }`}
                    />
                    {errors.phoneNumber && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.phoneNumber}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow">
                <h2 className="mb-4 text-xl font-semibold">Din beställning</h2>

                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span>{item.pricePerCan * item.quantity} kr</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-between border-t pt-4 font-bold">
                  <span>Totalt</span>
                  <span>{totalPrice} kr</span>
                </div>

                <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                  Betalningsmetod:{" "}
                  <span className="font-semibold text-slate-900">
                    {paymentMethod === "card" && "Kort"}
                    {paymentMethod === "swish" && "Swish"}
                    {paymentMethod === "invoice" && "Faktura"}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isSubmitting}
                  className="mt-6 w-full rounded-xl bg-slate-950 py-3 font-semibold text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Skickar order..." : "Slutför köp"}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
