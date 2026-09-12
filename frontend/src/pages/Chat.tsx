import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Mic, MicOff, Bot, User as UserIcon, RefreshCw, Camera, CheckCircle2 } from 'lucide-react';
import type { ChatMessage, FoodItem, UserPreferences } from '../types';
import { fetchRecommendationsAPI } from '../services/api';
import { INITIAL_FOOD_ITEMS } from '../data/mockData';
import { RecommendationCard } from '../components/RecommendationCard';
import { CameraMoodModal } from '../components/CameraMoodModal';

interface ChatPageProps {
  userPrefs: UserPreferences;
  foodItems: FoodItem[];
  onViewFoodDetail: (food: FoodItem) => void;
  onToggleFavorite: (foodId: string) => void;
}

export const ChatPage: React.FC<ChatPageProps> = ({
  userPrefs,
  foodItems: _foodItems,
  onViewFoodDetail,
  onToggleFavorite,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'user',
      text: "I have ₹80, I'm very hungry, want something spicy and only have 15 minutes.",
      timestamp: '12:04 PM',
    },
    {
      id: 'm2',
      sender: 'ai',
      text: "Got it! You have a ₹80 budget, want something spicy, and need something quick.\n\nI recommend:\n🌯 Chicken Roll — ₹50\n🍟 Masala Fries — ₹25\n\nTotal: ₹75 | Preparation time: 10 minutes | Match: 92%\n\nWhy this works:\n• Within your ₹80 budget\n• Spicy preference matched\n• Ready within 15 minutes\n• Currently available live at Counter 2",
      timestamp: '12:04 PM',
      recommendations: [
        {
          id: 'rec-chat-sample',
          title: '🌯 Chicken Roll + Masala Fries Combo',
          primaryFood: INITIAL_FOOD_ITEMS[0], // Chicken Roll ₹50
          sideFood: INITIAL_FOOD_ITEMS[1],    // Masala Fries ₹25
          totalPrice: 75,
          savings: 5,
          matchScore: 92,
          badges: ['✓ Within budget', '✓ Available now', '✓ 10 min prep', '🌶 Spicy'],
          explanation: 'This combination gives you maximum flavor and spicy crunch while saving ₹5.',
          reasoningDetails: [
            'Chicken Roll (₹50) fits spicy preference & fast 10 min prep.',
            'Masala Fries (₹25) adds extra crunch while leaving ₹5 under your ₹80 budget.',
            'Both items currently available live at Counter 2.'
          ],
          prepTimeTotal: 10,
        }
      ],
      quickActions: ['Show vegetarian options', 'Something cheaper under ₹50', 'Show drinks'],
    }
  ]);

  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const [confirmedMood, setConfirmedMood] = useState<string | null>(null);
  const [confirmedConfidence, setConfirmedConfidence] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isThinking) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    try {
      // Send query + confirmed mood signal to Backend API
      const apiRes = await fetchRecommendationsAPI(query, confirmedMood, confirmedConfidence, userPrefs);

      let aiText = `Got it! Based on your target budget, prep time window, and canteen availability:`;
      if (confirmedMood) {
        aiText = `Factored in your confirmed mood (${confirmedMood}). Here is your top match:`;
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendations: apiRes.recommendation ? [apiRes.recommendation] : [],
        quickActions: [
          'Show vegetarian options',
          'Something cheaper under ₹50',
          'Show cooling drinks'
        ],
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsThinking(false);
    }
  };

  const toggleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      if (!isListening) {
        setIsListening(true);
        setInput('Listening...');
        setTimeout(() => {
          setInput('I have ₹80, very hungry, want something spicy in 15 minutes.');
          setIsListening(false);
        }, 2200);
      } else {
        setIsListening(false);
        setInput('');
      }
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results).map((res: any) => res[0].transcript).join('');
        setInput(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      if (isListening) recognition.stop();
      else recognition.start();
    } catch (err) {
      console.warn(err);
      setIsListening(false);
    }
  };

  const handleMoodConfirmed = (mood: string, confidence: number) => {
    setConfirmedMood(mood);
    setConfirmedConfidence(confidence);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] bg-white rounded-2xl border border-slate-200/80 shadow-md overflow-hidden animate-fade-in">
      {/* Assistant Header */}
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Bot className="w-6 h-6 animate-pulse-subtle" />
          </div>
          <div>
            <h2 className="font-bold text-base text-white tracking-tight flex items-center gap-2">
              <span>CanteenAI Assistant</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </h2>
            <p className="text-xs text-slate-400">
              Multimodal College Food Recommendation Engine (Text • Voice • Facial Mood)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCameraOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Detect Mood</span>
          </button>

          <button
            onClick={() => setMessages([])}
            className="p-2 text-slate-400 hover:text-white transition-colors"
            title="Reset conversation"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Confirmed Mood Pill Banner if active */}
      {confirmedMood && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2 text-xs font-bold text-emerald-900 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Active Facial Mood Signal: <strong>{confirmedMood}</strong> ({((confirmedConfidence || 0.85) * 100).toFixed(0)}% confidence)</span>
          </div>
          <button
            onClick={() => {
              setConfirmedMood(null);
              setConfirmedConfidence(null);
            }}
            className="text-slate-400 hover:text-slate-700 underline text-[11px]"
          >
            Clear Mood
          </button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-3xl ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white'
                  : 'bg-emerald-600 text-white shadow-sm'
              }`}
            >
              {msg.sender === 'user' ? <UserIcon className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>

            {/* Bubble Content */}
            <div className="space-y-3 max-w-xl">
              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                  msg.sender === 'user'
                    ? 'bg-slate-900 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200/80 shadow-xs rounded-tl-none font-medium'
                }`}
              >
                <p>{msg.text}</p>
                <span
                  className={`text-[10px] block mt-1.5 text-right ${
                    msg.sender === 'user' ? 'text-slate-400' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>

              {/* Embedded Recommendation Cards inside Chat */}
              {msg.recommendations && msg.recommendations.map((rec) => (
                <div key={rec.id} className="mt-2">
                  <RecommendationCard
                    recommendation={rec}
                    onViewFoodDetail={onViewFoodDetail}
                    onToggleFavorite={() => onToggleFavorite(rec.id)}
                  />
                </div>
              ))}

              {/* Quick Action Chips */}
              {msg.quickActions && msg.quickActions.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {msg.quickActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(action)}
                      className="px-3 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition-all hover:scale-105 active:scale-95"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* AI Typing Indicator */}
        {isThinking && (
          <div className="flex gap-3 max-w-xl">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-500 text-xs font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>CanteenAI backend engine is scoring menu options...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Multimodal Input Bar */}
      <div className="p-4 bg-white border-t border-slate-200 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1 flex items-center bg-slate-100 rounded-2xl border border-slate-200 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask CanteenAI... e.g. I have ₹80 and 15 minutes. Suggest something spicy..."
              className="w-full py-3.5 pl-4 pr-24 bg-transparent text-sm text-slate-900 focus:outline-none font-medium"
            />
            
            <div className="absolute right-3 flex items-center gap-1">
              {/* Camera Icon */}
              <button
                type="button"
                onClick={() => setIsCameraOpen(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors"
                title="Detect mood with Camera"
              >
                <Camera className="w-5 h-5" />
              </button>

              {/* Mic Icon */}
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`p-1.5 rounded-lg transition-all ${
                  isListening ? 'text-rose-600 animate-pulse' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Voice input"
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!input.trim() || isThinking}
            className={`p-3.5 rounded-2xl font-bold transition-all ${
              input.trim() && !isThinking
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
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
