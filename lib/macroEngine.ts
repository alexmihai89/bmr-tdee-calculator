// lib/macroEngine.ts

import type { Goal, MacroResult, MacroRange } from "./types";

type MacroInput = {
  weightKg: number;
  targetCalories: number;
  goal: Goal;
  workoutsPerWeek: number;
};

type MacroConfig = {
  proteinMinPerKg: number;
  proteinMaxPerKg: number;
  fatMinPerKg: number;
  fatMaxPerKg: number;
};

const CALORIES_PER_GRAM_PROTEIN = 4;
const CALORIES_PER_GRAM_CARBOHYDRATE = 4;
const CALORIES_PER_GRAM_FAT = 9;

function round(value: number): number {
  return Math.round(value);
}

function isValidPositiveNumber(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

function buildRange(min: number, max: number): MacroRange {
  return {
    min: round(min),
    max: round(max),
  };
}

function getMacroConfig(goal: Goal, workoutsPerWeek: number): MacroConfig {
  const trainsRegularly = workoutsPerWeek >= 3;

  if (goal === "moderate_fat_loss") {
    return {
      proteinMinPerKg: trainsRegularly ? 1.8 : 1.6,
      proteinMaxPerKg: trainsRegularly ? 2.2 : 2,
      fatMinPerKg: 0.7,
      fatMaxPerKg: 0.9,
    };
  }

  if (goal === "light_fat_loss") {
    return {
      proteinMinPerKg: trainsRegularly ? 1.7 : 1.5,
      proteinMaxPerKg: trainsRegularly ? 2.1 : 1.9,
      fatMinPerKg: 0.7,
      fatMaxPerKg: 1,
    };
  }

  if (goal === "controlled_muscle_gain") {
    return {
      proteinMinPerKg: trainsRegularly ? 1.7 : 1.5,
      proteinMaxPerKg: trainsRegularly ? 2.2 : 2,
      fatMinPerKg: 0.8,
      fatMaxPerKg: 1,
    };
  }

  return {
    proteinMinPerKg: trainsRegularly ? 1.5 : 1.3,
    proteinMaxPerKg: trainsRegularly ? 1.9 : 1.7,
    fatMinPerKg: 0.7,
    fatMaxPerKg: 1,
  };
}

function validateMacroInput(input: MacroInput): void {
  if (!isValidPositiveNumber(input.weightKg)) {
    throw new Error("Greutatea trebuie sa fie un numar pozitiv.");
  }

  if (!isValidPositiveNumber(input.targetCalories)) {
    throw new Error("Targetul caloric trebuie sa fie un numar pozitiv.");
  }

  if (!Number.isFinite(input.workoutsPerWeek) || input.workoutsPerWeek < 0) {
    throw new Error("Numarul de antrenamente trebuie sa fie zero sau pozitiv.");
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

function buildMacroExplanation(goal: Goal): string {
  if (goal === "light_fat_loss" || goal === "moderate_fat_loss") {
    return "Proteina este setata putin mai sus pentru satietate si mentinerea masei musculare. Grasimile sunt pastrate intr-un interval realist, iar carbohidratii completeaza energia ramasa.";
  }

  if (goal === "controlled_muscle_gain") {
    return "Proteina sustine dezvoltarea si mentinerea masei musculare, grasimile raman intr-un interval echilibrat, iar carbohidratii sustin energia pentru antrenamente.";
  }

  return "Macro-urile sunt estimate pentru un aport echilibrat. Proteina sustine masa musculara si satietatea, grasimile sustin functiile generale, iar carbohidratii completeaza energia zilnica.";
}

export function calculateMacros(input: MacroInput): MacroResult {
  validateMacroInput(input);

  const config = getMacroConfig(input.goal, input.workoutsPerWeek);

  const proteinRangeGrams = buildRange(
    input.weightKg * config.proteinMinPerKg,
    input.weightKg * config.proteinMaxPerKg
  );

  const fatRangeGrams = buildRange(
    input.weightKg * config.fatMinPerKg,
    input.weightKg * config.fatMaxPerKg
  );

  const proteinGrams = round(
    (proteinRangeGrams.min + proteinRangeGrams.max) / 2
  );

  const fatGrams = round((fatRangeGrams.min + fatRangeGrams.max) / 2);

  const proteinCalories = round(proteinGrams * CALORIES_PER_GRAM_PROTEIN);
  const fatCalories = round(fatGrams * CALORIES_PER_GRAM_FAT);

  const remainingCalories = input.targetCalories - proteinCalories - fatCalories;

  const carbohydrateGrams = Math.max(
    0,
    round(remainingCalories / CALORIES_PER_GRAM_CARBOHYDRATE)
  );

  const carbohydrateCalories = round(
    carbohydrateGrams * CALORIES_PER_GRAM_CARBOHYDRATE
  );

  const carbohydrateRangeGrams = buildRange(
    carbohydrateGrams * 0.9,
    carbohydrateGrams * 1.1
  );

  return {
    proteinGrams,
    fatGrams,
    carbohydrateGrams,

    proteinRangeGrams,
    fatRangeGrams,
    carbohydrateRangeGrams,

    proteinCalories,
    fatCalories,
    carbohydrateCalories,

    explanation: buildMacroExplanation(input.goal),
  };
}