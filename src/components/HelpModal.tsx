import React from 'react';
import { X, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { FlipFish } from './FlipFish';

export type HelpTabType = 'tutorial' | 'towers' | 'monsters' | 'items' | 'synergy';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: HelpTabType;
}

export const HelpModal: React.FC<HelpModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="help-modal-overlay"
      className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 animate-in fade-in duration-200"
    >
      <div
        id="help-modal"
        className="bg-white rounded-3xl max-w-2xl w-full border border-stone-200 shadow-2xl overflow-hidden p-5 flex flex-col justify-between"
      >
        {/* Header (No scroll) */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
              <FlipFish pose="normal" size={28} />
            </div>
            <div>
              <h3 className="text-base font-black text-stone-900 flex items-center gap-1.5">
                <span>📖 老師生存守則：3 步極簡玩法</span>
              </h3>
              <p className="text-[11px] text-stone-500 font-medium">
                一秒看懂如何守護教育熱忱，不用滑動！
              </p>
            </div>
          </div>

          <button
            id="help-close-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
            title="關閉指南"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3-Step Simple Cards (Horizontal 3 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3.5">
          {/* Step 1 */}
          <div className="bg-stone-50 hover:bg-amber-50/40 p-3.5 rounded-2xl border border-stone-200 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center">
                  1
                </span>
                <span className="text-[11px] font-bold text-stone-400">鍵盤 1~5</span>
              </div>
              <h4 className="text-xs font-black text-stone-800 mb-1">
                擺設 5 大教具
              </h4>
              <p className="text-[11.5px] text-stone-600 leading-relaxed">
                點擊下方或按數字鍵 1-5，在空白格上放置教具，全自動抵禦走廊衝過來的公文與壓力怪物。
              </p>
            </div>
            <div className="mt-2 text-[10.5px] font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-lg text-center">
              阻斷壓力逼近
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-stone-50 hover:bg-emerald-50/40 p-3.5 rounded-2xl border border-stone-200 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                  2
                </span>
                <span className="text-[11px] font-bold text-stone-400">升級 ＆ 光環</span>
              </div>
              <h4 className="text-xs font-black text-stone-800 mb-1">
                升級解鎖終極技
              </h4>
              <p className="text-[11.5px] text-stone-600 leading-relaxed">
                點擊場上教具可升級解鎖專屬神技！擺齊 5 種教具立即觸發「五育協同」全體攻速與射程爆發光環！
              </p>
            </div>
            <div className="mt-2 text-[10.5px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-lg text-center">
              湊滿5種攻速大增
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-stone-50 hover:bg-sky-50/40 p-3.5 rounded-2xl border border-stone-200 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-6 h-6 rounded-full bg-sky-600 text-white font-black text-xs flex items-center justify-center">
                  3
                </span>
                <span className="text-[11px] font-bold text-stone-400">右下 2 大神技</span>
              </div>
              <h4 className="text-xs font-black text-stone-800 mb-1">
                急凍佈防 ＆ 鐵拳消除
              </h4>
              <p className="text-[11.5px] text-stone-600 leading-relaxed">
                <strong>🧊 冰冰冰冰冰冰繃</strong>：全場急凍魔王 7 秒趕快佈防！<br />
                <strong>🥊 法律鐵拳</strong>：依法直接大消除所有魔王！
              </p>
            </div>
            <div className="mt-2 text-[10.5px] font-bold text-sky-700 bg-sky-100/70 px-2 py-0.5 rounded-lg text-center">
              危急時刻必按
            </div>
          </div>
        </div>

        {/* 5 Core Towers Quick Reference (Compact Row) */}
        <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 my-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-stone-800 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              5 大核心教具特質速查：
            </span>
            <span className="text-[10px] text-stone-400">鍵盤快速鍵 #1 ~ #5</span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 text-center">
            <div className="bg-white p-2 rounded-xl border border-stone-200">
              <span className="text-base block">🖊️</span>
              <span className="text-[11px] font-black text-stone-800 block">紅筆批改</span>
              <span className="text-[10px] text-rose-600 font-bold block">神速精準</span>
              <span className="text-[9px] text-stone-400 block">剋作業焦慮</span>
            </div>

            <div className="bg-white p-2 rounded-xl border border-stone-200">
              <span className="text-base block">✨</span>
              <span className="text-[11px] font-black text-stone-800 block">彩虹粉筆</span>
              <span className="text-[10px] text-amber-600 font-bold block">聚焦光束</span>
              <span className="text-[9px] text-stone-400 block">剋難纏公文</span>
            </div>

            <div className="bg-white p-2 rounded-xl border border-stone-200">
              <span className="text-base block">🌿</span>
              <span className="text-[11px] font-black text-emerald-800 block">精油按摩</span>
              <span className="text-[10px] text-emerald-600 font-bold block">肩頸深層舒壓</span>
              <span className="text-[9px] text-stone-400 block">消除疲憊退敵</span>
            </div>

            <div className="bg-white p-2 rounded-xl border border-stone-200">
              <span className="text-base block">🍬</span>
              <span className="text-[11px] font-black text-rose-800 block">舒喉潤喉糖</span>
              <span className="text-[10px] text-amber-600 font-bold block">第4高．護嗓減速</span>
              <span className="text-[9px] text-stone-400 block">清涼軟化敵防</span>
            </div>

            <div className="bg-white p-2 rounded-xl border border-amber-300 bg-gradient-to-b from-amber-50/60 to-white">
              <span className="text-base block">🌟</span>
              <span className="text-[11px] font-black text-amber-900 block">翻轉教育資源</span>
              <span className="text-[10px] text-purple-600 font-bold block">👑 最高層級神裝</span>
              <span className="text-[9px] text-stone-400 block">貫穿破甲爆擊</span>
            </div>
          </div>
        </div>

        {/* Footer: Tips & One-Click Return (No scroll) */}
        <div className="mt-3 pt-2.5 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="text-[11px] text-stone-600 flex items-center gap-1.5">
            <span className="text-base">💌</span>
            <span>
              <strong>超實用撇步</strong>：輸掉或平時前往茶水間貼加油便利貼，可補充<strong>【🧊 冰冰冰冰冰冰繃】+1 次</strong>！
            </span>
          </div>

          <button
            id="help-got-it-btn"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black transition-all shadow-xs cursor-pointer shrink-0"
          >
            我懂了，回戰場防守！
          </button>
        </div>
      </div>
    </div>
  );
};
