// components/CalculatorForm.tsx

"use client";

import { useEffect, useState } from "react";
import { CalculatorResults } from "@/components/CalculatorResults";
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
      <span className="text-sm text-neutral-300">{label}</span>

      <div className="flex items-center rounded-2xl border border-neutral-800 bg-neutral-950/70 px-4">
        <input
          type="text"
          inputMode="numeric"
          value={draftValue}
          onChange={(event) => handleChange(event.target.value)}
          onBlur={handleBlur}
          className="w-full bg-transparent py-3 text-base text-neutral-100 outline-none"
        />
        {suffix && <span className="text-sm text-neutral-500">{suffix}</span>}
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
      <span className="text-sm text-neutral-300">{label}</span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="rounded-2xl border border-neutral-800 bg-neutral-950/70 px-4 py-3 text-base text-neutral-100 outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {selectedOption?.description && (
        <span className="text-xs leading-5 text-emerald-300/80">
          {selectedOption.description}
        </span>
      )}

      {helperText && (
        <span className="text-xs leading-5 text-neutral-500">{helperText}</span>
      )}
    </label>
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
    <div className="rounded-2xl border border-neutral-800 bg-neutral-950/40 p-4">
      <p className="text-sm font-medium text-neutral-200">
        Nu stii cati pasi faci?
      </p>

      <p className="mt-2 text-xs leading-5 text-neutral-500">
        Alege o estimare conservatoare. Daca ai telefon sau ceas, foloseste
        media reala pe 7-14 zile.
      </p>

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
                  ? "rounded-2xl border border-emerald-700 bg-emerald-950/50 p-3 text-left"
                  : "rounded-2xl border border-neutral-800 bg-neutral-900 p-3 text-left transition hover:border-neutral-700"
              }
            >
              <span className="block text-sm font-medium text-neutral-100">
                {preset.label}
              </span>
              <span className="mt-1 block text-sm text-emerald-300">
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
        className="rounded-3xl border border-neutral-800 bg-neutral-900/80 p-5 shadow-2xl md:p-6"
      >
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-emerald-400">
            Date utilizator
          </p>
          <h2 className="mt-2 text-2xl font-semibold">Calculator</h2>
          <p className="mt-3 text-sm leading-6 text-neutral-400">
            Completeaza datele principale. Rezultatul este o estimare de
            pornire, nu o valoare fixa.
          </p>
        </div>

        {errorMessage && (
          <div className="mt-5 rounded-2xl border border-amber-700 bg-amber-950/40 p-4">
            <p className="text-sm font-medium text-amber-100">
              Verifica datele introduse
            </p>
            <p className="mt-1 text-sm leading-6 text-amber-100/80">
              {errorMessage}
            </p>
          </div>
        )}

        <div className="mt-6 grid gap-4">
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

          <SelectField<Goal>
            label="Obiectiv"
            value={input.goal}
            options={GOAL_OPTIONS}
            onChange={(value) => updateInput("goal", value)}
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

          <div className="rounded-3xl border border-neutral-800 bg-neutral-950/40 p-4">
            <h3 className="text-base font-semibold text-neutral-100">
              Antrenamente
            </h3>

            <p className="mt-2 text-sm leading-6 text-neutral-400">
              Daca nu te antrenezi momentan, seteaza 0. Calculatorul va exclude
              automat caloriile din antrenamente.
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
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
              <div className="mt-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
                <p className="text-sm leading-6 text-neutral-400">
                  Pentru acest profil, antrenamentele sunt calculate ca{" "}
                  <span className="font-medium text-neutral-200">0 kcal</span>.
                  TDEE-ul va fi estimat doar din BMR, activitate zilnica, pasi
                  si tipul de job.
                </p>
              </div>
            )}

            {hasTraining && (
              <div className="mt-4 grid gap-4">
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

                <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
                  <p className="text-sm leading-6 text-neutral-400">
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
              className="rounded-2xl bg-emerald-500 px-5 py-4 text-base font-semibold text-neutral-950 transition hover:bg-emerald-400"
            >
              Calculeaza rezultatul
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="rounded-2xl border border-neutral-700 px-5 py-4 text-base font-semibold text-neutral-200 transition hover:border-neutral-500 hover:bg-neutral-800"
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