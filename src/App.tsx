/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  MapData,
  TowerType,
  PlacedTower,
  ActiveEnemy,
  Projectile,
  Particle,
  DamagePopup,
  RewardItem,
  VoiceCareMessage,
  TargetStrategy,
  TeacherCharacter,
  GameDifficulty
} from './types';
import { GAME_MAPS, isCellOnPath, isCellNearPressureCore } from './constants/maps';
import { TOWER_CONFIGS, getTowerPurchaseCost, getCurriculumSynergy, AVAILABLE_TOWERS } from './constants/towers';
import { ENEMY_CONFIGS } from './constants/enemies';
import { getWavesForMap } from './constants/waves';
import { INITIAL_REWARD_ITEMS } from './constants/items';
import { VOICE_CARE_MESSAGES } from './constants/voiceCare';
import { getPositionAlongPath, getTotalPathLength } from './utils/pathUtils';
import { soundEngine } from './utils/soundEngine';
import { speechEngine } from './utils/speechEngine';

import { GameHeader } from './components/GameHeader';
import { GameBoard } from './components/GameBoard';
import { TowerSelector } from './components/TowerSelector';
import { TowerUpgradeModal } from './components/TowerUpgradeModal';
import { ItemToolbar } from './components/ItemToolbar';
import { VoiceCareBanner } from './components/VoiceCareBanner';
import { TeacherLoungeModal } from './components/TeacherLoungeModal';
import { GameOverModal } from './components/GameOverModal';
import { HelpModal, HelpTabType } from './components/HelpModal';
import { CellQuickBuildModal } from './components/CellQuickBuildModal';
import { ItemDetailModal } from './components/ItemDetailModal';
import { BossFightBar } from './components/BossFightBar';
import { FlipFishCompanion } from './components/FlipFishCompanion';
import { BottomControlDock } from './components/BottomControlDock';

