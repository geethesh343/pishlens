import React, { useState, useEffect } from 'react';
import { SLIDES_DATA } from '../data/presentationData';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  HelpCircle,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';

interface SpeakerCoachProps {
  initialSlideId?: number;
  onJumpToSlide: (slideId: number) => void;
}

export const SpeakerCoach: React.FC<SpeakerCoachProps> = ({
  initialSlideId = 1,
  onJumpToSlide,
}) => {
  const [selectedSlideId, setSelectedSlideId] = useState<number>(initialSlideId);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [studentNotes, setStudentNotes] = useState<Record<number, string>>(() => {
    try {
      const saved = localStorage.getItem('phishlens_speaker_notes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const slide = SLIDES_DATA.find(s => s.id === selectedSlideId) || SLIDES_DATA[0];

  // Calculate estimated speaking time at average conversational speed of 130 words per minute
  const wordCount = slide.spokenScript.trim().split(/\s+/).length;
  const estimatedSeconds = Math.round((wordCount / 130) * 60);

  // Web Speech API text-to-speech rehearsal helper
  const handleToggleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(slide.spokenScript);
      utterance.rate = 0.95; // slightly deliberate presentation pace
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [selectedSlideId]);

  const handleCopyScript = () => {
    navigator.clipboard.writeText(slide.spokenScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNoteChange = (text: string) => {
    const updated = { ...studentNotes, [slide.id]: text };
    setStudentNotes(updated);
    try {
      localStorage.setItem('phishlens_speaker_notes', JSON.stringify(updated));
    } catch {
      // storage unavailable
    }
  };

  const nextSlide = () => {
    if (selectedSlideId < SLIDES_DATA.length) {
      setSelectedSlideId(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (selectedSlideId > 1) {
      setSelectedSlideId(prev => prev - 1);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Presenter's Teleprompter & Speech Coach
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Word-for-word presentation delivery scripts, transition cues, and timing indicators for each slide.
          </p>
        </div>

        {/* Slide Selector Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {SLIDES_DATA.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedSlideId(s.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                s.id === selectedSlideId
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Slide {s.id}
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column Split: Script / Teleprompter on Left, Context & Notes on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Word-for-Word Spoken Script */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          {/* Header of teleprompter */}
          <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-700 bg-sky-100/80 px-2.5 py-1 rounded-md">
                Slide 0{slide.id} Delivery Script
              </span>
              <div className="flex items-center gap-1 text-xs text-slate-500 font-mono">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{wordCount} words (~{estimatedSeconds}s)</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleSpeak}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  isSpeaking
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
                title="Listen to automated speech rehearsal"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-amber-600" />
                    <span>Stop Reading</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-sky-600" />
                    <span>Listen Aloud</span>
                  </>
                )}
              </button>

              <button
                onClick={handleCopyScript}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                title="Copy script to clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Spoken Text Canvas */}
          <div className="p-6 sm:p-8 space-y-5 bg-white">
            <div className="text-xs uppercase font-semibold tracking-wider text-slate-400">
              What You Should Speak to Faculty:
            </div>

            <div className="space-y-4 text-base sm:text-lg text-slate-800 leading-relaxed font-sans">
              {slide.spokenScript.split('\n\n').map((paragraph, pIdx) => (
                <p key={pIdx} className="bg-slate-50/70 p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Transition Hook */}
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-800">
                Smooth Slide Transition Cue:
              </span>
              <p className="text-sm font-semibold text-sky-950 italic">
                {slide.transitionCue}
              </p>
            </div>
          </div>

          {/* Stepper Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={prevSlide}
              disabled={selectedSlideId === 1}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Slide</span>
            </button>

            <button
              onClick={() => onJumpToSlide(slide.id)}
              className="text-xs text-sky-700 font-semibold hover:underline"
            >
              Switch to Audience Slide View
            </button>

            <button
              onClick={nextSlide}
              disabled={selectedSlideId === SLIDES_DATA.length}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              <span>Next Slide</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Slide Context, Faculty Alert & Personal Notes */}
        <div className="lg:col-span-4 space-y-6">
          {/* Slide Objective Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">
              Slide Goal & Objective
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              {slide.title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {slide.purpose}
            </p>
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] font-semibold text-sky-800 uppercase tracking-wide block mb-1">
                Core Takeaway to Emphasize:
              </span>
              <p className="text-xs text-slate-700 font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                "{slide.keyTakeaway}"
              </p>
            </div>
          </div>

          {/* Anticipated Faculty Question Alert */}
          {slide.anticipatedQuestion && (
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>Anticipated Faculty Question</span>
              </div>
              <p className="text-xs font-semibold text-slate-900 bg-white p-2.5 rounded-lg border border-amber-100">
                "{slide.anticipatedQuestion.question}"
              </p>
              <div>
                <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wide block mb-1">
                  How to Answer:
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {slide.anticipatedQuestion.answer}
                </p>
              </div>
            </div>
          )}

          {/* Important Presentation Guardrails */}
          <div className="bg-rose-50/80 border border-rose-200 rounded-2xl p-4 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>Defense Alert: Never Claim 100% Accuracy</span>
            </div>
            <p className="text-xs text-rose-800 leading-relaxed">
              Never tell faculty that PhishLens "guarantees" safety or has 100% accuracy. Always state that ML predicts risk probabilistically to guide users.
            </p>
          </div>

          {/* Student's Custom Rehearsal Notes */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Your Practice Notes (Slide {slide.id})
              </span>
              <span className="text-[10px] text-slate-400">Auto-saved</span>
            </div>
            <textarea
              value={studentNotes[slide.id] || ''}
              onChange={e => handleNoteChange(e.target.value)}
              placeholder="Jot down reminders (e.g. 'Speak slower here', 'Point to the IP host on screen')..."
              rows={4}
              className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
