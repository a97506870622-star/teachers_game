import React from 'react';
import { PlacedTower, TargetStrategy } from '../types';
import { TOWER_CONFIGS } from '../constants/towers';
import { ArrowUpCircle, Trash2, X, Target, Sparkles, CheckCircle2 } from 'lucide-react';

interface TowerUpgradeModalProps {
  tower: PlacedTower | null;
  currentEnergy: number;
  onClose: () => void;
  onUpgrade: (towerId: string) => void;
  onSell: (towerId: string) => void;
  onChangeStrategy: (towerId: string, strategy: TargetStrategy) => void;
}

export const TowerUpgradeModal: React.FC<TowerUpgradeModalProps> = ({
  tower,
  currentEnergy,
  onClose,
  onUpgrade,
  onSell,
  onChangeStrategy
}) => {
  if (!tower) return null;

  const config = TOWER_CONFIGS[tower.type];
  if (!config) return null;

  const currentLevelData = config.levels[tower.level - 1];
  const nextLevelData = tower.level < config.levels.length ? config.levels[tower.level] : null;
  const canAffordUpgrade = nextLevelData ? currentEnergy >= nextLevelData.cost : false;

  // Approximate refund
  const refundAmount = Math.floor(
    (config.baseCost + (tower.level > 1 ? config.levels[0].cost * (tower.level - 1) : 0)) * 0.7
  );

  const getTowerEmoji = (type: string) => {
    switch (type) {
      case 'knowledge_beacon':
        return '🌟'; // 翻轉教育資源
      case 'compassion_breeze':
        return '🌸';
      case 'encouragement_megaphone':
        return '📢';
      case 'red_pen':
        return '🖊️';
      case 'chalk_laser':
        return '✨';
      case 'blackboard_eraser':
        return '🌿'; // 舒壓精油按摩
      case 'coffee_machine':
        return '☕';
      case 'heart_bell':
        return '🍬'; // 舒喉潤喉糖
      case 'smart_board':
        return '⚡';
      default:
        return '🏫';
    }
  };

  return (
    <div
      id="tower-inspector-card"
      className="fixed sm:absolute inset-x-3 bottom-3 top-auto sm:inset-auto sm:top-4 sm:right-4 w-auto sm:w-92 max-h-[85vh] sm:max-h-[90vh] overflow-y-auto bg-white/98 backdrop-blur-md rounded-3xl border border-stone-200 shadow-2xl p-4 sm:p-5 z-40 animate-in fade-in slide-in-from-bottom-3 sm:slide-in-from-right-3 duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between pb-2.5 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl p-1.5 rounded-xl bg-stone-100/80">
            {getTowerEmoji(tower.type)}
          </span>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold text-stone-800">{config.name}</h4>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700 font-bold">
                {config.symbolism}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 line-clamp-1">{config.title}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Current Level Unlocked Special Skill Banner */}
      {currentLevelData.unlockedSkill && (
        <div className="my-2.5 p-2 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80">
          <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-amber-900 mb-0.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>目前技能：{currentLevelData.unlockedSkill}</span>
          </div>
          <p className="text-[10px] text-amber-800/90 leading-relaxed">{currentLevelData.skillDesc}</p>
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-1.5 my-2 text-xs">
        <div className="p-2 rounded-xl bg-stone-50 border border-stone-100">
          <span className="text-stone-500 text-[10px]">基礎攻擊</span>
          <p className="font-bold text-stone-800">{tower.damage > 0 ? `${tower.damage} 傷害` : '輔助增益'}</p>
        </div>
        <div className="p-2 rounded-xl bg-stone-50 border border-stone-100">
          <span className="text-stone-500 text-[10px]">有效射程</span>
          <p className="font-bold text-stone-800">{tower.range} px</p>
        </div>
        <div className="p-2 rounded-xl bg-stone-50 border border-stone-100">
          <span className="text-stone-500 text-[10px]">累計化解壓力</span>
          <p className="font-bold text-stone-800">{Math.round(tower.totalDamageDealt)} 點</p>
        </div>
        <div className="p-2 rounded-xl bg-stone-50 border border-stone-100">
          <span className="text-stone-500 text-[10px]">擊退怪物數</span>
          <p className="font-bold text-stone-800">{tower.kills} 隻</p>
        </div>
      </div>

      {/* 3-Tier Upgrade Progression Tree */}
      <div className="my-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold text-stone-700">三階段升級樹與技能解鎖</span>
          <span className="text-[10px] text-stone-400">當前等級：Lv.{tower.level}/3</span>
        </div>
        <div className="space-y-1.5">
          {config.levels.map((lvl) => {
            const isUnlocked = tower.level >= lvl.level;
            const isNext = tower.level + 1 === lvl.level;

            return (
              <div
                key={lvl.level}
                className={`p-2 rounded-xl border text-[11px] transition-all ${
                  isUnlocked
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                    : isNext
                    ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-300/60 text-stone-800'
                    : 'bg-stone-50 border-stone-200 text-stone-400'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <div className="flex items-center gap-1.5">
                    {isUnlocked ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-current text-[9px] flex items-center justify-center font-bold">
                        {lvl.level}
                      </span>
                    )}
                    <span>
                      Lv.{lvl.level} {lvl.name}
                    </span>
                  </div>
                  <span>{isUnlocked ? '已就緒' : `⚡ ${lvl.cost}`}</span>
                </div>
                {lvl.unlockedSkill && (
                  <p className="mt-1 text-[10px] text-stone-600 pl-5">
                    <strong className="text-amber-700">【解鎖技能】{lvl.unlockedSkill}：</strong>
                    {lvl.skillDesc}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Targeting Strategy Selector */}
      <div className="mb-3">
        <label className="text-[11px] font-bold text-stone-600 mb-1 flex items-center gap-1">
          <Target className="w-3.5 h-3.5 text-stone-500" />
          目標優先鎖定策略
        </label>
        <div className="grid grid-cols-4 gap-1">
          {(['first', 'last', 'strongest', 'weakest'] as TargetStrategy[]).map(strategy => (
            <button
              key={strategy}
              onClick={() => onChangeStrategy(tower.id, strategy)}
              className={`py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                tower.targetStrategy === strategy
                  ? 'bg-stone-800 text-white border-stone-800 shadow-xs'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
            >
              {strategy === 'first'
                ? '領頭最先'
                : strategy === 'last'
                ? '壓後目標'
                : strategy === 'strongest'
                ? '最強魔王'
                : '瀕死優先'}
            </button>
          ))}
        </div>
      </div>

      {/* Upgrade / Sell Actions */}
      <div className="space-y-1.5 pt-2 border-t border-stone-100">
        {nextLevelData ? (
          <>
            {/* Next Level Skill & Stat Preview */}
            <div className="p-2.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50/80 border border-amber-200/90 text-xs space-y-1">
              <div className="flex items-center justify-between text-[11px] font-black text-amber-950">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  升級即解鎖技能：{nextLevelData.unlockedSkill || nextLevelData.name}
                </span>
                <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded-full font-bold">
                  Lv.{nextLevelData.level}
                </span>
              </div>
              {nextLevelData.skillDesc && (
                <p className="text-[10px] text-amber-800 leading-snug">
                  {nextLevelData.skillDesc}
                </p>
              )}
              <div className="flex items-center justify-between pt-1 border-t border-amber-200/50 text-[10px] text-stone-600 font-bold">
                <span>傷害: {tower.damage} ➔ <strong className="text-emerald-700">{nextLevelData.damage} (+{nextLevelData.damage - tower.damage})</strong></span>
                <span>射程: {tower.range} ➔ <strong className="text-emerald-700">{nextLevelData.range} (+{nextLevelData.range - tower.range})</strong></span>
                <span>攻速: {tower.attackSpeed} ➔ <strong className="text-emerald-700">{nextLevelData.attackSpeed}</strong></span>
              </div>
            </div>

            <button
              id="upgrade-tower-btn"
              disabled={!canAffordUpgrade}
              onClick={() => onUpgrade(tower.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                canAffordUpgrade
                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md'
                  : 'bg-stone-100 text-stone-400 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <ArrowUpCircle className="w-4 h-4" />
                <span>
                  升級至 Lv.{nextLevelData.level}「{nextLevelData.name}」
                </span>
              </div>
              <span>⚡ {nextLevelData.cost}</span>
            </button>
          </>
        ) : (
          <div className="w-full text-center py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            ✨ 已升至最高等級（頂級教具已解鎖全技能）
          </div>
        )}

        <button
          id="sell-tower-btn"
          onClick={() => onSell(tower.id)}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-rose-50 hover:text-rose-600 text-stone-600 text-xs font-semibold border border-stone-200 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-1.5">
            <Trash2 className="w-3.5 h-3.5" />
            <span>撤回整理教具（返還熱忱）</span>
          </div>
          <span>+⚡{refundAmount}</span>
        </button>
      </div>
    </div>
  );
};
