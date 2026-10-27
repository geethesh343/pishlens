import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Search,
  Loader2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Info,
  Terminal,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { ExtractedFeatures } from '../utils/featureExtraction';

interface PredictionData {
  classification: string;
  risk_score: number;
  probability: number;
  confidence: number;
  classification_threshold: number;
  suspicious_signals: string[];
  reassuring_signals: string[];
  security_recommendation: string;
  features: ExtractedFeatures;
}

interface ScannerViewProps {
  onScanComplete: (url: string, prediction: PredictionData) => void;
  onNavigateToTab: (tab: any) => void;
}

const SAMPLE_URLS = [
  { label: 'IP Address Phishing', url: 'http://192.0.2.10/login/verify-account', type: 'High Risk' },
  { label: 'Subdomain Spoofing', url: 'http://paypal.com.verify-billing-account.xyz/signin', type: 'High Risk' },
  { label: 'Obfuscated Botnet Link', url: 'http://chase-bank-alert.co/x89f2a7b9c?token=q4982k3j', type: 'High Risk' },
  { label: 'Credential Harvest @', url: 'http://legitimate-service.com@malicious-harvest-node.top/auth', type: 'High Risk' },
  { label: 'Legitimate Brand (HTTPS)', url: 'https://www.paypal.com/signin', type: 'Lower Risk' },
  { label: 'Legitimate Tech Portal', url: 'https://github.com/scikit-learn/scikit-learn', type: 'Lower Risk' },
];

