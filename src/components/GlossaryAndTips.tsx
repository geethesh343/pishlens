import React, { useState } from 'react';
import { TECHNICAL_TERMS, PRESENTATION_TIPS } from '../data/presentationData';
import {
  BookOpen,
  Sliders,
  CheckCircle,
  AlertTriangle,
  Printer,
  Copy,
  Check,
  Search,
} from 'lucide-react';

export const GlossaryAndTips: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [threshold, setThreshold] = useState<number>(50); // classification threshold 0 - 100%
  const [copiedCheatSheet, setCopiedCheatSheet] = useState(false);

  const categories = ['All', 'ML Algorithm', 'Metric', 'Framework', 'Data Concept'];

  const filteredTerms = TECHNICAL_TERMS.filter(item => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.simpleMeaning.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Dynamic simulation of Confusion Matrix based on threshold
  // Simulated population of 1000 test URLs (200 Phishing, 800 Benign)
  const totalPhishing = 200;
  const totalBenign = 800;

  // As threshold increases, classifier becomes more conservative:
  // True Positives decrease slightly, False Positives decrease drastically
  const simulatedTP = Math.round(totalPhishing * (1 - (threshold - 10) / 120));
  const boundedTP = Math.max(10, Math.min(simulatedTP, totalPhishing));
  const boundedFN = totalPhishing - boundedTP;

  // False positives drop sharply with higher threshold
  const simulatedFP = Math.round(totalBenign * Math.exp(-threshold / 18));
  const boundedFP = Math.max(2, Math.min(simulatedFP, 300));
  const boundedTN = totalBenign - boundedFP;

  const precision = parseFloat((boundedTP / (boundedTP + boundedFP)).toFixed(3));
  const recall = parseFloat((boundedTP / (boundedTP + boundedFN)).toFixed(3));
  const f1 = parseFloat(((2 * precision * recall) / (precision + recall)).toFixed(3));
  const fpRate = parseFloat(((boundedFP / (boundedFP + boundedTN)) * 100).toFixed(1));

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCheatSheet = () => {
    const text = `PHISHLENS: MALICIOUS URL DETECTOR — PRESENTATION CHEAT SHEET
==============================================================
WORKFLOW PIPELINE:
1. URL Input (Safe, no auto-execution)
2. Feature Extraction (Lexical, Structural, Shannon Entropy, Domain Context)
3. ML Prediction (Random Forest vs Logistic Regression)
4. Result & Reasons (Risk Score + Plain-English Signals)

FOUR FEATURE PILLARS:
1. Lexical: Length, digits, hyphens, '@' symbol, credential keywords (login, verify).
2. Structural: Subdomain depth, raw IP address host, port anomaly, path depth.
3. Shannon Entropy: H(X) = -sum(P(x) * log2(P(x))) measuring character randomness.
4. Domain Context: TLD reputation (.xyz vs .com), registration age, WHOIS.

KEY TECHNICAL TERMS:
- Precision: Out of flagged URLs, how many are truly phishing?
- Recall: Out of all actual phishing URLs, how many did we catch?
- False Positive: Benign URL wrongly flagged as phishing (causes alert fatigue).
- PR-AUC: Area under precision-recall curve across decision thresholds.
- Random Forest: Ensemble of decision trees; handles non-linear interactions without overfitting.

VIVA SURVIVAL GOLDEN RULES:
- Never claim 100% accuracy — PhishLens provides probabilistic risk estimation.
- Start with the problem before the tech stack.
- Distinguish proposed design from completed implementation.`;

    navigator.clipboard.writeText(text);
    setCopiedCheatSheet(true);
    setTimeout(() => setCopiedCheatSheet(false), 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Header and Quick Print/Copy Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Technical Glossary, Metric Playground & Viva Tips
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Master the data science vocabulary, understand precision-recall tradeoffs, and review last-minute faculty defense strategies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCheatSheet}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
          >
            {copiedCheatSheet ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCheatSheet ? 'Copied' : 'Copy Cheat Sheet'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print 1-Page Handout</span>
          </button>
        </div>
      </div>

      {/* Interactive Metric Playground: Precision vs Recall Decision Threshold */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-sky-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Interactive Decision Threshold & Confusion Matrix Simulator
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulates a test evaluation split of 1,000 URLs (200 Phishing + 800 Benign) to show faculty how threshold tuning works.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md">
              Threshold: {threshold}%
            </span>
          </div>
        </div>

        {/* Slider control */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-500 font-mono">
            <span>Aggressive (Catches everything, higher false alarms)</span>
            <span>Conservative (Zero false alarms, misses subtle threats)</span>
          </div>
          <input
            type="range"
            min={10}
            max={90}
            value={threshold}
            onChange={e => setThreshold(parseInt(e.target.value, 10))}
            className="w-full accent-sky-600 cursor-pointer"
          />
        </div>

        {/* Confusion Matrix and Result Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Confusion Matrix 2x2 */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Simulated Confusion Matrix (1,000 Test URLs):
            </span>
            <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
              <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg">
                <span className="text-[10px] text-emerald-800 uppercase block">True Positives (TP)</span>
                <span className="text-base font-bold text-emerald-700">{boundedTP}</span>
                <span className="text-[10px] text-emerald-600 block">Phishing caught</span>
              </div>
              <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-lg">
                <span className="text-[10px] text-rose-800 uppercase block">False Positives (FP)</span>
                <span className="text-base font-bold text-rose-700">{boundedFP}</span>
                <span className="text-[10px] text-rose-600 block">Benign mistaken</span>
              </div>
              <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-lg">
                <span className="text-[10px] text-amber-800 uppercase block">False Negatives (FN)</span>
                <span className="text-base font-bold text-amber-700">{boundedFN}</span>
                <span className="text-[10px] text-amber-600 block">Phishing missed</span>
              </div>
              <div className="bg-slate-100 border border-slate-200 p-2.5 rounded-lg">
                <span className="text-[10px] text-slate-600 uppercase block">True Negatives (TN)</span>
                <span className="text-base font-bold text-slate-800">{boundedTN}</span>
                <span className="text-[10px] text-slate-500 block">Benign passed</span>
              </div>
            </div>
          </div>

          {/* Metric KPIs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-2xs space-y-1">
              <span className="text-xs font-semibold text-slate-500 block">Precision</span>
              <span className="text-xl font-bold font-mono text-slate-900">
                {(precision * 100).toFixed(1)}%
              </span>
              <span className="text-[11px] text-slate-500 block font-mono">
                TP / (TP + FP)
              </span>
            </div>

            <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-2xs space-y-1">
              <span className="text-xs font-semibold text-slate-500 block">Recall</span>
              <span className="text-xl font-bold font-mono text-slate-900">
                {(recall * 100).toFixed(1)}%
              </span>
              <span className="text-[11px] text-slate-500 block font-mono">
                TP / (TP + FN)
              </span>
            </div>

            <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-2xs space-y-1">
              <span className="text-xs font-semibold text-slate-500 block">F1-Score</span>
              <span className="text-xl font-bold font-mono text-slate-900">
                {f1.toFixed(3)}
              </span>
              <span className="text-[11px] text-slate-500 block font-mono">
                Harmonic Mean
              </span>
            </div>

            <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-2xs space-y-1">
              <span className="text-xs font-semibold text-slate-500 block">False Alarm Rate</span>
              <span className="text-xl font-bold font-mono text-slate-900">
                {fpRate}%
              </span>
              <span className="text-[11px] text-slate-500 block font-mono">
                FP / (FP + TN)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Terms Dictionary */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Technical Terms & Plain-English Explanations
            </h3>
            <p className="text-xs text-slate-500">
              Clear definitions and presentation example sentences ready to speak during the viva.
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Filtered Term Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTerms.map(t => (
            <div
              key={t.term}
              className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-slate-900 font-mono">
                    {t.term}
                  </span>
                  <span className="text-[10px] font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded">
                    {t.category}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {t.simpleMeaning}
                </p>
              </div>

              <div className="text-[11px] text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="font-semibold text-slate-800 block mb-0.5">Presentation Example:</span>
                "{t.presentationExample}"
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Last-Minute Presentation Advice & Survival Tips */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-800 pb-3">
          <span className="text-xs font-mono uppercase text-sky-400 font-bold tracking-wider">
            Faculty Viva Survival Guide
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
            Last-Minute Presentation Tips from Experienced Evaluators
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRESENTATION_TIPS.map((tip, idx) => (
            <div key={idx} className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs">
                <CheckCircle className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{tip.title}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {tip.advice}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
