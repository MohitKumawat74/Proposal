'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Heart {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  emoji: string;
}

const EMOJIS = ['❤️', '🩷', '💗', '💓', '💖', '💝', '💘', '🌸', '✨', '💫'];

export default function FloatingHearts() {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    // Create initial batch
    const initial: Heart[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 24 + 10,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 5,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    }));
    setHearts(initial);

    // Continuously add new hearts
    const interval = setInterval(() => {
      setHearts(prev => {
        const newHeart: Heart = {
          id: Date.now(),
          x: Math.random() * 100,
          size: Math.random() * 28 + 8,
          duration: Math.random() * 8 + 5,
          delay: 0,
          emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        };
        // Keep a max of 35 hearts
        return [...prev.slice(-34), newHeart];
      });
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <AnimatePresence>
        {hearts.map(heart => (
          <motion.div
            key={heart.id}
            className="absolute select-none"
            initial={{ y: '110vh', opacity: 0, scale: 0 }}
            animate={{
              y: '-10vh',
              opacity: [0, 1, 1, 0],
              scale: [0, 1, 1, 0.5],
              x: [0, Math.random() * 60 - 30, Math.random() * 60 - 30, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: heart.duration,
              delay: heart.delay,
              ease: 'easeInOut',
              times: [0, 0.1, 0.8, 1],
            }}
            style={{
              left: `${heart.x}%`,
              fontSize: `${heart.size}px`,
              filter: 'drop-shadow(0 0 6px rgba(255,105,180,0.6))',
            }}
          >
            {heart.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
