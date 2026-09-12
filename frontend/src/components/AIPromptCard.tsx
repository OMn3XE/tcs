import React, { useState } from 'react';
import { Sparkles, Mic, Send, MicOff, Camera, X, CheckCircle2 } from 'lucide-react';
import { QUICK_PROMPT_CHIPS } from '../data/mockData';
import { CameraMoodModal } from './CameraMoodModal';

interface AIPromptCardProps {
  onSearchSubmit: (promptText: string, mood?: string | null, moodConfidence?: number | null) => void;
  isProcessing?: boolean;
}

export const AIPromptCard: React.FC<AIPromptCardProps> = ({ onSearchSubmit, isProcessing = false }) => {
  const [promptText, setPromptText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  
  const [confirmedMood, setConfirmedMood] = useState<string | null>(null);
  const [confirmedConfidence, setConfirmedConfidence] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim() || isProcessing) return;
    onSearchSubmit(promptText.trim(), confirmedMood, confirmedConfidence);
  };

  const handleChipClick = (prompt: string) => {
    setPromptText(prompt);
    onSearchSubmit(prompt, confirmedMood, confirmedConfidence);
  };

  const toggleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Browser Speech API fallback simulation
      if (!isListening) {
        setIsListening(true);
        setPromptText('Listening...');
        setTimeout(() => {
          setPromptText('I have ₹80, I am very hungry, want something spicy and only have 15 minutes.');
          setIsListening(false);
        }, 2200);
      } else {
        setIsListening(false);
        setPromptText('');
      }
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((res: any) => res[0].transcript)
          .join('');
        setPromptText(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
      }
    } catch (err) {
      console.warn('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  const handleMoodConfirmed = (mood: string, confidence: number) => {
    setConfirmedMood(mood);
    setConfirmedConfidence(confidence);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-md p-6 sm:p-8 mb-8 transition-all hover:border-emerald-200">
      {/* Subtle background glow */}
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-emerald-100/60 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-teal-100/50 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10">
        {/* Header Title */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
              <Sparkles className="w-5 h-5 text-emerald-600 animate-spin-slow" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              What do you want to eat today?
            </h2>
          </div>

          {/* Camera Mood Button Trigger */}
          <button
            type="button"
            onClick={() => setIsCameraOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-all shadow-xs"
          >
            <Camera className="w-3.5 h-3.5 text-emerald-400" />
            <span>Detect Mood</span>
          </button>
        </div>

        <p className="text-slate-500 text-sm mb-4 font-medium">
          Tell CanteenAI your budget, mood, cravings or time limit via Text, Voice or Facial Expression.
        </p>

        {/* Confirmed Facial Mood Signal Badge */}
        {confirmedMood && (
          <div className="mb-4 flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Confirmed Mood Signal: <strong>{confirmedMood}</strong> ({((confirmedConfidence || 0.85) * 100).toFixed(0)}% confidence)</span>
            </div>
            <button
              onClick={() => {
                setConfirmedMood(null);
                setConfirmedConfidence(null);
              }}
              className="text-slate-400 hover:text-slate-700"
              title="Clear mood signal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="relative mb-6">
          <div
            className={`flex items-center rounded-2xl bg-slate-50 border transition-all duration-200 ${
              isListening
                ? 'border-emerald-500 ring-4 ring-emerald-100 bg-white'
                : 'border-slate-300 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100/60 focus-within:bg-white shadow-inner'
            }`}
          >
            <input
              type="text"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="e.g. I have ₹80 and 15 minutes. Suggest something spicy..."
              className="w-full py-4 pl-5 pr-28 bg-transparent text-slate-900 placeholder:text-slate-400 text-sm sm:text-base font-medium focus:outline-none"
              disabled={isProcessing}
            />

            <div className="flex items-center gap-1.5 pr-3">
              {/* Camera Icon in Input Bar */}
              <button
                type="button"
                onClick={() => setIsCameraOpen(true)}
                className="p-2 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-slate-200/60 transition-all"
                title="Detect facial mood using camera"
              >
                <Camera className="w-5 h-5" />
              </button>

              {/* Mic Icon */}
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`p-2 rounded-xl transition-all ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200/60'
                }`}
                title={isListening ? 'Stop listening' : 'Voice input'}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!promptText.trim() || isProcessing}
                className={`p-2.5 rounded-xl font-medium transition-all duration-200 flex items-center justify-center ${
                  promptText.trim() && !isProcessing
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/30 scale-100 hover:scale-105 active:scale-95'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {isListening && (
            <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-emerald-600 pl-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              🎙 Listening to your speech... Say your budget & food preferences.
            </div>
          )}
        </form>

        {/* Quick Suggestion Chips */}
        <div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
            Quick Prompts
          </div>
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPT_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleChipClick(chip.prompt)}
                disabled={isProcessing}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100/80 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-slate-200 text-slate-700 text-xs font-medium transition-all hover:shadow-xs active:scale-95"
              >
                <span>{chip.icon}</span>
                <span>{chip.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Camera Mood Modal */}
      <CameraMoodModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onMoodConfirmed={handleMoodConfirmed}
      />
    </div>
  );
};
