"""
PhishLens - URL Feature Extraction Module
Extracts 15 lexical, structural, and information-theoretic features from URLs.
Used identically during model training and live prediction.
"""

import re
import math
from urllib.parse import urlparse, parse_qs
from typing import Dict, Any, List

# Common credential harvesting and suspicious tokens
SUSPICIOUS_TOKENS = [
    'login', 'verify', 'verification', 'account', 'banking', 'secure', 'update',
    'password', 'credential', 'confirm', 'signin', 'auth', 'wallet', 'security',
    'suspend', 'recover', 'billing', 'ebay', 'paypal', 'netflix', 'apple', 'amazon',
    'microsoft', 'chase', 'wellsfargo', 'support', 'free', 'bonus', 'alert', 'validate'
]

FEATURE_NAMES = [
    'url_length',
    'hostname_length',
    'dot_count',
    'hyphen_count',
    'digit_count',
    'has_at_symbol',
    'subdomain_count',
    'is_ip_address',
    'is_https',
    'path_length',
    'query_param_count',
    'suspicious_token_count',
    'character_entropy',
    'has_unusual_port',
    'has_encoded_chars'
]

def calculate_shannon_entropy(s: str) -> float:
    """Calculates the Shannon character entropy: H(X) = -sum(P(x) * log2(P(x)))"""
    if not s:
        return 0.0
    counts = {}
    for c in s:
        counts[c] = counts.get(c, 0) + 1
    length = len(s)
    entropy = 0.0
    for count in counts.values():
        p = count / length
        entropy -= p * math.log2(p)
    return round(entropy, 4)

def is_ip_address(host: str) -> int:
    """Checks whether the hostname is an IPv4 address."""
    clean_host = host.split(':')[0].strip()
    ipv4_pattern = r'^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'
    return 1 if re.match(ipv4_pattern, clean_host) else 0

def extract_features(raw_url: str) -> Dict[str, Any]:
    """
    Safely extracts 15 numerical and statistical features from a URL string.
    Does NOT fetch or execute the target webpage.
    """
    trimmed = str(raw_url).strip()
    if not trimmed:
        raise ValueError("URL cannot be empty.")

    # Safe parsing
    if not trimmed.startswith(('http://', 'https://')):
        parsed = urlparse('http://' + trimmed)
    else:
        parsed = urlparse(trimmed)

    hostname = parsed.hostname or ''
    pathname = parsed.path or ''
    query = parsed.query or ''
    port = parsed.port

    # 1. Total URL length
    url_length = len(trimmed)

    # 2. Hostname length
    hostname_length = len(hostname)

    # 3. Dot count
    dot_count = trimmed.count('.')

    # 4. Hyphen count
    hyphen_count = trimmed.count('-')

    # 5. Digit count
    digit_count = sum(c.isdigit() for c in trimmed)

    # 6. Has @ symbol
    has_at_symbol = 1 if '@' in trimmed else 0

    # 7. Subdomain count
    ip_flag = is_ip_address(hostname)
    subdomain_count = 0
    if not ip_flag and hostname:
        parts = hostname.split('.')
        if len(parts) > 2:
            subdomain_count = len(parts) - 2

    # 8. Is IP address host
    is_ip = ip_flag

    # 9. Use of HTTPS
    is_https = 1 if parsed.scheme.lower() == 'https' else 0

    # 10. Path length
    path_length = len(pathname)

    # 11. Query param count
    query_param_count = len(parse_qs(query)) if query else 0

    # 12. Suspicious token count
    lower_url = trimmed.lower()
    detected_tokens = [tok for tok in SUSPICIOUS_TOKENS if tok in lower_url]
    suspicious_token_count = len(detected_tokens)

    # 13. Character entropy
    character_entropy = calculate_shannon_entropy(trimmed)

    # 14. Unusual port
    has_unusual_port = 0
    if port and port not in (80, 443):
        has_unusual_port = 1

    # 15. Encoded or escape sequences (e.g., %20, %3d, %2e)
    encoded_pattern = re.compile(r'%[0-9a-fA-F]{2}')
    has_encoded_chars = 1 if encoded_pattern.search(trimmed) else 0

    return {
        'url_length': url_length,
        'hostname_length': hostname_length,
        'dot_count': dot_count,
        'hyphen_count': hyphen_count,
        'digit_count': digit_count,
        'has_at_symbol': has_at_symbol,
        'subdomain_count': subdomain_count,
        'is_ip_address': is_ip,
        'is_https': is_https,
        'path_length': path_length,
        'query_param_count': query_param_count,
        'suspicious_token_count': suspicious_token_count,
        'character_entropy': character_entropy,
        'has_unusual_port': has_unusual_port,
        'has_encoded_chars': has_encoded_chars,
        'detected_tokens': detected_tokens
    }

def get_feature_vector(raw_url: str) -> List[float]:
    """Returns an ordered list of feature values suitable for model prediction."""
    feats = extract_features(raw_url)
    return [feats[name] for name in FEATURE_NAMES]
