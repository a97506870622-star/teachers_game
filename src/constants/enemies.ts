import { EnemyConfig } from '../types';

export const ENEMY_CONFIGS: Record<string, EnemyConfig> = {
  // --- 經典校園壓力怪物 ---
  homework: {
    type: 'homework',
    name: '堆成小山的未改作業',
    description: '永遠改不完的作文簿、數學作業與聯絡簿，一疊疊壓在肩頭！',
    emoji: '📚',
    baseHp: 110,
    speed: 52,
    energyReward: 20,
    damageToTeacher: 5,
    size: 20,
    color: '#e11d48'
  },
  sleepy_bug: {
    type: 'sleepy_bug',
    name: '課堂集體放空瞌睡蟲',
    description: '下午第一節課飄進教室的催眠魔咒，讓學生整排釣魚！',
    emoji: '😴',
    baseHp: 85,
    speed: 68,
    energyReward: 22,
    damageToTeacher: 6,
    size: 18,
    color: '#8b5cf6'
  },
  parent_call: {
    type: 'parent_call',
    name: '深夜奪命連環Call',
    description: '「老師！我家寶貝今天在學校怎麼水壺少喝了20cc？」速度飛快的焦慮鈴聲！',
    emoji: '📱',
    baseHp: 150,
    speed: 80,
    energyReward: 30,
    damageToTeacher: 12,
    size: 22,
    color: '#f97316'
  },
  bureaucracy: {
    type: 'bureaucracy',
    name: '厚重的填表與行政公文',
    description: '「請於今日下班前填妥八項非教學填報表單」，防禦力極高！',
    emoji: '🗂️',
    baseHp: 280,
    speed: 38,
    energyReward: 45,
    damageToTeacher: 15,
    size: 25,
    color: '#0284c7'
  },
  glitch_projector: {
    type: 'glitch_projector',
    name: '關鍵時刻故障的單槍投影機',
    description: '公開觀課前一分鐘突然當機藍畫面或燈泡過熱，考驗老師的急智與心臟！',
    emoji: '📽️',
    baseHp: 210,
    speed: 46,
    energyReward: 38,
    damageToTeacher: 14,
    size: 24,
    color: '#ca8a04'
  },
  counseling_records_boss: {
    type: 'counseling_records_boss',
    name: '無底深淵輔導紀錄與個案填報魔王',
    description: '中小學高中老師心中真正的超級夢魘！厚達數百頁的個別化輔導晤談紀錄、危機通報與追蹤檢核表，防禦力驚人，具備雙階段型態，會施放退件印章封印教具、暴走後引發校安海嘯！',
    emoji: '📑',
    baseHp: 18500,
    speed: 25,
    energyReward: 600,
    damageToTeacher: 50,
    size: 44,
    color: '#dc2626',
    isBoss: true
  },
  evaluation_boss: {
    type: 'evaluation_boss',
    name: '無底深淵輔導紀錄與個案填報魔王',
    description: '中小學高中老師心中真正的超級夢魘！厚達數百頁的個別化輔導晤談紀錄、危機通報與追蹤檢核表，防禦力驚人！',
    emoji: '📑',
    baseHp: 18500,
    speed: 25,
    energyReward: 600,
    damageToTeacher: 50,
    size: 44,
    color: '#dc2626',
    isBoss: true
  },
  school_affairs_meeting_boss: {
    type: 'school_affairs_meeting_boss',
    name: '濫訴狂潮．校事會議調查魔王',
    description: '近年台灣教師面臨的最沉重精神折磨！無差別受理匿名黑函與繁瑣程序調查，自帶「程序折磨形式主義護甲」，普通攻擊減免 60%，唯有【法律鐵鎚 🔨】依法反擊才能徹底破甲！',
    emoji: '⚖️',
    baseHp: 21000,
    speed: 23,
    energyReward: 750,
    damageToTeacher: 55,
    size: 46,
    color: '#7f1d1d',
    isBoss: true
  },

  // --- 教師節特企：具有深刻教育意義的敵人 ---
  ignorance: {
    type: 'ignorance',
    name: '冥頑迷惘的無知之霧',
    description: '代表「無知」。拒絕探索、盲從偏聽的混沌迷霧，具有極高防禦護甲，需用最高層級「翻轉教育資源」的創新光束破除！',
    emoji: '🌫️',
    baseHp: 580,
    speed: 40,
    energyReward: 50,
    damageToTeacher: 16,
    size: 26,
    color: '#64748b'
  },
  burnout: {
    type: 'burnout',
    name: '習得性無助倦怠魔',
    description: '代表「倦怠」。「反正再怎麼努力也沒用…」沉重且具壓迫感，需「春風關愛花園」與「愛心輔導鐘」的同理心溫暖淨化！',
    emoji: '🥀',
    baseHp: 680,
    speed: 32,
    energyReward: 65,
    damageToTeacher: 20,
    size: 28,
    color: '#78350f'
  },
  prejudice: {
    type: 'prejudice',
    name: '固執偏見刻板泥偶',
    description: '代表「偏見與標籤」。全身石化堅硬、難以動搖，對物理震波有高抗性，唯有融入知識與大愛才能打破框架！',
    emoji: '🗿',
    baseHp: 520,
    speed: 36,
    energyReward: 55,
    damageToTeacher: 18,
    size: 27,
    color: '#71717a'
  },
  anxiety: {
    type: 'anxiety',
    name: '考試自卑焦慮黑影',
    description: '代表「自卑與自我懷疑」。「我做不到…我好笨…」在自責中狂躁狂奔，急需「讚美鼓勵大聲公」注入勇氣！',
    emoji: '⚡',
    baseHp: 280,
    speed: 92,
    energyReward: 40,
    damageToTeacher: 12,
    size: 20,
    color: '#a855f7'
  },
  nihilism_boss: {
    type: 'nihilism_boss',
    name: '教育虛無心靈荒漠之主',
    description: '教師節特企終極魔王！「讀書有什麼用？何必費心育人？」試圖熄滅所有教師心中的火種，必須齊聚「知識、關愛、鼓勵」擊碎荒漠！',
    emoji: '🪐',
    baseHp: 16800,
    speed: 26,
    energyReward: 600,
    damageToTeacher: 50,
    size: 44,
    color: '#4c1d95',
    isBoss: true
  }
};
