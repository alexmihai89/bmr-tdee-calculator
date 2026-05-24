// lib/activityEngine.ts

import type {
  CalorieCalculatorInput,
  DailyActivityLevel,
  DailyActivityResult,
  JobType,
} from "./types";

type ActivityInput = Pick<
  CalorieCalculatorInput,
  "weightKg" | "dailyActivityLevel" | "averageStepsPerDay" | "jobType"
>;

const ACTIVITY_LEVEL_CALORIES_PER_KG: Record<DailyActivityLevel, number> = {
  very_low: 1.5,
  low: 2.5,
  moderate: 3.5,
  active: 4.8,
  very_active: 6,
};

const JOB_CALORIES_PER_KG: Record<JobType, number> = {
  desk: 0,
  mixed: 1.2,
  standing: 2.2,
  physical: 4,
};

function roundCalories(value: number): number {
  return Math.round(value);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function isValidNumber(value: number): boolean {
  return Number.isFinite(value);
}

export function validateActivityInput(input: ActivityInput): void {
  if (!isValidNumber(input.weightKg) || input.weightKg <= 0) {
    throw new Error("Greutatea trebuie sa fie un numar pozitiv.");
  }

  if (!isValidNumber(input.averageStepsPerDay) || input.averageStepsPerDay < 0) {
    throw new Error("Numarul de pasi trebuie sa fie zero sau un numar pozitiv.");
  }

  if (input.averageStepsPerDay > 40000) {
    throw new Error(
      "Numarul de pasi introdus pare foarte mare pentru o medie zilnica."
    );
  }

  if (!(input.dailyActivityLevel in ACTIVITY_LEVEL_CALORIES_PER_KG)) {
    throw new Error("Nivelul de activitate zilnica nu este valid.");
  }

  if (!(input.jobType in JOB_CALORIES_PER_KG)) {
    throw new Error("Tipul de job nu este valid.");
  }
}

/**
 * Pasii sunt considerati totalul pasilor din zi:
 * job + deplasari + plimbari + activitate generala.
 *
 * Formula este conservatoare, pentru a reduce riscul
 * de supraestimare a TDEE-ului.
 */
export function calculateStepsCalories(params: {
  weightKg: number;
  averageStepsPerDay: number;
}): number {
  const safeSteps = clamp(params.averageStepsPerDay, 0, 40000);

  const caloriesPerStep = params.weightKg * 0.00045;

  return roundCalories(safeSteps * caloriesPerStep);
}

/**
 * Ajusteaza caloriile din job in functie de pasi.
 *
 * Daca utilizatorul introduce multi pasi, o parte din activitatea jobului
 * este deja inclusa in acei pasi.
 */
export function getJobStepOverlapFactor(averageStepsPerDay: number): number {
  if (averageStepsPerDay < 5000) {
    return 1;
  }

  if (averageStepsPerDay < 8000) {
    return 0.8;
  }

  if (averageStepsPerDay < 12000) {
    return 0.6;
  }

  if (averageStepsPerDay < 15000) {
    return 0.4;
  }

  return 0.25;
}

/**
 * Ajusteaza nivelul de activitate zilnica in functie de pasi si job.
 *
 * Motiv:
 * "Nivel activitate zilnica" poate descrie aceeasi realitate ca pasii si jobul.
 * De exemplu: 15.000 pasi + job standing + foarte activ.
 *
 * Fara ajustare, calculatorul poate supraestima consumul zilnic.
 */
export function getActivityOverlapFactor(params: {
  averageStepsPerDay: number;
  jobType: JobType;
  dailyActivityLevel: DailyActivityLevel;
}): number {
  const { averageStepsPerDay, jobType, dailyActivityLevel } = params;

  const hasActiveJob = jobType === "standing" || jobType === "physical";
  const hasModerateJob = jobType === "mixed";

  if (dailyActivityLevel === "very_low") {
    return 1;
  }

  if (averageStepsPerDay < 5000) {
    return 1;
  }

  if (averageStepsPerDay < 8000) {
    if (hasActiveJob) return 0.75;
    if (hasModerateJob) return 0.85;
    return 0.95;
  }

  if (averageStepsPerDay < 12000) {
    if (hasActiveJob) return 0.6;
    if (hasModerateJob) return 0.75;
    return 0.85;
  }

  if (averageStepsPerDay < 15000) {
    if (hasActiveJob) return 0.45;
    if (hasModerateJob) return 0.6;
    return 0.75;
  }

  if (hasActiveJob) return 0.35;
  if (hasModerateJob) return 0.5;
  return 0.65;
}

export function calculateActivityLevelCalories(params: {
  weightKg: number;
  dailyActivityLevel: DailyActivityLevel;
  averageStepsPerDay: number;
  jobType: JobType;
}): number {
  const baseCaloriesPerKg =
    ACTIVITY_LEVEL_CALORIES_PER_KG[params.dailyActivityLevel];

  const baseActivityCalories = params.weightKg * baseCaloriesPerKg;

  const overlapFactor = getActivityOverlapFactor({
    averageStepsPerDay: params.averageStepsPerDay,
    jobType: params.jobType,
    dailyActivityLevel: params.dailyActivityLevel,
  });

  return roundCalories(baseActivityCalories * overlapFactor);
}

export function calculateJobCalories(params: {
  weightKg: number;
  jobType: JobType;
  averageStepsPerDay: number;
}): number {
  const baseCaloriesPerKg = JOB_CALORIES_PER_KG[params.jobType];

  const baseJobCalories = params.weightKg * baseCaloriesPerKg;

  const overlapFactor = getJobStepOverlapFactor(params.averageStepsPerDay);

  return roundCalories(baseJobCalories * overlapFactor);
}

export function calculateDailyActivity(
  input: ActivityInput
): DailyActivityResult {
  validateActivityInput(input);

  const stepsCalories = calculateStepsCalories({
    weightKg: input.weightKg,
    averageStepsPerDay: input.averageStepsPerDay,
  });

  const activityLevelCalories = calculateActivityLevelCalories({
    weightKg: input.weightKg,
    dailyActivityLevel: input.dailyActivityLevel,
    averageStepsPerDay: input.averageStepsPerDay,
    jobType: input.jobType,
  });

  const jobCalories = calculateJobCalories({
    weightKg: input.weightKg,
    jobType: input.jobType,
    averageStepsPerDay: input.averageStepsPerDay,
  });

  const dailyActivityCalories = roundCalories(
    stepsCalories + activityLevelCalories + jobCalories
  );

  return {
    dailyActivityCalories,
    stepsCalories,
    jobCalories,
    activityLevelCalories,
  };
}