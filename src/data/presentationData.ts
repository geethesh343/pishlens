import { Slide, VivaQuestion, TechnicalTerm } from '../types/presentation';

export const SLIDES_DATA: Slide[] = [
  {
    id: 1,
    title: 'PhishLens — Malicious URL Detector',
    subtitle: 'Protecting Users from Deceptive Web Links via Feature Extraction & Machine Learning',
    purpose: 'Opening slide introducing the project, its core objective, motivation, and presenter credentials.',
    visualTheme: 'Cybersecurity Shield & URL Inspection Lens',
    bulletPoints: [
      'Problem Context: Rapid proliferation of malicious links across email, messaging apps, and SMS.',
      'Core Objective: Detect potentially dangerous URLs before users suffer credentials or financial loss.',
      'Distinctive Approach: Inspect lexical, structural, and entropy patterns rather than relying only on slow blacklists.',
      'Explainable Output: Generate not just a label, but human-understandable reasons for risk.'
    ],
    spokenScript: `Good morning, respected faculty members and my dear friends.

Today, our team is presenting our project, PhishLens, which stands for a malicious URL detection system.

In today's digital world, we frequently receive links through WhatsApp, email, SMS, and social media. Some of these links may lead to fake websites designed to steal personal information, passwords, and financial details.

Our project aims to identify potentially malicious URLs using feature extraction and machine learning. It also explains why a link may be suspicious.

Our main goal is to detect, prevent, and help users stay safe from phishing attacks.`,
    transitionCue: 'Transition: "First, let us understand the problem we are trying to solve."',
    keyTakeaway: 'PhishLens analyzes the inherent characteristics of a URL before a user enters sensitive credentials.',
    technicalHighlights: [
      { label: 'Detection Paradigm', value: 'Feature-based ML', desc: 'Predicts risk on zero-day / unseen links' },
      { label: 'Target Vector', value: 'Phishing URLs', desc: 'Credential harvesting, copycats, spoofing' },
      { label: 'Key Innovation', value: 'Explainable Verdicts', desc: 'Plain-language risk justifications' }
    ],
    anticipatedQuestion: {
      question: 'Why is it called PhishLens?',
      answer: 'Like a magnifying lens, PhishLens zooms in on the granular anatomy of a URL—measuring subdomains, character entropy, and lexical markers—to reveal hidden threats before a click occurs.'
    }
  },
  {
    id: 2,
    title: 'The Problem: Why URL Detection is Critical',
    subtitle: 'Vulnerabilities in Traditional Blacklists and the Rising Sophistication of Attacks',
    purpose: 'Establish why conventional security methods fail and why machine learning is strictly needed.',
    visualTheme: 'Three Problem Vectors: Copycat disguise, Blacklist latency, High cost of single click',
    bulletPoints: [
      'Easy to Disguise: Attackers spoof domains via misleading subdomains, typosquatting (e.g., rn vs m), and obfuscation.',
      'Blacklists Lag Behind: Traditional blacklists require someone to fall victim and report the URL first.',
      'Zero-Day Vulnerability: Over 60% of phishing domains exist for under 24 hours to evade blacklists.',
      'Devastating Impact: A single compromised credential can cause enterprise data breaches or personal financial ruin.'
    ],
    spokenScript: `The first problem is that phishing URLs are easy to disguise. Attackers may create website addresses that look similar to trusted websites.

The second problem is that traditional blacklist-based systems depend on identifying and reporting malicious links. New phishing URLs may not be detected immediately.

The third problem is the impact on users. A single phishing attack can result in stolen credentials, financial losses, and data breaches.

Therefore, we need a system that analyzes the characteristics of a URL instead of depending only on previously reported malicious links.

However, a machine learning prediction is not a guarantee of safety. Users should still verify the website before entering sensitive information.`,
    transitionCue: 'Transition: "Now, let us examine how PhishLens proposes to solve these challenges."',
    keyTakeaway: 'Blacklists react to yesterday\'s threats; feature-based ML detects today\'s newly created copycats.',
    technicalHighlights: [
      { label: 'Blacklist Latency', value: 'Hours to Days', desc: 'Leaves a massive window of exposure' },
      { label: 'Typosquatting Risk', value: 'rn vs m / paypaI', desc: 'Visual deception fools human eyes' },
      { label: 'Safety Disclaimer', value: 'Probabilistic', desc: 'ML offers risk estimation, not absolute guarantee' }
    ],
    anticipatedQuestion: {
      question: 'Why can\'t we just update blacklists faster using an automated crawler?',
      answer: 'Attackers create thousands of algorithmic domains dynamically per hour. Crawlers cannot index unlinked private links sent directly via private messages or SMS.'
    }
  },
  {
    id: 3,
    title: 'Proposed Solution: The 4-Stage PhishLens Pipeline',
    subtitle: 'From Raw Link Input to Explainable Risk Score in Milliseconds',
    purpose: 'Walk the faculty through the end-to-end user and data flow architecture.',
    visualTheme: 'Linear Architecture Pipeline Flowchart (Input -> Extract -> ML Predict -> Output)',
    bulletPoints: [
      'Step 1 (URL Input): User safely submits suspicious link without opening or executing it in a browser.',
      'Step 2 (Feature Extraction): Engine extracts lexical, structural, statistical entropy, and domain markers.',
      'Step 3 (ML Classifier): Pre-trained model estimates probability based on learned benign vs phishing patterns.',
      'Step 4 (Result & Reasons): User receives a clear risk label, probability score, and plain-English signals.'
    ],
    spokenScript: `Our proposed solution is a lightweight web application that analyzes a submitted URL and provides a risk assessment.

First, the user enters a URL. Next, the system extracts important features from the URL and its domain.

These features are then passed to a machine learning classifier, which predicts the potential phishing risk.

Finally, the application displays the result along with a score and understandable reasons.

If the URL is classified as higher risk, the application warns the user not to enter passwords or payment details. If it is classified as lower risk, the application still advises the user to verify the website.

The main advantage is that the user receives both a prediction and an explanation.`,
    transitionCue: 'Transition: "Let us look deeper into the specific features PhishLens extracts from a URL."',
    keyTakeaway: 'Explainability builds user trust—telling users WHY a link is risky empowers safer digital habits.',
    technicalHighlights: [
      { label: 'Execution Safety', value: 'Zero-Browse', desc: 'URL is parsed mathematically, never executed' },
      { label: 'Response Latency', value: '< 200 ms', desc: 'Instantaneous client/server feature computation' },
      { label: 'Output Dual-Band', value: 'Score + Reasons', desc: 'Empowers technical and non-technical users alike' }
    ],
    anticipatedQuestion: {
      question: 'Does the application visit the website to scrape HTML content?',
      answer: 'In the baseline URL checker, PhishLens performs static URL analysis without navigating to the page. This prevents user machine infection and ensures lightning-fast evaluation.'
    }
  },
  {
    id: 4,
    title: 'Key Detection Features: The Four Feature Pillars',
    subtitle: 'Extracting High-Discrimination Signals from URL Anatomy',
    purpose: 'Provide rigorous technical proof of what features are extracted and why they matter.',
    visualTheme: 'Interactive Matrix of 4 Feature Categories with Concrete IP/Domain Examples',
    bulletPoints: [
      '1. Lexical Features: Total length, digit count/ratio, hyphen count, @ symbol, authentication keywords (login, verify).',
      '2. Structural Features: Subdomain depth, raw IPv4/IPv6 hosts, non-standard ports, path and query complexity.',
      '3. Shannon Entropy: Mathematical randomness measure H(X) = -Σ P(x) log2 P(x); spots algorithmic domain generation.',
      '4. Domain Context: TLD abuse rates (.xyz, .tk), domain registration age, WHOIS availability.'
    ],
    spokenScript: `In our project, we consider four major categories of detection features.

The first is lexical analysis, where we examine the URL's length, digits, special characters, and suspicious words.

The second is structural analysis, where we inspect subdomains, IP-address hosts, ports, and URL complexity.

The third is entropy, which helps measure how random or unpredictable the URL's characters appear.

The fourth is domain context, which can include domain age and registration information when reliable data is available.

By combining these different feature categories, the system can make a more informed prediction. No single feature is enough to prove that a URL is malicious.`,
    transitionCue: 'Transition: "Now, let us examine our technical engineering approach and ML methodology."',
    keyTakeaway: 'No single feature is definitive; phishing detection relies on the ensemble confluence of signals.',
    technicalHighlights: [
      { label: 'Shannon Entropy', value: 'H(X) bits/char', desc: 'Detects DGA (Domain Generation Algorithms)' },
      { label: 'Subdomain Spoofing', value: 'e.g. paypal.com.evil.xyz', desc: 'Exploits right-to-left host parsing' },
      { label: 'Raw IP Host', value: 'http://192.0.2.10/...', desc: 'Common bypass for DNS-based filtering' }
    ],
    anticipatedQuestion: {
      question: 'What is Shannon Entropy and how does it detect phishing?',
      answer: 'Shannon entropy quantifies the information density and randomness of characters. Legitimate brand names use predictable words (lower entropy), whereas malware/DGA links use random character strings (high entropy).'
    }
  },
  {
    id: 5,
    title: 'Technical Approach: Data Science & ML Lifecycle',
    subtitle: 'From Data Cleaning to Model Comparison and Metric Evaluation',
    purpose: 'Demonstrate rigorous software and ML engineering methodology to the faculty.',
    visualTheme: '4-Phase Development Lifecycle with Model Comparison Table',
    bulletPoints: [
      'Phase 01 Data Collection: Sourcing labeled benign & phishing URLs (e.g., PhishTank, Alexa/Tranco top sites).',
      'Phase 02 Preprocessing & Leakage Prevention: Deduplication, protocol stripping, strict train/test separation.',
      'Phase 03 Model Comparison: Benchmarking Logistic Regression, Random Forest, and Gradient Boosting.',
      'Phase 04 Evaluation Metrics: Prioritizing Precision, Recall, F1-Score, PR-AUC, and low False-Positive Rate.'
    ],
    spokenScript: `Our technical approach consists of four stages.

First, we collect a dataset containing labeled benign and phishing URLs. We remove duplicate records and separate the training and testing data carefully to avoid data leakage.

Second, we extract relevant lexical and structural features. Domain-age information can also be included when it is available and reliable.

Third, we train and compare machine learning algorithms such as Logistic Regression and Random Forest. We select a suitable model based on its performance.

Finally, we evaluate the model using precision, recall, F1-score, PR-AUC, and false-positive rate. We can then integrate the model with a web interface using Flask or Streamlit.

This process helps us build a system whose performance can be measured rather than relying only on assumptions.`,
    transitionCue: 'Transition: "Let us discuss what makes PhishLens innovative and practically feasible."',
    keyTakeaway: 'Rigorous data hygiene (preventing train/test leakage) is paramount for truthful evaluation.',
    technicalHighlights: [
      { label: 'Primary Algorithm', value: 'Random Forest', desc: 'Handles non-linear feature interactions without overfitting' },
      { label: 'Key Metric Focus', value: 'Precision & FP Rate', desc: 'Users abandon systems with frequent false alarms' },
      { label: 'Web Integration', value: 'Flask / REST API', desc: 'Lightweight serving with fast response times' }
    ],
    anticipatedQuestion: {
      question: 'Why do we compare multiple algorithms instead of picking one right away?',
      answer: 'Different algorithms learn boundaries differently. Linear models like Logistic Regression are fast and interpretable, while tree ensembles like Random Forest capture complex interactions. Comparing them on the same unseen test split proves which performs best.'
    }
  },
  {
    id: 6,
    title: 'Innovation, Feasibility & Security Safeguards',
    subtitle: 'Practical Differentiation, Implementation Realism, and Ethical Defenses',
    purpose: 'Show the project is realistic to execute while highlighting ethical cybersecurity safeguards.',
    visualTheme: 'Triad of Innovation & Security Shield Safeguards',
    bulletPoints: [
      'Multi-Modal Feature Fusion: Combines lexical, structural, and entropy signals with domain reputation.',
      'Plain-Language Explainability: Translates numerical feature vectors into human-readable warnings.',
      'Zero-Day Pattern Detection: Flags newly registered variations before security vendors index them.',
      'Essential Safeguards: Strict privacy (no logging sensitive params), safe sandboxed handling, rate limiting.'
    ],
    spokenScript: `The innovation in PhishLens comes from combining multiple detection features and providing understandable explanations instead of showing only a classification label.

The system can potentially identify previously unseen phishing URLs when they contain patterns that the trained model recognizes.

The project is feasible because we can use Python, open-source machine learning libraries, and publicly available datasets to develop a prototype.

In the future, we can extend it with batch URL scanning, APIs, and browser or email integration.

We also consider privacy and security by avoiding unnecessary storage of submitted URLs, preventing unsafe automatic navigation, and limiting excessive requests.`,
    transitionCue: 'Transition: "Now, let us explore the expected real-world impact and future roadmap."',
    keyTakeaway: 'Safety by design: analyze links without exposing users to malware payloads or logging PII.',
    technicalHighlights: [
      { label: 'Privacy Defense', value: 'Zero Credential Store', desc: 'Tokens & passwords in query strings are purged' },
      { label: 'Rate Limiting', value: 'Abuse Mitigation', desc: 'Protects backend from automated denial of service' },
      { label: 'Explainability', value: 'Actionable Guidance', desc: 'Tells the user exactly what to avoid' }
    ],
    anticipatedQuestion: {
      question: 'Can attackers fool PhishLens by crafting clean-looking short URLs?',
      answer: 'Attackers frequently use URL shorteners, but structural analysis flags redirects and shortener domains, alerting the user to expand and inspect the true target destination.'
    }
  },
  {
    id: 7,
    title: 'Expected Impact & Scalability Roadmap',
    subtitle: 'From a Proof-of-Concept URL Checker to Universal Protection Infrastructure',
    purpose: 'Illustrate real-world social impact and progressive phases of engineering growth.',
    visualTheme: 'Three-Stage Phased Roadmap with User Impact Pillars',
    bulletPoints: [
      'Pillar 1 - Safer Clicks: Immediate protection against credential theft and financial banking fraud.',
      'Pillar 2 - Less Friction: No security jargon; clear visual confidence indicators and guidance.',
      'Pillar 3 - Tunable Thresholds: Flexible decision thresholds depending on enterprise security posture.',
      'Roadmap Horizon: Stage 1 Single Checker -> Stage 2 Batch & API -> Stage 3 Browser & Email Extension.'
    ],
    spokenScript: `The expected impact of PhishLens is to help users make safer decisions when they receive suspicious links.

It aims to provide fast results with clear explanations, making the system easier to understand and use.

We will measure its quality using precision, recall, response time, and the rate of false alarms.

Our future roadmap starts with a basic URL checker. Then we plan to introduce batch scanning and an API. In the long term, we can explore browser extensions and email integration.

These improvements can make PhishLens more useful across different applications and user groups.`,
    transitionCue: 'Transition: "Finally, let us summarize our work and conclude our presentation."',
    keyTakeaway: 'Security software must be frictionless—if a tool is too slow or confusing, users bypass it.',
    technicalHighlights: [
      { label: 'Phase 1 (Current)', value: 'Interactive Web Tool', desc: 'Single URL analysis & feature extraction' },
      { label: 'Phase 2 (Next)', value: 'Batch Scanning & API', desc: 'Allows enterprise log inspection' },
      { label: 'Phase 3 (Long-Term)', value: 'Browser & Mail Plug-in', desc: 'Automatic link scanning on click/hover' }
    ],
    anticipatedQuestion: {
      question: 'How will you balance precision and recall in enterprise deployment?',
      answer: 'By adjusting the model\'s classification threshold. For banking or high-security environments, we prioritize high recall (catch every threat). For everyday consumer browsing, we maintain balanced precision to avoid alarm fatigue.'
    }
  },
  {
    id: 8,
    title: 'Conclusion & Defense Summary',
    subtitle: 'Synthesizing the Core Contributions of PhishLens',
    purpose: 'Deliver a crisp, memorable conclusion and confidently transition to the Viva Voce defense.',
    visualTheme: 'Project Synthesis Shield with Core Pillars Checklist',
    bulletPoints: [
      'Proactive Defense: Addresses the fundamental latency bottleneck of static URL blacklists.',
      'Multi-Signal Strength: Blends lexical heuristics, structural parsing, Shannon entropy, and domain markers.',
      'Explainable AI: Demystifies threat scores with clear, user-friendly language.',
      'Honest Engineering: Acknowledges probabilistic boundaries—ML is an advisor, not an infallible shield.'
    ],
    spokenScript: `To conclude, PhishLens is a machine-learning-based approach to malicious URL detection.

It combines URL patterns, structural characteristics, and domain context to estimate phishing risk.

Its main strengths are detection, explainability, and scalability. It aims not only to classify suspicious links but also to explain why they may be dangerous.

With proper testing and future improvements, PhishLens can serve as an additional layer of protection against phishing attacks.

Thank you for your valuable time and attention. We are happy to answer your questions.`,
    transitionCue: 'Concluding cue: "We are now ready for faculty questions."',
    keyTakeaway: 'PhishLens serves as an intelligent safety lens—empowering users to make informed, safe clicks.',
    technicalHighlights: [
      { label: 'Final Verdict', value: 'Feasible & Scalable', desc: 'Grounded in standard open-source Python stack' },
      { label: 'Core Motto', value: 'Detect & Explain', desc: 'Classification without explanation is incomplete' },
      { label: 'Defense Ready', value: 'All 15 Q&As Prepared', desc: 'Theory, math, metrics, and architecture' }
    ],
    anticipatedQuestion: {
      question: 'What is the single most important lesson from this project?',
      answer: 'That cybersecurity is an arms race; attackers continuously disguise links, so models must rely on fundamental invariant signals like entropy, structural anomalies, and domain context rather than static keywords.'
    }
  }
];

