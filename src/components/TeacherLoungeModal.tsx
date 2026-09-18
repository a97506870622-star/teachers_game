import React, { useState, useEffect } from 'react';
import {
  TEACHER_CARE_CARDS,
  TeacherCard,
  INITIAL_STICKY_NOTES,
  StickyNote
} from '../constants/cardsAndMessages';
import { speechEngine } from '../utils/speechEngine';
import { soundEngine } from '../utils/soundEngine';
import { FlipFish } from './FlipFish';
import {
  Coffee,
  Heart,
  Bell,
  Volume2,
  Sparkles,
  X,
  Shuffle,
  Smile,
  Send,
  MessageSquare,
  Sparkle,
  Bookmark,
  CheckCircle2,
  Plus,
  Wind
} from 'lucide-react';

interface TeacherLoungeModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'cards' | 'notes' | 'relax';
  onEarnIceItem?: () => void;
}

const STORAGE_KEY_NOTES = 'fliphk_teacher_notes';
const STORAGE_KEY_FAVORITES = 'fliphk_card_favs';

export const TeacherLoungeModal: React.FC<TeacherLoungeModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'cards',
  onEarnIceItem
}) => {
  const [activeTab, setActiveTab] = useState<'cards' | 'notes' | 'relax'>(defaultTab);
  const [showEarnedNotice, setShowEarnedNotice] = useState(false);

  // Card Draw State
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [savedCardIds, setSavedCardIds] = useState<string[]>([]);
  const [drawCount, setDrawCount] = useState<number>(1);

  // Message Wall State
  const [notes, setNotes] = useState<StickyNote[]>([]);
  const [newAuthor, setNewAuthor] = useState<string>('高三導師');
  const [customAuthor, setCustomAuthor] = useState<string>('');
  const [newTag, setNewTag] = useState<string>('☕ 互相打氣');
  const [newColor, setNewColor] = useState<'yellow' | 'pink' | 'cyan' | 'purple'>('yellow');
  const [newContent, setNewContent] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [likedNoteIds, setLikedNoteIds] = useState<string[]>([]);

  // Relax Audio Tool
  const [customWord, setCustomWord] = useState<string>('');

  // Load saved notes & favorites from localStorage
  useEffect(() => {
    try {
      const storedNotes = localStorage.getItem(STORAGE_KEY_NOTES);
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      } else {
        setNotes(INITIAL_STICKY_NOTES);
      }

      const storedFavs = localStorage.getItem(STORAGE_KEY_FAVORITES);
      if (storedFavs) {
        setSavedCardIds(JSON.parse(storedFavs));
      }
    } catch {
      setNotes(INITIAL_STICKY_NOTES);
    }
  }, []);

  if (!isOpen) return null;

  const currentCard = TEACHER_CARE_CARDS[currentCardIndex];
  const isCardSaved = savedCardIds.includes(currentCard.id);

  // Draw a new card with fun animation
  const handleDrawCard = () => {
    setIsFlipping(true);
    soundEngine.playCoin();

    setTimeout(() => {
      let nextIndex = Math.floor(Math.random() * TEACHER_CARE_CARDS.length);
      if (nextIndex === currentCardIndex && TEACHER_CARE_CARDS.length > 1) {
        nextIndex = (nextIndex + 1) % TEACHER_CARE_CARDS.length;
      }
      setCurrentCardIndex(nextIndex);
      setDrawCount(c => c + 1);
      setIsFlipping(false);

      const nextCard = TEACHER_CARE_CARDS[nextIndex];
      speechEngine.speak(`${nextCard.title}！${nextCard.blessing}`);
    }, 280);
  };

  const handleSpeakCard = () => {
    setIsSpeaking(true);
    speechEngine.speak(`${currentCard.title}。${currentCard.blessing}，小叮嚀：${currentCard.actionTip}`, {
      onEnd: () => setIsSpeaking(false)
    });
  };

  const handleToggleFavorite = () => {
    let updated: string[];
    if (isCardSaved) {
      updated = savedCardIds.filter(id => id !== currentCard.id);
    } else {
      updated = [...savedCardIds, currentCard.id];
      soundEngine.playVictory();
    }
    setSavedCardIds(updated);
    try {
      localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(updated));
    } catch {
      // ignore storage err
    }
  };

  // Submit a new sticky note to the message wall
  const handlePostNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    setIsSubmitting(true);
    const authorName = customAuthor.trim() || newAuthor;
    const newNote: StickyNote = {
      id: `note_${Date.now()}`,
      author: authorName,
      tag: newTag,
      content: newContent.trim(),
      likes: 1,
      color: newColor,
      createdAt: '剛剛'
    };

    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    try {
      localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(updatedNotes));
    } catch {
      // ignore
    }

    soundEngine.playCoin();
    // 🎁 獎勵：送出留言即可獲得【冰冰冰冰冰冰繃】+1 次！
    if (onEarnIceItem) {
      onEarnIceItem();
      setShowEarnedNotice(true);
      setTimeout(() => setShowEarnedNotice(false), 6000);
    }

    setNewContent('');
    setCustomAuthor('');
    setIsSubmitting(false);
  };

  const handleLikeNote = (noteId: string) => {
    if (likedNoteIds.includes(noteId)) return;

    soundEngine.playClick();
    const updatedNotes = notes.map(n => {
      if (n.id === noteId) {
        return { ...n, likes: n.likes + 1 };
      }
      return n;
    });
    setNotes(updatedNotes);
    const nextLiked = [...likedNoteIds, noteId];
    setLikedNoteIds(nextLiked);
    try {
      localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(updatedNotes));
    } catch {
      // ignore
    }
  };

  const handleSpeakNote = (content: string, author: string) => {
    speechEngine.speak(`${author}留言說：${content}`);
  };

  const handlePlaySchoolBell = () => {
    soundEngine.playSchoolBell();
  };

  const handleSpeakCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customWord.trim()) return;
    speechEngine.speak(customWord);
  };

  return (
    <div
      id="teacher-lounge-overlay"
      className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
    >
      <div
        id="teacher-lounge-modal"
        className="bg-white rounded-3xl max-w-2xl w-full border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header with Title & Badge */}
        <div className="bg-gradient-to-r from-amber-100 via-rose-50 to-orange-100 p-4 sm:p-5 border-b border-amber-200/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center border border-amber-200 shrink-0">
              <FlipFish pose="love" size={44} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-stone-800 flex items-center gap-1.5">
                  ☕ 教師心靈解憂茶水間
                </h3>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-black shadow-xs">
                  🎴 抽卡 ＆ ✍️ 留言板
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-0.5">
                深呼吸、喝口溫水，放下紅筆與公文，這裡只有對您的體諒與感謝。
              </p>
            </div>
          </div>

          <button
            id="close-lounge-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-white/80 cursor-pointer transition-colors"
            title="關閉茶水間"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="bg-stone-50 px-4 pt-2 border-b border-stone-200 flex items-center gap-2">
          <button
            id="tab-cards-btn"
            onClick={() => setActiveTab('cards')}
            className={`px-4 py-2.5 text-xs font-black rounded-t-xl border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'cards'
                ? 'bg-white border-amber-500 text-amber-900 shadow-xs -mb-px'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>💌 教師節暖心卡片</span>
            <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full">
              {TEACHER_CARE_CARDS.length}款
            </span>
          </button>

          <button
            id="tab-notes-btn"
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2.5 text-xs font-black rounded-t-xl border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'notes'
                ? 'bg-white border-rose-500 text-rose-900 shadow-xs -mb-px'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-rose-500" />
            <span>💬 暖心留言板</span>
            <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded-full">
              {notes.length}則
            </span>
          </button>

          <button
            id="tab-relax-btn"
            onClick={() => setActiveTab('relax')}
            className={`px-4 py-2.5 text-xs font-black rounded-t-xl border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'relax'
                ? 'bg-white border-sky-500 text-sky-900 shadow-xs -mb-px'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Wind className="w-4 h-4 text-sky-500" />
            <span>舒緩白噪音</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: DRAW CARDS */}
          {activeTab === 'cards' && (
            <div className="space-y-4">
              {/* The Draw Card Stage */}
              <div
                className={`transition-transform duration-250 ${
                  isFlipping ? 'scale-95 opacity-50 rotate-1' : 'scale-100 opacity-100'
                }`}
              >
                <div className="bg-gradient-to-br from-amber-50 via-white to-rose-50 border-2 border-amber-300/80 rounded-3xl p-5 shadow-lg relative overflow-hidden">
                  {/* Decorative corner glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-200/40 to-transparent rounded-bl-full pointer-events-none" />

                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-2 mb-3 relative z-10">
                    <div className="flex items-center gap-2.5">
                      <span className="text-3xl filter drop-shadow-xs">{currentCard.emoji}</span>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-base sm:text-lg font-black text-stone-900 leading-tight">
                            {currentCard.title}
                          </h4>
                          {currentCard.subtitle && (
                            <span className="text-[10px] text-stone-500 font-bold bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
                              {currentCard.subtitle}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${currentCard.categoryColor}`}
                          >
                            {currentCard.category}
                          </span>
                          {currentCard.sourceTag && (
                            <span className="text-[10px] text-amber-900 font-bold bg-amber-100/70 px-1.5 py-0.5 rounded">
                              ✨ {currentCard.sourceTag}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={handleToggleFavorite}
                        className={`p-2 rounded-xl border transition-all cursor-pointer ${
                          isCardSaved
                            ? 'bg-rose-50 border-rose-300 text-rose-600 shadow-xs'
                            : 'bg-white/80 border-stone-200 text-stone-400 hover:text-rose-500'
                        }`}
                        title={isCardSaved ? '已收藏此小卡' : '點擊收藏此小卡'}
                      >
                        <Heart className={`w-4 h-4 ${isCardSaved ? 'fill-rose-500' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Card Golden Quote */}
                  <div className="my-3.5 p-4 rounded-2xl bg-white/95 border border-amber-200/80 shadow-xs relative space-y-2.5">
                    <p className="text-sm sm:text-base font-bold text-stone-800 leading-relaxed text-center">
                      {currentCard.blessing}
                    </p>
                    {currentCard.quoteEn && (
                      <div className="pt-2 border-t border-amber-100 text-center">
                        <p className="text-xs text-amber-800/90 font-medium italic">
                          "{currentCard.quoteEn}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Tip & FlipFish Mascot */}
                  <div className="flex items-center gap-3 p-3 bg-amber-100/60 rounded-2xl border border-amber-200/80">
                    <div className="shrink-0">
                      <FlipFish pose={currentCard.pose} size={42} />
                    </div>
                    <div>
                      <span className="text-[11px] font-black text-amber-900 block">
                        💡 今日小叮嚀：
                      </span>
                      <p className="text-xs text-stone-700 font-semibold leading-tight">
                        {currentCard.actionTip}
                      </p>
                    </div>
                  </div>

                  {/* Draw & Audio Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-2.5 mt-4 pt-3 border-t border-amber-200/60">
                    <button
                      id="shuffle-card-btn"
                      onClick={handleDrawCard}
                      className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-black shadow-sm hover:shadow transition-all cursor-pointer"
                    >
                      <Shuffle className="w-4 h-4" />
                      <span>抽下一張暖心小卡 (已讀 {drawCount} 張)</span>
                    </button>

                    <button
                      id="speak-card-btn"
                      onClick={handleSpeakCard}
                      className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4 text-amber-400" />
                      <span>{isSpeaking ? '語音朗讀中...' : '朗讀小卡'}</span>
                    </button>
                  </div>

                  {/* Bonus Reward Shortcut */}
                  <div className="mt-3 pt-2.5 border-t border-amber-200/40 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-amber-900 font-bold">
                      💡 貼便利貼即可免費領取【🧊 冰冰冰冰冰冰繃】+1 次！
                    </span>
                    <button
                      onClick={() => {
                        setActiveTab('notes');
                        soundEngine.playClick();
                      }}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold cursor-pointer transition-all shadow-2xs shrink-0"
                    >
                      前往留言領技能 ↗
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Gallery Quick Selector */}
              <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
                <div className="text-[11px] font-bold text-stone-500 mb-2 flex items-center justify-between">
                  <span>快速挑選小卡：</span>
                  <span className="text-stone-400 text-[10px]">
                    已收藏 {savedCardIds.length} 張
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {TEACHER_CARE_CARDS.map((card, idx) => (
                    <button
                      key={card.id}
                      onClick={() => {
                        setCurrentCardIndex(idx);
                        soundEngine.playClick();
                      }}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                        idx === currentCardIndex
                          ? 'bg-amber-100 border-amber-400 font-bold shadow-xs'
                          : 'bg-white border-stone-200 hover:bg-stone-100 text-stone-700'
                      }`}
                    >
                      <span className="text-base shrink-0">{card.emoji}</span>
                      <span className="text-xs truncate">{card.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* FlipEdu Teacher Support Banner */}
              <div className="bg-gradient-to-r from-sky-50 via-indigo-50/60 to-blue-50 p-3 sm:p-3.5 rounded-2xl border border-sky-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-white border border-sky-200 flex items-center justify-center shrink-0 shadow-2xs text-xl">
                    🐟
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-sky-900">
                        翻轉教育 FlipEdu ✕ 現場教師後盾專欄
                      </span>
                      <span className="text-[9.5px] px-1.5 py-0.5 rounded-full bg-sky-200/80 text-sky-800 font-bold">
                        官方推薦
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">
                      遇到校事會議調查程序、親師溝通瓶頸或行政負擔？前往翻轉教育閱讀教師權益保障與增能心法！
                    </p>
                  </div>
                </div>
                <a
                  href="https://flipedu.parenting.com.tw"
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <span>前往翻轉教育</span>
                  <span className="text-[11px]">↗</span>
                </a>
              </div>
            </div>
          )}

          {/* TAB 2: MESSAGE BOARD */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              {/* Reward Announcement Banner */}
              <div className="bg-sky-50 border border-sky-300 p-2.5 rounded-2xl flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🧊</span>
                  <span className="text-sky-900 font-bold">
                    【暖心回饋】：每送出一張加油便利貼，立即補充<strong>【🧊 冰冰冰冰冰冰繃】+1 次</strong>（急凍魔王，助您從容佈防）！
                  </span>
                </div>
                <span className="text-[10px] bg-sky-200 text-sky-800 font-black px-2 py-0.5 rounded-full shrink-0">
                  戰略補給
                </span>
              </div>

              {/* Earned Success Alert */}
              {showEarnedNotice && (
                <div className="bg-emerald-50 border-2 border-emerald-400 p-3 rounded-2xl flex items-center gap-2 text-xs text-emerald-900 font-black shadow-md animate-bounce">
                  <span className="text-2xl">🎉</span>
                  <span>感謝老師的溫暖分享！已為您成功補充<strong>【🧊 冰冰冰冰冰冰繃】技能 +1 次</strong>！回戰場即可使用！</span>
                </div>
              )}

              {/* Post Note Form */}
              <form
                onSubmit={handlePostNote}
                className="bg-gradient-to-r from-rose-50 via-amber-50 to-orange-50 p-4 rounded-2xl border border-rose-200 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-stone-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                    寫一張便利貼，為自己或全體老師加油！
                  </h4>
                  <span className="text-[10px] text-stone-400 font-medium">即時張貼至留言板</span>
                </div>

                {/* Identity & Tag Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">
                      您的稱呼 / 身份：
                    </label>
                    <div className="flex gap-1.5">
                      <select
                        value={newAuthor}
                        onChange={e => setNewAuthor(e.target.value)}
                        className="text-xs font-bold bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 flex-1"
                      >
                        <option value="高三導師">高三導師</option>
                        <option value="國中自然老師">國中自然老師</option>
                        <option value="國小熱血班導">國小熱血班導</option>
                        <option value="熱血代理小菜鳥">熱血代理小菜鳥</option>
                        <option value="幼兒園園長">幼兒園園長</option>
                        <option value="特教巡迴老師">特教巡迴老師</option>
                        <option value="輔導室老友">輔導室老友</option>
                        <option value="custom">自訂稱呼...</option>
                      </select>
                      {newAuthor === 'custom' && (
                        <input
                          type="text"
                          value={customAuthor}
                          onChange={e => setCustomAuthor(e.target.value)}
                          placeholder="例如：不想改作業的英文老師"
                          className="text-xs bg-white border border-stone-300 rounded-xl px-2 py-1.5 flex-1"
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">
                      心情標籤：
                    </label>
                    <select
                      value={newTag}
                      onChange={e => setNewTag(e.target.value)}
                      className="text-xs font-bold bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 w-full"
                    >
                      <option value="☕ 互相打氣">☕ 互相打氣</option>
                      <option value="🏖️ 準時下班">🏖️ 準時下班</option>
                      <option value="🛡️ 公文快走">🛡️ 公文快走</option>
                      <option value="❤️ 教師節快樂">❤️ 教師節快樂</option>
                      <option value="🌸 給自己抱抱">🌸 給自己抱抱</option>
                    </select>
                  </div>
                </div>

                {/* Content Input Area */}
                <div>
                  <textarea
                    id="teacher-note-textarea"
                    value={newContent}
                    onChange={e => setNewContent(e.target.value)}
                    rows={2}
                    placeholder="寫下想給自己或老師們的一句話（例如：今天改完了兩百份考卷，大家下班記得喝大杯珍奶！）..."
                    className="w-full text-xs p-3 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-rose-400 focus:outline-none"
                  />
                </div>

                {/* Color & Submit Row */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  {/* Color picker */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-stone-500 font-bold">卡片顏色：</span>
                    {(['yellow', 'pink', 'cyan', 'purple'] as const).map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setNewColor(c)}
                        className={`w-5 h-5 rounded-full border-2 transition-all cursor-pointer ${
                          newColor === c ? 'scale-115 border-stone-800' : 'border-white'
                        } ${
                          c === 'yellow'
                            ? 'bg-amber-200'
                            : c === 'pink'
                            ? 'bg-rose-200'
                            : c === 'cyan'
                            ? 'bg-sky-200'
                            : 'bg-purple-200'
                        }`}
                        title={c}
                      />
                    ))}
                  </div>

                  <button
                    id="submit-teacher-note-btn"
                    type="submit"
                    disabled={!newContent.trim() || isSubmitting}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:bg-stone-300 text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>貼上便利貼 📌</span>
                  </button>
                </div>
              </form>

              {/* Notes Sticky Board Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {notes.map(note => {
                  const isLiked = likedNoteIds.includes(note.id);
                  const colorBg =
                    note.color === 'pink'
                      ? 'bg-rose-50 border-rose-300'
                      : note.color === 'cyan'
                      ? 'bg-sky-50 border-sky-300'
                      : note.color === 'purple'
                      ? 'bg-purple-50 border-purple-300'
                      : 'bg-amber-50 border-amber-300';

                  return (
                    <div
                      key={note.id}
                      className={`p-3.5 rounded-2xl border ${colorBg} shadow-xs flex flex-col justify-between relative group hover:shadow-md transition-shadow`}
                    >
                      {/* Pushpin decor */}
                      <span className="absolute -top-2.5 right-4 text-sm filter drop-shadow-xs select-none">
                        📌
                      </span>

                      <div>
                        {/* Note Header */}
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span className="text-xs font-black text-stone-800">
                            {note.author}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/80 border border-stone-200 text-stone-600 font-bold">
                            {note.tag}
                          </span>
                        </div>

                        {/* Note Content */}
                        <p className="text-xs text-stone-700 font-medium leading-relaxed my-1.5">
                          {note.content}
                        </p>
                      </div>

                      {/* Note Footer: Time & Action Buttons */}
                      <div className="flex items-center justify-between pt-2 border-t border-stone-200/50 mt-2 text-[10px] text-stone-400">
                        <span>{note.createdAt}</span>

                        <div className="flex items-center gap-1.5">
                          {/* TTS Read Note */}
                          <button
                            onClick={() => handleSpeakNote(note.content, note.author)}
                            className="p-1 rounded-lg hover:bg-white/80 text-stone-500 hover:text-stone-800 cursor-pointer"
                            title="朗讀此留言"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Like Button */}
                          <button
                            onClick={() => handleLikeNote(note.id)}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                              isLiked
                                ? 'bg-rose-100 border-rose-300 text-rose-600'
                                : 'bg-white/80 border-stone-200 text-stone-500 hover:text-rose-600'
                            }`}
                            title="為這則留言按讚加油"
                          >
                            <Heart className={`w-3 h-3 ${isLiked ? 'fill-rose-500' : ''}`} />
                            <span>{note.likes}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: RELAX TOOLS */}
          {activeTab === 'relax' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Relaxing white noise button */}
                <button
                  id="school-bell-trigger-btn"
                  onClick={handlePlaySchoolBell}
                  className="flex items-center gap-3 p-4 rounded-2xl border border-sky-200 bg-gradient-to-r from-sky-50 to-blue-50 hover:from-sky-100 hover:to-blue-100 text-left transition-all cursor-pointer group shadow-xs"
                >
                  <div className="w-11 h-11 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-700 group-hover:scale-105 transition-transform shrink-0">
                    <Wind className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-sky-950">播放「舒緩白噪音」</h4>
                    <p className="text-[11px] text-sky-700 mt-0.5">海潮微風自然白噪音，深呼吸放空三分鐘</p>
                  </div>
                </button>

                {/* Drink water reminder */}
                <div className="flex items-center gap-3 p-4 rounded-2xl border border-sky-200 bg-sky-50/70 text-left shadow-xs">
                  <div className="w-11 h-11 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-700 shrink-0">
                    <Smile className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-sky-900">溫水補給提醒</h4>
                    <p className="text-[11px] text-sky-700 mt-0.5">喉嚨辛苦了！拿起水杯大喝三口溫開水吧！</p>
                  </div>
                </div>
              </div>

              {/* Custom words to speak */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-500" />
                  想聽什麼話？讓語音小幫手親自對您說：
                </label>
                <form onSubmit={handleSpeakCustom} className="flex gap-2">
                  <input
                    id="custom-affirmation-input"
                    type="text"
                    value={customWord}
                    onChange={e => setCustomWord(e.target.value)}
                    placeholder="例如：陳老師，今天您做得太棒了，準時下班吃拉麵！"
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
                  >
                    朗讀
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Footer note */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 text-center text-xs text-stone-500 flex items-center justify-center gap-2">
          <span>❤️ 敬祝全體辛苦的老師們：身心安適，教師節快樂！</span>
        </div>
      </div>
    </div>
  );
};
