import React, { useMemo } from 'react';

const COLORS = {
  I: 'bg-cyan-400',
  J: 'bg-blue-500',
  L: 'bg-amber-400',
  O: 'bg-yellow-300',
  S: 'bg-lime-400',
  T: 'bg-fuchsia-400',
  Z: 'bg-rose-500',
  GHOST: 'bg-white/10',
  EMPTY: 'bg-white/5',
};

export default function GameBoard({ grid, ghost, active, rows, cols, status }) {
  const mergedGrid = useMemo(() => {
    const g = grid.map(r => r.slice());
    if (ghost) {
      ghost.shape.forEach((row, y) =>
        row.forEach((v, x) => {
          if (v) {
            const gy = y + ghost.pos.y;
            const gx = x + ghost.pos.x;
            if (gy >= 0 && gy < rows && gx >= 0 && gx < cols && g[gy][gx] === '') {
              g[gy][gx] = 'GHOST';
            }
          }
        })
      );
    }
    if (active) {
      active.shape.forEach((row, y) =>
        row.forEach((v, x) => {
          if (v) {
            const ay = y + active.pos.y;
            const ax = x + active.pos.x;
            if (ay >= 0 && ay < rows && ax >= 0 && ax < cols) {
              g[ay][ax] = active.type;
            }
          }
        })
      );
    }
    return g;
  }, [grid, ghost, active, rows, cols]);

  return (
    <div className="w-full">
      <div className="relative mx-auto" style={{ width: 'min(90vw, 420px)' }}>
        <div className="rounded-xl overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.08)_inset,0_8px_40px_rgba(249,115,255,0.2)]">
          <div
            className="grid bg-black"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
            {mergedGrid.map((row, y) =>
              row.map((cell, x) => {
                const key = `${y}-${x}`;
                const colorClass = cell ? COLORS[cell] || COLORS.EMPTY : COLORS.EMPTY;
                return (
                  <div
                    key={key}
                    className={`aspect-square ${colorClass} border border-black/40 relative`}
                  >
                    <span className="absolute inset-0 bg-white/10 mix-blend-overlay opacity-0 hover:opacity-10 transition-opacity" />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      {status !== 'playing' && (
        <div className="mt-4 text-center text-white/80 text-sm">
          {status === 'idle' && 'Press Start to play'}
          {status === 'paused' && 'Paused'}
          {status === 'over' && 'Game Over'}
        </div>
      )}
    </div>
  );
}
