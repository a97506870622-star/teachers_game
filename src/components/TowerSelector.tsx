import React, { useState } from 'react';
import { TowerType, PlacedTower } from '../types';
import { TOWER_CONFIGS, getTowerPurchaseCost, getCurriculumSynergy, AVAILABLE_TOWERS } from '../constants/towers';
import {
  PenTool,
  Sparkles,
  Wind,
  HeartHandshake,
  BookOpen,
  Zap,
  Sparkle
} from 'lucide-react';

interface TowerSelectorProps {
  selectedTowerType: TowerType | null;
  currentEnergy: number;
  placedTowers: PlacedTower[];
  onSelectTower: (type: TowerType | null) => void;
  onOpenSkillGuide?: () => void;
}

export const TowerSelector: React.FC<TowerSelectorProps> = ({
  selectedTowerType,
  currentEnergy,
  placedTowers,
  onSelectTower,
  onOpenSkillGuide
}) => {
  const getIcon = (type: TowerType) => {
    switch (type) {
      case 'red_pen':
        return <span className="text-xl leading-none select-none">🖊️</span>;
      case 'chalk_laser':
        return <span className="text-xl leading-none select-none">✨</span>;
      case 'blackboard_eraser':
        return <span className="text-xl leading-none select-none">🌿</span>;
      case 'heart_bell':
        return <span className="text-xl leading-none select-none">🍬</span>;
      case 'knowledge_beacon':
        return <span className="text-xl leading-none select-none">🌟</span>;
      default:
        return <PenTool className="w-5 h-5 text-stone-500" />;
    }
  };

  const allTowers = AVAILABLE_TOWERS.map(type => TOWER_CONFIGS[type]).filter(Boolean);
  const synergy = getCurriculumSynergy(placedTowers);

  return (
    <div id="tower-selector-bar" className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3 shadow-xs space-y-2">
      {/* Top Controls & Curriculum Synergy Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-700 tracking-wide flex items-center gap-1.5">
            <span>🛠️ 5 大核心教學防禦塔</span>
            <span className="text-[11px] font-normal text-stone-400 hidden sm:inline">（點選後於地圖空地放置）</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Skill Guide Button */}
          {onOpenSkillGuide && (
            <button
              id="open-tower-skill-guide-btn"
              onClick={onOpenSkillGuide}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-50 to-rose-50 hover:from-amber-100 hover:to-rose-100 border border-amber-300 text-stone-800 text-[11px] font-black cursor-pointer transition-colors shadow-2xs"
              title="查看5大核心教具塔所有等級技能、戰術站位與傷害詳解"
            >
              <Zap className="w-3 h-3 text-amber-600" />
              <span>技能圖鑑</span>
            </button>
          )}

          {/* Synergy Banner Pill */}
          <div className={`text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium border ${
            synergy.level >= 2
              ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
              : synergy.level === 1
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-stone-200/70 text-stone-600 border-stone-300'
          }`}
          title={`${synergy.title}: ${synergy.description}`}
          >
            <Sparkle className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-bold">{synergy.badge}</span>
            <span className="hidden md:inline text-[10px] text-stone-500 font-normal">| {synergy.description}</span>
          </div>

          {selectedTowerType && (
            <button
              id="cancel-build-btn"
              onClick={() => onSelectTower(null)}
              className="text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-0.5 rounded-md hover:bg-rose-50 cursor-pointer transition-colors"
            >
              取消選取 (ESC)
            </button>
          )}
        </div>
      </div>

      {/* Towers Grid (5 Core Educational Tools) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {allTowers.map((cfg, index) => {
          const isSelected = selectedTowerType === cfg.type;
          const countOnField = placedTowers.filter(t => t.type === cfg.type).length;
          const currentCost = getTowerPurchaseCost(cfg.baseCost, countOnField);
          const canAfford = currentEnergy >= currentCost;
          const isHighestTier = cfg.type === 'knowledge_beacon';

          return (
            <button
              key={cfg.type}
              id={`tower-btn-${cfg.type}`}
              onClick={() => onSelectTower(isSelected ? null : cfg.type)}
              title={`【${cfg.name}】（${cfg.symbolism}）\n${cfg.description}\n\n✨ 核心專屬技能:\n• Lv1: ${cfg.levels[0]?.unlockedSkill || '基礎攻擊'} (${cfg.levels[0]?.skillDesc || ''})\n• Lv2: ${cfg.levels[1]?.unlockedSkill || '進階強化'}\n• Lv3: ${cfg.levels[2]?.unlockedSkill || '終極覺醒'} (${cfg.levels[2]?.skillDesc || ''})\n\n💰 採購成本: ⚡${currentCost} (場上現有: ${countOnField} 座)`}
              className={`relative flex flex-col items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer select-none group ${
                isSelected
                  ? 'bg-amber-50 border-amber-500 shadow-md ring-2 ring-amber-400/40 scale-[1.02]'
                  : canAfford
                  ? isHighestTier
                    ? 'bg-gradient-to-b from-amber-50 to-white hover:border-amber-400 border-amber-300 shadow-xs'
                    : 'bg-white hover:bg-stone-50 border-stone-200 hover:border-stone-300 shadow-xs'
                  : 'bg-stone-100/70 border-stone-200/60 opacity-60'
              }`}
            >
              {/* Shortcut number tag */}
              <span className="absolute top-1 left-1.5 text-[9px] font-bold text-stone-400">
                #{index + 1}
              </span>

              {/* Duplicate Count Badge with Inflation Indicator */}
              {countOnField > 0 && (
                <span className="absolute top-1 right-1 text-[9px] px-1 py-0.2 rounded font-bold bg-amber-100 text-amber-800 border border-amber-200" title={`已建 ${countOnField} 座，重複採購加價 +${countOnField * 35}%`}>
                  ×{countOnField}
                </span>
              )}

              {/* Highest Tier Badge when 0 placed */}
              {countOnField === 0 && isHighestTier && (
                <span className="absolute top-1 right-1 text-[9px] text-amber-700 font-bold bg-amber-100 px-1 rounded">
                  👑
                </span>
              )}

              {/* Tower Icon */}
              <div className="w-8 h-8 rounded-lg bg-stone-50/80 flex items-center justify-center my-0.5 group-hover:scale-105 transition-transform">
                {getIcon(cfg.type)}
              </div>

              {/* Tower Name */}
              <div className="text-center w-full">
                <p className="text-[11px] font-bold text-stone-800 truncate">{cfg.name}</p>
                <div className="flex items-center justify-center gap-0.5 mt-0.5">
                  <span className={`text-[10px] font-extrabold ${canAfford ? 'text-amber-600' : 'text-stone-400'}`}>
                    ⚡{currentCost}
                  </span>
                  {countOnField > 0 && (
                    <span className="text-[8px] text-red-500 font-bold">
                      (+{countOnField * 35}%)
                    </span>
                  )}
                </div>
              </div>

              {/* Lv1 Skill Tag */}
              {cfg.levels[0]?.unlockedSkill ? (
                <span className="text-[8px] text-amber-800 font-extrabold truncate max-w-full px-1 py-0.2 bg-amber-50/90 rounded border border-amber-200/80 mt-1">
                  ⚡{cfg.levels[0].unlockedSkill}
                </span>
              ) : (
                <span className={`mt-1 text-[8.5px] px-1 py-0.2 rounded-full font-medium truncate max-w-full text-center ${
                  isHighestTier
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-stone-100 text-stone-600'
                }`}>
                  {cfg.symbolism.replace('象徵', '')}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