export const VIVA_QUESTIONS: VivaQuestion[] = [
  {
    id: 1,
    question: 'What is PhishLens?',
    answer: 'PhishLens is a proposed web-based malicious URL detection system that analyzes URL characteristics and uses machine learning to estimate phishing risk, providing both a probability score and understandable reasons for the verdict.',
    category: 'Fundamentals',
    practicalTip: 'Keep it to 2 crisp sentences. Emphasize "features + machine learning + explainability".',
    tags: ['Overview', 'Definition']
  },
  {
    id: 2,
    question: 'What is phishing?',
    answer: 'Phishing is a social engineering cyberattack in which attackers impersonate trusted organizations or people to trick users into revealing sensitive information such as passwords, financial credentials, or personal identity details.',
    category: 'Fundamentals',
    practicalTip: 'Mention "social engineering" and "credential harvesting"—faculty love standard security taxonomy.',
    tags: ['Threat Model', 'Security']
  },
  {
    id: 3,
    question: 'What is a URL?',
    answer: 'URL stands for Uniform Resource Locator. It is the standardized global address used to identify and locate a specific resource (webpage, file, or service) on the internet, typically composed of a protocol, domain/host, port, path, and query parameters.',
    category: 'Fundamentals',
    practicalTip: 'Recall the anatomy: Protocol (https) + Hostname + Path + Query parameters.',
    tags: ['Networking', 'Web Basics']
  },
  {
    id: 4,
    question: 'Why not use only a blacklist?',
    answer: 'A blacklist contains only previously identified and reported malicious URLs. Newly created phishing links (zero-day URLs) may not be listed yet because blacklists have a reporting delay. Feature-based machine learning can detect suspicious patterns in brand-new URLs without prior reporting.',
    category: 'Fundamentals',
    practicalTip: 'Use the phrase "blacklist lag" and emphasize that most phishing domains exist for under 24 hours.',
    tags: ['Architecture', 'Blacklists']
  },
  {
    id: 5,
    question: 'Why do we need machine learning?',
    answer: 'Machine learning can automatically learn complex, multi-dimensional patterns from thousands of labeled benign and malicious examples. Unlike rigid static rules, ML can generalize and combine subtle, non-linear signals (such as entropy + subdomain depth + character counts) to identify novel threats.',
    category: 'Machine Learning',
    practicalTip: 'Contrast ML with rigid "if-else" rules: rules break when attackers change one character; ML generalizes.',
    tags: ['ML Rationale', 'Algorithms']
  },
  {
    id: 6,
    question: 'What is feature extraction?',
    answer: 'Feature extraction is the process of converting raw input data (here, a URL string) into a structured vector of numerical values that machine learning models can compute—such as string length, digit ratio, symbol frequencies, and Shannon entropy.',
    category: 'Machine Learning',
    practicalTip: 'Give 2 concrete examples: "counting hyphens" and "measuring character entropy".',
    tags: ['Feature Engineering', 'Data']
  },
  {
    id: 7,
    question: 'Why use Random Forest?',
    answer: 'Random Forest is an ensemble learning method that combines predictions from multiple decision trees. It is resistant to overfitting, handles non-linear feature interactions exceptionally well, operates efficiently on tabular URL features, and provides built-in feature importance rankings.',
    category: 'Machine Learning',
    practicalTip: 'Mention that it aggregates diverse trees (bagging), reducing variance compared to a single decision tree.',
    tags: ['Random Forest', 'Ensemble']
  },
  {
    id: 8,
    question: 'What is the difference between precision and recall?',
    answer: 'Precision measures how many of the URLs flagged as phishing are actually phishing (low precision means too many false alarms). Recall measures how many of all actual phishing URLs were successfully caught by the system (low recall means malicious links slipped through).',
    category: 'Evaluation & Metrics',
    practicalTip: 'Precision = TP / (TP + FP). Recall = TP / (TP + FN). High precision preserves user trust.',
    tags: ['Metrics', 'Precision', 'Recall']
  },
  {
    id: 9,
    question: 'What is a false positive?',
    answer: 'A false positive occurs when the system incorrectly classifies a benign, safe URL as malicious. In cybersecurity, too many false positives lead to alert fatigue, causing users to ignore or disable the security tool.',
    category: 'Evaluation & Metrics',
    practicalTip: 'Give an example: Flagging a university login portal or banking reset link by mistake.',
    tags: ['False Positives', 'User Experience']
  },
  {
    id: 10,
    question: 'Can PhishLens guarantee that a website is safe?',
    answer: 'No. Machine learning makes probabilistic predictions based on learned patterns; it is not an absolute guarantee of safety. Attackers can create novel evasion techniques, so PhishLens advises users to remain vigilant even when a URL receives a low risk score.',
    category: 'Fundamentals',
    practicalTip: 'Faculty respect this answer immensely! Never claim 100% accuracy in security defense.',
    tags: ['Honest Defense', 'Limitations']
  },
  {
    id: 11,
    question: 'Which technologies are proposed?',
    answer: 'The proposed stack comprises Python for data processing, pandas for tabular feature manipulation, scikit-learn for training and evaluating ML models, and Flask or Streamlit for creating the lightweight web user interface, with optional domain WHOIS API integration.',
    category: 'Project Scope',
    practicalTip: 'Clarify clearly: "Python + pandas + scikit-learn + Flask/Streamlit web framework".',
    tags: ['Tech Stack', 'Implementation']
  },
  {
    id: 12,
    question: 'What is the future scope?',
    answer: 'Future improvements include batch URL scanning for enterprise log analysis, a public REST API for third-party integration, a real-time browser extension that scans links upon hovering, and email gateway integration to inspect incoming inbox links.',
    category: 'Project Scope',
    practicalTip: 'Frame it as a 3-tier roadmap: Batch scanning -> Browser Extension -> Email Gateway.',
    tags: ['Roadmap', 'Future Scope']
  },
  {
    id: 13,
    question: 'How do you evaluate the model?',
    answer: 'We evaluate the model using multiple complementary metrics: Precision, Recall, F1-Score (harmonic mean of precision and recall), False Positive Rate, and PR-AUC (Precision-Recall Area Under Curve), tested on a strictly held-out test dataset with zero data leakage.',
    category: 'Evaluation & Metrics',
    practicalTip: 'Emphasize PR-AUC because phishing datasets are often class-imbalanced.',
    tags: ['Model Evaluation', 'F1-Score']
  },
  {
    id: 14,
    question: 'What is entropy in this project?',
    answer: 'Entropy refers to Shannon Entropy, which measures the unpredictability and randomness of characters in the URL string. Legitimate domains usually contain readable natural words (lower entropy), while algorithmic phishing or malware URLs often use randomized character sequences (high entropy).',
    category: 'Machine Learning',
    practicalTip: 'State the formula if asked: H(X) = -sum(P(x) * log2(P(x))). Mention bits of information per character.',
    tags: ['Entropy', 'Mathematics']
  },
  {
    id: 15,
    question: 'What is the main innovation of PhishLens?',
    answer: 'The primary innovation is combining multi-dimensional feature analysis (lexical, structural, entropy, and domain context) with human-understandable explainability—explaining to the user in plain language exactly why a link is risky rather than providing an opaque black-box label.',
    category: 'Project Scope',
    practicalTip: 'Highlight the phrase "Explainable AI for end-user protection".',
    tags: ['Innovation', 'Explainability']
  }
];

