import { TowerConfig } from '../types';

export const TOWER_CONFIGS: Record<string, TowerConfig> = {
  // 1. 🖊️ 紅筆批改塔（象徵「專注與指引」）
  red_pen: {
    type: 'red_pen',
    name: '紅筆批改塔',
    title: '一筆入魂．神速批改',
    symbolism: '象徵「專注與指引」',
    description: '每位老師最親密的夥伴！高速發射紅墨水批閱射線，單體攻速極快，精準點殺焦慮雜兵。',
    icon: 'PenTool',
    baseCost: 100,
    range: 140,
    damage: 26,
    attackSpeed: 1.8,
    damageType: 'single',
    specialEffect: '最高等級解鎖「全對大勾勾」3倍爆擊效果',
    levels: [
      {
        level: 1,
        name: '初階紅筆',
        cost: 100,
        damage: 26,
        range: 140,
        attackSpeed: 1.8,
        description: '基本紅墨筆劃，快速點殺小兵',
        unlockedSkill: '細心標注',
        skillDesc: '攻速提升 10%'
      },
      {
        level: 2,
        name: '油性耐寫筆',
        cost: 130,
        damage: 48,
        range: 165,
        attackSpeed: 2.2,
        description: '出水更順暢，傷害大幅提升',
        unlockedSkill: '重點圈選',
        skillDesc: '命中敵人有 30% 機率造成 1.8 倍「重點考題」爆擊'
      },
      {
        level: 3,
        name: '教師節金筆',
        cost: 230,
        damage: 88,
        range: 190,
        attackSpeed: 2.8,
        description: '最高等級「全對大勾勾」特效，專治各類作業頑疾！',
        unlockedSkill: '全對大勾勾',
        skillDesc: '擊中怪物時有 25% 機率觸發金色大勾勾，造成 3 倍真實傷害！'
      }
    ]
  },

  // 2. ✨ 彩虹粉筆光束（象徵「傳承與啟發」）
  chalk_laser: {
    type: 'chalk_laser',
    name: '彩虹粉筆光束',
    title: '無塵粉筆．知識光束',
    symbolism: '象徵「傳承與啟發」',
    description: '五彩繽紛的無塵粉筆，聚焦成持續照射的高能知識光束，附帶穿透與減速。',
    icon: 'Sparkles',
    baseCost: 160,
    range: 165,
    damage: 22,
    attackSpeed: 4.5,
    damageType: 'beam',
    specialEffect: '持續灼燒並造成 25% 減速效果',
    levels: [
      {
        level: 1,
        name: '雙色粉筆',
        cost: 160,
        damage: 22,
        range: 165,
        attackSpeed: 4.5,
        description: '紅白雙色光束，平穩輸出',
        unlockedSkill: '板書聚焦',
        skillDesc: '造成持續光束灼燒與 20% 減速'
      },
      {
        level: 2,
        name: '環保無塵筆',
        cost: 190,
        damage: 38,
        range: 185,
        attackSpeed: 5.0,
        description: '光束更粗，減速提升至 35%',
        unlockedSkill: '螢光加註',
        skillDesc: '減速效果提升至 35%，並可微幅彈射鄰近敵人'
      },
      {
        level: 3,
        name: '螢光彩虹板書',
        cost: 290,
        damage: 66,
        range: 215,
        attackSpeed: 5.5,
        description: '知識光輝無所遁形，路徑全面覆蓋！',
        unlockedSkill: '彩虹光稜束',
        skillDesc: '光束分裂為 3 道多重彩虹雷射，同時鎖定並灼燒 3 個前進目標！'
      }
    ]
  },

  // 3. 🌿 舒壓精油按摩（第三層道具！真的可以消除老師疲憊的減壓神物）
  blackboard_eraser: {
    type: 'blackboard_eraser',
    name: '舒壓精油按摩',
    title: '滾珠精油．肩頸舒壓',
    symbolism: '第三層道具「肩頸深層放鬆與消除疲憊」',
    description: '真的可以消除老師疲憊的神級減壓道具！滾珠薄荷與薰衣草精油香氛，大範圍釋放草本放鬆震波，強力撫平肩頸僵硬與高壓，擊退群聚壓力怪物！',
    icon: 'Sparkles',
    baseCost: 220,
    range: 135,
    damage: 68,
    attackSpeed: 0.9,
    damageType: 'aoe',
    specialEffect: '全方位精油香氛範圍衝擊，並擊退非Boss敵人0.5秒',
    levels: [
      {
        level: 1,
        name: '薄荷舒緩滾珠精油',
        cost: 220,
        damage: 68,
        range: 135,
        attackSpeed: 0.9,
        description: '近距離環狀草本舒緩波，放鬆肩頸緊繃',
        unlockedSkill: '草本舒緩衝擊',
        skillDesc: '擊退非Boss敵人 25 像素並消減疲憊'
      },
      {
        level: 2,
        name: '薰衣草肩頸放鬆按摩油',
        cost: 220,
        damage: 110,
        range: 155,
        attackSpeed: 1.0,
        description: '草本香氣加倍，擊退距離增強與舒展筋骨',
        unlockedSkill: '深層釋壓氣旋',
        skillDesc: '擊退距離增加至 40 像素，並使怪物短暫僵直 0.5 秒'
      },
      {
        level: 3,
        name: '極致全身SPA精油大陣',
        cost: 340,
        damage: 180,
        range: 180,
        attackSpeed: 1.15,
        description: '深層精油SPA全面釋放！徹底消除身心長期疲累！',
        unlockedSkill: '極致放鬆重啟波',
        skillDesc: '精油放鬆波引發全場舒暢衝擊，強制使範圍內所有目標舒緩暈眩 1.2 秒！'
      }
    ]
  },

  // 4. 🍬 舒喉潤喉糖（第四高道具！老師講課沙啞救星，清甜撫平焦慮）
  heart_bell: {
    type: 'heart_bell',
    name: '舒喉潤喉糖',
    title: '澎大海蜂膠．清甜甘醇',
    symbolism: '第四高道具「潤喉護嗓與清涼撫平」',
    description: '第四高神級解壓道具！老師講課講到沙啞的救命神物。散發草本清涼甜香，大幅緩速敵人 50%，撫平嘶吼狂躁並軟化敵方防禦 20%！',
    icon: 'HeartHandshake',
    baseCost: 260,
    range: 170,
    damage: 24,
    attackSpeed: 1.3,
    damageType: 'slow',
    specialEffect: '持續減速50%，清甜潤喉軟化怪物防禦20%',
    levels: [
      {
        level: 1,
        name: '草本澎大海潤喉糖',
        cost: 260,
        damage: 24,
        range: 170,
        attackSpeed: 1.3,
        description: '生津止渴，輕柔減速 45% 撫平躁動',
        unlockedSkill: '生津潤喉甜香',
        skillDesc: '使受到影響的怪物移動減速 45%'
      },
      {
        level: 2,
        name: '天然蜂膠枇杷潤喉膏',
        cost: 220,
        damage: 42,
        range: 195,
        attackSpeed: 1.5,
        description: '清涼撫平狂躁，減速 55% 並軟化敵方防禦',
        unlockedSkill: '清涼平息狂躁',
        skillDesc: '使敵人受到額外 25% 傷害，並打斷怪物的衝刺技能'
      },
      {
        level: 3,
        name: '黃金極品羅漢果舒喉晶球',
        cost: 320,
        damage: 72,
        range: 225,
        attackSpeed: 1.7,
        description: '長效沁涼護嗓，甘醇芬芳籠罩整座校園',
        unlockedSkill: '沁涼心靈甘露',
        skillDesc: '減速提升至 65%，任何在甘霖香氣內消散的敵人將額外返還 1 點心靈韌性！'
      }
    ]
  },

  // 5. 🌟 翻轉教育資源（最高層級道具！集結翻轉教育海量教學錦囊與專業後盾）
  knowledge_beacon: {
    type: 'knowledge_beacon',
    name: '翻轉教育資源',
    title: '創新備課．終極錦囊',
    symbolism: '最高層級道具「最強備課解方與專業後盾」',
    description: '最高層級終極神裝！匯聚「翻轉教育」海量創新教案、班級經營錦囊與專業法規後盾。發射超高能教學靈感光束，直線貫穿重創，以創新生態徹底消除教學無力與職業倦怠，對厚甲魔王造成 200% 破甲淨化！',
    icon: 'BookOpen',
    baseCost: 340,
    range: 200,
    damage: 135,
    attackSpeed: 1.25,
    damageType: 'single',
    specialEffect: '單體超高貫穿創新光束，對護盾與魔王造成200%破甲消融傷害',
    levels: [
      {
        level: 1,
        name: '翻轉教學靈感錦囊',
        cost: 340,
        damage: 135,
        range: 200,
        attackSpeed: 1.25,
        description: '高能創新射線，單體直線貫穿重擊破防',
        unlockedSkill: '創新啟發光束',
        skillDesc: '對帶有護盾的敵人造成額外 50% 真實破甲傷害'
      },
      {
        level: 2,
        name: '班級經營實戰百寶箱',
        cost: 320,
        damage: 230,
        range: 225,
        attackSpeed: 1.45,
        description: '多元教案共振，引發教學靈感爆發',
        unlockedSkill: '多元共備共鳴',
        skillDesc: '每 3 次攻擊觸發「教學靈感爆發」，引爆 2.5 倍真實傷害並使目標定身 0.8 秒'
      },
      {
        level: 3,
        name: '翻轉教育全方位資源庫',
        cost: 480,
        damage: 380,
        range: 260,
        attackSpeed: 1.65,
        description: '海量備課神器與專業顧問全力支援，徹底驅散一切教學倦怠！',
        unlockedSkill: '全人教育創新大陣',
        skillDesc: '高能光束貫穿主目標後穿透直線所有敵人，並將所有形式主義護盾直接消散！'
      }
    ]
  },

  // 相容保留（非五大焦點教具，提供舊檔或自訂存檔相容）
  smart_board: {
    type: 'smart_board',
    name: '智慧觸控螢幕',
    title: '輔助多媒體設備',
    symbolism: '象徵「輔助設備」',
    description: '課堂輔助多媒體設備。',
    icon: 'Tv',
    baseCost: 180,
    range: 160,
    damage: 35,
    attackSpeed: 1.1,
    damageType: 'chain',
    specialEffect: '輔助彈跳連鎖',
    levels: [
      { level: 1, name: '觸控設備', cost: 180, damage: 35, range: 160, attackSpeed: 1.1, description: '設備輔助', unlockedSkill: '連鎖', skillDesc: '彈跳' }
    ]
  },
  coffee_machine: {
    type: 'coffee_machine',
    name: '現磨美式咖啡機',
    title: '辦公室靈魂泉源',
    symbolism: '象徵「活力支援」',
    description: '提升周遭攻速。',
    icon: 'Coffee',
    baseCost: 180,
    range: 140,
    damage: 0,
    attackSpeed: 0.1,
    damageType: 'buff',
    specialEffect: '攻速提升',
    levels: [
      { level: 1, name: '美式咖啡機', cost: 180, damage: 0, range: 140, attackSpeed: 0.1, description: '提神', unlockedSkill: '提神', skillDesc: '提升攻速' }
    ]
  },
  encouragement_megaphone: {
    type: 'encouragement_megaphone',
    name: '讚美鼓勵大聲公',
    title: '信心百倍．正向激勵',
    symbolism: '象徵「鼓勵」',
    description: '廣播正向音波。',
    icon: 'Megaphone',
    baseCost: 150,
    range: 160,
    damage: 40,
    attackSpeed: 1.3,
    damageType: 'aoe',
    specialEffect: '音波震擊',
    levels: [
      { level: 1, name: '正向喇叭', cost: 150, damage: 40, range: 160, attackSpeed: 1.3, description: '正向廣播', unlockedSkill: '激勵', skillDesc: '音波' }
    ]
  },
  compassion_breeze: {
    type: 'compassion_breeze',
    name: '春風關愛花園',
    title: '春風化雨．潤物無聲',
    symbolism: '象徵「關愛」',
    description: '溫和同理減速。',
    icon: 'Flower2',
    baseCost: 160,
    range: 150,
    damage: 20,
    attackSpeed: 2.0,
    damageType: 'aoe',
    specialEffect: '範圍減速',
    levels: [
      { level: 1, name: '心靈苗圃', cost: 160, damage: 20, range: 150, attackSpeed: 2.0, description: '同理拂塵', unlockedSkill: '同理', skillDesc: '減速' }
    ]
  }
};

