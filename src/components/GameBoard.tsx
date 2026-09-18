import React, { useRef, useEffect } from 'react';
import {
  MapData,
  PlacedTower,
  ActiveEnemy,
  Projectile,
  Particle,
  DamagePopup,
  TowerType,
  TeacherCharacter
} from '../types';
import { isCellOnPath, isCellNearPressureCore } from '../constants/maps';
import { TOWER_CONFIGS } from '../constants/towers';

interface GameBoardProps {
  mapData: MapData;
  teacher: TeacherCharacter;
  placedTowers: PlacedTower[];
  enemies: ActiveEnemy[];
  projectiles: Projectile[];
  particles: Particle[];
  damagePopups: DamagePopup[];
  selectedTowerId: string | null;
  selectedCell?: { x: number; y: number } | null;
  selectedBuildTowerType: TowerType | null;
  hoveredCell: { x: number; y: number } | null;
  canAffordHoveredTower: boolean;
  isAllFrozen: boolean;
  onCellClick: (gridX: number, gridY: number) => void;
  onCellHover: (gridX: number, gridY: number) => void;
  onCellLeave: () => void;
  onTowerClick: (towerId: string) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  mapData,
  teacher,
  placedTowers,
  enemies,
  projectiles,
  particles,
  damagePopups,
  selectedTowerId,
  selectedCell,
  selectedBuildTowerType,
  hoveredCell,
  canAffordHoveredTower,
  isAllFrozen,
  onCellClick,
  onCellHover,
  onCellLeave,
  onTowerClick
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const width = mapData.gridCols * mapData.cellSize;
  const height = mapData.gridRows * mapData.cellSize;

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // 1. Clear background with dynamic theme color
    ctx.fillStyle = mapData.canvasBg || '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    // 2. Draw Floor Grid Pattern (Classroom Tiles)
    const { cellSize, gridCols, gridRows } = mapData;
    const floor1 = mapData.floorColor1 || '#fdfbf7';
    const floor2 = mapData.floorColor2 || '#f8f4ec';
    const floorStroke = mapData.floorStroke || 'rgba(226, 232, 240, 0.6)';

