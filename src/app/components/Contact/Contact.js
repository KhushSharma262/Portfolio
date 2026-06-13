'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import dynamic from 'next/dynamic'
import styles from './Contact.module.scss'

const Globe = dynamic(() => import('./Globe'), {
  ssr: false,
  loading: () => <div className={styles.globeFallback} />,
})

// TODO: replace href values with your real links
const LINKS = [
  {
    id: 'email', label: 'Email', value: 'khushsharma262@gmail.com',
    href: 'mailto:khushsharma262@gmail.com', newTab: false, tint: '#4f8ef7',
    svg: <path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm9 7L4 6.5V18h16V6.5L12 12z" />,
  },
  {
    id: 'github', label: 'GitHub', value: '@KhushSharma262',
    href: 'https://github.com/KhushSharma262', newTab: true, tint: '#4f8ef7',
    img: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/github.svg',
  },
  {
    id: 'linkedin', label: 'LinkedIn', value: 'in/sharmakhush',
    href: 'https://www.linkedin.com/in/sharmakhush', newTab: true, tint: '#4f8ef7',
    img: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/linkedin.svg',
  },
  {
    id: 'resume', label: 'Resume', value: 'View in new tab',
    href: '/Khush_Sharma_Resume.pdf', newTab: true, tint: '#34d399',
    svg: <path d="M6 2h9l5 5v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm8 1.5V8h4.5L14 3.5zM8 13h8v1.5H8V13zm0 3h8v1.5H8V16z" />,
  },
]

export default function Contact() {
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="contact" className={styles.contact} ref={ref}>
      <div className={styles.inner}>
        <div className={styles.canvas}>
        <motion.span
          className={styles.label}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          Contact
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Let&apos;s build<br />
          <span className={styles.accent}>something.</span>
        </motion.h2>

          <div className={styles.grid}>
            <div className={styles.globeWrap}>
              <Globe />
            </div>

            <motion.div
              className={styles.connect}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3 className={styles.connectTitle}>Let&apos;s connect</h3>
              <p className={styles.connectText}>
                Open to internships, collaborations, and interesting problems.
                Reach out and I&apos;ll get back to you.
              </p>

              <div className={styles.links}>
                {LINKS.map((l) => (
                  <a
                    key={l.id}
                    href={l.href}
                    className={styles.link}
                    style={{ '--link-tint': l.tint }}
                    target={l.newTab ? '_blank' : undefined}
                    rel={l.newTab ? 'noreferrer' : undefined}
                  >
                    <span className={styles.linkIcon}>
                      {l.img
                        ? <img src={l.img} alt="" />
                        : <svg viewBox="0 0 24 24" fill="currentColor">{l.svg}</svg>}
                    </span>
                    <span className={styles.linkText}>
                      <span className={styles.linkLabel}>{l.label}</span>
                      <span className={styles.linkValue}>{l.value}</span>
                    </span>
                    <span className={styles.linkArrow}>↗</span>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}






