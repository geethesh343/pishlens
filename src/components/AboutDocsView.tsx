import React from 'react';
import {
  Shield,
  Layers,
  Cpu,
  Lock,
  Code2,
  BookOpen,
  Terminal,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

export const AboutDocsView: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 text-slate-300">
      {/* Title */}
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          About PhishLens & Technical Documentation
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Complete architectural guide, 15-feature taxonomy, machine learning lifecycle, and privacy safeguards.
        </p>
      </div>

      {/* Grid: What is Phishing & Blacklist Lag */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
            <Shield className="w-4 h-4" />
            <span>What is Phishing?</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Phishing is a social engineering cyberattack where adversaries create deceptive replicas of trusted websites (such as banks, email providers, or tech platforms) to trick victims into surrendering login passwords, credit card numbers, or MFA tokens.
          </p>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono text-amber-400">
            Target Vectors: WhatsApp, SMS, Email, Social Media, Typosquatting links.
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Why Static Blacklists Fall Behind</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Traditional antivirus and DNS blocklists depend on someone discovering, reporting, and manually verifying a malicious link. Over 60% of modern phishing domains stay active for less than 24 hours. By the time a link is added to a blacklist, the damage has already occurred.
          </p>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono text-rose-400">
            PhishLens Advantage: Evaluates inherent URL patterns to detect zero-day links without waiting for reports.
          </div>
        </div>
      </div>

      {/* 15 Feature Pillars Taxonomy */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <span className="text-xs font-mono uppercase text-sky-400 font-bold tracking-wider">
            Feature Taxonomy
          </span>
          <h3 className="text-lg font-bold text-white mt-1">
            The 15 Extracted Detection Features
          </h3>
          <p className="text-xs text-slate-400">
            All 15 features are extracted from the raw URL string mathematically without navigating to the remote website.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-sky-400 uppercase font-mono block">1. Lexical Features</span>
            <ul className="space-y-1.5 text-slate-300">
              <li>• <code>url_length</code>: Total string length</li>
              <li>• <code>hyphen_count</code>: Typosquatting delimiter</li>
              <li>• <code>digit_count</code>: Campaign identifier density</li>
              <li>• <code>has_at_symbol</code>: Host concealment symbol</li>
              <li>• <code>suspicious_token_count</code>: login, verify, banking</li>
              <li>• <code>has_encoded_chars</code>: Hex escape sequences (%20)</li>
            </ul>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-indigo-400 uppercase font-mono block">2. Structural Features</span>
            <ul className="space-y-1.5 text-slate-300">
              <li>• <code>hostname_length</code>: Domain string size</li>
              <li>• <code>dot_count</code>: Chained host separator</li>
              <li>• <code>subdomain_count</code>: Multi-level hierarchy depth</li>
              <li>• <code>is_ip_address</code>: Raw IPv4/IPv6 address host</li>
              <li>• <code>is_https</code>: Transport layer encryption</li>
              <li>• <code>path_length</code> & <code>query_param_count</code>: Path arguments</li>
              <li>• <code>has_unusual_port</code>: Non-standard web ports</li>
            </ul>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-emerald-400 uppercase font-mono block">3. Shannon Entropy</span>
            <ul className="space-y-1.5 text-slate-300">
              <li>• <code>character_entropy</code>: Bits of randomness per character</li>
              <li>• Formula: <span className="font-mono text-emerald-300">H(X) = -Σ P(x) log₂ P(x)</span></li>
              <li>• Detects Domain Generation Algorithms (DGA)</li>
              <li>• Separates natural human words from randomized malware strings</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Machine Learning Pipeline & Lifecycle */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white">Machine Learning Lifecycle & Evaluation Criteria</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="border-l-2 border-sky-500 pl-3 space-y-1">
            <span className="font-bold text-white block">Phase 1: Dataset & Hygiene</span>
            <p className="text-slate-400">
              Sourced from PhishTank & Tranco top domains. Strict deduplication and 80/20 train/test stratified split with zero data leakage.
            </p>
          </div>

          <div className="border-l-2 border-indigo-500 pl-3 space-y-1">
            <span className="font-bold text-white block">Phase 2: Model Comparison</span>
            <p className="text-slate-400">
              Trained Logistic Regression baseline against Random Forest. Random Forest achieved superior F1 (0.963) and PR-AUC (0.988).
            </p>
          </div>

          <div className="border-l-2 border-emerald-500 pl-3 space-y-1">
            <span className="font-bold text-white block">Phase 3: Threshold Tuning</span>
            <p className="text-slate-400">
              Tuned classification threshold to 0.48 on validation data to optimize the balance between catching phishing and minimizing false alarms.
            </p>
          </div>

          <div className="border-l-2 border-amber-500 pl-3 space-y-1">
            <span className="font-bold text-white block">Phase 4: Serving & REST API</span>
            <p className="text-slate-400">
              Saved via joblib. Served through lightweight microservice endpoints with sub-100ms response times.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy, Ethics, and Limitations */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Lock className="w-4 h-4 text-sky-400" />
          <span>Privacy, Security, and Known Limitations</span>
        </div>
        <div className="space-y-2 text-xs text-slate-400 leading-relaxed">
          <p>
            • <strong>No Unsafe Server Execution:</strong> PhishLens never makes outbound HTTP requests to the target URL during scanning. This completely protects the backend from Server-Side Request Forgery (SSRF) and protects the server from malware execution.
          </p>
          <p>
            • <strong>Token & Password Sanitization:</strong> Any sensitive query parameters (e.g. <code>token</code>, <code>password</code>, <code>auth</code>) are masked as <code>[REDACTED]</code> prior to session logging.
          </p>
          <p>
            • <strong>Probabilistic Boundaries:</strong> Machine learning models predict statistical patterns. An assessment of "Lower Risk" is not an absolute guarantee that a website is safe. Users must maintain basic cybersecurity hygiene.
          </p>
        </div>
      </div>
    </div>
  );
};
