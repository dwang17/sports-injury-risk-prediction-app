import type { InjuryRiskRequest } from "../types/prediction";

export interface FormOption {
  label: string;
  value: string | number;
}

export interface FormField {
  name: keyof InjuryRiskRequest;
  label: string;
  type: "number" | "select";
  isCore?: boolean;
  min?: number;
  max?: number;
  decimalPlaces?: number;
  step?: number | "any";
  unit?: string;
  options?: FormOption[];
}

export interface FormSection {
  title: string;
  description: string;
  fields: FormField[];
  collapsible?: boolean;
  summary?: string;
}

export const formSections: FormSection[] = [
  {
    title: "Core Inputs",
    description:
      "Provide at least 3 of the 5 core measurements. Additional inputs are optional and may help personalize the estimate.",
    fields: [
      {
        name: "recovery_score",
        label: "Recovery Score",
        type: "number",
        isCore: true,
        min: 8.902583916887018,
        max: 98,
        step: "any",
      },
      {
        name: "stress_level",
        label: "Stress Level",
        type: "number",
        isCore: true,
        min: 0.1,
        max: 0.95,
        decimalPlaces: 2,
        step: "any",
      },
      {
        name: "hydration_level",
        label: "Hydration Level",
        type: "number",
        isCore: true,
        min: 45,
        max: 100,
        step: "any",
      },
      {
        name: "fatigue_index",
        label: "Fatigue Index",
        type: "number",
        isCore: true,
        min: 15,
        max: 270.19321875,
        step: "any",
      },
      {
        name: "sleep_quality",
        label: "Sleep Quality",
        type: "number",
        isCore: true,
        min: 1.155807476051645,
        max: 10,
        step: "any",
      },
    ],
  },
  {
    title: "Athlete & Training",
    description: "Basic athlete characteristics and training measurements.",
    fields: [
      {
        name: "age",
        label: "Age",
        type: "number",
        min: 18,
        max: 34,
        step: 1,
        unit: "years",
      },
      {
        name: "bmi",
        label: "BMI",
        type: "number",
        min: 18.5,
        max: 28.3,
        decimalPlaces: 1,
        step: "any",
      },
      {
        name: "heart_rate",
        label: "Heart Rate",
        type: "number",
        min: 40,
        max: 159.2701250756765,
        step: "any",
        unit: "bpm",
      },
      {
        name: "body_temperature",
        label: "Body Temperature",
        type: "number",
        min: 35.8,
        max: 39.2,
        decimalPlaces: 1,
        step: "any",
        unit: "°C",
      },
      {
        name: "sport_type",
        label: "Sport Type",
        type: "select",
        options: [
          { label: "Basketball", value: "Basketball" },
          { label: "Soccer", value: "Soccer" },
          { label: "Track", value: "Track" },
          { label: "Other", value: "Other" },
        ],
      },
      {
        name: "training_intensity",
        label: "Training Intensity",
        type: "number",
        min: 2,
        max: 10,
        step: "any",
      },
      {
        name: "training_duration",
        label: "Training Duration",
        type: "number",
        min: 30,
        max: 180,
        step: "any",
        unit: "minutes",
      },
      {
        name: "training_load",
        label: "Training Load",
        type: "number",
        min: 150,
        max: 2632.637546776286,
        step: "any",
      },
    ],
  },
  {
    title: "Movement & Biomechanics",
    description: "Movement, force, and range-of-motion measurements.",
    collapsible: true,
    summary: "Advanced sensor inputs",
    fields: [
      {
        name: "muscle_activity",
        label: "Muscle Activity",
        type: "number",
        min: 10,
        max: 722.5428189101966,
        step: "any",
      },
      {
        name: "joint_angles",
        label: "Joint Angles",
        type: "number",
        min: 45,
        max: 175,
        step: "any",
        unit: "degrees",
      },
      {
        name: "gait_speed",
        label: "Gait Speed",
        type: "number",
        min: 0.8,
        max: 3.5,
        step: "any",
        unit: "m/s",
      },
      {
        name: "cadence",
        label: "Cadence",
        type: "number",
        min: 50,
        max: 185.94398257741767,
        step: "any",
        unit: "steps/min",
      },
      {
        name: "step_count",
        label: "Step Count",
        type: "number",
        min: 2000,
        max: 15000,
        step: 1,
      },
      {
        name: "jump_height",
        label: "Jump Height",
        type: "number",
        min: 0.15,
        max: 0.85,
        step: "any",
        unit: "m",
      },
      {
        name: "ground_reaction_force",
        label: "Ground Reaction Force",
        type: "number",
        min: 800,
        max: 2800,
        step: "any",
        unit: "N",
      },
      {
        name: "range_of_motion",
        label: "Range of Motion",
        type: "number",
        min: 60,
        max: 180,
        step: "any",
        unit: "degrees",
      },
    ],
  },
  {
    title: "Environment",
    description: "Conditions and surface associated with the activity.",
    collapsible: true,
    summary: "Additional environment data",
    fields: [
      {
        name: "ambient_temperature",
        label: "Ambient Temperature",
        type: "number",
        min: 15,
        max: 38,
        step: "any",
        unit: "°C",
      },
      {
        name: "humidity",
        label: "Humidity",
        type: "number",
        min: 30,
        max: 85,
        step: "any",
        unit: "%",
      },
      {
        name: "altitude",
        label: "Altitude",
        type: "number",
        min: 0,
        max: 1200,
        step: "any",
        unit: "m",
      },
      {
        name: "playing_surface",
        label: "Playing Surface",
        type: "select",
        options: [
          { label: "Grass", value: 0 },
          { label: "Turf", value: 1 },
          { label: "Indoor", value: 2 },
          { label: "Track", value: 3 },
          { label: "Other", value: 4 },
        ],
      },
    ],
  },
];