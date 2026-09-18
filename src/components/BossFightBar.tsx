import React, { useState, useEffect } from 'react';
import { ActiveEnemy } from '../types';
import { Shield, Flame, Hammer, X } from 'lucide-react';

interface BossFightBarProps {
  boss: ActiveEnemy | undefined;
}

export const BossFightBar: React.FC<BossFightBarProps> = ({ boss }) => {
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  // Auto-dismiss after 2 seconds when a new boss arrives
  useEffect(() => {
    if (boss) {
      setIsDismissed(false);
      const timer = setTimeout(() => {
        setIsDismissed(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [boss?.id]);

  if (!boss) return null;

  const isEnraged = boss.enraged || boss.bossPhase === 2 || (boss.currentHp / boss.maxHp <= 0.5);
  const hpPct = Math.max(0, Math.min(100, (boss.currentHp / boss.maxHp) * 100));

  const getBossDetails = () => {
    switch (boss.type) {
      case 'school_affairs_meeting_boss':
        return {
          title: '⚖️ 濫訴狂潮．校事會議調查魔王',
          emoji: '⚖️',
          phase1: '🛡️ 階段一【黑函程序調查：無差別受理，自帶 60% 濫訴護甲！請用「法律鐵拳 🥊」破甲】',
          phase2: '🔥 階段二【召開懲處會議：公文狂化暴走！立即以法律程序嚴正回擊！】',
          tip: '🥊 快點擊下方【法律鐵拳】依法回擊、敲碎濫訴護甲！'
        };
      case 'nihilism_boss':
        return {
          title: '🪐 教育虛無心靈荒漠之主',
          emoji: '🪐',
          phase1: '🛡️ 階段一【心靈荒漠：全抗性形式主義護甲（40% 減傷）】',
          phase2: '🔥 階段二【荒漠風暴：狂化暴走，移動加速 40%！】',
          tip: '💡 集中火力並出擊法律鐵拳瓦解荒漠！'
        };
      default:
        return {
          title: '📑 深淵輔導紀錄與個案填報魔王',
          emoji: '📑',
          phase1: '🛡️ 階段一【深淵壓迫：公文條規形式主義護甲（40% 減傷）】',
          phase2: '🔥 階段二【狂化暴走：護甲瓦解，公文加速撲向老師！】',
          tip: '💡 果斷出擊【法律鐵拳】直接大消除，或用【冰冰冰冰冰冰繃】全場急凍魔王爭取佈防時間！'
        };
    }
  };

  const info = getBossDetails();
  const phaseText = isEnraged ? info.phase2 : info.phase1;

  // 2s 後自動隱藏或手動按掉後，徹底完全消失，絕不殘留任何按鈕遮擋戰場視野
  if (isDismissed) {
    return null;
  }

  return (
    <div
      id="boss-fight-hud"
      className={`w-full rounded-2xl p-2.5 sm:p-3 shadow-lg border transition-all duration-300 animate-in fade-in slide-in-from-top-3 relative ${
        isEnraged
          ? 'bg-gradient-to-r from-red-950 via-red-900 to-amber-950 border-red-600 text-white shadow-red-900/40 ring-2 ring-red-500/50'
          : 'bg-gradient-to-r from-stone-900 via-stone-850 to-red-950 border-red-800 text-white shadow-stone-900/50'
      }`}
    >
      {/* Top action row with 2s indicator and manual close button */}
      <div className="flex items-center justify-between gap-3 mb-1.5">
        <div className="flex items-center gap-2">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-xl shadow-md border ${
              isEnraged
                ? 'bg-red-600/80 border-amber-400 animate-bounce'
                : 'bg-stone-800 border-red-700'
            }`}
          >
            {info.emoji}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-wide text-red-200 flex items-center gap-1">
                {info.title}
              </span>
              {isEnraged ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-extrabold bg-red-600 text-white flex items-center gap-1 animate-pulse border border-amber-400">
                  <Flame className="w-3 h-3 text-amber-300" />
                  暴走狀態
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-stone-700/80 text-red-300 flex items-center gap-1 border border-red-500/30">
                  <Shield className="w-3 h-3 text-red-400" />
                  條規護甲
                </span>
              )}
            </div>
            <p className="text-[10.5px] font-medium text-red-300/90 mt-0.5">
              {phaseText}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="text-right shrink-0">
            <div className="text-sm font-black font-mono tracking-wider text-amber-300">
              {Math.round(boss.currentHp).toLocaleString()} / {Math.round(boss.maxHp).toLocaleString()}
            </div>
            <div className="text-[10px] font-semibold text-stone-300">
              剩餘生命: <span className={hpPct < 25 ? 'text-red-400 font-bold' : 'text-amber-400'}>{hpPct.toFixed(1)}%</span>
            </div>
          </div>

          {/* 2s Countdown indicator */}
          <span className="hidden sm:inline-block text-[9.5px] text-stone-400 bg-stone-800/90 px-1.5 py-0.5 rounded border border-stone-700 font-mono">
            ⏱️ 2s 自動消失
          </span>

          {/* Close / Dismiss button */}
          <button
            onClick={() => setIsDismissed(true)}
            className="w-6 h-6 rounded-lg bg-stone-800 hover:bg-red-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-stone-700 hover:border-red-500"
            title="按掉大魔王警報"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Health Bar with Phase Threshold Indicator */}
      <div className="relative w-full bg-stone-950/80 rounded-full h-3.5 border border-stone-700 overflow-hidden shadow-inner">
        <div
          className={`h-full transition-all duration-200 rounded-full ${
            isEnraged
              ? 'bg-gradient-to-r from-red-500 via-rose-500 to-amber-400 animate-pulse'
              : 'bg-gradient-to-r from-amber-500 to-red-500'
          }`}
          style={{ width: `${hpPct}%` }}
        />

        {/* 50% Phase Transition Line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white/70 shadow-xs z-10"
          style={{ left: '50%' }}
          title="50% 生命值進入狂化暴走型態"
        />
      </div>

      {/* Special Combat Tip */}
      <div className="flex items-center justify-between text-[10px] text-amber-200/90 mt-1 px-0.5">
        <span className="flex items-center gap-1">
          <Hammer className="w-3 h-3 text-amber-300" />
          <span>{info.tip}</span>
        </span>
        <span className="text-stone-400">50% 生命進入暴走</span>
      </div>
    </div>
  );
};
