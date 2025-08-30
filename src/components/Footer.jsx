import React from 'react';

export default function Footer() {
  return (
    <footer className="relative mt-16">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-fuchsia-500/10 to-transparent" />
      <div className="container mx-auto px-6 md:px-10 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-white/70 text-sm">
          <p>NeoTetris — an innovative spin on a timeless classic.</p>
          <p>Built with React, Vite, and Tailwind.</p>
        </div>
      </div>
    </footer>
  );
}
