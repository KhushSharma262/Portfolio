'use client'
import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import styles from './Experience.module.scss'

const TIMELINE = [
  {
    year: '2025 - 2026',
    role: 'Technical Intern',
    company: 'LatentHQ (AlphaOBS)',
    desc: 'Building RAG systems, LLM pipelines, and AI-powered products for clients. Focus on production-grade architecture and intelligent web systems.',
    color: '#38bdf8',
    projects: [
      { name: 'Offer Letter Automation', time: 'Oct 2024', desc: 'Auto-generates offer letters from form submissions using Zapier + Google APIs.' },
      { name: 'Project Dashboard', time: 'Dec 2024', desc: 'Streamlit KPI dashboard integrating Jira API for live project tracking.' },
      { name: 'Document Chatbot', time: 'Feb 2025', desc: 'RAG-based chatbot answering queries from 100+ page internal documents.' },
    ],
  },
  {
    year: '2024 - 2025',
    role: 'Research Trainee',
    company: 'DRDO',
    desc: 'Real-world problem solving at defence research level. Built C# flight simulation models and NLP pipelines using TensorFlow and BERT.',
    color: '#c084fc',
    projects: [
      { name: 'Flight Simulation Model', time: 'Dec 2024', desc: 'C# real-time aircraft simulation for research and testing purposes.' },
      { name: 'NLP Document Pipeline', time: 'Jan 2025', desc: 'Structured NLP pipeline using TensorFlow and BERT for defence documents.' },
      { name: 'Research Documentation', time: 'Jul 2025', desc: 'Authored technical docs and collaborated with research scientists.' },
    ],
  },
  {
    year: '2024',
    role: '1st ML Project',
    company: 'Self Interest',
    desc: 'CNN real-time emotion detection system. Optimised inference pipeline for edge deployment with 20fps on hardware.',
    color: '#4ade80',
    projects: [
      { name: 'Emotion Detection CNN', time: 'Mar 2024', desc: 'Real-time facial emotion recognition using CNN and OpenCV at 20fps.' },
      { name: 'Edge Optimisation', time: 'Apr 2024', desc: 'Pruned and optimised model for low-latency edge hardware deployment.' },
      { name: 'Badminton Analytics', time: 'Aug 2024', desc: 'Computer vision system for tracking gameplay and extracting metrics.' },
    ],
  },
  {
    year: '2023',
    role: '1st Year of BTech',
    company: 'MIT ADT University',
    desc: 'Explored domains of engineering, was confused, lost, but stuck to one topic and decided to explore it deeply.',
    color: '#f59e0b',
    projects: [
      { name: 'Python Fundamentals', time: 'Aug 2023', desc: 'Built strong foundations in Python, DSA, and object-oriented programming.' },
      { name: 'Web Basics', time: 'Oct 2023', desc: 'Learned HTML, CSS, JavaScript — built first personal webpage.' },
      { name: 'ML Exploration', time: 'Dec 2023', desc: 'First steps into ML using Scikit-learn, Pandas, and NumPy.' },
    ],
  },
]

const PROJ_CARD_HEIGHT = 72 // approx height of each project card in px
const PROJ_GAP = 8          // gap between cards in px

