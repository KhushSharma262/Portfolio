'use client'
import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './About.module.scss'

const TRAITS = [
  {
    num: '01',
    title: 'AI & Automation Engineer',
    icon: '⚡',
    desc: 'Building intelligent web systems, API-driven integrations, and workflow automation at LatentHQ. From LLM pipelines to HR automation — if it can be automated, I build it.',
  },
  {
    num: '02',
    title: 'Research-Backed Builder',
    icon: '🔬',
    desc: 'Research Intern at DRDO — built C# flight simulation models and NLP pipelines using TensorFlow and BERT for defence-grade document analysis.',
  },
  {
    num: '03',
    title: 'Full-Stack Data Thinker',
    icon: '📊',
    desc: 'From raw sensor data to production dashboards — I own the entire pipeline. Computer vision, EDA, model evaluation, and real-time monitoring with measurable impact.',
  },
]

const TERMINAL_LINES = [
  { prefix: '~', cmd: 'whoami', out: 'khush_sharma' },
  { prefix: '~', cmd: 'cat skills.txt', out: null },
  { prefix: null, cmd: null, out: '› Python      ████████████ expert' },
  { prefix: null, cmd: null, out: '› Java        ████████████ expert' },
  { prefix: null, cmd: null, out: '› NLP / LLM   ████████████ expert' },
  { prefix: null, cmd: null, out: '› Next.js     ███████░░░░░ intermediate' },
  { prefix: null, cmd: null, out: '› React.js    ██████████░░ advanced' },
  { prefix: null, cmd: null, out: '› AI / ML     ████████████ expert' },
  { prefix: '~', cmd: 'echo $status', out: 'shipping in production 🚀' },
]

function Terminal({ inView }) {
  const [displayed, setDisplayed] = useState([])
  const [charIdx, setCharIdx] = useState(0)
  const [lineIdx, setLineIdx] = useState(0)
  const [phase, setPhase] = useState('typing')

  useEffect(() => {
    if (!inView) return
    setDisplayed([])
    setLineIdx(0)
    setCharIdx(0)
    setPhase('typing')
  }, [inView])

  useEffect(() => {
    if (!inView) return
    if (lineIdx >= TERMINAL_LINES.length) return

    const line = TERMINAL_LINES[lineIdx]
    const fullText = line.cmd || line.out || ''

    if (phase === 'typing') {
      if (charIdx < fullText.length) {
        const t = setTimeout(() => setCharIdx(c => c + 1), line.cmd ? 55 : 18)
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => {
          if (line.out && line.cmd) {
            setPhase('output')
          } else {
            setDisplayed(d => [...d, line])
            setLineIdx(l => l + 1)
            setCharIdx(0)
            setPhase('typing')
          }
        }, line.cmd ? 180 : 40)
        return () => clearTimeout(t)
      }
    }

    if (phase === 'output') {
      const t = setTimeout(() => {
        setDisplayed(d => [...d, line])
        setLineIdx(l => l + 1)
        setCharIdx(0)
        setPhase('typing')
      }, 80)
      return () => clearTimeout(t)
    }
  }, [inView, lineIdx, charIdx, phase])

  const currentLine = TERMINAL_LINES[lineIdx]

  return (
    <div className={styles.terminal}>
      <div className={styles.terminalBar}>
        <span className={styles.dot} style={{ background: '#ff5f57' }} />
        <span className={styles.dot} style={{ background: '#febc2e' }} />
        <span className={styles.dot} style={{ background: '#28c840' }} />
        <span className={styles.termTitle}>khush@portfolio ~ zsh</span>
      </div>
      <div className={styles.terminalBody}>
        {displayed.map((line, i) => (
          <div key={i} className={styles.termLine}>
            {line.prefix && <span className={styles.termPrefix}>{line.prefix} </span>}
            {line.cmd && <span className={styles.termCmd}>{line.cmd}</span>}
            {line.out && !line.cmd && <span className={styles.termOut}>{line.out}</span>}
            {line.out && line.cmd && (
              <>
                <br />
                <span className={styles.termOut}>{line.out}</span>
              </>
            )}
          </div>
        ))}
        {lineIdx < TERMINAL_LINES.length && currentLine && (
          <div className={styles.termLine}>
            {currentLine.prefix && phase === 'typing' && (
              <span className={styles.termPrefix}>{currentLine.prefix} </span>
            )}
            {currentLine.cmd && phase === 'typing' && (
              <span className={styles.termCmd}>
                {currentLine.cmd.slice(0, charIdx)}
                <span className={styles.cursor}>▋</span>
              </span>
            )}
            {currentLine.out && phase === 'typing' && !currentLine.cmd && (
              <span className={styles.termOut}>
                {currentLine.out.slice(0, charIdx)}
                <span className={styles.cursor}>▋</span>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function About() {
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-40% 0px -40% 0px' })

  return (
    <section id='about' className={styles.about} ref={ref}>
      <div className={styles.outerGlass}>
      <div className={styles.inner}>
        <motion.span className={styles.label}
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.6 }}>
          About
        </motion.span>

        <div className={styles.grid}>
          <div className={styles.left}>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>
              I build things<br />
              <span className={styles.accent}>that think.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}>
              Automation, AI & Data Engineer at <em>MIT-ADT University, Pune</em> — graduating in 2027 with a B.Tech in Computer Engineering.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.28 }}>
              I don&apos;t just train models — I ship systems. From <em>document-aware chatbots</em> to <em>IoT farm automation</em>, my work lives in production and solves real problems.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.34 }}>
              <Terminal inView={inView} />
            </motion.div>
          </div>

          <div className={styles.right}>
            {TRAITS.map((t, i) => (
              <motion.div key={t.num} className={styles.trait}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.65, delay: 0.25 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}>
                <div className={styles.traitTop}>
                  <span className={styles.traitIcon}>{t.icon}</span>
                  <span className={styles.traitNum}>{t.num}</span>
                </div>
                <div>
                  <h3>{t.title}</h3>
                  <p>{t.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </section>
  )
}



