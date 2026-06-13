'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './Navbar.module.scss'

const LINKS = ['About','Skills','Projects','Experience','Contact']

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false)
  const [open,       setOpen]       = useState(false)
  const [activeLink, setActiveLink] = useState('')
  const [hovered,    setHovered]    = useState(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = LINKS.map(l => document.getElementById(l.toLowerCase())).filter(Boolean)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id.charAt(0).toUpperCase() + entry.target.id.slice(1))
          }
        })
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    )
    sections.forEach(s => observer.observe(s))
    return () => sections.forEach(s => observer.unobserve(s))
  }, [])

  const scrollTo = (id) => {
    setOpen(false)
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.nav
      className={styles.navWrapper}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5, ease: [0.16,1,0.3,1] }}
    >
      <motion.div
        className={[styles.island, scrolled ? styles.scrolled : ''].join(' ')}
        layout
        transition={{ type: 'spring', stiffness: 400, damping: 40 }}
      >
        <button className={styles.logo} onClick={() => window.scrollTo({ top:0, behavior:'smooth' })}>
          KS<span className={styles.dot}>.</span>
        </button>

        <div className={styles.divider} />

        <ul className={styles.links} onMouseLeave={() => setHovered(null)}>
          {LINKS.map((l, i) => (
            <motion.li key={l}
              initial={{ opacity:0, y:-8 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay: 0.7 + i * 0.07 }}
            >
              <button
                className={[styles.linkBtn, activeLink === l ? styles.active : ''].join(' ')}
                onClick={() => scrollTo(l)}
                onMouseEnter={() => setHovered(l)}
              >
                {hovered === l && (
                  <motion.span
                    className={styles.hoverBg}
                    layoutId="hoverBg"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className={styles.linkText}>{l}</span>
                {activeLink === l && (
                  <motion.span
                    className={styles.activeDot}
                    layoutId="activeDot"
                    transition={{ type:'spring', stiffness:380, damping:30 }}
                  />
                )}
              </button>
            </motion.li>
          ))}
        </ul>

        <button className={styles.burger} onClick={() => setOpen(!open)}>
          <span className={open ? styles.open : ''} />
          <span className={open ? styles.open : ''} />
          <span className={open ? styles.open : ''} />
        </button>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div className={styles.mobile}
            initial={{ opacity:0, scale:0.95, y:-10 }}
            animate={{ opacity:1, scale:1,    y:0 }}
            exit={{    opacity:0, scale:0.95, y:-10 }}
            transition={{ duration:0.25, ease:[0.16,1,0.3,1] }}
          >
            {LINKS.map(l => (
              <button
                key={l}
                onClick={() => scrollTo(l)}
                className={activeLink === l ? styles.mobileActive : ''}>
                {l}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
