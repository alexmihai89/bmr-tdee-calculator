// components/CalculatorResults.tsx

"use client";

import { useState } from "react";
import { MinimalIcon } from "@/components/MinimalIcon";
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
  icon,
}: {
  label: string;
  value: string;
  suffix?: string;
  highlight?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className={
        highlight
          ? "relative overflow-hidden rounded-3xl border border-emerald-700/20 bg-emerald-50 p-5 pr-16 shadow-sm"
          : "relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-5 pr-16 shadow-sm"
      }
    >
      <p
        className={
          highlight
            ? "text-sm font-medium leading-5 text-emerald-800"
            : "text-sm font-medium leading-5 text-neutral-500"
        }
      >
        {label}
      </p>

      {icon && (
        <div
          className={
            highlight
              ? "absolute right-4 top-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-700"
              : "absolute right-4 top-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-neutral-50 text-neutral-500"
          }
        >
          {icon}
        </div>
      )}

      <p className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
        {value}
      </p>

      <p
        className={
          highlight
            ? "mt-1 text-sm leading-6 text-emerald-800/70"
            : "mt-1 text-sm leading-6 text-neutral-400"
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
  icon,
}: {
  label: string;
  value: string;
  range: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-5 pr-16 shadow-sm">
      <p className="text-sm font-medium leading-5 text-neutral-500">{label}</p>

      <div className="absolute right-4 top-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
        {icon}
      </div>

      <p className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
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
    return <span className="font-semibold text-neutral-950">mentinere</span>;
  }

  return (
    <span className="font-semibold text-neutral-950">
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

function formatLiters(value: number): string {
  return value.toLocaleString("ro-RO", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

function formatHydrationRange(result: CalorieCalculatorResult): string {
  return `${formatLiters(
    result.hydration.dailyWaterLitersRange.min
  )} - ${formatLiters(result.hydration.dailyWaterLitersRange.max)} L`;
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
    "Hidratare:",
    `Apa recomandata: ${formatHydrationRange(result)} / zi`,
    "Nota: foloseste intervalul ca reper general. In zilele cu antrenamente, caldura sau transpiratie ridicata, poate fi nevoie de putin mai mult.",
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
      className="rounded-2xl border border-emerald-700/20 bg-white px-4 py-3 text-sm font-semibold text-emerald-800 shadow-sm transition hover:border-emerald-700/35 hover:bg-emerald-50"
    >
      {copied ? "Rezultat copiat" : "Copiaza rezultatul"}
    </button>
  );
}

function SummaryPanel({ result }: { result: CalorieCalculatorResult }) {
  return (
    <div className="rounded-[2rem] border border-emerald-700/15 bg-gradient-to-br from-emerald-50 via-white to-white p-5 shadow-[0_20px_80px_rgba(15,23,42,0.08)] md:p-7">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
              <MinimalIcon name="target" className="h-5 w-5" />
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Recomandare principala
            </p>
          </div>

          <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-neutral-950 md:text-5xl">
            {formatCaloriesPerDay(result.targetCalories)}
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
            Foloseste aceasta valoare ca punct de pornire. Rezultatul real se
            ajusteaza dupa 2-3 saptamani, in functie de progres, energie,
            aderenta si performanta.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <div className="rounded-full border border-emerald-700/15 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800">
              Obiectiv: {getGoalLabel(result.input.goal)}
            </div>

            <div className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-600">
              Ritm:{" "}
              {result.input.goal === "maintenance"
                ? "mentinere"
                : `${formatKilograms(
                    Math.abs(result.estimatedMonthlyWeightChangeKg)
                  )} / luna`}
            </div>

            <div className="rounded-full border border-sky-100 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-800">
              Hidratare: {formatHydrationRange(result)} / zi
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-3xl border border-emerald-700/15 bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-emerald-800">
              Interval realist
            </p>
            <p className="mt-2 text-xl font-semibold text-neutral-950">
              {formatCalorieRange(result.realisticCalorieRange)}
            </p>
          </div>

          <CopyResultButton result={result} />
        </div>
      </div>

      {result.macros && (
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-3xl border border-emerald-700/15 bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-emerald-800">Proteine</p>
            <p className="mt-1 text-2xl font-semibold text-neutral-950">
              {formatGrams(result.macros.proteinGrams)}
            </p>
          </div>

          <div className="rounded-3xl border border-emerald-700/15 bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-emerald-800">Grasimi</p>
            <p className="mt-1 text-2xl font-semibold text-neutral-950">
              {formatGrams(result.macros.fatGrams)}
            </p>
          </div>

          <div className="rounded-3xl border border-emerald-700/15 bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-emerald-800">
              Carbohidrati
            </p>
            <p className="mt-1 text-2xl font-semibold text-neutral-950">
              {formatGrams(result.macros.carbohydrateGrams)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function HydrationPanel({ result }: { result: CalorieCalculatorResult }) {
  return (
    <div className="rounded-[2rem] border border-neutral-200 bg-white/90 p-5 shadow-[0_20px_80px_rgba(15,23,42,0.06)] backdrop-blur md:p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
              <MinimalIcon name="hydration" className="h-5 w-5" />
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Hidratare
            </p>
          </div>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950">
            Recomandare orientativa
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
            {result.hydration.explanation}
          </p>
        </div>

        <div className="rounded-3xl border border-emerald-700/15 bg-emerald-50 p-5 md:min-w-64">
          <p className="text-sm font-medium text-emerald-800">
            Apa recomandata
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
            {formatHydrationRange(result)}
          </p>
          <p className="mt-1 text-sm text-emerald-800/70">pe zi</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-neutral-200 bg-neutral-50/80 p-4">
          <p className="text-sm font-semibold text-neutral-950">
            Reper simplu
          </p>
          <p className="mt-2 text-sm leading-6 text-neutral-500">
            Intervalul este calculat pe baza greutatii corporale, folosind
            aproximativ 30-40 ml / kg corp / zi.
          </p>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-neutral-50/80 p-4">
          <p className="text-sm font-semibold text-neutral-950">
            Ajustare practica
          </p>
          <p className="mt-2 text-sm leading-6 text-neutral-500">
            {result.hydration.adjustmentNote}
          </p>
        </div>
      </div>
    </div>
  );
}

function ActivityBreakdownBar({ result }: { result: CalorieCalculatorResult }) {
  const bmr = Math.max(result.bmr, 0);
  const activity = Math.max(result.dailyActivityCalories, 0);
  const training = Math.max(result.trainingCalories, 0);
  const total = Math.max(result.estimatedTdee, 1);

  const bmrPercent = Math.max(8, (bmr / total) * 100);
  const activityPercent = Math.max(4, (activity / total) * 100);
  const trainingPercent =
    training > 0 ? Math.max(4, (training / total) * 100) : 0;

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <MinimalIcon name="activity" className="h-5 w-5" />
        </div>

        <div>
          <p className="text-sm font-semibold text-neutral-950">
            Compozitie TDEE
          </p>
          <p className="mt-1 text-xs leading-5 text-neutral-500">
            O vedere simplificata asupra contributiei BMR, miscarii zilnice si
            antrenamentelor.
          </p>
        </div>
      </div>

      <div className="mt-5 flex h-4 overflow-hidden rounded-full bg-neutral-100">
        <div
          className="bg-emerald-700"
          style={{ width: `${bmrPercent}%` }}
          title="BMR"
        />
        <div
          className="bg-emerald-400"
          style={{ width: `${activityPercent}%` }}
          title="Activitate"
        />
        {trainingPercent > 0 && (
          <div
            className="bg-sky-400"
            style={{ width: `${trainingPercent}%` }}
            title="Antrenamente"
          />
        )}
      </div>

      <div className="mt-4 grid gap-2 text-xs text-neutral-500 sm:grid-cols-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-700" />
          BMR: {formatCalories(result.bmr)}
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          Activitate: {formatCalories(result.dailyActivityCalories)}
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
          Antrenamente: {formatCalories(result.trainingCalories)}
        </div>
      </div>
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
        <ResultCard
          label="BMR"
          value={formatNumber(result.bmr)}
          icon={<MinimalIcon name="calculator" className="h-5 w-5" />}
        />

        <ResultCard
          label="Activitate zilnica"
          value={formatNumber(result.dailyActivityCalories)}
          icon={<MinimalIcon name="steps" className="h-5 w-5" />}
        />

        <ResultCard
          label="TDEE estimat"
          value={formatNumber(result.estimatedTdee)}
          highlight
          icon={<MinimalIcon name="target" className="h-5 w-5" />}
        />
      </div>

      <ActivityBreakdownBar result={result} />

      <div className="rounded-[2rem] border border-neutral-200 bg-white/90 p-5 shadow-[0_20px_80px_rgba(15,23,42,0.06)] backdrop-blur md:p-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <MinimalIcon name="activity" className="h-5 w-5" />
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Breakdown activitate
            </p>
          </div>

          <h2 className="mt-3 text-xl font-semibold text-neutral-950">
            Cum este estimata miscarea zilnica
          </h2>

          <p className="mt-2 text-sm leading-6 text-neutral-600">
            Valorile sunt estimative. Pasii, jobul si miscarea generala sunt
            ajustate pentru a reduce suprapunerea dintre ele.
          </p>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <ResultCard
            label="Pasi"
            value={formatNumber(result.stepsCalories)}
            icon={<MinimalIcon name="steps" className="h-5 w-5" />}
          />

          <ResultCard
            label="Job ajustat"
            value={formatNumber(result.jobCalories)}
            icon={<MinimalIcon name="activity" className="h-5 w-5" />}
          />

          <ResultCard
            label="Miscare generala"
            value={formatNumber(result.activityLevelCalories)}
            icon={<MinimalIcon name="activity" className="h-5 w-5" />}
          />

          <ResultCard
            label="Antrenament mediu"
            value={formatNumber(result.averageWorkoutCalories)}
            suffix="kcal / sedinta"
            icon={<MinimalIcon name="training" className="h-5 w-5" />}
          />

          <ResultCard
            label="Antrenamente"
            value={formatNumber(result.trainingCalories)}
            suffix="kcal / zi, medie saptamanala"
            icon={<MinimalIcon name="training" className="h-5 w-5" />}
          />
        </div>
      </div>

      <div className="rounded-[2rem] border border-neutral-200 bg-white/90 p-5 shadow-[0_20px_80px_rgba(15,23,42,0.06)] backdrop-blur md:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <MinimalIcon name="trend" className="h-5 w-5" />
          </div>

          <h2 className="text-xl font-semibold text-neutral-950">
            Interval realist
          </h2>
        </div>

        <p className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
          {formatCalorieRange(result.realisticCalorieRange)}
        </p>

        <p className="mt-4 text-neutral-600">
          Ritm estimativ: <EstimatedRhythm result={result} />
        </p>
      </div>

      <HydrationPanel result={result} />

      {result.macros && (
        <div className="rounded-[2rem] border border-neutral-200 bg-white/90 p-5 shadow-[0_20px_80px_rgba(15,23,42,0.06)] backdrop-blur md:p-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <MinimalIcon name="macros" className="h-5 w-5" />
                </div>

                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  Macro-uri
                </p>
              </div>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950">
                Recomandare estimativa
              </h2>
            </div>

            <p className="text-sm text-neutral-500">
              calculate din targetul de{" "}
              {formatCaloriesPerDay(result.targetCalories)}
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <MacroCard
              label="Proteine"
              value={formatGrams(result.macros.proteinGrams)}
              range={formatGramRange(result.macros.proteinRangeGrams)}
              icon={<MinimalIcon name="macros" className="h-5 w-5" />}
            />

            <MacroCard
              label="Grasimi"
              value={formatGrams(result.macros.fatGrams)}
              range={formatGramRange(result.macros.fatRangeGrams)}
              icon={<MinimalIcon name="macros" className="h-5 w-5" />}
            />

            <MacroCard
              label="Carbohidrati"
              value={formatGrams(result.macros.carbohydrateGrams)}
              range={formatGramRange(result.macros.carbohydrateRangeGrams)}
              icon={<MinimalIcon name="macros" className="h-5 w-5" />}
            />
          </div>

          <p className="mt-5 leading-7 text-neutral-600">
            {result.macros.explanation}
          </p>
        </div>
      )}

      <div className="rounded-[2rem] border border-neutral-200 bg-white/90 p-5 shadow-[0_20px_80px_rgba(15,23,42,0.06)] backdrop-blur md:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-50 text-neutral-600">
            <MinimalIcon name="info" className="h-5 w-5" />
          </div>

          <h2 className="text-xl font-semibold text-neutral-950">Explicatie</h2>
        </div>

        <p className="mt-4 leading-7 text-neutral-700">
          {result.explanation.summary}
        </p>

        <p className="mt-4 leading-7 text-neutral-600">
          {result.explanation.adjustmentAdvice}
        </p>

        <p className="mt-4 text-sm leading-6 text-neutral-500">
          {result.explanation.safetyNote}
        </p>
      </div>

      {result.warnings.length > 0 && (
        <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-5 shadow-[0_20px_80px_rgba(15,23,42,0.04)] md:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-amber-700">
              <MinimalIcon name="warning" className="h-5 w-5" />
            </div>

            <h2 className="text-xl font-semibold text-amber-950">
              Atentionari
            </h2>
          </div>

          <div className="mt-4 space-y-4">
            {result.warnings.map((warning) => (
              <div key={warning.title}>
                <p className="font-semibold text-amber-950">
                  {warning.title}
                </p>

                <p className="mt-1 text-sm leading-6 text-amber-900/75">
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