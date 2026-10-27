import React, { useState, useEffect } from 'react';
import { Navigation, ActiveTab } from './components/Navigation';
import { ScannerView } from './components/ScannerView';
import { DashboardView } from './components/DashboardView';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('scanner');
  const [sessionScanCount, setSessionScanCount] = useState<number>(0);

  // Fetch initial scan count from backend /api/stats
  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        if (data && data.session && typeof data.session.total_scanned === 'number') {
          setSessionScanCount(data.session.total_scanned);
        }
      })
      .catch(() => {});
  }, []);

  const handleScanComplete = () => {
    setSessionScanCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* 3-Zone Navigation Header */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        sessionScanCount={sessionScanCount}
      />

      {/* Main Body */}
      <main className="flex-1 pb-16">
        {activeTab === 'scanner' && (
          <ScannerView
            onScanComplete={handleScanComplete}
            onNavigateToTab={setActiveTab}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print border-t border-slate-900 bg-slate-950 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            <span className="font-semibold text-slate-300">PhishLens</span> — AI-Powered Malicious URL Detection System
          </div>
          <div className="flex items-center gap-4">
            <span>Machine Learning & Cybersecurity</span>
            <span>·</span>
            <span>Random Forest & Shannon Entropy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
