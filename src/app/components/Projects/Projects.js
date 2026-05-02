'use client'
import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import styles from './Projects.module.scss'

const PROJECTS = [
  {
    id: '01',
    title: 'AI Digital Persona',
    category: 'AI System',
    desc: 'RAG-based chatbot trained on personal data. Answers questions about me with zero hallucination, personality-controlled output, and real-time vector retrieval.',
    tags: ['RAG','LangChain','Streamlit','Python','Vector DB'],
    color: '#38bdf8',
    link: 'https://github.com/KhushSharma262/Portfolio',
    nda: false,
    flow: [
      { id: 'a', label: 'User Query', sub: 'Natural language input' },
      { id: 'b', label: 'Vector Search', sub: 'FAISS similarity search' },
      { id: 'c', label: 'LLM + RAG', sub: 'LangChain pipeline' },
      { id: 'd', label: 'Response', sub: 'Personality-controlled output' },
    ],
    result: '< 2s response time · Zero hallucination · Deployed live',
  },
  {
    id: '02',
    title: 'Offer Letter Automation',
    category: 'Workflow Automation',
    desc: 'HR workflow automation pipeline that auto-generates offer letters from form submissions. Reduced manual processing time by 60%.',
    tags: ['Zapier','Google Forms','Google Sheets','Python','APIs'],
    color: '#818cf8',
    link: '#',
    nda: true,
    ndaOrg: 'Alpha OBS',
    flow: [
      { id: 'a', label: 'Google Form', sub: 'HR submits data' },
      { id: 'b', label: 'Zapier Trigger', sub: 'Webhook fires' },
      { id: 'c', label: 'Python Script', sub: 'Letter generation' },
      { id: 'd', label: 'Auto Delivered', sub: 'Email + Drive' },
    ],
    result: '60% faster onboarding · 100% automated · 0 manual effort',
  },
  {
    id: '03',
    title: 'Project Management Dashboard',
    category: 'Data Engineering',
    desc: 'Streamlit analytics dashboard integrating Jira and spreadsheet APIs to monitor project KPIs with ~80% forecasting accuracy.',
    tags: ['Streamlit','Jira API','Python','Pandas','Tableau'],
    color: '#c084fc',
    link: '#',
    nda: true,
    ndaOrg: 'Alpha OBS',
    flow: [
      { id: 'a', label: 'Jira API', sub: 'Live ticket data' },
      { id: 'b', label: 'Pandas ETL', sub: 'Data processing' },
      { id: 'c', label: 'Streamlit', sub: 'Dashboard render' },
      { id: 'd', label: 'KPI Forecast', sub: '~80% accuracy' },
    ],
    result: '5k+ records analysed · 60% less manual reporting',
  },
  {
    id: '04',
    title: 'Smart Farm Automation',
    category: 'IoT & Automation',
    desc: 'Web-controlled IoT automation platform integrating sensor data, remote monitoring, and rule-based irrigation control.',
    tags: ['IoT','Python','Sensors','Web Dashboard','Automation'],
    color: '#4ade80',
    link: '#',
    nda: false,
    flow: [
      { id: 'a', label: 'Sensors', sub: 'Soil, temp, humidity' },
      { id: 'b', label: 'IoT Hub', sub: 'Data aggregation' },
      { id: 'c', label: 'Rule Engine', sub: 'Irrigation logic' },
      { id: 'd', label: 'Web Dashboard', sub: 'Remote control' },
    ],
    result: 'Real-time monitoring · Automated irrigation · Scalable',
  },
]

function FlowChart({ flow, color }) {
  return (
    <div className={styles.flowChart}>
      {flow.map((node, i) => (
        <div key={node.id} className={styles.flowRow}>
          <motion.div
            className={styles.flowNode}
            style={{ '--fc': color }}
            initial={{ opacity:0, scale:0.85 }}
            animate={{ opacity:1, scale:1 }}
            transition={{ delay: i * 0.1, duration:0.3 }}>
            <span className={styles.flowLabel}>{node.label}</span>
            <span className={styles.flowSub}>{node.sub}</span>
          </motion.div>
          {i < flow.length - 1 && (
            <motion.div className={styles.flowArrow}
              initial={{ opacity:0, scaleY:0 }}
              animate={{ opacity:1, scaleY:1 }}
              transition={{ delay: i * 0.1 + 0.15, duration:0.2 }}>
              ↓
            </motion.div>
          )}
        </div>
      ))}
    </div>
  )
}

