// lib/calorieCalculator.ts

import type {
  CalculatorWarning,
  CalorieCalculatorInput,
  CalorieCalculatorResult,
} from "./types";

import { calculateTdee } from "./tdeeEngine";
import { calculateGoalTarget } from "./goalEngine";
import { buildExplanation } from "./explanationEngine";
import { calculateMacros } from "./macroEngine";

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

    explanation,

    warnings,
  };
}