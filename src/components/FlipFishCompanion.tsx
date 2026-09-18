import React, { useState, useEffect } from 'react';
import { FlipFish, FlipFishPose } from './FlipFish';
import { speechEngine } from '../utils/speechEngine';
import { soundEngine } from '../utils/soundEngine';
import { Sparkles, Volume2, ExternalLink, X } from 'lucide-react';

interface FlipFishCompanionProps {
  teacherHp: number;
  maxTeacherHp: number;
  progressPct?: number;
  isPaused: boolean;
  isFrozen?: boolean;
  isFrozenActive?: boolean;
  hasBoss?: boolean;
  isBossActive?: boolean;
  placedTowerCount?: number;
  synergyLevel?: number;
  onOpenHelp?: () => void;
  onOpenLounge?: () => void;
}

const CHEER_QUOTES = [
  '老師辛苦了！翻轉教育與翻轉魚陪您一起擊退各類校園壓力！🐟✨',
  '遇到大魔王或校事會議？快點擊下方【法律鐵拳 🥊】直接大消除全場魔王！',
  '別忘了多擺不同種類的教具，觸發【5大教具全人協同】光環加成！',
  '翻轉教育（FlipEdu）守護第一線教師：法規因應、親師溝通、班級經營！',
  '隨時可以點右上角「☕ 茶水間」喝杯手沖咖啡、抽張暖心籤詩！',
  '深呼吸～教育路上您絕不孤單，翻轉教育與翻轉魚一直都在！❤️'
];

export const FlipFishCompanion: React.FC<FlipFishCompanionProps> = ({
  teacherHp,
  maxTeacherHp,
  isPaused,
  isFrozen,
  isFrozenActive,
  hasBoss,
  isBossActive,
  synergyLevel = 0,
  placedTowerCount = 0
}) => {
  const [quoteIndex, setQuoteIndex] = useState<number>(0);
  const [clickCount, setClickCount] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isDismissedPermanently, setIsDismissedPermanently] = useState<boolean>(false);

  const frozen = isFrozen ?? isFrozenActive ?? false;
  const bossActive = hasBoss ?? isBossActive ?? false;

  // Determine FlipFish pose based on current game scenario
  const getDynamicPose = (): { pose: FlipFishPose; message: string } => {
    if (isPaused) {
      return {
        pose: 'sleeping',
        message: '暫停喘口氣～喝口水、深呼吸，準備好了再點繼續！💤'
      };
    }
    if (frozen) {
      return {
        pose: 'victory',
        message: '✨ 怪物全數定身！趁現在趕緊全力化解！🎉'
      };
    }
    if (bossActive) {
      return {
        pose: 'angry',
        message: '🚨 大魔王強勢來襲！快用【法律鐵拳 🥊】依法直接大消除全場魔王！'
      };
    }
    if (teacherHp / maxTeacherHp <= 0.35) {
      return {
        pose: 'sweat',
        message: '❤️ 老師撐住！心靈耐力告急，快使用「冰冰冰冰冰冰繃」急凍魔王，或用「法律鐵拳」大消除清場！'
      };
    }
    if (synergyLevel >= 2 || placedTowerCount >= 6) {
      return {
        pose: 'idea',
        message: '💡 全能課程聯防生效中！全員攻速與射程獲得大幅加成！'
      };
    }
    return {
      pose: clickCount % 2 === 1 ? 'love' : 'teaching',
      message: CHEER_QUOTES[quoteIndex % CHEER_QUOTES.length]
    };
  };

  const { pose, message } = getDynamicPose();

  // 2 秒自動完全消失機制：彈出 2 秒後自動隱藏；若手動按叉叉則徹底關閉，不留任何按鈕
  useEffect(() => {
    if (isDismissedPermanently) return;
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [message, isDismissedPermanently]);

  const handleFishClick = () => {
    soundEngine.playCoin();
    setClickCount(c => c + 1);
    setQuoteIndex(q => q + 1);
    speechEngine.speak(message);
  };

  const handleManualDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    setIsDismissedPermanently(true);
  };

  // 2 秒後或按叉叉後，直接完全消失（return null），絕不留任何按鈕或殘留標籤遮擋地圖視野
  if (!isVisible || isDismissedPermanently) {
    return null;
  }

  return (
    <div
      id="flipfish-campus-companion"
      className="bg-white/95 backdrop-blur-md rounded-2xl border border-sky-200 shadow-md px-3 sm:px-3.5 py-1.5 sm:py-2 flex items-center justify-between gap-2.5 transition-all animate-in fade-in"
    >
      {/* Left: Mascot & Speech Bubble */}
      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
        <button
          onClick={handleFishClick}
          className="relative shrink-0 group focus:outline-hidden cursor-pointer"
          title="點我聽翻轉魚打氣應援！"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center group-hover:scale-105 group-active:scale-95 transition-transform shadow-2xs overflow-hidden p-0.5">
            <FlipFish pose={pose} size={32} />
          </div>
          <span className="absolute -bottom-1 -right-1 bg-sky-500 text-white text-[8px] font-black px-1 rounded-full shadow-2xs">
            翻轉魚
          </span>
        </button>

        {/* Speech Bubble */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[11px] font-extrabold text-sky-800 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              翻轉教育小叮嚀
            </span>
            <span className="text-[9px] text-sky-600 bg-sky-50 px-1 py-0.2 rounded border border-sky-200 font-mono">
              2s 後自動隱藏
            </span>
          </div>
          <p className="text-xs text-stone-700 font-medium leading-tight truncate sm:whitespace-normal">
            {message}
          </p>
        </div>
      </div>

      {/* Right: Actions (Voice Listen + FlipEdu Official Site Link + Close X Button) */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={handleFishClick}
          className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold border border-sky-200 cursor-pointer transition-colors"
          title="換一句打氣話語並朗讀"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span className="text-[11px] hidden sm:inline">下一句</span>
        </button>

        {/* 翻轉教育官方網站外連 */}
        <a
          href="https://flipedu.parenting.com.tw"
          target="_blank"
          rel="noreferrer"
          className="hidden md:flex items-center gap-1 px-2 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 cursor-pointer transition-colors shadow-2xs"
          title="前往「翻轉教育 FlipEdu」官方網站，獲取更多教學錦囊與教師法規權益專題！"
        >
          <span className="text-[11px]">翻轉教育</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        {/* 叉叉按鈕：手動立即按掉關閉，徹底完全消失 */}
        <button
          id="dismiss-flipfish-tip-btn"
          onClick={handleManualDismiss}
          className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-red-500 hover:text-white text-stone-500 flex items-center justify-center transition-colors cursor-pointer border border-stone-200 hover:border-red-500 shadow-xs"
          title="按掉小叮嚀（徹底關閉）"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
