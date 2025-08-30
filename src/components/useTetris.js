import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const SHAPES = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
};

const TYPES = Object.keys(SHAPES);

function rotateMatrix(m) {
  const N = m.length;
  const res = Array.from({ length: N }, () => Array(N).fill(0));
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      res[x][N - 1 - y] = m[y][x];
    }
  }
  return res;
}

function randomType() {
  return TYPES[Math.floor(Math.random() * TYPES.length)];
}

function createGrid(rows, cols) {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => ''));
}

function pieceFor(type) {
  const shape = SHAPES[type].map(r => r.slice());
  return { type, shape, pos: { x: 3, y: -2 } };
}

export default function useTetris({ rows = 20, cols = 10 } = {}) {
  const [grid, setGrid] = useState(() => createGrid(rows, cols));
  const [active, setActive] = useState(null);
  const [next, setNext] = useState(() => {
    const t = randomType();
    return { type: t, shape: SHAPES[t] };
  });
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [status, setStatus] = useState('idle'); // idle | playing | paused | over

  const dropIntervalRef = useRef(null);

  const spawn = useCallback(() => {
    const piece = pieceFor(next.type);
    setNext(() => {
      const t = randomType();
      return { type: t, shape: SHAPES[t] };
    });
    setActive(piece);
    if (collides(grid, piece.shape, piece.pos)) {
      setStatus('over');
    }
  }, [grid, next]);

  const reset = useCallback(() => {
    setGrid(createGrid(rows, cols));
    setActive(null);
    setScore(0);
    setLines(0);
    setLevel(1);
    setStatus('idle');
  }, [rows, cols]);

  const start = useCallback(() => {
    if (status === 'playing') return;
    setGrid(createGrid(rows, cols));
    setScore(0);
    setLines(0);
    setLevel(1);
    setStatus('playing');
    setActive(null);
  }, [rows, cols, status]);

  const togglePause = useCallback(() => {
    setStatus(s => (s === 'playing' ? 'paused' : s === 'paused' ? 'playing' : s));
  }, []);

  function collides(g, shape, pos) {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (!shape[y][x]) continue;
        const gx = pos.x + x;
        const gy = pos.y + y;
        if (gx < 0 || gx >= cols || gy >= rows) return true;
        if (gy >= 0 && g[gy][gx]) return true;
      }
    }
    return false;
  }

  const lockPiece = useCallback(() => {
    if (!active) return;
    setGrid(prev => {
      const g = prev.map(r => r.slice());
      active.shape.forEach((row, y) =>
        row.forEach((v, x) => {
          if (v) {
            const gy = active.pos.y + y;
            const gx = active.pos.x + x;
            if (gy >= 0) g[gy][gx] = active.type;
          }
        })
      );
      return g;
    });
  }, [active]);

  const clearLines = useCallback(() => {
    setGrid(prev => {
      const g = prev.map(r => r.slice());
      let cleared = 0;
      for (let y = g.length - 1; y >= 0; y--) {
        if (g[y].every(cell => cell)) {
          g.splice(y, 1);
          g.unshift(Array.from({ length: cols }, () => ''));
          cleared++;
          y++;
        }
      }
      if (cleared) {
        setLines(l => l + cleared);
        const add = [0, 40, 100, 300, 1200][cleared] || 0; // classic Tetris scoring
        setScore(s => s + add * level);
        setLevel(lv => Math.min(20, 1 + Math.floor((lines + cleared) / 10)));
      }
      return g;
    });
  }, [cols, level, lines]);

  const hardDrop = useCallback(() => {
    if (!active || status !== 'playing') return;
    let pos = { ...active.pos };
    while (!collides(grid, active.shape, { x: pos.x, y: pos.y + 1 })) {
      pos.y++;
    }
    setActive(a => (a ? { ...a, pos } : a));
    lockPiece();
    clearLines();
    spawn();
    setScore(s => s + 2); // small reward for hard drop
  }, [active, status, grid, lockPiece, clearLines, spawn]);

  const softDrop = useCallback(() => {
    if (!active || status !== 'playing') return;
    const nextPos = { x: active.pos.x, y: active.pos.y + 1 };
    if (!collides(grid, active.shape, nextPos)) {
      setActive(a => ({ ...a, pos: nextPos }));
      setScore(s => s + 1);
    } else {
      lockPiece();
      clearLines();
      spawn();
    }
  }, [active, status, grid, lockPiece, clearLines, spawn]);

  const move = useCallback(
    dir => {
      if (!active || status !== 'playing') return;
      const nextPos = { x: active.pos.x + dir, y: active.pos.y };
      if (!collides(grid, active.shape, nextPos)) {
        setActive(a => ({ ...a, pos: nextPos }));
      }
    },
    [active, status, grid]
  );

  const rotate = useCallback(() => {
    if (!active || status !== 'playing') return;
    const nextShape = rotateMatrix(active.shape);
    const kicks = [0, -1, 1, -2, 2];
    for (const dx of kicks) {
      const nextPos = { x: active.pos.x + dx, y: active.pos.y };
      if (!collides(grid, nextShape, nextPos)) {
        setActive(a => ({ ...a, shape: nextShape, pos: nextPos }));
        break;
      }
    }
  }, [active, status, grid]);

  const ghost = useMemo(() => {
    if (!active) return null;
    let y = active.pos.y;
    while (!collides(grid, active.shape, { x: active.pos.x, y: y + 1 })) y++;
    return { shape: active.shape, pos: { x: active.pos.x, y }, type: active.type };
  }, [active, grid]);

  // Interval management
  useEffect(() => {
    if (status !== 'playing') {
      clearInterval(dropIntervalRef.current);
      dropIntervalRef.current = null;
      return;
    }
    const speed = Math.max(100, 800 - (level - 1) * 60); // accelerate with level
    dropIntervalRef.current = setInterval(() => {
      softDrop();
    }, speed);
    return () => {
      clearInterval(dropIntervalRef.current);
      dropIntervalRef.current = null;
    };
  }, [status, level, softDrop]);

  // Spawn first piece on start or after reset to playing
  useEffect(() => {
    if (status === 'playing' && !active) {
      spawn();
    }
  }, [status, active, spawn]);

  // Keyboard controls
  useEffect(() => {
    function onKey(e) {
      if (e.code === 'KeyP') {
        e.preventDefault();
        togglePause();
        return;
      }
      if (status !== 'playing') return;
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space'].includes(e.code)) e.preventDefault();
      switch (e.code) {
        case 'ArrowLeft':
          move(-1); break;
        case 'ArrowRight':
          move(1); break;
        case 'ArrowUp':
          rotate(); break;
        case 'ArrowDown':
          softDrop(); break;
        case 'Space':
          hardDrop(); break;
        default:
          break;
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [status, move, rotate, softDrop, hardDrop, togglePause]);

  return {
    rows,
    cols,
    grid,
    active,
    ghost,
    next,
    score,
    lines,
    level,
    status,
    start,
    togglePause,
    reset,
  };
}
