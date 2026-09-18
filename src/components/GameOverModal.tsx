import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../utils/soundEngine';
import { FlipFish } from './FlipFish';
import { Trophy, Heart, RotateCcw, ArrowRight, Sparkles, Smile } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  isVictory: boolean;
  score: {
    progressPct: number;
    totalDamage: number;
    enemiesDefeated: number;
    remainingHp: number;
  };
  onRestart: () => void;
  onNextMap?: () => void;
  hasNextMap?: boolean;
  onOpenLounge?: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  isVictory,
  score,
  onRestart,
  onNextMap,
  hasNextMap,
  onOpenLounge
}) => {
  useEffect(() => {
    if (!isOpen) return;

    if (isVictory) {
      soundEngine.playVictory();
      // Burst celebratory confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 400);
    }
  }, [isOpen, isVictory]);

  if (!isOpen) return null;

  return (
    <div
      id="game-over-overlay"
      className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
    >
      <div
        id="game-over-modal"
        className="bg-white rounded-3xl max-w-md w-full border border-stone-200 shadow-2xl overflow-hidden text-center p-6 space-y-5"
      >
        {/* Victory / Comforting Header with Flip Fish */}
        <div className="space-y-3">
          <div className="w-20 h-20 mx-auto flex items-center justify-center">
            <FlipFish pose={isVictory ? 'victory' : 'sweat'} size={76} />
          </div>

          <h2 className="text-xl font-extrabold text-stone-800">
            {isVictory ? '🎉 功德圓滿！老師辛苦了，今天好好放假！' : '沒關係的老師，我們再來一次'}
          </h2>

          <p className="text-xs text-stone-600 px-3 leading-relaxed">
            {isVictory
              ? '「一朝沐杏雨，一生念師恩。」您成功穿過了如雪片般的公文海、突發狀況與校事會議調查風暴！今天請暫時放下紅筆與教案，好好享受專屬於您的美好節日！'
              : '沒關係的老師，我們再來一次'}
          </p>
        </div>

        {/* Morale Stats */}
        <div className="grid grid-cols-2 gap-2 bg-stone-50 p-3 rounded-2xl border border-stone-200 text-xs">
          <div className="p-2 bg-white rounded-xl border border-stone-100">
            <span className="text-[10px] text-stone-400 block">學期挺進進度</span>
            <span className="font-extrabold text-emerald-700 text-sm">
              {Math.min(100, Math.round(score.progressPct))}%
            </span>
          </div>
          <div className="p-2 bg-white rounded-xl border border-stone-100">
            <span className="text-[10px] text-stone-400 block">化解校園難題</span>
            <span className="font-extrabold text-stone-800 text-sm">
              {score.enemiesDefeated} 件
            </span>
          </div>
          <div className="p-2 bg-white rounded-xl border border-stone-100">
            <span className="text-[10px] text-stone-400 block">消除行政焦慮</span>
            <span className="font-extrabold text-amber-600 text-sm">
              {Math.round(score.totalDamage)} 點
            </span>
          </div>
          <div className="p-2 bg-white rounded-xl border border-stone-100">
            <span className="text-[10px] text-stone-400 block">剩餘心靈韌性</span>
            <span className="font-extrabold text-rose-600 text-sm">
              {score.remainingHp} %
            </span>
          </div>
        </div>

        {/* Teacher's Day Greeting Ribbon (參考台灣水月問路與 Pinkoi 教師節暖心佳句) */}
        <div className="p-3 bg-gradient-to-r from-rose-50 to-amber-50 rounded-2xl border border-rose-200/70 text-xs text-stone-700 leading-relaxed font-medium">
          <span className="font-bold text-rose-600">💌 台灣教師節暖心祝福：</span>
          <br />
          {isVictory
            ? '「桃李不言，下自成蹊。感謝老師一路以來的循循善誘與耐心包容，願所有的辛勞都化為甘霖，平安順心！」'
            : '「經師易遇，人師難遭。謝謝您總是溫柔接住徬徨的孩子，但今天請先溫柔接住疲憊的自己。」'}
        </div>

        {/* Buttons */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <button
              id="restart-game-btn"
              onClick={onRestart}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isVictory ? '🏖️ 開心放假！再玩一局' : '🔄 再來一次'}</span>
            </button>

            {isVictory && hasNextMap && onNextMap && (
              <button
                id="next-map-btn"
                onClick={onNextMap}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <span>迎接新學期挑戰</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {onOpenLounge && (
            <button
              id="gameover-open-lounge-btn"
              onClick={onOpenLounge}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-sky-50 to-amber-50 hover:from-sky-100 hover:to-amber-100 border border-sky-300 text-sky-900 text-xs font-black transition-all cursor-pointer shadow-xs"
            >
              <span>☕ 前往茶水間：寫句便利貼，領取【🧊 冰冰冰冰冰冰繃】+1 次！</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
