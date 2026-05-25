// components/DisclaimerGate.tsx

"use client";

import { useEffect, useState } from "react";
import { MinimalIcon } from "@/components/MinimalIcon";

const disclaimerStorageKey = "am-calorie-calculator-disclaimer-accepted";

export function DisclaimerGate({ children }: { children: React.ReactNode }) {
  const [hasAccepted, setHasAccepted] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [hasLoadedPreference, setHasLoadedPreference] = useState(false);

  useEffect(() => {
    const savedPreference = window.localStorage.getItem(disclaimerStorageKey);

    if (savedPreference === "true") {
      setHasAccepted(true);
    }

    setHasLoadedPreference(true);
  }, []);

  function handleContinue() {
    if (!isChecked) {
      return;
    }

    window.localStorage.setItem(disclaimerStorageKey, "true");
    setHasAccepted(true);
  }

  if (!hasLoadedPreference) {
    return (
      <div className="rounded-[2rem] border border-neutral-200 bg-white/85 p-5 shadow-[0_20px_80px_rgba(15,23,42,0.06)] backdrop-blur md:p-6">
        <p className="text-sm text-neutral-500">Se incarca...</p>
      </div>
    );
  }

  if (hasAccepted) {
    return <>{children}</>;
  }

  return (
    <div className="rounded-[2rem] border border-neutral-200 bg-white/90 p-5 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-7">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Inainte sa folosesti calculatorul
          </p>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950 md:text-3xl">
            Disclaimer si acord de utilizare
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-600">
            Te rugam sa citesti informatiile de mai jos inainte de a folosi
            calculatorul. Scopul este sa intelegi corect rezultatele si limitele
            estimarii.
          </p>
        </div>

        <div className="w-fit rounded-full border border-emerald-700/15 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-800">
          Estimari educationale
        </div>
      </div>

      <div className="mt-7 grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <MinimalIcon name="calculator" className="h-5 w-5" />
          </div>

          <h3 className="mt-4 text-base font-semibold text-neutral-950">
            Rezultatele sunt estimari
          </h3>

          <p className="mt-2 text-sm leading-6 text-neutral-500">
            Acest calculator ofera estimari orientative pentru BMR, TDEE,
            calorii tinta, macro-uri si hidratare. Rezultatele nu reprezinta
            diagnostic medical, plan alimentar personalizat sau recomandare
            clinica.
          </p>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
            <MinimalIcon name="activity" className="h-5 w-5" />
          </div>

          <h3 className="mt-4 text-base font-semibold text-neutral-950">
            Valorile pot varia
          </h3>

          <p className="mt-2 text-sm leading-6 text-neutral-500">
            Consumul real poate varia in functie de metabolism, somn, stres,
            retentie de apa, acuratetea pasilor, intensitatea reala a
            antrenamentelor si aderenta.
          </p>
        </div>

        <div className="rounded-3xl border border-amber-200 bg-amber-50/80 p-5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-amber-700">
            <MinimalIcon name="shield" className="h-5 w-5" />
          </div>

          <h3 className="mt-4 text-base font-semibold text-amber-950">
            Consult specializat
          </h3>

          <p className="mt-2 text-sm leading-6 text-amber-900/75">
            Daca ai diabet, esti insarcinata, ai afectiuni metabolice, urmezi
            tratamente medicale, ai istoric de tulburari alimentare sau simptome
            neobisnuite, cere sfatul unui medic sau nutritionist inainte de a
            urma o tinta calorica.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 rounded-3xl border border-neutral-200 bg-neutral-50/80 p-4 md:grid-cols-[1fr_auto] md:items-center">
        <label className="flex cursor-pointer gap-3">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(event) => setIsChecked(event.target.checked)}
            className="mt-1 h-5 w-5 accent-emerald-600"
          />

          <span className="text-sm leading-6 text-neutral-700">
            Am inteles ca rezultatele sunt estimari educationale si ca le voi
            folosi ca punct de pornire, nu ca recomandare medicala sau plan
            alimentar personalizat.
          </span>
        </label>

        <button
          type="button"
          aria-disabled={!isChecked}
          onClick={handleContinue}
          className={
            isChecked
              ? "rounded-2xl bg-emerald-700 px-5 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-900/10 transition hover:bg-emerald-600"
              : "cursor-not-allowed rounded-2xl bg-neutral-200 px-5 py-4 text-base font-semibold text-neutral-400"
          }
        >
          Continua catre calculator
        </button>
      </div>
    </div>
  );
}