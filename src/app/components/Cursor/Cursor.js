'use client'
import { useEffect, useRef } from 'react'
import styles from './Cursor.module.scss'

export default function Cursor() {
  const ringRef  = useRef(null)
  const dotRef   = useRef(null)
  const mouse    = useRef({ x: -100, y: -100 })
  const ring     = useRef({ x: -100, y: -100 })
  const rafRef   = useRef(null)

  useEffect(() => {
    const move = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.transform =
          'translate(' + (e.clientX - 4) + 'px, ' + (e.clientY - 4) + 'px)'
      }
    }
    window.addEventListener('mousemove', move)

    const animate = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.12
      ring.current.y += (mouse.current.y - ring.current.y) * 0.12
      if (ringRef.current) {
        ringRef.current.style.transform =
          'translate(' + (ring.current.x - 16) + 'px, ' + (ring.current.y - 16) + 'px)'
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    const grow = () => { if (ringRef.current) ringRef.current.classList.add(styles.grow) }
    const shrink = () => { if (ringRef.current) ringRef.current.classList.remove(styles.grow) }
    document.querySelectorAll('a,button').forEach(el => {
      el.addEventListener('mouseenter', grow)
      el.addEventListener('mouseleave', shrink)
    })

    return () => {
      window.removeEventListener('mousemove', move)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <>
      <div ref={ringRef} className={styles.ring} />
      <div ref={dotRef}  className={styles.dot}  />
    </>
  )
}
