import React, { useState, useMemo } from 'react';
import { analyzeUrl, calculateShannonEntropy } from '../utils/urlAnalyzer';
import { SAMPLE_URLS } from '../data/presentationData';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Search,
  Code2,
  Terminal,
  Activity,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

interface UrlFeatureLabProps {
  initialUrl?: string;
}

export const UrlFeatureLab: React.FC<UrlFeatureLabProps> = ({
  initialUrl = 'http://192.0.2.10/login/verify-account',
}) => {
  const [inputUrl, setInputUrl] = useState<string>(initialUrl);
  const [selectedSample, setSelectedSample] = useState<string>(initialUrl);

  const analysis = useMemo(() => {
    return analyzeUrl(inputUrl || 'http://example.com');
  }, [inputUrl]);

  const handleSelectSample = (sampleUrl: string) => {
    setInputUrl(sampleUrl);
    setSelectedSample(sampleUrl);
  };

  const getVerdictColor = (verdict: string) => {
    if (verdict.includes('High Risk')) {
      return {
        bg: 'bg-rose-50',
        border: 'border-rose-200',
        text: 'text-rose-700',
        badge: 'bg-rose-600 text-white',
        icon: <ShieldAlert className="w-5 h-5 text-rose-600" />,
      };
    }
    if (verdict.includes('Suspicious')) {
      return {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        text: 'text-amber-700',
        badge: 'bg-amber-600 text-white',
        icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
      };
    }
    return {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
      badge: 'bg-emerald-600 text-white',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
    };
  };

  const verdictStyle = getVerdictColor(analysis.mlPrediction.verdict);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Title & Introduction */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Live Feature Extraction & ML Risk Lab
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Interactive demo simulating the 4 PhishLens detection pillars (Lexical, Structural, Shannon Entropy, Domain Context) on real and synthetic URLs.
        </p>
      </div>

      {/* URL Input & Presets Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        {/* Sample URL quick picks */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Quick Select Presentation URLs:
          </label>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_URLS.map(sample => (
              <button
                key={sample.url}
                onClick={() => handleSelectSample(sample.url)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                  inputUrl === sample.url
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input bar */}
        <div className="space-y-1.5">
          <label htmlFor="url-input" className="text-xs font-semibold text-slate-700">
            Paste or edit any URL string to inspect:
          </label>
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
            <input
              id="url-input"
              type="text"
              value={inputUrl}
              onChange={e => setInputUrl(e.target.value)}
              placeholder="e.g. http://192.0.2.10/login/verify-account"
              className="w-full pl-10 pr-4 py-2.5 text-sm font-mono bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500 text-slate-900 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Primary ML Verdict & Plain-Language Reasons (Stage 3 & 4 of Pipeline) */}
      <div className={`p-6 rounded-2xl border ${verdictStyle.border} ${verdictStyle.bg} shadow-xs space-y-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white rounded-xl shadow-2xs">
              {verdictStyle.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${verdictStyle.badge}`}>
                  {analysis.mlPrediction.verdict}
                </span>
                <span className="text-xs font-mono text-slate-500">
                  Risk Probability: {(analysis.mlPrediction.phishingProbability * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-xs font-medium text-slate-600 mt-1">
                {analysis.mlPrediction.userAdvice}
              </p>
            </div>
          </div>

          {/* Model comparison gauges */}
          <div className="flex items-center gap-4 bg-white/80 backdrop-blur-xs px-4 py-2 rounded-xl border border-slate-200/60 shrink-0">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Random Forest</span>
              <span className="text-xs font-bold text-slate-800 font-mono">
                {(analysis.mlPrediction.modelComparison.randomForestScore * 100).toFixed(0)}%
              </span>
            </div>
            <div className="w-px h-6 bg-slate-200" />
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Logistic Reg.</span>
              <span className="text-xs font-bold text-slate-800 font-mono">
                {(analysis.mlPrediction.modelComparison.logisticRegressionScore * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Explainability Engine: Plain Language Reasons */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 space-y-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-sky-600" />
            Explainable Detection Signals (Why This Link Received This Score):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {analysis.mlPrediction.plainLanguageReasons.map((reason, idx) => (
              <div key={idx} className="flex items-start gap-2 text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0 mt-1.5" />
                <span className="leading-relaxed">{reason}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* The 4 Feature Extraction Pillars (Slide 4 Technical Breakdown) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Pillar 1: Lexical Features */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <span className="text-[11px] font-mono font-semibold text-sky-600 uppercase tracking-wider block">
              Pillar 01
            </span>
            <h3 className="text-sm font-bold text-slate-900">Lexical Features</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <span className="text-slate-500">Total Length:</span>
              <span className="font-mono font-semibold text-slate-800">
                {analysis.lexical.length} chars
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <span className="text-slate-500">Digits / Ratio:</span>
              <span className="font-mono font-semibold text-slate-800">
                {analysis.lexical.digitCount} ({(analysis.lexical.digitRatio * 100).toFixed(1)}%)
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <span className="text-slate-500">Hyphen Count:</span>
              <span className={`font-mono font-semibold ${analysis.lexical.hyphenCount >= 2 ? 'text-amber-600' : 'text-slate-800'}`}>
                {analysis.lexical.hyphenCount}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <span className="text-slate-500">Contains '@' Symbol:</span>
              <span className={`font-mono font-semibold ${analysis.lexical.hasAtSymbol ? 'text-rose-600' : 'text-emerald-600'}`}>
                {analysis.lexical.hasAtSymbol ? 'Yes (Deceptive)' : 'No'}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block mb-1">Keywords Detected:</span>
              {analysis.lexical.suspiciousKeywordsFound.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {analysis.lexical.suspiciousKeywordsFound.map(kw => (
                    <span key={kw} className="font-mono text-[11px] bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded">
                      {kw}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-slate-400 italic">None found</span>
              )}
            </div>
          </div>
        </div>

        {/* Pillar 2: Structural Features */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <span className="text-[11px] font-mono font-semibold text-indigo-600 uppercase tracking-wider block">
              Pillar 02
            </span>
            <h3 className="text-sm font-bold text-slate-900">Structural Features</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <span className="text-slate-500">Host Type:</span>
              <span className={`font-mono font-semibold ${analysis.structural.isIpAddress ? 'text-rose-600 font-bold' : 'text-slate-800'}`}>
                {analysis.structural.isIpAddress ? 'Raw IPv4 Address' : 'Standard Hostname'}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <span className="text-slate-500">Subdomain Depth:</span>
              <span className={`font-mono font-semibold ${analysis.structural.subdomainCount >= 2 ? 'text-amber-600' : 'text-slate-800'}`}>
                {analysis.structural.subdomainCount} levels
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <span className="text-slate-500">Protocol:</span>
              <span className={`font-mono font-semibold ${analysis.protocol === 'http' ? 'text-amber-600' : 'text-emerald-600'}`}>
                {analysis.protocol.toUpperCase()}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <span className="text-slate-500">Path Depth:</span>
              <span className="font-mono font-semibold text-slate-800">
                {analysis.structural.pathDepth} segments
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <span className="text-slate-500">Port Anomaly:</span>
              <span className={`font-mono font-semibold ${analysis.structural.hasNonStandardPort ? 'text-rose-600' : 'text-slate-800'}`}>
                {analysis.structural.hasNonStandardPort ? `Port ${analysis.structural.portNumber}` : 'Standard (80/443)'}
              </span>
            </div>
          </div>
        </div>

        {/* Pillar 3: Shannon Entropy */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <span className="text-[11px] font-mono font-semibold text-emerald-600 uppercase tracking-wider block">
              Pillar 03
            </span>
            <h3 className="text-sm font-bold text-slate-900">Shannon Entropy H(X)</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
              <div className="text-[11px] text-slate-500 font-mono">Shannon Randomness:</div>
              <div className="text-xl font-bold font-mono text-slate-900">
                {analysis.entropy.shannonEntropy} <span className="text-xs font-normal text-slate-500">bits/char</span>
              </div>
              <div className="text-[11px] font-semibold text-sky-700">
                Assessment: {analysis.entropy.entropyAssessment}
              </div>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <span className="text-slate-500">Character Diversity:</span>
              <span className="font-mono font-semibold text-slate-800">
                {(analysis.entropy.characterDiversity * 100).toFixed(1)}%
              </span>
            </div>

            <div className="text-[11px] text-slate-500 leading-relaxed">
              Formula: <span className="font-mono text-slate-700">H(X) = -Σ P(x) log₂ P(x)</span>. Random botnet domains have high entropy; human-readable words have lower entropy.
            </div>
          </div>
        </div>

        {/* Pillar 4: Domain Context */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <span className="text-[11px] font-mono font-semibold text-purple-600 uppercase tracking-wider block">
              Pillar 04
            </span>
            <h3 className="text-sm font-bold text-slate-900">Domain Context</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <span className="text-slate-500">TLD Extracted:</span>
              <span className="font-mono font-semibold text-slate-800">
                {analysis.domainContext.tld || 'N/A (Raw IP)'}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <span className="text-slate-500">TLD Risk Rating:</span>
              <span className={`font-mono font-semibold ${analysis.domainContext.tldRisk === 'High Risk' ? 'text-rose-600' : analysis.domainContext.tldRisk === 'Elevated Risk' ? 'text-amber-600' : 'text-emerald-600'}`}>
                {analysis.domainContext.tldRisk}
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
              <span className="font-semibold text-slate-800 block mb-0.5">WHOIS / Age Assessment:</span>
              {analysis.domainContext.domainAgeNote}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