export const TECHNICAL_TERMS: TechnicalTerm[] = [
  {
    term: 'Dataset',
    simpleMeaning: 'A structured collection of example URLs alongside their confirmed ground-truth labels (0 for benign, 1 for phishing).',
    presentationExample: 'Our training dataset contains verified links from PhishTank and the Tranco top list.',
    category: 'Data Concept'
  },
  {
    term: 'pandas',
    simpleMeaning: 'A popular Python data science library designed for manipulating tabular data, calculating statistics, and transforming columns.',
    presentationExample: 'We use pandas to store extracted URL feature vectors and clean duplicate records.',
    category: 'Framework'
  },
  {
    term: 'scikit-learn',
    simpleMeaning: 'The premier open-source Python library providing standardized machine learning algorithms, preprocessing tools, and evaluation metrics.',
    presentationExample: 'We train our classifier using scikit-learn\'s RandomForestClassifier and compute classification reports.',
    category: 'Framework'
  },
  {
    term: 'Logistic Regression',
    simpleMeaning: 'A statistical classification model that estimates the probability of an outcome using a mathematical sigmoid function.',
    presentationExample: 'Logistic Regression provides an interpretable baseline model with linear decision boundaries.',
    category: 'ML Algorithm'
  },
  {
    term: 'Random Forest',
    simpleMeaning: 'An ensemble learning method that builds numerous decision trees and merges their votes to produce a more accurate and stable prediction.',
    presentationExample: 'Random Forest effectively captures non-linear relationships between URL length and keyword occurrences.',
    category: 'ML Algorithm'
  },
  {
    term: 'Flask / Streamlit',
    simpleMeaning: 'Python frameworks used to quickly turn machine learning models into interactive web applications and REST API endpoints.',
    presentationExample: 'Flask allows us to expose an endpoint where users or browser extensions can POST a URL and receive JSON risk analysis.',
    category: 'Framework'
  },
  {
    term: 'Precision',
    simpleMeaning: 'The proportion of positive identifications that were actually correct: TP / (TP + FP).',
    presentationExample: 'Out of 100 links PhishLens flagged as phishing, 96 actually were malicious (96% precision).',
    category: 'Metric'
  },
  {
    term: 'Recall',
    simpleMeaning: 'The proportion of actual positives that were identified correctly: TP / (TP + FN).',
    presentationExample: 'Out of 100 actual phishing links tested, our model caught 92 of them (92% recall).',
    category: 'Metric'
  },
  {
    term: 'F1-score',
    simpleMeaning: 'The harmonic mean of precision and recall: 2 * (Precision * Recall) / (Precision + Recall).',
    presentationExample: 'F1-score balances precision and recall into a single representative performance figure.',
    category: 'Metric'
  },
  {
    term: 'False-positive rate',
    simpleMeaning: 'The frequency at which legitimate, safe URLs are incorrectly flagged as malicious: FP / (FP + TN).',
    presentationExample: 'A low false-positive rate prevents users from getting annoyed by false alarms on safe portals.',
    category: 'Metric'
  },
  {
    term: 'PR-AUC',
    simpleMeaning: 'Precision-Recall Area Under the Curve, summarizing the trade-off across every possible classification decision threshold.',
    presentationExample: 'PR-AUC is the gold standard for measuring classifier quality on imbalanced cybersecurity datasets.',
    category: 'Metric'
  },
  {
    term: 'Shannon Entropy',
    simpleMeaning: 'A mathematical measure of the randomness, chaos, or unpredictability of characters in a string.',
    presentationExample: 'High entropy indicates randomly generated domain names often generated by malware bots.',
    category: 'Data Concept'
  }
];

