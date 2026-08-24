export interface InjuryRiskRequest {
  heart_rate: number | null;
  body_temperature: number | null;
  hydration_level: number | null;
  sleep_quality: number | null;
  recovery_score: number | null;
  stress_level: number | null;
  muscle_activity: number | null;
  joint_angles: number | null;
  gait_speed: number | null;
  cadence: number | null;
  step_count: number | null;
  jump_height: number | null;
  ground_reaction_force: number | null;
  range_of_motion: number | null;
  ambient_temperature: number | null;
  humidity: number | null;
  altitude: number | null;
  playing_surface: number | null;
  training_intensity: number | null;
  training_duration: number | null;
  training_load: number | null;
  fatigue_index: number | null;
  sport_type: "Basketball" | "Other" | "Soccer" | "Track" | null;
  age: number | null;
  bmi: number | null;
}

export interface InjuryRiskResponse {
  injury_probability: number;
  elevated_risk: boolean;
  threshold: number;
}


export const initialInjuryRiskRequest: InjuryRiskRequest = {
  heart_rate: null,
  body_temperature: null,
  hydration_level: null,
  sleep_quality: null,
  recovery_score: null,
  stress_level: null,
  muscle_activity: null,
  joint_angles: null,
  gait_speed: null,
  cadence: null,
  step_count: null,
  jump_height: null,
  ground_reaction_force: null,
  range_of_motion: null,
  ambient_temperature: null,
  humidity: null,
  altitude: null,
  playing_surface: null,
  training_intensity: null,
  training_duration: null,
  training_load: null,
  fatigue_index: null,
  sport_type: null,
  age: null,
  bmi: null,
};