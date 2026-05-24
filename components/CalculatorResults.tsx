// components/CalculatorResults.tsx

"use client";

import { useState } from "react";
import {
  formatCalories,
  formatCaloriesPerDay,
  formatCalorieRange,
  formatGramRange,
  formatGrams,
  formatKilograms,
  formatNumber,
} from "@/lib/formatters";
import type { CalorieCalculatorResult } from "@/lib/types";

function ResultCard({
  label,
  value,
  suffix = "kcal / zi",
  highlight = false,
}: {
  label: string;
  value: string;
  suffix?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={
        highlight
          ? "rounded-3xl border border-emerald-900 bg-emerald-950/40 p-5 shadow-xl"
          : "rounded-3xl border border-neutral-800 bg-neutral-900 p-5"
      }
    >
      <p
        className={
          highlight ? "text-sm text-emerald-300" : "text-sm text-neutral-400"
        }
      >
        {label}
      </p>

      <p className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
        {value}
      </p>

      <p
        className={
          highlight
            ? "mt-1 text-sm text-emerald-200/70"
            : "mt-1 text-sm text-neutral-500"
        }
      >
        {suffix}
      </p>
    </div>
  );
}

function MacroCard({
  label,
  value,
  range,
}: {
  label: string;
  value: string;
  range: string;
}) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-5">
      <p className="text-sm text-neutral-400">{label}</p>

      <p className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
        {value}
      </p>

      <p className="mt-2 text-sm leading-6 text-neutral-500">
        interval: {range}
      </p>
    </div>
  );
}

function EstimatedRhythm({ result }: { result: CalorieCalculatorResult }) {
  if (result.input.goal === "maintenance") {
    return <span className="font-medium text-neutral-100">mentinere</span>;
  }

  return (
    <span className="font-medium text-neutral-100">
      {formatKilograms(Math.abs(result.estimatedMonthlyWeightChangeKg))} / luna
    </span>
  );
}

function getGoalLabel(goal: CalorieCalculatorResult["input"]["goal"]): string {
  if (goal === "light_fat_loss") {
    return "Slabire usoara";
  }

  if (goal === "moderate_fat_loss") {
    return "Slabire moderata";
  }

  if (goal === "maintenance") {
    return "Mentinere";
  }

  return "Masa musculara controlata";
}

function buildCopiedResultText(result: CalorieCalculatorResult): string {
  const rhythm =
    result.input.goal === "maintenance"
      ? "mentinere"
      : `${formatKilograms(
          Math.abs(result.estimatedMonthlyWeightChangeKg)
        )} / luna`;

  const macros = result.macros
    ? [
        `Proteine: ${formatGrams(result.macros.proteinGrams)} (${formatGramRange(
          result.macros.proteinRangeGrams
        )})`,
        `Grasimi: ${formatGrams(result.macros.fatGrams)} (${formatGramRange(
          result.macros.fatRangeGrams
        )})`,
        `Carbohidrati: ${formatGrams(
          result.macros.carbohydrateGrams
        )} (${formatGramRange(result.macros.carbohydrateRangeGrams)})`,
      ].join("\n")
    : "Macro-uri: indisponibile";

  return [
    "Rezultat estimativ BMR / TDEE / calorii tinta",
    "",
    `Obiectiv: ${getGoalLabel(result.input.goal)}`,
    `Target caloric recomandat: ${formatCaloriesPerDay(result.targetCalories)}`,
    `Interval realist: ${formatCalorieRange(result.realisticCalorieRange)}`,
    `Ritm estimativ: ${rhythm}`,
    "",
    "Recomandare macro:",
    macros,
    "",
    "Estimari consum:",
    `BMR: ${formatCalories(result.bmr)} / zi`,
    `TDEE estimat: ${formatCalories(result.estimatedTdee)} / zi`,
    `Activitate zilnica: ${formatCalories(result.dailyActivityCalories)} / zi`,
    `Pasi: ${formatCalories(result.stepsCalories)} / zi`,
    `Job ajustat: ${formatCalories(result.jobCalories)} / zi`,
    `Miscare generala: ${formatCalories(result.activityLevelCalories)} / zi`,
    `Antrenament mediu: ${formatCalories(
      result.averageWorkoutCalories
    )} / sedinta`,
    `Antrenamente: ${formatCalories(
      result.trainingCalories
    )} / zi, medie saptamanala`,
    "",
    "Nota: valorile sunt estimari de pornire. Ajustarea se face dupa 2-3 saptamani in functie de progres, energie, aderenta si performanta.",
  ].join("\n");
}

function CopyResultButton({ result }: { result: CalorieCalculatorResult }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const text = buildCopiedResultText(result);

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-2xl border border-emerald-800/70 bg-neutral-950/40 px-4 py-3 text-sm font-semibold text-emerald-100 transition hover:border-emerald-600 hover:bg-emerald-950/50"
    >
      {copied ? "Rezultat copiat" : "Copiaza rezultatul"}
    </button>
  );
}

