import React, { useState } from 'react';
import { RewardItem } from '../types';
import { TEACHER_CARE_CARDS } from '../constants/cardsAndMessages';
import { Coffee, Hammer, X, Sparkles, AlertCircle, CheckCircle2, RefreshCw, Scale } from 'lucide-react';

interface ItemDetailModalProps {
  item: RewardItem | null;
  onClose: () => void;
  onUseItem: (itemId: string) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, onClose, onUseItem }) => {
  const [sampleCardIdx, setSampleCardIdx] = useState(0);
  if (!item) return null;

  const now = Date.now();
  const elapsed = (now - item.lastUsedTimestamp) / 1000;
  const isOnCooldown = elapsed < item.cooldownSeconds;
  const remainingCd = Math.ceil(item.cooldownSeconds - elapsed);
  const isUsable = item.count > 0 && !isOnCooldown;
  const sampleCard = TEACHER_CARE_CARDS[sampleCardIdx % TEACHER_CARE_CARDS.length];

  const getIcon = (id: string) => {
    switch (id) {
      case 'energy_coffee':
        return <Sparkles className="w-8 h-8 text-cyan-600 animate-pulse" />;
      case 'legal_hammer':
        return <span className="text-3xl leading-none select-none">🥊</span>;
      default:
        return <Sparkles className="w-8 h-8 text-cyan-600" />;
    }
  };

  const getEffectDetails = (id: string) => {
    switch (id) {
      case 'energy_coffee':
        return {
          highlight: '「冰冰冰冰冰冰繃！」魔性洗腦神曲降臨！全場魔王急凍 7 秒，現撥 100 熱忱趕快設置教具！',
          desc: '瞬間將走廊暴走的行政公文、情緒勒索家長與所有大魔王急凍在原地 7 秒鐘！同時補充教學熱忱經費，讓老師有充分時間深呼吸、從容擺設教具！',
          lore: '在校園奔波一整天的老師，這首席捲全網的洗腦神曲讓緊繃的氣氛瞬間急凍解凍，讓老師重掌教學節奏！（可至茶水間寫加油便利貼補充次數）'
        };
      case 'legal_hammer':
        return {
          highlight: '依法保障教師專業尊嚴！法律鐵拳一出，直接大消除全場所有大魔王！',
          desc: '「正當法律程序，法律鐵拳嚴正回擊！」翻轉教育專業法規顧問做您的後盾。鐵拳一出，依法全面駁回不實濫訴，直接大消除全場大魔王！周圍怪物亦遭受 3200 點法規痛擊與定身！',
          lore: '面對繁瑣且消耗心力的校事會議調查，翻轉教育與健全法規做您的堅實後盾，讓老師免於孤立無援。'
        };
      default:
        return {
          highlight: '提供關鍵教學支援！',
          desc: item.description,
          lore: '老師身旁的隨身暖心好物。'
        };
    }
  };

  const effect = getEffectDetails(item.id);

  return (
    <div
      id="item-detail-modal-overlay"
      className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div
        id="item-detail-modal"
        className="bg-white rounded-3xl max-w-md w-full border border-stone-200 shadow-2xl overflow-hidden p-6 space-y-4"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center shadow-xs">
              {getIcon(item.id)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-stone-800">{item.name}</h3>
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                  庫存 x{item.count}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">{item.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            title="關閉"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Effect Highlight Banner */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200/80 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-black text-sky-900">
            <Sparkles className="w-4 h-4 text-sky-600 animate-pulse" />
            <span>【錦囊實戰特效】</span>
          </div>
          <p className="text-xs font-bold text-sky-800">{effect.highlight}</p>
          <p className="text-[11px] text-sky-700/90 leading-relaxed mt-1">{effect.desc}</p>
        </div>

        {/* Teacher Lore Box */}
        <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100 text-[11px] text-stone-600 leading-relaxed">
          <span className="font-bold text-stone-700">💌 教師節心靈背後故事：</span>
          <br />
          {effect.lore}
        </div>

        {/* Dynamic Card Quote Showcase (Referenced from Succuland & Cozy House) */}
        {item.id === 'gratitude_cards' && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 border border-rose-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs font-black text-rose-900">
              <div className="flex items-center gap-1.5">
                <span className="text-base">{sampleCard.emoji}</span>
                <span>【暖心小卡文字庫】</span>
                <span className="text-[10px] text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded font-bold border border-rose-200">
                  {sampleCard.subtitle || sampleCard.category}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSampleCardIdx(i => (i + 1) % TEACHER_CARE_CARDS.length)}
                className="text-[11px] text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer font-bold px-1.5 py-0.5 rounded hover:bg-rose-100/60 transition-colors"
                title="換一張暖心小卡"
              >
                <RefreshCw className="w-3 h-3" />
                <span>換一張 ({sampleCardIdx + 1}/{TEACHER_CARE_CARDS.length})</span>
              </button>
            </div>

            <div className="bg-white/95 rounded-xl p-3 border border-rose-100 shadow-2xs space-y-1.5">
              <div className="text-xs font-black text-stone-900 flex items-center gap-1">
                <span>{sampleCard.title}</span>
                {sampleCard.sourceTag && (
                  <span className="text-[10px] text-amber-800 bg-amber-50 px-1 rounded font-normal">
                    #{sampleCard.sourceTag}
                  </span>
                )}
              </div>
              <p className="text-xs font-medium text-stone-700 leading-relaxed">
                {sampleCard.blessing}
              </p>
              {sampleCard.quoteEn && (
                <p className="text-[11px] text-amber-900/90 italic font-medium pt-1 border-t border-rose-50">
                  "{sampleCard.quoteEn}"
                </p>
              )}
            </div>
          </div>
        )}

        {/* Cooldown & Availability Status */}
        <div className="flex items-center justify-between text-xs py-1 px-1">
          <span className="text-stone-500">冷卻時間：{item.cooldownSeconds} 秒</span>
          {isOnCooldown ? (
            <span className="font-bold text-amber-600">冷卻中 ({remainingCd}s)</span>
          ) : item.count > 0 ? (
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 可以使用
            </span>
          ) : (
            <span className="font-bold text-rose-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> 暫無庫存
            </span>
          )}
        </div>

        {/* Action Button */}
        <div className="space-y-2 pt-1">
          {item.count > 0 ? (
            <button
              id={`modal-use-item-btn-${item.id}`}
              disabled={!isUsable}
              onClick={() => {
                onUseItem(item.id);
                onClose();
              }}
              className={`w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isUsable
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-md'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              <span>立即施放錦囊</span>
            </button>
          ) : (
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 text-center font-medium">
              💡 此錦囊已用盡！通關各校園關卡或擊退大魔王時皆會給予補給！
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full py-2 text-xs font-bold text-stone-500 hover:text-stone-700 transition-colors cursor-pointer text-center"
          >
            返回校園戰場
          </button>
        </div>
      </div>
    </div>
  );
};
