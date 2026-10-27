import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Base application configuration."""
    SECRET_KEY = os.getenv('SECRET_KEY', 'phishlens-dev-secret-key-change-in-production')
    MODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models')
    MODEL_PATH = os.path.join(MODEL_DIR, 'phishlens_random_forest.joblib')
    EVALUATION_PATH = os.path.join(MODEL_DIR, 'evaluation_metrics.json')
    DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
    MAX_CONTENT_LENGTH = 16 * 1024  # 16 KB request limit
    CLASSIFICATION_THRESHOLD = 0.48
    DEBUG = os.getenv('FLASK_DEBUG', 'False').lower() in ('true', '1')
