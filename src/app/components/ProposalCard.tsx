'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── 30 funny NO messages ─────────────────────────────────────────────── */
const NO_MESSAGES: string[] = [
  "Are you really sure? 🥺",
  "Think again 😏",
  "Itni jaldi kya hai? 🤔",
  "System doesn't accept NO 😌",
  "Try pressing YES instead ❤️",
  "Yeh button kaam nahi karega 🚫",
  "Maine suna nahi... phir se? 😇",
  "Error 404: NO not found 🤖",
  "Ctrl+Z kar... undo kar yeh decision 😤",
  "Shayad galti se click ho gaya? 🙈",
  "Tumse na ho payega 😎",
  "Ek baar aur soch lo 💭",
  "Dil ne kya kaha? ❤️",
  "Yeh button sirf decor ke liye hai 🎨",
  "Kidding right? 😂",
  "Server refused to process NO 🛑",
  "Main wait karunga... take your time 🕰️",
  "Are you testing me? 😏",
  "Zara dil se poochho 💞",
  "Galat button dabaya toh lagta hai 🤭",
  "Hmm... suspicious 🕵️",
  "Retry karo... achha wala button dabaao ☺️",
  "I am not going anywhere 🥰",
  "This button has trust issues now 💔",
  "Try the red heart button instead 😘",
  "Sach batao... dil kya kehta hai? 🌹",
  "Cursor bhi confused hai abhi 😅",
  "Dil + Dimag = YES ❤️",
  "Maine maana nahi 😌",
  "One more chance, please? 🫶",
];

function getNoMessage(count: number, lastIdx: number): { msg: string; idx: number } {
  if (count <= NO_MESSAGES.length) {
    return { msg: NO_MESSAGES[count - 1], idx: count - 1 };
  }
  let idx: number;
  do { idx = Math.floor(Math.random() * NO_MESSAGES.length); }
  while (idx === lastIdx);
  return { msg: NO_MESSAGES[idx], idx };
}

/* ─── Props ─────────────────────────────────────────────────────────────── */
interface ProposalCardProps {
  name: string;
  onYes: () => void;
}