export const ScannerView: React.FC<ScannerViewProps> = ({ onScanComplete, onNavigateToTab }) => {
  const [inputUrl, setInputUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<{ url: string; sanitized_url: string; prediction: PredictionData } | null>(null);

  const handleScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputUrl.trim();
    setErrorMessage(null);

    if (!trimmed) {
      setErrorMessage('Please enter a website link to analyze.');
      return;
    }

    if (!/^https?:\/\//i.test(trimmed)) {
      setErrorMessage('Protocol validation failed: The URL must start with http:// or https://');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to complete URL analysis.');
      }

      setResult(data);
      onScanComplete(data.url, data.prediction);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during scanning.');
    } finally {
      setLoading(false);
    }
  };

  const isPhishing = result?.prediction.classification === 'Potentially Phishing';

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Section */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="text-xs uppercase font-mono font-bold tracking-widest text-sky-400 bg-sky-950/60 border border-sky-800/80 px-3 py-1 rounded-full">
          AI-Powered Malicious URL Detection
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Detect. Prevent. Stay Safe.
        </h1>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          PhishLens decomposes URL anatomy into 15 lexical, structural, and Shannon entropy features to detect zero-day phishing links and typosquatting domains before you click.
        </p>
      </div>

      {/* URL Input Form Card */}
      <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl space-y-4">
        <form onSubmit={handleScan} className="space-y-3">
          <label htmlFor="url-input" className="text-xs font-semibold text-slate-300 block">
            Enter URL to analyze (HTTP or HTTPS):
          </label>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                id="url-input"
                type="text"
                value={inputUrl}
                onChange={e => {
                  setInputUrl(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="https://example.com/login or http://192.0.2.10/verify"
                className="w-full pl-10 pr-4 py-3 text-sm font-mono bg-slate-950 border border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500 text-white placeholder-slate-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-xs shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Extracting Features...</span>
                </>
              ) : (
                <span>Analyze Link</span>
              )}
            </button>
          </div>
        </form>

        {/* Validation Error Alert */}
        {errorMessage && (
          <div className="bg-rose-950/40 border border-rose-800/80 rounded-xl p-3 text-xs text-rose-300 flex items-center gap-2">
            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Sample URLs quick select */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-slate-400 uppercase font-mono font-semibold">
            Test Samples:
          </span>
          {SAMPLE_URLS.map(sample => (
            <button
              key={sample.url}
              type="button"
              onClick={() => {
                setInputUrl(sample.url);
                setErrorMessage(null);
              }}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      {/* Prediction Results Display */}
      {result && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div
            className={`rounded-2xl border p-6 sm:p-8 shadow-xl space-y-6 ${
              isPhishing
                ? 'bg-gradient-to-b from-rose-950/40 to-slate-900 border-rose-800/60'
                : 'bg-gradient-to-b from-emerald-950/30 to-slate-900 border-emerald-800/60'
            }`}
          >
            {/* Classification & Risk Score Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                      isPhishing
                        ? 'bg-rose-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {result.prediction.classification}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Confidence: {result.prediction.confidence}%
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white pt-1">
                  {isPhishing
                    ? 'Potentially Malicious / Phishing URL'
                    : 'Lower Risk Link Characteristics'}
                </h2>
                <div className="text-xs font-mono text-slate-300 break-all bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
                  Target: {result.sanitized_url}
                </div>
              </div>

              {/* Large Score Dial */}
              <div className="text-right shrink-0 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <span className="text-[11px] uppercase font-mono text-slate-400 block">
                  Phishing Risk Score
                </span>
                <div className="flex items-baseline justify-end gap-1">
                  <span
                    className={`text-3xl sm:text-4xl font-extrabold font-mono ${
                      isPhishing ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {result.prediction.risk_score}
                  </span>
                  <span className="text-sm font-mono text-slate-500">/ 100</span>
                </div>
              </div>
            </div>

            {/* Visual Risk Meter */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>0 (Nominal / Lower Risk)</span>
                <span>Decision Threshold: {(result.prediction.classification_threshold * 100).toFixed(0)}%</span>
                <span>100 (High Threat)</span>
              </div>
              <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full transition-all duration-500 ${
                    isPhishing ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${result.prediction.risk_score}%` }}
                />
              </div>
            </div>

            {/* Security Recommendation */}
            <div
              className={`p-4 rounded-xl border text-xs sm:text-sm font-medium leading-relaxed ${
                isPhishing
                  ? 'bg-rose-950/50 border-rose-800/80 text-rose-200'
                  : 'bg-emerald-950/40 border-emerald-800/70 text-emerald-200'
              }`}
            >
              <strong>Security Recommendation:</strong> {result.prediction.security_recommendation}
            </div>

            {/* Signals Matrix: Suspicious vs Reassuring */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Suspicious Signals Detected ({result.prediction.suspicious_signals.length})
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {result.prediction.suspicious_signals.length > 0 ? (
                    result.prediction.suspicious_signals.map((sig, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-400">•</span>
                        <span>{sig}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-slate-500 italic">No prominent suspicious features identified.</li>
                  )}
                </ul>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Reassuring Indicators ({result.prediction.reassuring_signals.length})
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {result.prediction.reassuring_signals.length > 0 ? (
                    result.prediction.reassuring_signals.map((sig, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-400">•</span>
                        <span>{sig}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-slate-500 italic">No strong reassuring factors.</li>
                  )}
                </ul>
              </div>
            </div>

            {/* 15 Extracted Features Decomposition Table */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase font-bold text-sky-400 tracking-wider">
                  Real ML Feature Decomposition (15 Features)
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Order matches scikit-learn training vector
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-2 px-3 font-semibold">#</th>
                      <th className="py-2 px-3 font-semibold">Feature Name</th>
                      <th className="py-2 px-3 font-semibold">Extracted Value</th>
                      <th className="py-2 px-3 font-semibold">Cybersecurity Context</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                    <tr>
                      <td className="py-2 px-3 text-slate-500">1</td>
                      <td className="py-2 px-3 text-sky-400">url_length</td>
                      <td className="py-2 px-3 font-bold text-white">{result.prediction.features.url_length}</td>
                      <td className="py-2 px-3 font-sans text-slate-400">Phishing URLs often exceed 75 characters</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-slate-500">2</td>
                      <td className="py-2 px-3 text-sky-400">hostname_length</td>
                      <td className="py-2 px-3 font-bold text-white">{result.prediction.features.hostname_length}</td>
                      <td className="py-2 px-3 font-sans text-slate-400">Host length without path</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-slate-500">3</td>
                      <td className="py-2 px-3 text-sky-400">dot_count</td>
                      <td className="py-2 px-3 font-bold text-white">{result.prediction.features.dot_count}</td>
                      <td className="py-2 px-3 font-sans text-slate-400">Excessive dots indicate deep subdomains</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-slate-500">4</td>
                      <td className="py-2 px-3 text-sky-400">hyphen_count</td>
                      <td className="py-2 px-3 font-bold text-white">{result.prediction.features.hyphen_count}</td>
                      <td className="py-2 px-3 font-sans text-slate-400">Common in typosquatting brand names</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-slate-500">5</td>
                      <td className="py-2 px-3 text-sky-400">digit_count</td>
                      <td className="py-2 px-3 font-bold text-white">{result.prediction.features.digit_count}</td>
                      <td className="py-2 px-3 font-sans text-slate-400">Generated campaign tracking numbers</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-slate-500">6</td>
                      <td className="py-2 px-3 text-sky-400">has_at_symbol</td>
                      <td className="py-2 px-3 font-bold text-white">{result.prediction.features.has_at_symbol ? '1 (Yes)' : '0 (No)'}</td>
                      <td className="py-2 px-3 font-sans text-slate-400">Hides true host prior to @ symbol</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-slate-500">7</td>
                      <td className="py-2 px-3 text-sky-400">subdomain_count</td>
                      <td className="py-2 px-3 font-bold text-white">{result.prediction.features.subdomain_count}</td>
                      <td className="py-2 px-3 font-sans text-slate-400">Multi-level brand spoofing</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-slate-500">8</td>
                      <td className="py-2 px-3 text-sky-400">is_ip_address</td>
                      <td className="py-2 px-3 font-bold text-white">{result.prediction.features.is_ip_address ? '1 (Yes)' : '0 (No)'}</td>
                      <td className="py-2 px-3 font-sans text-slate-400">Bypasses domain registration records</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-slate-500">9</td>
                      <td className="py-2 px-3 text-sky-400">is_https</td>
                      <td className="py-2 px-3 font-bold text-white">{result.prediction.features.is_https ? '1 (Yes)' : '0 (No)'}</td>
                      <td className="py-2 px-3 font-sans text-slate-400">Transport encryption indicator</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-slate-500">10</td>
                      <td className="py-2 px-3 text-sky-400">path_length</td>
                      <td className="py-2 px-3 font-bold text-white">{result.prediction.features.path_length}</td>
                      <td className="py-2 px-3 font-sans text-slate-400">URI path nesting complexity</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-slate-500">11</td>
                      <td className="py-2 px-3 text-sky-400">query_param_count</td>
                      <td className="py-2 px-3 font-bold text-white">{result.prediction.features.query_param_count}</td>
                      <td className="py-2 px-3 font-sans text-slate-400">Arguments forwarding session tokens</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-slate-500">12</td>
                      <td className="py-2 px-3 text-sky-400">suspicious_token_count</td>
                      <td className="py-2 px-3 font-bold text-white">{result.prediction.features.suspicious_token_count}</td>
                      <td className="py-2 px-3 font-sans text-slate-400">Matches: login, verify, banking, etc.</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-slate-500">13</td>
                      <td className="py-2 px-3 text-sky-400">character_entropy</td>
                      <td className="py-2 px-3 font-bold text-white">{result.prediction.features.character_entropy} bits</td>
                      <td className="py-2 px-3 font-sans text-slate-400">Shannon entropy: botnet DGA detection</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-slate-500">14</td>
                      <td className="py-2 px-3 text-sky-400">has_unusual_port</td>
                      <td className="py-2 px-3 font-bold text-white">{result.prediction.features.has_unusual_port ? '1 (Yes)' : '0 (No)'}</td>
                      <td className="py-2 px-3 font-sans text-slate-400">Non-standard port (not 80 or 443)</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-slate-500">15</td>
                      <td className="py-2 px-3 text-sky-400">has_encoded_chars</td>
                      <td className="py-2 px-3 font-bold text-white">{result.prediction.features.has_encoded_chars ? '1 (Yes)' : '0 (No)'}</td>
                      <td className="py-2 px-3 font-sans text-slate-400">Hexadecimal escape sequences (%20, %3d)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Safety & Limitation Disclaimer */}
            <div className="text-[11px] text-slate-500 text-center border-t border-slate-800/80 pt-3">
              Disclaimer: PhishLens generates statistical probability estimates based on extracted URL features. A "Lower Risk" classification does not guarantee absolute safety. Always verify the destination before submitting sensitive credentials.
            </div>
          </div>
        </div>
      )}

      {/* How PhishLens Works (3 Pillars) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-sky-950 border border-sky-800/80 flex items-center justify-center text-sky-400 font-bold">
            01
          </div>
          <h3 className="text-base font-bold text-white">Safe Feature Ingestion</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            PhishLens does not visit or execute submitted URLs. Analysis is performed strictly through mathematical decomposition to prevent malware infection.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-800/80 flex items-center justify-center text-indigo-400 font-bold">
            02
          </div>
          <h3 className="text-base font-bold text-white">Random Forest Classifier</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Our ensemble model evaluates multi-dimensional relationships across 15 features to detect deceptive typosquatting that slips past simple word lists.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800/80 flex items-center justify-center text-emerald-400 font-bold">
            03
          </div>
          <h3 className="text-base font-bold text-white">Explainable Risk Rationale</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Instead of an opaque black-box verdict, PhishLens explains the exact factors (e.g. raw IP host, entropy, subdomain count) so you can make informed decisions.
          </p>
        </div>
      </div>
    </div>
  );
};
