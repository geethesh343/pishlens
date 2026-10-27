"""
Tests for ML Model and Inference Pipeline
"""

import pytest
import os
from ml.feature_extraction import extract_features, FEATURE_NAMES

def test_feature_vector_completeness():
    url = "https://example.com/login"
    feats = extract_features(url)
    for name in FEATURE_NAMES:
        assert name in feats, f"Missing feature: {name}"
        assert isinstance(feats[name], (int, float)), f"Feature {name} is not numeric"

def test_extreme_obfuscation_features():
    # Long URL with multiple subdomains, IP address, unusual port, and credentials
    url = "http://198.51.100.22:8443/auth/verify?token=928374928374928374&session=abc#fragment"
    feats = extract_features(url)
    assert feats['is_ip_address'] == 1
    assert feats['has_unusual_port'] == 1
    assert feats['suspicious_token_count'] >= 2
    assert feats['url_length'] > 50
