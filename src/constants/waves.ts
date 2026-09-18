import { WaveConfig } from '../types';

export const STANDARD_WAVES: WaveConfig[] = [
  {
    waveNumber: 1,
    enemies: [
      { type: 'homework', count: 8, interval: 1400 }
    ],
    waveReward: 90,
    waveQuote: '第 1 波：一疊疊晨光小考卷飄來了，請老師放置紅筆塔批閱！'
  },
  {
    waveNumber: 2,
    enemies: [
      { type: 'homework', count: 10, interval: 1100 },
      { type: 'sleepy_bug', count: 5, interval: 1300 }
    ],
    waveReward: 110,
    waveQuote: '第 2 波：下午第一節課的瞌睡蟲混在作業裡，小心防範！'
  },
  {
    waveNumber: 3,
    enemies: [
      { type: 'homework', count: 12, interval: 900 },
      { type: 'parent_call', count: 6, interval: 1200 },
      { type: 'sleepy_bug', count: 6, interval: 1000 }
    ],
    waveReward: 140,
    waveQuote: '第 3 波：奪命連環Call響個不停！急需愛心輔導鐘減速安撫！'
  },
  {
    waveNumber: 4,
    enemies: [
      { type: 'bureaucracy', count: 6, interval: 1600 },
      { type: 'parent_call', count: 8, interval: 1000 },
      { type: 'glitch_projector', count: 4, interval: 1800 }
    ],
    waveReward: 170,
    waveQuote: '第 4 波：厚重的行政填報公文逼近，防禦力超高！'
  },
  {
    waveNumber: 5,
    enemies: [
      { type: 'bureaucracy', count: 8, interval: 1300 },
      { type: 'glitch_projector', count: 6, interval: 1400 },
      { type: 'parent_call', count: 10, interval: 800 }
    ],
    waveReward: 220,
    waveQuote: '第 5 波：全體壓力怪物大暴走！快準備好【🧊 冰冰冰冰冰冰繃】急凍魔王！'
  },
  {
    waveNumber: 6,
    enemies: [
      { type: 'homework', count: 14, interval: 700 },
      { type: 'parent_call', count: 8, interval: 900 },
      { type: 'evaluation_boss', count: 1, interval: 2500 },
      { type: 'bureaucracy', count: 6, interval: 1200 }
    ],
    waveReward: 360,
    waveQuote: '🔥 最終波：突擊校務綜合評鑑大魔王降臨！展現全體老師的教育魂！'
  }
];

export const TEACHERS_DAY_WAVES: WaveConfig[] = [
  {
    waveNumber: 1,
    enemies: [
      { type: 'ignorance', count: 6, interval: 1400 },
      { type: 'anxiety', count: 4, interval: 1200 }
    ],
    waveReward: 120,
    waveQuote: '第 1 波：混沌的「無知之霧」與「自卑陰影」逼近！請以「知識」與「鼓勵」為孩子開道！'
  },
  {
    waveNumber: 2,
    enemies: [
      { type: 'burnout', count: 5, interval: 1600 },
      { type: 'sleepy_bug', count: 7, interval: 1100 },
      { type: 'anxiety', count: 5, interval: 1000 }
    ],
    waveReward: 140,
    waveQuote: '第 2 波：「習得性無助倦怠魔」沉重步入！唯有「關愛」與同理心花瓣能融化冰霜！'
  },
  {
    waveNumber: 3,
    enemies: [
      { type: 'prejudice', count: 6, interval: 1400 },
      { type: 'ignorance', count: 6, interval: 1200 },
      { type: 'parent_call', count: 5, interval: 1000 }
    ],
    waveReward: 170,
    waveQuote: '第 3 波：「固執偏見泥偶」帶著標籤來襲！運用真理光矛穿透偏見框架！'
  },
  {
    waveNumber: 4,
    enemies: [
      { type: 'burnout', count: 7, interval: 1300 },
      { type: 'anxiety', count: 8, interval: 800 },
      { type: 'bureaucracy', count: 5, interval: 1500 }
    ],
    waveReward: 210,
    waveQuote: '第 4 波：自卑與倦怠交織形成低迷風暴！發動「讚美大聲公」注入勇氣！'
  },
  {
    waveNumber: 5,
    enemies: [
      { type: 'ignorance', count: 8, interval: 1000 },
      { type: 'prejudice', count: 8, interval: 1100 },
      { type: 'burnout', count: 6, interval: 1300 }
    ],
    waveReward: 260,
    waveQuote: '第 5 波：全場迷惘與倦怠暴動！快施展【🧊 冰冰冰冰冰冰繃】全場急凍解憂！'
  },
  {
    waveNumber: 6,
    enemies: [
      { type: 'anxiety', count: 10, interval: 700 },
      { type: 'burnout', count: 6, interval: 1000 },
      { type: 'nihilism_boss', count: 1, interval: 2500 },
      { type: 'ignorance', count: 8, interval: 900 }
    ],
    waveReward: 500,
    waveQuote: '🌟 最終波：代表「教育虛無與心靈荒漠之王」降臨！以知識破除無知，以關愛撫平倦怠，祝老師教師節快樂！'
  }
];

export function getWavesForMap(mapId: string): WaveConfig[] {
  if (mapId === 'teachers_day_special') {
    return TEACHERS_DAY_WAVES;
  }
  return STANDARD_WAVES;
}

export const LEVEL_WAVES = STANDARD_WAVES;
