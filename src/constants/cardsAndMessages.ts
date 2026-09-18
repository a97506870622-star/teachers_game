import { FlipFishPose } from '../components/FlipFish';

export interface TeacherCard {
  id: string;
  title: string;
  subtitle?: string;
  category: '植感陪伴' | '咖啡暖心' | '下班自由' | '心靈充電' | '公文防禦' | '溫暖鼓勵' | '自我肯定' | '杏壇頌恩' | 'Pinkoi舒壓';
  categoryColor: string;
  emoji: string;
  blessing: string;
  quoteEn?: string;
  sourceTag?: string;
  actionTip: string;
  pose: FlipFishPose;
}

export interface StickyNote {
  id: string;
  author: string;
  tag: string;
  content: string;
  likes: number;
  color: 'yellow' | 'pink' | 'cyan' | 'purple';
  createdAt: string;
}

export const TEACHER_CARE_CARDS: TeacherCard[] = [
  // ── 水月問路 ✕ 杏壇經典頌恩系列 (參考水月問路精選教師節金句) ──
  {
    id: 'card_watermoon_xingyu',
    title: '一朝沐杏雨．一生念師恩',
    subtitle: '水月問路 杏壇頌恩',
    category: '杏壇頌恩',
    categoryColor: 'bg-rose-100 text-rose-800 border-rose-300',
    emoji: '🌧️',
    blessing: '經師易遇，人師難遭。感謝老師不僅在黑板前傳授課本知識，更以溫暖品格照亮我們前行的路。三尺講台，四季耕耘，願所有的辛勞都化為甘霖，祝老師教師節快樂，平安順心！',
    quoteEn: 'A teacher affects eternity; he can never tell where his influence stops.',
    sourceTag: '水月問路精選',
    actionTip: '喝口溫開水，感受此刻的寧靜，您給予學生的愛早已化為他們心中的光。',
    pose: 'love'
  },
  {
    id: 'card_watermoon_taoli',
    title: '桃李不言．下自成蹊',
    subtitle: '水月問路 杏壇頌恩',
    category: '杏壇頌恩',
    categoryColor: 'bg-amber-100 text-amber-800 border-amber-300',
    emoji: '🍑',
    blessing: '春風化雨，潤物無聲。您默默在教室裡耕耘，那些不經意間說過的鼓勵，早已在懵懂的童年歲月裡生根發芽。謝謝老師一路以來的循循善誘與耐心包容！',
    quoteEn: 'The art of teaching is the art of assisting discovery. Thank you, teacher!',
    sourceTag: '水月問路精選',
    actionTip: '放鬆緊繃的雙肩，閉目深呼吸 10 秒鐘，靜享春風化雨的美好成果。',
    pose: 'teaching'
  },

  // ── Pinkoi 療癒好物送禮系列 (參考 Pinkoi 教師節質感送禮指南) ──
  {
    id: 'card_pinkoi_herbal_tea',
    title: '小農甘草菊花茶．溫潤護嗓',
    subtitle: 'Pinkoi 療癒好物',
    category: 'Pinkoi舒壓',
    categoryColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    emoji: '🍵',
    blessing: '連續講課六節的喉嚨救星！溫水沖泡一口清甜回甘，帶走聲帶一整天的疲憊與燥熱。親愛的老師，今天請放下擴音麥克風，好好給喉嚨放個假！',
    quoteEn: 'Take a sip of warmth, rest your voice, and nourish your soul today.',
    sourceTag: 'Pinkoi禮物誌',
    actionTip: '為自己沖泡一杯溫潤草本茶，讓天然草本香氣舒緩疲憊的喉嚨。',
    pose: 'blush'
  },
  {
    id: 'card_pinkoi_pen',
    title: '客製原木鋼筆．行雲流水',
    subtitle: 'Pinkoi 療癒好物',
    category: 'Pinkoi舒壓',
    categoryColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    emoji: '🖋️',
    blessing: '筆尖滑過紙頁的溫潤觸感，是執教生涯最真切的印記。教育是一門生命藝術，批改與評語不只是責任，更是與孩子靈魂對話的溫暖橋樑。',
    quoteEn: 'Your written words have inspired generations. Wishing you endless inspiration!',
    sourceTag: 'Pinkoi禮物誌',
    actionTip: '欣賞一下自己整齊好看的字跡，享受書寫帶來的專注與平靜。',
    pose: 'idea'
  },
  {
    id: 'card_holiday_blessing',
    title: '放下紅筆．放假大吉',
    subtitle: '台灣教育現場最真實心聲',
    category: '下班自由',
    categoryColor: 'bg-sky-100 text-sky-800 border-sky-300',
    emoji: '🏖️',
    blessing: '不是在改聯絡簿，就是在去研習的路上——今天說什麼都要放下紅筆！世界不會因為老師準時放假而停止轉動，給辛苦了一整年的自己放個假，喝咖啡、吃甜點、睡到自然醒！',
    quoteEn: 'Put down the red pen, pack your bag, and enjoy your well-deserved holiday!',
    sourceTag: '真實心聲',
    actionTip: '把筆蓋蓋上、將抽屜推回，今天給自己 100 分的放假特權！',
    pose: 'victory'
  },

  // ── 植感陪伴系列 (參考 Succuland 有肉：以植物陪伴成長、種子生根、溫暖引路為核心) ──
  {
    id: 'card_succuland_seeds',
    title: '生根萌芽．靜待花開',
    subtitle: 'Succuland 植感祝福',
    category: '植感陪伴',
    categoryColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    emoji: '🌱',
    blessing: '教育就像是一場溫柔的播種。您像園丁般悉心培育、像朋友般用心聆聽。請不要焦急，那些您付出的善意與陪伴，早已在孩子心底生根，終會在最適合的季節燦爛綻放。',
    quoteEn: 'Teachers plant seeds of knowledge that grow forever. Thank you for nurturing mine.',
    sourceTag: '綠意生機',
    actionTip: '抬頭看看窗外的大樹或桌上的綠色植栽，深呼吸三次，為一路辛勤耕耘的自己喝采！',
    pose: 'teaching'
  },
  {
    id: 'card_succuland_guide',
    title: '微光引路．發現潛能',
    subtitle: 'Succuland 植感祝福',
    category: '植感陪伴',
    categoryColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    emoji: '🪴',
    blessing: '謝謝老師幫助孩子看見自己的獨特光芒。在我們迷茫躁動時，您總是用無限的耐心與包容，做我們最堅實的依靠。能遇見您這樣溫暖的引路人，是求學路上最美好的福氣！',
    quoteEn: 'To the world you may be just a teacher, but to me, you are a hero. Happy Teachers\' Day!',
    sourceTag: '真摯感謝',
    actionTip: '在心裡輕輕想一位曾讓您欣慰的學生笑容，那是您耕耘出的最美花朵。',
    pose: 'love'
  },
  {
    id: 'card_succuland_life',
    title: '師恩如沐．生命饋贈',
    subtitle: 'Succuland 植感祝福',
    category: '溫暖鼓勵',
    categoryColor: 'bg-amber-100 text-amber-800 border-amber-300',
    emoji: '🌸',
    blessing: '師恩難忘，您將寶貴的人生智慧無私饋贈；師情深遠，為我們在長大成人的長路上指引幸福前程。您教會我們的從來不只是考卷上的答案，更是面對生活的溫柔與勇氣！',
    quoteEn: 'You have taught me more than the books. You have taught me the ABC of life. Blessed to have you!',
    sourceTag: '春風化雨',
    actionTip: '放學前收拾桌面，給自己倒一杯溫水，今天也辛苦您了。',
    pose: 'teaching'
  },
  {
    id: 'card_succuland_tree',
    title: '綠蔭如蓋．庇護桃李',
    subtitle: 'Succuland 植感祝福',
    category: '植感陪伴',
    categoryColor: 'bg-teal-100 text-teal-800 border-teal-300',
    emoji: '🌳',
    blessing: '您以無比寬廣的胸懷接納每一個獨特的靈魂，宛如校園中扎根堅毅的綠樹，為懵懂的枝枒遮擋風雨。教師節快樂，願這份生機盎然的翠綠，常伴您每一個平靜美好的日子！',
    quoteEn: 'Thank you for your endless patience and for inspiring us every single day.',
    sourceTag: '深厚師恩',
    actionTip: '下課後走到走廊伸展一下腰背，感受微風吹拂的舒暢。',
    pose: 'blush'
  },

  // ── 咖啡暖心系列 (參考 Cozy House Coffee：以香濃拿鐵、手沖慢萃、給老師暖胃舒壓為核心) ──
  {
    id: 'card_cozy_latte',
    title: 'Thanks a Latte！香濃拿鐵',
    subtitle: 'Cozy House 咖啡暖心',
    category: '咖啡暖心',
    categoryColor: 'bg-orange-100 text-orange-800 border-orange-300',
    emoji: '☕',
    blessing: '千言萬語，都化作一杯對老師最醇厚溫潤的香濃拿鐵！感謝您總是把所有的愛心與元氣傾注在課堂上。今天請暫時放下批改紅筆，好好品嚐專屬於您的悠閒午後！',
    quoteEn: 'Thanks a latte for being an amazing teacher! You make learning feel so warm and cozy.',
    sourceTag: '現煮咖啡',
    actionTip: '今天下午為自己點一杯喜歡的咖啡或奶茶，糖度奶泡隨心所欲，盡情享受香氣！',
    pose: 'love'
  },
  {
    id: 'card_cozy_pour_over',
    title: '單品慢萃．歲月醇香',
    subtitle: 'Cozy House 咖啡暖心',
    category: '咖啡暖心',
    categoryColor: 'bg-amber-100 text-amber-800 border-amber-300',
    emoji: '🫖',
    blessing: '教育就像是一杯精心慢萃的手沖咖啡，需要恰到好處的水溫與無限的細心。感謝您在無數個忙碌的日常裡，為我們萃取出最動人的智慧甘醇。老師，您辛苦了！',
    quoteEn: 'A good teacher explains, but a great teacher inspires. Thanks for brewing inspiration every day.',
    sourceTag: '極致醇香',
    actionTip: '閉上眼睛深深聞一聞咖啡的烘焙香氣，讓緊繃的肩頸與神經徹底放鬆下來。',
    pose: 'idea'
  },
  {
    id: 'card_cozy_espresso',
    title: '活力濃縮．Espresso 英雄',
    subtitle: 'Cozy House 咖啡暖心',
    category: '咖啡暖心',
    categoryColor: 'bg-stone-100 text-stone-800 border-stone-300',
    emoji: '⚡',
    blessing: '您是校園裡無可替代的「濃縮精華」！無論面對多龐雜的公文與課務，只要一走進教室，您總是展現滿滿的活力與專業。但今天，請允許自己安心斷電，好好補足元氣！',
    quoteEn: 'You\'re espresso-ly the best teacher ever! You deserve all the relaxation today.',
    sourceTag: '滿滿元氣',
    actionTip: '今晚把時間完全留給自己，不改作業、不讀家長訊息，好好放空休息。',
    pose: 'victory'
  },
  {
    id: 'card_cozy_warmth',
    title: '暖手暖胃．溫潤時光',
    subtitle: 'Cozy House 咖啡暖心',
    category: '咖啡暖心',
    categoryColor: 'bg-rose-100 text-rose-800 border-rose-300',
    emoji: '🥐',
    blessing: '就像冬日早晨端在手心的一杯熱咖啡，您的叮嚀與關懷總能驅散我們心中的徬徨與寒冷。願這份暖意長存於心，祝福最溫柔的老師節日平安、健康喜樂！',
    quoteEn: 'Your lessons always brew up warmth and joy. Wishing you a relaxing Teachers\' Day!',
    sourceTag: '溫心陪伴',
    actionTip: '配一塊小點心或餅乾，讓微甜的滋味撫慰喉嚨與胃。',
    pose: 'blush'
  },

  // ── 經典舒壓防禦系列 ──
  {
    id: 'card_1',
    title: '準時下班卡',
    subtitle: '身心自由守護令',
    category: '下班自由',
    categoryColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    emoji: '🏖️',
    blessing: '準時下班不是偷懶，而是為了明天能帶給孩子更有朝氣的自己。世界不會因為您準時打卡而停止運轉，請把今晚還給生活！',
    quoteEn: 'Leaving work on time is self-care, not slacking off. Recharge for tomorrow!',
    sourceTag: '職場平衡',
    actionTip: '下課鐘聲一響，關上螢幕、收拾包包，今晚屬於您的私人快樂時光！',
    pose: 'victory'
  },
  {
    id: 'card_3',
    title: '公文退散卡',
    subtitle: '形式主義瓦解符',
    category: '公文防禦',
    categoryColor: 'bg-rose-100 text-rose-800 border-rose-300',
    emoji: '🛡️',
    blessing: '格式、評鑑、報表都只是形式，您眼裡對孩子的真切關愛才是教育的真正核心。瑣事退散，初心永存！',
    quoteEn: 'Real teaching happens through human connection, not administrative forms.',
    sourceTag: '抗壓護甲',
    actionTip: '在心裡默念「公文是假的，健康是真的」，轉轉手腕放鬆肩膀。',
    pose: 'idea'
  },
  {
    id: 'card_4',
    title: '心靈滿電卡',
    subtitle: '能量回充神諭',
    category: '心靈充電',
    categoryColor: 'bg-sky-100 text-sky-800 border-sky-300',
    emoji: '🔋',
    blessing: '您今天的一句溫柔讚美，可能成為拯救一個孩子迷惘童年的北極星。您比自己想像的還要強大而珍貴！',
    quoteEn: 'A kind word can change someone\'s entire day, or even their life.',
    sourceTag: '肯定自省',
    actionTip: '喝一口溫水，給自己一個真心的肯定：「今天我也很棒！」',
    pose: 'blush'
  },
  {
    id: 'card_6',
    title: '巨傘庇護卡',
    subtitle: '情緒垃圾隔離罩',
    category: '自我肯定',
    categoryColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    emoji: '☔',
    blessing: '偶爾的刁難與誤解只是陣雨，您的專業與耐心是撐起整個教室藍天的堅韌巨傘。別人的焦慮不用由您來概括承受！',
    quoteEn: 'Don\'t let other people\'s emotional storm rain on your classroom sunshine.',
    sourceTag: '情緒邊界',
    actionTip: '把別人的負面情緒留在校門口，不要帶回家裡。',
    pose: 'teaching'
  },
  {
    id: 'card_7',
    title: '微光自照卡',
    subtitle: '溫柔待己籤詩',
    category: '自我肯定',
    categoryColor: 'bg-purple-100 text-purple-800 border-purple-300',
    emoji: '✨',
    blessing: '請允許自己偶爾不那麼完美。能健康快樂地站在講台上，就是對孩子最大的愛護與最好的人生示範。',
    quoteEn: 'You don\'t have to be perfect to be an incredible, inspiring educator.',
    sourceTag: '自我接納',
    actionTip: '今晚睡前對鏡子裡的自己微笑，輕輕說一句「辛苦了，謝謝你」。',
    pose: 'sleeping'
  }
];

