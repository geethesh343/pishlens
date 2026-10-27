# PhishLens — Malicious URL Detector

**Detect. Prevent. Stay Safe.**

## 1. Introduction

PhishLens is a machine-learning-based web application designed to identify potentially malicious URLs and help users protect themselves from phishing attacks.

Phishing is a type of cyberattack in which attackers create fake websites or deceptive links to steal sensitive information such as usernames, passwords, banking details, and personal data.

PhishLens analyzes the characteristics of a submitted URL and uses a machine learning model to estimate whether it resembles a phishing URL or a legitimate one. It also provides understandable reasons for its prediction.

The main objective of PhishLens is to make URL security analysis simple, fast, and accessible to users without requiring advanced cybersecurity knowledge.

## 2. Problem Statement

Phishing URLs are becoming increasingly difficult to identify because attackers use misleading domain names, suspicious subdomains, shortened links, unusual characters, and deceptive website addresses.

Traditional blacklist-based systems depend on previously identified malicious URLs. Newly created phishing URLs may not be included in these lists immediately.

Therefore, PhishLens aims to analyze URL characteristics and use machine learning to identify suspicious patterns, including patterns that may occur in previously unseen URLs.

## 3. Objectives

The main objectives of PhishLens are:

- Detect potentially malicious URLs using machine learning.
- Extract useful features from website addresses.
- Classify submitted URLs into phishing or lower-risk categories.
- Explain the important factors contributing to a prediction.
- Display a risk score and security recommendations.
- Provide a simple and user-friendly web interface.
- Evaluate model performance using appropriate machine learning metrics.
- Support future integration with browsers, email systems, and other security applications.

## 4. How PhishLens Works

The application follows four major steps.

### Step 1: URL Input

The user enters a website URL into the PhishLens application.

### Step 2: Feature Extraction

The system extracts relevant characteristics from the submitted URL, such as its length, number of special characters, subdomain structure, and other available features.

### Step 3: Machine Learning Prediction

The extracted features are passed to a trained machine learning classifier. The classifier estimates whether the URL resembles phishing or benign URLs in its training data.

### Step 4: Result and Explanation

The application displays the predicted category, an appropriate risk score, important contributing features, and a security recommendation.

**Workflow:**

User Input → URL Feature Extraction → Machine Learning Model → Risk Assessment → Result and Explanation

## 5. Key Features

### URL Analysis
Accepts a URL and analyzes its characteristics to estimate its phishing risk.

### Lexical Analysis
Examines URL length, digits, hyphens, special characters, and potentially suspicious words.

### Structural Analysis
Examines subdomain depth, IP-address hosts, unusual ports, and URL path or query complexity.

### Entropy Analysis
Measures the randomness or unpredictability of characters in a URL.

### Domain Context
Can incorporate domain age and registration information when reliable information is available.

### Risk Classification
Displays whether the submitted URL is classified as potentially phishing or lower risk.

### Explainable Results
Provides understandable reasons for the classification instead of displaying only a label.

### Performance Evaluation
Uses machine learning evaluation metrics to measure the model's performance.

## 6. Technologies Used

| Technology | Purpose |
|---|---|
| Python | Core programming and machine learning |
| Flask | Backend web framework and API |
| HTML5 | Webpage structure |
| CSS3 | Styling and responsive layout |
| JavaScript | Frontend interactions and API communication |
| scikit-learn | Model training, prediction, and evaluation |
| pandas | Dataset preparation and data processing |
| NumPy | Numerical computations |
| Joblib | Saving and loading trained models |
| Chart.js | Dashboard charts, if implemented |
| Git and GitHub | Version control and source-code management |

## 7. Machine Learning Approach

PhishLens can use labeled datasets containing phishing and benign URLs to train a classification model.

The machine learning pipeline includes:

1. Collecting and preparing labeled URL data.
2. Removing duplicates and handling invalid records.
3. Extracting relevant URL features.
4. Separating data for training, validation, and testing.
5. Training machine learning algorithms.
6. Comparing model performance.
7. Selecting an appropriate classification threshold.
8. Evaluating the final model on held-out test data.
9. Integrating the trained model into the web application.

