// app/page.tsx

import { BrandLogo } from "@/components/BrandLogo";
import { CalculatorForm } from "@/components/CalculatorForm";
import { DisclaimerGate } from "@/components/DisclaimerGate";
import { MinimalIcon } from "@/components/MinimalIcon";

export default function Home() {
  return (
    <main className="bio-light-background min-h-screen px-4 py-4 text-neutral-950 md:py-10">
      <section className="relative z-10 mx-auto flex max-w-7xl flex-col gap-6 md:gap-8">
        <header className="rounded-[2rem] border border-emerald-900/10 bg-white/85 p-5 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <BrandLogo />

            <div className="flex flex-wrap gap-2 md:gap-3">
              <span className="rounded-full border border-emerald-700/15 bg-emerald-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800 md:px-4">
                BMR / TDEE / Macro
              </span>

              <span className="rounded-full border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-500 md:px-4">
                Estimari, nu valori absolute
              </span>
            </div>
          </div>

          <div className="mt-7 grid gap-6 lg:mt-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
                Calculator calorii, activitate si hidratare
              </p>

              <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-neutral-950 md:mt-4 md:text-6xl">
                Calculeaza. Intelege. Progreseaza.
              </h1>

              <p className="mt-4 max-w-2xl text-lg font-medium leading-7 text-neutral-800 md:text-xl">
                Un punct de pornire clar pentru nutritie, activitate si progres.
              </p>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 md:text-base md:leading-7">
                Estimeaza necesarul caloric zilnic, TDEE, macro-uri si
                hidratare pe baza stilului tau de viata, pasilor,
                antrenamentelor si obiectivului.
              </p>
            </div>

            <div className="rounded-3xl border border-emerald-900/10 bg-emerald-50/75 p-5 shadow-sm">
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm md:h-12 md:w-12">
                  <MinimalIcon name="check" className="h-5 w-5" />
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

          <div className="mt-6 grid gap-3 md:mt-8 md:grid-cols-3">
            <div className="rounded-3xl border border-neutral-200 bg-white/85 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <MinimalIcon name="calculator" className="h-5 w-5" />
                </div>

                <p className="text-sm font-semibold text-neutral-950">
                  1. Completezi datele
                </p>
              </div>

              <p className="mt-3 text-sm leading-6 text-neutral-500">
                Varsta, inaltime, greutate, pasi, job, activitate si
                antrenamente.
              </p>
            </div>

            <div className="rounded-3xl border border-neutral-200 bg-white/85 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                  <MinimalIcon name="target" className="h-5 w-5" />
                </div>

                <p className="text-sm font-semibold text-neutral-950">
                  2. Primesti o estimare
                </p>
              </div>

              <p className="mt-3 text-sm leading-6 text-neutral-500">
                BMR, TDEE, target caloric, macro-uri, hidratare si interval
                realist.
              </p>
            </div>

            <div className="rounded-3xl border border-neutral-200 bg-white/85 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <MinimalIcon name="trend" className="h-5 w-5" />
                </div>

                <p className="text-sm font-semibold text-neutral-950">
                  3. Ajustezi dupa progres
                </p>
              </div>

              <p className="mt-3 text-sm leading-6 text-neutral-500">
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
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <MinimalIcon name="info" className="h-5 w-5" />
              </div>

              <h2 className="mt-4 text-lg font-semibold text-neutral-950">
                Estimare, nu verdict
              </h2>

              <p className="mt-3 text-sm leading-6 text-neutral-500">
                Consumul real poate varia in functie de somn, stres, digestie,
                retentie de apa, acuratetea pasilor si intensitatea reala a
                antrenamentelor.
              </p>
            </div>

            <div className="rounded-3xl border border-neutral-200 bg-white p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                <MinimalIcon name="trend" className="h-5 w-5" />
              </div>

              <h2 className="mt-4 text-lg font-semibold text-neutral-950">
                Ajustare treptata
              </h2>

              <p className="mt-3 text-sm leading-6 text-neutral-500">
                Daca dupa 2-3 saptamani progresul nu merge in directia dorita,
                ajusteaza cu aproximativ 100-200 kcal pe zi.
              </p>
            </div>

            <div className="rounded-3xl border border-neutral-200 bg-white p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                <MinimalIcon name="shield" className="h-5 w-5" />
              </div>

              <h2 className="mt-4 text-lg font-semibold text-neutral-950">
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

        <footer className="rounded-[2rem] border border-neutral-200 bg-white/85 p-5 shadow-[0_20px_80px_rgba(15,23,42,0.06)] backdrop-blur md:p-7">
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr_1fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                AM Calorie Calculator
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950">
                Nutritie, activitate si progres intr-un format clar.
              </h2>

              <p className="mt-3 text-sm leading-6 text-neutral-500">
                Creat pentru clienti de sala si populatia generala care vor
                estimari realiste, nu promisiuni rapide.
              </p>
            </div>

            <div className="rounded-3xl border border-neutral-200 bg-neutral-50/80 p-4">
              <p className="text-sm font-semibold text-neutral-950">
                Branding & contacte
              </p>

              <div className="mt-4 flex flex-col gap-3">
                <a
                  href="https://www.instagram.com/alecsmihai?igsh=YjQ2MHB1dXpsc3hq&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-700 shadow-sm transition hover:border-emerald-700/25 hover:bg-emerald-50/50"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <MinimalIcon name="info" className="h-4 w-4" />
                  </span>
                  Instagram: @alecsmihai
                </a>

                <a
                  href="https://salabrick.ro/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-700 shadow-sm transition hover:border-emerald-700/25 hover:bg-emerald-50/50"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <MinimalIcon name="activity" className="h-4 w-4" />
                  </span>
                  salabrick.ro
                </a>
              </div>
            </div>

            <div className="rounded-3xl border border-neutral-200 bg-neutral-50/80 p-4">
              <BrandLogo variant="footer" />

              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50/80 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white text-amber-700">
                    <MinimalIcon name="shield" className="h-4 w-4" />
                  </div>

                  <p className="text-xs leading-5 text-amber-900/80">
                    Rezultatele sunt estimari orientative si nu inlocuiesc
                    evaluarea medicala sau nutritionala individuala.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-neutral-200 pt-5 text-xs leading-5 text-neutral-400 md:flex-row md:items-center md:justify-between">
            <p>© AM Calorie Calculator by Alexandru Mihai.</p>
            <p>Un punct de pornire clar pentru nutritie, activitate si progres.</p>
          </div>
        </footer>
      </section>
    </main>
  );
}