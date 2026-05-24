// lib/trainingEngine.ts

import type {
  CalorieCalculatorInput,
  TrainingIntensity,
  TrainingResult,
  TrainingType,
} from "./types";

type TrainingInput = Pick<
  CalorieCalculatorInput,
  | "weightKg"
  | "workoutsPerWeek"
  | "averageWorkoutDurationMinutes"
  | "trainingType"
  | "trainingIntensity"
>;

const TRAINING_BASE_KCAL_PER_KG_PER_HOUR: Record<TrainingType, number> = {
  strength: 4.5,
  cardio: 6.5,
  mixed: 5.5,
  group_fitness: 6,
};

const TRAINING_INTENSITY_MULTIPLIER: Record<TrainingIntensity, number> = {
  light: 0.8,
  moderate: 1,
  high: 1.2,
};

function roundCalories(value: number): number {
  return Math.round(value);
}

function isValidNumber(value: number): boolean {
  return Number.isFinite(value);
}

export function validateTrainingInput(input: TrainingInput): void {
  if (!isValidNumber(input.weightKg) || input.weightKg <= 0) {
    throw new Error("Greutatea trebuie sa fie un numar pozitiv.");
  }

  if (!isValidNumber(input.workoutsPerWeek) || input.workoutsPerWeek < 0) {
    throw new Error("Numarul de antrenamente pe saptamana trebuie sa fie zero sau pozitiv.");
  }

  if (input.workoutsPerWeek > 14) {
    throw new Error("Numarul de antrenamente pe saptamana pare prea mare.");
  }

  if (
    !isValidNumber(input.averageWorkoutDurationMinutes) ||
    input.averageWorkoutDurationMinutes < 0
  ) {
    throw new Error("Durata antrenamentului trebuie sa fie zero sau un numar pozitiv.");
  }

  if (input.averageWorkoutDurationMinutes > 240) {
    throw new Error("Durata medie a antrenamentului pare prea mare.");
  }

  if (!(input.trainingType in TRAINING_BASE_KCAL_PER_KG_PER_HOUR)) {
    throw new Error("Tipul de antrenament nu este valid.");
  }

  if (!(input.trainingIntensity in TRAINING_INTENSITY_MULTIPLIER)) {
    throw new Error("Intensitatea antrenamentului nu este valida.");
  }
}

export function calculateAverageWorkoutCalories(params: {
  weightKg: number;
  averageWorkoutDurationMinutes: number;
  trainingType: TrainingType;
  trainingIntensity: TrainingIntensity;
}): number {
  const durationHours = params.averageWorkoutDurationMinutes / 60;

  const baseCaloriesPerKgPerHour =
    TRAINING_BASE_KCAL_PER_KG_PER_HOUR[params.trainingType];

  const intensityMultiplier =
    TRAINING_INTENSITY_MULTIPLIER[params.trainingIntensity];

  return roundCalories(
    params.weightKg *
      durationHours *
      baseCaloriesPerKgPerHour *
      intensityMultiplier
  );
}

export function calculateTrainingCalories(input: TrainingInput): TrainingResult {
  validateTrainingInput(input);

  if (
    input.workoutsPerWeek === 0 ||
    input.averageWorkoutDurationMinutes === 0
  ) {
    return {
      averageWorkoutCalories: 0,
      weeklyTrainingCalories: 0,
      dailyAverageTrainingCalories: 0,
    };
  }

  const averageWorkoutCalories = calculateAverageWorkoutCalories({
    weightKg: input.weightKg,
    averageWorkoutDurationMinutes: input.averageWorkoutDurationMinutes,
    trainingType: input.trainingType,
    trainingIntensity: input.trainingIntensity,
  });

  const weeklyTrainingCalories = roundCalories(
    averageWorkoutCalories * input.workoutsPerWeek
  );

  const dailyAverageTrainingCalories = roundCalories(weeklyTrainingCalories / 7);

  return {
    averageWorkoutCalories,
    weeklyTrainingCalories,
    dailyAverageTrainingCalories,
  };
}