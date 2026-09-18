import { RewardItem } from '../types';

export const INITIAL_REWARD_ITEMS: RewardItem[] = [
  {
    id: 'energy_coffee',
    name: '🧊 冰冰冰冰冰冰繃',
    subtitle: '全場急凍魔王・把握時間從容佈防',
    description: '「冰冰冰冰冰冰繃！」魔性洗腦神曲降臨！全場所有怪物與大魔王瞬間急凍凍結 7 秒，同時現撥 ⚡100 點教學熱忱，讓老師能從容置辦防禦塔與升級教具！（可至茶水間寫加油小卡補充次數）',
    icon: 'Sparkles',
    count: 3,
    maxCount: 8,
    cooldownSeconds: 20,
    lastUsedTimestamp: 0,
    effect: 'freeze_all'
  },
  {
    id: 'legal_hammer',
    name: '🥊 法律鐵拳',
    subtitle: '依法捍衛專業・一擊大消除所有魔王',
    description: '「正當法律程序，法律鐵拳出擊！」翻轉教育與專業法規顧問做您的堅實後盾。鐵拳一出，依法全面駁回不實調查，直接大消除全場所有大魔王！周圍怪物亦遭受 3200 點法規痛擊與定身！',
    icon: 'Swords',
    count: 2,
    maxCount: 5,
    cooldownSeconds: 25,
    lastUsedTimestamp: 0,
    effect: 'legal_strike',
    isKeyItem: true
  }
];