export const INITIAL_STICKY_NOTES: StickyNote[] = [
  {
    id: 'note_0',
    author: '國小低年級導師',
    tag: '🍵 小農潤喉茶大救星',
    content: '連唱帶跳上了整整五節課，喉嚨乾到快冒煙！同事泡了小農薄荷甘草菊花茶給我，一口溫潤回甘，嗓子立刻得救！老師們下課一定要多喝水保護聲帶！',
    likes: 47,
    color: 'yellow',
    createdAt: '5分鐘前'
  },
  {
    id: 'note_1',
    author: '高三學測班導',
    tag: '☕ 濾掛咖啡打氣',
    content: '今天陪學生晚自習到九點，手沖一杯莊園深焙濾掛，堅果香氣瀰漫辦公室。看著孩子們認真拚搏的背影，心裡滿是欣慰！大家一起加油！💪',
    likes: 52,
    color: 'pink',
    createdAt: '15分鐘前'
  },
  {
    id: 'note_2',
    author: '國中歷史老師',
    tag: '💌 一朝沐杏雨',
    content: '桌上悄悄多了一張手寫卡片「謝謝老師陪我走過迷茫的國中三年」，筆尖滑過紙頁的溫柔，勝過所有行政考評。所有的疲累在這一刻都煙消雲散了。',
    likes: 68,
    color: 'cyan',
    createdAt: '35分鐘前'
  },
  {
    id: 'note_3',
    author: '資深組長有感',
    tag: '🏖️ 放下紅筆放假去',
    content: '不是在改聯絡簿，就是在去研習的路上——教師節這天請大膽放下紅筆！公文是形式，身心健康才是真的。各位夥伴，今天準時下班！',
    likes: 81,
    color: 'purple',
    createdAt: '1小時前'
  }
];
