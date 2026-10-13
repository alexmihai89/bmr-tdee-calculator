// lib/inputSerialization.ts

import {
  DAILY_ACTIVITY_OPTIONS,
  GOAL_OPTIONS,
  JOB_TYPE_OPTIONS,
  TRAINING_INTENSITY_OPTIONS,
  TRAINING_TYPE_OPTIONS,
} from "./types";
import type {
  CalorieCalculatorInput,
  DailyActivityLevel,
  Goal,
  JobType,
  Sex,
  TrainingIntensity,
  TrainingType,
} from "./types";

export const DEFAULT_INPUT: CalorieCalculatorInput = {
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

const GOAL_VALUES = GOAL_OPTIONS.map((option) => option.value);
const ACTIVITY_VALUES = DAILY_ACTIVITY_OPTIONS.map((option) => option.value);
const JOB_VALUES = JOB_TYPE_OPTIONS.map((option) => option.value);
const TRAINING_TYPE_VALUES = TRAINING_TYPE_OPTIONS.map(
  (option) => option.value
);
const TRAINING_INTENSITY_VALUES = TRAINING_INTENSITY_OPTIONS.map(
  (option) => option.value
);

function clampNumber(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function parseClampedNumber(
  raw: string | null,
  min: number,
  max: number
): number | null {
  if (raw === null || raw.trim() === "") {
    return null;
  }

  const parsed = Number(raw.replace(",", "."));

  if (!Number.isFinite(parsed)) {
    return null;
  }

  return clampNumber(parsed, min, max);
}

function parseEnum<T extends string>(
  raw: string | null,
  allowed: T[]
): T | null {
  if (raw !== null && (allowed as string[]).includes(raw)) {
    return raw as T;
  }

  return null;
}

/**
 * Builds a query string (without the leading "?") that captures the input,
 * so a result can be bookmarked or shared. Only calculator fields are
 * encoded, never any identifying data.
 */
export function serializeInputToQuery(input: CalorieCalculatorInput): string {
  const params = new URLSearchParams({
    sex: input.sex,
    age: String(input.age),
    height: String(input.heightCm),
    weight: String(input.weightKg),
    goal: input.goal,
    activity: input.dailyActivityLevel,
    steps: String(input.averageStepsPerDay),
    job: input.jobType,
    workouts: String(input.workoutsPerWeek),
    duration: String(input.averageWorkoutDurationMinutes),
    trainingType: input.trainingType,
    intensity: input.trainingIntensity,
  });

  return params.toString();
}

/**
 * Parses an input from a query string. Returns a complete, range-checked
 * input only when at least one known field is present and valid; otherwise
 * null. Missing fields fall back to DEFAULT_INPUT.
 */
export function parseInputFromQuery(
  search: string
): CalorieCalculatorInput | null {
  const params = new URLSearchParams(search);

  const knownKeys = [
    "sex",
    "age",
    "height",
    "weight",
    "goal",
    "activity",
    "steps",
    "job",
    "workouts",
    "duration",
    "trainingType",
    "intensity",
  ];

  const hasAnyKnownKey = knownKeys.some((key) => params.has(key));

  if (!hasAnyKnownKey) {
    return null;
  }

  const sex = parseEnum<Sex>(params.get("sex"), ["male", "female"]);
  const goal = parseEnum<Goal>(params.get("goal"), GOAL_VALUES);
  const activity = parseEnum<DailyActivityLevel>(
    params.get("activity"),
    ACTIVITY_VALUES
  );
  const job = parseEnum<JobType>(params.get("job"), JOB_VALUES);
  const trainingType = parseEnum<TrainingType>(
    params.get("trainingType"),
    TRAINING_TYPE_VALUES
  );
  const intensity = parseEnum<TrainingIntensity>(
    params.get("intensity"),
    TRAINING_INTENSITY_VALUES
  );

  const age = parseClampedNumber(params.get("age"), 14, 90);
  const heightCm = parseClampedNumber(params.get("height"), 120, 230);
  const weightKg = parseClampedNumber(params.get("weight"), 35, 250);
  const steps = parseClampedNumber(params.get("steps"), 0, 40000);
  const workouts = parseClampedNumber(params.get("workouts"), 0, 14);
  const duration = parseClampedNumber(params.get("duration"), 0, 240);

  return {
    sex: sex ?? DEFAULT_INPUT.sex,
    age: age ?? DEFAULT_INPUT.age,
    heightCm: heightCm ?? DEFAULT_INPUT.heightCm,
    weightKg: weightKg ?? DEFAULT_INPUT.weightKg,
    goal: goal ?? DEFAULT_INPUT.goal,
    dailyActivityLevel: activity ?? DEFAULT_INPUT.dailyActivityLevel,
    averageStepsPerDay: steps ?? DEFAULT_INPUT.averageStepsPerDay,
    jobType: job ?? DEFAULT_INPUT.jobType,
    workoutsPerWeek: workouts ?? DEFAULT_INPUT.workoutsPerWeek,
    averageWorkoutDurationMinutes:
      duration ?? DEFAULT_INPUT.averageWorkoutDurationMinutes,
    trainingType: trainingType ?? DEFAULT_INPUT.trainingType,
    trainingIntensity: intensity ?? DEFAULT_INPUT.trainingIntensity,
  };
}

/**
 * Validates and normalizes a parsed object (e.g. from localStorage) into a
 * complete input, re-using the same field rules as the query parser.
 */
export function normalizeStoredInput(value: unknown): CalorieCalculatorInput | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const record = value as Record<string, unknown>;

  const asString = (key: string): string | null =>
    typeof record[key] === "string" ? (record[key] as string) : null;
  const asNumberString = (key: string): string | null =>
    typeof record[key] === "number" ? String(record[key]) : null;

  const sex = parseEnum<Sex>(asString("sex"), ["male", "female"]);
  const goal = parseEnum<Goal>(asString("goal"), GOAL_VALUES);
  const activity = parseEnum<DailyActivityLevel>(
    asString("dailyActivityLevel"),
    ACTIVITY_VALUES
  );
  const job = parseEnum<JobType>(asString("jobType"), JOB_VALUES);
  const trainingType = parseEnum<TrainingType>(
    asString("trainingType"),
    TRAINING_TYPE_VALUES
  );
  const intensity = parseEnum<TrainingIntensity>(
    asString("trainingIntensity"),
    TRAINING_INTENSITY_VALUES
  );

  const age = parseClampedNumber(asNumberString("age"), 14, 90);
  const heightCm = parseClampedNumber(asNumberString("heightCm"), 120, 230);
  const weightKg = parseClampedNumber(asNumberString("weightKg"), 35, 250);
  const steps = parseClampedNumber(
    asNumberString("averageStepsPerDay"),
    0,
    40000
  );
  const workouts = parseClampedNumber(asNumberString("workoutsPerWeek"), 0, 14);
  const duration = parseClampedNumber(
    asNumberString("averageWorkoutDurationMinutes"),
    0,
    240
  );

  return {
    sex: sex ?? DEFAULT_INPUT.sex,
    age: age ?? DEFAULT_INPUT.age,
    heightCm: heightCm ?? DEFAULT_INPUT.heightCm,
    weightKg: weightKg ?? DEFAULT_INPUT.weightKg,
    goal: goal ?? DEFAULT_INPUT.goal,
    dailyActivityLevel: activity ?? DEFAULT_INPUT.dailyActivityLevel,
    averageStepsPerDay: steps ?? DEFAULT_INPUT.averageStepsPerDay,
    jobType: job ?? DEFAULT_INPUT.jobType,
    workoutsPerWeek: workouts ?? DEFAULT_INPUT.workoutsPerWeek,
    averageWorkoutDurationMinutes:
      duration ?? DEFAULT_INPUT.averageWorkoutDurationMinutes,
    trainingType: trainingType ?? DEFAULT_INPUT.trainingType,
    trainingIntensity: intensity ?? DEFAULT_INPUT.trainingIntensity,
  };
}
