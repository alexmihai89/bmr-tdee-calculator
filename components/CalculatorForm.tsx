// components/CalculatorForm.tsx

"use client";

import { useEffect, useState } from "react";
import { CalculatorResults } from "@/components/CalculatorResults";
import { MinimalIcon } from "@/components/MinimalIcon";
import { calculateCalories } from "@/lib/calorieCalculator";
import { formatSteps } from "@/lib/formatters";
import type {
  CalorieCalculatorInput,
  CalorieCalculatorResult,
  DailyActivityLevel,
  Goal,
  JobType,
  Sex,
  TrainingIntensity,
  TrainingType,
} from "@/lib/types";

import {
  DAILY_ACTIVITY_OPTIONS,
  GOAL_OPTIONS,
  JOB_TYPE_OPTIONS,
  TRAINING_INTENSITY_OPTIONS,
  TRAINING_TYPE_OPTIONS,
} from "@/lib/types";

const initialInput: CalorieCalculatorInput = {
  sex: "male",
  age: 35,
  heightCm: 180,
  weightKg: 80,

  goal: "light_fat_loss",

  dailyActivityLevel: "moderate",
  averageStepsPerDay: 8000,
  jobType: "mixed",

  workoutsPerWeek: 4,
  averageWorkoutDurationMinutes: 60,
  trainingType: "strength",
  trainingIntensity: "moderate",
};

const stepPresets = [
  {
    label: "Sedentar",
    value: 3000,
    description: "foarte putina miscare",
  },
  {
    label: "Zi obisnuita",
    value: 5000,
    description: "sedentar, dar cu deplasari normale",
  },
  {
    label: "Moderat activ",
    value: 7500,
    description: "miscare constanta in timpul zilei",
  },
  {
    label: "Activ",
    value: 10000,
    description: "multe deplasari zilnice",
  },
];

const trainingTypeGuidance: Record<TrainingType, string> = {
  strength:
    "Forta: sala, aparate, gantere, haltere, exercitii cu greutatea corpului. Include pauze intre serii si consumul este de obicei moderat.",
  cardio:
    "Cardio: alergare, bicicleta, eliptica, rowing, mers intens. De obicei are consum mai constant pe durata antrenamentului.",
  mixed:
    "Mixt: combinatie intre forta si cardio in aceeasi sedinta. Potrivit pentru antrenamente clasice de sala cu final cardio sau circuite moderate.",
  group_fitness:
    "Clase / group fitness: clase de grup, functional, aerobic, cycling, circuit. Consumul poate varia mult in functie de format si ritm.",
};

const trainingIntensityGuidance: Record<TrainingIntensity, string> = {
  light:
    "Usoara: poti vorbi relativ usor, pauzele sunt confortabile, nu simti ca te apropii de limita.",
  moderate:
    "Moderata: efort clar, respiratie mai intensa, dar poti sustine antrenamentul fara sa te epuizezi.",
  high:
    "Ridicata: efort greu, respiratie puternica, pauze mai necesare, senzatie clara de solicitare mare.",
};

function SectionHeader({
  number,
  title,
  description,
  icon,
}: {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-neutral-50/80 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
          {icon}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
            {number}
          </p>

          <h3 className="mt-1 text-base font-semibold text-neutral-950">
            {title}
          </h3>

          <p className="mt-1 text-xs leading-5 text-neutral-500">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  suffix,
  helperText,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  suffix?: string;
  helperText?: string;
}) {
  const [draftValue, setDraftValue] = useState(String(value));

  useEffect(() => {
    setDraftValue(String(value));
  }, [value]);

  function handleChange(rawValue: string) {
    const onlyNumbers = rawValue.replace(/[^\d]/g, "");

    setDraftValue(onlyNumbers);

    if (onlyNumbers === "") {
      return;
    }

    const numericValue = Number(onlyNumbers);

    if (!Number.isFinite(numericValue)) {
      return;
    }

    onChange(numericValue);
  }

  function handleBlur() {
    if (draftValue === "") {
      const fallbackValue = min ?? 0;
      setDraftValue(String(fallbackValue));
      onChange(fallbackValue);
      return;
    }

    let numericValue = Number(draftValue);

    if (typeof min === "number" && numericValue < min) {
      numericValue = min;
    }

    if (typeof max === "number" && numericValue > max) {
      numericValue = max;
    }

    setDraftValue(String(numericValue));
    onChange(numericValue);
  }

  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-neutral-700">{label}</span>

      <div className="flex items-center rounded-2xl border border-neutral-200 bg-white px-4 shadow-sm transition focus-within:border-emerald-600/40 focus-within:ring-4 focus-within:ring-emerald-600/10">
        <input
          type="text"
          inputMode="numeric"
          value={draftValue}
          onChange={(event) => handleChange(event.target.value)}
          onBlur={handleBlur}
          className="w-full bg-transparent py-3 text-base text-neutral-950 outline-none"
        />
        {suffix && <span className="text-sm text-neutral-400">{suffix}</span>}
      </div>

      {helperText && (
        <span className="text-xs leading-5 text-neutral-500">{helperText}</span>
      )}
    </label>
  );
}

