"use client";

import Navbar from "../../components/Navbar";

export default function ContactPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-100 text-slate-900">
        <section className="bg-[linear-gradient(90deg,#020617_0%,#04153a_45%,#155e75_100%)] text-white">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <p className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300">
              Vi finns här för att hjälpa dig
            </p>

            <h1 className="mt-6 text-4xl font-extrabold md:text-6xl">
              Kontakta oss
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-200 md:text-lg">
              Har du frågor om produkter, beställningar, leverans eller din
              order? Hör gärna av dig till oss så hjälper vi dig så snabbt som
              möjligt.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">
                ✉
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
                Email
              </p>
              <h2 className="mt-3 text-2xl font-bold text-slate-900">
                support@nicodeal.se
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Skicka ett mail till oss om du har frågor om produkter,
                beställningar eller support.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                ☎
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Telefon
              </p>
              <h2 className="mt-3 text-2xl font-bold text-slate-900">
                08-123 45 67
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Ring oss under våra öppettider om du vill ha snabb hjälp direkt.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                ⏰
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">
                Öppettider
              </p>
              <h2 className="mt-3 text-2xl font-bold text-slate-900">
                Mån - Fre
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Vi finns tillgängliga vardagar mellan 09:00 och 17:00 för att
                hjälpa dig med dina frågor.
              </p>
              <p className="mt-3 text-lg font-semibold text-slate-900">
                09:00 - 17:00
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-4xl bg-white p-8 shadow">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
                  Kundservice
                </p>
                <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
                  Snabb hjälp när du behöver det
                </h2>
                <p className="mt-4 max-w-2xl text-slate-600 leading-8">
                  Vi vill göra det enkelt att handla hos Nicodeal. Därför kan du
                  alltid kontakta oss om du behöver hjälp med produkter,
                  leverans, betalning eller orderstatus.
                </p>
              </div>

              <div className="rounded-3xl bg-slate-950 p-6 text-white">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  Kontaktuppgifter
                </p>

                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl bg-white/5 p-4">
                    <p className="text-sm text-slate-300">Email</p>
                    <p className="mt-1 text-lg font-bold">
                      support@nicodeal.se
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/5 p-4">
                    <p className="text-sm text-slate-300">Telefon</p>
                    <p className="mt-1 text-lg font-bold">08-123 45 67</p>
                  </div>

                  <div className="rounded-2xl bg-white/5 p-4">
                    <p className="text-sm text-slate-300">Öppettider</p>
                    <p className="mt-1 text-lg font-bold">
                      Måndag - Fredag, 09:00 - 17:00
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
