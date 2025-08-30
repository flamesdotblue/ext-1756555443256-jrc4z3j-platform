import React from 'react';

export default function HUD({ score, level, lines, next, status, onStart, onPause, onReset }) {
  return (
    <aside className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5">
      <h2 className="text-lg font-semibold">Dashboard</h2>
      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <Stat label="Score" value={score} />
        <Stat label="Level" value={level} />
        <Stat label="Lines" value={lines} />
      </div>

      <div className="mt-6">
        <p className="text-sm text-white/70">Next</p>
        <div className="mt-2 rounded-lg border border-white/10 bg-black p-3 w-40">
          <MiniPreview type={next?.type} shape={next?.shape} />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {status !== 'playing' && (
          <button onClick={onStart} className="px-4 py-2 rounded-md bg-fuchsia-500 hover:bg-fuchsia-400 text-black font-semibold">
            {status === 'over' ? 'Play Again' : 'Start'}
          </button>
        )}
        {status === 'playing' && (
          <button onClick={onPause} className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white">
            Pause
          </button>
        )}
        {status === 'paused' && (
          <button onClick={onPause} className="px-4 py-2 rounded-md bg-emerald-500 hover:bg-emerald-400 text-black font-semibold">
            Resume
          </button>
        )}
        <button onClick={onReset} className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white">
          Reset
        </button>
      </div>

      <div className="mt-6 text-xs text-white/70">
        <p className="font-semibold mb-2">Controls</p>
        <div className="flex flex-wrap items-center gap-2">
          <kbd className="px-2 py-1 rounded bg-white/10">←</kbd>
          <span>Left</span>
          <kbd className="px-2 py-1 rounded bg-white/10 ml-2">→</kbd>
          <span>Right</span>
          <kbd className="px-2 py-1 rounded bg-white/10 ml-2">↑</kbd>
          <span>Rotate</span>
          <kbd className="px-2 py-1 rounded bg-white/10 ml-2">↓</kbd>
          <span>Soft</span>
          <kbd className="px-2 py-1 rounded bg-white/10 ml-2">Space</kbd>
          <span>Hard</span>
          <kbd className="px-2 py-1 rounded bg-white/10 ml-2">P</kbd>
          <span>Pause</span>
        </div>
      </div>
    </aside>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg bg-white/5 border border-white/10 p-3">
      <div className="text-xs text-white/70">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}

function MiniPreview({ type, shape }) {
  const size = 4;
  const empty = Array.from({ length: size }, () => Array(size).fill(0));
  const grid = empty.map(r => r.slice());

  if (shape) {
    const offset = { x: 1, y: 1 };
    shape.forEach((row, y) =>
      row.forEach((v, x) => {
        if (v) grid[y + offset.y]?.splice(x + offset.x, 1, v);
      })
    );
  }

  const color = {
    I: 'bg-cyan-400',
    J: 'bg-blue-500',
    L: 'bg-amber-400',
    O: 'bg-yellow-300',
    S: 'bg-lime-400',
    T: 'bg-fuchsia-400',
    Z: 'bg-rose-500',
  }[type] || 'bg-white/10';

  return (
    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${size}, 14px)` }}>
      {grid.map((row, y) =>
        row.map((v, x) => (
          <div key={`${y}-${x}`} className={`w-3.5 h-3.5 ${v ? color : 'bg-white/5'} border border-black/40`} />
        ))
      )}
    </div>
  );
}