function SummaryPanel({ result }: { result: CalorieCalculatorResult }) {
  return (
    <div className="rounded-3xl border border-emerald-900 bg-gradient-to-br from-emerald-950/70 to-neutral-900 p-5 shadow-2xl md:p-7">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">
            Recomandare principala
          </p>

          <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight md:text-4xl">
            {formatCaloriesPerDay(result.targetCalories)}
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-100/75">
            Foloseste aceasta valoare ca punct de pornire. Rezultatul real se
            ajusteaza dupa 2-3 saptamani, in functie de progres, energie,
            aderenta si performanta.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-2xl border border-emerald-800/70 bg-neutral-950/40 p-4">
            <p className="text-sm text-emerald-200/80">Interval realist</p>
            <p className="mt-2 text-xl font-semibold">
              {formatCalorieRange(result.realisticCalorieRange)}
            </p>
          </div>

          <CopyResultButton result={result} />
        </div>
      </div>

      {result.macros && (
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-emerald-800/60 bg-neutral-950/40 p-4">
            <p className="text-sm text-emerald-200/80">Proteine</p>
            <p className="mt-1 text-2xl font-semibold">
              {formatGrams(result.macros.proteinGrams)}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-800/60 bg-neutral-950/40 p-4">
            <p className="text-sm text-emerald-200/80">Grasimi</p>
            <p className="mt-1 text-2xl font-semibold">
              {formatGrams(result.macros.fatGrams)}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-800/60 bg-neutral-950/40 p-4">
            <p className="text-sm text-emerald-200/80">Carbohidrati</p>
            <p className="mt-1 text-2xl font-semibold">
              {formatGrams(result.macros.carbohydrateGrams)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export function CalculatorResults({
  result,
}: {
  result: CalorieCalculatorResult;
}) {
  return (
    <section className="flex flex-col gap-6">
      <SummaryPanel result={result} />

      <div className="grid gap-4 sm:grid-cols-3">
        <ResultCard label="BMR" value={formatNumber(result.bmr)} />

        <ResultCard
          label="Activitate zilnica"
          value={formatNumber(result.dailyActivityCalories)}
        />

        <ResultCard
          label="TDEE estimat"
          value={formatNumber(result.estimatedTdee)}
        />
      </div>

      <div className="rounded-3xl border border-neutral-800 bg-neutral-900 p-5 md:p-6">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-emerald-400">
            Breakdown activitate
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            Cum este estimata miscarea zilnica
          </h2>

          <p className="mt-2 text-sm leading-6 text-neutral-400">
            Valorile sunt estimative. Pasii, jobul si miscarea generala sunt
            ajustate pentru a reduce suprapunerea dintre ele.
          </p>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <ResultCard label="Pasi" value={formatNumber(result.stepsCalories)} />

          <ResultCard
            label="Job ajustat"
            value={formatNumber(result.jobCalories)}
          />

          <ResultCard
            label="Miscare generala"
            value={formatNumber(result.activityLevelCalories)}
          />

          <ResultCard
            label="Antrenament mediu"
            value={formatNumber(result.averageWorkoutCalories)}
            suffix="kcal / sedinta"
          />

          <ResultCard
            label="Antrenamente"
            value={formatNumber(result.trainingCalories)}
            suffix="kcal / zi, medie saptamanala"
          />
        </div>
      </div>

      <div className="rounded-3xl border border-neutral-800 bg-neutral-900 p-5 md:p-6">
        <h2 className="text-xl font-semibold">Interval realist</h2>

        <p className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
          {formatCalorieRange(result.realisticCalorieRange)}
        </p>

        <p className="mt-4 text-neutral-300">
          Ritm estimativ: <EstimatedRhythm result={result} />
        </p>
      </div>

      {result.macros && (
        <div className="rounded-3xl border border-neutral-800 bg-neutral-900 p-5 md:p-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-emerald-400">
                Macro-uri
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                Recomandare estimativa
              </h2>
            </div>

            <p className="text-sm text-neutral-400">
              calculate din targetul de{" "}
              {formatCaloriesPerDay(result.targetCalories)}
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <MacroCard
              label="Proteine"
              value={formatGrams(result.macros.proteinGrams)}
              range={formatGramRange(result.macros.proteinRangeGrams)}
            />

            <MacroCard
              label="Grasimi"
              value={formatGrams(result.macros.fatGrams)}
              range={formatGramRange(result.macros.fatRangeGrams)}
            />

            <MacroCard
              label="Carbohidrati"
              value={formatGrams(result.macros.carbohydrateGrams)}
              range={formatGramRange(result.macros.carbohydrateRangeGrams)}
            />
          </div>

          <p className="mt-5 leading-7 text-neutral-300">
            {result.macros.explanation}
          </p>
        </div>
      )}

      <div className="rounded-3xl border border-neutral-800 bg-neutral-900 p-5 md:p-6">
        <h2 className="text-xl font-semibold">Explicatie</h2>

        <p className="mt-4 leading-7 text-neutral-300">
          {result.explanation.summary}
        </p>

        <p className="mt-4 leading-7 text-neutral-400">
          {result.explanation.adjustmentAdvice}
        </p>

        <p className="mt-4 text-sm leading-6 text-neutral-500">
          {result.explanation.safetyNote}
        </p>
      </div>

      {result.warnings.length > 0 && (
        <div className="rounded-3xl border border-amber-700 bg-amber-950/40 p-5 md:p-6">
          <h2 className="text-xl font-semibold text-amber-200">Atentionari</h2>

          <div className="mt-4 space-y-4">
            {result.warnings.map((warning) => (
              <div key={warning.title}>
                <p className="font-medium text-amber-100">{warning.title}</p>

                <p className="mt-1 text-sm leading-6 text-amber-100/80">
                  {warning.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}