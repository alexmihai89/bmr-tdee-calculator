// components/CalculatorForm.tsx

"use client";

import { useId, useRef, useState } from "react";
import { CalculatorResults } from "@/components/CalculatorResults";
import { MinimalIcon } from "@/components/MinimalIcon";
import { calculateCalories } from "@/lib/calorieCalculator";
import { formatSteps } from "@/lib/formatters";
import {
  DEFAULT_INPUT,
  normalizeStoredInput,
  parseInputFromQuery,
} from "@/lib/inputSerialization";
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

const initialInput: CalorieCalculatorInput = DEFAULT_INPUT;

const lastInputStorageKey = "am-calorie-calculator-last-input";

/**
 * Resolves the input to start from: a shared link wins, then the last saved
 * input on this device, then the defaults. Runs once, client-side; the form
 * is gated behind the client-only disclaimer, so there is no SSR mismatch.
 */
function resolveInitialInput(): {
  input: CalorieCalculatorInput;
  isUserData: boolean;
} {
  if (typeof window === "undefined") {
    return { input: initialInput, isUserData: false };
  }

  const fromQuery = parseInputFromQuery(window.location.search);

  if (fromQuery) {
    return { input: fromQuery, isUserData: true };
  }

  try {
    const saved = window.localStorage.getItem(lastInputStorageKey);

    if (saved) {
      const parsed = normalizeStoredInput(JSON.parse(saved));

      if (parsed) {
        return { input: parsed, isUserData: true };
      }
    }
  } catch {
    // Ignore storage/parse errors and fall back to defaults.
  }

  return { input: initialInput, isUserData: false };
}

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
  id,
  number,
  title,
  description,
}: {
  id?: string;
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div
      id={id}
      className="scroll-mt-24 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
          {number}
        </div>

        <div>
          <h3 className="text-base font-semibold text-neutral-950">{title}</h3>

          <p className="mt-1 text-xs leading-5 text-neutral-500">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function formatFieldNumber(value: number): string {
  return Number.isInteger(value)
    ? String(value)
    : String(value).replace(".", ",");
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  suffix,
  helperText,
  allowDecimal = false,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  suffix?: string;
  helperText?: string;
  allowDecimal?: boolean;
}) {
  const [draftValue, setDraftValue] = useState(formatFieldNumber(value));
  const [adjustmentNote, setAdjustmentNote] = useState<string | null>(null);
  const [lastSyncedValue, setLastSyncedValue] = useState(value);

  const fieldId = useId();
  const helperId = `${fieldId}-helper`;
  const noteId = `${fieldId}-note`;

  // Sync the external value into the draft (e.g. on reset) without an effect.
  if (value !== lastSyncedValue) {
    setLastSyncedValue(value);
    setDraftValue(formatFieldNumber(value));
  }

  function parseDraft(raw: string): number {
    return Number(raw.replace(",", "."));
  }

  function handleChange(rawValue: string) {
    const sanitized = allowDecimal
      ? rawValue.replace(/[^\d.,]/g, "").replace(/([.,]).*?([.,])/g, "$1")
      : rawValue.replace(/[^\d]/g, "");

    setDraftValue(sanitized);

    if (adjustmentNote) {
      setAdjustmentNote(null);
    }

    if (sanitized === "" || sanitized === "," || sanitized === ".") {
      return;
    }

    const numericValue = parseDraft(sanitized);

    if (!Number.isFinite(numericValue)) {
      return;
    }

    onChange(numericValue);
  }

  function handleBlur() {
    if (draftValue === "" || draftValue === "," || draftValue === ".") {
      const fallbackValue = min ?? 0;
      setDraftValue(formatFieldNumber(fallbackValue));
      onChange(fallbackValue);
      setAdjustmentNote(
        `Câmp gol, am folosit valoarea minimă de ${formatFieldNumber(
          fallbackValue
        )}${suffix ? ` ${suffix}` : ""}.`
      );
      return;
    }

    let numericValue = parseDraft(draftValue);
    let note: string | null = null;

    if (typeof min === "number" && numericValue < min) {
      numericValue = min;
      note = `Valoarea a fost ajustată la minimul de ${formatFieldNumber(min)}${
        suffix ? ` ${suffix}` : ""
      }.`;
    }

    if (typeof max === "number" && numericValue > max) {
      numericValue = max;
      note = `Valoarea a fost ajustată la maximul de ${formatFieldNumber(max)}${
        suffix ? ` ${suffix}` : ""
      }.`;
    }

    setDraftValue(formatFieldNumber(numericValue));
    setAdjustmentNote(note);
    onChange(numericValue);
  }

  const describedBy =
    [helperText ? helperId : null, adjustmentNote ? noteId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-neutral-700">{label}</span>

      <div
        className={
          adjustmentNote
            ? "flex items-center rounded-2xl border border-amber-300 bg-white px-4 shadow-sm transition focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-500/10"
            : "flex items-center rounded-2xl border border-neutral-200 bg-white px-4 shadow-sm transition focus-within:border-blue-600/40 focus-within:ring-4 focus-within:ring-blue-600/10"
        }
      >
        <input
          type="text"
          inputMode={allowDecimal ? "decimal" : "numeric"}
          enterKeyHint="done"
          value={draftValue}
          onChange={(event) => handleChange(event.target.value)}
          onBlur={handleBlur}
          aria-describedby={describedBy}
          className="w-full bg-transparent py-3 text-base text-neutral-950 outline-none"
        />
        {suffix && <span className="text-sm text-neutral-500">{suffix}</span>}
      </div>

      {helperText && (
        <span id={helperId} className="text-xs leading-5 text-neutral-500">
          {helperText}
        </span>
      )}

      {adjustmentNote && (
        <span
          id={noteId}
          role="status"
          aria-live="polite"
          className="text-xs leading-5 text-amber-700"
        >
          {adjustmentNote}
        </span>
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
        className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-base text-neutral-950 shadow-sm outline-none transition focus:border-blue-600/40 focus:ring-4 focus:ring-blue-600/10"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {selectedOption?.description && (
        <span className="text-xs leading-5 text-blue-700">
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
    <div
      role="radiogroup"
      aria-label="Obiectiv principal"
      className="grid gap-3 sm:grid-cols-2"
    >
      {GOAL_OPTIONS.map((option) => {
        const isSelected = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(option.value)}
            className={
              isSelected
                ? "rounded-3xl border border-blue-700/30 bg-blue-50 p-4 text-left shadow-sm"
                : "rounded-3xl border border-neutral-200 bg-white p-4 text-left shadow-sm transition hover:border-blue-700/20 hover:bg-blue-50/40"
            }
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p
                  className={
                    isSelected
                      ? "text-sm font-semibold text-blue-900"
                      : "text-sm font-semibold text-neutral-950"
                  }
                >
                  {option.label}
                </p>

                <p
                  className={
                    isSelected
                      ? "mt-2 text-xs leading-5 text-blue-900/75"
                      : "mt-2 text-xs leading-5 text-neutral-500"
                  }
                >
                  {option.description}
                </p>
              </div>

              <div
                className={
                  isSelected
                    ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white text-blue-700"
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
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
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
                  ? "rounded-2xl border border-blue-700/30 bg-blue-50 p-3 text-left shadow-sm"
                  : "rounded-2xl border border-neutral-200 bg-white p-3 text-left shadow-sm transition hover:border-blue-700/20 hover:bg-blue-50/40"
              }
            >
              <span className="block text-sm font-semibold text-neutral-950">
                {preset.label}
              </span>
              <span className="mt-1 block text-sm font-semibold text-blue-700">
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
  const [initialResolved] = useState(resolveInitialInput);
  const [input, setInput] = useState<CalorieCalculatorInput>(
    initialResolved.input
  );
  const [result, setResult] = useState<CalorieCalculatorResult>(() =>
    calculateCalories(initialResolved.input)
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isExampleResult, setIsExampleResult] = useState(
    !initialResolved.isUserData
  );
  const [isStale, setIsStale] = useState(false);
  const resultSectionRef = useRef<HTMLDivElement | null>(null);

  const hasTraining = input.workoutsPerWeek > 0;

  function updateInput<K extends keyof CalorieCalculatorInput>(
    key: K,
    value: CalorieCalculatorInput[K]
  ) {
    setInput((currentInput) => ({
      ...currentInput,
      [key]: value,
    }));

    setIsStale(true);

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

    setIsStale(true);

    if (errorMessage) {
      setErrorMessage(null);
    }
  }

  function scrollToResults() {
    window.setTimeout(() => {
      resultSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const calculatedResult = calculateCalories(input);
      setResult(calculatedResult);
      setErrorMessage(null);
      setIsExampleResult(false);
      setIsStale(false);

      try {
        window.localStorage.setItem(
          lastInputStorageKey,
          JSON.stringify(input)
        );
      } catch {
        // Ignore storage errors (e.g. private mode); the result still shows.
      }

      scrollToResults();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  }

  function handleReset() {
    setInput(initialInput);
    setResult(calculateCalories(initialInput));
    setErrorMessage(null);
    setIsExampleResult(true);
    setIsStale(false);

    try {
      window.localStorage.removeItem(lastInputStorageKey);
    } catch {
      // Ignore storage errors.
    }

    scrollToResults();
  }

  return (
    <div className="flex flex-col gap-6">
      <form
        id="calculator-form"
        onSubmit={handleSubmit}
        className="scroll-mt-6 rounded-[2rem] border border-neutral-200 bg-white/90 p-5 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur md:scroll-mt-10 md:p-7"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
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

          <div className="w-fit rounded-full border border-blue-700/15 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-800">
            Input personalizat
          </div>
        </div>

        <div className="mt-5 flex gap-1.5" aria-hidden="true">
          <span className="h-1.5 flex-1 rounded-full bg-blue-600" />
          <span className="h-1.5 flex-1 rounded-full bg-blue-600" />
          <span className="h-1.5 flex-1 rounded-full bg-blue-200" />
          <span className="h-1.5 flex-1 rounded-full bg-blue-200" />
        </div>

        <nav
          aria-label="Sectiuni formular"
          className="sticky top-2 z-10 mt-4 -mx-1 flex gap-2 overflow-x-auto rounded-2xl border border-neutral-200 bg-white/90 px-2 py-2 backdrop-blur"
        >
          {[
            { id: "sec-personal", label: "01 Date" },
            { id: "sec-goal", label: "02 Obiectiv" },
            { id: "sec-activity", label: "03 Activitate" },
            { id: "sec-training", label: "04 Antrenamente" },
          ].map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="shrink-0 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-600 transition hover:border-blue-700/25 hover:bg-blue-50/60 hover:text-blue-800"
            >
              {section.label}
            </a>
          ))}
        </nav>

        {errorMessage && (
          <div
            role="alert"
            aria-live="assertive"
            className="mt-5 rounded-3xl border border-amber-200 bg-amber-50 p-4"
          >
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
            id="sec-personal"
            number="01"
            title="Date personale"
            description="Aceste informatii sunt folosite pentru estimarea BMR prin formula Mifflin-St Jeor."
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
              allowDecimal
              onChange={(value) => updateInput("heightCm", value)}
            />

            <NumberField
              label="Greutate"
              value={input.weightKg}
              min={35}
              max={250}
              suffix="kg"
              allowDecimal
              onChange={(value) => updateInput("weightKg", value)}
            />
          </div>

          <SectionHeader
            id="sec-goal"
            number="02"
            title="Obiectiv"
            description="Alege directia principala. Calculatorul va seta deficitul, mentinerea sau surplusul intr-un mod conservator."
          />

          <GoalCardSelector
            value={input.goal}
            onChange={(value) => updateInput("goal", value)}
          />

          <SectionHeader
            id="sec-activity"
            number="03"
            title="Activitate zilnica"
            description="Pasii, jobul si miscarea generala sunt estimate separat pentru un TDEE mai realist."
          />

          <div className="rounded-3xl border border-blue-100 bg-blue-50/70 p-4">
            <p className="text-sm font-semibold text-blue-950">
              De ce 3 intrebari despre activitate?
            </p>
            <p className="mt-2 text-sm leading-6 text-blue-950/75">
              Nivelul de miscare, pasii si tipul de job descriu aceeasi zi din
              unghiuri diferite. Le intrebam separat ca estimarea sa fie mai
              exacta, iar calculatorul ajusteaza automat suprapunerea dintre
              ele. Nu aduna manual aceeasi activitate de doua ori.
            </p>
          </div>

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
            id="sec-training"
            number="04"
            title="Antrenamente"
            description="Antrenamentele sunt calculate separat si apoi transformate in medie zilnica saptamanala."
          />

          <div className="rounded-[2rem] border border-neutral-200 bg-neutral-50/80 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
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

                <div className="rounded-3xl border border-blue-100 bg-blue-50/70 p-4">
                  <p className="text-sm leading-6 text-blue-950/75">
                    Intensitatea este o estimare. Pentru majoritatea oamenilor,
                    „moderata” este alegerea potrivita daca antrenamentul este
                    solicitant, dar sustenabil. Alege „ridicata” doar daca
                    sedintele sunt constant grele si bine sustinute.
                  </p>
                </div>
              </div>
            )}
          </div>

          {isStale && (
            <div
              role="status"
              aria-live="polite"
              className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900"
            >
              Ai modificat datele. Apasa „Calculeaza rezultatul” ca rezultatele
              sa reflecte valorile noi.
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <button
              type="submit"
              className={
                isStale
                  ? "rounded-2xl bg-blue-700 px-5 py-4 text-base font-semibold text-white shadow-lg shadow-blue-900/20 ring-2 ring-blue-600/30 transition hover:bg-blue-600"
                  : "rounded-2xl bg-blue-700 px-5 py-4 text-base font-semibold text-white shadow-lg shadow-blue-900/10 transition hover:bg-blue-600"
              }
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

      <div ref={resultSectionRef} className="scroll-mt-6 md:scroll-mt-10">
        <CalculatorResults
          result={result}
          isExampleResult={isExampleResult}
          isStale={isStale}
        />
      </div>
    </div>
  );
}