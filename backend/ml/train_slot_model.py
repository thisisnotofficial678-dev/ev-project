import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib
import random

# ----------------- Generate synthetic dataset -----------------
np.random.seed(42)

n_samples = 5000
data = {
    "stationId": np.random.randint(1, 6, n_samples),  # 5 stations
    "hour": np.random.randint(0, 24, n_samples),
    "dayofweek": np.random.randint(0, 7, n_samples),
    "trafficIdx": np.round(np.random.rand(n_samples), 2),  # 0 (low) - 1 (high)
    "urgentReq": np.random.randint(0, 2, n_samples),  # 0/1
}

df = pd.DataFrame(data)

# Availability depends on traffic, time of day & urgency (synthetic rule)
df["target"] = (
    (df["trafficIdx"] < 0.7) &
    ((df["hour"] < 9) | (df["hour"] > 18)) &
    (df["urgentReq"] == 0)
).astype(int)

# ----------------- Train ML model -----------------
X = df[["stationId", "hour", "dayofweek", "trafficIdx", "urgentReq"]]
y = df["target"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# ----------------- Evaluate -----------------
y_pred = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, y_pred))
print(classification_report(y_test, y_pred))

# ----------------- Save model -----------------
joblib.dump(model, "slot_predictor.pkl")
print("✅ Model saved as slot_predictor.pkl")
