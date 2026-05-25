// app/page.tsx

import { BrandLogo } from "@/components/BrandLogo";
import { CalculatorForm } from "@/components/CalculatorForm";
import { DisclaimerGate } from "@/components/DisclaimerGate";

export default function Home() {
  return (
    <main className="bio-light-background min-h-screen px-4 py-6 text-neutral-950 md:py-10">
      <section className="relative z-10 mx-auto flex max-w-7xl flex-col gap-8">
        <header className="rounded-[2rem] border border-emerald-900/10 bg-white/80 p-5 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-7">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <BrandLogo />

            <div className="flex flex-wrap gap-3">
              <span className="rounded-full border border-emerald-700/15 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">
                BMR / TDEE / Macro
              </span>

              <span className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-500">
                Estimari, nu valori absolute
              </span>
            </div>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
                Calculator calorii, activitate si hidratare
              </p>

              <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-neutral-950 md:text-6xl">
                Calculeaza. Intelege. Progreseaza.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-600 md:text-lg">
                Estimeaza necesarul caloric zilnic, TDEE, macro-uri si
                hidratare pe baza stilului tau de viata, pasilor,
                antrenamentelor si obiectivului.
              </p>
            </div>

            <div className="rounded-3xl border border-emerald-900/10 bg-emerald-50/70 p-5 shadow-sm">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
                  ✓
                </div>

                <div>
                  <h2 className="text-base font-semibold text-neutral-950">
                    Estimari realiste, explicatii simple
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-neutral-600">
                    Rezultatele sunt gandite ca punct de pornire. Ajustarea se
                    face dupa progres, energie, aderenta si performanta.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            <div className="rounded-3xl border border-neutral-200 bg-white/85 p-5 shadow-sm">
              <p className="text-sm font-semibold text-neutral-950">
                1. Completezi datele
              </p>
              <p className="mt-2 text-sm leading-6 text-neutral-500">
                Varsta, inaltime, greutate, pasi, job, activitate si
                antrenamente.
              </p>
            </div>

            <div className="rounded-3xl border border-neutral-200 bg-white/85 p-5 shadow-sm">
              <p className="text-sm font-semibold text-neutral-950">
                2. Primesti o estimare
              </p>
              <p className="mt-2 text-sm leading-6 text-neutral-500">
                BMR, TDEE, target caloric, macro-uri, hidratare si interval
                realist.
              </p>
            </div>

            <div className="rounded-3xl border border-neutral-200 bg-white/85 p-5 shadow-sm">
              <p className="text-sm font-semibold text-neutral-950">
                3. Ajustezi dupa progres
              </p>
              <p className="mt-2 text-sm leading-6 text-neutral-500">
                Urmareste 2-3 saptamani media greutatii, energia si aderenta.
              </p>
            </div>
          </div>
        </header>

        <DisclaimerGate>
          <CalculatorForm />
        </DisclaimerGate>

        <div className="rounded-[2rem] border border-neutral-200 bg-white/85 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.06)] backdrop-blur md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Cum interpretezi rezultatele
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <div className="rounded-3xl border border-neutral-200 bg-white p-5">
              <h2 className="text-lg font-semibold text-neutral-950">
                Estimare, nu verdict
              </h2>
              <p className="mt-3 text-sm leading-6 text-neutral-500">
                Consumul real poate varia in functie de somn, stres, digestie,
                retentie de apa, acuratetea pasilor si intensitatea reala a
                antrenamentelor.
              </p>
            </div>

            <div className="rounded-3xl border border-neutral-200 bg-white p-5">
              <h2 className="text-lg font-semibold text-neutral-950">
                Ajustare treptata
              </h2>
              <p className="mt-3 text-sm leading-6 text-neutral-500">
                Daca dupa 2-3 saptamani progresul nu merge in directia dorita,
                ajusteaza cu aproximativ 100-200 kcal pe zi.
              </p>
            </div>

            <div className="rounded-3xl border border-neutral-200 bg-white p-5">
              <h2 className="text-lg font-semibold text-neutral-950">
                Siguranta
              </h2>
              <p className="mt-3 text-sm leading-6 text-neutral-500">
                Calculatorul nu ofera diagnostic medical. In caz de diabet,
                sarcina, afectiuni metabolice, tratamente medicale sau istoric
                de tulburari alimentare, cere ghidaj specializat.
              </p>
            </div>
          </div>
        </div>

        <footer className="border-t border-neutral-200 pt-6">
          <div className="flex flex-col gap-5 text-sm leading-6 text-neutral-500 md:flex-row md:items-center md:justify-between">
            <BrandLogo variant="footer" />

            <div className="max-w-2xl md:text-right">
              <p>
                Rezultatele sunt estimari orientative si nu inlocuiesc evaluarea
                medicala sau nutritionala individuala.
              </p>

              <p className="mt-1 text-neutral-400">
                AM Calorie Calculator by Alexandru Mihai.
              </p>
            </div>
          </div>
        </footer>
      </section>
    </main>
  );
}