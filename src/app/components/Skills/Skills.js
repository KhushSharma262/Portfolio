'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './Skills.module.scss'

const SKILLS = [
  {
    category: 'Languages',
    color: '#38bdf8',
    icon: '</>',
    items: ['Python', 'R', 'C++', 'C#'],
  },
  {
    category: 'AI & ML',
    color: '#c084fc',
    icon: '⬡',
    items: ['LLMs', 'RAG', 'LangChain', 'PyTorch', 'TensorFlow', 'Scikit-learn', 'BERT', 'NLP', 'CNN', 'OpenCV', 'Supervised Learning', 'Neural Networks'],
  },
  {
    category: 'Automation',
    color: '#4ade80',
    icon: '⟳',
    items: ['Zapier', 'n8n', 'Webhooks', 'Google Sheets API', 'Google Drive API', 'Gmail API', 'OpenAI API', 'Flask'],
  },
  {
    category: 'Data & Analysis',
    color: '#f59e0b',
    icon: '▦',
    items: ['Pandas', 'EDA', 'Tableau', 'RStudio', 'Image Processing', 'Model Evaluation', 'Jira API'],
  },
  {
    category: 'Web & Backend',
    color: '#818cf8',
    icon: '◈',
    items: ['Streamlit', 'FastAPI', 'Next.js', 'React', 'WordPress', 'Framer'],
  },
  {
    category: 'Infrastructure',
    color: '#fb7185',
    icon: '⬙',
    items: ['Docker', 'AWS', 'PostgreSQL', 'Redis', 'Git', 'IoT Systems'],
  },
]

export default function Skills() {
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id='skills' className={styles.skills} ref={ref}>
      <div className={styles.inner}>
        <motion.span className={styles.label}
          initial={{ opacity:0 }} animate={inView ? { opacity:1 } : {}} transition={{ duration:0.6 }}>
          Skills
        </motion.span>

        <motion.h2 className={styles.h2}
          initial={{ opacity:0, y:24 }}
          animate={inView ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.8, delay:0.1, ease:[0.16,1,0.3,1] }}>
          The stack I think in.
        </motion.h2>

        <div className={styles.grid}>
          {SKILLS.map((group, gi) => (
            <motion.div key={group.category} className={styles.card}
              initial={{ opacity:0, y:40 }}
              animate={inView ? { opacity:1, y:0 } : {}}
              transition={{ duration:0.6, delay: 0.15 + gi * 0.08, ease:[0.16,1,0.3,1] }}
              style={{ '--accent-color': group.color }}
              whileHover={{ y:-6, transition: { duration: 0.2 } }}>

              <div className={styles.cardHeader}>
                <span className={styles.icon} style={{ color: group.color }}>{group.icon}</span>
                <span className={styles.category}>{group.category}</span>
                <span className={styles.count}>{group.items.length}</span>
              </div>

              <div className={styles.divider} style={{ background: group.color }} />

              <div className={styles.pills}>
                {group.items.map((item, ii) => (
                  <motion.span key={item} className={styles.pill}
                    style={{ '--c': group.color }}
                    initial={{ opacity:0, scale:0.75, y:10 }}
                    animate={inView ? { opacity:1, scale:1, y:0 } : {}}
                    transition={{ delay: 0.2 + gi * 0.08 + ii * 0.035, ease:[0.16,1,0.3,1] }}
                    whileHover={{ scale:1.08, transition:{ duration:0.15 } }}>
                    {item}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
