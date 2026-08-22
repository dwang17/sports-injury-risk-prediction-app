# sports-injury-risk-prediction-app

Model was creating in scikit-learn 1.6.1, and Python 3.12 must be used for this application

Run backend:
uvicorn app.main:app --reload

Input Validation:
API inputs are restricted to the value ranges represented in the model's training dataset. This helps prevent predictions on out-of-distribution inputs the model was not trained to handle. Missing values are supported and handled by the model's preprocessing pipeline.