'use client';

import { useEffect, useRef } from 'react';
import { motion, type Variants, type Transition } from 'framer-motion';

export default function Hero() {
  const typewriterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;

    import('typewriter-effect/dist/core').then(mod => {
      if (!mounted || !typewriterRef.current) return;
      new mod.default(typewriterRef.current, {
        strings: [
          'I have something important to ask you... 🌸',
          'There is something on my heart... 💗',
          'Will you take a moment to read this? ✨',
        ],
        autoStart: true,
        loop: true,
        delay: 55,
        deleteSpeed: 30,
        cursor: '|',
        wrapperClassName: 'typewriter-wrapper',
        cursorClassName: 'typewriter-cursor',
      });
    });

    return () => { mounted = false; };
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.2 } as Transition,
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } as Transition },
  };

  return (
    <motion.section
      className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-20 pb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Decorative top line */}
      <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
        <div className="h-px w-16 bg-linear-to-r from-transparent to-pink-500" />
          <span className="text-pink-400 text-sm tracking-[0.3em] uppercase font-light">
            A Special Message
          </span>
          <div className="h-px w-16 bg-linear-to-l from-transparent to-pink-500" />
      </motion.div>

      {/* Big heart */}
      <motion.div
        variants={itemVariants}
        className="text-7xl mb-6 heartbeat"
        style={{ filter: 'drop-shadow(0 0 30px rgba(255,20,147,0.7))' }}
      >
        💝
      </motion.div>

      {/* Main heading */}
      <motion.h1
        variants={itemVariants}
        className="gradient-text text-5xl md:text-7xl font-bold mb-4 leading-tight"
      >
        Hey, Beautiful
      </motion.h1>

      {/* Typewriter text */}
      <motion.div
        variants={itemVariants}
        className="text-pink-200 text-xl md:text-2xl font-light min-h-12 mb-4"
        style={{ textShadow: '0 0 20px rgba(255,105,180,0.4)' }}
      >
        <div ref={typewriterRef} />
      </motion.div>

      {/* Subtitle */}
      <motion.p
        variants={itemVariants}
        className="text-pink-300/70 text-base md:text-lg max-w-xl leading-relaxed"
      >
        Scroll down to see what I have been meaning to tell you 💌
      </motion.p>

      {/* Scroll indicator */}
      <motion.div
        variants={itemVariants}
        className="mt-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
      >
        <div className="flex flex-col items-center gap-1 text-pink-400/60 text-sm">
          <span>scroll</span>
          <span className="text-lg">↓</span>
        </div>
      </motion.div>
    </motion.section>
  );
}
