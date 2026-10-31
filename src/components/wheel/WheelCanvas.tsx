import { useEffect, useRef } from 'react';
import type { Recipe } from '../../types';
import { cn } from '../../lib/cn';

const SIZE = 720;
const CENTER = SIZE / 2;
const RADIUS = 326;

const SECTOR_COLORS = [
  '#ffe3ec',
  '#fff1dc',
  '#eee5ff',
  '#e0f5ed',
  '#ffe0d6',
  '#e6f1ff',
  '#ffe9f3',
  '#f3e8ff',
  '#fff4d9',
  '#e6f7f0',
];

const TEXT_COLOR = '#5b3b45';

function splitLabel(name: string): string[] {
  const chars = Array.from(name);
  if (chars.length <= 7) return [name];
  const middle = Math.ceil(chars.length / 2);
  return [chars.slice(0, middle).join(''), chars.slice(middle).join('')];
}

interface WheelCanvasProps {
  recipes: Recipe[];
  rotation: number;
  spinning: boolean;
  durationMs: number;
  onSpinEnd: () => void;
  className?: string;
}

/**
 * Draws the wheel once and animates it with CSS transform. Using CSS makes the
 * 4-second spin smooth without re-rendering React 60 times per second.
 */
export function WheelCanvas({
  recipes,
  rotation,
  spinning,
  durationMs,
  onSpinEnd,
  className,
}: WheelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, SIZE, SIZE);
    const count = recipes.length;

    if (count === 0) return;

    const angle = (Math.PI * 2) / count;

    ctx.save();
    ctx.translate(CENTER, CENTER);

    // Pastel sectors with white separators.
    for (let index = 0; index < count; index += 1) {
      const start = -Math.PI / 2 + index * angle;
      const end = start + angle;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, RADIUS, start, end);
      ctx.closePath();
      ctx.fillStyle = SECTOR_COLORS[index % SECTOR_COLORS.length];
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.92)';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Dish names follow the radius, like a traditional wheel.
    for (let index = 0; index < count; index += 1) {
      const middle = -Math.PI / 2 + (index + 0.5) * angle;
      const label = splitLabel(recipes[index].name);

      ctx.save();
      ctx.rotate(middle);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = TEXT_COLOR;
      ctx.font = '600 24px -apple-system, "PingFang SC", "Noto Sans SC", sans-serif';
      label.forEach((line, lineIndex) => {
        const offset = (lineIndex - (label.length - 1) / 2) * 28;
        ctx.fillText(line, RADIUS - 34, offset);
      });
      ctx.restore();
    }

    // Pearls around the rim.
    ctx.beginPath();
    ctx.arc(0, 0, RADIUS + 9, 0, Math.PI * 2);
    ctx.strokeStyle = '#fffdf9';
    ctx.lineWidth = 18;
    ctx.stroke();

    for (let index = 0; index < count; index += 1) {
      const pointAngle = -Math.PI / 2 + index * angle;
      const px = Math.cos(pointAngle) * (RADIUS + 9);
      const py = Math.sin(pointAngle) * (RADIUS + 9);
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#f8cfdd';
      ctx.fill();
    }

    // Centre hub.
    ctx.shadowColor = 'rgba(163, 45, 83, 0.28)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 6;
    ctx.beginPath();
    ctx.arc(0, 0, 78, 0, Math.PI * 2);
    ctx.fillStyle = '#fffdf9';
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    const hub = ctx.createLinearGradient(-50, -50, 50, 50);
    hub.addColorStop(0, '#ff9ab7');
    hub.addColorStop(1, '#df527c');
    ctx.beginPath();
    ctx.arc(0, 0, 64, 0, Math.PI * 2);
    ctx.fillStyle = hub;
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '700 34px -apple-system, "PingFang SC", "Noto Sans SC", sans-serif';
    ctx.fillText('转', 0, 2);

    ctx.restore();
  }, [recipes]);

  return (
    <canvas
      ref={canvasRef}
      width={SIZE}
      height={SIZE}
      role="img"
      aria-label={recipes.length > 0 ? '今天吃什么转盘' : '转盘暂无可用菜谱'}
      onTransitionEnd={(event) => {
        if (event.propertyName === 'transform') onSpinEnd();
      }}
      className={cn(
        'h-full w-full rounded-full bg-white shadow-[0_24px_60px_-28px_rgba(163,45,83,0.5)]',
        'will-change-transform',
        className,
      )}
      style={{
        transform: `rotate(${rotation}deg)`,
        transition: spinning
          ? `transform ${durationMs}ms cubic-bezier(0.12, 0.72, 0.16, 1)`
          : 'none',
      }}
    />
  );
}
