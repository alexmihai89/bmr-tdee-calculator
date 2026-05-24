// lib/goalEngine.ts

import type { Goal, GoalResult, CalculatorWarning } from "./types";

type GoalInput = {
  goal: Goal;
  estimatedTdee: number;
  bmr: number;
};

const KG_FAT_ENERGY_ESTIMATE = 7700;

function roundCalories(value: number): number {
  return Math.round(value);
}

function roundToOneDecimal(value: number): number {
  return Math.round(value * 10) / 10;
}

function isValidPositiveNumber(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

function calculateMonthlyWeightChangeKg(params: {
  dailyCalorieDifference: number;
}): number {
  const monthlyCalorieDifference = params.dailyCalorieDifference * 30;

  return roundToOneDecimal(monthlyCalorieDifference / KG_FAT_ENERGY_ESTIMATE);
}

function buildWarnings(params: {
  goal: Goal;
  calorieDifferencePercent: number;
  targetCalories: number;
  bmr: number;
}): CalculatorWarning[] {
  const warnings: CalculatorWarning[] = [];
  const deficitPercent = Math.abs(params.calorieDifferencePercent);

  if (params.targetCalories < params.bmr) {
    warnings.push({
      level: "important",
      title: "Tinta calorica este sub BMR",
      message:
        "Targetul calculat este sub metabolismul bazal estimat. Pentru publicul general, aceasta abordare poate fi greu de sustinut si nu este prima optiune recomandata. Alege slabire usoara sau creste usor caloriile, mai ales daca apar oboseala mare, foame excesiva, scaderea performantei sau aderenta slaba.",
    });
  }

  if (
    (params.goal === "light_fat_loss" ||
      params.goal === "moderate_fat_loss") &&
    deficitPercent > 25
  ) {
    warnings.push({
      level: "important",
      title: "Deficit caloric prea agresiv",
      message:
        "Tinta calculata pare sa creeze un deficit mai mare de 25%. Pentru majoritatea oamenilor, o abordare mai moderata este mai usor de mentinut si mai sigura pe termen lung.",
    });
  }

  if (
    (params.goal === "light_fat_loss" ||
      params.goal === "moderate_fat_loss") &&
    params.targetCalories < 1400
  ) {
    warnings.push({
      level: "caution",
      title: "Tinta calorica joasa",
      message:
        "Tinta calorica este destul de joasa. Daca exista istoric medical, tratamente, diabet, tulburari alimentare sau simptome neplacute, este recomandat consult cu medic sau nutritionist.",
    });
  }

  if (
    params.goal === "controlled_muscle_gain" &&
    params.calorieDifferencePercent > 10
  ) {
    warnings.push({
      level: "caution",
      title: "Surplus posibil prea mare",
      message:
        "Pentru masa musculara controlata, un surplus mic este de obicei mai potrivit decat o crestere agresiva a caloriilor.",
    });
  }

  return warnings;
}

export function validateGoalInput(input: GoalInput): void {
  if (!isValidPositiveNumber(input.estimatedTdee)) {
    throw new Error("TDEE trebuie sa fie un numar pozitiv.");
  }

  if (!isValidPositiveNumber(input.bmr)) {
    throw new Error("BMR trebuie sa fie un numar pozitiv.");
  }

  if (
    input.goal !== "light_fat_loss" &&
    input.goal !== "moderate_fat_loss" &&
    input.goal !== "maintenance" &&
    input.goal !== "controlled_muscle_gain"
  ) {
    throw new Error("Obiectivul introdus nu este valid.");
  }
}

export function calculateGoalTarget(input: GoalInput): GoalResult {
  validateGoalInput(input);

  let calorieAdjustmentPercent = 0;

  if (input.goal === "light_fat_loss") {
    calorieAdjustmentPercent = -10;
  }

  if (input.goal === "moderate_fat_loss") {
    calorieAdjustmentPercent = -18;
  }

  if (input.goal === "maintenance") {
    calorieAdjustmentPercent = 0;
  }

  if (input.goal === "controlled_muscle_gain") {
    calorieAdjustmentPercent = 7;
  }

  const targetCalories = roundCalories(
    input.estimatedTdee * (1 + calorieAdjustmentPercent / 100)
  );

  const calorieDifferenceFromTdee = roundCalories(
    targetCalories - input.estimatedTdee
  );

  const calorieDifferencePercent = roundCalories(
    (calorieDifferenceFromTdee / input.estimatedTdee) * 100
  );

  let realisticCalorieRange = {
    min: roundCalories(targetCalories * 0.95),
    max: roundCalories(targetCalories * 1.05),
  };

  if (input.goal === "maintenance") {
    realisticCalorieRange = {
      min: roundCalories(input.estimatedTdee * 0.95),
      max: roundCalories(input.estimatedTdee * 1.05),
    };
  }

  if (input.goal === "controlled_muscle_gain") {
    realisticCalorieRange = {
      min: roundCalories(input.estimatedTdee * 1.05),
      max: roundCalories(input.estimatedTdee * 1.1),
    };
  }

  if (input.goal === "light_fat_loss") {
    realisticCalorieRange = {
      min: roundCalories(input.estimatedTdee * 0.88),
      max: roundCalories(input.estimatedTdee * 0.93),
    };
  }

  if (input.goal === "moderate_fat_loss") {
    realisticCalorieRange = {
      min: roundCalories(input.estimatedTdee * 0.8),
      max: roundCalories(input.estimatedTdee * 0.85),
    };
  }

  const estimatedMonthlyWeightChangeKg = calculateMonthlyWeightChangeKg({
    dailyCalorieDifference: calorieDifferenceFromTdee,
  });

  const warnings = buildWarnings({
    goal: input.goal,
    calorieDifferencePercent,
    targetCalories,
    bmr: input.bmr,
  });

  return {
    targetCalories,
    realisticCalorieRange,
    calorieDifferenceFromTdee,
    calorieDifferencePercent,
    estimatedMonthlyWeightChangeKg,
    warning: warnings[0],
  };
}