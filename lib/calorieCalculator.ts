// lib/calorieCalculator.ts

import type {
  CalculatorWarning,
  CalorieCalculatorInput,
  CalorieCalculatorResult,
  HydrationResult,
} from "./types";

import { calculateTdee } from "./tdeeEngine";
import { calculateGoalTarget } from "./goalEngine";
import { buildExplanation } from "./explanationEngine";
import { calculateMacros } from "./macroEngine";

function roundToNearestHundred(value: number): number {
  return Math.round(value / 100) * 100;
}

function calculateHydration(input: CalorieCalculatorInput): HydrationResult {
  const minMl = roundToNearestHundred(input.weightKg * 30);
  const maxMl = roundToNearestHundred(input.weightKg * 40);

  return {
    dailyWaterMlRange: {
      min: minMl,
      max: maxMl,
    },
    dailyWaterLitersRange: {
      min: minMl / 1000,
      max: maxMl / 1000,
    },
    explanation:
      "Hidratarea recomandata este estimata simplu, pornind de la aproximativ 30-40 ml / kg corp / zi. Este un reper general, nu o regula fixa.",
    adjustmentNote:
      "In zilele cu antrenamente, caldura, transpiratie ridicata sau aport mare de proteine si fibre, poate fi nevoie de putin mai multa apa si de o distributie mai buna pe parcursul zilei.",
  };
}

export function calculateCalories(
  input: CalorieCalculatorInput
): CalorieCalculatorResult {
  const tdeeResult = calculateTdee(input);

  const goalResult = calculateGoalTarget({
    goal: input.goal,
    estimatedTdee: tdeeResult.estimatedTdee,
    bmr: tdeeResult.bmr,
  });

  const macros = calculateMacros({
    weightKg: input.weightKg,
    targetCalories: goalResult.targetCalories,
    goal: input.goal,
    workoutsPerWeek: input.workoutsPerWeek,
  });

  const hydration = calculateHydration(input);

  const explanation = buildExplanation({
    input,
    estimatedTdee: tdeeResult.estimatedTdee,
    targetCalories: goalResult.targetCalories,
    estimatedMonthlyWeightChangeKg: goalResult.estimatedMonthlyWeightChangeKg,
  });

  const warnings: CalculatorWarning[] = [];

  if (goalResult.warning) {
    warnings.push(goalResult.warning);
  }

  return {
    input,

    bmr: tdeeResult.bmr,
    estimatedTdee: tdeeResult.estimatedTdee,

    dailyActivityCalories: tdeeResult.dailyActivityCalories,
    stepsCalories: tdeeResult.stepsCalories,
    jobCalories: tdeeResult.jobCalories,
    activityLevelCalories: tdeeResult.activityLevelCalories,

    trainingCalories: tdeeResult.trainingCalories,
    averageWorkoutCalories: tdeeResult.averageWorkoutCalories,

    targetCalories: goalResult.targetCalories,

    realisticCalorieRange: goalResult.realisticCalorieRange,

    estimatedMonthlyWeightChangeKg: goalResult.estimatedMonthlyWeightChangeKg,

    macros,

    hydration,

    explanation,

    warnings,
  };
}