function ProjectCard({ p, i, inView }) {
  const [hoverTimer, setHoverTimer] = useState(null)
  const [popupOpen, setPopupOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  const progressRef = useRef(null)

  const startHover = () => {
    setProgress(0)
    const start = Date.now()
    const timer = setInterval(() => {
      const elapsed = Date.now() - start
      const pct = Math.min((elapsed / 2000) * 100, 100)
      setProgress(pct)
      if (elapsed >= 2000) {
        clearInterval(timer)
        setPopupOpen(true)
      }
    }, 30)
    setHoverTimer(timer)
  }

  const stopHover = () => {
    if (hoverTimer) { clearInterval(hoverTimer); setHoverTimer(null) }
    setProgress(0)
  }

  const closePopup = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setPopupOpen(false)
    setProgress(0)
  }

  return (
    <>
      <motion.div
        className={styles.card}
        initial={{ opacity:0, y:40 }}
        animate={inView ? { opacity:1, y:0 } : {}}
        transition={{ duration:0.7, delay: 0.2 + i * 0.12, ease:[0.16,1,0.3,1] }}
        onMouseEnter={startHover}
        onMouseLeave={stopHover}
        onTouchStart={startHover}
        onTouchEnd={stopHover}>

        <div className={styles.topGlow} style={{ '--c': p.color }} />

        {progress > 0 && !popupOpen && (
          <div className={styles.progressBar}>
            <motion.div
              className={styles.progressFill}
              style={{ width: `${progress}%`, background: p.color }}
            />
          </div>
        )}

        <div className={styles.cardTop}>
          <span className={styles.num}>{p.id}</span>
          <span className={styles.category}>{p.category}</span>
        </div>

        <h3 className={styles.h3}>{p.title}</h3>
        <p className={styles.p}>{p.desc}</p>

        <div className={styles.tags}>
          {p.tags.map(t => (
            <span key={t} className={styles.tag}>{t}</span>
          ))}
        </div>

        <div className={styles.hoverHint}>Hold to preview →</div>
      </motion.div>

      <AnimatePresence>
        {popupOpen && (
          <motion.div className={styles.overlay}
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            exit={{ opacity:0 }}
            onClick={closePopup}>
            <motion.div
              className={styles.popup}
              initial={{ opacity:0, scale:0.9, y:30 }}
              animate={{ opacity:1, scale:1, y:0 }}
              exit={{ opacity:0, scale:0.9, y:30 }}
              transition={{ duration:0.35, ease:[0.16,1,0.3,1] }}
              onClick={e => e.stopPropagation()}>

              <div className={styles.popupHeader} style={{ '--c': p.color }}>
                <div>
                  <span className={styles.popupId}>{p.id}</span>
                  <h3 className={styles.popupTitle}>{p.title}</h3>
                  <span className={styles.popupCat}>{p.category}</span>
                </div>
                <button className={styles.closeBtn} onClick={closePopup}>✕</button>
              </div>

              {p.nda && (
                <div className={styles.ndaBanner}>
                  <span className={styles.ndaIcon}>🔒</span>
                  <div>
                    <span className={styles.ndaTitle}>NDA Protected</span>
                    <span className={styles.ndaDesc}>This project was built during my internship at <strong>{p.ndaOrg}</strong>. Full details are confidential.</span>
                  </div>
                </div>
              )}

              <div className={styles.popupBody}>
                <div className={styles.popupLeft}>
                  <span className={styles.sectionTitle}>How it works</span>
                  <FlowChart flow={p.flow} color={p.color} />
                </div>

                <div className={styles.popupRight}>
                  <span className={styles.sectionTitle}>Tech Stack</span>
                  <div className={styles.popupTags}>
                    {p.tags.map(t => (
                      <span key={t} className={styles.popupTag} style={{ '--c': p.color }}>{t}</span>
                    ))}
                  </div>

                  <span className={styles.sectionTitle} style={{ marginTop:'1.5rem' }}>Results</span>
                  <div className={styles.resultBox} style={{ '--c': p.color }}>
                    {p.result.split('·').map((r, i) => (
                      <div key={i} className={styles.resultItem}>
                        <span className={styles.resultDot} style={{ background: p.color }} />
                        <span>{r.trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default function Projects() {
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id='projects' className={styles.projects} ref={ref}>
      <div className={styles.inner}>
        <motion.span className={styles.label}
          initial={{ opacity:0 }} animate={inView ? { opacity:1 } : {}} transition={{ duration:0.6 }}>
          Selected Work
        </motion.span>

        <motion.h2 className={styles.h2}
          initial={{ opacity:0, y:24 }}
          animate={inView ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.8, delay:0.1, ease:[0.16,1,0.3,1] }}>
          What I have built.
        </motion.h2>

        <div className={styles.grid}>
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.id} p={p} i={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}
