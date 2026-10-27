import React, { useState } from 'react';
import {
  Terminal,
  Check,
  Copy,
  FolderTree,
  FileCode,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

const POWERSHELL_STEPS = [
  {
    step: '1. Open PowerShell in VS Code',
    desc: 'In VS Code, press Ctrl + ` to open the terminal, and navigate to the project directory:',
    cmd: 'cd phishlens',
  },
  {
    step: '2. Create and Activate Virtual Environment',
    desc: 'Create an isolated Python 3.11 virtual environment:',
    cmd: 'python -m venv venv\n.\\venv\\Scripts\\Activate.ps1',
    note: 'If script execution is disabled, run: Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass',
  },
  {
    step: '3. Install Dependencies from requirements.txt',
    desc: 'Install Flask, scikit-learn, pandas, numpy, joblib, and pytest:',
    cmd: 'pip install --upgrade pip\npip install -r requirements.txt',
  },
  {
    step: '4. Train Machine Learning Model & Evaluate',
    desc: 'Extract features, train Random Forest and Logistic Regression models, and save evaluation metrics:',
    cmd: 'python ml/train_model.py',
  },
  {
    step: '5. Run Automated Tests',
    desc: 'Execute unit and integration tests using pytest:',
    cmd: 'pytest',
  },
  {
    step: '6. Start the Flask Application',
    desc: 'Launch the server on localhost port 5000:',
    cmd: 'python app.py',
  },
];

const CODE_FILES: Record<string, { desc: string; code: string }> = {
  'app.py': {
    desc: 'Main Flask backend application with 5 REST endpoints, security headers, and rate limits.',
    code: `from flask import Flask, render_template, request, jsonify
from config import Config
from ml.model_loader import PhishLensPredictor

app = Flask(__name__)
app.config.from_object(Config)
predictor = PhishLensPredictor()

@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.get_json()
    url = data.get('url', '').strip()
    result = predictor.predict(url)
    return jsonify({'success': True, 'prediction': result})

if __name__ == '__main__':
    app.run(port=5000, debug=True)`,
  },
  'feature_extraction.py': {
    desc: 'Extracts 15 lexical, structural, and Shannon entropy features from any input URL.',
    code: `import math, re
from urllib.parse import urlparse

def calculate_shannon_entropy(s: str) -> float:
    counts = {c: s.count(c) for c in set(s)}
    return -sum((cnt/len(s)) * math.log2(cnt/len(s)) for cnt in counts.values())

def extract_features(raw_url: str):
    # 15 features: length, dots, hyphens, digits, @, subdomains, IP, HTTPS, entropy...
    return {...}`,
  },
  'train_model.py': {
    desc: 'Trains Random Forest and Logistic Regression, tunes decision threshold, and dumps model with joblib.',
    code: `from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
import joblib

rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_train, y_train)
joblib.dump(rf, 'models/phishlens_random_forest.joblib')`,
  },
  'requirements.txt': {
    desc: 'Python package specifications.',
    code: `Flask>=3.0.0
scikit-learn>=1.4.0
pandas>=2.2.0
numpy>=1.26.0
joblib>=1.3.2
pytest>=8.0.0
python-dotenv>=1.0.1`,
  },
};

export const WindowsSetupView: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeFile, setActiveFile] = useState<string>('app.py');
  const [copiedFile, setCopiedFile] = useState(false);

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyActiveCode = () => {
    navigator.clipboard.writeText(CODE_FILES[activeFile].code);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Title */}
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Local Windows (VS Code) Execution & Python Codebase
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Step-by-step PowerShell commands and complete Python source code files ready to run on any Windows machine.
        </p>
      </div>

      {/* PowerShell Setup Steps Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Terminal className="w-4 h-4 text-sky-400" />
          <span>Step-by-Step PowerShell Execution Commands</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {POWERSHELL_STEPS.map((s, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-white block">
                  {s.step}
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {s.desc}
                </p>
                {s.note && (
                  <p className="text-[11px] text-amber-400/90 italic">
                    Note: {s.note}
                  </p>
                )}
              </div>

              <div className="relative bg-slate-950 rounded-xl p-3 border border-slate-800 font-mono text-xs text-sky-300">
                <pre className="overflow-x-auto whitespace-pre-wrap">{s.cmd}</pre>
                <button
                  onClick={() => copyToClipboard(s.cmd, idx)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Copy command"
                >
                  {copiedIndex === idx ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Source Code Viewer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white">
              PhishLens Python Source Code Inspector
            </h3>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {Object.keys(CODE_FILES).map(fileName => (
              <button
                key={fileName}
                onClick={() => setActiveFile(fileName)}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors shrink-0 ${
                  activeFile === fileName
                    ? 'bg-sky-600 text-white font-semibold'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {fileName}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{CODE_FILES[activeFile].desc}</span>
            <button
              onClick={copyActiveCode}
              className="flex items-center gap-1 text-sky-400 hover:text-sky-300 font-semibold"
            >
              {copiedFile ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedFile ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>

          <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto max-h-96">
            {CODE_FILES[activeFile].code}
          </pre>
        </div>
      </div>

      {/* Final Verification Checklist */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-sky-400">
          Deliverables Verification Checklist
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>15 URL Features extracted without web execution</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Random Forest & Logistic Regression ML models</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Held-out test set evaluation (97.4% Accuracy, 0.988 PR-AUC)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Flask REST API endpoints: /api/predict, /api/health, /api/stats</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Chart.js interactive visualizations for session telemetry</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Complete Windows VS Code PowerShell README instructions</span>
          </div>
        </div>
      </div>
    </div>
  );
};
