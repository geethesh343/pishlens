"""
Unit tests for URL Feature Extraction
"""

import pytest
from ml.feature_extraction import extract_features, calculate_shannon_entropy, is_ip_address, FEATURE_NAMES

def test_extract_features_valid_https():
    url = "https://www.google.com/search?q=test"
    feats = extract_features(url)
    assert feats['is_https'] == 1
    assert feats['is_ip_address'] == 0
    assert feats['has_at_symbol'] == 0
    assert feats['subdomain_count'] == 1  # 'www'
    assert feats['query_param_count'] == 1
    assert len(feats) >= len(FEATURE_NAMES)

def test_extract_features_ip_address():
    url = "http://192.0.2.10/login/verify-account"
    feats = extract_features(url)
    assert feats['is_ip_address'] == 1
    assert feats['is_https'] == 0
    assert 'login' in feats['detected_tokens']
    assert 'verify' in feats['detected_tokens']
    assert feats['suspicious_token_count'] >= 2

def test_extract_features_at_symbol():
    url = "http://service.com@evil-site.top/auth"
    feats = extract_features(url)
    assert feats['has_at_symbol'] == 1
    assert feats['suspicious_token_count'] >= 1

def test_unusual_port():
    url = "http://malicious.org:8080/path"
    feats = extract_features(url)
    assert feats['has_unusual_port'] == 1

def test_encoded_characters():
    url = "http://victim-portal.com/%20%2f%3d"
    feats = extract_features(url)
    assert feats['has_encoded_chars'] == 1

def test_shannon_entropy():
    # Identical string has 0 entropy
    assert calculate_shannon_entropy("aaaa") == 0.0
    # High randomness has higher entropy
    h_random = calculate_shannon_entropy("a89df712klzq")
    h_simple = calculate_shannon_entropy("google.com")
    assert h_random > h_simple

def test_empty_url_raises_error():
    with pytest.raises(ValueError):
        extract_features("")
