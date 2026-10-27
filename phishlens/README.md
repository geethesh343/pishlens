# PhishLens — AI-Powered Malicious URL Detection System

> **Tagline:** Detect. Prevent. Stay Safe.

PhishLens is an enterprise-grade cybersecurity web application and machine learning engine that identifies potentially dangerous and deceptive website links using real URL feature extraction, Shannon character entropy analysis, and a scikit-learn Random Forest classifier.

---

## 1. Quickstart Guide for Windows (VS Code & PowerShell)

Follow these exact steps in **PowerShell** within your project directory:

### Step 1: Open Terminal in VS Code
Open VS Code, press ``Ctrl + ` `` to open the integrated PowerShell terminal, and navigate to the `phishlens` folder:
```powershell
cd phishlens
```

### Step 2: Create and Activate Virtual Environment
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```
*(If PowerShell restricts script execution, run: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` first).*

### Step 3: Install Required Dependencies
```powershell
pip install --upgrade pip
pip install -r requirements.txt
```

### Step 4: Train the Machine Learning Model
Generate the benchmark dataset, extract the 15 features, train the Random Forest & Logistic Regression models, and evaluate on held-out test data:
```powershell
python ml/train_model.py
```
This generates:
- `models/phishlens_random_forest.joblib` (Trained model artifact)
- `models/evaluation_metrics.json` (Real held-out test metrics)
- `data/phishing_benign_benchmark.csv` (Curated benchmark dataset)

### Step 5: Run Automated Tests
```powershell
pytest
```
All unit tests for URL parsing, IP host checks, Shannon entropy, and API validation will run and pass.

### Step 6: Start the Flask Application
```powershell
python app.py
```
The application will launch on `http://127.0.0.1:5000`. Open this URL in any browser.

---

## 2. API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Web application home & interactive URL scanner |
| `GET` | `/api/health` | Model status, readiness check, and uptime |
| `POST` | `/api/predict` | Analyzes URL string, extracts 15 features, and returns prediction |
| `GET` | `/api/stats` | In-memory session scan counters & test evaluation metrics |
| `GET` | `/api/model-info` | Feature list, model metadata, and classification threshold |

### Example `POST /api/predict` Payload
```json
{
  "url": "http://192.0.2.10/login/verify-account"
}
```

### Example Structured Response
```json
{
  "success": true,
  "url": "http://192.0.2.10/login/verify-account",
  "sanitized_url": "http://192.0.2.10/login/verify-account",
  "prediction": {
    "classification": "Potentially Phishing",
    "risk_score": 92,
    "confidence": 88,
    "classification_threshold": 0.48,
    "suspicious_signals": [
      "Uses a numerical IP address instead of a standard domain name.",
      "Uses unencrypted HTTP protocol; reputable portals enforce HTTPS.",
      "Contains credential harvest tokens: login, verify."
    ],
    "reassuring_signals": [],
    "security_recommendation": "DO NOT proceed to this link. Do not enter credentials, credit cards, or OTP tokens."
  }
}
```

---

## 3. The 15 Extracted Features

1. `url_length`: Total character count of the URL
2. `hostname_length`: Character length of the host/domain
3. `dot_count`: Frequency of `.` in the URL
4. `hyphen_count`: Frequency of `-` in the URL
5. `digit_count`: Count of numerical digits
6. `has_at_symbol`: Flag indicating presence of `@`
7. `subdomain_count`: Hierarchy depth of subdomains
8. `is_ip_address`: Detects raw IPv4/IPv6 hostname usage
9. `is_https`: Flag for encrypted HTTPS transport
10. `path_length`: Length of URI pathname
11. `query_param_count`: Number of URL query parameters
12. `suspicious_token_count`: Count of security/banking keywords
13. `character_entropy`: Shannon entropy $H(X) = -\sum P(x) \log_2 P(x)$
14. `has_unusual_port`: Non-standard port detection (not 80/443)
15. `has_encoded_chars`: Hexadecimal escape sequence detector (`%20`, `%3d`, etc.)

---

## 4. Privacy & Safe Execution Policies

- **Zero Web Execution**: Submitted URLs are parsed mathematically; PhishLens never navigates to, loads, or executes arbitrary target links, mitigating SSRF and malware infections.
- **Privacy Sanitization**: Tokens, passwords, and authorization codes in query strings are stripped from session history.
- **Session-Only Caching**: Scan history is stored in transient application memory and cleared when the process stops.
