// lib/calorieCalculator.ts

import type {
  CalculatorWarning,
  CalorieCalculatorInput,
  CalorieCalculatorResult,
  HydrationResult,
  MacroResult,
} from "./types";

import { calculateTdee } from "./tdeeEngine";
import { calculateGoalTarget } from "./goalEngine";
import { buildExplanation } from "./explanationEngine";
import { calculateMacros } from "./macroEngine";

function roundToNearestHundred(value: number): number {
  return Math.round(value / 100) * 100;
}

// Peste acest prag, TDEE-ul estimat este neobisnuit de mare pentru populatia
// generala si cel mai probabil vine din date extreme sau gresit introduse.
const IMPLAUSIBLE_TDEE_THRESHOLD = 6000;

/**
 * Atentionari derivate din rezultatul final (nu modifica niciun calcul):
 * semnaleaza doar situatii in care cifrele devin greu de interpretat corect.
 */
function buildResultWarnings(params: {
  macros: MacroResult;
  targetCalories: number;
  estimatedTdee: number;
}): CalculatorWarning[] {
  const warnings: CalculatorWarning[] = [];

  const proteinAndFatCalories =
    params.macros.proteinCalories + params.macros.fatCalories;

  if (
    params.macros.carbohydrateGrams <= 0 ||
    proteinAndFatCalories > params.targetCalories
  ) {
    warnings.push({
      level: "caution",
      title: "Macro-urile nu se incadreaza exact in target",
      message:
        "La acest target caloric, proteinele si grasimile recomandate acopera deja aproape tot necesarul, iar carbohidratii raman foarte putini sau zero. Trateaza macro-urile ca reper, prioritizeaza proteina si, daca tinta ti se pare prea joasa, cere ghidaj specializat.",
    });
  }

  if (params.estimatedTdee > IMPLAUSIBLE_TDEE_THRESHOLD) {
    warnings.push({
      level: "info",
      title: "Valori neobisnuit de mari",
      message:
        "Estimarile par neobisnuit de mari pentru o zi obisnuita. Verifica datele introduse, mai ales greutatea, pasii si numarul sau durata antrenamentelor, fiindca valori extreme combinate pot umfla estimarea.",
    });
  }

  return warnings;
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

  const warnings: CalculatorWarning[] = [
    ...goalResult.warnings,
    ...buildResultWarnings({
      macros,
      targetCalories: goalResult.targetCalories,
      estimatedTdee: tdeeResult.estimatedTdee,
    }),
  ];

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
    weeklyTrainingCalories: tdeeResult.weeklyTrainingCalories,

    targetCalories: goalResult.targetCalories,

    realisticCalorieRange: goalResult.realisticCalorieRange,

    calorieDifferenceFromTdee: goalResult.calorieDifferenceFromTdee,
    calorieDifferencePercent: goalResult.calorieDifferencePercent,

    estimatedMonthlyWeightChangeKg: goalResult.estimatedMonthlyWeightChangeKg,

    macros,

    hydration,

    explanation,

    warnings,
  };
}