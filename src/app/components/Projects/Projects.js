'use client'
import { useRef, useState, useEffect, Fragment } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import styles from './Projects.module.scss'

// image: drop a file at public/projects/<id>.jpg  (falls back to gradient if missing)
const PROJECTS = [
  {
    id: 'pm-dashboard',
    featured: true,
    title: 'Project Management Analytics Dashboard',
    tagline: 'Real-time KPI visibility across 5,000+ project records.',
    image: '/projects/pm-dashboard.jpeg',
    problem:
      'Project tracking lived in two disconnected places — Jira and spreadsheets — so reading delivery timelines, progress, and team performance was slow, and every report had to be assembled by hand.',
    build:
      'Built a Streamlit analytics dashboard that pulls Jira and spreadsheet APIs into a single live view, surfacing KPIs, project progress, delivery timelines, and team performance across 5,000+ records. Reporting and data-analysis workflows that previously ran manually were fully automated.',
    result:
      'Cut manual reporting effort by ~60% and gave leadership a clear, always-current operational picture for faster decisions.',
    flow: ['Jira + Spreadsheet APIs', 'Data Pipeline', 'Streamlit Dashboard', 'KPIs & Reports'],
    stack: ['Python', 'Streamlit', 'Jira API', 'Spreadsheet API'],
    links: [],
    color: '#4f8ef7',
  },
  {
    id: 'hr-automation',
    featured: true,
    title: 'HR Workflow Automation System',
    tagline: '~70% less manual HR documentation through automation.',
    image: '/projects/hr-automation.jpg',
    problem:
      'HR and operational processes depended on repetitive manual documentation and data entry — slow for the team and a constant source of reporting errors.',
    build:
      'Developed automation workflows with Python, Zapier, n8n, and Google Workspace integrations that connect the tools teams already use and move data between them automatically across HR and operational processes.',
    result:
      'Reduced manual documentation effort by ~70% and improved reporting accuracy through automated data collection and processing.',
    flow: ['Trigger Event', 'Zapier / n8n', 'Google Workspace', 'Automated Records'],
    stack: ['Python', 'Zapier', 'n8n', 'APIs', 'Google Workspace'],
    links: [],
    color: '#fbbf24',
  },
  {
    id: 'knowledge-retrieval',
    featured: true,
    title: 'AI-Powered Knowledge Retrieval System',
    tagline: 'Contextual search across large document repositories.',
    image: '/projects/knowledge-retrieval.jpg',
    problem:
      'Finding information across large document repositories meant slow, manual searching with no understanding of context — answers were buried and easy to miss.',
    build:
      'Built a document-intelligence platform on a RAG architecture, pairing LLMs with vector-based retrieval to return accurate, context-aware answers drawn from across the repository.',
    result:
      'Improved retrieval speed and cut manual search effort by serving relevant, context-aware responses on demand.',
    flow: ['Documents', 'Embeddings', 'Vector Store', 'Retrieval', 'LLM', 'Answer'],
    stack: ['RAG', 'LLMs', 'Vector Retrieval'],
    links: [],
    color: '#a855f7',
  },
  {
    id: 'talk-to-khush',
    featured: true,
    title: 'Talk to Khush — AI Portfolio Chatbot',
    tagline: 'Ask anything about my work, answered in real time.',
    image: '/projects/talk-to-khush.jpg',
    problem:
      'Recruiters had to dig through a portfolio to piece together projects, skills, and experience — slow, and easy to overlook the important parts.',
    build:
      'Built a conversational AI chatbot on a RAG architecture that lets anyone query 10+ projects, skills, and experience data instantly. Developed and deployed with Next.js and JavaScript.',
    result:
      'Reduced recruiter response time by ~80% through real-time information retrieval.',
    flow: ['User Query', 'RAG Retrieval', 'LLM', 'Response (Next.js UI)'],
    stack: ['RAG', 'Next.js', 'JavaScript'],
    links: [],
    color: '#34d399',
  },

  // ---------- View more ----------
  {
    id: 'aircraft-sim',
    featured: false,
    status: 'In development',
    title: 'Aircraft Simulation',
    tagline: 'Flight dynamics & trajectory simulation.',
    image: '/projects/aircraft-sim.jpg',
    problem:
      'Model aircraft motion and predict trajectories for simulation and analysis in a defence-research context.',
    build:
      'Physics-based simulation modelling lift, drag, thrust, and weight through Newtonian dynamics; the simulation loop updates forces, acceleration, velocity, and position over time. Explored trajectory prediction, radar-tracking simulation, and path optimisation (A*, Dijkstra).',
    result:
      'Architecture and core flight-dynamics model defined; simulation engine in active development.',
    flow: ['Calculate Forces', 'Acceleration', 'Velocity', 'Position', '↺ Loop'],
    stack: ['Python', 'NumPy', 'SciPy', 'Matplotlib', 'Pygame'],
    links: [],
    color: '#60a5fa',
  },
  {
    id: 'exercise-detection',
    featured: false,
    status: 'In development',
    title: 'Exercise Detection System',
    tagline: 'Real-time webcam exercise recognition & rep counting.',
    image: '/projects/exercise-detection.jpg',
    problem:
      'Track a workout automatically from a webcam — identify the exercise, count reps, detect inactivity, and manage rest periods without manual input.',
    build:
      'CNN-based recognition over live webcam frames classifies exercises (push-up, squat, and more) and counts reps via state-change logic. An inactivity module alerts after 10s of no movement, paired with a configurable rest manager and a modular Tkinter GUI.',
    result:
      'Modular multi-component architecture (detection, alerts, GUI) defined; recognition and rep-counting pipeline in development.',
    flow: ['Webcam', 'Frame Capture', 'CNN Model', 'Classification', 'Rep / Alert Manager', 'GUI'],
    stack: ['Python', 'OpenCV', 'CNN', 'Tkinter'],
    links: [],
    color: '#f472b6',
  },
  {
    id: 'emotion-detection',
    featured: false,
    status: 'Draft',
    title: 'Emotion Detection',
    tagline: 'Real-time facial emotion recognition.',
    image: '/projects/emotion-detection.jpg',
    // TODO: replace these with your real content
    problem: 'Placeholder — add the problem this project solves.',
    build: 'Placeholder — describe what you built and how.',
    result: 'Placeholder — add outcome / status.',
    flow: ['Webcam', 'Face Detection', 'CNN Model', 'Emotion Class', 'Output'],
    stack: ['Python', 'OpenCV'],
    links: [],
    color: '#22d3ee',
  },
]

