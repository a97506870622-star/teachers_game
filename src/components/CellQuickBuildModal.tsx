import React from 'react';
import { TowerType, PlacedTower, MapData } from '../types';
import { TOWER_CONFIGS, getTowerPurchaseCost, AVAILABLE_TOWERS } from '../constants/towers';
import { isCellOnPath, isCellNearPressureCore } from '../constants/maps';
import { X, Sparkles, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface CellQuickBuildModalProps {
  cell: { gridX: number; gridY: number } | null;
  mapData: MapData;
  energy: number;
  placedTowers: PlacedTower[];
  onClose: () => void;
  onBuildTower: (type: TowerType, gridX: number, gridY: number) => void;
}

export const CellQuickBuildModal: React.FC<CellQuickBuildModalProps> = ({
  cell,
  mapData,
  energy,
  placedTowers,
  onClose,
  onBuildTower
}) => {
  if (!cell) return null;

  const { gridX, gridY } = cell;
  const isPath = isCellOnPath(mapData.path, gridX, gridY);
  const isOccupied = placedTowers.some(t => t.gridX === gridX && t.gridY === gridY);
  const isCoreBlocked = isCellNearPressureCore(mapData.endPoint, gridX, gridY);
  const decoration = mapData.decorations.find(d => d.x === gridX && d.y === gridY);

  const canBuild = !isPath && !isOccupied && !isCoreBlocked && !decoration;

  // 聚焦在 5 大核心教育教具
  const allTowers = AVAILABLE_TOWERS.map(type => TOWER_CONFIGS[type]).filter(Boolean);

  const getTowerEmoji = (type: string) => {
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

  return (
    <div
      id="cell-quick-build-modal"
      className="fixed sm:absolute inset-x-3 bottom-3 top-auto sm:inset-auto sm:top-4 sm:right-4 w-auto sm:w-96 max-h-[85vh] sm:max-h-[90vh] overflow-y-auto bg-white/98 backdrop-blur-md rounded-3xl border border-stone-200 shadow-2xl p-4 sm:p-5 z-40 animate-in fade-in slide-in-from-bottom-3 sm:slide-in-from-right-3 duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-sm">
            📍
          </div>
          <div>
            <h4 className="text-sm font-black text-stone-800 flex items-center gap-1.5">
              <span>教室地圖格 [{gridX + 1}, {gridY + 1}]</span>
            </h4>
            <span className="text-[11px] text-stone-500">
              {isPath
                ? '🚶 怪物行進走廊'
                : decoration
                ? '🏫 校園裝飾設施'
                : isCoreBlocked
                ? '⚠️ 壓力核心禁區'
                : '✅ 可配置教具防禦塔空地'}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          title="關閉"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Cell Status Details */}
      <div className="mt-3">
        {isPath ? (
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-amber-800">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>此格子為怪物行進走廊</span>
            </div>
            <p className="text-[11px] text-amber-700/90 leading-relaxed">
              壓力怪物與負能量會經由這條走廊逼近老師。路線上無法直接建造防禦塔，請點選兩側空地配置教具！
            </p>
          </div>
        ) : isCoreBlocked ? (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-rose-800">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>壓力核心斥力力場</span>
            </div>
            <p className="text-[11px] text-rose-700/90 leading-relaxed">
              此處過於靠近關卡終點的壓力核心，強烈斥力干擾使得教具無法在此穩定運作。
            </p>
          </div>
        ) : decoration ? (
          <div className="p-3 rounded-2xl bg-stone-100 border border-stone-300 text-xs text-stone-800 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-stone-800">
              <AlertCircle className="w-4 h-4 text-stone-500 shrink-0" />
              <span>🏫 {decoration.label || '校園設施'}（不可放置教具）</span>
            </div>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              此處為校園公共設施，無法放置任何教具防禦塔。請點選走廊旁的空白網格進行配置！
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>空地就緒，請點選下方教具立即在此建造：</span>
              </div>
              <span className="font-extrabold text-emerald-700 bg-white px-2 py-0.5 rounded-lg border border-emerald-200 text-[11px]">
                現有 ⚡{Math.floor(energy)}
              </span>
            </div>

            {/* Quick Build Grid */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-stone-600 block px-0.5">
                🛠️ 選擇要放置在此格子的教學塔：
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {allTowers.map(cfg => {
                  const countOnField = placedTowers.filter(t => t.type === cfg.type).length;
                  const currentCost = getTowerPurchaseCost(cfg.baseCost, countOnField);
                  const canAfford = energy >= currentCost;

                  return (
                    <button
                      key={cfg.type}
                      disabled={!canAfford}
                      onClick={() => onBuildTower(cfg.type, gridX, gridY)}
                      className={`flex items-start gap-2 p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        canAfford
                          ? 'bg-white hover:bg-stone-50 hover:border-amber-400 border-stone-200 shadow-xs'
                          : 'bg-stone-50 border-stone-200 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center text-lg shrink-0 border border-stone-200">
                        {getTowerEmoji(cfg.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h5 className="text-xs font-bold text-stone-800 truncate">{cfg.name}</h5>
                          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                            canAfford ? 'bg-amber-100 text-amber-900' : 'bg-stone-200 text-stone-600'
                          }`}>
                            ⚡{currentCost}
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-500 truncate mt-0.5">{cfg.symbolism}</p>

                        {/* Lv1 Skill Pill */}
                        {cfg.levels[0]?.unlockedSkill && (
                          <div className="mt-1 text-[9px] bg-amber-50 text-amber-900 px-1.5 py-0.5 rounded border border-amber-200/70 font-semibold line-clamp-1" title={cfg.levels[0].skillDesc}>
                            ⚡ {cfg.levels[0].unlockedSkill}：{cfg.levels[0].skillDesc}
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-1 text-[9px] text-stone-400 font-medium">
                          <span>傷: {cfg.damage > 0 ? cfg.damage : '增益'} · 距: {cfg.range}</span>
                          {countOnField > 0 && (
                            <span className="text-amber-700 font-bold">
                              已有 {countOnField} 座
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
