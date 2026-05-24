// lib/tdeeEngine.ts

import type { CalorieCalculatorInput, TdeeResult } from "./types";
import { calculateBmr } from "./bmrEngine";
import { calculateDailyActivity } from "./activityEngine";
import { calculateTrainingCalories } from "./trainingEngine";

function roundCalories(value: number): number {
  return Math.round(value);
}

export function calculateTdee(input: CalorieCalculatorInput): TdeeResult {
  const bmrResult = calculateBmr({
    sex: input.sex,
    age: input.age,
    heightCm: input.heightCm,
    weightKg: input.weightKg,
  });

  const activityResult = calculateDailyActivity({
    weightKg: input.weightKg,
    dailyActivityLevel: input.dailyActivityLevel,
    averageStepsPerDay: input.averageStepsPerDay,
    jobType: input.jobType,
  });

  const trainingResult = calculateTrainingCalories({
    weightKg: input.weightKg,
    workoutsPerWeek: input.workoutsPerWeek,
    averageWorkoutDurationMinutes: input.averageWorkoutDurationMinutes,
    trainingType: input.trainingType,
    trainingIntensity: input.trainingIntensity,
  });

  const estimatedTdee = roundCalories(
    bmrResult.bmr +
      activityResult.dailyActivityCalories +
      trainingResult.dailyAverageTrainingCalories
  );

  return {
    bmr: bmrResult.bmr,

    dailyActivityCalories: activityResult.dailyActivityCalories,
    stepsCalories: activityResult.stepsCalories,
    jobCalories: activityResult.jobCalories,
    activityLevelCalories: activityResult.activityLevelCalories,

    trainingCalories: trainingResult.dailyAverageTrainingCalories,
    averageWorkoutCalories: trainingResult.averageWorkoutCalories,

    estimatedTdee,
  };
}