function Media({ p, small }) {
  return (
    <div className={`${styles.media} ${small ? styles.mediaSmall : ''}`}>
      <img
        src={p.image}
        alt=""
        className={styles.mediaImg}
        loading="lazy"
        onError={(e) => e.currentTarget.classList.add(styles.imgHidden)}
      />
      <span className={styles.glassLayer} />
      <span className={styles.mediaGlow} />
      {p.status && <span className={styles.statusPill}>{p.status}</span>}
    </div>
  )
}

function StackTags({ stack, color }) {
  return (
    <div className={styles.tags}>
      {stack.map((t) => (
        <span key={t} className={styles.tag} style={{ '--tag-color': color }}>{t}</span>
      ))}
    </div>
  )
}

function Flow({ steps }) {
  return (
    <div className={styles.flow}>
      {steps.map((s, i) => (
        <Fragment key={s + i}>
          <div className={styles.flowNode}>{s}</div>
          {i < steps.length - 1 && <span className={styles.flowArrow}>→</span>}
        </Fragment>
      ))}
    </div>
  )
}

function Card({ p, onOpen, small }) {
  return (
    <motion.button
      layoutId={`card-${p.id}`}
      className={`${styles.card} ${small ? styles.cardSmall : ''}`}
      style={{ '--accent': p.color }}
      onClick={() => onOpen(p.id)}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      <motion.div layoutId={`media-${p.id}`}><Media p={p} small={small} /></motion.div>
      <motion.div layoutId={`body-${p.id}`} className={styles.cardBody}>
        <motion.h3 layoutId={`title-${p.id}`} className={styles.cardTitle}>{p.title}</motion.h3>
        <p className={styles.cardTagline}>{p.tagline}</p>
        <StackTags stack={p.stack} color={p.color} />
      </motion.div>
    </motion.button>
  )
}