// 聚焦在 5 大核心教學與減壓道具（第三層精油按摩、第四高潤喉糖、最高層級翻轉教育資源）
export const AVAILABLE_TOWERS: string[] = [
  'red_pen',
  'chalk_laser',
  'blackboard_eraser',
  'heart_bell',
  'knowledge_beacon'
];

// Calculate dynamic purchase cost for a tower based on duplicate count on the board
export function getTowerPurchaseCost(baseCost: number, countOnField: number): number {
  if (countOnField <= 0) return baseCost;
  // +35% per existing tower of the same type on the field
  const multiplier = 1 + countOnField * 0.35;
  return Math.round(baseCost * multiplier);
}

// Calculate curriculum synergy based on unique tower types on the board (聚焦五大教具)
export interface CurriculumSynergy {
  uniqueTypesCount: number;
  level: number; // 0: None, 1: 3 types, 2: 4 types, 3: 5 types (全集齊)
  title: string;
  badge: string;
  rangeBonus: number; // e.g. 0.12 (+12%)
  speedBonus: number; // e.g. 0.10 (+10%)
  critBonus: number;  // e.g. 0.15 (+15%)
  description: string;
}

export function getCurriculumSynergy(placedTowers: { type: string }[]): CurriculumSynergy {
  const uniqueTypes = new Set(placedTowers.map(t => t.type)).size;
  if (uniqueTypes >= 5) {
    return {
      uniqueTypesCount: uniqueTypes,
      level: 3,
      title: '五育均衡・全人教育大成',
      badge: '👑 五大教具全集齊 (5種)',
      rangeBonus: 0.25,
      speedBonus: 0.25,
      critBonus: 0.25,
      description: '全體射程 +25%、攻速 +25%、爆擊傷害 +25%！'
    };
  } else if (uniqueTypes >= 4) {
    return {
      uniqueTypesCount: uniqueTypes,
      level: 2,
      title: '多元教研共鳴領域',
      badge: '🌟 四維協同 (4種)',
      rangeBonus: 0.15,
      speedBonus: 0.15,
      critBonus: 0.15,
      description: '全體射程 +15%、攻速 +15%、爆擊率 +15%！'
    };
  } else if (uniqueTypes >= 3) {
    return {
      uniqueTypesCount: uniqueTypes,
      level: 1,
      title: '教學協同共鳴',
      badge: '✨ 基礎協同 (3種)',
      rangeBonus: 0.10,
      speedBonus: 0.10,
      critBonus: 0.0,
      description: '全體射程 +10%、攻速 +10%！'
    };
  }
  return {
    uniqueTypesCount: uniqueTypes,
    level: 0,
    title: uniqueTypes === 1 ? '單一教具偏科' : '未啟動教學共鳴',
    badge: uniqueTypes === 1 ? '⚠️ 單一教具偏科' : '🌱 籌組教具中',
    rangeBonus: 0,
    speedBonus: 0,
    critBonus: 0,
    description: uniqueTypes === 1
      ? '相同教具重複採購費用大幅遞增（+35%/座）！請配置 3 種以上不同教具解鎖全人教育增益'
      : '地圖上部署 3 種以上不同教具即可啟動全場共鳴增益！'
  };
}
