// lib/formatters.ts

export function formatNumber(value: number): string {
  return Math.round(value).toLocaleString("ro-RO");
}

export function formatCalories(value: number): string {
  return `${Math.round(value).toLocaleString("ro-RO")} kcal`;
}

export function formatCaloriesPerDay(value: number): string {
  return `${Math.round(value).toLocaleString("ro-RO")} kcal / zi`;
}

export function formatGrams(value: number): string {
  return `${Math.round(value).toLocaleString("ro-RO")} g`;
}

export function formatKilograms(value: number): string {
  return `${value.toLocaleString("ro-RO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  })} kg`;
}

export function formatSteps(value: number): string {
  return `${Math.round(value).toLocaleString("ro-RO")} pasi`;
}

export function formatPercent(value: number): string {
  return `${Math.round(value).toLocaleString("ro-RO")}%`;
}

export function formatSignedCaloriesPerDay(value: number): string {
  const rounded = Math.round(value);

  if (rounded === 0) {
    return "0 kcal / zi";
  }

  const sign = rounded > 0 ? "+" : "−";

  return `${sign}${Math.abs(rounded).toLocaleString("ro-RO")} kcal / zi`;
}

export function formatSignedPercent(value: number): string {
  const rounded = Math.round(value);

  if (rounded === 0) {
    return "0%";
  }

  const sign = rounded > 0 ? "+" : "−";

  return `${sign}${Math.abs(rounded).toLocaleString("ro-RO")}%`;
}

export function formatCalorieRange(params: {
  min: number;
  max: number;
}): string {
  return `${formatCalories(params.min)} - ${formatCalories(params.max)}`;
}

export function formatGramRange(params: {
  min: number;
  max: number;
}): string {
  return `${formatGrams(params.min)} - ${formatGrams(params.max)}`;
}