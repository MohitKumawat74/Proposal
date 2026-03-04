'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const ReactConfetti = dynamic(() => import('react-confetti'), { ssr: false });

interface CelebrationSectionProps {
  name: string;
}

const BOUNCE_EMOJIS = ['❤️', '🥰', '💕', '🌸', '✨', '💫', '🌹', '💝'];

export default function CelebrationSection({ name }: CelebrationSectionProps) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [runConfetti, setRunConfetti] = useState(true);

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const onResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', onResize);

    // Stop recycling confetti after 8 s (pieces still fall off screen naturally)
    const timer = setTimeout(() => setRunConfetti(false), 8000);
    return () => {
      window.removeEventListener('resize', onResize);
      clearTimeout(timer);
    };
  }, []);

  return (
    <motion.section
      className="relative flex min-h-screen items-center justify-center px-4 py-16 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Confetti */}
      {windowSize.width > 0 && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={runConfetti}
          numberOfPieces={320}
          gravity={0.14}
          colors={['#ff69b4', '#ff1493', '#ffb6c1', '#ff6eb4', '#e91e8c', '#ffffff', '#ffcce5', '#c71585']}
          style={{ position: 'fixed', top: 0, left: 0, zIndex: 9990, pointerEvents: 'none' }}
        />
      )}

      {/* Soft pink radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 50% 50%, rgba(255,20,147,0.18) 0%, rgba(255,105,180,0.06) 55%, transparent 80%)',
        }}
      />

      {/* Card */}
      <motion.div
        className="glass-card relative rounded-3xl p-8 sm:p-14 w-full max-w-xl text-center z-10 overflow-hidden"
        style={{ background: 'rgba(255, 20, 147, 0.11)' }}
        initial={{ opacity: 0, scale: 0.6, rotate: -4 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 160, damping: 16, delay: 0.2 }}
      >
        {/* Inner glow ring */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{ boxShadow: 'inset 0 0 60px rgba(255,20,147,0.15)' }}
        />

        {/* Big heart */}
        <motion.div
          className="text-7xl sm:text-8xl mb-5 inline-block"
          animate={{
            scale: [1, 1.25, 1, 1.18, 1],
            rotate: [0, -8, 8, -4, 0],
          }}
          transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1 }}
          style={{ filter: 'drop-shadow(0 0 30px rgba(255,20,147,0.8))' }}
        >
          💖
        </motion.div>

        {/* Dynamic personalised headline */}
        <motion.h1
          className="gradient-text text-3xl sm:text-5xl font-bold mb-3 leading-tight"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.65 }}
        >
          {name}, you said YES ❤️
        </motion.h1>

        {/* Sub-message */}
        <motion.p
          className="text-pink-200/80 text-base sm:text-xl leading-relaxed mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75, duration: 0.6 }}
        >
          You just made me the happiest person alive! 🎉<br />
          I knew it — we are perfect together ✨
        </motion.p>

        {/* Bouncing emoji row */}
        <motion.div
          className="flex justify-center flex-wrap gap-2 sm:gap-3 text-3xl sm:text-4xl mb-8"
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0, type: 'spring', stiffness: 200 }}
        >
          {BOUNCE_EMOJIS.map((emoji, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -18, 0] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                delay: i * 0.14,
                ease: 'easeInOut',
              }}
            >
              {emoji}
            </motion.span>
          ))}
        </motion.div>

        {/* Romantic quote */}
        <motion.p
          className="text-pink-300/65 text-base sm:text-lg italic mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.7 }}
        >
          "And so, our love story begins... 🌹"
        </motion.p>

        {/* Datestamp */}
        <motion.p
          className="text-pink-400/40 text-xs sm:text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
        >
          — {name} &amp; Me · {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} 💌
        </motion.p>
      </motion.div>
    </motion.section>
  );
}