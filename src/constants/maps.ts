import { MapData } from '../types';

export const GAME_MAPS: MapData[] = [
  // 1. 早晨 07:20 校門站導護
  {
    id: 'teachers_day_special',
    name: '第 1 節：早晨 07:20 校門站導護',
    subtitle: '哨音．反光背心．導護旗交管防線',
    description: '早晨 07:20，校門口湧入趕上班家長的汽機車與遲到衝撞人潮！吹響哨音、揮舞導護旗，在校門口路口築起學童安全的第一道防線！',
    gridCols: 16,
    gridRows: 10,
    cellSize: 48,
    themeColor: '#ea580c', // Crossing Orange
    recommendedTowers: '舒壓精油按摩 + 舒喉潤喉糖',
    isSpecialEvent: true,
    themeBgGradient: 'from-amber-100/70 via-orange-50/40 to-stone-100',
    canvasBg: '#fff7ed',
    floorColor1: '#ffedd5',
    floorColor2: '#fed7aa',
    floorStroke: 'rgba(234, 88, 12, 0.18)',
    pathOuterColor: '#ea580c',
    pathCoreColor: '#334155',
    pathDashColor: '#fde047',
    startPoint: { x: 0, y: 3 },
    endPoint: { x: 15, y: 6 },
    path: [
      { x: 0, y: 3 },
      { x: 3, y: 3 },
      { x: 3, y: 1 },
      { x: 7, y: 1 },
      { x: 7, y: 8 },
      { x: 11, y: 8 },
      { x: 11, y: 3 },
      { x: 13, y: 3 },
      { x: 13, y: 6 },
      { x: 15, y: 6 }
    ],
    decorations: [],
    buildableGrid: []
  },
  // 2. 早晨 07:50 晨光時間與校園大掃除
  {
    id: 'classroom',
    name: '第 2 節：晨光時間與校園大掃除',
    subtitle: '晨讀靜心．竹掃把掃落葉與作業收繳',
    description: '早晨 07:50，晨讀鐘聲響起，聯絡簿如雪片飛來！外掃區拿著竹掃把清掃落葉、內掃區倒垃圾整理回收，全班動員迎接充實早晨！',
    gridCols: 16,
    gridRows: 10,
    cellSize: 48,
    themeColor: '#059669', // Fresh Green
    recommendedTowers: '紅筆批改塔 + 舒壓精油按摩',
    themeBgGradient: 'from-emerald-100/70 via-teal-50/40 to-stone-100',
    canvasBg: '#f0fdf4',
    floorColor1: '#dcfce7',
    floorColor2: '#bbf7d0',
    floorStroke: 'rgba(5, 150, 105, 0.2)',
    pathOuterColor: '#059669',
    pathCoreColor: '#1e293b',
    pathDashColor: '#86efac',
    startPoint: { x: 0, y: 2 },
    endPoint: { x: 15, y: 7 },
    path: [
      { x: 0, y: 2 },
      { x: 4, y: 2 },
      { x: 4, y: 5 },
      { x: 8, y: 5 },
      { x: 8, y: 2 },
      { x: 12, y: 2 },
      { x: 12, y: 7 },
      { x: 15, y: 7 }
    ],
    decorations: [],
    buildableGrid: []
  },
  // 3. 上午 09:00 日常課堂與午休鐘聲
  {
    id: 'admin_hall',
    name: '第 3 節：日常課堂與午休鐘聲',
    subtitle: '板書疾馳．多科授課與突發狀況處理',
    description: '上午 09:00 至下午，連堂密集授課展開！黑板寫滿板書，隨時解答疑難雜症、調解跑跳擦傷，守護專注與平靜的學習氛圍！',
    gridCols: 16,
    gridRows: 10,
    cellSize: 48,
    themeColor: '#2563eb', // Classroom Blue
    recommendedTowers: '彩虹粉筆光束 + 舒喉潤喉糖',
    themeBgGradient: 'from-sky-100/70 via-blue-50/40 to-stone-100',
    canvasBg: '#f8fafc',
    floorColor1: '#fef9c3',
    floorColor2: '#fef08a',
    floorStroke: 'rgba(202, 138, 4, 0.18)',
    pathOuterColor: '#1d4ed8',
    pathCoreColor: '#0f172a',
    pathDashColor: '#38bdf8',
    startPoint: { x: 0, y: 1 },
    endPoint: { x: 15, y: 8 },
    path: [
      { x: 0, y: 1 },
      { x: 3, y: 1 },
      { x: 3, y: 7 },
      { x: 7, y: 7 },
      { x: 7, y: 3 },
      { x: 11, y: 3 },
      { x: 11, y: 8 },
      { x: 15, y: 8 }
    ],
    decorations: [],
    buildableGrid: []
  },
  // 4. 六月鳳凰花開畢業典禮
  {
    id: 'campus_track',
    name: '第 4 節：鳳凰花開畢業典禮',
    subtitle: '鳳凰花紅．大禮堂紅地毯祝福與終極考驗',
    description: '六月畢業季，大禮堂鋪上紅地毯！孩子們即將展翅高飛，迎戰期末評鑑與校事會議等終極大魔王集結，以無私的教育初衷送上最深祝福！',
    gridCols: 16,
    gridRows: 10,
    cellSize: 48,
    themeColor: '#e11d48', // Graduation Rose Red
    recommendedTowers: '翻轉教育資源 + 五育協同防線',
    themeBgGradient: 'from-rose-100/70 via-red-50/40 to-stone-100',
    canvasBg: '#fff1f2',
    floorColor1: '#ffe4e6',
    floorColor2: '#fecdd3',
    floorStroke: 'rgba(225, 29, 72, 0.22)',
    pathOuterColor: '#be123c',
    pathCoreColor: '#881337',
    pathDashColor: '#fef08a',
    startPoint: { x: 2, y: 0 },
    endPoint: { x: 15, y: 5 },
    path: [
      { x: 2, y: 0 },
      { x: 2, y: 8 },
      { x: 13, y: 8 },
      { x: 13, y: 2 },
      { x: 6, y: 2 },
      { x: 6, y: 5 },
      { x: 15, y: 5 }
    ],
    decorations: [],
    buildableGrid: []
  }
];

// Helper to determine if a cell is on the path
export function isCellOnPath(path: { x: number; y: number }[], cellX: number, cellY: number): boolean {
  for (let i = 0; i < path.length - 1; i++) {
    const p1 = path[i];
    const p2 = path[i + 1];
    const minX = Math.min(p1.x, p2.x);
    const maxX = Math.max(p1.x, p2.x);
    const minY = Math.min(p1.y, p2.y);
    const maxY = Math.max(p1.y, p2.y);

    if (p1.x === p2.x && cellX === p1.x && cellY >= minY && cellY <= maxY) {
      return true;
    }
    if (p1.y === p2.y && cellY === p1.y && cellX >= minX && cellX <= maxX) {
      return true;
    }
  }
  return false;
}

// Helper to check if a cell is right in the Pressure Core danger zone (spawn area)
export function isCellNearPressureCore(endPoint: { x: number; y: number }, cellX: number, cellY: number): boolean {
  const dist = Math.hypot(cellX - endPoint.x, cellY - endPoint.y);
  return dist <= 1.8;
}
