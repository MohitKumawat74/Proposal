'use client';

import { useEffect, useState } from 'react';
import ReactConfetti from 'react-confetti';

export default function ConfettiEffect() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [run, setRun] = useState(true);

  useEffect(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight });

    const onResize = () =>
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', onResize);

    // Stop after 8 seconds
    const timer = setTimeout(() => setRun(false), 8000);

    return () => {
      window.removeEventListener('resize', onResize);
      clearTimeout(timer);
    };
  }, []);

  return (
    <ReactConfetti
      width={dimensions.width}
      height={dimensions.height}
      recycle={run}
      numberOfPieces={300}
      gravity={0.15}
      colors={['#ff69b4', '#ff1493', '#ffb6c1', '#ff6eb4', '#e91e8c', '#fff', '#ffcce5', '#c71585']}
      confettiSource={{ x: 0, y: 0, w: dimensions.width, h: 0 }}
      style={{ zIndex: 9990, position: 'fixed', top: 0, left: 0 }}
    />
  );
}
