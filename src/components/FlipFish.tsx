import React from 'react';

export type FlipFishPose =
  | 'default'
  | 'thinking'
  | 'shocked'
  | 'idea'
  | 'victory'
  | 'love'
  | 'teaching'
  | 'melting'
  | 'sweat'
  | 'sleeping'
  | 'angry'
  | 'master'
  | 'blush';

interface FlipFishProps {
  pose?: FlipFishPose;
  className?: string;
  size?: number | string;
  title?: string;
  showBadge?: boolean;
}

/**
 * 翻轉教育官方吉祥物：翻轉魚 (Flip Fish) - 乾淨、生動的 Emoji 徽章設計
 * 擺脫複雜容易跑版的向量圖，改用精緻飽滿的 Emoji 組合，搭配翻轉教育品牌海藍圓環！
 */
export const FlipFish: React.FC<FlipFishProps> = ({
  pose = 'default',
  className = '',
  size = 40,
  title = '翻轉教育・翻轉魚'
}) => {
  const pixelSize = typeof size === 'number' ? size : parseInt(size, 10) || 40;

  // 根據情境表情挑選最合適的生動 Emoji 與裝飾徽章
  const getPoseEmoji = () => {
    switch (pose) {
      case 'teaching':
        return { main: '🐟', badge: '🎓', label: '翻轉教學' };
      case 'thinking':
        return { main: '🐟', badge: '💭', label: '思考中' };
      case 'shocked':
        return { main: '🐟', badge: '😱', label: '震驚' };
      case 'idea':
        return { main: '🐟', badge: '💡', label: '好點子' };
      case 'victory':
        return { main: '🐟', badge: '🎉', label: '大獲全勝' };
      case 'love':
        return { main: '🐟', badge: '💖', label: '溫暖關懷' };
      case 'melting':
        return { main: '🐟', badge: '🫠', label: '融化中' };
      case 'sweat':
        return { main: '🐟', badge: '💦', label: '擦擦汗' };
      case 'sleeping':
        return { main: '🐟', badge: '💤', label: '充電補眠' };
      case 'angry':
        return { main: '🐟', badge: '🔥', label: '法規正義' };
      case 'master':
        return { main: '🐟', badge: '👑', label: '大師風範' };
      case 'blush':
        return { main: '🐟', badge: '🥰', label: '開心欣慰' };
      case 'default':
      default:
        return { main: '🐟', badge: '✨', label: '翻轉教育' };
    }
  };

  const { main, badge } = getPoseEmoji();

  return (
    <div
      className={`inline-flex items-center justify-center relative select-none shrink-0 ${className}`}
      style={{ width: pixelSize, height: pixelSize }}
      title={title}
    >
      {/* 翻轉教育水藍圓潤光環底座 */}
      <div
        className="w-full h-full rounded-full bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 shadow-sm flex items-center justify-center border-2 border-white relative overflow-visible"
        style={{ padding: pixelSize * 0.08 }}
      >
        {/* 主翻轉魚 Emoji */}
        <span
          className="leading-none transform -scale-x-100 filter drop-shadow-xs transition-transform duration-200"
          style={{ fontSize: `${Math.round(pixelSize * 0.58)}px` }}
        >
          {main}
        </span>

        {/* 右上角情境表情裝飾徽章 */}
        <span
          className="absolute -top-1 -right-1 leading-none filter drop-shadow-xs animate-in zoom-in duration-150"
          style={{ fontSize: `${Math.round(pixelSize * 0.38)}px` }}
        >
          {badge}
        </span>
      </div>
    </div>
  );
};