Potential algorithms include Logistic Regression and Random Forest.

The final algorithm should be selected based on actual evaluation results rather than assumptions.

## 8. Model Evaluation

The performance of PhishLens can be evaluated using the following metrics:

- **Accuracy:** The proportion of all predictions that are correct.
- **Precision:** The proportion of URLs predicted as phishing that are actually phishing.
- **Recall:** The proportion of actual phishing URLs correctly detected.
- **F1-score:** A combined measure of precision and recall.
- **PR-AUC:** Measures the precision-recall trade-off across different classification thresholds.
- **False-positive rate:** Measures how often legitimate URLs are incorrectly classified as phishing.

These metrics help evaluate detection quality and the risk of incorrectly warning users about legitimate websites.

## 9. Application Architecture

PhishLens follows a modular web application architecture.

- **Frontend:** Accepts URLs and displays prediction results.
- **Flask backend:** Validates requests and connects the interface to the model.
- **Feature extraction module:** Converts URLs into numerical features.
- **Machine learning module:** Loads the trained model and generates predictions.
- **Dataset and evaluation module:** Supports model training, testing, and performance measurement.

The frontend communicates with the backend through HTTP requests and JSON responses.

## 10. Installation and Execution

### Prerequisites

- Python installed on your computer.
- Visual Studio Code.
- pip package manager.
- A compatible labeled URL dataset for model training.

### Setup

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it on Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install the project dependencies:

```bash
python -m pip install -r requirements.txt
```

Prepare the dataset according to the project documentation, then train the model using the training script:

```bash
python ml/train_model.py
```

Start the Flask application:

```bash
python app.py
```

Open the local address printed in the terminal, commonly:

`http://127.0.0.1:5000`

**Note:** The commands above assume that the generated project contains these files and that the dataset has been prepared. Follow the actual project structure if the filenames differ.

## 11. Security and Privacy

PhishLens is designed to assist users in identifying potentially dangerous URLs.

The application should:

- Avoid automatically opening submitted URLs.
- Avoid storing sensitive URL data unnecessarily.
- Validate inputs before processing them.
- Handle invalid URLs safely.
- Protect application secrets.
- Avoid exposing internal errors to users.
- Limit excessive requests.
- Clearly explain that machine learning predictions can be incorrect.

A lower-risk prediction does not guarantee that a website is legitimate or safe.

## 12. Limitations

- Detection accuracy depends on the quality and representativeness of the training dataset.
- New phishing techniques may not match patterns learned by the model.
- Some legitimate websites may be incorrectly flagged.
- Some malicious URLs may receive a lower-risk prediction.
- Domain registration information may be unavailable or unreliable.
- Model scores should not automatically be interpreted as calibrated probabilities.

PhishLens should be considered an additional security layer rather than a replacement for established cybersecurity protections.

## 13. Future Enhancements

Potential future improvements include:

- Batch URL scanning.
- REST API integration for external applications.
- Browser extension for real-time warnings.
- Email phishing detection.
- Improved domain intelligence.
- Periodic model retraining using updated datasets.
- More detailed explanations of predictions.
- Multilingual security guidance.
- Optional user accounts and scan-history management, with appropriate privacy protections.

These features can be added progressively after the core application has been implemented and tested.

## 14. Expected Outcome

PhishLens aims to provide an accessible URL analysis tool that combines machine learning, URL feature extraction, and understandable explanations.

By helping users recognize suspicious links before sharing sensitive information, the project aims to improve cybersecurity awareness and support safer browsing decisions.

## 15. Conclusion

PhishLens demonstrates how machine learning can be applied to the problem of phishing URL detection.

By combining URL analysis, classification algorithms, and explainable results, the application aims to make suspicious-link assessment easier to understand and use.

Its modular architecture also provides a foundation for future enhancements such as browser integration, batch scanning, and email security.

**PhishLens — Detect. Prevent. Stay Safe.**
