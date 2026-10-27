import React, { useState } from 'react';
import { VIVA_QUESTIONS } from '../data/presentationData';
import { VivaQuestion } from '../types/presentation';
import {
  HelpCircle,
  CheckCircle2,
  BookmarkCheck,
  Search,
  Filter,
  Eye,
  EyeOff,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Volume2,
  VolumeX,
} from 'lucide-react';

export const VivaSimulator: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'flashcard' | 'browser'>('flashcard');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [flashcardIndex, setFlashcardIndex] = useState<number>(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);
  const [masteredIds, setMasteredIds] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem('phishlens_viva_mastered');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const categories = ['All', 'Fundamentals', 'Machine Learning', 'Evaluation & Metrics', 'Project Scope'];

  const filteredQuestions = VIVA_QUESTIONS.filter(q => {
    const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory;
    const matchesSearch =
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const currentFlashcard: VivaQuestion = filteredQuestions[flashcardIndex] || filteredQuestions[0] || VIVA_QUESTIONS[0];

  const toggleMastered = (id: number) => {
    const next = new Set(masteredIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setMasteredIds(next);
    try {
      localStorage.setItem('phishlens_viva_mastered', JSON.stringify(Array.from(next)));
    } catch {
      // storage unavailable
    }
  };

  const handleNextFlashcard = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsAnswerRevealed(false);
    setFlashcardIndex(prev => (prev + 1) % filteredQuestions.length);
  };

  const handlePrevFlashcard = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsAnswerRevealed(false);
    setFlashcardIndex(prev => (prev - 1 + filteredQuestions.length) % filteredQuestions.length);
  };

  const handleSpeech = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const masteryPercent = Math.round((masteredIds.size / VIVA_QUESTIONS.length) * 100);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header and Defense Readiness Progress */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Faculty Viva Voce Defense Simulator
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            15 essential questions anticipated from faculty examiners with precise, high-scoring answers and delivery tips.
          </p>
        </div>

        {/* Defense Readiness Meter */}
        <div className="flex items-center gap-3 bg-white border border-slate-200 p-3 rounded-2xl shadow-xs">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 font-mono block">Defense Readiness</span>
            <span className="text-sm font-bold text-slate-900 font-mono">
              {masteredIds.size} / {VIVA_QUESTIONS.length} Questions ({masteryPercent}%)
            </span>
          </div>
          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all duration-300"
              style={{ width: `${masteryPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Control Bar: Mode Toggle & Category Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Mode Toggle */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl max-w-fit">
          <button
            onClick={() => setActiveMode('flashcard')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeMode === 'flashcard'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Flashcard Quiz Mode
          </button>
          <button
            onClick={() => setActiveMode('browser')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeMode === 'browser'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All 15 Q&A Directory
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setFlashcardIndex(0);
                setIsAnswerRevealed(false);
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors shrink-0 ${
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

      {/* MODE 1: INTERACTIVE FLASHCARD QUIZ */}
      {activeMode === 'flashcard' && currentFlashcard && (
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>
              Question {flashcardIndex + 1} of {filteredQuestions.length} ({currentFlashcard.category})
            </span>
            <button
              onClick={() => toggleMastered(currentFlashcard.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                masteredIds.has(currentFlashcard.id)
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>{masteredIds.has(currentFlashcard.id) ? 'Mastered' : 'Mark as Mastered'}</span>
            </button>
          </div>

          {/* Flashcard Box */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-md space-y-6 min-h-[340px] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md">
                  VIVA QUESTION #{currentFlashcard.id}
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-500">{currentFlashcard.category}</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 leading-snug">
                "{currentFlashcard.question}"
              </h3>
            </div>

            {/* Answer Display (Revealable) */}
            <div className="flex-1 flex flex-col justify-center my-4">
              {isAnswerRevealed ? (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                      Standard Faculty Answer:
                    </span>
                    <button
                      onClick={() => handleSpeech(currentFlashcard.answer)}
                      className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900"
                    >
                      {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-amber-600" /> : <Volume2 className="w-3.5 h-3.5 text-sky-600" />}
                      <span>{isSpeaking ? 'Stop' : 'Listen'}</span>
                    </button>
                  </div>
                  <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-sans">
                    {currentFlashcard.answer}
                  </p>
                  {currentFlashcard.practicalTip && (
                    <div className="text-xs text-sky-900 bg-sky-50 p-2.5 rounded-lg border border-sky-100">
                      <strong>Delivery Tip:</strong> {currentFlashcard.practicalTip}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl p-8 text-center space-y-3">
                  <p className="text-sm text-slate-500">
                    Think of your answer, then click below to compare with the faculty answer key.
                  </p>
                  <button
                    onClick={() => setIsAnswerRevealed(true)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5 shadow-xs"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Reveal Answer</span>
                  </button>
                </div>
              )}
            </div>

            {/* Controls bottom */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={handlePrevFlashcard}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={() => setIsAnswerRevealed(!isAnswerRevealed)}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium"
              >
                {isAnswerRevealed ? 'Hide Answer' : 'Show Answer'}
              </button>

              <button
                onClick={handleNextFlashcard}
                className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors"
              >
                <span>Next Question</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: DIRECTORY OF ALL 15 QUESTIONS */}
      {activeMode === 'browser' && (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search viva questions by keywords (e.g., 'recall', 'entropy', 'Random Forest')..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* List of questions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredQuestions.map(q => (
              <div
                key={q.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                      Q{q.id} · {q.category}
                    </span>
                    <button
                      onClick={() => toggleMastered(q.id)}
                      className={`text-xs p-1 rounded-md transition-colors ${
                        masteredIds.has(q.id) ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
                      }`}
                      title={masteredIds.has(q.id) ? 'Mastered' : 'Mark as Mastered'}
                    >
                      <BookmarkCheck className="w-4 h-4" />
                    </button>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">
                    "{q.question}"
                  </h4>

                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {q.answer}
                  </p>
                </div>

                {q.practicalTip && (
                  <div className="text-[11px] text-sky-900 bg-sky-50/70 p-2.5 rounded-lg border border-sky-100 mt-2">
                    <span className="font-semibold text-sky-800">Faculty Tip:</span> {q.practicalTip}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
