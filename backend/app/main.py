from fastapi import FastAPI

from app.model import predict_injury_risk
from app.schemas import InjuryRiskRequest, InjuryRiskResponse


app = FastAPI(
    title="Sports Injury Risk API",
    description="Educational ML API for estimating sports injury risk.",
    version="1.0.0",
)


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.post("/predict", response_model=InjuryRiskResponse)
def predict(request: InjuryRiskRequest):
    result = predict_injury_risk(
        request.model_dump()
    )

    return result