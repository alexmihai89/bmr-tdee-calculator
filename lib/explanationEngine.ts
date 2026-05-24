// lib/explanationEngine.ts

import type {
  CalorieCalculatorInput,
  ExplanationResult,
  Goal,
} from "./types";

type ExplanationInput = {
  input: CalorieCalculatorInput;
  estimatedTdee: number;
  targetCalories: number;
  estimatedMonthlyWeightChangeKg: number;
};

function getGoalLabel(goal: Goal): string {
  if (goal === "light_fat_loss") {
    return "slabire usoara";
  }

  if (goal === "moderate_fat_loss") {
    return "slabire moderata";
  }

  if (goal === "maintenance") {
    return "mentinere";
  }

  return "masa musculara controlata";
}

function buildSummary(input: ExplanationInput): string {
  const goalLabel = getGoalLabel(input.input.goal);

  if (input.input.goal === "maintenance") {
    return `Estimarea ta de mentinere este de aproximativ ${input.estimatedTdee} kcal pe zi. Pentru obiectivul de ${goalLabel}, tinta recomandata ramane aproape de acest nivel, cu un interval flexibil pentru zile mai active sau mai usoare.`;
  }

  if (
    input.input.goal === "light_fat_loss" ||
    input.input.goal === "moderate_fat_loss"
  ) {
    const monthlyChange = Math.abs(input.estimatedMonthlyWeightChangeKg);

    return `Pentru obiectivul de ${goalLabel}, tinta recomandata este de aproximativ ${input.targetCalories} kcal pe zi. Pe baza acestei estimari, ritmul teoretic de scadere poate fi in jur de ${monthlyChange} kg pe luna, dar rezultatul real poate varia in functie de aderenta, retentie de apa, somn, stres si nivelul real de activitate.`;
  }

  const monthlyChange = Math.abs(input.estimatedMonthlyWeightChangeKg);

  return `Pentru obiectivul de ${goalLabel}, tinta recomandata este de aproximativ ${input.targetCalories} kcal pe zi. Surplusul este intentionat moderat, pentru a sustine progresul fara o crestere agresiva a greutatii corporale. Ritmul estimativ de ${monthlyChange} kg pe luna se refera la greutatea corporala totala, nu exclusiv la masa musculara. O parte din variatie poate veni din glicogen, apa si continut digestiv.`;
}

function buildAdjustmentAdvice(): string {
  return "Foloseste acest rezultat ca punct de pornire timp de 2-3 saptamani. Urmareste media greutatii, circumferintele, energia, performanta la antrenamente si cat de usor poti respecta planul. Daca greutatea nu se misca in directia dorita, ajusteaza cu 100-200 kcal pe zi.";
}

function buildSafetyNote(): string {
  return "Calculatorul ofera estimari, nu diagnostic medical. Daca exista diabet, sarcina, afectiuni metabolice, tratamente medicale, tulburari alimentare sau simptome neobisnuite, este recomandat consult cu medic sau nutritionist.";
}

export function buildExplanation(input: ExplanationInput): ExplanationResult {
  return {
    summary: buildSummary(input),
    adjustmentAdvice: buildAdjustmentAdvice(),
    safetyNote: buildSafetyNote(),
  };
}