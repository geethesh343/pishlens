"""
PhishLens - Flask Application Backend
Serves the web application and JSON REST API for real-time URL phishing detection.
"""

import os
import re
from datetime import datetime
from urllib.parse import urlparse, parse_qs
from flask import Flask, render_template, request, jsonify

from config import Config
from ml.model_loader import PhishLensPredictor

app = Flask(__name__)
app.config.from_object(Config)

# Initialize Predictor
predictor = PhishLensPredictor(
    model_path=Config.MODEL_PATH,
    metrics_path=Config.EVALUATION_PATH
)

# In-memory session tracking (Strictly non-persistent for privacy)
session_stats = {
    'total_scanned': 0,
    'phishing_detected': 0,
    'lower_risk_detected': 0,
    'recent_scans': []
}

def sanitize_url(raw_url: str) -> str:
    """Masks potentially private tokens and passwords in query parameters."""
    try:
        parsed = urlparse(raw_url)
        params = parse_qs(parsed.query)
        clean_params = []
        for k, v in params.items():
            if re.search(r'pass|token|secret|key|auth|session|credential|code', k, re.I):
                clean_params.append(f"{k}=[REDACTED]")
            else:
                clean_params.append(f"{k}={v[0][:15]}...")
        clean_query = '?' + '&'.join(clean_params) if clean_params else ''
        return f"{parsed.scheme}://{parsed.netloc}{parsed.path}{clean_query}"
    except Exception:
        return raw_url[:40] + "..."

@app.after_request
def apply_security_headers(response):
    """Sets standard HTTP security headers."""
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    return response

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/documentation')
def documentation():
    return render_template('documentation.html')

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'ready': predictor.is_ready(),
        'model_version': '1.2.0',
        'timestamp': datetime.utcnow().isoformat()
    }), 200

@app.route('/api/model-info', methods=['GET'])
def model_info():
    if not predictor.metrics:
        return jsonify({
            'success': False,
            'error': 'Model evaluation metrics not yet generated. Run train_model.py.'
        }), 503

    return jsonify({
        'success': True,
        'model_type': predictor.metrics.get('model_type', 'Random Forest Classifier'),
        'feature_count': len(predictor.metrics.get('feature_names', [])),
        'features': predictor.metrics.get('feature_names', []),
        'classification_threshold': predictor.threshold,
        'evaluation_metrics': predictor.metrics.get('metrics', {})
    }), 200

@app.route('/api/stats', methods=['GET'])
def stats():
    return jsonify({
        'success': True,
        'session': {
            'total_scanned': session_stats['total_scanned'],
            'phishing_detected': session_stats['phishing_detected'],
            'lower_risk_detected': session_stats['lower_risk_detected'],
            'recent_scans': session_stats['recent_scans'][:10]
        },
        'evaluation': predictor.metrics.get('metrics', {}) if predictor.metrics else {}
    }), 200

@app.route('/api/predict', methods=['POST'])
def predict():
    if not request.is_json:
        return jsonify({'success': False, 'error': 'Request body must be JSON.'}), 400

    data = request.get_json()
    url = data.get('url', '').strip()

    if not url:
        return jsonify({'success': False, 'error': 'URL input cannot be empty.'}), 400

    # Validate HTTP/HTTPS protocol
    if not re.match(r'^https?://', url, re.IGNORECASE):
        return jsonify({
            'success': False,
            'error': 'Validation Error: Only URLs beginning with http:// or https:// are accepted.'
        }), 400

    if len(url) > 2048:
        return jsonify({'success': False, 'error': 'URL exceeds maximum length of 2,048 characters.'}), 400

    try:
        result = predictor.predict(url)

        # Update session counters
        session_stats['total_scanned'] += 1
        if result['classification'] == 'Potentially Phishing':
            session_stats['phishing_detected'] += 1
        else:
            session_stats['lower_risk_detected'] += 1

        sanitized = sanitize_url(url)
        session_stats['recent_scans'].insert(0, {
            'url': sanitized,
            'classification': result['classification'],
            'risk_score': result['risk_score'],
            'timestamp': datetime.now().strftime('%H:%M:%S')
        })
        if len(session_stats['recent_scans']) > 50:
            session_stats['recent_scans'].pop()

        return jsonify({
            'success': True,
            'url': url,
            'sanitized_url': sanitized,
            'prediction': result
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': 'An internal processing error occurred while analyzing the URL.'
        }), 500

@app.errorhandler(404)
def not_found(e):
    return jsonify({'success': False, 'error': 'Endpoint not found.'}), 404

@app.errorhandler(413)
def request_entity_too_large(e):
    return jsonify({'success': False, 'error': 'Payload exceeds maximum limit.'}), 413

if __name__ == '__main__':
    port = int(os.environ.get('FLASK_PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=Config.DEBUG)
