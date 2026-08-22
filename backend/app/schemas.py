from typing import Literal
from pydantic import BaseModel, Field


class InjuryRiskRequest(BaseModel):
    heart_rate: float | None = Field(default=None, ge=40.0, le=159.2701250756765)
    body_temperature: float | None = Field(default=None, ge=35.8, le=39.2)
    hydration_level: float | None = Field(default=None, ge=45.0, le=100.0)
    sleep_quality: float | None = Field(default=None, ge=1.155807476051645, le=10.0)
    recovery_score: float | None = Field(default=None, ge=8.902583916887018, le=98.0)
    stress_level: float | None = Field(default=None, ge=0.1, le=0.95)
    muscle_activity: float | None = Field(default=None, ge=10.0, le=722.5428189101966)
    joint_angles: float | None = Field(default=None, ge=45.0, le=175.0)
    gait_speed: float | None = Field(default=None, ge=0.8, le=3.5)
    cadence: float | None = Field(default=None, ge=50.0, le=185.94398257741767)
    step_count: int | None = Field(default=None, ge=2000, le=15000)
    jump_height: float | None = Field(default=None, ge=0.15, le=0.85)
    ground_reaction_force: float | None = Field(default=None, ge=800.0, le=2800.0)
    range_of_motion: float | None = Field(default=None, ge=60.0, le=180.0)
    ambient_temperature: float | None = Field(default=None, ge=15.0, le=38.0)
    humidity: float | None = Field(default=None, ge=30.0, le=85.0)
    altitude: float | None = Field(default=None, ge=0.0, le=1200.0)
    playing_surface: int | None = Field(default=None, ge=0, le=4) #stored numerically in the dataset, even though our model uses this as a categorical feature.
    training_intensity: float | None = Field(default=None, ge=2.0, le=10.0)
    training_duration: float | None = Field(default=None, ge=30.0, le=180.0)
    training_load: float | None = Field(default=None, ge=150.0, le=2632.637546776286)
    fatigue_index: float | None = Field(default=None, ge=15.0, le=270.19321875)

    sport_type: Literal[
        "Basketball",
        "Other",
        "Soccer",
        "Track"
    ] | None = None

    age: int | None = Field(default=None, ge=18, le=34)
    bmi: float | None = Field(default=None, ge=18.5, le=28.3)


class InjuryRiskResponse(BaseModel):
    injury_probability: float
    elevated_risk: bool
    threshold: float