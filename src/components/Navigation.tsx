import React from 'react';
import { ShieldCheck } from 'lucide-react';

export type ActiveTab = 'scanner' | 'dashboard';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  sessionScanCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  sessionScanCount,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single line, no decorative tags) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-sky-950 border border-sky-600/50 flex items-center justify-center text-sky-400 shadow-xs">
            <ShieldCheck className="w-5 h-5 text-sky-400" />
          </div>
          <button
            onClick={() => onTabChange('scanner')}
            className="text-lg font-bold tracking-tight text-white hover:text-sky-400 transition-colors whitespace-nowrap"
          >
            PhishLens
          </button>
        </div>

        {/* Zone 2: 5 single-line clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => onTabChange('scanner')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'scanner'
                ? 'text-sky-400 font-semibold border-b-2 border-sky-400'
                : 'hover:text-white'
            }`}
          >
            URL Scanner
          </button>
          <button
            onClick={() => onTabChange('dashboard')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'dashboard'
                ? 'text-sky-400 font-semibold border-b-2 border-sky-400'
                : 'hover:text-white'
            }`}
          >
            Dashboard
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-slate-300">
            <span className="text-slate-400">Scans:</span>
            <span className="font-semibold text-sky-400 tabular-nums">{sessionScanCount}</span>
          </div>

          <button
            onClick={() => onTabChange('scanner')}
            className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-500 transition-colors whitespace-nowrap shadow-xs"
          >
            Scan New URL
          </button>
        </div>
      </div>
    </header>
  );
};
