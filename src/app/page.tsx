'use client';

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';

import FloatingHearts from './components/FloatingHearts';
import CursorTrail from './components/CursorTrail';
import NameEntry from './components/NameEntry';
import Hero from './components/Hero';
import ProposalCard from './components/ProposalCard';
import CelebrationSection from './components/CelebrationSection';

type Phase = 'name' | 'proposal' | 'celebration';

export default function Home() {
  const [phase, setPhase] = useState<Phase>('name');
  const [name, setName] = useState('');
  const _scrolledToTopRef = useRef(false);

  useEffect(() => {
    // Ensure the page is at the top the first time the name phase is shown
    if (phase === 'name' && !_scrolledToTopRef.current) {
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'auto' });
        // additional resets for some browsers
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
      _scrolledToTopRef.current = true;
    }
  }, [phase]);

  const handleNameSubmit = (submittedName: string) => {
    setName(submittedName);
    setPhase('proposal');
  };

  const handleYes = () => {
    setPhase('celebration');
  };

  return (
    <div className="animated-bg relative min-h-screen overflow-x-hidden">
      {/* Always-on background layers */}
      <FloatingHearts />
      <CursorTrail />

      {/* Subtle centre glow */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(255,20,147,0.08) 0%, transparent 70%)',
        }}
      />

      {/* Phase router */}
      <main className="relative z-10 min-h-screen flex flex-col">
        <AnimatePresence mode="wait">
          {phase === 'name' && (
              <>
                <Hero key="hero" />
                <NameEntry key="name" onSubmit={handleNameSubmit} />
              </>
            )}

          {phase === 'proposal' && (
            <ProposalCard key="proposal" name={name} onYes={handleYes} />
          )}

          {phase === 'celebration' && (
            <CelebrationSection key="celebration" name={name} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

