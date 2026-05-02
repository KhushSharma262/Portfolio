'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Hero.module.scss';

const API = 'https://khushsharma262-portfolio-rag.hf.space';

function TypingIndicator() {
  return (
    <div className={styles.typingIndicator}>
      <span /><span /><span />
    </div>
  );
}

function ChatBubble({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <motion.div
      className={`${styles.bubble} ${isUser ? styles.userBubble : styles.botBubble}`}
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {!isUser && <div className={styles.avatar}>K</div>}
      <div className={styles.bubbleText}>{msg.content}</div>
    </motion.div>
  );
}

export default function Hero() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionState, setSessionState] = useState({});
  const [started, setStarted] = useState(false);
  const [booted, setBooted] = useState(false);
  const bottomRef = useRef(null);
  const canvasRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const particles = Array.from({ length: 90 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.4, alpha: Math.random() * 0.5 + 0.1,
    }));
    const D = 130;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139,92,246,${p.alpha})`;
        ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.sqrt(dx*dx+dy*dy);
          if (dist < D) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(139,92,246,${0.12*(1-dist/D)})`;
            ctx.lineWidth = 0.6; ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    }
    draw();
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize); };
  }, []);

  async function sendMessage(text) {
    const trimmed = (text || input).trim();
    if (!trimmed || loading) return;
    const isInit = trimmed === '__init__';
    if (!isInit) { setInput(''); setStarted(true); setMessages(prev => [...prev, { role: 'user', content: trimmed }]); }
    setLoading(true);
    try {
      const res = await fetch(`${API}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: isInit ? "hi" : trimmed, greeted: sessionState.greeted || false, awaiting_name: sessionState.awaiting_name || false, user_name: sessionState.user_name || null }),
      });
      const data = await res.json();
      setSessionState({ greeted: data.greeted, awaiting_name: data.awaiting_name, user_name: data.user_name });
      setMessages(prev => [...prev, { role: 'bot', content: data.answer }]);
    } catch (err) {
      console.error('API error:', err);
      setMessages(prev => [...prev, { role: 'bot', content: 'Backend offline. Start the API server.' }]);
    }
    setLoading(false);
    setBooted(true);
  }

  useEffect(() => { sendMessage('__init__'); }, []);

  function handleKey(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }

  const SUGGESTIONS = ['What has Khush built?', 'Tell me about his experience', 'What are his skills?', 'How can I contact him?'];

  return (
    <section className={styles.hero}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <motion.div className={styles.headline} initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
        <span className={styles.tag}>AI &amp; Data Engineer</span>
        <h1>Talk to <em>Khush</em></h1>
        <p>Not a portfolio page. A conversation.</p>
      </motion.div>
      <motion.div className={styles.chatWindow} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}>
        <div className={styles.chatHeader}>
          <div className={styles.statusDot} />
          <span>Khush s AI — online</span>
        </div>
        <div className={styles.messages}>
          <AnimatePresence initial={false}>
            {messages.map((m, i) => <ChatBubble key={i} msg={m} />)}
            {loading && (
              <motion.div key="typing" className={`${styles.bubble} ${styles.botBubble}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className={styles.avatar}>K</div>
                <TypingIndicator />
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>
        {!started && booted && (
          <motion.div className={styles.suggestions} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            {SUGGESTIONS.map(s => <button key={s} className={styles.chip} onClick={() => sendMessage(s)}>{s}</button>)}
          </motion.div>
        )}
        <div className={styles.inputRow}>
          <input ref={inputRef} className={styles.input} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey} placeholder="Ask anything about Khush..." disabled={loading} />
          <button className={styles.sendBtn} onClick={() => sendMessage()} disabled={loading || !input.trim()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </motion.div>
      <motion.div className={styles.scrollHint} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
        <span>scroll to explore</span>
        <div className={styles.scrollLine} />
      </motion.div>
    </section>
  );
}