function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
  helperText,
}: {
  label: string;
  value: T;
  options: { value: T; label: string; description?: string }[];
  onChange: (value: T) => void;
  helperText?: string;
}) {
  const selectedOption = options.find((option) => option.value === value);

  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-neutral-700">{label}</span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-base text-neutral-950 shadow-sm outline-none transition focus:border-emerald-600/40 focus:ring-4 focus:ring-emerald-600/10"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {selectedOption?.description && (
        <span className="text-xs leading-5 text-emerald-700">
          {selectedOption.description}
        </span>
      )}

      {helperText && (
        <span className="text-xs leading-5 text-neutral-500">{helperText}</span>
      )}
    </label>
  );
}

function GoalCardSelector({
  value,
  onChange,
}: {
  value: Goal;
  onChange: (value: Goal) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {GOAL_OPTIONS.map((option) => {
        const isSelected = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={
              isSelected
                ? "rounded-3xl border border-emerald-700/30 bg-emerald-50 p-4 text-left shadow-sm"
                : "rounded-3xl border border-neutral-200 bg-white p-4 text-left shadow-sm transition hover:border-emerald-700/20 hover:bg-emerald-50/40"
            }
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p
                  className={
                    isSelected
                      ? "text-sm font-semibold text-emerald-900"
                      : "text-sm font-semibold text-neutral-950"
                  }
                >
                  {option.label}
                </p>

                <p
                  className={
                    isSelected
                      ? "mt-2 text-xs leading-5 text-emerald-900/75"
                      : "mt-2 text-xs leading-5 text-neutral-500"
                  }
                >
                  {option.description}
                </p>
              </div>

              <div
                className={
                  isSelected
                    ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-700"
                    : "flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-neutral-50 text-neutral-400"
                }
              >
                <MinimalIcon
                  name={isSelected ? "check" : "target"}
                  className="h-4 w-4"
                />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function StepPresetButtons({
  currentSteps,
  onSelect,
}: {
  currentSteps: number;
  onSelect: (value: number) => void;
}) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-neutral-50/80 p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <MinimalIcon name="steps" className="h-5 w-5" />
        </div>

        <div>
          <p className="text-sm font-semibold text-neutral-950">
            Nu stii cati pasi faci?
          </p>

          <p className="mt-2 text-xs leading-5 text-neutral-500">
            Alege o estimare conservatoare. Daca ai telefon sau ceas, foloseste
            media reala pe 7-14 zile.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {stepPresets.map((preset) => {
          const isSelected = currentSteps === preset.value;

          return (
            <button
              key={preset.value}
              type="button"
              onClick={() => onSelect(preset.value)}
              className={
                isSelected
                  ? "rounded-2xl border border-emerald-700/30 bg-emerald-50 p-3 text-left shadow-sm"
                  : "rounded-2xl border border-neutral-200 bg-white p-3 text-left shadow-sm transition hover:border-emerald-700/20 hover:bg-emerald-50/40"
              }
            >
              <span className="block text-sm font-semibold text-neutral-950">
                {preset.label}
              </span>
              <span className="mt-1 block text-sm font-semibold text-emerald-700">
                {formatSteps(preset.value)}
              </span>
              <span className="mt-1 block text-xs leading-5 text-neutral-500">
                {preset.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "A aparut o eroare la calcul. Verifica datele introduse si incearca din nou.";
}

export function CalculatorForm() {
  const [input, setInput] = useState<CalorieCalculatorInput>(initialInput);
  const [result, setResult] = useState<CalorieCalculatorResult>(() =>
    calculateCalories(initialInput)
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hasTraining = input.workoutsPerWeek > 0;

  function updateInput<K extends keyof CalorieCalculatorInput>(
    key: K,
    value: CalorieCalculatorInput[K]
  ) {
    setInput((currentInput) => ({
      ...currentInput,
      [key]: value,
    }));

    if (errorMessage) {
      setErrorMessage(null);
    }
  }

  function updateWorkoutsPerWeek(value: number) {
    const safeValue = Math.max(0, value);

    setInput((currentInput) => ({
      ...currentInput,
      workoutsPerWeek: safeValue,
      averageWorkoutDurationMinutes:
        safeValue === 0 ? 0 : currentInput.averageWorkoutDurationMinutes || 60,
    }));

    if (errorMessage) {
      setErrorMessage(null);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const calculatedResult = calculateCalories(input);
      setResult(calculatedResult);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  }

  function handleReset() {
    setInput(initialInput);
    setResult(calculateCalories(initialInput));
    setErrorMessage(null);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <form
        onSubmit={handleSubmit}
        className="rounded-[2rem] border border-neutral-200 bg-white/90 p-5 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-7"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Date utilizator
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
              Calculator
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
              Completeaza datele principale. Rezultatul este o estimare de
              pornire, nu o valoare fixa.
            </p>
          </div>

          <div className="w-fit rounded-full border border-emerald-700/15 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-800">
            Input personalizat
          </div>
        </div>

        {errorMessage && (
          <div className="mt-5 rounded-3xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-950">
              Verifica datele introduse
            </p>
            <p className="mt-1 text-sm leading-6 text-amber-900/75">
              {errorMessage}
            </p>
          </div>
        )}

        <div className="mt-6 grid gap-6">
          <SectionHeader
            number="01"
            title="Date personale"
            description="Aceste informatii sunt folosite pentru estimarea BMR prin formula Mifflin-St Jeor."
            icon={<MinimalIcon name="calculator" className="h-5 w-5" />}
          />

          <SelectField<Sex>
            label="Sex"
            value={input.sex}
            options={[
              { value: "male", label: "Barbat" },
              { value: "female", label: "Femeie" },
            ]}
            onChange={(value) => updateInput("sex", value)}
          />

          <div className="grid gap-4 sm:grid-cols-3">
            <NumberField
              label="Varsta"
              value={input.age}
              min={14}
              max={90}
              suffix="ani"
              onChange={(value) => updateInput("age", value)}
            />

            <NumberField
              label="Inaltime"
              value={input.heightCm}
              min={120}
              max={230}
              suffix="cm"
              onChange={(value) => updateInput("heightCm", value)}
            />

            <NumberField
              label="Greutate"
              value={input.weightKg}
              min={35}
              max={250}
              suffix="kg"
              onChange={(value) => updateInput("weightKg", value)}
            />
          </div>

          <SectionHeader
            number="02"
            title="Obiectiv"
            description="Alege directia principala. Calculatorul va seta deficitul, mentinerea sau surplusul intr-un mod conservator."
            icon={<MinimalIcon name="target" className="h-5 w-5" />}
          />

          <GoalCardSelector
            value={input.goal}
            onChange={(value) => updateInput("goal", value)}
          />

          <SectionHeader
            number="03"
            title="Activitate zilnica"
            description="Pasii, jobul si miscarea generala sunt estimate separat pentru un TDEE mai realist."
            icon={<MinimalIcon name="steps" className="h-5 w-5" />}
          />

          <SelectField<DailyActivityLevel>
            label="Miscare zilnica generala"
            value={input.dailyActivityLevel}
            options={DAILY_ACTIVITY_OPTIONS}
            onChange={(value) => updateInput("dailyActivityLevel", value)}
            helperText="Alege nivelul care descrie ziua ta obisnuita in afara antrenamentelor. Daca ai introdus deja multi pasi, nu supraestima acest camp."
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField
              label="Pasi medii pe zi"
              value={input.averageStepsPerDay}
              min={0}
              max={40000}
              suffix="pasi"
              helperText="Pasii trebuie sa fie totalul din toata ziua, inclusiv mersul de la munca, deplasari si plimbari."
              onChange={(value) => updateInput("averageStepsPerDay", value)}
            />

            <SelectField<JobType>
              label="Tip job"
              value={input.jobType}
              options={JOB_TYPE_OPTIONS}
              onChange={(value) => updateInput("jobType", value)}
              helperText="Alege cat de solicitanta este munca ta obisnuita. Calculatorul ajusteaza automat suprapunerea dintre pasi, job si activitate."
            />
          </div>

          <StepPresetButtons
            currentSteps={input.averageStepsPerDay}
            onSelect={(value) => updateInput("averageStepsPerDay", value)}
          />

          <SectionHeader
            number="04"
            title="Antrenamente"
            description="Antrenamentele sunt calculate separat si apoi transformate in medie zilnica saptamanala."
            icon={<MinimalIcon name="training" className="h-5 w-5" />}
          />

          <div className="rounded-[2rem] border border-neutral-200 bg-neutral-50/80 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                <MinimalIcon name="training" className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-base font-semibold text-neutral-950">
                  Antrenamente
                </h3>

                <p className="mt-2 text-sm leading-6 text-neutral-600">
                  Daca nu te antrenezi momentan, seteaza 0. Calculatorul va
                  exclude automat caloriile din antrenamente.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <NumberField
                label="Antrenamente / saptamana"
                value={input.workoutsPerWeek}
                min={0}
                max={14}
                helperText="Pune 0 daca nu ai antrenamente structurate."
                onChange={updateWorkoutsPerWeek}
              />

              {hasTraining && (
                <NumberField
                  label="Durata medie"
                  value={input.averageWorkoutDurationMinutes}
                  min={0}
                  max={240}
                  suffix="min"
                  helperText="Durata efectiva aproximativa, nu timpul total petrecut in sala."
                  onChange={(value) =>
                    updateInput("averageWorkoutDurationMinutes", value)
                  }
                />
              )}
            </div>

            {!hasTraining && (
              <div className="mt-4 rounded-3xl border border-neutral-200 bg-white p-4">
                <p className="text-sm leading-6 text-neutral-600">
                  Pentru acest profil, antrenamentele sunt calculate ca{" "}
                  <span className="font-semibold text-neutral-950">0 kcal</span>
                  . TDEE-ul va fi estimat doar din BMR, activitate zilnica,
                  pasi si tipul de job.
                </p>
              </div>
            )}

            {hasTraining && (
              <div className="mt-5 grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <SelectField<TrainingType>
                    label="Tip antrenament"
                    value={input.trainingType}
                    options={TRAINING_TYPE_OPTIONS}
                    onChange={(value) => updateInput("trainingType", value)}
                    helperText={trainingTypeGuidance[input.trainingType]}
                  />

                  <SelectField<TrainingIntensity>
                    label="Intensitate"
                    value={input.trainingIntensity}
                    options={TRAINING_INTENSITY_OPTIONS}
                    onChange={(value) =>
                      updateInput("trainingIntensity", value)
                    }
                    helperText={
                      trainingIntensityGuidance[input.trainingIntensity]
                    }
                  />
                </div>

                <div className="rounded-3xl border border-sky-100 bg-sky-50/70 p-4">
                  <p className="text-sm leading-6 text-sky-950/75">
                    Intensitatea este o estimare. Pentru majoritatea oamenilor,
                    „moderata” este alegerea potrivita daca antrenamentul este
                    solicitant, dar sustenabil. Alege „ridicata” doar daca
                    sedintele sunt constant grele si bine sustinute.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <button
              type="submit"
              className="rounded-2xl bg-emerald-700 px-5 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-900/10 transition hover:bg-emerald-600"
            >
              Calculeaza rezultatul
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-base font-semibold text-neutral-700 shadow-sm transition hover:border-neutral-300 hover:bg-neutral-50"
            >
              Reseteaza
            </button>
          </div>
        </div>
      </form>

      <CalculatorResults result={result} />
    </div>
  );
}