export const SAMPLE_URLS = [
  {
    label: 'Fictional IP Phishing (From Slide 4)',
    url: 'http://192.0.2.10/login/verify-account',
    type: 'High Risk'
  },
  {
    label: 'PayPal Copycat / Subdomain Spoof',
    url: 'http://paypal.com.verify-billing-account.xyz/signin',
    type: 'High Risk'
  },
  {
    label: 'High-Entropy Botnet / Obfuscated Link',
    url: 'http://chase-bank-alert.co/x89f2a7b9c?token=q4982k3j&session=90a8sdf76',
    type: 'High Risk'
  },
  {
    label: 'Credential Harvester with @ Symbol',
    url: 'http://legitimate-service.com@malicious-harvest-node.top/auth',
    type: 'High Risk'
  },
  {
    label: 'Legitimate Standard Brand URL',
    url: 'https://www.paypal.com/signin',
    type: 'Benign'
  },
  {
    label: 'Legitimate Tech Documentation Portal',
    url: 'https://github.com/scikit-learn/scikit-learn',
    type: 'Benign'
  }
];

export const PRESENTATION_TIPS = [
  {
    title: 'Start Confidently with the Problem',
    advice: 'Do not jump straight into code or machine learning libraries. Introduce the human problem first: everyday users receiving deceptively crafted links on messaging apps and email.'
  },
  {
    title: 'Explain in Your Own Words',
    advice: 'Understand the pipeline flow (URL Input → Feature Extraction → Machine Learning → Result) instead of trying to memorize every line of the script.'
  },
  {
    title: 'Never Claim 100% Accuracy',
    advice: 'Faculty will immediately challenge any claim of perfection. Always state that PhishLens is a probabilistic risk estimator that complements user vigilance and security hygiene.'
  },
  {
    title: 'Be Honest About Implementation Stage',
    advice: 'Your PPT presents a proposed architecture and prototype design. If asked about production database scale or active server deployments, explain that the core ML pipeline is the current focus and enterprise scaling is on the future roadmap.'
  },
  {
    title: 'Master the Metric Trade-offs',
    advice: 'Know why precision and recall matter: In security, high recall catches threats, but low precision causes alert fatigue. Be ready to explain this balance.'
  }
];
