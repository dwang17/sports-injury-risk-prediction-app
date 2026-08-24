from fastapi import FastAPI

from app.model import predict_injury_risk
from app import model as model_module
from app.schemas import InjuryRiskRequest, InjuryRiskResponse


app = FastAPI(
    title="Sports Injury Risk API",
    description="Educational ML API for estimating sports injury risk.",
    version="1.0.0",
)


@app.get("/health")
def health():
    model_loaded = False
    try:
        model_loaded = hasattr(model_module, "model") and model_module.model is not None
    except Exception:
        model_loaded = False

    return {
        "status": "healthy",
        "model_loaded": bool(model_loaded),
    }


@app.post("/predict", response_model=InjuryRiskResponse)
def predict(request: InjuryRiskRequest):
    result = predict_injury_risk(
        request.model_dump()
    )

    return result