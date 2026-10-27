import React, { useState, useEffect } from 'react';
import { SLIDES_DATA } from '../data/presentationData';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  FileText,
  FlaskConical,
  Shield,
  Layers,
  Cpu,
  Compass,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Terminal,
} from 'lucide-react';

interface SlideViewerProps {
  onOpenSpeakerNotes: (slideId: number) => void;
  onTestInLab: (url: string) => void;
}

export const SlideViewer: React.FC<SlideViewerProps> = ({
  onOpenSpeakerNotes,
  onTestInLab,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);

  const slide = SLIDES_DATA[currentSlideIndex];
  const totalSlides = SLIDES_DATA.length;

  const goToNext = () => {
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  };

  const goToPrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Slide Navigation & Controller Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md">
            Slide {slide.id} of {totalSlides}
          </span>
          <span className="text-sm text-slate-500 hidden sm:inline">
            Use arrow keys ← / → or click below to navigate
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenSpeakerNotes(slide.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <FileText className="w-3.5 h-3.5 text-sky-600" />
            <span>Spoken Script</span>
          </button>

          {slide.anticipatedQuestion && (
            <button
              onClick={() => setShowQuestionModal(!showQuestionModal)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Faculty Alert</span>
            </button>
          )}

          <button
            onClick={toggleFullscreen}
            className="p-1.5 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Slide Canvas Container (16:9 Presentation Frame) */}
      <div className="relative w-full bg-slate-900 text-white rounded-2xl shadow-xl overflow-hidden border border-slate-800 min-h-[580px] lg:min-h-[620px] flex flex-col justify-between p-6 sm:p-10">
        
        {/* Top Header of the Slide */}
        <div className="space-y-2 border-b border-slate-800/80 pb-5">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-mono text-sky-400">
              PhishLens Presentation · Malicious URL Detection
            </span>
            <span className="text-xs font-mono text-slate-400 tabular-nums">
              0{slide.id} / 0{totalSlides}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white max-w-4xl" style={{ textWrap: 'balance' }}>
            {slide.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-medium">
            {slide.subtitle}
          </p>
        </div>

        {/* Dynamic Slide Body depending on Slide ID */}
        <div className="py-6 flex-1 flex flex-col justify-center">
          {/* SLIDE 1: INTRO */}
          {slide.id === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="space-y-3">
                  {slide.bulletPoints.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-xl">
                      <div className="w-5 h-5 rounded-full bg-sky-900/60 border border-sky-500/30 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-mono text-sky-300">{idx + 1}</span>
                      </div>
                      <p className="text-sm text-slate-200 leading-relaxed">{point}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-emerald-400" /> Proactive Pre-Click Defense
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-sky-400" /> Statistical Feature Engineering
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-amber-400" /> Explainable Risk Rationale
                  </span>
                </div>
              </div>

              {/* Slide 1 Vector Visual Graphic */}
              <div className="lg:col-span-5 bg-gradient-to-br from-slate-800 to-slate-950 p-6 rounded-2xl border border-slate-700/80 shadow-inner flex flex-col items-center justify-center text-center space-y-4">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-sky-500/10 border border-sky-400/30 animate-pulse" />
                  <div className="w-20 h-20 rounded-2xl bg-sky-600/20 border border-sky-400/50 flex items-center justify-center shadow-lg">
                    <Shield className="w-10 h-10 text-sky-400" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-base font-semibold text-white tracking-wide">
                    PhishLens Architecture
                  </div>
                  <div className="text-xs text-slate-400">
                    Inspecting URL anatomy before credential transmission
                  </div>
                </div>

                <div className="w-full bg-slate-900/90 rounded-lg p-2.5 border border-slate-800 text-left font-mono text-xs text-slate-300">
                  <div className="text-sky-400 font-semibold mb-1">Standard Workflow:</div>
                  <div className="space-y-0.5 text-[11px] text-slate-400">
                    <div>1. Enter URL string</div>
                    <div>2. Extract lexical + structural features</div>
                    <div>3. Machine learning prediction</div>
                    <div>4. Risk score + plain-language explanation</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 2: THE PROBLEM */}
          {slide.id === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-800/70 border border-slate-700 p-5 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                  01
                </div>
                <h3 className="text-base font-semibold text-white">Easy to Disguise</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Attackers create links that look similar to trusted brands. They leverage typosquatting (e.g. replacing <span className="font-mono text-amber-300 bg-slate-900 px-1 py-0.5 rounded">m</span> with <span className="font-mono text-amber-300 bg-slate-900 px-1 py-0.5 rounded">rn</span> or <span className="font-mono text-amber-300 bg-slate-900 px-1 py-0.5 rounded">paypa1</span>) and deceptive subdomains.
                </p>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-amber-400">
                  rnicrosoft.com.auth-service.xyz
                </div>
              </div>

              <div className="bg-slate-800/70 border border-slate-700 p-5 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold">
                  02
                </div>
                <h3 className="text-base font-semibold text-white">Blacklists Lag Behind</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Traditional blacklists only know previously reported malicious domains. New zero-day phishing sites stay active for hours before reporting, leaving users unprotected.
                </p>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-rose-400">
                  Over 60% of phishing links live &lt; 24h
                </div>
              </div>

              <div className="bg-slate-800/70 border border-slate-700 p-5 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold">
                  03
                </div>
                <h3 className="text-base font-semibold text-white">One Click Can Cost a Lot</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Visiting a phishing clone and submitting credentials can trigger bank account theft, corporate VPN breaches, and irreversible identity fraud.
                </p>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-purple-400">
                  Target: Credential theft & OTP harvesting
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 3: PROPOSED SOLUTION */}
          {slide.id === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-800/80 border border-sky-500/30 p-4 rounded-xl space-y-2">
                  <div className="text-xs font-mono text-sky-400 font-semibold">STAGE 01</div>
                  <h4 className="text-sm font-bold text-white">URL Input</h4>
                  <p className="text-xs text-slate-300">
                    User safely pastes link into web portal. Link is inspected without auto-executing malicious code.
                  </p>
                </div>

                <div className="bg-slate-800/80 border border-indigo-500/30 p-4 rounded-xl space-y-2">
                  <div className="text-xs font-mono text-indigo-400 font-semibold">STAGE 02</div>
                  <h4 className="text-sm font-bold text-white">Feature Extraction</h4>
                  <p className="text-xs text-slate-300">
                    Converts URL anatomy into numerical values: length, symbols, subdomains, Shannon entropy, and TLD.
                  </p>
                </div>

                <div className="bg-slate-800/80 border border-emerald-500/30 p-4 rounded-xl space-y-2">
                  <div className="text-xs font-mono text-emerald-400 font-semibold">STAGE 03</div>
                  <h4 className="text-sm font-bold text-white">ML Classifier</h4>
                  <p className="text-xs text-slate-300">
                    Trained ensemble model (Random Forest / Logistic Regression) computes mathematical phishing risk probability.
                  </p>
                </div>

                <div className="bg-slate-800/80 border border-amber-500/30 p-4 rounded-xl space-y-2">
                  <div className="text-xs font-mono text-amber-400 font-semibold">STAGE 04</div>
                  <h4 className="text-sm font-bold text-white">Result & Reasons</h4>
                  <p className="text-xs text-slate-300">
                    Displays risk label (High / Suspicious / Benign), risk score, and plain-English factors so users know why.
                  </p>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-400">
                  <span className="text-sky-400 font-semibold">Key Advantage:</span> Explainability empowers users instead of showing an unexplained black-box rating.
                </div>
                <button
                  onClick={() => onTestInLab('http://192.0.2.10/login/verify-account')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-sky-300 bg-sky-950/80 border border-sky-800 hover:bg-sky-900 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <FlaskConical className="w-3.5 h-3.5 text-sky-400" />
                  Try Sample URL in Live Lab
                </button>
              </div>
            </div>
          )}

          {/* SLIDE 4: KEY DETECTION FEATURES */}
          {slide.id === 4 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-800/70 border border-slate-700 p-4 rounded-xl space-y-2">
                  <div className="text-xs font-semibold text-sky-400">1. Lexical Features</div>
                  <div className="text-xs text-slate-300 space-y-1">
                    <div>• URL length & digit count</div>
                    <div>• Hyphens and special symbols</div>
                    <div>• Presence of "@" symbol</div>
                    <div>• Keywords: <span className="font-mono text-amber-300">login</span>, <span className="font-mono text-amber-300">verify</span></div>
                  </div>
                </div>

                <div className="bg-slate-800/70 border border-slate-700 p-4 rounded-xl space-y-2">
                  <div className="text-xs font-semibold text-indigo-400">2. Structural Features</div>
                  <div className="text-xs text-slate-300 space-y-1">
                    <div>• Excessive subdomain depth</div>
                    <div>• Host is raw IP address</div>
                    <div>• Non-standard port numbers</div>
                    <div>• Path & query parameter depth</div>
                  </div>
                </div>

                <div className="bg-slate-800/70 border border-slate-700 p-4 rounded-xl space-y-2">
                  <div className="text-xs font-semibold text-emerald-400">3. Shannon Entropy</div>
                  <div className="text-xs text-slate-300 space-y-1">
                    <div>• Character randomness formula</div>
                    <div>• <span className="font-mono text-emerald-300 text-[11px]">H(X) = -Σ P(x) log₂ P(x)</span></div>
                    <div>• Flags DGA botnet domains</div>
                    <div>• High entropy = unpredictable</div>
                  </div>
                </div>

                <div className="bg-slate-800/70 border border-slate-700 p-4 rounded-xl space-y-2">
                  <div className="text-xs font-semibold text-purple-400">4. Domain Context</div>
                  <div className="text-xs text-slate-300 space-y-1">
                    <div>• Domain age & WHOIS records</div>
                    <div>• TLD reputation (.xyz, .tk, .top)</div>
                    <div>• Newly registered domains</div>
                    <div>• Legitimate history check</div>
                  </div>
                </div>
              </div>

              {/* Concrete Example Box from Slide 4 */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                    Slide 4 Case Study URL:
                  </span>
                  <span className="font-mono text-xs text-amber-400 bg-amber-950/40 px-2.5 py-0.5 rounded border border-amber-900/50">
                    http://192.0.2.10/login/verify-account
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">Lexical Signal:</span>
                    <span className="text-slate-200">Contains <span className="font-mono text-amber-300">login</span> & <span className="font-mono text-amber-300">verify-account</span></span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Structural Signal:</span>
                    <span className="text-rose-300">Raw IP host (<span className="font-mono">192.0.2.10</span>)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Entropy Signal:</span>
                    <span className="text-slate-200">Low randomness; deceptive English keywords</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Domain Context:</span>
                    <span className="text-slate-200">No domain name or WHOIS record</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 5: TECHNICAL APPROACH */}
          {slide.id === 5 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-800/70 border border-slate-700 p-4 rounded-xl space-y-1.5">
                  <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-mono text-xs font-bold">
                    01
                  </div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Data Collection</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Sourced from PhishTank and verified benign sites (Tranco/Alexa). Duplicates removed; strict train/test separation to avoid data leakage.
                  </p>
                </div>

                <div className="bg-slate-800/70 border border-slate-700 p-4 rounded-xl space-y-1.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono text-xs font-bold">
                    02
                  </div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Feature Extraction</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Python + pandas parse URL components into tabular feature matrices (lexical counts, ratios, symbol flags, entropy values).
                  </p>
                </div>

                <div className="bg-slate-800/70 border border-slate-700 p-4 rounded-xl space-y-1.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono text-xs font-bold">
                    03
                  </div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Model Training</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Train and compare algorithms using scikit-learn: Logistic Regression, Random Forest, and Gradient Boosting.
                  </p>
                </div>

                <div className="bg-slate-800/70 border border-slate-700 p-4 rounded-xl space-y-1.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono text-xs font-bold">
                    04
                  </div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Evaluation & Serve</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Assess Precision, Recall, F1, PR-AUC, and False Positive rate. Deploy via Flask or Streamlit web microservice.
                  </p>
                </div>
              </div>

              {/* Technical Terms Quick Reference */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div className="text-xs font-semibold text-slate-400 mb-2">Key ML Evaluation Vocabulary:</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="font-semibold text-sky-300">Precision:</span>
                    <span className="text-slate-400 block text-[11px]">Flagged links that are truly phishing (TP / (TP+FP))</span>
                  </div>
                  <div>
                    <span className="font-semibold text-emerald-300">Recall:</span>
                    <span className="text-slate-400 block text-[11px]">Actual phishing links caught by model (TP / (TP+FN))</span>
                  </div>
                  <div>
                    <span className="font-semibold text-amber-300">False-Positive:</span>
                    <span className="text-slate-400 block text-[11px]">Safe link wrongly marked as phishing</span>
                  </div>
                  <div>
                    <span className="font-semibold text-purple-300">PR-AUC:</span>
                    <span className="text-slate-400 block text-[11px]">Precision-Recall curve area across all thresholds</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 6: INNOVATION & FEASIBILITY */}
          {slide.id === 6 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800/70 border border-slate-700 p-5 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-sky-400 font-semibold text-sm">
                  <Cpu className="w-4 h-4" />
                  What Makes PhishLens Innovative?
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Multi-signal fusion:</strong> Combines lexical, structural, and entropy signals rather than relying on one cue.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Explainable AI:</strong> Explains suspicious factors in plain English so users understand risk.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Zero-day detection:</strong> Learns generalizable URL patterns to catch newly registered domains not yet on blacklists.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-800/70 border border-slate-700 p-5 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                  <Shield className="w-4 h-4" />
                  Security & Feasibility Precautions
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="font-mono text-emerald-400 text-xs mt-0.5 font-bold">1</span>
                    <span><strong>Privacy:</strong> Does not store submitted query strings to prevent recording sensitive tokens or passwords.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-mono text-emerald-400 text-xs mt-0.5 font-bold">2</span>
                    <span><strong>Safe handling:</strong> Pure static URL string analysis without automated web crawling to prevent malware execution.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-mono text-emerald-400 text-xs mt-0.5 font-bold">3</span>
                    <span><strong>Rate limiting:</strong> Protects the API backend against bot abuse and denial of service.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* SLIDE 7: EXPECTED IMPACT & SCALABILITY */}
          {slide.id === 7 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800/70 border border-slate-700 p-4 rounded-xl space-y-2">
                  <div className="text-xs font-semibold text-emerald-400">Safer Clicks</div>
                  <p className="text-xs text-slate-300">
                    Empowers everyday users with pre-click warnings before they enter passwords or banking details.
                  </p>
                </div>
                <div className="bg-slate-800/70 border border-slate-700 p-4 rounded-xl space-y-2">
                  <div className="text-xs font-semibold text-sky-400">Less Friction</div>
                  <p className="text-xs text-slate-300">
                    Provides fast results and plain-English reasons so users don't need cybersecurity degrees to make safe choices.
                  </p>
                </div>
                <div className="bg-slate-800/70 border border-slate-700 p-4 rounded-xl space-y-2">
                  <div className="text-xs font-semibold text-purple-400">Measurable Quality</div>
                  <p className="text-xs text-slate-300">
                    Tunable classification thresholds allow tailoring for high sensitivity (e.g. banking) or low false alarms (browsing).
                  </p>
                </div>
              </div>

              {/* Future Scalability Roadmap */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Future Development Roadmap
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="border-l-2 border-sky-500 pl-3 space-y-1">
                    <div className="font-semibold text-white">Stage 1: Current Prototype</div>
                    <div className="text-slate-400">Single URL checker with feature decomposition and risk scoring.</div>
                  </div>
                  <div className="border-l-2 border-indigo-500 pl-3 space-y-1">
                    <div className="font-semibold text-white">Stage 2: Batch & REST API</div>
                    <div className="text-slate-400">Scan enterprise link batches & connect third-party security systems.</div>
                  </div>
                  <div className="border-l-2 border-emerald-500 pl-3 space-y-1">
                    <div className="font-semibold text-white">Stage 3: Extensions & Mail</div>
                    <div className="text-slate-400">Browser extension hover checks and automated email client filtering.</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 8: CONCLUSION */}
          {slide.id === 8 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 bg-slate-800/60 border border-slate-700/60 p-3 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-slate-200">
                      <strong>Proactive Detection:</strong> Combines lexical, structural, and Shannon entropy signals to identify zero-day phishing links.
                    </p>
                  </div>
                  <div className="flex items-start gap-3 bg-slate-800/60 border border-slate-700/60 p-3 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-slate-200">
                      <strong>Explainable Transparency:</strong> Empowers users by explicitly listing suspicious signals rather than giving an arbitrary black-box rating.
                    </p>
                  </div>
                  <div className="flex items-start gap-3 bg-slate-800/60 border border-slate-700/60 p-3 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-slate-200">
                      <strong>Realistic & Feasible:</strong> Built on open-source Python ML libraries (pandas, scikit-learn, Flask) with an evolutionary roadmap.
                    </p>
                  </div>
                </div>

                <div className="bg-sky-950/40 border border-sky-800/60 p-3.5 rounded-xl text-xs text-sky-200">
                  <span className="font-semibold text-sky-300">Presenter's Concluding Words:</span> "PhishLens aims to serve as an intelligent safety lens—empowering users to make informed, safe clicks. Thank you for your time. We are happy to take questions."
                </div>
              </div>

              <div className="lg:col-span-4 bg-slate-800/80 border border-slate-700 p-6 rounded-2xl text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Presentation Complete</h3>
                  <p className="text-xs text-slate-400 mt-1">Ready for Faculty Viva Voce Q&A Session</p>
                </div>
                <div className="pt-2">
                  <span className="inline-block text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-3 py-1 rounded-full">
                    15 Viva Q&As Prepared
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Slide Bottom Bar with Transitions & Key Takeaway */}
        <div className="border-t border-slate-800/80 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="text-slate-400 flex items-center gap-2">
            <span className="font-semibold text-slate-300">Core Takeaway:</span>
            <span>{slide.keyTakeaway}</span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={goToPrev}
              disabled={currentSlideIndex === 0}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:hover:bg-slate-800 flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <button
              onClick={goToNext}
              disabled={currentSlideIndex === totalSlides - 1}
              className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white disabled:opacity-40 disabled:hover:bg-sky-600 flex items-center gap-1 transition-colors font-medium"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Slide Thumbnails Tray */}
      <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2">
        {SLIDES_DATA.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentSlideIndex(idx)}
            className={`shrink-0 text-left p-2.5 rounded-xl border transition-all ${
              idx === currentSlideIndex
                ? 'bg-sky-50 border-sky-400 shadow-xs ring-1 ring-sky-300'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            } w-36 sm:w-44`}
          >
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1">
              <span>SLIDE 0{s.id}</span>
              {idx === currentSlideIndex && (
                <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
              )}
            </div>
            <div className="text-xs font-semibold text-slate-900 truncate">
              {s.title.split('—')[0].replace('The Problem: ', '').replace('Proposed Solution: ', '')}
            </div>
          </button>
        ))}
      </div>

      {/* Faculty Alert Modal */}
      {showQuestionModal && slide.anticipatedQuestion && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Anticipated Faculty Question on Slide {slide.id}</span>
              </div>
              <button
                onClick={() => setShowQuestionModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase font-semibold text-slate-500 tracking-wider">
                Question Faculty May Ask:
              </span>
              <p className="text-sm font-semibold text-slate-900 bg-amber-50 p-3 rounded-lg border border-amber-200">
                "{slide.anticipatedQuestion.question}"
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase font-semibold text-slate-500 tracking-wider">
                Recommended Crisp Answer:
              </span>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                {slide.anticipatedQuestion.answer}
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowQuestionModal(false)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
