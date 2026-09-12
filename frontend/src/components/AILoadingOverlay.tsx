import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface AILoadingOverlayProps {
  steps?: string[];
  onComplete?: () => void;
}

const DEFAULT_STEPS = [
  "Analyzing today's menu...",
  "Checking live kitchen availability...",
  "Finding the best combination...",
  "Optimizing for your budget & time..."
];

export const AILoadingOverlay: React.FC<AILoadingOverlayProps> = ({
  steps = DEFAULT_STEPS,
  onComplete,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          if (onComplete) onComplete();
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(interval);
  }, [steps, onComplete]);

  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white p-8 border border-emerald-500/30 shadow-2xl relative overflow-hidden mb-8">
      {/* Subtle pulsing background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>

      <div className="relative z-10 max-w-lg mx-auto text-center space-y-6">
        {/* Futuristic Glowing AI Spinner Icon */}
        <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping"></div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/40 relative z-10">
            <Sparkles className="w-7 h-7 text-white animate-spin-slow" />
          </div>
        </div>

        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400 mb-1 inline-block">
            CanteenAI Neural Engine
          </span>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Synthesizing Perfect Match
          </h3>
        </div>

        {/* Step-by-Step Progressive Log */}
        <div className="bg-slate-900/80 backdrop-blur-md rounded-xl p-4 border border-slate-800 text-left space-y-2.5">
          {steps.map((stepText, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 text-xs transition-all duration-300 ${
                  isDone
                    ? 'text-emerald-400 font-medium opacity-80'
                    : isCurrent
                    ? 'text-white font-bold text-sm scale-102'
                    : 'text-slate-600 opacity-40'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin shrink-0"></span>
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full border border-slate-700 shrink-0"></span>
                )}
                <span>{stepText}</span>
              </div>
            );
          })}
        </div>

        {/* Shimmer Bar */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-300 transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};
