'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './About.module.scss'

const TRAITS = [
  {
    num: '01',
    title: 'AI & Automation Engineer',
    desc: 'Building intelligent web systems, API-driven integrations, and workflow automation at LatentHQ. From LLM pipelines to HR automation — if it can be automated, I build it.',
  },
  {
    num: '02',
    title: 'Research-Backed Builder',
    desc: 'Research Intern at DRDO — built C# flight simulation models and NLP pipelines using TensorFlow and BERT for defence-grade document analysis.',
  },
  {
    num: '03',
    title: 'Full-Stack Data Thinker',
    desc: 'From raw sensor data to production dashboards — I own the entire pipeline. Computer vision, EDA, model evaluation, and real-time monitoring with measurable impact.',
  },
]

const STATS = [
  { val: '8.29', label: 'CGPA' },
  { val: '2+',   label: 'Years Building' },
]

export default function About() {
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id='about' className={styles.about} ref={ref}>
      <div className={styles.inner}>
        <motion.span className={styles.label}
          initial={{ opacity:0 }} animate={inView ? { opacity:1 } : {}} transition={{ duration:0.6 }}>
          About
        </motion.span>

        <div className={styles.grid}>
          <div className={styles.left}>
            <motion.h2
              initial={{ opacity:0, y:24 }}
              animate={inView ? { opacity:1, y:0 } : {}}
              transition={{ duration:0.8, delay:0.1, ease:[0.16,1,0.3,1] }}>
              I build things<br />
              <span className={styles.accent}>that think.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity:0, y:16 }}
              animate={inView ? { opacity:1, y:0 } : {}}
              transition={{ duration:0.7, delay:0.2 }}>
              Automation, AI & Data Engineer at <em>MIT-ADT University, Pune</em> — graduating in 2027 with a B.Tech in Computer Engineering and a CGPA of 8.29.
            </motion.p>

            <motion.p
              initial={{ opacity:0, y:16 }}
              animate={inView ? { opacity:1, y:0 } : {}}
              transition={{ duration:0.7, delay:0.28 }}>
              I don't just train models — I ship systems. From <em>document-aware chatbots</em> to <em>IoT farm automation</em>, my work lives in production and solves real problems.
            </motion.p>

            <motion.div className={styles.stats}
              initial={{ opacity:0, y:16 }}
              animate={inView ? { opacity:1, y:0 } : {}}
              transition={{ duration:0.7, delay:0.36 }}>
              {STATS.map(s => (
                <div key={s.label} className={styles.stat}>
                  <span className={styles.statVal}>{s.val}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <div className={styles.right}>
            {TRAITS.map((t, i) => (
              <motion.div key={t.num} className={styles.trait}
                initial={{ opacity:0, x:30 }}
                animate={inView ? { opacity:1, x:0 } : {}}
                transition={{ duration:0.7, delay: 0.2 + i * 0.12, ease:[0.16,1,0.3,1] }}>
                <span className={styles.traitNum}>{t.num}</span>
                <div>
                  <h3>{t.title}</h3>
                  <p>{t.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
