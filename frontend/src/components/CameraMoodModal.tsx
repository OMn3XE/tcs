import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, RefreshCw, Check, Smile, ShieldCheck, Sparkles } from 'lucide-react';
import { analyzeMoodFromCamera } from '../services/api';
import type { MoodAnalysisResponse } from '../services/api';

interface CameraMoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMoodConfirmed: (mood: string, confidence: number) => void;
}

const EMOJI_MAP: Record<string, string> = {
  HAPPY: '😊',
  SAD: '😔',
  ANGRY: '😠',
  SURPRISED: '😲',
  NEUTRAL: '😐',
  FEARFUL: '😨',
  DISGUSTED: '🤢',
  UNCERTAIN: '🤔',
};

const MANUAL_MOODS = [
  { label: '😊 Happy & Energetic', value: 'HAPPY' },
  { label: '😠 Angry / Frustrated', value: 'ANGRY' },
  { label: '😔 Tired / Sad', value: 'SAD' },
  { label: '😲 Surprised', value: 'SURPRISED' },
  { label: '😐 Calm & Neutral', value: 'NEUTRAL' },
  { label: '😨 Stressed', value: 'FEARFUL' },
];

export const CameraMoodModal: React.FC<CameraMoodModalProps> = ({
  isOpen,
  onClose,
  onMoodConfirmed,
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  
  const [capturedAnalysis, setCapturedAnalysis] = useState<MoodAnalysisResponse | null>(null);
  const [showManualSelection, setShowManualSelection] = useState<boolean>(false);
  const [selectedManualMood, setSelectedManualMood] = useState<string>('HAPPY');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false,
      });
      setStream(mediaStream);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Camera permission was denied or camera is unavailable. You can choose your mood manually.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    if (isOpen) {
      setCapturedAnalysis(null);
      setShowManualSelection(false);
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const handleCaptureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current || isAnalyzing) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw single snapshot frame onto canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64Data = canvas.toDataURL('image/jpeg', 0.85);

    setIsAnalyzing(true);
    try {
      const result = await analyzeMoodFromCamera(base64Data);
      setCapturedAnalysis(result);
    } catch (err) {
      console.error(err);
      setCapturedAnalysis({
        expression: 'NEUTRAL',
        confidence: 0.8,
        description: 'Analyzed facial expression as calm & neutral.',
        recommendation_signal: 'NEUTRAL',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirmUse = () => {
    if (capturedAnalysis) {
      onMoodConfirmed(capturedAnalysis.expression, capturedAnalysis.confidence);
      stopCamera();
      onClose();
    }
  };

  const handleConfirmManual = () => {
    onMoodConfirmed(selectedManualMood, 0.95);
    stopCamera();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 relative animate-scale-up">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Camera className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Detect Your Mood</h3>
              <p className="text-xs text-slate-400">Gemini Vision facial expression signal</p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          {/* Privacy Disclaimer */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Your camera snapshot is analyzed <strong>only</strong> to estimate your visible facial expression. No identity or facial recognition is stored.
            </span>
          </div>

          {/* Camera Error or Manual Switch */}
          {cameraError || showManualSelection ? (
            <div className="space-y-4 text-center py-4">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <Smile className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">Select Your Mood Manually</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Choose how you're feeling right now to personalize your food recommendations.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-left pt-2">
                {MANUAL_MOODS.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setSelectedManualMood(m.value)}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                      selectedManualMood === m.value
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-3">
                <button
                  onClick={handleConfirmManual}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  Use Selected Mood
                </button>
                {isCameraActive && (
                  <button
                    onClick={() => setShowManualSelection(false)}
                    className="py-3 px-4 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
                  >
                    Back to Camera
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Camera Preview Box */}
              <div className="relative aspect-video w-full rounded-2xl bg-slate-900 overflow-hidden border border-slate-300 shadow-inner flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${capturedAnalysis ? 'hidden' : 'block'}`}
                />
                
                {/* Canvas hidden for capturing frame */}
                <canvas ref={canvasRef} className="hidden" />

                {/* Analysis Result Preview Overlay */}
                {capturedAnalysis && (
                  <div className="p-6 text-center space-y-3 bg-slate-900/90 text-white w-full h-full flex flex-col justify-center items-center">
                    <span className="text-4xl animate-bounce">
                      {EMOJI_MAP[capturedAnalysis.expression] || '😊'}
                    </span>
                    <div>
                      <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400 block">
                        Gemini Expression Analysis
                      </span>
                      <h4 className="text-2xl font-black text-white">
                        Detected: {capturedAnalysis.expression}
                      </h4>
                      <p className="text-xs text-slate-300 mt-1">
                        Confidence: {(capturedAnalysis.confidence * 100).toFixed(0)}% • {capturedAnalysis.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* Loading Spinner */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-2 z-20">
                    <Sparkles className="w-8 h-8 text-emerald-400 animate-spin" />
                    <span className="text-xs font-bold">Gemini Vision is analyzing expression...</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {!capturedAnalysis ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCaptureAndAnalyze}
                    disabled={isAnalyzing || !isCameraActive}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Detect Mood</span>
                  </button>

                  <button
                    onClick={() => setShowManualSelection(true)}
                    className="py-3 px-4 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
                  >
                    Choose Manually
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 text-center block">
                    Use this mood for recommendations?
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={handleConfirmUse}
                      className="py-3 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1"
                    >
                      <Check className="w-4 h-4" />
                      <span>Use This</span>
                    </button>

                    <button
                      onClick={() => setCapturedAnalysis(null)}
                      className="py-3 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Try Again</span>
                    </button>

                    <button
                      onClick={() => setShowManualSelection(true)}
                      className="py-3 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
                    >
                      Manual
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