/* ─── Component ─────────────────────────────────────────────────────────── */
export default function ProposalCard({ name, onYes }: ProposalCardProps) {
  const [noCount, setNoCount]       = useState(0);
  const [currentMsg, setCurrentMsg] = useState('');
  const [lastMsgIdx, setLastMsgIdx] = useState(-1);
  const [noMoved, setNoMoved]       = useState(false);
  const [noPos, setNoPos]           = useState({ x: 0, y: 0 });
  const [loading, setLoading]       = useState(false);
  const [apiError, setApiError]     = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const noButtonRef  = useRef<HTMLButtonElement>(null);

  const moveNoButton = useCallback(() => {
    const container = containerRef.current;
    const btn       = noButtonRef.current;
    if (!container || !btn) return;

    const cRect = container.getBoundingClientRect();
    const bRect = btn.getBoundingClientRect();
    const pad   = 8;
    const maxX  = Math.max(0, cRect.width  - bRect.width  - pad * 2);
    const maxY  = Math.max(0, cRect.height - bRect.height - pad * 2);

    setNoMoved(true);
    setNoPos({ x: pad + Math.random() * maxX, y: pad + Math.random() * maxY });

    const { msg, idx } = getNoMessage(noCount + 1, lastMsgIdx);
    setCurrentMsg(msg);
    setLastMsgIdx(idx);
    setNoCount(c => c + 1);
  }, [noCount, lastMsgIdx]);

  const noScale = Math.max(0.55, 1 - noCount * 0.03);
  const noLabel =
    noCount === 0  ? 'NO 😈'        :
    noCount < 4    ? 'Still NO 🙅'  :
    noCount < 8    ? '...NO 😒'     :
    noCount < 14   ? 'n—NO 🥺'      : 'Nope 🫠';

  const handleYes = async () => {
    setLoading(true);
    setApiError('');
    try {
      const res = await fetch('/api/proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? 'Something went wrong.');
      }
      onYes();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Something went wrong.');
      setLoading(false);
    }
  };

  return (
    <motion.section
      className="flex min-h-screen items-center justify-center px-4 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="glass-card rounded-3xl p-8 sm:p-12 w-full max-w-lg text-center"
        initial={{ opacity: 0, scale: 0.88, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Ring emoji */}
        <motion.div
          className="text-6xl mb-5 inline-block"
          animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          style={{ filter: 'drop-shadow(0 0 24px rgba(255,20,147,0.7))' }}
        >
          💍
        </motion.div>

        {/* Personalised heading */}
        <motion.h1
          className="gradient-text text-3xl sm:text-4xl font-bold mb-4 leading-tight"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          Hey {name},
        </motion.h1>

        {/* Romantic body */}
        <motion.div
          className="space-y-2 text-pink-200/80 text-base sm:text-lg leading-relaxed mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <p>Every moment with you feels like a dream ✨</p>
          <p>You make my world brighter just by being in it 🌙</p>
          <p>I want to hold your hand and be there for you, always 💞</p>
        </motion.div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-linear-to-r from-transparent via-pink-500/60 to-transparent" />
          <span className="text-xl">💌</span>
          <div className="flex-1 h-px bg-linear-to-l from-transparent via-pink-500/60 to-transparent" />
        </div>

        {/* The question */}
        <motion.h2
          className="glow-text gradient-text text-2xl sm:text-3xl font-bold mb-6"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
        >
          Will you be my girlfriend? 💝
        </motion.h2>

        {/* API error */}
        <AnimatePresence mode="wait">
          {apiError && (
            <motion.p
              key="api-error"
              className="text-rose-400/90 text-sm italic mb-3 px-2"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              ⚠️ {apiError}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Funny reply */}
        <AnimatePresence mode="wait">
          {currentMsg && (
            <motion.p
              key={String(noCount)}
              className="text-pink-300/80 text-sm sm:text-base italic mb-5 px-2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              {currentMsg}
            </motion.p>
          )}
        </AnimatePresence>

        {/*
          Button container — relative with fixed minimum height so the NO
          button has a safe area to roam (works on mobile too).
        */}
        <div
          ref={containerRef}
          className="relative w-full mx-auto overflow-hidden rounded-2xl"
          style={{ minHeight: noMoved ? 180 : 68 }}
        >
          {/* YES always visible and centered */}
          <div className={noMoved ? 'flex justify-center pt-2' : 'flex justify-center gap-4 items-center'}>
            <motion.button
              onClick={handleYes}
              disabled={loading}
              whileHover={loading ? {} : { scale: 1.08, boxShadow: '0 0 32px rgba(255,20,147,0.6)' }}
              whileTap={loading ? {} : { scale: 0.95 }}
              className="relative overflow-hidden bg-linear-to-r from-pink-500 via-rose-500 to-pink-600 text-white font-bold text-xl rounded-2xl px-10 py-4 shadow-xl shadow-pink-500/40 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <motion.span
                className="absolute inset-0 bg-white/10"
                initial={{ x: '-110%' }}
                whileHover={loading ? {} : { x: '110%' }}
                transition={{ duration: 0.4 }}
              />
              <span className="relative z-10 flex items-center gap-2">
                {loading ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                      className="inline-block"
                    >
                      💫
                    </motion.span>
                    Sending...
                  </>
                ) : (
                  'YES ❤️'
                )}
              </span>
            </motion.button>

            {/* NO — inline before first hover */}
            {!noMoved && (
              <motion.button
                ref={noButtonRef}
                onMouseEnter={moveNoButton}
                onTouchStart={moveNoButton}
                className="text-pink-300/50 font-medium text-base rounded-2xl px-6 py-4 border border-pink-500/15 bg-white/5 cursor-not-allowed"
              >
                {noLabel}
              </motion.button>
            )}
          </div>

          {/* NO — absolutely positioned after first escape */}
          {noMoved && (
            <motion.button
              ref={noButtonRef}
              onMouseEnter={moveNoButton}
              onTouchStart={moveNoButton}
              animate={{ x: noPos.x, y: noPos.y, scale: noScale }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              className="absolute top-0 left-0 text-pink-300/45 font-medium text-sm rounded-2xl px-4 py-3 border border-pink-500/10 bg-white/5 cursor-not-allowed whitespace-nowrap"
            >
              {noLabel}
            </motion.button>
          )}
        </div>

        <p className="text-pink-400/25 text-xs mt-5 italic">
          (The NO button has its own feelings about that choice 😅)
        </p>
      </motion.div>
    </motion.section>
  );
}