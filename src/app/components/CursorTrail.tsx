'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Trail {
  id: number;
  x: number;
  y: number;
}

export default function CursorTrail() {
  const [cursor, setCursor] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState<Trail[]>([]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setCursor({ x: e.clientX, y: e.clientY });
      setTrail(prev => {
        const next = [...prev, { id: Date.now(), x: e.clientX, y: e.clientY }];
        return next.slice(-12);
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="fixed pointer-events-none z-[9999] select-none"
        animate={{ x: cursor.x - 12, y: cursor.y - 12 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{ fontSize: '24px' }}
      >
        🩷
      </motion.div>

      {/* Trail */}
      <AnimatePresence>
        {trail.map((point, i) => (
          <motion.div
            key={point.id}
            className="fixed pointer-events-none z-[9998] select-none"
            initial={{ opacity: 0.7, scale: 1 }}
            animate={{ opacity: 0, scale: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              left: point.x - 8,
              top: point.y - 8,
              fontSize: `${16 - i}px`,
            }}
          >
            ❤️
          </motion.div>
        ))}
      </AnimatePresence>
    </>
  );
}
