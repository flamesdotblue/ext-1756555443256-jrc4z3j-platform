import React from 'react';
import HeroCover from './components/HeroCover.jsx';
import Features from './components/Features.jsx';
import GameUI from './components/GameUI.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-fuchsia-500/30 selection:text-white">
      <HeroCover />
      <main className="relative z-0">
        <Features />
        <GameUI />
      </main>
      <Footer />
    </div>
  );
}
