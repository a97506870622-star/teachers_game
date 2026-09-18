import React from 'react';
import { TowerType, PlacedTower, RewardItem } from '../types';
import { TOWER_CONFIGS, getTowerPurchaseCost, getCurriculumSynergy, AVAILABLE_TOWERS } from '../constants/towers';
import {
  Coffee,
  Zap,
  Sparkles,
  X
} from 'lucide-react';

interface BottomControlDockProps {
  selectedTowerType: TowerType | null;
  currentEnergy: number;
  placedTowers: PlacedTower[];
  onSelectTower: (type: TowerType | null) => void;
  onOpenSkillGuide: () => void;
  items: RewardItem[];
  onUseItem: (itemId: string) => void;
  onInspectItem: (item: RewardItem) => void;
}

export const BottomControlDock: React.FC<BottomControlDockProps> = ({
  selectedTowerType,
  currentEnergy,
  placedTowers,
  onSelectTower,
  onOpenSkillGuide,
  items,
  onUseItem,
  onInspectItem
}) => {
  const synergy = getCurriculumSynergy(placedTowers);
  // 聚焦在 5 大核心教學與減壓道具（第三層精油按摩、第四高潤喉糖、最高層級翻轉教育資源）
  const allTowers = AVAILABLE_TOWERS.map(type => TOWER_CONFIGS[type]).filter(Boolean);

  const getTowerEmoji = (type: TowerType) => {
    switch (type) {
      case 'red_pen':
        return '🖊️';
      case 'chalk_laser':
        return '✨';
      case 'blackboard_eraser':
        return '🌿'; // 舒壓精油按摩
      case 'heart_bell':
        return '🍬'; // 舒喉潤喉糖
      case 'knowledge_beacon':
        return '🌟'; // 翻轉教育資源
      default:
        return '🏫';
    }
  };

  const getShortName = (type: TowerType, name: string) => {
    switch (type) {
      case 'red_pen':
        return '紅筆批改';
      case 'chalk_laser':
        return '彩虹粉筆';
      case 'blackboard_eraser':
        return '精油按摩';
      case 'heart_bell':
        return '潤喉糖';
      case 'knowledge_beacon':
        return '翻轉資源';
      default:
        return name;
    }
  };

  const getItemIcon = (id: string) => {
    switch (id) {
      case 'energy_coffee':
        return <Sparkles className="w-5 h-5 text-cyan-600 animate-pulse" />;
      case 'legal_hammer':
        return <span className="text-lg leading-none select-none">🥊</span>;
      default:
        return <Sparkles className="w-5 h-5 text-cyan-600" />;
    }
  };

  return (
    <footer className="w-full bg-white/95 backdrop-blur-md border-t border-stone-200 py-1.5 px-2 sm:px-4 shrink-0 shadow-lg select-none z-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-1.5">
        
        {/* Left: 5 Tower Buttons (Quick Placement) */}
        <div className="w-full md:w-auto flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <div className="hidden xl:flex flex-col justify-center pr-1.5 border-r border-stone-200 text-stone-400 shrink-0">
            <span className="text-[10px] font-bold text-stone-600 leading-tight">5大教具塔</span>
            <span className="text-[9px] text-stone-400 font-mono">#1~#5鍵</span>
          </div>

          {allTowers.map((cfg, index) => {
            const isSelected = selectedTowerType === cfg.type;
            const countOnField = placedTowers.filter(t => t.type === cfg.type).length;
            const currentCost = getTowerPurchaseCost(cfg.baseCost, countOnField);
            const canAfford = currentEnergy >= currentCost;
            const isHighestTier = cfg.type === 'knowledge_beacon';

            return (
              <button
                key={cfg.type}
                id={`dock-tower-btn-${cfg.type}`}
                onClick={() => onSelectTower(isSelected ? null : cfg.type)}
                title={`【${cfg.name}】（${cfg.symbolism}）\n${cfg.description}\n採購成本: ⚡${currentCost} (場上現有: ${countOnField} 座)\n快捷鍵: 鍵盤 [${index + 1}]`}
                className={`relative flex flex-col items-center justify-between px-2 sm:px-2.5 py-1 rounded-xl border text-center transition-all cursor-pointer shrink-0 min-w-[58px] sm:min-w-[72px] h-[60px] ${
                  isSelected
                    ? 'bg-amber-100/90 border-amber-500 shadow-md ring-2 ring-amber-400/50 scale-[1.03]'
                    : canAfford
                    ? isHighestTier
                      ? 'bg-gradient-to-b from-amber-50 to-white hover:border-amber-400 border-amber-300 shadow-2xs'
                      : 'bg-white hover:bg-stone-50 border-stone-200 hover:border-stone-300 shadow-2xs'
                    : 'bg-stone-100/60 border-stone-200/50 opacity-50'
                }`}
              >
                {/* Shortcut Index Tag */}
                <span className="absolute top-0.5 left-1.5 text-[8.5px] font-bold text-stone-400">
                  #{index + 1}
                </span>

                {/* Built Count Badge */}
                {countOnField > 0 && (
                  <span className="absolute top-0.5 right-1.5 text-[8.5px] px-1 rounded-full font-black bg-amber-200 text-amber-900">
                    ×{countOnField}
                  </span>
                )}

                {/* Emoji Icon */}
                <span className="text-xl leading-none mt-1">
                  {getTowerEmoji(cfg.type)}
                </span>

                {/* Tower Name & Cost */}
                <div className="w-full min-w-0">
                  <div className="text-[10px] sm:text-[11px] font-black text-stone-800 truncate leading-tight">
                    {getShortName(cfg.type, cfg.name)}
                  </div>
                  <span className={`text-[9.5px] font-black ${canAfford ? 'text-amber-700' : 'text-stone-400'}`}>
                    ⚡{currentCost}
                  </span>
                </div>
              </button>
            );
          })}

          {/* Cancel Selection Button if a tower is active */}
          {selectedTowerType && (
            <button
              onClick={() => onSelectTower(null)}
              className="flex items-center gap-0.5 px-2 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold cursor-pointer transition-colors shrink-0 ml-0.5"
              title="取消目前選取的教具放置游標"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">取消 (ESC)</span>
            </button>
          )}
        </div>

        {/* Right: 2 Elongated Wide Rescue Items (Coffee + Legal Hammer) */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-2">
            {items.map(item => {
              const now = Date.now();
              const elapsed = (now - item.lastUsedTimestamp) / 1000;
              const isOnCooldown = elapsed < item.cooldownSeconds;
              const remainingCd = Math.ceil(item.cooldownSeconds - elapsed);
              const isUsable = item.count > 0 && !isOnCooldown;
              const isLegalHammer = item.id === 'legal_hammer';

              return (
                <button
                  key={item.id}
                  id={`dock-item-btn-${item.id}`}
                  onClick={() => {
                    if (isUsable) {
                      onUseItem(item.id);
                    } else {
                      onInspectItem(item);
                    }
                  }}
                  title={isUsable ? `【${item.name}】點選立即使用！剩餘 ${item.count} 次` : `【${item.name}】冷卻中或點選查看`}
                  className={`relative flex items-center justify-between px-3 py-1.5 rounded-xl border transition-all cursor-pointer select-none h-[58px] w-[165px] sm:w-[195px] ${
                    isLegalHammer
                      ? 'bg-gradient-to-r from-amber-50 via-indigo-50/60 to-white border-indigo-300 hover:border-indigo-400 shadow-sm hover:shadow'
                      : 'bg-gradient-to-r from-orange-50 via-amber-50/60 to-white border-amber-300 hover:border-amber-400 shadow-sm hover:shadow'
                  } ${!isUsable ? 'opacity-70' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
                >
                  {/* Cooldown Overlay */}
                  {isOnCooldown && (
                    <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[1px] rounded-xl flex items-center justify-center z-10 text-white text-xs font-black">
                      冷卻中 {remainingCd}s
                    </div>
                  )}

                  {/* Left: Icon Badge */}
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs border ${
                      isLegalHammer ? 'bg-indigo-100 border-indigo-200' : 'bg-cyan-100 border-cyan-200'
                    }`}>
                      {getItemIcon(item.id)}
                    </div>

                    {/* Middle: Title & Subtitle */}
                    <div className="text-left min-w-0">
                      <div className="text-xs font-black text-stone-900 truncate">
                        {isLegalHammer ? '🥊 法律鐵拳' : '🧊 冰冰冰冰冰冰繃'}
                      </div>
                      <div className="text-[10px] font-medium truncate text-stone-500">
                        {isLegalHammer ? '一擊大消除所有魔王' : '全場急凍魔王佈防'}
                      </div>
                    </div>
                  </div>

                  {/* Right: Count Badge */}
                  <div className="shrink-0 pl-1">
                    <span className={`text-[10.5px] font-black px-2 py-0.5 rounded-full border ${
                      item.count > 0
                        ? isLegalHammer
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-cyan-600 text-white border-cyan-500'
                        : 'bg-stone-200 text-stone-500 border-stone-300'
                    }`}>
                      ×{item.count}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Guide / Skill Button */}
          <button
            onClick={onOpenSkillGuide}
            className="flex flex-col items-center justify-center px-2 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold cursor-pointer transition-colors h-[58px] shrink-0"
            title="查看完整技能特技與站位圖鑑"
          >
            <Zap className="w-4 h-4 text-amber-600" />
            <span className="text-[10px] hidden sm:inline mt-0.5">教具指南</span>
          </button>
        </div>

      </div>
    </footer>
  );
};
