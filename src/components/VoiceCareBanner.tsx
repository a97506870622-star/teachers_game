import React, { useState, useEffect } from 'react';
import { VoiceCareMessage } from '../types';
import { speechEngine } from '../utils/speechEngine';
import { FlipFish } from './FlipFish';
import { Volume2, VolumeX, Heart, Sparkles, X, RotateCcw } from 'lucide-react';

interface VoiceCareBannerProps {
  message: VoiceCareMessage | null;
  onDismiss: () => void;
  onOpenLounge?: () => void;
}

export const VoiceCareBanner: React.FC<VoiceCareBannerProps> = ({
  message,
  onDismiss,
  onOpenLounge
}) => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(speechEngine.getIsMuted());
  const [liked, setLiked] = useState<boolean>(false);

  useEffect(() => {
    const unsub = speechEngine.subscribeSpeakingState(speaking => {
      setIsSpeaking(speaking);
    });
    return () => unsub();
  }, []);

  // When a new message comes in, play voice automatically if not muted, and auto-dismiss after 2 seconds
  useEffect(() => {
    if (message) {
      setLiked(false);
      if (!speechEngine.getIsMuted()) {
        speechEngine.speak(message.voiceText || message.text);
      }

      // Auto dismiss banner after 2s as requested
      const timer = setTimeout(() => {
        onDismiss();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [message, onDismiss]);

  if (!message) return null;

  const handleReplay = () => {
    speechEngine.speak(message.voiceText || message.text);
  };

  const handleToggleVoice = () => {
    const next = !isVoiceMuted;
    setIsVoiceMuted(next);
    speechEngine.setMuted(next);
  };

  return (
    <div
      id="voice-care-banner"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[94%] max-w-2xl z-40 animate-in fade-in slide-in-from-bottom-5 duration-300 pointer-events-auto"
    >
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-rose-200/80 p-4 shadow-xl shadow-rose-100/50 flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
        {/* Warm Avatar with Flip Fish */}
        <div className="relative shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 shadow-xs">
          <FlipFish pose={isSpeaking ? 'love' : 'teaching'} size={42} />
          {isSpeaking && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
            </span>
          )}
        </div>

        {/* Text content */}
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-sky-700 tracking-wide flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              {message.author}
            </span>
            <span className="text-[10px] text-stone-400 font-medium">· 翻轉魚暖心語音關懷</span>
            {isSpeaking && (
              <span className="text-[10px] text-sky-600 font-bold flex items-center gap-1">
                <span>🔊 溫暖播音中</span>
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-stone-800 leading-relaxed select-text">
            {message.text}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          {/* Heart like button */}
          <button
            id="voice-care-heart-btn"
            onClick={() => setLiked(!liked)}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              liked ? 'bg-rose-100 text-rose-600 scale-110' : 'bg-stone-100 text-stone-400 hover:text-rose-500'
            }`}
            title="收藏這份溫暖"
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
          </button>

          {/* Replay voice button */}
          <button
            id="voice-care-replay-btn"
            onClick={handleReplay}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200/80 cursor-pointer transition-colors"
            title="再次朗讀語音"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>重聽</span>
          </button>

          {/* Quick Draw Card / Lounge Link */}
          {onOpenLounge && (
            <button
              id="voice-care-open-lounge-btn"
              onClick={() => {
                onDismiss();
                onOpenLounge();
              }}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-50 to-rose-50 hover:from-amber-100 hover:to-rose-100 text-amber-900 text-xs font-black border border-amber-300 cursor-pointer transition-colors shadow-xs"
              title="前往茶水間抽取舒壓小卡與看留言"
            >
              <span>🎴 抽小卡</span>
            </button>
          )}

          {/* Voice Mute Toggle */}
          <button
            id="voice-care-mute-btn"
            onClick={handleToggleVoice}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 cursor-pointer transition-colors"
            title={isVoiceMuted ? '取消語音靜音' : '靜音語音提示'}
          >
            {isVoiceMuted ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-stone-700" />}
          </button>

          {/* Auto dismiss countdown badge */}
          <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-stone-100/80 text-stone-400 text-[10px] font-bold">
            <span>⏱️ 2s 後自動消失</span>
          </div>

          {/* Manual dismiss / close button */}
          <button
            id="voice-care-dismiss-btn"
            onClick={onDismiss}
            className="p-2 rounded-xl bg-stone-100 hover:bg-rose-100 hover:text-rose-600 text-stone-500 cursor-pointer transition-colors"
            title="關閉此提示"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