    for (let c = 0; c < gridCols; c++) {
      for (let r = 0; r < gridRows; r++) {
        const x = c * cellSize;
        const y = r * cellSize;
        const isPath = isCellOnPath(mapData.path, c, r);

        if (!isPath) {
          ctx.fillStyle = (c + r) % 2 === 0 ? floor1 : floor2;
          ctx.fillRect(x, y, cellSize, cellSize);

          ctx.strokeStyle = floorStroke;
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, cellSize, cellSize);
        }
      }
    }

    // 3. Draw Path (Chalk Path / School Corridor / Red Carpet)
    ctx.save();
    ctx.beginPath();
    mapData.path.forEach((pt, idx) => {
      const px = pt.x * cellSize + cellSize / 2;
      const py = pt.y * cellSize + cellSize / 2;
      if (idx === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });

    // Outer path border
    ctx.strokeStyle = mapData.pathOuterColor || '#e2e8f0';
    ctx.lineWidth = cellSize * 0.88;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Inner path core (Chalkboard road or track lane)
    ctx.strokeStyle = mapData.pathCoreColor || '#334155';
    ctx.lineWidth = cellSize * 0.72;
    ctx.stroke();

    // Dotted center line (Teacher's chalk dash line)
    ctx.strokeStyle = mapData.pathDashColor || '#fbbf24';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 8]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // 4. Draw Start & End Markers
    const startX = mapData.startPoint.x * cellSize + cellSize / 2;
    const startY = mapData.startPoint.y * cellSize + cellSize / 2;
    const endX = mapData.endPoint.x * cellSize + cellSize / 2;
    const endY = mapData.endPoint.y * cellSize + cellSize / 2;

    // Start point: Classroom Base / Teacher Departure Origin (班級出發站)
    ctx.save();
    ctx.fillStyle = '#059669';
    ctx.beginPath();
    ctx.arc(startX, startY, cellSize * 0.44, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🏫 出發起點', startX, startY);
    ctx.restore();

    // End point: Pressure Source Core / Abyss (終點目標)
    ctx.save();
    // Gentle, calm breathing rhythm (no rapid flashing)
    const corePulse = Math.sin(Date.now() / 1500) * 1.5;

    // High Pressure Miasma Field (反壓迫警戒區 - 阻止在深淵門口堵門蓋塔)
    ctx.fillStyle = 'rgba(239, 68, 68, 0.06)';
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.arc(endX, endY, cellSize * 1.85, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.setLineDash([]);

    // Clear descriptive text on danger field border
    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🎯 終點目標（深淵核心）', endX, endY - cellSize * 1.9);

    // Calm pressure vortex (steady, soothing glow)
    const vortexGrad = ctx.createRadialGradient(endX, endY, 2, endX, endY, cellSize * 0.48 + corePulse);
    vortexGrad.addColorStop(0, '#7f1d1d');
    vortexGrad.addColorStop(0.6, '#dc2626');
    vortexGrad.addColorStop(1, 'rgba(153, 27, 27, 0.25)');

    ctx.fillStyle = vortexGrad;
    ctx.beginPath();
    ctx.arc(endX, endY, cellSize * 0.48 + corePulse, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🌋', endX, endY - 4);
    ctx.font = 'bold 9px sans-serif';
    ctx.fillStyle = '#fecaca';
    ctx.fillText('深淵核心', endX, endY + 11);
    ctx.restore();

    // 5. Draw Map Backdrop Elements (Only official wall fixtures like blackboard, podium, clock)
    mapData.decorations.forEach(dec => {
      const dx = dec.x * cellSize + cellSize / 2;
      const dy = dec.y * cellSize + cellSize / 2;
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      if (dec.type === 'chalkboard') {
        const isSpecial = mapData.isSpecialEvent;
        const width = isSpecial ? 76 : 52;
        const height = isSpecial ? 28 : 22;
        ctx.fillStyle = '#14532d'; // Deep chalkboard green
        ctx.fillRect(dx - width / 2, dy - height / 2, width, height);
        ctx.strokeStyle = '#78350f'; // Wood frame
        ctx.lineWidth = 2.5;
        ctx.strokeRect(dx - width / 2, dy - height / 2, width, height);
        ctx.fillStyle = '#fef08a';
        ctx.font = isSpecial ? 'bold 8.5px sans-serif' : 'bold 9px sans-serif';
        ctx.fillText(isSpecial ? '祝敬師節快樂' : '黑板．備課中', dx, dy);
      } else if (dec.type === 'podium') {
        // Teacher's podium
        ctx.fillStyle = '#fef3c7';
        ctx.beginPath();
        ctx.arc(dx, dy, cellSize * 0.42, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.font = '20px sans-serif';
        ctx.fillText('🧑‍🏫', dx, dy - 2);
        ctx.font = 'bold 7.5px sans-serif';
        ctx.fillStyle = '#92400e';
        ctx.fillText('榮譽講台', dx, dy + 11);
      } else if (dec.type === 'clock') {
        ctx.font = '20px sans-serif';
        ctx.fillText('⏰', dx, dy);
      } else if (dec.type === 'printer') {
        ctx.font = '20px sans-serif';
        ctx.fillText('🖨️', dx, dy);
      } else if (dec.type === 'tree') {
        ctx.font = '24px sans-serif';
        ctx.fillText('🌳', dx, dy);
      }
      ctx.restore();
    });

    // 6. Draw Placed Towers
    placedTowers.forEach(tower => {
      const isSelected = tower.id === selectedTowerId;

      // Selection or hover range circle
      if (isSelected) {
        ctx.save();
        ctx.fillStyle = 'rgba(59, 130, 246, 0.12)';
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.arc(tower.x, tower.y, tower.range, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Pulsing selection halo
        const pulse = Math.sin(Date.now() / 150) * 2.5;
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(tower.x, tower.y, cellSize * 0.45 + pulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Tower base pedestal
      ctx.save();
      ctx.fillStyle = isSelected ? '#dbeafe' : '#f1f5f9';
      ctx.strokeStyle = isSelected ? '#2563eb' : '#94a3b8';
      ctx.lineWidth = isSelected ? 2.5 : 1.5;
      ctx.beginPath();
      ctx.arc(tower.x, tower.y, cellSize * 0.38, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Tower Visual & Animation by Type
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (tower.type === 'red_pen') {
        ctx.save();
        ctx.translate(tower.x, tower.y);
        ctx.rotate(tower.rotation);
        // Red Pen body
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(-4, -16, 8, 26);
        // Golden pen tip
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(-4, -16);
        ctx.lineTo(4, -16);
        ctx.lineTo(0, -23);
        ctx.fill();
        ctx.restore();
      } else if (tower.type === 'chalk_laser') {
        // Rainbow chalk crystal
        const colors = ['#f43f5e', '#eab308', '#06b6d4', '#a855f7'];
        const col = colors[Math.floor((Date.now() / 200) % colors.length)];
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(tower.x, tower.y, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = '13px sans-serif';
        ctx.fillText('✨', tower.x, tower.y);
      } else if (tower.type === 'blackboard_eraser') {
        // 🌿 舒壓精油按摩 (Aromatherapy Oil Massage)
        ctx.fillStyle = '#059669';
        ctx.beginPath();
        ctx.arc(tower.x, tower.y, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ecfdf5';
        ctx.font = '13px sans-serif';
        ctx.fillText('🌿', tower.x, tower.y);
      } else if (tower.type === 'coffee_machine') {
        // Coffee Machine
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.arc(tower.x, tower.y, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = '14px sans-serif';
        ctx.fillText('☕', tower.x, tower.y);
      } else if (tower.type === 'heart_bell') {
        // 🍬 舒喉潤喉糖 (Throat Lozenges)
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(tower.x, tower.y, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = '14px sans-serif';
        ctx.fillText('🍬', tower.x, tower.y);
      } else if (tower.type === 'smart_board') {
        // Smart Board
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(tower.x - 13, tower.y - 11, 26, 22);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(tower.x - 10, tower.y - 8, 20, 16);
        ctx.font = '11px sans-serif';
        ctx.fillText('⚡', tower.x, tower.y);
      } else if (tower.type === 'knowledge_beacon') {
        // 🌟 翻轉教育資源 (FlipEdu Resources Beacon)
        ctx.save();
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(tower.x, tower.y, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Innovation radiant pulse
        const wavePulse = (Date.now() % 1000) / 1000;
        ctx.strokeStyle = `rgba(234, 179, 8, ${1 - wavePulse})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(tower.x, tower.y, 14 + wavePulse * 10, 0, Math.PI * 2);
        ctx.stroke();

        ctx.font = '14px sans-serif';
        ctx.fillText('🌟', tower.x, tower.y);
        ctx.restore();
      } else if (tower.type === 'compassion_breeze') {
        // 春風關愛花園 (Spring Breeze Garden Greenhouse)
        ctx.save();
        ctx.fillStyle = '#fbcfe8'; // Soft pink circle
        ctx.beginPath();
        ctx.arc(tower.x, tower.y, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.font = '13px sans-serif';
        ctx.fillText('🌸', tower.x, tower.y);
        ctx.restore();
      } else if (tower.type === 'encouragement_megaphone') {
        // 讚美鼓勵大聲公 (Megaphone with Audio Waves)
        ctx.save();
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(tower.x, tower.y, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.font = '13px sans-serif';
        ctx.fillText('📢', tower.x, tower.y);
        ctx.restore();
      }

      // Level star/badge on tower
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(tower.x + 12, tower.y + 12, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText(`Lv${tower.level}`, tower.x + 12, tower.y + 12);

      // Silenced / Retreat Stamp effect (🈲 退件印章)
      if (tower.silencedUntil && Date.now() < tower.silencedUntil) {
        const remainingSec = Math.ceil((tower.silencedUntil - Date.now()) / 1000);
        ctx.fillStyle = 'rgba(220, 38, 38, 0.45)';
        ctx.beginPath();
        ctx.arc(tower.x, tower.y, cellSize * 0.45, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText('🈲', tower.x, tower.y - 4);
        ctx.font = 'bold 8.5px sans-serif';
        ctx.fillStyle = '#fef08a';
        ctx.fillText(`退件 ${remainingSec}s`, tower.x, tower.y + 10);
      }

      ctx.restore();
    });

    // 6.5 Draw All Buildable Cells Highlight when a tower is selected
    if (selectedBuildTowerType) {
      const towerEmoji =
        selectedBuildTowerType === 'red_pen'
          ? '🖊️'
          : selectedBuildTowerType === 'chalk_laser'
          ? '✨'
          : selectedBuildTowerType === 'blackboard_eraser'
          ? '🌿'
          : selectedBuildTowerType === 'heart_bell'
          ? '🍬'
          : '🌟';

      const pulseAlpha = 0.12 + Math.sin(Date.now() / 250) * 0.05;

      ctx.save();
      for (let c = 0; c < gridCols; c++) {
        for (let r = 0; r < gridRows; r++) {
          const isPath = isCellOnPath(mapData.path, c, r);
          const isOccupied = placedTowers.some(t => t.gridX === c && t.gridY === r);
          const isCoreBlocked = isCellNearPressureCore(mapData.endPoint, c, r);
          const isDecoration = mapData.decorations.some(d => d.x === c && d.y === r);

          if (!isPath && !isOccupied && !isCoreBlocked && !isDecoration) {
            const bx = c * cellSize;
            const by = r * cellSize;
            // Soft pulsing green aura
            ctx.fillStyle = `rgba(16, 185, 129, ${pulseAlpha})`;
            ctx.fillRect(bx + 2, by + 2, cellSize - 4, cellSize - 4);
            ctx.strokeStyle = `rgba(16, 185, 129, ${pulseAlpha * 3})`;
            ctx.lineWidth = 1;
            ctx.strokeRect(bx + 2, by + 2, cellSize - 4, cellSize - 4);

            // Faint preview emoji
            ctx.globalAlpha = 0.35;
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(towerEmoji, bx + cellSize / 2, by + cellSize / 2);
            ctx.globalAlpha = 1.0;
          }
        }
      }
      ctx.restore();
    }

    // 7. Draw Hovered Cell / Placement Ghost
    if (hoveredCell && selectedBuildTowerType) {
      const hx = hoveredCell.x * cellSize + cellSize / 2;
      const hy = hoveredCell.y * cellSize + cellSize / 2;
      const isPath = isCellOnPath(mapData.path, hoveredCell.x, hoveredCell.y);
      const isOccupied = placedTowers.some(t => t.gridX === hoveredCell.x && t.gridY === hoveredCell.y);
      const isCoreBlocked = isCellNearPressureCore(mapData.endPoint, hoveredCell.x, hoveredCell.y);
      const isDecoration = mapData.decorations.some(d => d.x === hoveredCell.x && d.y === hoveredCell.y);
      const isValid = !isPath && !isOccupied && !isCoreBlocked && !isDecoration && canAffordHoveredTower;

      const towerConfig = TOWER_CONFIGS[selectedBuildTowerType];
      const range = towerConfig ? towerConfig.range : 120;
      const towerEmoji =
        selectedBuildTowerType === 'red_pen'
          ? '🖊️'
          : selectedBuildTowerType === 'chalk_laser'
          ? '✨'
          : selectedBuildTowerType === 'blackboard_eraser'
          ? '🌿'
          : selectedBuildTowerType === 'heart_bell'
          ? '🍬'
          : '🌟';

      ctx.save();
      // Range circle preview
      ctx.fillStyle = isValid ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)';
      ctx.strokeStyle = isValid ? '#22c55e' : '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(hx, hy, range, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Ghost placement cell
      ctx.fillStyle = isValid ? 'rgba(34, 197, 94, 0.25)' : 'rgba(239, 68, 68, 0.25)';
      ctx.fillRect(hoveredCell.x * cellSize, hoveredCell.y * cellSize, cellSize, cellSize);
      ctx.strokeStyle = isValid ? '#16a34a' : '#dc2626';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.strokeRect(hoveredCell.x * cellSize, hoveredCell.y * cellSize, cellSize, cellSize);

      // Ghost tower preview icon
      if (isValid) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(hx, hy, cellSize * 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#16a34a';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(towerEmoji, hx, hy);
      } else {
        // Show prohibition mark
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🚫', hx, hy);
      }

      ctx.restore();
    }

    // 7.5 Draw Selected Cell Frame
    if (selectedCell) {
      const cx = selectedCell.x * cellSize;
      const cy = selectedCell.y * cellSize;
      ctx.save();
      ctx.fillStyle = 'rgba(245, 158, 11, 0.18)';
      ctx.fillRect(cx, cy, cellSize, cellSize);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(cx + 1, cy + 1, cellSize - 2, cellSize - 2);
      ctx.restore();
    }

    // 8. Draw Active Enemies
    enemies.forEach(enemy => {
      ctx.save();
      const isFrozen = Date.now() < enemy.frozenUntil;
      const isSlowed = Date.now() < enemy.slowedUntil;

      // Slow aura ripple
      if (isSlowed) {
        ctx.fillStyle = 'rgba(244, 63, 94, 0.2)';
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.size + 6, 0, Math.PI * 2);
        ctx.fill();
      }

      // Boss multi-phase visual aura
      if (enemy.isBoss) {
        const isEnraged = enemy.enraged || enemy.bossPhase === 2 || (enemy.currentHp / enemy.maxHp <= 0.5);
        if (isEnraged) {
          // Phase 2: Fiery Enraged Aura (smooth, warm glow)
          const glowPulse = Math.sin(Date.now() / 600) * 2.5;
          ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
          ctx.beginPath();
          ctx.arc(enemy.x, enemy.y, enemy.size + 12 + glowPulse, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(enemy.x, enemy.y, enemy.size + 10, 0, Math.PI * 2);
          ctx.stroke();

          // Fiery embers
          ctx.font = '11px sans-serif';
          ctx.fillText('🔥', enemy.x - 18, enemy.y - 18);
          ctx.fillText('⚡', enemy.x + 18, enemy.y - 18);
        } else {
          // Phase 1: Bureaucratic Shield Orbit
          const angle = Date.now() / 350;
          ctx.fillStyle = 'rgba(14, 165, 233, 0.18)';
          ctx.beginPath();
          ctx.arc(enemy.x, enemy.y, enemy.size + 12, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#0284c7';
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 4]);
          ctx.beginPath();
          ctx.arc(enemy.x, enemy.y, enemy.size + 12, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);

          // Orbiting paperwork
          for (let p = 0; p < 3; p++) {
            const paperAngle = angle + (p * Math.PI * 2) / 3;
            const px = enemy.x + Math.cos(paperAngle) * (enemy.size + 13);
            const py = enemy.y + Math.sin(paperAngle) * (enemy.size + 13);
            ctx.font = '10px sans-serif';
            ctx.fillText('📋', px, py);
          }
        }
      }

      // Draw Enemy Emoji / Avatar
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `${Math.floor(enemy.size * 1.3)}px sans-serif`;
      ctx.fillText(getEnemyEmoji(enemy.type), enemy.x, enemy.y);

      // Frozen Ice Block Overlay
      if (isFrozen) {
        ctx.fillStyle = 'rgba(186, 230, 253, 0.75)';
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 2;
        const boxSize = enemy.size * 1.6;
        ctx.fillRect(enemy.x - boxSize / 2, enemy.y - boxSize / 2, boxSize, boxSize);
        ctx.strokeRect(enemy.x - boxSize / 2, enemy.y - boxSize / 2, boxSize, boxSize);

        // Ice sparkle icon
        ctx.font = '12px sans-serif';
        ctx.fillText('❄️', enemy.x + boxSize / 3, enemy.y - boxSize / 3);
      }

      // Health Bar
      const barWidth = enemy.isBoss ? Math.max(70, enemy.size * 2.2) : Math.max(28, enemy.size * 1.5);
      const barHeight = enemy.isBoss ? 6 : 4;
      const hpPct = Math.max(0, Math.min(1, enemy.currentHp / enemy.maxHp));
      const barY = enemy.y - enemy.size - (enemy.isBoss ? 16 : 8);

      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.fillRect(enemy.x - barWidth / 2, barY, barWidth, barHeight);

      // Color based on HP
      const isBossEnraged = enemy.isBoss && (enemy.enraged || enemy.bossPhase === 2 || hpPct <= 0.5);
      ctx.fillStyle = isBossEnraged
        ? '#ef4444'
        : enemy.isBoss
        ? '#f59e0b'
        : hpPct > 0.5
        ? '#10b981'
        : hpPct > 0.25
        ? '#f59e0b'
        : '#ef4444';
      ctx.fillRect(enemy.x - barWidth / 2, barY, barWidth * hpPct, barHeight);

      // Boss Label & Phase Badge
      if (enemy.isBoss) {
        ctx.font = 'bold 10px sans-serif';
        ctx.fillStyle = isBossEnraged ? '#f87171' : '#fde047';
        let bossName = isBossEnraged ? '🔥【狂化暴走】大魔王' : '⚠️【第一階段】大魔王';
        if (enemy.type === 'school_affairs_meeting_boss') {
          bossName = isBossEnraged
            ? '🔥【濫訴護甲瓦解！】校事會議魔王'
            : '⚖️【濫訴護甲 60%】校事會議魔王 (用🔨回擊)';
        } else if (enemy.type === 'counseling_records_boss' || enemy.type === 'evaluation_boss') {
          bossName = isBossEnraged
            ? '🔥【狂化暴走】深淵輔導紀錄魔王'
            : '📑【第一階段】個案填報魔王';
        } else if (enemy.type === 'nihilism_boss') {
          bossName = isBossEnraged
            ? '🔥【暴走風暴】心靈荒漠之主'
            : '🪐【形式主義護甲】心靈荒漠之主';
        }
        ctx.fillText(bossName, enemy.x, barY - 7);
      }

      ctx.restore();
    });

    // 8.5 Draw Walking Teacher (🧑‍🏫 老師本人征途) - 穩定、清晰、高辨識度繪製
    if (teacher) {
      ctx.save();
      const isHurt = teacher.isHurt;
      const tX = teacher.x;
      const tY = teacher.y;

      // 1. 地面穩定陰影 (沉穩錨定在走廊，不晃動)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.beginPath();
      ctx.ellipse(tX, tY + 20, 20, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // 2. 老師保護光環底盤 (柔和金黃守護圈，受擊時溫和淡紅，完全不劇烈閃爍)
      ctx.fillStyle = isHurt ? 'rgba(239, 68, 68, 0.22)' : 'rgba(245, 158, 11, 0.15)';
      ctx.beginPath();
      ctx.arc(tX, tY, 24, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = isHurt ? '#ef4444' : '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(tX, tY, 24, 0, Math.PI * 2);
      ctx.stroke();

      // 3. 老師實體底座徽章 (純淨圓潤白底 + 深色邊框，讓老師頭像在任何地圖上都無比清晰)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(tX, tY, 19, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = isHurt ? '#dc2626' : '#0284c7';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // 4. 清晰穩定的「老師」大頭像 (固定大小與坐標，不跳動不晃爍)
      ctx.font = '26px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🧑‍🏫', tX, tY + 1);

      // 5. 清楚醒目的身份吊牌：【🧑‍🏫 老師本人 (保護對象)】
      const tagText = '🧑‍🏫 老師本人 (守護對象)';
      ctx.font = 'bold 10px sans-serif';
      const tagWidth = ctx.measureText(tagText).width + 12;
      const tagHeight = 18;
      const tagX = tX - tagWidth / 2;
      const tagY = tY - 46;

      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.roundRect
        ? ctx.roundRect(tagX, tagY, tagWidth, tagHeight, 9)
        : ctx.fillRect(tagX, tagY, tagWidth, tagHeight);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(tagText, tX, tagY + tagHeight / 2);

      // 6. 心靈血量條 (清晰橫條與數值)
      const barW = 56;
      const barH = 7;
      const hpPct = Math.max(0, Math.min(1, teacher.currentHp / teacher.maxHp));
      const barY = tY - 26;

      // 血條黑底外框
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.roundRect
        ? ctx.roundRect(tX - barW / 2 - 2, barY - 2, barW + 4, barH + 4, 5)
        : ctx.fillRect(tX - barW / 2 - 2, barY - 2, barW + 4, barH + 4);
      ctx.fill();

      // 血量綠/黃/紅條
      ctx.fillStyle = hpPct > 0.5 ? '#10b981' : hpPct > 0.25 ? '#f59e0b' : '#ef4444';
      ctx.roundRect
        ? ctx.roundRect(tX - barW / 2, barY, barW * hpPct, barH, 3)
        : ctx.fillRect(tX - barW / 2, barY, barW * hpPct, barH);
      ctx.fill();

      // 血量文字標記
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`❤️ ${Math.round(teacher.currentHp)}/${teacher.maxHp}`, tX, barY + barH / 2);

      // 7. 說話氣泡 (若有對話)
      if (teacher.saying) {
        ctx.font = 'bold 11px sans-serif';
        const textWidth = ctx.measureText(teacher.saying).width;
        const bubbleW = textWidth + 16;
        const bubbleH = 22;
        const bubbleX = tX - bubbleW / 2;
        const bubbleY = tagY - 26;

        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 1.5;
        ctx.roundRect
          ? ctx.roundRect(bubbleX, bubbleY, bubbleW, bubbleH, 6)
          : ctx.fillRect(bubbleX, bubbleY, bubbleW, bubbleH);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#0f172a';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(teacher.saying, tX, bubbleY + bubbleH / 2);
      }

      ctx.restore();
    }

    // 9. Draw Projectiles
    projectiles.forEach(proj => {
      ctx.save();
      if (proj.type === 'pen_mark') {
        // Red ink bullet with trail
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#b91c1c';
        ctx.lineWidth = 1;
        ctx.stroke();
      } else if (proj.type === 'laser') {
        // Continuous Rainbow Chalk Laser Beam
        ctx.strokeStyle = proj.color || '#ec4899';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(proj.x, proj.y);
        ctx.lineTo(proj.targetX, proj.targetY);
        ctx.stroke();

        // Inner glowing core
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else if (proj.type === 'shockwave') {
        // Chalk Dust Expanding Ring
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.7)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2);
        ctx.stroke();
      } else if (proj.type === 'sound_wave') {
        // Smart Board Chain Spark
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(proj.x, proj.y);
        ctx.lineTo(proj.targetX, proj.targetY);
        ctx.stroke();
      }
      ctx.restore();
    });

    // 10. Draw Particles
    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;

      if (p.shape === 'star') {
        ctx.font = `${p.size}px sans-serif`;
        ctx.fillText('⭐', p.x, p.y);
      } else if (p.shape === 'ice') {
        ctx.font = `${p.size}px sans-serif`;
        ctx.fillText('❄️', p.x, p.y);
      } else if (p.shape === 'flower') {
        ctx.font = `${p.size}px sans-serif`;
        ctx.fillText('🌸', p.x, p.y);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    // 11. Draw Damage Popups
    damagePopups.forEach(pop => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, pop.opacity);
      ctx.fillStyle = pop.color;
      ctx.font = pop.isCrit ? 'bold 15px sans-serif' : 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(pop.text, pop.x, pop.y);
      ctx.restore();
    });

    // 12. Full Screen Freeze Frost Effect when 「冰冰冰冰冰冰繃」 is active!
    if (isAllFrozen) {
      ctx.save();
      // Frosted crystalline border
      const grad = ctx.createRadialGradient(width / 2, height / 2, width * 0.25, width / 2, height / 2, width * 0.7);
      grad.addColorStop(0, 'rgba(186, 230, 253, 0.05)');
      grad.addColorStop(1, 'rgba(56, 189, 248, 0.28)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Frosty banner in center
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.roundRect ? ctx.roundRect(width / 2 - 180, 16, 360, 36, 18) : ctx.fillRect(width / 2 - 180, 16, 360, 36);
      ctx.fill();
      ctx.fillStyle = '#bae6fd';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('❄️ 冰冰冰冰冰冰繃！魔王全場急凍中（趁機設置教具）❄️', width / 2, 34);
      ctx.restore();
    }

    ctx.restore();
  }, [
    width,
    height,
    mapData,
    placedTowers,
    enemies,
    projectiles,
    particles,
    damagePopups,
    selectedTowerId,
    selectedBuildTowerType,
    hoveredCell,
    canAffordHoveredTower,
    isAllFrozen,
    teacher
  ]);

  // Click & hover interactions
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    // Direct aspect-ratio-accurate logical coordinate mapping
    const clickX = ((e.clientX - rect.left) / rect.width) * width;
    const clickY = ((e.clientY - rect.top) / rect.height) * height;

    const gridX = Math.floor(clickX / mapData.cellSize);
    const gridY = Math.floor(clickY / mapData.cellSize);

    // 1. Check if clicked directly on an existing tower (by cell coordinates OR proximity)
    const clickedTower = placedTowers.find(t =>
      (t.gridX === gridX && t.gridY === gridY) ||
      Math.hypot(t.x - clickX, t.y - clickY) <= mapData.cellSize * 0.55
    );

    if (clickedTower) {
      onTowerClick(clickedTower.id);
      return;
    }

    // 2. Otherwise, user clicked a cell on the grid
    if (gridX >= 0 && gridX < mapData.gridCols && gridY >= 0 && gridY < mapData.gridRows) {
      onCellClick(gridX, gridY);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const clickX = ((touch.clientX - rect.left) / rect.width) * width;
    const clickY = ((touch.clientY - rect.top) / rect.height) * height;

    const gridX = Math.floor(clickX / mapData.cellSize);
    const gridY = Math.floor(clickY / mapData.cellSize);

    const clickedTower = placedTowers.find(t =>
      (t.gridX === gridX && t.gridY === gridY) ||
      Math.hypot(t.x - clickX, t.y - clickY) <= mapData.cellSize * 0.55
    );

    if (clickedTower) {
      onTowerClick(clickedTower.id);
      return;
    }

    if (gridX >= 0 && gridX < mapData.gridCols && gridY >= 0 && gridY < mapData.gridRows) {
      onCellClick(gridX, gridY);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const mouseX = ((e.clientX - rect.left) / rect.width) * width;
    const mouseY = ((e.clientY - rect.top) / rect.height) * height;

    const gridX = Math.floor(mouseX / mapData.cellSize);
    const gridY = Math.floor(mouseY / mapData.cellSize);

    if (gridX >= 0 && gridX < mapData.gridCols && gridY >= 0 && gridY < mapData.gridRows) {
      onCellHover(gridX, gridY);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center w-full h-full p-1.5 sm:p-2 rounded-2xl bg-white shadow-xs border border-stone-200 overflow-hidden select-none"
    >
      <canvas
        id="td-game-canvas"
        ref={canvasRef}
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          width: 'auto',
          height: '100%',
          aspectRatio: `${width} / ${height}`,
          objectFit: 'contain'
        }}
        onClick={handleCanvasClick}
        onTouchStart={handleTouchStart}
        onMouseMove={handleMouseMove}
        onMouseLeave={onCellLeave}
        className="cursor-crosshair block rounded-xl shadow-inner select-none"
      />
    </div>
  );
};

function getEnemyEmoji(type: string): string {
  switch (type) {
    case 'homework':
      return '📚';
    case 'parent_call':
      return '📱';
    case 'bureaucracy':
      return '🗂️';
    case 'sleepy_bug':
      return '😴';
    case 'glitch_projector':
      return '📽️';
    case 'evaluation_boss':
    case 'counseling_records_boss':
      return '📑';
    case 'school_affairs_meeting_boss':
      return '⚖️';
    case 'ignorance':
      return '🌫️';
    case 'burnout':
      return '🥀';
    case 'prejudice':
      return '🗿';
    case 'anxiety':
      return '⚡';
    case 'nihilism_boss':
      return '🪐';
    default:
      return '👾';
  }
}
