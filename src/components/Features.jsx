import React from 'react';

export default function Features() {
  const items = [
    {
      title: 'Reactive Gameplay',
      desc: 'Snappy controls, smooth fall speeds, and satisfying line clears with particle accents.',
    },
    {
      title: 'Adaptive Difficulty',
      desc: 'Level up as you clear lines; the game subtly accelerates to keep you in the zone.',
    },
    {
      title: 'Modern Visuals',
      desc: 'Vivid gradients, glass panels, and a 3D arcade-inspired hero scene set the mood.',
    },
  ];

  return (
    <section id="features" className="container mx-auto px-6 md:px-10 py-14 md:py-20">
      <div className="grid md:grid-cols-3 gap-6 md:gap-8">
        {items.map((f, i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <h3 className="text-xl font-semibold">{f.title}</h3>
            <p className="mt-2 text-white/75 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
