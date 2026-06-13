'use client'
import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './Skills.module.scss'

const LEVELS = { 1: ['Beginner', 30], 2: ['Intermediate', 55], 3: ['Advanced', 78], 4: ['Expert', 95] }

const CATEGORIES = [
  {
    id: 'languages', label: 'Languages', color: '#4f8ef7',
    skills: [
      { name: 'Python', lvl: 4, icon: 'python' },
      { name: 'Java', lvl: 3, icon: 'openjdk' },
      { name: 'SQL', lvl: 2, icon: 'mysql' },
      { name: 'JavaScript', lvl: 2, icon: 'javascript' },
      { name: 'R', lvl: 2, icon: 'r' },
    ],
  },
  {
    id: 'ai-ml', label: 'AI / ML & Data', color: '#a855f7',
    skills: [
      { name: 'Deep Learning', lvl: 4, icon: 'pytorch' },
      { name: 'NLP', lvl: 4, icon: 'huggingface' },
      { name: 'Image Processing', lvl: 4, icon: 'opencv' },
      { name: 'Computer Vision', lvl: 3, icon: 'tensorflow' },
      { name: 'EDA', lvl: 3, icon: 'pandas' },
      { name: 'Data Analysis', lvl: 3, icon: 'plotly' },
    ],
  },
  {
    id: 'devtools', label: 'Dev Tools', color: '#34d399',
    skills: [
      { name: 'Claude Code', lvl: 3, icon: 'anthropic' },
      { name: 'WordPress / Framer', lvl: 3, icons: ['wordpress', 'framer'] },
      { name: 'Git / GitHub', lvl: 3, icons: ['git', 'github'] },
      { name: 'Next.js', lvl: 2, icon: 'nextdotjs' },
      { name: 'React.js', lvl: 2, icon: 'react' },
      { name: 'Three.js', lvl: 2, icon: 'threedotjs' },
    ],
  },
  {
    id: 'automation', label: 'Automation', color: '#fbbf24',
    skills: [
      { name: 'Zapier', lvl: 3, icon: 'zapier' },
      { name: 'n8n', lvl: 3, icon: 'n8n' },
      { name: 'Google API', lvl: 3, icon: 'google' },
      { name: 'API Integration', lvl: 3, icon: 'postman' },
      { name: 'Webhooks', lvl: 2, icon: 'webhooks' },
    ],
  },
]

const ICON_BASE = 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons'

function LeafIcons({ skill }) {
  const list = skill.icons || [skill.icon]
  return (
    <span className={styles.leafIcons}>
      {list.map((slug) => (
        <span className={styles.iconSlot} key={slug}>
          <img
            src={`${ICON_BASE}/${slug}.svg`}
            alt=""
            className={styles.leafIcon}
            loading="lazy"
            onError={(e) => e.currentTarget.parentElement.classList.add(styles.broken)}
          />
          <span className={styles.fallback}>{skill.name[0]}</span>
        </span>
      ))}
    </span>
  )
}

export default function Skills() {
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [active, setActive] = useState(null)
  const [breathe, setBreathe] = useState(false)
  const breatheRef = useRef(null)
  const triggerBreathe = () => {
    setBreathe(true)
    clearTimeout(breatheRef.current)
    breatheRef.current = setTimeout(() => setBreathe(false), 4000)
  }

  return (
    <section id="skills" className={styles.skills} ref={ref}>
      <div className={styles.inner}>
        <motion.span
          className={styles.label}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          Skills
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          A toolkit,<br />
          <span className={styles.accent}>branch by branch.</span>
        </motion.h2>

        <div
          className={[styles.tree, inView ? styles.drawn : '', breathe ? styles.breathing : ''].filter(Boolean).join(' ')}
          onMouseLeave={() => setActive(null)}
        >
          <div className={styles.root} onMouseEnter={triggerBreathe}>
            <span className={styles.rootDot} />
            <span className={styles.rootLabel}>Skills</span>
          </div>

          <div className={styles.trunk} />

          <div className={styles.branches}>
            {CATEGORIES.map((cat) => {
              const dim = active && active !== cat.id
              return (
                <div
                  key={cat.id}
                  className={`${styles.row} ${active === cat.id ? styles.activeRow : ''} ${dim ? styles.dim : ''}`}
                  style={{ '--accent': cat.color }}
                  onMouseEnter={() => setActive(cat.id)}
                >
                  <div className={styles.catNode}>
                    <span className={styles.catDot} />
                    <span className={styles.catLabel}>{cat.label}</span>
                  </div>

                  <span className={styles.branch} />

                  <div className={styles.leaves}>
                    {cat.skills.map((skill) => {
                      const [levelText, pct] = LEVELS[skill.lvl]
                      return (
                        <div className={styles.leaf} key={skill.name} title={levelText}>
                          <LeafIcons skill={skill} />
                          <div className={styles.leafText}>
                            <span className={styles.leafName}>{skill.name}</span>
                            <span className={styles.levelBar}>
                              <span className={styles.levelFill} style={{ width: `${pct}%` }} />
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

