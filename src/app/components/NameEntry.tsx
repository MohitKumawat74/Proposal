'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface NameEntryProps {
  onSubmit: (name: string) => void;
}

export default function NameEntry({ onSubmit }: NameEntryProps) {
  const [name, setName] = useState('');
  const [shaking, setShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
      return;
    }
    onSubmit(name.trim());
  };

  return (
    <motion.section
      className="flex min-h-screen items-center justify-center px-4 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="glass-card rounded-3xl p-8 sm:p-12 w-full max-w-md text-center"
        initial={{ opacity: 0, scale: 0.88, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Icon */}
        <motion.div
          className="text-6xl mb-5 inline-block"
          animate={{ scale: [1, 1.15, 1], rotate: [0, -6, 6, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          style={{ filter: 'drop-shadow(0 0 20px rgba(255,20,147,0.6))' }}
        >
          🌸
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="gradient-text text-3xl sm:text-4xl font-bold mb-3 leading-tight"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Before I ask...
        </motion.h1>

        <motion.p
          className="text-pink-200/70 text-lg mb-8 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.6 }}
        >
          What should I call you? 💕
        </motion.p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <motion.input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter your name..."
            maxLength={24}
            autoFocus
            animate={shaking ? { x: [-8, 8, -8, 8, 0] } : { x: 0 }}
            transition={{ duration: 0.4 }}
            className={[
              'w-full bg-white/5 border rounded-xl px-5 py-3.5',
              'text-white text-center text-lg',
              'placeholder:text-pink-300/35',
              'focus:outline-none focus:ring-2 transition',
              shaking
                ? 'border-rose-500/80 focus:ring-rose-500/25'
                : 'border-pink-500/30 focus:border-pink-400 focus:ring-pink-500/20',
            ].join(' ')}
          />

          <motion.button
            type="submit"
            whileHover={{ scale: 1.04, boxShadow: '0 0 24px rgba(255,20,147,0.45)' }}
            whileTap={{ scale: 0.96 }}
            className="relative overflow-hidden bg-linear-to-r from-pink-600 to-rose-500 text-white font-semibold text-lg rounded-xl py-3.5 px-8 shadow-lg shadow-pink-500/30 transition"
          >
            <motion.span
              className="absolute inset-0 bg-white/10"
              initial={{ x: '-110%' }}
              whileHover={{ x: '110%' }}
              transition={{ duration: 0.4 }}
            />
            <span className="relative z-10">Continue ✨</span>
          </motion.button>
        </form>

        <p className="text-pink-400/30 text-xs mt-6 italic">
          I have something important to ask you...
        </p>
      </motion.div>
    </motion.section>
  );
}
