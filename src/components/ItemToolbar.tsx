import React from 'react';
import { RewardItem } from '../types';
import { Wand2, Coffee, DoorOpen, Heart, Info } from 'lucide-react';

interface ItemToolbarProps {
  items: RewardItem[];
  onUseItem: (itemId: string) => void;
  onInspectItem: (item: RewardItem) => void;
}

export const ItemToolbar: React.FC<ItemToolbarProps> = ({ items, onUseItem, onInspectItem }) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'ice_magic_wand':
        return <Wand2 className="w-5 h-5 text-sky-500 animate-pulse" />;
      case 'energy_coffee':
        return <Coffee className="w-5 h-5 text-amber-700" />;
      case 'leave_on_time_portal':
        return <DoorOpen className="w-5 h-5 text-emerald-600" />;
      case 'gratitude_cards':
        return <Heart className="w-5 h-5 text-rose-500" />;
      default:
        return <Wand2 className="w-5 h-5 text-stone-600" />;
    }
  };

  return (
    <div id="item-toolbar-section" className="w-full bg-white border border-stone-200 rounded-2xl p-3 shadow-xs">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-700">🎒 教師關卡應援錦囊</span>
          <span className="text-[11px] text-sky-600 bg-sky-50 font-semibold px-2 py-0.5 rounded-full border border-sky-100">
            點選格子可查看詳情或施放
          </span>
        </div>
        <span className="text-[11px] text-stone-400 font-medium">通關或擊退首領可獲補充</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {items.map(item => {
          const now = Date.now();
          const elapsed = (now - item.lastUsedTimestamp) / 1000;
          const isOnCooldown = elapsed < item.cooldownSeconds;
          const remainingCd = Math.ceil(item.cooldownSeconds - elapsed);
          const isUsable = item.count > 0 && !isOnCooldown;

          return (
            <div
              key={item.id}
              id={`item-btn-${item.id}`}
              onClick={() => {
                if (isUsable) {
                  onUseItem(item.id);
                } else {
                  onInspectItem(item);
                }
              }}
              className={`relative flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all select-none cursor-pointer group ${
                item.isKeyItem
                  ? 'bg-gradient-to-r from-sky-50 via-indigo-50/40 to-blue-50 border-sky-300 hover:border-sky-400 shadow-sm'
                  : 'bg-stone-50 hover:bg-stone-100 border-stone-200'
              } ${!isUsable ? 'opacity-70 hover:opacity-100' : 'hover:scale-[1.01]'}`}
              title={isUsable ? `點擊立即使用：${item.name}` : `點擊查看物品詳情：${item.name}`}
            >
              {/* Cooldown overlay */}
              {isOnCooldown && (
                <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[1px] rounded-xl flex items-center justify-center z-10 text-white text-xs font-bold">
                  冷卻中 {remainingCd}s
                </div>
              )}

              {/* Icon */}
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  item.isKeyItem ? 'bg-white shadow-xs border border-sky-200' : 'bg-white border border-stone-200'
                }`}
              >
                {getIcon(item.id)}
              </div>

              {/* Text info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-bold text-stone-800 truncate">{item.name}</h4>
                  <span className={`text-[11px] font-black px-1.5 py-0.2 rounded-full ${
                    item.count > 0 ? 'bg-amber-100 text-amber-900' : 'bg-stone-200 text-stone-500'
                  }`}>
                    x{item.count}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-[10px] text-stone-500 truncate">{item.subtitle}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onInspectItem(item);
                    }}
                    className="p-0.5 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
                    title="查看錦囊詳情"
                  >
                    <Info className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

