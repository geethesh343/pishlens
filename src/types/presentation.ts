export interface Slide {
  id: number;
  title: string;
  subtitle: string;
  purpose: string;
  visualTheme: string;
  bulletPoints: string[];
  spokenScript: string;
  transitionCue: string;
  keyTakeaway: string;
  technicalHighlights: { label: string; value: string; desc: string }[];
  anticipatedQuestion?: {
    question: string;
    answer: string;
  };
}

export interface VivaQuestion {
  id: number;
  question: string;
  answer: string;
  category: 'Fundamentals' | 'Machine Learning' | 'Evaluation & Metrics' | 'Project Scope';
  practicalTip?: string;
  tags: string[];
}

export interface TechnicalTerm {
  term: string;
  simpleMeaning: string;
  presentationExample: string;
  category: 'ML Algorithm' | 'Metric' | 'Framework' | 'Data Concept';
}

export interface UrlAnalysisResult {
  url: string;
  protocol: string;
  hostname: string;
  path: string;
  query: string;
  lexical: {
    length: number;
    digitCount: number;
    digitRatio: number;
    hyphenCount: number;
    hasAtSymbol: boolean;
    suspiciousKeywordsFound: string[];
  };
  structural: {
    subdomainCount: number;
    subdomains: string[];
    isIpAddress: boolean;
    hasNonStandardPort: boolean;
    portNumber?: number;
    pathDepth: number;
  };
  entropy: {
    shannonEntropy: number;
    characterDiversity: number;
    entropyAssessment: 'Low' | 'Moderate' | 'High (Suspiciously Random)';
  };
  domainContext: {
    tld: string;
    tldRisk: 'Standard' | 'Elevated Risk' | 'High Risk';
    domainAgeNote: string;
  };
  mlPrediction: {
    phishingProbability: number;
    verdict: 'Benign (Lower Risk)' | 'Suspicious' | 'High Risk Phishing';
    confidence: number;
    modelComparison: {
      randomForestScore: number;
      logisticRegressionScore: number;
    };
    plainLanguageReasons: string[];
    userAdvice: string;
  };
}
