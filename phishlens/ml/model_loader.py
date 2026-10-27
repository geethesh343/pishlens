"""
PhishLens - Model Loader & Predictor Module
Loads the trained Random Forest model and executes prediction pipeline with explainability.
"""

import os
import json
import joblib
import pandas as pd
from typing import Dict, Any

try:
    from ml.feature_extraction import extract_features, FEATURE_NAMES
except ImportError:
    from feature_extraction import extract_features, FEATURE_NAMES

class PhishLensPredictor:
    def __init__(self, model_path: str = None, metrics_path: str = None):
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.model_path = model_path or os.path.join(base_dir, 'models', 'phishlens_random_forest.joblib')
        self.metrics_path = metrics_path or os.path.join(base_dir, 'models', 'evaluation_metrics.json')
        self.model = None
        self.metrics = None
        self.threshold = 0.48
        self._load()

    def _load(self):
        if os.path.exists(self.model_path):
            self.model = joblib.load(self.model_path)
        if os.path.exists(self.metrics_path):
            with open(self.metrics_path, 'r') as f:
                self.metrics = json.load(f)
                self.threshold = self.metrics.get('classification_threshold', 0.48)

    def is_ready(self) -> bool:
        return self.model is not None

    def predict(self, url: str) -> Dict[str, Any]:
        if not self.is_ready():
            raise RuntimeError("Model is not loaded. Run ml/train_model.py first.")

        features_dict = extract_features(url)
        # Construct DataFrame in exact feature order
        X = pd.DataFrame([[features_dict[name] for name in FEATURE_NAMES]], columns=FEATURE_NAMES)
        
        # Calculate prediction probability
        prob = float(self.model.predict_proba(X)[0][1])
        risk_score = round(prob * 100)
        is_phishing = prob >= self.threshold
        classification = "Potentially Phishing" if is_phishing else "Lower Risk"

        # Model confidence: calibrated against threshold distance
        confidence = round((abs(prob - self.threshold) / (1 - self.threshold)) * 100)
        confidence = min(max(confidence, 55), 99)

        # Explainability signals
        suspicious_signals = []
        reassuring_signals = []

        if features_dict['is_ip_address'] == 1:
            suspicious_signals.append("Uses a numerical IP address instead of a standard domain name.")
        if features_dict['has_at_symbol'] == 1:
            suspicious_signals.append("Contains an '@' symbol which can conceal the true destination host.")
        if features_dict['is_https'] == 0:
            suspicious_signals.append("Uses unencrypted HTTP protocol; reputable portals enforce HTTPS.")
        else:
            reassuring_signals.append("Uses encrypted HTTPS transport protocol.")
        if features_dict['subdomain_count'] >= 2:
            suspicious_signals.append(f"High subdomain depth ({features_dict['subdomain_count']} subdomains) often used for brand impersonation.")
        if features_dict['suspicious_token_count'] > 0:
            suspicious_signals.append(f"Contains credential harvest tokens: {', '.join(features_dict['detected_tokens'])}.")
        if features_dict['character_entropy'] > 4.0:
            suspicious_signals.append(f"Elevated Shannon entropy ({features_dict['character_entropy']} bits/char), indicating string randomness.")
        else:
            reassuring_signals.append(f"Normal Shannon entropy ({features_dict['character_entropy']} bits/char).")

        if is_phishing:
            recommendation = "DO NOT proceed to this link. Do not enter credentials, credit cards, or OTP tokens."
        else:
            recommendation = "Lower risk detected based on URL features. Note: This is not an absolute safety guarantee; always verify the destination before entering credentials."

        return {
            'classification': classification,
            'risk_score': risk_score,
            'probability': round(prob, 4),
            'confidence': confidence,
            'classification_threshold': self.threshold,
            'suspicious_signals': suspicious_signals,
            'reassuring_signals': reassuring_signals,
            'security_recommendation': recommendation,
            'features': features_dict
        }
