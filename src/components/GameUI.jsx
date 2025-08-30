import React from 'react';
import GameBoard from './GameBoard.jsx';
import HUD from './HUD.jsx';
import useTetris from './useTetris.js';

export default function GameUI() {
  const tetris = useTetris({ rows: 20, cols: 10 });

  return (
    <section id="play" className="relative py-14 md:py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-fuchsia-500/5 to-transparent pointer-events-none" />
      <div className="container mx-auto px-6 md:px-10 relative z-0">
        <div className="grid lg:grid-cols-[auto_320px] gap-6 md:gap-8 items-start">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 md:p-6">
            <GameBoard grid={tetris.grid} ghost={tetris.ghost} active={tetris.active} rows={tetris.rows} cols={tetris.cols} status={tetris.status} />
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/70">
              <kbd className="px-2 py-1 rounded bg-white/10">←</kbd>
              <span>Move Left</span>
              <kbd className="px-2 py-1 rounded bg-white/10 ml-3">→</kbd>
              <span>Move Right</span>
              <kbd className="px-2 py-1 rounded bg-white/10 ml-3">↑</kbd>
              <span>Rotate</span>
              <kbd className="px-2 py-1 rounded bg-white/10 ml-3">↓</kbd>
              <span>Soft Drop</span>
              <kbd className="px-2 py-1 rounded bg-white/10 ml-3">Space</kbd>
              <span>Hard Drop</span>
              <kbd className="px-2 py-1 rounded bg-white/10 ml-3">P</kbd>
              <span>Pause</span>
            </div>
          </div>
          <HUD
            score={tetris.score}
            level={tetris.level}
            lines={tetris.lines}
            next={tetris.next}
            status={tetris.status}
            onStart={tetris.start}
            onPause={tetris.togglePause}
            onReset={tetris.reset}
          />
        </div>
      </div>
    </section>
  );
}
