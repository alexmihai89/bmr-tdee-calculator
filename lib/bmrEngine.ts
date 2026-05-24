// lib/bmrEngine.ts

import type { BmrResult, CalorieCalculatorInput, Sex } from "./types";

type BmrInput = Pick<
  CalorieCalculatorInput,
  "sex" | "age" | "heightCm" | "weightKg"
>;

function roundCalories(value: number): number {
  return Math.round(value);
}

function isValidPositiveNumber(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

export function validateBmrInput(input: BmrInput): void {
  if (input.sex !== "male" && input.sex !== "female") {
    throw new Error("Sexul introdus nu este valid.");
  }

  if (!isValidPositiveNumber(input.age)) {
    throw new Error("Varsta trebuie sa fie un numar pozitiv.");
  }

  if (!isValidPositiveNumber(input.heightCm)) {
    throw new Error("Inaltimea trebuie sa fie un numar pozitiv.");
  }

  if (!isValidPositiveNumber(input.weightKg)) {
    throw new Error("Greutatea trebuie sa fie un numar pozitiv.");
  }

  if (input.age < 14 || input.age > 90) {
    throw new Error("Calculatorul este gandit pentru persoane intre 14 si 90 de ani.");
  }

  if (input.heightCm < 120 || input.heightCm > 230) {
    throw new Error("Inaltimea introdusa pare in afara intervalului obisnuit.");
  }

  if (input.weightKg < 35 || input.weightKg > 250) {
    throw new Error("Greutatea introdusa pare in afara intervalului obisnuit.");
  }
}

export function calculateMifflinStJeorBmr(params: {
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
}): number {
  const baseBmr =
    10 * params.weightKg + 6.25 * params.heightCm - 5 * params.age;

  if (params.sex === "male") {
    return roundCalories(baseBmr + 5);
  }

  return roundCalories(baseBmr - 161);
}

export function calculateBmr(input: BmrInput): BmrResult {
  validateBmrInput(input);

  const bmr = calculateMifflinStJeorBmr({
    sex: input.sex,
    age: input.age,
    heightCm: input.heightCm,
    weightKg: input.weightKg,
  });

  return {
    bmr,
    formula: "mifflin_st_jeor",
  };
}