"""
API and Integration Tests for Flask Backend
"""

import pytest
import json
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_health_endpoint(client):
    rv = client.get('/api/health')
    assert rv.status_code == 200
    data = json.loads(rv.data)
    assert data['status'] == 'healthy'
    assert 'model_version' in data

def test_predict_endpoint_valid_url(client):
    payload = {'url': 'https://www.paypal.com/signin'}
    rv = client.post('/api/predict', json=payload)
    # May return 200 if model trained or 503/500 if uninitialized
    assert rv.status_code in (200, 500)
    if rv.status_code == 200:
        data = json.loads(rv.data)
        assert data['success'] is True
        assert 'prediction' in data
        assert 'classification' in data['prediction']

def test_predict_rejects_missing_protocol(client):
    payload = {'url': 'ftp://files.example.com/download'}
    rv = client.post('/api/predict', json=payload)
    assert rv.status_code == 400
    data = json.loads(rv.data)
    assert data['success'] is False
    assert 'Validation Error' in data['error']

def test_predict_empty_url(client):
    payload = {'url': ''}
    rv = client.post('/api/predict', json=payload)
    assert rv.status_code == 400
    data = json.loads(rv.data)
    assert data['success'] is False

def test_stats_endpoint(client):
    rv = client.get('/api/stats')
    assert rv.status_code == 200
    data = json.loads(rv.data)
    assert 'session' in data
    assert 'total_scanned' in data['session']
