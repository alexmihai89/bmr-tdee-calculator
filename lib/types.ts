// lib/types.ts

export type Sex = "male" | "female";

export type Goal =
  | "light_fat_loss"
  | "moderate_fat_loss"
  | "maintenance"
  | "controlled_muscle_gain";

export type DailyActivityLevel =
  | "very_low"
  | "low"
  | "moderate"
  | "active"
  | "very_active";

export type JobType = "desk" | "mixed" | "standing" | "physical";

export type TrainingType = "strength" | "cardio" | "mixed" | "group_fitness";

export type TrainingIntensity = "light" | "moderate" | "high";

export type WarningLevel = "info" | "caution" | "important";

export type CalorieCalculatorInput = {
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;

  goal: Goal;

  dailyActivityLevel: DailyActivityLevel;
  averageStepsPerDay: number;
  jobType: JobType;

  workoutsPerWeek: number;
  averageWorkoutDurationMinutes: number;
  trainingType: TrainingType;
  trainingIntensity: TrainingIntensity;

  trainingDays?: string[];
};

export type BmrResult = {
  bmr: number;
  formula: "mifflin_st_jeor";
};

export type DailyActivityResult = {
  dailyActivityCalories: number;
  stepsCalories: number;
  jobCalories: number;
  activityLevelCalories: number;
};

export type TrainingResult = {
  averageWorkoutCalories: number;
  weeklyTrainingCalories: number;
  dailyAverageTrainingCalories: number;
};

export type TdeeResult = {
  bmr: number;

  dailyActivityCalories: number;
  stepsCalories: number;
  jobCalories: number;
  activityLevelCalories: number;

  trainingCalories: number;
  averageWorkoutCalories: number;

  estimatedTdee: number;
};

export type GoalResult = {
  targetCalories: number;
  realisticCalorieRange: {
    min: number;
    max: number;
  };
  calorieDifferenceFromTdee: number;
  calorieDifferencePercent: number;
  estimatedMonthlyWeightChangeKg: number;
  warning?: CalculatorWarning;
};

export type MacroRange = {
  min: number;
  max: number;
};

export type MacroResult = {
  proteinGrams: number;
  fatGrams: number;
  carbohydrateGrams: number;

  proteinRangeGrams: MacroRange;
  fatRangeGrams: MacroRange;
  carbohydrateRangeGrams: MacroRange;

  proteinCalories: number;
  fatCalories: number;
  carbohydrateCalories: number;

  explanation: string;
};

export type HydrationResult = {
  dailyWaterMlRange: {
    min: number;
    max: number;
  };
  dailyWaterLitersRange: {
    min: number;
    max: number;
  };
  explanation: string;
  adjustmentNote: string;
};

export type CalculatorWarning = {
  level: WarningLevel;
  title: string;
  message: string;
};

export type ExplanationResult = {
  summary: string;
  adjustmentAdvice: string;
  safetyNote: string;
};

export type CalorieCalculatorResult = {
  input: CalorieCalculatorInput;

  bmr: number;
  estimatedTdee: number;

  dailyActivityCalories: number;
  stepsCalories: number;
  jobCalories: number;
  activityLevelCalories: number;

  trainingCalories: number;
  averageWorkoutCalories: number;

  targetCalories: number;

  realisticCalorieRange: {
    min: number;
    max: number;
  };

  estimatedMonthlyWeightChangeKg: number;

  macros?: MacroResult;

  hydration: HydrationResult;

  explanation: ExplanationResult;

  warnings: CalculatorWarning[];
};

export type SelectOption<T extends string> = {
  value: T;
  label: string;
  description?: string;
};

export const GOAL_OPTIONS: SelectOption<Goal>[] = [
  {
    value: "light_fat_loss",
    label: "Slabire usoara",
    description: "Deficit mic, potrivit pentru aderenta buna pe termen lung.",
  },
  {
    value: "moderate_fat_loss",
    label: "Slabire moderata",
    description: "Deficit mai clar, dar fara abordari agresive.",
  },
  {
    value: "maintenance",
    label: "Mentinere",
    description: "Aport apropiat de consumul estimat zilnic.",
  },
  {
    value: "controlled_muscle_gain",
    label: "Masa musculara controlata",
    description: "Surplus mic, fara bulking agresiv.",
  },
];

export const DAILY_ACTIVITY_OPTIONS: SelectOption<DailyActivityLevel>[] = [
  {
    value: "very_low",
    label: "Foarte redus",
    description:
      "Zi cu foarte putina miscare in afara antrenamentelor. Predominant stat jos, deplasari minime.",
  },
  {
    value: "low",
    label: "Redus",
    description:
      "Zi usoara in afara antrenamentelor. Cateva deplasari, treburi simple, activitate generala redusa.",
  },
  {
    value: "moderate",
    label: "Moderat",
    description:
      "Zi obisnuita cu miscare moderata in afara antrenamentelor. Include activitati zilnice normale, dar nu sedintele de sala.",
  },
  {
    value: "active",
    label: "Activ",
    description:
      "Zi activa in afara antrenamentelor. Mai multe deplasari, multa miscare usoara sau activitate constanta pe parcursul zilei.",
  },
  {
    value: "very_active",
    label: "Foarte activ",
    description:
      "Zi foarte activa in afara antrenamentelor. Multe deplasari, activitate fizica usoara sau moderata pe parcursul zilei. Nu include antrenamentele structurate.",
  },
];

export const JOB_TYPE_OPTIONS: SelectOption<JobType>[] = [
  {
    value: "desk",
    label: "Birou",
    description: "Predominant stat jos.",
  },
  {
    value: "mixed",
    label: "Mixt",
    description: "Combinatie intre stat jos, mers si activitate usoara.",
  },
  {
    value: "standing",
    label: "Mult stat in picioare",
    description:
      "Munca in picioare, cu miscare usoara. Pasii introdusi trebuie sa includa si pasii facuti la job.",
  },
  {
    value: "physical",
    label: "Fizic",
    description:
      "Munca fizica sau activitate solicitanta. Calculatorul ajusteaza suprapunerea cu pasii introdusi.",
  },
];

export const TRAINING_TYPE_OPTIONS: SelectOption<TrainingType>[] = [
  {
    value: "strength",
    label: "Forta",
    description: "Antrenament cu greutati, aparate sau exercitii de rezistenta.",
  },
  {
    value: "cardio",
    label: "Cardio",
    description: "Alergare, bicicleta, eliptica, mers intens sau similar.",
  },
  {
    value: "mixed",
    label: "Mixt",
    description: "Combinatie intre forta si cardio.",
  },
  {
    value: "group_fitness",
    label: "Clase / group fitness",
    description: "Clase de grup, circuit, functional sau aerobic.",
  },
];

export const TRAINING_INTENSITY_OPTIONS: SelectOption<TrainingIntensity>[] = [
  {
    value: "light",
    label: "Usoara",
    description: "Efort confortabil, respiratie controlata.",
  },
  {
    value: "moderate",
    label: "Moderata",
    description: "Efort clar, dar sustenabil.",
  },
  {
    value: "high",
    label: "Ridicata",
    description: "Efort solicitant, intensitate mare sau pauze mai dese.",
  },
];