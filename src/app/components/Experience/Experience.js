'use client'
import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import styles from './Experience.module.scss'

// type: 'role' (blue) | 'education' (violet)
const TIMELINE = [
  {
    id: 'btech',
    type: 'education',
    period: '2023',
    title: '1st Year of BTech',
    org: 'MIT ADT University',
    summary:
      'Explored domains of engineering — confused and lost at first, but stuck to one topic and decided to go deep.',
    milestones: [
      { date: 'Aug 2023', label: 'Python Fundamentals', text: 'Built strong foundations in Python, DSA, and object-oriented programming.' },
      { date: 'Oct 2023', label: 'Web Basics', text: 'Learned HTML, CSS, JavaScript — built first personal webpage.' },
      { date: 'Dec 2023', label: 'ML Exploration', text: 'First steps into ML using Scikit-learn, Pandas, and NumPy.' },
    ],
  },
  {
    id: 'ml-project',
    type: 'role',
    period: '2024',
    title: '1st ML Project',
    org: 'Self Interest',
    summary:
      'CNN real-time emotion detection system. Optimised the inference pipeline for edge deployment at 20fps on hardware.',
    milestones: [
      { date: 'Mar 2024', label: 'Emotion Detection CNN', text: 'Real-time facial emotion recognition using CNN and OpenCV at 20fps.' },
      { date: 'Apr 2024', label: 'Edge Optimisation', text: 'Pruned and optimised the model for low-latency edge hardware deployment.' },
    ],
  },
  {
    id: 'drdo',
    type: 'role',
    period: '2024 – 2025',
    title: 'Research Trainee',
    org: 'DRDO',
    summary:
      'Real-world problem solving at defence-research level. Built C# flight-simulation models and NLP pipelines with TensorFlow and BERT.',
    milestones: [
      { date: 'Dec 2024', label: 'Flight Simulation Model', text: 'C# real-time aircraft simulation for research and testing purposes.' },
      { date: 'Jan 2025', label: 'NLP Document Pipeline', text: 'Structured NLP pipeline using TensorFlow and BERT for defence documents.' },
      { date: 'Jul 2025', label: 'Research Documentation', text: 'Authored technical docs and collaborated with research scientists.' },
    ],
  },
  {
    id: 'latenthq',
    type: 'role',
    period: '2025 – 2026',
    title: 'Technical Intern',
    org: 'LatentHQ (AlphaOBS)',
    summary:
      'Building RAG systems, LLM pipelines, and AI-powered products for clients. Focus on production-grade architecture and intelligent web systems.',
    milestones: [
      { date: 'Oct 2025', label: 'Offer Letter Automation', text: 'Auto-generates offer letters from form submissions using Zapier + Google APIs.' },
      { date: 'Dec 2025', label: 'Project Dashboard', text: 'Streamlit KPI dashboard integrating Jira API for live project tracking.' },
      { date: 'Feb 2026', label: 'Document Chatbot', text: 'RAG-based chatbot answering queries from 100+ page internal documents.' },
    ],
  },
]

function Step({ item, active, onActivate, isMobile }) {
  const isOpen = active === item.id
  return (
    <div
      className={`${styles.step} ${isOpen ? styles.open : ''} ${styles[item.type]}`}
      onMouseEnter={() => onActivate(item.id)}
      onClick={() => onActivate(isOpen ? null : item.id)}
    >
      <div className={styles.node}>
        <span className={styles.nodeDot} />
      </div>

      <div className={styles.head}>
        <span className={styles.period}>{item.period}</span>
        <h3 className={styles.title}>{item.title}</h3>
        <span className={styles.org}>{item.org}</span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.details}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className={styles.summary}>{item.summary}</p>
            <ul className={styles.milestones}>
              {item.milestones.map((m, i) => (
                <motion.li
                  key={m.label}
                  className={styles.milestone}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.3 }}
                >
                  <span className={styles.mDot} />
                  <div className={styles.mText}>
                    <span className={styles.mLabel}>{m.label}</span>
                    <span className={styles.mDate}>{m.date}</span>
                    <span className={styles.mDesc}>{m.text}</span>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Experience() {
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 860px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  const [active, setActive] = useState('latenthq')

  return (
    <section id="experience" className={styles.experience} ref={ref}>
      <div className={styles.inner}>
        <motion.span
          className={styles.label}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          Experience
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          The path<br />
          <span className={styles.accent}>so far.</span>
        </motion.h2>

        <div className={styles.track} onMouseLeave={() => setActive('latenthq')}>
          <div className={styles.line} />
          <div className={styles.steps}>
            {TIMELINE.map((item) => (
              <Step key={item.id} item={item} active={active} onActivate={setActive} isMobile={isMobile} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}



