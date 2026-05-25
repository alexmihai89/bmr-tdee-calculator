// components/DisclaimerGate.tsx

"use client";

import { useEffect, useState } from "react";

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
      <div className="rounded-3xl border border-neutral-800 bg-neutral-900/80 p-5 shadow-2xl md:p-6">
        <p className="text-sm text-neutral-500">Se incarca...</p>
      </div>
    );
  }

  if (hasAccepted) {
    return <>{children}</>;
  }

  return (
    <div className="rounded-3xl border border-neutral-800 bg-neutral-900/80 p-5 shadow-2xl md:p-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-emerald-400">
          Inainte sa folosesti calculatorul
        </p>

        <h2 className="mt-2 text-2xl font-semibold">
          Disclaimer si acord de utilizare
        </h2>

        <p className="mt-3 text-sm leading-6 text-neutral-400">
          Te rugam sa citesti informatiile de mai jos inainte de a folosi
          calculatorul. Scopul este sa intelegi corect rezultatele si limitele
          estimarii.
        </p>
      </div>

      <div className="mt-6 grid gap-4">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/50 p-4">
          <h3 className="text-base font-semibold text-neutral-100">
            Rezultatele sunt estimari
          </h3>

          <p className="mt-2 text-sm leading-6 text-neutral-400">
            Acest calculator ofera estimari orientative pentru BMR, TDEE,
            calorii tinta, macro-uri si hidratare. Rezultatele nu reprezinta
            diagnostic medical, plan alimentar personalizat sau recomandare
            clinica.
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/50 p-4">
          <h3 className="text-base font-semibold text-neutral-100">
            Valorile pot varia
          </h3>

          <p className="mt-2 text-sm leading-6 text-neutral-400">
            Consumul real poate varia in functie de metabolism, somn, stres,
            retentie de apa, acuratetea pasilor, intensitatea reala a
            antrenamentelor si aderenta.
          </p>
        </div>

        <div className="rounded-2xl border border-amber-800 bg-amber-950/30 p-4">
          <h3 className="text-base font-semibold text-amber-100">
            Situatii in care este recomandat consult specializat
          </h3>

          <p className="mt-2 text-sm leading-6 text-amber-100/80">
            Daca ai diabet, esti insarcinata, ai afectiuni metabolice, urmezi
            tratamente medicale, ai istoric de tulburari alimentare sau simptome
            neobisnuite, cere sfatul unui medic sau nutritionist inainte de a
            urma o tinta calorica.
          </p>
        </div>

        <label className="flex cursor-pointer gap-3 rounded-2xl border border-neutral-800 bg-neutral-950/60 p-4">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(event) => setIsChecked(event.target.checked)}
            className="mt-1 h-5 w-5 accent-emerald-500"
          />

          <span className="text-sm leading-6 text-neutral-300">
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
              ? "rounded-2xl bg-emerald-500 px-5 py-4 text-base font-semibold text-neutral-950 transition hover:bg-emerald-400"
              : "cursor-not-allowed rounded-2xl bg-neutral-800 px-5 py-4 text-base font-semibold text-neutral-500"
          }
        >
          Continua catre calculator
        </button>
      </div>
    </div>
  );
}