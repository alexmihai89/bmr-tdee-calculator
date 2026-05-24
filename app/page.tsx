// app/page.tsx

import { BrandLogo } from "@/components/BrandLogo";
import { CalculatorForm } from "@/components/CalculatorForm";
import { DisclaimerGate } from "@/components/DisclaimerGate";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-8 text-neutral-100 md:py-12">
      <section className="mx-auto flex max-w-7xl flex-col gap-8">
        <div className="rounded-3xl border border-neutral-800 bg-neutral-900/80 p-6 shadow-2xl md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <BrandLogo />

            <div className="w-fit rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-emerald-300">
              BMR / TDEE / Macro
            </div>
          </div>

          <h1 className="mt-8 max-w-4xl text-3xl font-semibold tracking-tight md:text-5xl">
            Estimare calorii si macro-uri pentru obiectivul tau
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-neutral-300">
            Un calculator simplu pentru BMR, TDEE, activitate zilnica,
            antrenamente, calorii tinta si recomandari macro. Rezultatele sunt
            estimari de pornire si trebuie ajustate in functie de progresul real.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950/50 p-4">
              <p className="text-sm font-medium text-neutral-100">
                1. Completezi datele
              </p>
              <p className="mt-2 text-sm leading-6 text-neutral-500">
                Varsta, inaltime, greutate, pasi, job, activitate si
                antrenamente.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-950/50 p-4">
              <p className="text-sm font-medium text-neutral-100">
                2. Primesti o estimare
              </p>
              <p className="mt-2 text-sm leading-6 text-neutral-500">
                BMR, TDEE, target caloric, interval realist si macro-uri.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-950/50 p-4">
              <p className="text-sm font-medium text-neutral-100">
                3. Ajustezi dupa progres
              </p>
              <p className="mt-2 text-sm leading-6 text-neutral-500">
                Urmareste 2-3 saptamani greutatea, energia, aderenta si
                performanta.
              </p>
            </div>
          </div>
        </div>

        <DisclaimerGate>
          <CalculatorForm />
        </DisclaimerGate>

        <div className="rounded-3xl border border-neutral-800 bg-neutral-900/80 p-6 md:p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-emerald-400">
            Cum interpretezi rezultatele
          </p>

          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <div>
              <h2 className="text-lg font-semibold">Estimare, nu verdict</h2>
              <p className="mt-3 text-sm leading-6 text-neutral-400">
                Consumul real poate varia in functie de somn, stres, digestie,
                retentie de apa, acuratetea pasilor si intensitatea reala a
                antrenamentelor.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold">Ajustare treptata</h2>
              <p className="mt-3 text-sm leading-6 text-neutral-400">
                Daca dupa 2-3 saptamani progresul nu merge in directia dorita,
                ajusteaza cu aproximativ 100-200 kcal pe zi, nu prin schimbari
                extreme.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold">Siguranta</h2>
              <p className="mt-3 text-sm leading-6 text-neutral-400">
                Calculatorul nu ofera diagnostic medical. In caz de diabet,
                sarcina, afectiuni metabolice, tratamente medicale sau istoric
                de tulburari alimentare, cere ghidaj de la medic sau
                nutritionist.
              </p>
            </div>
          </div>
        </div>

        <footer className="border-t border-neutral-900 pt-6">
          <div className="flex flex-col gap-5 text-sm leading-6 text-neutral-500 md:flex-row md:items-center md:justify-between">
            <BrandLogo variant="footer" />

            <div className="max-w-2xl md:text-right">
              <p>
                Rezultatele sunt estimari orientative si nu inlocuiesc evaluarea
                medicala sau nutritionala individuala.
              </p>

              <p className="mt-1 text-neutral-600">
                AM Calorie Calculator by Alexandru Mihai.
              </p>
            </div>
          </div>
        </footer>
      </section>
    </main>
  );
}