export default function App() {
  // Game Setup & Level States
  const [currentMapIndex, setCurrentMapIndex] = useState<number>(0);
  const currentMap = GAME_MAPS[currentMapIndex];
  const [difficulty, setDifficulty] = useState<GameDifficulty>('standard');

  // Total path length in pixels
  const totalPathLength = React.useMemo(() => {
    return getTotalPathLength(currentMap.path, currentMap.cellSize);
  }, [currentMap]);

  // The Teacher Character (🧑‍🏫) who journeys from Start Point to Pressure Core
  const [teacher, setTeacher] = useState<TeacherCharacter>(() => {
    const initPos = getPositionAlongPath(currentMap.path, currentMap.cellSize, 0);
    return {
      x: initPos.x,
      y: initPos.y,
      currentHp: 100,
      maxHp: 100,
      distanceTraveled: 0,
      totalPathLength: 1000,
      speed: 16,
      isHurt: false,
      hurtTimer: 0,
      stepAnim: 0,
      shield: 0,
      saying: '孩子們等著我，勇敢出發！🎒',
      sayingTimer: 4.5
    };
  });

  const [energy, setEnergy] = useState<number>(350);

  // Trek Progress & Threat Region
  const progressPct = Math.min(100, (teacher.distanceTraveled / (totalPathLength || 1)) * 100);
  const distanceRemaining = Math.max(0, Math.round(totalPathLength - teacher.distanceTraveled));

  const threatLevelName = React.useMemo(() => {
    if (progressPct < 25) return '第一區：晨光公文浪潮 📋';
    if (progressPct < 50) return '第二區：家長奪命連環Call 📞';
    if (progressPct < 75) return '第三區：黑洞與行政風暴 🌪️';
    if (progressPct < 90) return '第四區：倦怠魔與偏見迷宮 👹';
    return '決戰：直搗壓力深淵核心！🌋';
  }, [progressPct]);

  // Speed & Control
  const [gameSpeed, setGameSpeed] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(false);

  // Entities
  const [placedTowers, setPlacedTowers] = useState<PlacedTower[]>([]);
  const [enemies, setEnemies] = useState<ActiveEnemy[]>([]);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [damagePopups, setDamagePopups] = useState<DamagePopup[]>([]);
  const [items, setItems] = useState<RewardItem[]>(INITIAL_REWARD_ITEMS);

  // Selection & UI
  const [selectedBuildTowerType, setSelectedBuildTowerType] = useState<TowerType | null>('red_pen');
  const [selectedTowerId, setSelectedTowerId] = useState<string | null>(null);
  const [selectedCell, setSelectedCell] = useState<{ gridX: number; gridY: number } | null>(null);
  const [inspectedItem, setInspectedItem] = useState<RewardItem | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number } | null>(null);

  // Special Global Effects
  const [isAllFrozen, setIsAllFrozen] = useState<boolean>(false);
  const freezeEndTimeRef = useRef<number>(0);
  const speedBoostEndTimeRef = useRef<number>(0);

  // Modals & Banners
  const [voiceMessage, setVoiceMessage] = useState<VoiceCareMessage | null>(null);
  const [isLoungeOpen, setIsLoungeOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false); // 預設不彈出，保留由玩家按鈕開啟
  const [helpModalTab, setHelpModalTab] = useState<HelpTabType>('tutorial');
  const [isGameOverOpen, setIsGameOverOpen] = useState<boolean>(false);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [showQuickGuide, setShowQuickGuide] = useState<boolean>(true);

  // Auto-dismiss initial quick guide after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowQuickGuide(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Performance / Game Loop Refs
  const lastFrameTimeRef = useRef<number>(performance.now());
  const pressureSpawnTimerRef = useRef<number>(800);
  const bossSpawnedRef = useRef<boolean>(false);
  const bossStage2SpawnedRef = useRef<boolean>(false);
  const bossSkillTimerRef = useRef<number>(6000);
  const milestone25Ref = useRef<boolean>(false);
  const milestone50Ref = useRef<boolean>(false);
  const milestone75Ref = useRef<boolean>(false);
  const milestone90Ref = useRef<boolean>(false);
  const totalDamageDealtRef = useRef<number>(0);
  const enemiesDefeatedRef = useRef<number>(0);

  // Set initial map buildable grid
  const selectedTower = placedTowers.find(t => t.id === selectedTowerId) || null;

  // Initialize and switch maps
  const switchMap = useCallback((mapId: string) => {
    const idx = GAME_MAPS.findIndex(m => m.id === mapId);
    if (idx !== -1) {
      setCurrentMapIndex(idx);
      const newMap = GAME_MAPS[idx];
      const newTotalLength = getTotalPathLength(newMap.path, newMap.cellSize);
      const initPos = getPositionAlongPath(newMap.path, newMap.cellSize, 0);

      // Reset teacher to start
      setTeacher({
        x: initPos.x,
        y: initPos.y,
        currentHp: 100,
        maxHp: 100,
        distanceTraveled: 0,
        totalPathLength: newTotalLength,
        speed: 16,
        isHurt: false,
        hurtTimer: 0,
        stepAnim: 0,
        shield: 0,
        saying: '新關卡啟程！孩子們等著我！🎒',
        sayingTimer: 4.5
      });

      setEnergy(350);
      setPlacedTowers([]);
      setEnemies([]);
      setProjectiles([]);
      setParticles([]);
      setDamagePopups([]);
      setSelectedTowerId(null);
      setSelectedCell(null);
      setInspectedItem(null);
      setIsGameOverOpen(false);
      setIsVictory(false);
      pressureSpawnTimerRef.current = 800;
      bossSpawnedRef.current = false;
      bossStage2SpawnedRef.current = false;
      bossSkillTimerRef.current = 6000;
      milestone25Ref.current = false;
      milestone50Ref.current = false;
      milestone75Ref.current = false;
      milestone90Ref.current = false;
      totalDamageDealtRef.current = 0;
      enemiesDefeatedRef.current = 0;
    }
  }, []);

  const lastVoiceCareTimeRef = useRef<number>(0);

  // Show a voice care message with cooldown to prevent frequent popups
  const triggerVoiceCare = useCallback((msg: VoiceCareMessage) => {
    const now = Date.now();
    // Enforce at least 30s cooldown between voice care prompts (unless it's game over or victory)
    if (msg.category !== 'victory' && msg.category !== 'defeat') {
      if (now - lastVoiceCareTimeRef.current < 30000) {
        return;
      }
    }
    lastVoiceCareTimeRef.current = now;
    setVoiceMessage(msg);
  }, []);

  // Use Special Items
  const handleUseItem = useCallback((itemId: string) => {
    setItems(prev =>
      prev.map(it => {
        if (it.id !== itemId || it.count <= 0) return it;

        const now = Date.now();
        // Item specific logic
        if (it.effect === 'legal_strike') {
          // 法律鐵拳：正當程序嚴正出擊，直接大消除全場所有大魔王！
          soundEngine.playLegalHammer();

          setTeacher(t => ({
            ...t,
            saying: '🥊 法律鐵拳出擊！依法嚴正駁回濫訴，全場大魔王直接全數轟散消除！💥',
            sayingTimer: 5.0
          }));

          // 核心機制：直接大消除全場所有魔王！普通怪物亦承受巨額 3200 點法規震撼重創並定身 5 秒
          let eliminatedBossCount = 0;
          setEnemies(current =>
            current.map(e => {
              if (e.isBoss) {
                eliminatedBossCount++;
                totalDamageDealtRef.current += e.currentHp;
                enemiesDefeatedRef.current += 1;
                return {
                  ...e,
                  currentHp: 0 // 直接大消除！
                };
              }
              const damage = 3200;
              const newHp = Math.max(0, e.currentHp - damage);
              if (newHp <= 0) {
                enemiesDefeatedRef.current += 1;
              }
              totalDamageDealtRef.current += Math.min(e.currentHp, damage);
              return {
                ...e,
                currentHp: newHp,
                frozenUntil: now + 5000
              };
            }).filter(e => {
              if (e.currentHp <= 0) {
                setEnergy(en => en + e.energyReward);
                return false;
              }
              return true;
            })
          );

          // 彈出全場震撼飄字（7秒自動淡出）
          setDamagePopups(p => [
            ...p,
            {
              id: `legal_hammer_popup_${Date.now()}`,
              x: (currentMap.gridCols * currentMap.cellSize) / 2,
              y: (currentMap.gridRows * currentMap.cellSize) / 3,
              text: '🥊【法律鐵拳重擊】依法駁回濫訴！全場大魔王直接轟散消滅！💥',
              color: '#fbbf24',
              alpha: 1,
              life: 7.0
            }
          ]);

          // 金色法律公正光芒粒子
          const legalParticles: Particle[] = Array.from({ length: 30 }).map((_, i) => ({
            id: `legal_${Date.now()}_${i}`,
            x: Math.random() * (currentMap.gridCols * currentMap.cellSize),
            y: Math.random() * (currentMap.gridRows * currentMap.cellSize),
            vx: (Math.random() - 0.5) * 80,
            vy: (Math.random() - 0.5) * 80,
            color: '#fbbf24',
            alpha: 1,
            size: 18,
            shape: 'circle',
            maxLife: 2.8,
            currentLife: 0
          }));
          setParticles(p => [...p, ...legalParticles]);
        } else if (it.effect === 'freeze_all' || it.effect === 'speed_boost') {
          // 🧊 冰冰冰冰冰冰繃：全場急凍魔王 7 秒，並現撥 100 熱忱趕快設置教具！
          soundEngine.playIceFreeze();
          setIsAllFrozen(true);
          freezeEndTimeRef.current = now + 7000;
          setEnergy(e => e + 100);
          setEnemies(current =>
            current.map(e => ({
              ...e,
              frozenUntil: now + 7000
            }))
          );
          setTeacher(t => ({
            ...t,
            saying: '🧊 冰冰冰冰冰冰繃！全場魔王急凍 7 秒，趕快配置教具！',
            sayingTimer: 5.0
          }));
          // Spawn cool ice frost particles
          const steamParticles: Particle[] = Array.from({ length: 28 }).map((_, i) => ({
            id: `ice_${Date.now()}_${i}`,
            x: Math.random() * (currentMap.gridCols * currentMap.cellSize),
            y: Math.random() * (currentMap.gridRows * currentMap.cellSize),
            vx: (Math.random() - 0.5) * 50,
            vy: (Math.random() - 0.5) * 50,
            color: '#38bdf8',
            alpha: 0.85,
            size: 8,
            shape: 'circle',
            maxLife: 2.5,
            currentLife: 0
          }));
          setParticles(p => [...p, ...steamParticles]);
        }

        return {
          ...it,
          count: it.count - 1,
          lastUsedTimestamp: now
        };
      })
    );
  }, [currentMap, triggerVoiceCare]);

  // 抽小卡或貼便利貼留言獲得「冰冰冰冰冰冰繃」次數 +1！
  const handleEarnIceItem = useCallback(() => {
    setItems(prev =>
      prev.map(it => {
        if (it.id === 'energy_coffee') {
          const nextCount = Math.min(it.maxCount, it.count + 1);
          return { ...it, count: nextCount };
        }
        return it;
      })
    );
    soundEngine.playVictory();
    // 醒目彈出提示
    setDamagePopups(pop => [
      ...pop,
      {
        id: `earn_ice_${Date.now()}`,
        x: (currentMap.gridCols * currentMap.cellSize) / 2,
        y: 80,
        text: '🎉 獲得暖心補給：【🧊 冰冰冰冰冰冰繃】+1 次！（魔王急凍 7 秒）',
        color: '#38bdf8',
        alpha: 1,
        life: 5.0
      }
    ]);
  }, [currentMap]);

  // Tower Placement
  const handleCellClick = useCallback(
    (gridX: number, gridY: number) => {
      // 1. If clicking a cell that already has a placed tower: inspect that tower!
      const towerOnCell = placedTowers.find(t => t.gridX === gridX && t.gridY === gridY);
      if (towerOnCell) {
        setSelectedTowerId(towerOnCell.id);
        setSelectedBuildTowerType(null);
        setSelectedCell(null);
        soundEngine.playClick();
        return;
      }

      // 2. If clicking with a tower selected for building from the dock
      if (selectedBuildTowerType) {
        const isPath = isCellOnPath(currentMap.path, gridX, gridY);
        const isCoreBlocked = isCellNearPressureCore(currentMap.endPoint, gridX, gridY);
        const isDecoration = currentMap.decorations.some(d => d.x === gridX && d.y === gridY);
        const config = TOWER_CONFIGS[selectedBuildTowerType];

        if (isDecoration) {
          soundEngine.playError();
          setDamagePopups(pop => [
            ...pop,
            {
              id: `dec_block_${Date.now()}`,
              x: gridX * currentMap.cellSize + currentMap.cellSize / 2,
              y: gridY * currentMap.cellSize + currentMap.cellSize / 2 - 10,
              text: '⚠️ 此處為設施裝飾！無法在此建塔',
              color: '#ef4444',
              opacity: 1,
              vy: -25,
              lifetime: 1.2
            }
          ]);
          return;
        }

        if (isCoreBlocked) {
          // Trigger alert feedback: cannot block the pressure source
          soundEngine.playError();
          setDamagePopups(pop => [
            ...pop,
            {
              id: `core_block_${Date.now()}`,
              x: gridX * currentMap.cellSize + currentMap.cellSize / 2,
              y: gridY * currentMap.cellSize + currentMap.cellSize / 2 - 10,
              text: '⚠️ 壓力核心強壓斥力！無法在此建塔',
              color: '#ef4444',
              opacity: 1,
              vy: -25,
              lifetime: 1.2
            }
          ]);
          return;
        }

        const countOnField = placedTowers.filter(t => t.type === selectedBuildTowerType).length;
        const currentCost = config ? getTowerPurchaseCost(config.baseCost, countOnField) : 0;

        if (energy < currentCost) {
          soundEngine.playError();
          setDamagePopups(pop => [
            ...pop,
            {
              id: `afford_fail_${Date.now()}`,
              x: gridX * currentMap.cellSize + currentMap.cellSize / 2,
              y: gridY * currentMap.cellSize + currentMap.cellSize / 2 - 10,
              text: `⚡ 熱忱不足！此教具已建 ${countOnField} 座，重複採購需 ⚡${currentCost}（+${countOnField * 35}%）`,
              color: '#ef4444',
              opacity: 1,
              vy: -25,
              lifetime: 1.4
            }
          ]);
          return;
        }

        if (!isPath && config && energy >= currentCost) {
          // Pay dynamic energy cost
          setEnergy(e => e - currentCost);
          soundEngine.playPlaceTower();

          const newTower: PlacedTower = {
            id: `tower_${Date.now()}_${Math.random()}`,
            type: selectedBuildTowerType,
            gridX,
            gridY,
            x: gridX * currentMap.cellSize + currentMap.cellSize / 2,
            y: gridY * currentMap.cellSize + currentMap.cellSize / 2,
            level: 1,
            range: config.range,
            damage: config.damage,
            attackSpeed: config.attackSpeed,
            lastAttackTime: 0,
            totalDamageDealt: 0,
            kills: 0,
            targetStrategy: 'first',
            rotation: 0,
            targetId: null
          };

          setPlacedTowers(prev => [...prev, newTower]);

          // Confetti / chalk dust particles
          const placeParticles: Particle[] = Array.from({ length: 6 }).map((_, i) => ({
            id: `place_p_${Date.now()}_${i}`,
            x: newTower.x,
            y: newTower.y,
            vx: (Math.random() - 0.5) * 40,
            vy: (Math.random() - 0.5) * 40,
            color: '#fbbf24',
            alpha: 1,
            size: 3,
            shape: 'circle',
            maxLife: 0.6,
            currentLife: 0
          }));
          setParticles(p => [...p, ...placeParticles]);
          setSelectedCell(null);
          return;
        }
      }

      // 3. If clicked on an empty or special cell without an active build tool:
      // Open CellQuickBuildModal to let user inspect cell and fast-build!
      setSelectedTowerId(null);
      setSelectedCell({ gridX, gridY });
      soundEngine.playClick();
    },
    [selectedBuildTowerType, currentMap, placedTowers, energy]
  );

  // Quick build directly from cell modal
  const handleQuickBuildTower = useCallback(
    (towerType: TowerType, gridX: number, gridY: number) => {
      const isPath = isCellOnPath(currentMap.path, gridX, gridY);
      const isCoreBlocked = isCellNearPressureCore(currentMap.endPoint, gridX, gridY);
      const isOccupied = placedTowers.some(t => t.gridX === gridX && t.gridY === gridY);
      const isDecoration = currentMap.decorations.some(d => d.x === gridX && d.y === gridY);
      if (isPath || isCoreBlocked || isOccupied || isDecoration) {
        soundEngine.playError();
        return;
      }

      const config = TOWER_CONFIGS[towerType];
      if (!config) return;
      const countOnField = placedTowers.filter(t => t.type === towerType).length;
      const currentCost = getTowerPurchaseCost(config.baseCost, countOnField);

      if (energy < currentCost) {
        soundEngine.playError();
        return;
      }

      setEnergy(e => e - currentCost);
      soundEngine.playPlaceTower();

      const newTower: PlacedTower = {
        id: `tower_${Date.now()}_${Math.random()}`,
        type: towerType,
        gridX,
        gridY,
        x: gridX * currentMap.cellSize + currentMap.cellSize / 2,
        y: gridY * currentMap.cellSize + currentMap.cellSize / 2,
        level: 1,
        range: config.range,
        damage: config.damage,
        attackSpeed: config.attackSpeed,
        lastAttackTime: 0,
        totalDamageDealt: 0,
        kills: 0,
        targetStrategy: 'first',
        rotation: 0,
        targetId: null
      };

      setPlacedTowers(prev => [...prev, newTower]);

      const placeParticles: Particle[] = Array.from({ length: 8 }).map((_, i) => ({
        id: `quick_place_${Date.now()}_${i}`,
        x: newTower.x,
        y: newTower.y,
        vx: (Math.random() - 0.5) * 45,
        vy: (Math.random() - 0.5) * 45,
        color: '#fbbf24',
        alpha: 1,
        size: 3.5,
        shape: 'circle',
        maxLife: 0.6,
        currentLife: 0
      }));
      setParticles(p => [...p, ...placeParticles]);
      setSelectedCell(null);
    },
    [currentMap, energy, placedTowers]
  );

  // Tower Upgrades & Sells
  const handleUpgradeTower = useCallback(
    (towerId: string) => {
      const tower = placedTowers.find(t => t.id === towerId);
      if (!tower) return;
      const config = TOWER_CONFIGS[tower.type];
      const nextLevelData = config.levels[tower.level];
      if (!nextLevelData || energy < nextLevelData.cost) return;

      setEnergy(e => e - nextLevelData.cost);
      soundEngine.playCoin();

      setPlacedTowers(prev =>
        prev.map(t => {
          if (t.id !== towerId) return t;
          return {
            ...t,
            level: t.level + 1,
            damage: nextLevelData.damage,
            range: nextLevelData.range,
            attackSpeed: nextLevelData.attackSpeed
          };
        })
      );

      // Upgrade sparkle particles
      const sparkles: Particle[] = Array.from({ length: 12 }).map((_, i) => ({
        id: `upgrade_${Date.now()}_${i}`,
        x: tower.x,
        y: tower.y,
        vx: (Math.random() - 0.5) * 50,
        vy: (Math.random() - 0.5) * 50,
        color: '#fbbf24',
        alpha: 1,
        size: 14,
        shape: 'star',
        maxLife: 1.2,
        currentLife: 0
      }));
      setParticles(p => [...p, ...sparkles]);
    },
    [placedTowers, energy]
  );

  const handleSellTower = useCallback(
    (towerId: string) => {
      const tower = placedTowers.find(t => t.id === towerId);
      if (!tower) return;
      const config = TOWER_CONFIGS[tower.type];
      const refund = Math.floor(
        (config.baseCost + (tower.level > 1 ? config.levels[0].cost * (tower.level - 1) : 0)) * 0.7
      );

      setEnergy(e => e + refund);
      soundEngine.playCoin();
      setPlacedTowers(prev => prev.filter(t => t.id !== towerId));
      setSelectedTowerId(null);
    },
    [placedTowers]
  );

  const handleChangeStrategy = useCallback((towerId: string, strategy: TargetStrategy) => {
    setPlacedTowers(prev =>
      prev.map(t => (t.id === towerId ? { ...t, targetStrategy: strategy } : t))
    );
  }, []);

  // Keyboard Shortcuts (1-6 for towers, Space for pause, ESC to clear selection)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setIsPaused(p => !p);
      } else if (e.key === 'Escape') {
        setSelectedBuildTowerType(null);
        setSelectedTowerId(null);
      } else if (['1', '2', '3', '4', '5'].includes(e.key)) {
        const chosen = AVAILABLE_TOWERS[parseInt(e.key) - 1] as TowerType;
        if (chosen) setSelectedBuildTowerType(chosen);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Main Game Loop
  useEffect(() => {
    let animationFrameId: number;

    const gameLoop = (currentTime: number) => {
      const deltaMs = currentTime - lastFrameTimeRef.current;
      lastFrameTimeRef.current = currentTime;

      if (!isPaused && deltaMs > 0 && deltaMs < 500) {
        const dt = (deltaMs / 1000) * gameSpeed;
        const now = Date.now();

        // 1. Check Freeze Timer
        if (isAllFrozen && now >= freezeEndTimeRef.current) {
          setIsAllFrozen(false);
        }

        const isSpeedBoosted = now < speedBoostEndTimeRef.current;
        const currentTeacherDist = teacher.distanceTraveled;
        const currentProgress = Math.min(100, (currentTeacherDist / (totalPathLength || 1)) * 100);

        // 2. Automatic Continuous Pressure Spawner (源源不絕的壓力源出怪)
        if (!isGameOverOpen && !isVictory) {
          pressureSpawnTimerRef.current -= deltaMs * gameSpeed;

          if (pressureSpawnTimerRef.current <= 0) {
            // Frequency scales smoothly with trek progress (between 1.8s ~ 3.2s)
            const nextInterval = Math.max(1600, 3200 - (currentProgress / 100) * 1400);
            pressureSpawnTimerRef.current = nextInterval;

            // Pick enemy type based on current threat zone
            let enemyType = 'homework';
            const roll = Math.random();
            if (currentProgress < 22) {
              enemyType = roll < 0.65 ? 'homework' : 'sleepy_bug';
            } else if (currentProgress < 45) {
              if (roll < 0.4) enemyType = 'parent_call';
              else if (roll < 0.7) enemyType = 'glitch_projector';
              else enemyType = 'homework';
            } else if (currentProgress < 70) {
              if (roll < 0.35) enemyType = 'bureaucracy';
              else if (roll < 0.7) enemyType = 'ignorance';
              else enemyType = 'parent_call';
            } else {
              if (roll < 0.35) enemyType = 'burnout';
              else if (roll < 0.68) enemyType = 'prejudice';
              else enemyType = 'anxiety';
            }

            const enemyConfig = ENEMY_CONFIGS[enemyType] || ENEMY_CONFIGS.homework;
            // Spawn directly at the Pressure Source Core (totalPathLength)
            const spawnPos = getPositionAlongPath(currentMap.path, currentMap.cellSize, totalPathLength);

            const newEnemy: ActiveEnemy = {
              id: `enemy_${Date.now()}_${Math.random()}`,
              type: enemyConfig.type,
              x: spawnPos.x,
              y: spawnPos.y,
              maxHp: enemyConfig.baseHp * (1 + (currentProgress / 100) * 0.75),
              currentHp: enemyConfig.baseHp * (1 + (currentProgress / 100) * 0.75),
              speed: enemyConfig.speed * 0.9,
              baseSpeed: enemyConfig.speed * 0.9,
              pathIndex: currentMap.path.length - 1,
              distanceTraveled: 0,
              distanceAlongPath: totalPathLength,
              energyReward: enemyConfig.energyReward,
              damageToTeacher: enemyConfig.damageToTeacher,
              size: enemyConfig.size,
              color: enemyConfig.color,
              frozenUntil: isAllFrozen ? freezeEndTimeRef.current : 0,
              slowedUntil: 0,
              slowFactor: 1,
              isBoss: !!enemyConfig.isBoss,
              spawnTime: now
            };

            setEnemies(prev => [...prev, newEnemy]);
          }

          // Boss Event Tier 1 at 52% Progress: 輔導紀錄與個案填報深淵魔王
          if (currentProgress >= 52 && !bossSpawnedRef.current) {
            bossSpawnedRef.current = true;
            const bossConfig = ENEMY_CONFIGS.counseling_records_boss || ENEMY_CONFIGS.evaluation_boss;
            const spawnPos = getPositionAlongPath(currentMap.path, currentMap.cellSize, totalPathLength);
            const difficultyMultiplier = difficulty === 'hardcore' ? 1.6 : difficulty === 'casual' ? 0.65 : 1.15;
            const bossMaxHp = Math.round(bossConfig.baseHp * difficultyMultiplier);
            const bossSpeed = bossConfig.speed * (difficulty === 'hardcore' ? 1.1 : 0.85);

            const bossEnemy: ActiveEnemy = {
              id: `boss_counseling_${Date.now()}`,
              type: 'counseling_records_boss',
              x: spawnPos.x,
              y: spawnPos.y,
              maxHp: bossMaxHp,
              currentHp: bossMaxHp,
              speed: bossSpeed,
              baseSpeed: bossSpeed,
              pathIndex: currentMap.path.length - 1,
              distanceTraveled: 0,
              distanceAlongPath: totalPathLength,
              energyReward: bossConfig.energyReward * 1.5,
              damageToTeacher: bossConfig.damageToTeacher,
              size: bossConfig.size,
              color: bossConfig.color,
              frozenUntil: 0,
              slowedUntil: 0,
              slowFactor: 1,
              isBoss: true,
              bossPhase: 1,
              enraged: false,
              spawnTime: now
            };
            setEnemies(prev => [...prev, bossEnemy]);
            const bossQuote = VOICE_CARE_MESSAGES.find(m => m.id === 'boss_incoming');
            if (bossQuote) triggerVoiceCare(bossQuote);
          }

          // Boss Event Tier 2 at 78% Progress: 濫訴成災・校事會議調查大魔王！
          if (currentProgress >= 78 && !bossStage2SpawnedRef.current) {
            bossStage2SpawnedRef.current = true;
            const bossConfig = ENEMY_CONFIGS.school_affairs_meeting_boss || ENEMY_CONFIGS.evaluation_boss;
            const spawnPos = getPositionAlongPath(currentMap.path, currentMap.cellSize, totalPathLength);
            const difficultyMultiplier = difficulty === 'hardcore' ? 1.7 : difficulty === 'casual' ? 0.7 : 1.25;
            const bossMaxHp = Math.round(bossConfig.baseHp * difficultyMultiplier);
            const bossSpeed = bossConfig.speed * (difficulty === 'hardcore' ? 1.15 : 0.88);

            const bossEnemy: ActiveEnemy = {
              id: `boss_school_affairs_${Date.now()}`,
              type: 'school_affairs_meeting_boss',
              x: spawnPos.x,
              y: spawnPos.y,
              maxHp: bossMaxHp,
              currentHp: bossMaxHp,
              speed: bossSpeed,
              baseSpeed: bossSpeed,
              pathIndex: currentMap.path.length - 1,
              distanceTraveled: 0,
              distanceAlongPath: totalPathLength,
              energyReward: bossConfig.energyReward * 2,
              damageToTeacher: bossConfig.damageToTeacher,
              size: bossConfig.size,
              color: bossConfig.color,
              frozenUntil: 0,
              slowedUntil: 0,
              slowFactor: 1,
              isBoss: true,
              bossPhase: 1,
              enraged: false,
              spawnTime: now
            };
            setEnemies(prev => [...prev, bossEnemy]);

            // 老師正面回擊台詞
            setTeacher(t => ({
              ...t,
              saying: '🥊 又是濫訴校事會議？法律鐵拳依法出擊，絕不退縮！',
              sayingTimer: 7
            }));

            // 飄出警示字樣（7秒自動淡出消失，無須手動刪除）
            setDamagePopups(pop => [
              ...pop,
              {
                id: `boss_warn_${Date.now()}`,
                x: spawnPos.x,
                y: spawnPos.y - 30,
                text: '🚨【大魔王降臨】快出【法律鐵拳 🥊】依法直接大消除魔王！',
                color: '#f87171',
                alpha: 1,
                life: 7.0
              }
            ]);

            soundEngine.playBossIncoming();
          }
        }

        // 3. Move Teacher forward along the path towards Pressure Core!
        if (!isGameOverOpen && !isVictory) {
          const effectiveTeacherSpeed = isSpeedBoosted ? 34 : 16;
          const teacherStep = effectiveTeacherSpeed * dt;

          setTeacher(t => {
            if (t.currentHp <= 0) return t;

            const nextDist = t.distanceTraveled + teacherStep;
            const nextPos = getPositionAlongPath(currentMap.path, currentMap.cellSize, nextDist);

            // Check if Teacher reaches the Pressure Source Core!
            if (nextDist >= totalPathLength) {
              setIsGameOverOpen(true);
              setIsVictory(true);
              soundEngine.playVictory();
              confetti({
                particleCount: 130,
                spread: 80,
                origin: { y: 0.6 }
              });
              const victoryQuote =
                VOICE_CARE_MESSAGES.find(m => m.id === 'all_waves_victory') ||
                VOICE_CARE_MESSAGES.find(m => m.id === 'victory_triumph') ||
                VOICE_CARE_MESSAGES[0];
              if (victoryQuote) triggerVoiceCare(victoryQuote);

              return {
                ...t,
                distanceTraveled: totalPathLength,
                x: nextPos.x,
                y: nextPos.y,
                saying: '直搗壓力核心，成功淨化所有煩惱！🏆',
                sayingTimer: 8
              };
            }

            const nextHurtTimer = Math.max(0, t.hurtTimer - dt);
            const nextSayingTimer = Math.max(0, t.sayingTimer - dt);

            return {
              ...t,
              x: nextPos.x,
              y: nextPos.y,
              distanceTraveled: nextDist,
              stepAnim: t.stepAnim + dt * 8,
              hurtTimer: nextHurtTimer,
              isHurt: nextHurtTimer > 0,
              sayingTimer: nextSayingTimer,
              saying: nextSayingTimer <= 0 ? '' : t.saying
            };
          });

          // Milestone speeches as teacher advances
          if (currentProgress >= 25 && !milestone25Ref.current) {
            milestone25Ref.current = true;
            setTeacher(t => ({ ...t, saying: '走過晨間公文走廊，教學步調漸入佳境！✨', sayingTimer: 3.5 }));
          }
          if (currentProgress >= 50 && !milestone50Ref.current) {
            milestone50Ref.current = true;
            setTeacher(t => ({ ...t, saying: '挺過半程了！孩子們的笑容給我滿滿力量！💪', sayingTimer: 3.5 }));
          }
          if (currentProgress >= 75 && !milestone75Ref.current) {
            milestone75Ref.current = true;
            setTeacher(t => ({ ...t, saying: '快到壓力核心了！大家準備好最強教具！🔥', sayingTimer: 3.5 }));
          }
          if (currentProgress >= 90 && !milestone90Ref.current) {
            milestone90Ref.current = true;
            setTeacher(t => ({ ...t, saying: '拿出魔法棒，淨化深淵核心就在眼前！✨', sayingTimer: 3.5 }));
          }

          // Passive Energy income from teacher's pedagogical dedication (+10 per sec)
          setEnergy(e => e + 10 * dt);
        }

        // 4. Move Enemies along path towards the Teacher & handle collisions
        setEnemies(currentEnemies => {
          const survivingEnemies: ActiveEnemy[] = [];
          let hpLostThisFrame = 0;

          currentEnemies.forEach(enemy => {
            const isEnemyFrozen = now < enemy.frozenUntil;
            if (isEnemyFrozen) {
              survivingEnemies.push(enemy);
              return;
            }

            const isSlowed = now < enemy.slowedUntil;
            const currentMoveSpeed = enemy.baseSpeed * (isSlowed ? enemy.slowFactor : 1);
            const moveDistance = currentMoveSpeed * dt;

            // Enemies move backward from totalPathLength towards 0
            const currentDistAlongPath = enemy.distanceAlongPath ?? totalPathLength;
            const nextDistAlongPath = currentDistAlongPath - moveDistance;

            // Collision Check: did this enemy meet or pass the advancing Teacher?
            if (nextDistAlongPath <= currentTeacherDist + 18) {
              // Enemy clashes into the Teacher!
              hpLostThisFrame += enemy.damageToTeacher;
              soundEngine.playShockwave();

              // Floating clash damage popup on Teacher
              setDamagePopups(pop => [
                ...pop,
                {
                  id: `clash_${Date.now()}_${Math.random()}`,
                  x: teacher.x,
                  y: teacher.y - 20,
                  text: `-${enemy.damageToTeacher} 壓力衝擊!`,
                  color: '#ef4444',
                  opacity: 1,
                  vy: -25,
                  lifetime: 1.0,
                  isCrit: true
                }
              ]);

              // Clash particles
              const clashParticles: Particle[] = Array.from({ length: 6 }).map((_, i) => ({
                id: `clash_p_${Date.now()}_${i}`,
                x: teacher.x,
                y: teacher.y,
                vx: (Math.random() - 0.5) * 50,
                vy: (Math.random() - 0.5) * 50,
                color: '#f87171',
                alpha: 1,
                size: 3.5,
                shape: 'circle',
                maxLife: 0.5,
                currentLife: 0
              }));
              setParticles(p => [...p, ...clashParticles]);

              // The enemy is dissipated/absorbed by the clash
              return;
            }

            if (nextDistAlongPath <= 0) {
              // Reached path origin
              return;
            }

            const nextPos = getPositionAlongPath(currentMap.path, currentMap.cellSize, nextDistAlongPath);
            survivingEnemies.push({
              ...enemy,
              x: nextPos.x,
              y: nextPos.y,
              distanceAlongPath: nextDistAlongPath,
              distanceTraveled: enemy.distanceTraveled + moveDistance
            });
          });

          if (hpLostThisFrame > 0) {
            setTeacher(t => {
              const nextHp = Math.max(0, t.currentHp - hpLostThisFrame);
              if (nextHp <= 0) {
                // Game Over - Teacher exhausted
                setIsGameOverOpen(true);
                setIsVictory(false);
                const defeatQuote = VOICE_CARE_MESSAGES.find(m => m.id === 'defeat_comfort');
                if (defeatQuote) triggerVoiceCare(defeatQuote);
              } else if (nextHp < 35 && t.currentHp >= 35) {
                const lowQuote = VOICE_CARE_MESSAGES.find(m => m.id === 'low_resilience');
                if (lowQuote) triggerVoiceCare(lowQuote);
              }

              return {
                ...t,
                currentHp: nextHp,
                isHurt: true,
                hurtTimer: 0.45,
                saying: nextHp <= 0 ? '沒關係的老師，我們再來一次！💪' : '呃！這波壓力真沉重...',
                sayingTimer: 2.5
              };
            });
          }

          // Active Boss Special Skills (大魔王絕招：退件限期補正、公文召喚與雙階段暴走)
          const activeBoss = survivingEnemies.find(e => e.isBoss);
          if (activeBoss && !isGameOverOpen && !isVictory) {
            const isEnraged = activeBoss.enraged || activeBoss.bossPhase === 2 || (activeBoss.currentHp / activeBoss.maxHp <= 0.5);

            // Phase 2 Enraged check
            if (!activeBoss.enraged && activeBoss.currentHp / activeBoss.maxHp <= 0.5) {
              activeBoss.enraged = true;
              activeBoss.bossPhase = 2;
              activeBoss.baseSpeed = activeBoss.baseSpeed * 1.4;
              activeBoss.speed = activeBoss.speed * 1.4;
              soundEngine.playShockwave();
              setDamagePopups(pop => [
                ...pop,
                {
                  id: `boss_enrage_trigger_${Date.now()}`,
                  x: activeBoss.x,
                  y: activeBoss.y - 35,
                  text: '🚨【大魔王進入暴走狀態】形式主義護甲瓦解！跑速提升 40%！',
                  color: '#ef4444',
                  opacity: 1,
                  vy: -40,
                  lifetime: 2.5,
                  isCrit: true
                }
              ]);
            }

            bossSkillTimerRef.current -= deltaMs * gameSpeed;
            if (bossSkillTimerRef.current <= 0) {
              const cd = isEnraged
                ? (difficulty === 'hardcore' ? 3800 : 4600)
                : (difficulty === 'hardcore' ? 5000 : 6000);
              bossSkillTimerRef.current = cd;

              soundEngine.playShockwave();

              // Skill effect 1: 【退件印章 🈲】Silence nearest 1~2 teaching towers
              setPlacedTowers(currentTowers => {
                const candidates = currentTowers
                  .map(t => ({ ...t, dist: Math.hypot(t.x - activeBoss.x, t.y - activeBoss.y) }))
                  .filter(t => t.dist <= 260 && (!t.silencedUntil || now >= t.silencedUntil))
                  .sort((a, b) => a.dist - b.dist);

                const maxToSilence = (isEnraged || difficulty === 'hardcore') ? 2 : 1;
                const targets = candidates.slice(0, maxToSilence);

                if (targets.length > 0) {
                  const targetIds = new Set(targets.map(t => t.id));
                  setDamagePopups(pop => [
                    ...pop,
                    {
                      id: `boss_silence_${Date.now()}`,
                      x: activeBoss.x,
                      y: activeBoss.y - 25,
                      text: `🈲 退件限期補正！強制停工 ${targets.length} 座教學教具！`,
                      color: '#dc2626',
                      opacity: 1,
                      vy: -35,
                      lifetime: 2.0,
                      isCrit: true
                    }
                  ]);

                  return currentTowers.map(t =>
                    targetIds.has(t.id) ? { ...t, silencedUntil: now + (isEnraged ? 4800 : 3800) } : t
                  );
                }
                return currentTowers;
              });

              // Skill effect 2: Swirling bureaucratic document particles
              const bossPaperParticles: Particle[] = Array.from({ length: 14 }).map((_, i) => ({
                id: `boss_paper_${Date.now()}_${i}`,
                x: activeBoss.x,
                y: activeBoss.y,
                vx: (Math.random() - 0.5) * 90,
                vy: (Math.random() - 0.5) * 90,
                color: isEnraged ? '#ef4444' : '#38bdf8',
                alpha: 1,
                size: 5,
                shape: 'circle',
                maxLife: 1.2,
                currentLife: 0
              }));
              setParticles(p => [...p, ...bossPaperParticles]);

              // Skill effect 3: Boss summons minion(s)
              const summonType = isEnraged ? (Math.random() < 0.5 ? 'anxiety' : 'bureaucracy') : 'homework';
              const summonConfig = ENEMY_CONFIGS[summonType] || ENEMY_CONFIGS.bureaucracy;
              const minion: ActiveEnemy = {
                id: `minion_${Date.now()}`,
                type: summonConfig.type,
                x: activeBoss.x,
                y: activeBoss.y,
                maxHp: summonConfig.baseHp * 0.85,
                currentHp: summonConfig.baseHp * 0.85,
                speed: summonConfig.speed * 1.05,
                baseSpeed: summonConfig.speed * 1.05,
                pathIndex: activeBoss.pathIndex,
                distanceTraveled: activeBoss.distanceTraveled,
                distanceAlongPath: activeBoss.distanceAlongPath,
                energyReward: summonConfig.energyReward,
                damageToTeacher: summonConfig.damageToTeacher,
                size: summonConfig.size * 0.9,
                color: summonConfig.color,
                frozenUntil: 0,
                slowedUntil: 0,
                slowFactor: 1,
                isBoss: false,
                spawnTime: now
              };
              survivingEnemies.push(minion);
            }
          }

          return survivingEnemies;
        });

        // 4. Update Towers & Attack logic
        setPlacedTowers(currentTowers => {
          const synergy = getCurriculumSynergy(currentTowers);

          return currentTowers.map(tower => {
            let updatedTower = { ...tower };

            // If silenced by Boss Retreat Stamp 🈲, skip attack!
            if (tower.silencedUntil && now < tower.silencedUntil) {
              return updatedTower;
            }

            // Check adjacent coffee machines to buff attack speed
            const hasCoffeeBuff = currentTowers.some(
              other =>
                other.type === 'coffee_machine' &&
                other.id !== tower.id &&
                Math.hypot(other.x - tower.x, other.y - tower.y) <= other.range
            );

            const effectiveRange = tower.range * (1 + synergy.rangeBonus);
            const effectiveAttackSpeed =
              tower.attackSpeed *
              (hasCoffeeBuff ? 1.35 : 1) *
              (isSpeedBoosted ? 1.4 : 1) *
              (1 + synergy.speedBonus);

            const cooldown = 1 / effectiveAttackSpeed;
            const timeSinceLastAttack = (now - tower.lastAttackTime) / 1000;

            // Coffee machine periodic energy generation
            if (tower.type === 'coffee_machine') {
              if (timeSinceLastAttack >= 8) {
                setEnergy(e => e + 25 * tower.level);
                soundEngine.playCoin();
                updatedTower.lastAttackTime = now;
                // Popup energy
                setDamagePopups(pop => [
                  ...pop,
                  {
                    id: `pop_${Date.now()}`,
                    x: tower.x,
                    y: tower.y - 15,
                    text: `+⚡${25 * tower.level} 咖啡活力`,
                    color: '#d97706',
                    opacity: 1,
                    vy: -25,
                    lifetime: 1.2
                  }
                ]);
              }
              return updatedTower;
            }

            // Find in-range enemies
            setEnemies(currEnemies => {
              const inRangeEnemies = currEnemies.filter(e => {
                const dist = Math.hypot(e.x - tower.x, e.y - tower.y);
                return dist <= effectiveRange;
              });

              if (inRangeEnemies.length === 0) {
                updatedTower.targetId = null;
                return currEnemies;
              }

              // Pick target by strategy
              let target = inRangeEnemies[0];
              if (tower.targetStrategy === 'first') {
                target = inRangeEnemies.reduce((prev, curr) =>
                  curr.distanceTraveled > prev.distanceTraveled ? curr : prev
                );
              } else if (tower.targetStrategy === 'last') {
                target = inRangeEnemies.reduce((prev, curr) =>
                  curr.distanceTraveled < prev.distanceTraveled ? curr : prev
                );
              } else if (tower.targetStrategy === 'strongest') {
                target = inRangeEnemies.reduce((prev, curr) =>
                  curr.currentHp > prev.currentHp ? curr : prev
                );
              } else if (tower.targetStrategy === 'weakest') {
                target = inRangeEnemies.reduce((prev, curr) =>
                  curr.currentHp < prev.currentHp ? curr : prev
                );
              }

              updatedTower.targetId = target.id;

              // Face angle
              const angle = Math.atan2(target.y - tower.y, target.x - tower.x) + Math.PI / 2;
              updatedTower.rotation = angle;

              // Attack trigger
              if (timeSinceLastAttack >= cooldown) {
                updatedTower.lastAttackTime = now;

                if (tower.type === 'red_pen') {
                  // Single target snipe
                  soundEngine.playShootPen();
                  const isCrit = Math.random() < 0.25;
                  const damage = tower.damage * (isCrit ? 2.2 : 1);

                  setProjectiles(projs => [
                    ...projs,
                    {
                      id: `proj_${Date.now()}_${Math.random()}`,
                      x: tower.x,
                      y: tower.y,
                      targetX: target.x,
                      targetY: target.y,
                      targetEnemyId: target.id,
                      speed: 450,
                      damage,
                      type: 'pen_mark',
                      color: '#ef4444',
                      radius: 4
                    }
                  ]);
                } else if (tower.type === 'chalk_laser') {
                  // Direct instant knowledge laser beam
                  const damage = tower.damage * 0.65;
                  setProjectiles(projs => [
                    ...projs,
                    {
                      id: `laser_${Date.now()}`,
                      x: tower.x,
                      y: tower.y,
                      targetX: target.x,
                      targetY: target.y,
                      targetEnemyId: target.id,
                      speed: 9999,
                      damage,
                      type: 'laser',
                      color: '#ec4899',
                      radius: 3
                    }
                  ]);

                  // Apply damage directly to target & slow
                  return currEnemies.map(e => {
                    if (e.id !== target.id) return e;
                    const nextHp = e.currentHp - damage;
                    updatedTower.totalDamageDealt += damage;
                    totalDamageDealtRef.current += damage;
                    return {
                      ...e,
                      currentHp: nextHp,
                      slowedUntil: now + 1500,
                      slowFactor: 0.7
                    };
                  });
                } else if (tower.type === 'blackboard_eraser') {
                  // 🌿 舒壓精油按摩：AOE 精油放鬆波，擊退非Boss並消除疲憊
                  soundEngine.playShockwave();
                  const aoeDamage = tower.damage;

                  setProjectiles(projs => [
                    ...projs,
                    {
                      id: `shock_${Date.now()}`,
                      x: tower.x,
                      y: tower.y,
                      targetX: tower.x,
                      targetY: tower.y,
                      targetEnemyId: '',
                      speed: 0,
                      damage: aoeDamage,
                      type: 'shockwave',
                      color: '#10b981',
                      radius: 12
                    }
                  ]);

                  // 精油舒緩跳字
                  setDamagePopups(pop => [
                    ...pop,
                    {
                      id: `pop_oil_${Date.now()}`,
                      x: tower.x,
                      y: tower.y - 18,
                      text: `🌿 精油深層舒壓!`,
                      color: '#059669',
                      opacity: 1,
                      vy: -20,
                      lifetime: 0.8,
                      isCrit: true
                    }
                  ]);

                  // Damage all in-range enemies and knock back non-bosses
                  return currEnemies.map(e => {
                    const dist = Math.hypot(e.x - tower.x, e.y - tower.y);
                    if (dist <= tower.range) {
                      updatedTower.totalDamageDealt += aoeDamage;
                      totalDamageDealtRef.current += aoeDamage;
                      return {
                        ...e,
                        currentHp: e.currentHp - aoeDamage,
                        distanceTraveled: Math.max(0, e.distanceTraveled - (e.isBoss ? 0 : 25))
                      };
                    }
                    return e;
                  });
                } else if (tower.type === 'heart_bell') {
                  // 🍬 舒喉潤喉糖：第四高道具，散發澎大海草本清涼，持續減速 50% 撫平狂躁並軟化敵防
                  soundEngine.playHeartHeal();

                  // 潤喉跳字
                  setDamagePopups(pop => [
                    ...pop,
                    {
                      id: `pop_throat_${Date.now()}`,
                      x: tower.x,
                      y: tower.y - 16,
                      text: `🍬 生津潤喉!`,
                      color: '#d97706',
                      opacity: 1,
                      vy: -18,
                      lifetime: 0.75,
                      isCrit: false
                    }
                  ]);

                  return currEnemies.map(e => {
                    const dist = Math.hypot(e.x - tower.x, e.y - tower.y);
                    if (dist <= tower.range) {
                      return {
                        ...e,
                        slowedUntil: now + 2500,
                        slowFactor: 0.45,
                        currentHp: e.currentHp - tower.damage
                      };
                    }
                    return e;
                  });
                } else if (tower.type === 'smart_board') {
                  // Chain lightning sparks across up to 4 targets
                  soundEngine.playShootPen();
                  const chainTargets = inRangeEnemies.slice(0, 4);
                  chainTargets.forEach((ct, i) => {
                    setProjectiles(projs => [
                      ...projs,
                      {
                        id: `spark_${Date.now()}_${i}`,
                        x: i === 0 ? tower.x : chainTargets[i - 1].x,
                        y: i === 0 ? tower.y : chainTargets[i - 1].y,
                        targetX: ct.x,
                        targetY: ct.y,
                        targetEnemyId: ct.id,
                        speed: 9999,
                        damage: tower.damage * (1 - i * 0.15),
                        type: 'sound_wave',
                        color: '#38bdf8',
                        radius: 2
                      }
                    ]);
                  });

                  return currEnemies.map(e => {
                    const hitIndex = chainTargets.findIndex(ct => ct.id === e.id);
                    if (hitIndex !== -1) {
                      const dmg = tower.damage * (1 - hitIndex * 0.15);
                      updatedTower.totalDamageDealt += dmg;
                      totalDamageDealtRef.current += dmg;
                      return {
                        ...e,
                        currentHp: e.currentHp - dmg
                      };
                    }
                    return e;
                  });
                } else if (tower.type === 'knowledge_beacon') {
                  // 🌟 [最高層級道具] 翻轉教育資源：海量創新教案與專業法規顧問，貫穿破甲徹底淨化倦怠！
                  soundEngine.playShootPen();
                  const isIgnorance = target.type === 'ignorance' || target.type === 'parent_complaint';
                  const isCrit = tower.level >= 2 && Math.random() < 0.35;
                  let hitDamage = tower.damage;

                  // Bonus vs Ignorance & high noise monsters
                  if (isIgnorance) {
                    hitDamage *= 2.2;
                  }
                  if (isCrit) {
                    hitDamage *= 2.0;
                  }

                  // FlipEdu Innovation Radiant Laser Beam Projectile
                  setProjectiles(projs => [
                    ...projs,
                    {
                      id: `beacon_beam_${Date.now()}`,
                      x: tower.x,
                      y: tower.y,
                      targetX: target.x,
                      targetY: target.y,
                      targetEnemyId: target.id,
                      speed: 9999,
                      damage: hitDamage,
                      type: 'laser',
                      color: isCrit ? '#f59e0b' : '#eab308',
                      radius: isCrit ? 4.5 : 3
                    }
                  ]);

                  // Sonic wave sparkle particles
                  const sparkles: Particle[] = Array.from({ length: 6 }).map((_, i) => ({
                    id: `beacon_p_${Date.now()}_${i}`,
                    x: target.x,
                    y: target.y,
                    vx: (Math.random() - 0.5) * 60,
                    vy: (Math.random() - 0.5) * 60,
                    color: '#fef08a',
                    alpha: 1,
                    size: 4,
                    shape: 'star',
                    maxLife: 0.55,
                    currentLife: 0
                  }));
                  setParticles(p => [...p, ...sparkles]);

                  // Popup damage
                  setDamagePopups(pop => [
                    ...pop,
                    {
                      id: `pop_beacon_${Date.now()}`,
                      x: target.x,
                      y: target.y - 12,
                      text: isCrit
                        ? `🌟 翻轉備課爆發! -${Math.round(hitDamage)}`
                        : isIgnorance
                        ? `🌟 翻轉資源破盾! -${Math.round(hitDamage)}`
                        : `🌟 翻轉靈感! -${Math.round(hitDamage)}`,
                      color: '#eab308',
                      opacity: 1,
                      vy: -25,
                      lifetime: 0.9,
                      isCrit: isCrit || isIgnorance
                    }
                  ]);

                  // If Lv3: pierces target to hit other enemies in line behind it
                  const piercedTargets =
                    tower.level >= 3
                      ? inRangeEnemies.filter(
                          e => e.id !== target.id && Math.hypot(e.x - target.x, e.y - target.y) <= 70
                        )
                      : [];

                  return currEnemies.map(e => {
                    if (e.id === target.id) {
                      updatedTower.totalDamageDealt += hitDamage;
                      totalDamageDealtRef.current += hitDamage;
                      return {
                        ...e,
                        currentHp: e.currentHp - hitDamage
                      };
                    }
                    if (piercedTargets.some(pt => pt.id === e.id)) {
                      const pierceDmg = hitDamage * 0.5;
                      updatedTower.totalDamageDealt += pierceDmg;
                      totalDamageDealtRef.current += pierceDmg;
                      return {
                        ...e,
                        currentHp: e.currentHp - pierceDmg
                      };
                    }
                    return e;
                  });
                } else if (tower.type === 'compassion_breeze') {
                  // 2. [NEW] 象徵「關愛」：春風化雨．關愛同理溫室
                  soundEngine.playHeartHeal();

                  // Lv3 Passive: Regenerate Teacher resilience every 12 seconds
                  if (tower.level >= 3 && timeSinceLastAttack >= 12) {
                    setTeacher(t => ({
                      ...t,
                      currentHp: Math.min(t.maxHp, t.currentHp + 5)
                    }));
                    setDamagePopups(pop => [
                      ...pop,
                      {
                        id: `heal_pop_${Date.now()}`,
                        x: tower.x,
                        y: tower.y - 18,
                        text: `+5 ❤️ 桃李春風`,
                        color: '#f43f5e',
                        opacity: 1,
                        vy: -25,
                        lifetime: 1.3
                      }
                    ]);
                  }

                  // Floating pink flower petals
                  const petalParticles: Particle[] = Array.from({ length: 4 }).map((_, i) => ({
                    id: `petal_${Date.now()}_${i}`,
                    x: tower.x + (Math.random() - 0.5) * tower.range * 1.2,
                    y: tower.y + (Math.random() - 0.5) * tower.range * 1.2,
                    vx: (Math.random() - 0.5) * 20,
                    vy: -15,
                    color: '#f43f5e',
                    alpha: 0.9,
                    size: 3,
                    shape: 'flower',
                    maxLife: 0.8,
                    currentLife: 0
                  }));
                  setParticles(p => [...p, ...petalParticles]);

                  // Soft AOE damage + deep slow + extra damage to Burnout & Prejudice
                  return currEnemies.map(e => {
                    const dist = Math.hypot(e.x - tower.x, e.y - tower.y);
                    if (dist <= tower.range) {
                      const isBurnoutOrPrejudice = e.type === 'burnout' || e.type === 'prejudice';
                      const dmg = tower.damage * (isBurnoutOrPrejudice ? 2.0 : 1.0);
                      const slowFactor = tower.level >= 2 ? 0.35 : 0.5;

                      updatedTower.totalDamageDealt += dmg;
                      totalDamageDealtRef.current += dmg;

                      return {
                        ...e,
                        currentHp: e.currentHp - dmg,
                        slowedUntil: now + 2000,
                        slowFactor
                      };
                    }
                    return e;
                  });
                } else if (tower.type === 'encouragement_megaphone') {
                  // 3. [NEW] 象徵「鼓勵」：自信啟航．讚美大聲公
                  soundEngine.playShockwave();

                  // Expanding sonic blast projectile
                  setProjectiles(projs => [
                    ...projs,
                    {
                      id: `sonic_ring_${Date.now()}`,
                      x: tower.x,
                      y: tower.y,
                      targetX: tower.x,
                      targetY: tower.y,
                      targetEnemyId: '',
                      speed: 0,
                      damage: tower.damage,
                      type: 'shockwave',
                      color: '#eab308',
                      radius: 12
                    }
                  ]);

                  // Sound note particles
                  const notes: Particle[] = Array.from({ length: 4 }).map((_, i) => ({
                    id: `note_${Date.now()}_${i}`,
                    x: tower.x,
                    y: tower.y,
                    vx: (Math.random() - 0.5) * 50,
                    vy: (Math.random() - 0.5) * 50,
                    color: '#facc15',
                    alpha: 1,
                    size: 4,
                    shape: 'spark',
                    maxLife: 0.6,
                    currentLife: 0
                  }));
                  setParticles(p => [...p, ...notes]);

                  // Damage all in-range enemies, huge bonus against Anxiety (考試自卑焦慮)
                  return currEnemies.map(e => {
                    const dist = Math.hypot(e.x - tower.x, e.y - tower.y);
                    if (dist <= tower.range) {
                      const isAnxiety = e.type === 'anxiety';
                      const dmg = tower.damage * (isAnxiety ? 2.5 : 1.0);

                      updatedTower.totalDamageDealt += dmg;
                      totalDamageDealtRef.current += dmg;

                      if (isAnxiety) {
                        setDamagePopups(pop => [
                          ...pop,
                          {
                            id: `pop_anx_${Date.now()}`,
                            x: e.x,
                            y: e.y - 14,
                            text: `肯定自我! -${Math.round(dmg)}`,
                            color: '#eab308',
                            opacity: 1,
                            vy: -28,
                            lifetime: 0.9,
                            isCrit: true
                          }
                        ]);
                      }

                      return {
                        ...e,
                        currentHp: e.currentHp - dmg
                      };
                    }
                    return e;
                  });
                }
              }

              return currEnemies;
            });

            return updatedTower;
          });
        });

        // 5. Update Projectiles physics & collisions
        setProjectiles(currentProjs => {
          const survivingProjs: Projectile[] = [];

          currentProjs.forEach(proj => {
            if (proj.type === 'shockwave') {
              proj.radius += 180 * dt;
              if (proj.radius < 130) survivingProjs.push(proj);
              return;
            }

            if (proj.type === 'laser' || proj.type === 'sound_wave') {
              // Beams linger for only 0.12s
              proj.radius -= 1;
              if (proj.radius > 0) survivingProjs.push(proj);
              return;
            }

            // Normal ballistic projectile (e.g. red pen bullet)
            setEnemies(currEnemies => {
              const target = currEnemies.find(e => e.id === proj.targetEnemyId);
              if (!target) return currEnemies;

              const dx = target.x - proj.x;
              const dy = target.y - proj.y;
              const dist = Math.hypot(dx, dy);
              const moveDist = proj.speed * dt;

              if (dist <= moveDist) {
                // Hit target!
                let effectiveDamage = proj.damage;
                const isBossShielded = target.isBoss && !target.enraged;
                if (isBossShielded) {
                  // Phase 1 Formality Armor: 校事會議魔王減免 60% 傷害，其餘魔王減免 40%
                  const reductionRate = target.type === 'school_affairs_meeting_boss' ? 0.4 : 0.6;
                  effectiveDamage = proj.damage * reductionRate;
                }

                totalDamageDealtRef.current += effectiveDamage;
                // Popup damage text
                setDamagePopups(pop => [
                  ...pop,
                  {
                    id: `pop_${Date.now()}`,
                    x: target.x,
                    y: target.y - 12,
                    text: isBossShielded ? `🛡️ -${Math.round(effectiveDamage)}` : `-${Math.round(effectiveDamage)}`,
                    color: isBossShielded ? '#93c5fd' : '#ef4444',
                    opacity: 1,
                    vy: -25,
                    lifetime: 0.8
                  }
                ]);

                // Small ink splat particles
                const splats: Particle[] = Array.from({ length: 4 }).map((_, i) => ({
                  id: `splat_${Date.now()}_${i}`,
                  x: target.x,
                  y: target.y,
                  vx: (Math.random() - 0.5) * 35,
                  vy: (Math.random() - 0.5) * 35,
                  color: '#dc2626',
                  alpha: 1,
                  size: 2.5,
                  shape: 'circle',
                  maxLife: 0.4,
                  currentLife: 0
                }));
                setParticles(p => [...p, ...splats]);

                return currEnemies.map(e => {
                  if (e.id !== target.id) return e;
                  const newHp = e.currentHp - effectiveDamage;

                  if (e.isBoss && !e.enraged && newHp <= e.maxHp * 0.5) {
                    soundEngine.playShockwave();
                    setDamagePopups(p => [
                      ...p,
                      {
                        id: `boss_enrage_hit_${Date.now()}`,
                        x: e.x,
                        y: e.y - 30,
                        text: '💥【形式主義護甲瓦解！】大魔王進入狂化暴走狀態！跑速提升 40%！',
                        color: '#ef4444',
                        opacity: 1,
                        vy: -40,
                        lifetime: 2.5,
                        isCrit: true
                      }
                    ]);
                    return {
                      ...e,
                      currentHp: newHp,
                      enraged: true,
                      bossPhase: 2,
                      baseSpeed: e.baseSpeed * 1.4,
                      speed: e.speed * 1.4
                    };
                  }

                  return {
                    ...e,
                    currentHp: newHp
                  };
                });
              } else {
                proj.x += (dx / dist) * moveDist;
                proj.y += (dy / dist) * moveDist;
                survivingProjs.push(proj);
                return currEnemies;
              }
            });
          });

          return survivingProjs;
        });

        // 6. Clean up dead enemies & award energy
        setEnemies(currEnemies => {
          const alive: ActiveEnemy[] = [];
          currEnemies.forEach(e => {
            if (e.currentHp <= 0) {
              // Monster defeated!
              enemiesDefeatedRef.current += 1;
              setEnergy(en => en + e.energyReward);
              soundEngine.playCoin();

              // Defeat floating text
              setDamagePopups(pop => [
                ...pop,
                {
                  id: `defeat_pop_${Date.now()}`,
                  x: e.x,
                  y: e.y - 15,
                  text: `+⚡${e.energyReward} 熱忱`,
                  color: '#16a34a',
                  opacity: 1,
                  vy: -30,
                  lifetime: 1.1
                }
              ]);

              // Defeat particles
              const defeatParticles: Particle[] = Array.from({ length: 7 }).map((_, i) => ({
                id: `defeat_p_${Date.now()}_${i}`,
                x: e.x,
                y: e.y,
                vx: (Math.random() - 0.5) * 60,
                vy: (Math.random() - 0.5) * 60,
                color: '#f59e0b',
                alpha: 1,
                size: 3.5,
                shape: 'star',
                maxLife: 0.7,
                currentLife: 0
              }));
              setParticles(p => [...p, ...defeatParticles]);
            } else {
              alive.push(e);
            }
          });
          return alive;
        });

        // 7. Update Particles
        setParticles(currParticles =>
          currParticles
            .map(p => ({
              ...p,
              x: p.x + p.vx * dt,
              y: p.y + p.vy * dt,
              currentLife: p.currentLife + dt,
              alpha: 1 - p.currentLife / p.maxLife
            }))
            .filter(p => p.currentLife < p.maxLife)
        );

        // 8. Update Damage Popups
        setDamagePopups(currPops =>
          currPops
            .map(pop => ({
              ...pop,
              y: pop.y + pop.vy * dt,
              lifetime: pop.lifetime - dt,
              opacity: Math.max(0, pop.lifetime)
            }))
            .filter(pop => pop.lifetime > 0)
        );

        // 9. Periodic Bonus Gift check (Every 25% progress milestone)
        // Bonus items can be given when crossing key milestones
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [
    isPaused,
    gameSpeed,
    currentMap,
    totalPathLength,
    teacher.distanceTraveled,
    teacher.x,
    teacher.y,
    teacher.maxHp,
    isGameOverOpen,
    isVictory,
    isAllFrozen,
    triggerVoiceCare
  ]);

  const handleRestart = () => {
    switchMap(currentMap.id);
  };

  const handleNextMap = () => {
    const nextIdx = (currentMapIndex + 1) % GAME_MAPS.length;
    switchMap(GAME_MAPS[nextIdx].id);
  };

  return (
    <div className="h-screen max-h-screen w-screen overflow-hidden bg-stone-100/80 text-stone-900 flex flex-col font-sans selection:bg-rose-100 selection:text-rose-900 select-none">
      {/* Header with Teacher Journey Status */}
      <GameHeader
        teacherHp={Math.round(teacher.currentHp)}
        maxTeacherHp={teacher.maxHp}
        energy={Math.floor(energy)}
        progressPct={progressPct}
        distanceRemaining={distanceRemaining}
        threatLevelName={threatLevelName}
        gameSpeed={gameSpeed}
        isPaused={isPaused}
        isSoundMuted={isSoundMuted}
        isVoiceMuted={isVoiceMuted}
        currentMap={currentMap}
        difficulty={difficulty}
        onChangeDifficulty={setDifficulty}
        onTogglePause={() => setIsPaused(p => !p)}
        onSetGameSpeed={setGameSpeed}
        onToggleSound={() => {
          const next = !isSoundMuted;
          setIsSoundMuted(next);
          soundEngine.setMuted(next);
        }}
        onToggleVoice={() => {
          const next = !isVoiceMuted;
          setIsVoiceMuted(next);
          speechEngine.setMuted(next);
        }}
        onChangeMap={switchMap}
        onOpenLounge={() => setIsLoungeOpen(true)}
        onOpenHelp={() => {
          setHelpModalTab('tutorial');
          setIsHelpOpen(true);
        }}
      />

      {/* Main Game Stage Arena (Zero scroll, responsive center fit) */}
      <main className="flex-1 min-h-0 relative w-full max-w-7xl mx-auto px-1 sm:px-3 py-1 flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Game Canvas Board */}
          <GameBoard
            mapData={currentMap}
            teacher={teacher}
            placedTowers={placedTowers}
            enemies={enemies}
            projectiles={projectiles}
            particles={particles}
            damagePopups={damagePopups}
            selectedTowerId={selectedTowerId}
            selectedCell={selectedCell ? { x: selectedCell.gridX, y: selectedCell.gridY } : null}
            selectedBuildTowerType={selectedBuildTowerType}
            hoveredCell={hoveredCell}
            canAffordHoveredTower={
              selectedBuildTowerType
                ? energy >= getTowerPurchaseCost(
                    TOWER_CONFIGS[selectedBuildTowerType]?.baseCost || 0,
                    placedTowers.filter(t => t.type === selectedBuildTowerType).length
                  )
                : false
            }
            isAllFrozen={isAllFrozen}
            onCellClick={handleCellClick}
            onCellHover={(x, y) => setHoveredCell({ x, y })}
            onCellLeave={() => setHoveredCell(null)}
            onTowerClick={id => {
              setSelectedTowerId(id);
              setSelectedBuildTowerType(null);
              setSelectedCell(null);
              soundEngine.playClick();
            }}
          />

          {/* Floating Left: FlipFish Mascot Cheer Pill (Auto-dismisses in 2s, or dismiss with X) */}
          <div className="absolute top-2 left-2 z-15 pointer-events-auto max-w-[calc(100vw-48px)] sm:max-w-xs md:max-w-sm">
            <FlipFishCompanion
              teacherHp={teacher.currentHp}
              maxTeacherHp={teacher.maxHp}
              progressPct={progressPct}
              isPaused={isPaused}
              isFrozen={isAllFrozen}
              hasBoss={enemies.some(e => e.isBoss)}
              placedTowerCount={placedTowers.length}
              onOpenHelp={() => {
                setHelpModalTab('tutorial');
                setIsHelpOpen(true);
              }}
              onOpenLounge={() => setIsLoungeOpen(true)}
            />
          </div>

          {/* Floating Right: Quick 3-Step Guide (Auto dismisses in 2s, or dismiss with button) */}
          {showQuickGuide && (
            <div className="absolute top-2 right-2 z-15 pointer-events-auto bg-white/95 backdrop-blur-md border border-amber-300 shadow-sm rounded-xl px-2.5 py-1.5 flex items-center gap-2 animate-in fade-in">
              <div className="flex items-center gap-1.5 text-[11px] font-black text-amber-950">
                <span>🎯 守護老師：❶點下方教具 ➔ ❷點空格 ➔ ❸通關</span>
              </div>
              <span className="text-[9.5px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                2s
              </span>
              <button
                onClick={() => setShowQuickGuide(false)}
                className="w-4 h-4 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center text-[10px] cursor-pointer"
                title="關閉提示"
              >
                ✕
              </button>
            </div>
          )}

          {/* Floating Center: Boss Fight Alert Bar */}
          {enemies.some(e => e.isBoss) && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[92%] max-w-xl z-20 pointer-events-auto">
              <BossFightBar boss={enemies.find(e => e.isBoss)} />
            </div>
          )}

          {/* Tower Inspector / Upgrade Card Overlay */}
          <TowerUpgradeModal
            tower={selectedTower}
            currentEnergy={energy}
            onClose={() => setSelectedTowerId(null)}
            onUpgrade={handleUpgradeTower}
            onSell={handleSellTower}
            onChangeStrategy={handleChangeStrategy}
          />

          {/* Cell Quick Build & Info Modal */}
          <CellQuickBuildModal
            cell={selectedCell}
            mapData={currentMap}
            energy={energy}
            placedTowers={placedTowers}
            onClose={() => setSelectedCell(null)}
            onBuildTower={handleQuickBuildTower}
          />
        </div>
      </main>

      {/* Integrated Single-Screen Bottom Dock (Towers & Rescue Items) */}
      <BottomControlDock
        selectedTowerType={selectedBuildTowerType}
        currentEnergy={energy}
        placedTowers={placedTowers}
        onSelectTower={type => setSelectedBuildTowerType(type)}
        onOpenSkillGuide={() => {
          setHelpModalTab('towers');
          setIsHelpOpen(true);
        }}
        items={items}
        onUseItem={handleUseItem}
        onInspectItem={item => setInspectedItem(item)}
      />

      {/* Voice Care Encouragement Prompt Banner */}
      <VoiceCareBanner
        message={voiceMessage}
        onDismiss={() => setVoiceMessage(null)}
        onOpenLounge={() => setIsLoungeOpen(true)}
      />

      {/* Teacher Lounge ("教師心靈解憂茶水間") Modal */}
      <TeacherLoungeModal
        isOpen={isLoungeOpen}
        onClose={() => setIsLoungeOpen(false)}
        onEarnIceItem={handleEarnIceItem}
      />

      {/* Item Detail & Lore Inspection Modal */}
      <ItemDetailModal
        item={inspectedItem}
        onClose={() => setInspectedItem(null)}
        onUseItem={handleUseItem}
      />

      {/* Game Over / Victory Modal */}
      <GameOverModal
        isOpen={isGameOverOpen}
        isVictory={isVictory}
        score={{
          progressPct: Math.round(progressPct),
          totalDamage: totalDamageDealtRef.current,
          enemiesDefeated: enemiesDefeatedRef.current,
          remainingHp: Math.round(teacher.currentHp)
        }}
        onRestart={handleRestart}
        onNextMap={handleNextMap}
        hasNextMap={currentMapIndex < GAME_MAPS.length - 1}
        onOpenLounge={() => {
          setIsGameOverOpen(false);
          setIsLoungeOpen(true);
        }}
      />

      {/* Help Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        initialTab={helpModalTab}
      />
    </div>
  );
}
