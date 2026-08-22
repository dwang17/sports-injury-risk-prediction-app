from pathlib import Path
import joblib
import pandas as pd
import numpy as np

MODEL_PATH = Path(__file__).resolve().parent.parent / "injury_risk_model.joblib"

artifact = joblib.load(MODEL_PATH)

model = artifact["model"]
threshold = artifact["threshold"]


def predict_injury_risk(input_data: dict) -> dict:
    cleaned_data = {
        key: np.nan if value is None else value
        for key, value in input_data.items()
    }

    input_df = pd.DataFrame([cleaned_data])

    injury_probability = float(
        model.predict_proba(input_df)[0, 1]
    )

    elevated_risk = injury_probability >= threshold

    return {
        "injury_probability": injury_probability,
        "elevated_risk": bool(elevated_risk),
        "threshold": float(threshold),
    }