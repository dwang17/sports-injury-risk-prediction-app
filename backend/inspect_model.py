import joblib

artifact = joblib.load("injury_risk_model.joblib")

model = artifact["model"]
threshold = artifact["threshold"]

print("=" * 60)
print("DEPLOYMENT ARTIFACT")
print("=" * 60)

print("Threshold:")
print(threshold)

print("\nOuter model type:")
print(type(model))

print("\nOuter feature names:")
if hasattr(model, "feature_names_in_"):
    for feature in model.feature_names_in_:
        print(feature)
else:
    print("No feature_names_in_ attribute found.")

print("\nNumber of expected raw features:")
if hasattr(model, "n_features_in_"):
    print(model.n_features_in_)
else:
    print("No n_features_in_ attribute found.")

print("\nFull model:")
print(model)