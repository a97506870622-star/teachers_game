import React, { useState, useRef, useEffect } from 'react';
import { MapData, GameDifficulty } from '../types';
import { GAME_MAPS } from '../constants/maps';
import { FlipFish } from './FlipFish';
import {
  Heart,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Coffee,
  BookOpen,
  SlidersHorizontal,
  Check,
  ChevronDown
} from 'lucide-react';

interface GameHeaderProps {
  teacherHp: number;
  maxTeacherHp: number;
  energy: number;
  progressPct: number;
  distanceRemaining: number;
  threatLevelName: string;
  gameSpeed: number;
  isPaused: boolean;
  isSoundMuted: boolean;
  isVoiceMuted: boolean;
  currentMap: MapData;
  difficulty: GameDifficulty;
  onChangeDifficulty: (diff: GameDifficulty) => void;
  onTogglePause: () => void;
  onSetGameSpeed: (speed: number) => void;
  onToggleSound: () => void;
  onToggleVoice: () => void;
  onChangeMap: (mapId: string) => void;
  onOpenLounge: () => void;
  onOpenHelp: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  teacherHp,
  maxTeacherHp,
  energy,
  progressPct,
  gameSpeed,
  isPaused,
  isSoundMuted,
  isVoiceMuted,
  currentMap,
  difficulty,
  onChangeDifficulty,
  onTogglePause,
  onSetGameSpeed,
  onToggleSound,
  onToggleVoice,
  onChangeMap,
  onOpenLounge,
  onOpenHelp
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const hpPct = Math.max(0, Math.min(100, (teacherHp / maxTeacherHp) * 100));
  const cleanProg = Math.max(0, Math.min(100, Math.round(progressPct)));

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const difficultyLabel =
    difficulty === 'casual' ? '休閒' : difficulty === 'hardcore' ? '評鑑地獄' : '常規教評';

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-stone-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Left: App Logo & Current Map Pill */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center shrink-0 shadow-2xs">
            <FlipFish pose="teaching" size={32} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm sm:text-base font-extrabold text-stone-800 tracking-tight">
                教師心靈保衛戰
              </h1>
              <a
                href="https://flipedu.parenting.com.tw"
                target="_blank"
                rel="noreferrer"
                className="hidden md:inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold border border-sky-200 transition-colors cursor-pointer"
                title="點擊前往「翻轉教育 FlipEdu」官方網站，掌握最新教育專題與教學資源！"
              >
                <span>🐟 翻轉教育 ✕ 陪伴老師</span>
              </a>
            </div>
            {/* Map & Difficulty Tag Button */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-1 text-[11px] text-stone-600 hover:text-stone-900 font-medium cursor-pointer transition-colors"
                title="切換關卡地圖或難度"
              >
                <span>📍 {currentMap.name}</span>
                <span className="text-stone-400">·</span>
                <span className={difficulty === 'hardcore' ? 'text-red-600 font-bold' : difficulty === 'casual' ? 'text-emerald-600 font-bold' : 'text-amber-700 font-bold'}>
                  {difficultyLabel}
                </span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {/* Dropdown Menu for Map & Difficulty */}
              {isMenuOpen && (
                <div className="absolute left-0 mt-1.5 w-72 bg-white rounded-2xl shadow-xl border border-stone-200 p-3 z-50 text-xs animate-in fade-in zoom-in-95">
                  <div className="space-y-3">
                    {/* Maps Selection */}
                    <div>
                      <div className="text-[11px] font-bold text-stone-400 mb-1.5 px-1">
                        🗺️ 選擇地圖關卡
                      </div>
                      <div className="space-y-1">
                        {GAME_MAPS.map(m => {
                          const isActive = m.id === currentMap.id;
                          return (
                            <button
                              key={m.id}
                              onClick={() => {
                                onChangeMap(m.id);
                                setIsMenuOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl font-bold text-left transition-colors cursor-pointer ${
                                isActive
                                  ? 'bg-amber-100 text-amber-950 font-black'
                                  : 'hover:bg-stone-50 text-stone-700'
                              }`}
                            >
                              <span className="truncate">{m.isSpecialEvent ? '🌟 ' : '📍 '}{m.name}</span>
                              {isActive && <Check className="w-3.5 h-3.5 text-amber-800 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Difficulty Selection */}
                    <div className="pt-2 border-t border-stone-100">
                      <div className="text-[11px] font-bold text-stone-400 mb-1.5 px-1">
                        🎯 遊戲難度調整
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        {(['casual', 'standard', 'hardcore'] as GameDifficulty[]).map(d => (
                          <button
                            key={d}
                            onClick={() => {
                              onChangeDifficulty(d);
                              setIsMenuOpen(false);
                            }}
                            className={`py-1 px-1.5 rounded-lg text-center font-bold text-[11px] transition-colors cursor-pointer border ${
                              difficulty === d
                                ? d === 'hardcore'
                                  ? 'bg-red-500 text-white border-red-600 shadow-xs'
                                  : d === 'casual'
                                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                                  : 'bg-amber-500 text-white border-amber-600 shadow-xs'
                                : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                            }`}
                          >
                            {d === 'casual' ? '休閒' : d === 'standard' ? '常規' : '特難'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center: Core Three Vitals (Clean & Highly Readable) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 1. Teacher Resilience / Life HP */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-rose-50 px-2.5 sm:px-3 py-1.5 rounded-xl border border-rose-200">
            <Heart
              className={`w-4 h-4 text-rose-500 ${teacherHp < 35 ? 'animate-pulse' : 'fill-rose-500'}`}
            />
            <div>
              <div className="flex items-center gap-1.5 justify-between">
                <span className="text-[10px] font-bold text-rose-700">心靈耐力</span>
                <span className="text-xs font-black text-rose-900">{teacherHp}/{maxTeacherHp}</span>
              </div>
              <div className="w-16 sm:w-20 h-1.5 bg-rose-200 rounded-full overflow-hidden mt-0.5">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    hpPct > 50 ? 'bg-rose-500' : hpPct > 25 ? 'bg-amber-500' : 'bg-red-600'
                  }`}
                  style={{ width: `${hpPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* 2. Energy / Passion Points */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-amber-50 px-2.5 sm:px-3 py-1.5 rounded-xl border border-amber-200">
            <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-white text-[11px] font-black shadow-2xs">
              ⚡
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-700 block leading-tight">教學熱忱</span>
              <span className="text-xs sm:text-sm font-black text-amber-950 leading-none">{energy} 點</span>
            </div>
          </div>

          {/* 3. Trek Progress */}
          <div className="hidden md:flex items-center gap-1.5 bg-emerald-50 px-2.5 sm:px-3 py-1.5 rounded-xl border border-emerald-200">
            <span className="text-xs">🧑‍🏫</span>
            <div>
              <div className="flex items-center gap-2 justify-between">
                <span className="text-[10px] font-bold text-emerald-800">抵達進度</span>
                <span className="text-xs font-black text-emerald-950">{cleanProg}%</span>
              </div>
              <div className="w-16 h-1.5 bg-emerald-200 rounded-full overflow-hidden mt-0.5">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                  style={{ width: `${cleanProg}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Consolidated Controls */}
        <div className="flex items-center gap-1.5">
          {/* Pause / Play */}
          <button
            id="pause-play-btn"
            onClick={onTogglePause}
            className={`p-1.5 sm:p-2 rounded-xl border transition-colors cursor-pointer ${
              isPaused
                ? 'bg-amber-100 border-amber-300 text-amber-800'
                : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
            }`}
            title={isPaused ? '繼續遊戲' : '暫停'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          {/* Speed Toggle (1x / 2x) */}
          <button
            id="speed-toggle-btn"
            onClick={() => onSetGameSpeed(gameSpeed === 1 ? 2 : 1)}
            className={`px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-black border transition-colors cursor-pointer ${
              gameSpeed === 2
                ? 'bg-indigo-100 border-indigo-300 text-indigo-800'
                : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
            }`}
            title="調整遊戲倍速"
          >
            {gameSpeed}x
          </button>

          {/* Sound Toggle */}
          <button
            id="toggle-sound-btn"
            onClick={onToggleSound}
            className="p-1.5 sm:p-2 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 cursor-pointer"
            title={isSoundMuted ? '開啟遊戲音效' : '靜音遊戲音效'}
          >
            {isSoundMuted ? <VolumeX className="w-3.5 h-3.5 text-stone-400" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Voice Toggle */}
          <button
            id="toggle-voice-btn"
            onClick={onToggleVoice}
            className="p-1.5 sm:p-2 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 cursor-pointer"
            title={isVoiceMuted ? '開啟暖心語音' : '關閉語音'}
          >
            {isVoiceMuted ? <MicOff className="w-3.5 h-3.5 text-stone-400" /> : <Mic className="w-3.5 h-3.5 text-rose-500" />}
          </button>

          {/* Teacher Lounge Button */}
          <button
            id="header-tea-room-btn"
            onClick={onOpenLounge}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-100 to-orange-100 hover:from-amber-200 hover:to-orange-200 text-stone-900 text-xs font-bold border border-amber-300 cursor-pointer transition-all shadow-2xs"
            title="前往教師心靈茶水間：抽小卡、互相留言打氣"
          >
            <Coffee className="w-3.5 h-3.5 text-amber-800 shrink-0" />
            <span className="hidden sm:inline">茶水間</span>
            <span className="sm:hidden">茶水</span>
          </button>

          {/* How to play help modal button */}
          <button
            id="help-btn"
            onClick={onOpenHelp}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-900 text-xs font-bold cursor-pointer transition-all shadow-2xs"
            title="查看完整玩法規則與5大核心教具圖鑑"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span>玩法指南</span>
          </button>
        </div>

      </div>
    </header>
  );
};