function TimelineItem({ item, i, inView, isActive, isPushedDown, isPushedUp, onActivate, onDeactivate }) {
  const timerRef = useRef(null)

  const handleEnter = useCallback(() => {
    timerRef.current = setTimeout(() => onActivate(i), 500)
  }, [i, onActivate])

  const handleLeave = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }
    onDeactivate()
  }, [onDeactivate])

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  // Calculate exact top position for each sub-dot
  // They need to align with the center of each project card
  // Cards start after: h3 (~28px) + company (~20px) + p (~60px) + projects margin (16px)
  const CARDS_OFFSET = 130 // px from top of .right to first project card center
  const dotPositions = item.projects.map((_, pi) =>
    CARDS_OFFSET + pi * (PROJ_CARD_HEIGHT + PROJ_GAP) + PROJ_CARD_HEIGHT / 2
  )

  return (
    <motion.div
      className={styles.item}
      initial={{ opacity:0, x:-30 }}
      animate={inView ? {
        opacity: 1,
        x: 0,
        y: isPushedDown ? 48 : isPushedUp ? -48 : 0,
      } : {}}
      transition={{ duration:0.45, delay: 0.2 + i * 0.12, ease:[0.16,1,0.3,1] }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}>

      {/* Year */}
      <div className={styles.left}>
        <span className={styles.year} style={{ color: isActive ? item.color : undefined }}>
          {item.year}
        </span>
      </div>

      {/* Spine */}
      <div className={styles.center}>
        <motion.div className={styles.dot}
          animate={{
            scale: isActive ? 1.7 : 1,
            backgroundColor: isActive ? item.color : '#334155',
            boxShadow: isActive ? `0 0 16px ${item.color}88` : 'none',
          }}
          transition={{ duration:0.25 }}
        />

        <div className={styles.lineWrap}>
          <div className={styles.line}
            style={{
              background: isActive ? item.color : 'rgba(255,255,255,0.1)',
              opacity: isActive ? 0.25 : 1,
            }} />

          <AnimatePresence>
            {isActive && dotPositions.map((topPx, pi) => (
              <motion.div key={pi}
                className={styles.subDot}
                style={{ background: item.color, top: `${topPx}px` }}
                initial={{ opacity:0, scale:0 }}
                animate={{ opacity:1, scale:1 }}
                exit={{ opacity:0, scale:0 }}
                transition={{ delay: pi * 0.09, duration:0.2 }}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Right content */}
      <motion.div className={styles.right}
        animate={{ x: isActive ? 20 : 0 }}
        transition={{ duration:0.3 }}>

        <h3 className={styles.h3} style={{ color: isActive ? item.color : undefined }}>
          {item.role}
        </h3>
        <span className={styles.company}>{item.company}</span>
        <p className={styles.p}>{item.desc}</p>

        <AnimatePresence>
          {isActive && (
            <motion.div className={styles.projects}
              initial={{ opacity:0, height:0 }}
              animate={{ opacity:1, height:'auto' }}
              exit={{ opacity:0, height:0 }}
              transition={{ duration:0.35, ease:[0.16,1,0.3,1] }}>
              {item.projects.map((proj, pi) => (
                <motion.div key={pi} className={styles.projItem}
                  style={{ '--c': item.color }}
                  initial={{ opacity:0, x:-12 }}
                  animate={{ opacity:1, x:0 }}
                  exit={{ opacity:0, x:-12 }}
                  transition={{ delay: pi * 0.09 }}>
                  <div className={styles.projTop}>
                    <span className={styles.projName}>{proj.name}</span>
                    <span className={styles.projTime}>{proj.time}</span>
                  </div>
                  <span className={styles.projDesc}>{proj.desc}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

export default function Experience() {
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [activeIdx, setActiveIdx] = useState(null)

  const onActivate   = useCallback((i) => setActiveIdx(i), [])
  const onDeactivate = useCallback(() => setActiveIdx(null), [])

  return (
    <section id='experience' className={styles.exp} ref={ref}>
      <div className={styles.inner}>
        <motion.span className={styles.label}
          initial={{ opacity:0 }} animate={inView ? { opacity:1 } : {}} transition={{ duration:0.6 }}>
          Academic Experience
        </motion.span>

        <motion.h2 className={styles.h2}
          initial={{ opacity:0, y:24 }}
          animate={inView ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.8, delay:0.1, ease:[0.16,1,0.3,1] }}>
          The path so far.
        </motion.h2>

        <div className={styles.timeline}>
          {TIMELINE.map((item, i) => (
            <TimelineItem
              key={i} item={item} i={i} inView={inView}
              isActive={activeIdx === i}
              isPushedDown={activeIdx !== null && i > activeIdx}
              isPushedUp={activeIdx !== null && i < activeIdx}
              onActivate={onActivate}
              onDeactivate={onDeactivate}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