export default function Projects() {
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [openId, setOpenId] = useState(null)
  const [showMore, setShowMore] = useState(false)

  const featured = PROJECTS.filter((p) => p.featured)
  const more = PROJECTS.filter((p) => !p.featured)
  const active = PROJECTS.find((p) => p.id === openId)

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpenId(null) }
    if (openId) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', onKey)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [openId])

  return (
    <section id="projects" className={styles.projects} ref={ref}>
      <div className={styles.inner}>
        <div className={styles.canvas}>
        <motion.span
          className={styles.label}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          Projects
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Things I&apos;ve<br />
          <span className={styles.accent}>shipped.</span>
        </motion.h2>

        
        <div className={styles.grid}>
          {featured.map((p) => (
            <Card key={p.id} p={p} onOpen={setOpenId} />
          ))}
        </div>

        <div className={styles.moreWrap}>
          <button className={styles.moreBtn} onClick={() => setShowMore((s) => !s)}>
            {showMore ? 'Show less' : 'View more projects'}
            <span className={`${styles.chev} ${showMore ? styles.chevUp : ''}`}>↓</span>
          </button>
        </div>

        <AnimatePresence>
          {showMore && (
            <motion.div
              className={styles.gridSmall}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {more.map((p) => (
                <Card key={p.id} p={p} onOpen={setOpenId} small />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      
        </div>
      </div>

      {/* ---------- Expanded case study ---------- */}
      <AnimatePresence>
        {active && (
          <div className={styles.overlay}>
            <motion.div
              className={styles.backdrop}
              onClick={() => setOpenId(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              layoutId={`card-${active.id}`}
              className={styles.panel}
              style={{ '--accent': active.color }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            >
              <button className={styles.close} onClick={() => setOpenId(null)} aria-label="Close">✕</button>

              <motion.div layoutId={`media-${active.id}`}>
                <div className={styles.panelMedia}>
                  <img
                    src={active.image}
                    alt=""
                    className={styles.mediaImg}
                    onError={(e) => e.currentTarget.classList.add(styles.imgHidden)}
                  />
                  <span className={styles.glassLayer} />
                  <span className={styles.mediaGlow} />
                  {active.status && <span className={styles.statusPill}>{active.status}</span>}
                </div>
              </motion.div>

              <motion.div layoutId={`body-${active.id}`} className={styles.panelBody}>
                <motion.h3 layoutId={`title-${active.id}`} className={styles.panelTitle}>
                  {active.title}
                </motion.h3>
                <p className={styles.panelTagline}>{active.tagline}</p>

                <motion.div
                  className={styles.caseStudy}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                >
                  <div className={styles.block}>
                    <span className={styles.blockLabel}>Problem</span>
                    <p>{active.problem}</p>
                  </div>
                  <div className={styles.block}>
                    <span className={styles.blockLabel}>Build</span>
                    <p>{active.build}</p>
                  </div>
                  <div className={styles.block}>
                    <span className={styles.blockLabel}>Result</span>
                    <p>{active.result}</p>
                  </div>

                  {active.flow && (
                    <div className={styles.block}>
                      <span className={styles.blockLabel}>Flow</span>
                      <Flow steps={active.flow} />
                    </div>
                  )}

                  <StackTags stack={active.stack} color={active.color} />

                  {active.links.length > 0 && (
                    <div className={styles.linkRow}>
                      {active.links.map((l) => (
                        <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className={styles.link}>
                          {l.label} ↗
                        </a>
                      ))}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}


