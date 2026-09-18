export type TowerType =
  | 'red_pen'
  | 'chalk_laser'
  | 'blackboard_eraser'
  | 'coffee_machine'
  | 'heart_bell'
  | 'smart_board'
  | 'knowledge_beacon'
  | 'compassion_breeze'
  | 'encouragement_megaphone';

export type EnemyType =
  | 'homework'
  | 'parent_call'
  | 'bureaucracy'
  | 'sleepy_bug'
  | 'evaluation_boss'
  | 'counseling_records_boss'
  | 'school_affairs_meeting_boss'
  | 'glitch_projector'
  | 'ignorance'
  | 'burnout'
  | 'prejudice'
  | 'anxiety'
  | 'nihilism_boss';

export type TargetStrategy = 'first' | 'last' | 'strongest' | 'weakest';

export interface Point {
  x: number;
  y: number;
}

export interface MapData {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  path: Point[];
  gridCols: number;
  gridRows: number;
  cellSize: number;
  buildableGrid: boolean[][]; // true if cell can place a tower
  decorations: {
    x: number;
    y: number;
    type: 'desk' | 'podium' | 'books' | 'flower' | 'tree' | 'clock' | 'printer' | 'chalkboard' | 'apple' | 'trophy' | 'ribbon';
    label?: string;
  }[];
  startPoint: Point;
  endPoint: Point;
  themeColor: string;
  recommendedTowers: string;
  isSpecialEvent?: boolean;
  themeBgGradient?: string;
  canvasBg?: string;
  floorColor1?: string;
  floorColor2?: string;
  floorStroke?: string;
  pathOuterColor?: string;
  pathCoreColor?: string;
  pathDashColor?: string;
}

export interface TowerLevelData {
  level: number;
  name: string;
  cost: number;
  damage: number;
  range: number;
  attackSpeed: number;
  description: string;
  unlockedSkill?: string;
  skillDesc?: string;
}

export interface TowerConfig {
  type: TowerType;
  name: string;
  title: string;
  symbolism: string; // e.g. 知識, 關愛, 鼓勵, 專注
  description: string;
  icon: string;
  baseCost: number;
  range: number;
  damage: number;
  attackSpeed: number; // attacks per second
  damageType: 'single' | 'beam' | 'aoe' | 'buff' | 'slow' | 'chain';
  specialEffect?: string;
  levels: TowerLevelData[];
}

export type GameDifficulty = 'casual' | 'standard' | 'hardcore';

export interface PlacedTower {
  id: string;
  type: TowerType;
  gridX: number;
  gridY: number;
  x: number;
  y: number;
  level: number;
  range: number;
  damage: number;
  attackSpeed: number;
  lastAttackTime: number;
  totalDamageDealt: number;
  kills: number;
  targetStrategy: TargetStrategy;
  rotation: number;
  targetId: string | null;
  silencedUntil?: number; // timestamp when boss stamps "退件"
}

export interface EnemyConfig {
  type: EnemyType;
  name: string;
  description: string;
  emoji: string;
  baseHp: number;
  speed: number; // pixels per sec
  energyReward: number;
  damageToTeacher: number; // SAN loss
  size: number;
  color: string;
  isBoss?: boolean;
}

export interface TeacherCharacter {
  x: number;
  y: number;
  currentHp: number;
  maxHp: number;
  distanceTraveled: number; // in pixels from start of path
  totalPathLength: number;
  speed: number; // pixels per second
  isHurt: boolean;
  hurtTimer: number;
  stepAnim: number;
  shield: number;
  saying?: string;
  sayingTimer?: number;
}

export interface ActiveEnemy {
  id: string;
  type: EnemyType;
  x: number;
  y: number;
  maxHp: number;
  currentHp: number;
  speed: number;
  baseSpeed: number;
  pathIndex: number;
  distanceTraveled: number; // in pixels from pressure source toward start
  distanceAlongPath: number; // absolute pixels from start (0 to totalPathLength)
  energyReward: number;
  damageToTeacher: number;
  size: number;
  color: string;
  frozenUntil: number; // timestamp
  slowedUntil: number;
  slowFactor: number;
  isBoss: boolean;
  spawnTime: number;
  bossPhase?: 1 | 2;
  enraged?: boolean;
  shieldHp?: number;
  maxShieldHp?: number;
}

export interface Projectile {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  targetEnemyId: string;
  speed: number;
  damage: number;
  type: 'pen_mark' | 'chalk_shard' | 'laser' | 'shockwave' | 'sound_wave' | 'magic_spark';
  color: string;
  radius: number;
  chainCount?: number;
  hitEnemies?: string[];
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  size: number;
  shape?: 'circle' | 'spark' | 'star' | 'letter' | 'flower' | 'ice';
  text?: string;
  maxLife: number;
  currentLife: number;
}

export interface DamagePopup {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  opacity: number;
  vy: number;
  lifetime: number;
  isCrit?: boolean;
}

export interface RewardItem {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  icon: string;
  count: number;
  maxCount: number;
  cooldownSeconds: number;
  lastUsedTimestamp: number;
  effect: 'freeze_all' | 'speed_boost' | 'heal_resilience' | 'instant_leave' | 'legal_strike';
  isKeyItem?: boolean;
}

export interface VoiceCareMessage {
  id: string;
  category: 'wave_clear' | 'boss_alert' | 'low_hp' | 'victory' | 'defeat' | 'magic_wand' | 'lounge';
  text: string;
  voiceText: string;
  author: string;
  mood: 'warm' | 'encouraging' | 'comforting' | 'playful';
}

export interface WaveConfig {
  waveNumber: number;
  enemies: {
    type: EnemyType;
    count: number;
    interval: number; // spawn delay in ms
  }[];
  waveReward: number;
  waveQuote: string;
}
