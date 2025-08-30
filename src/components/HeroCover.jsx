import React from 'react';
import Spline from '@splinetool/react-spline';

export default function HeroCover() {
  return (
    <section className="relative w-full h-[80vh] md:h-[90vh] overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/OIGfFUmCnZ3VD8gH/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/90" />

      <div className="relative h-full container mx-auto px-6 md:px-10 flex items-center">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
            NeoTetris
            <span className="block text-fuchsia-400">Arcade re-imagined</span>
          </h1>
          <p className="mt-4 md:mt-6 text-base md:text-lg text-white/80">
            A playful, retro-inspired Tetris with a modern UI, buttery animations, and a living 3D backdrop.
          </p>
          <div className="mt-8 flex gap-3">
            <a href="#play" className="inline-flex items-center gap-2 rounded-full bg-fuchsia-500 hover:bg-fuchsia-400 active:bg-fuchsia-600 text-black font-semibold px-6 py-3 transition-colors">
              Play Now
            </a>
            <a href="#features" className="inline-flex items-center gap-2 rounded-full border border-white/20 hover:border-white/40 text-white/90 font-medium px-6 py-3 transition-colors">
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
