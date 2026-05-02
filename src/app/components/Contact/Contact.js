'use client'
import { useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './Contact.module.scss'

function NightGlobe() {
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    let rot = 0

    const W = 520, H = 520
    canvas.width = W
    canvas.height = H
    const cx = W / 2, cy = H / 2, R = 200

    const TILT = 23.5 * Math.PI / 180

    const CONTINENT_POINTS = [
      ...gen(200, () => {
        const lat = 25 + Math.random() * 48
        const lng = -168 + Math.random() * 100
        return inNorthAmerica(lat, lng) ? [lat, lng] : null
      }),
      ...gen(160, () => {
        const lat = -55 + Math.random() * 68
        const lng = -82 + Math.random() * 46
        return inSouthAmerica(lat, lng) ? [lat, lng] : null
      }),
      ...gen(100, () => {
        const lat = 36 + Math.random() * 35
        const lng = -10 + Math.random() * 42
        return inEurope(lat, lng) ? [lat, lng] : null
      }),
      ...gen(200, () => {
        const lat = -35 + Math.random() * 73
        const lng = -18 + Math.random() * 58
        return inAfrica(lat, lng) ? [lat, lng] : null
      }),
      ...gen(300, () => {
        const lat = 5 + Math.random() * 70
        const lng = 26 + Math.random() * 140
        return inAsia(lat, lng) ? [lat, lng] : null
      }),
      ...gen(80, () => {
        const lat = -39 + Math.random() * 34
        const lng = 114 + Math.random() * 40
        return inAustralia(lat, lng) ? [lat, lng] : null
      }),
      ...gen(40, () => {
        const lat = 60 + Math.random() * 22
        const lng = -55 + Math.random() * 40
        return [lat, lng]
      }),
      ...gen(60, () => {
        const lat = -90 + Math.random() * 15
        const lng = -180 + Math.random() * 360
        return [lat, lng]
      }),
    ].filter(Boolean)

    const CITIES = [
      [40.7, -74.0], [34.0, -118.2], [41.8, -87.6], [51.0, -114.0],
      [19.4, -99.1], [25.7, -80.2], [45.5, -73.6], [49.2, -123.1],
      [-23.5, -46.6], [-34.6, -58.4], [-33.4, -70.6], [-12.0, -77.0],
      [4.7, -74.1], [10.5, -66.9],
      [51.5, -0.1], [48.8, 2.3], [52.5, 13.4], [40.4, -3.7],
      [41.9, 12.5], [59.9, 10.7], [55.7, 37.6], [52.3, 4.9],
      [50.8, 4.3], [48.2, 16.4], [41.0, 28.9], [59.3, 18.1],
      [60.2, 25.0], [53.3, -6.3], [38.7, -9.1], [45.4, 12.3],
      [30.0, 31.2], [6.4, 3.4], [-26.2, 28.0], [-33.9, 18.4],
      [33.9, -6.8], [36.8, 3.1], [-4.3, 15.3], [15.5, 32.5],
      [35.6, 139.7], [31.2, 121.4], [39.9, 116.4], [28.6, 77.2],
      [19.0, 72.8], [1.3, 103.8], [22.3, 114.1], [37.5, 127.0],
      [13.7, 100.5], [14.6, 121.0], [3.1, 101.7], [24.7, 46.7],
      [25.2, 55.3], [23.6, 58.6], [17.4, 78.5], [12.9, 77.6],
      [33.3, 44.4], [33.5, 36.3], [31.8, 35.2], [41.3, 69.3],
      [43.2, 76.9], [55.0, 82.9], [56.8, 60.6],
      [-33.8, 151.2], [-37.8, 145.0], [-27.5, 153.0], [-31.9, 115.8],
      [-36.9, 174.8],
      [35.7, 139.7], [34.7, 135.5], [33.6, 130.4],
    ]

    function gen(n, fn) {
      const out = []
      let tries = 0
      while (out.length < n && tries < n * 10) {
        tries++
        const r = fn()
        if (r) out.push(r)
      }
      return out
    }

    function inNorthAmerica(lat, lng) {
      if (lat > 72 && (lng < -140 || lng > -60)) return false
      if (lat > 60 && lng > -60) return false
      if (lat < 30 && lng < -118) return false
      if (lat < 25 && (lng < -92 || lng > -77)) return false
      return true
    }

    function inSouthAmerica(lat, lng) {
      if (lat > 0 && lng < -78) return false
      if (lat > 10) return false
      if (lat < -20 && lng < -70) return false
      if (lat < -40 && (lng < -74 || lng > -62)) return false
      if (lat < -50 && (lng < -75 || lng > -64)) return false
      return true
    }

    function inEurope(lat, lng) {
      if (lat > 57 && lng > 28) return false
      if (lat < 36) return false
      if (lng > 32 && lat < 42) return false
      return true
    }

    function inAfrica(lat, lng) {
      if (lat > 20 && lng > 35) return false
      if (lat > 25 && lng < -5) return false
      if (lat < -20 && (lng < 10 || lng > 40)) return false
      if (lat < -30 && (lng < 15 || lng > 35)) return false
      return true
    }

    function inAsia(lat, lng) {
      if (lng < 26) return false
      if (lat > 55 && lng > 140) return false
      if (lat < 5 && (lng < 95 || lng > 141)) return false
      if (lat < 10 && lng > 141) return false
      if (lat > 20 && lng > 145) return false
      return true
    }

    function inAustralia(lat, lng) {
      if (lat > -10) return false
      if (lng < 114 || lng > 154) return false
      if (lat < -39 && (lng < 144 || lng > 148)) return false
      return true
    }

    function project(lat, lng, rotY) {
      const phi   = (90 - lat) * Math.PI / 180
      const theta = (lng + rotY) * Math.PI / 180
      let x = R * Math.sin(phi) * Math.cos(theta)
      let y = R * Math.cos(phi)
      let z = R * Math.sin(phi) * Math.sin(theta)
      const ty = y * Math.cos(TILT) - x * Math.sin(TILT)
      const tx = y * Math.sin(TILT) + x * Math.cos(TILT)
      return { x: tx, y: ty, z }
    }

    const SUN = { x: 1, y: 0.2, z: 0.5 }
    const sunLen = Math.sqrt(SUN.x**2 + SUN.y**2 + SUN.z**2)
    SUN.x /= sunLen; SUN.y /= sunLen; SUN.z /= sunLen

    function dot3(a, b) { return a.x * b.x + a.y * b.y + a.z * b.z }

    function draw() {
      ctx.clearRect(0, 0, W, H)

      const nightGrad = ctx.createRadialGradient(cx - 30, cy - 30, 10, cx, cy, R)
      nightGrad.addColorStop(0, '#0a1628')
      nightGrad.addColorStop(0.5, '#050e1e')
      nightGrad.addColorStop(1, '#020812')
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.fillStyle = nightGrad
      ctx.fill()

      const dayGrad = ctx.createRadialGradient(cx + 60, cy - 20, 0, cx + 60, cy, R * 1.2)
      dayGrad.addColorStop(0, 'rgba(30,80,160,0.7)')
      dayGrad.addColorStop(0.4, 'rgba(15,50,110,0.4)')
      dayGrad.addColorStop(1, 'rgba(5,20,60,0)')
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.fillStyle = dayGrad
      ctx.fill()

      const allPts = CONTINENT_POINTS.map(([lat, lng]) => {
        const p = project(lat, lng, rot)
        const nx = p.x / R, ny = p.y / R, nz = p.z / R
        const light = Math.max(0, dot3({ x: nx, y: ny, z: nz }, SUN))
        return { sx: cx + p.x, sy: cy - p.y, z: p.z, light, isCity: false }
      })

      const cityPts = CITIES.map(([lat, lng]) => {
        const p = project(lat, lng, rot)
        const nx = p.x / R, ny = p.y / R, nz = p.z / R
        const light = Math.max(0, dot3({ x: nx, y: ny, z: nz }, SUN))
        return { sx: cx + p.x, sy: cy - p.y, z: p.z, light, isCity: true }
      })

      allPts.forEach(({ sx, sy, z, light }) => {
        if (z < 0) return
        const depth = (z + R) / (2 * R)
        if (light > 0.15) {
          const green = Math.floor(120 + light * 80)
          const r2    = Math.floor(60 + light * 60)
          ctx.beginPath()
          ctx.arc(sx, sy, 0.9 + depth * 0.6, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${r2},${green},60,${0.5 + light * 0.5})`
          ctx.fill()
        } else {
          ctx.beginPath()
          ctx.arc(sx, sy, 0.7, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(30,50,30,${0.15 + depth * 0.2})`
          ctx.fill()
        }
      })

      cityPts.forEach(({ sx, sy, z, light }) => {
        if (z < 0) return
        const depth = (z + R) / (2 * R)
        if (light < 0.3) {
          const alpha  = (0.3 - light) / 0.3
          const size   = 2.5 + depth * 2
          const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, size * 3.5)
          glow.addColorStop(0, `rgba(255,210,80,${alpha * 0.9})`)
          glow.addColorStop(0.4, `rgba(255,160,40,${alpha * 0.4})`)
          glow.addColorStop(1, 'rgba(255,120,20,0)')
          ctx.beginPath()
          ctx.arc(sx, sy, size * 3.5, 0, Math.PI * 2)
          ctx.fillStyle = glow
          ctx.fill()
          ctx.beginPath()
          ctx.arc(sx, sy, size * 0.6, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255,240,180,${alpha})`
          ctx.fill()
        } else {
          ctx.beginPath()
          ctx.arc(sx, sy, 1.2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(200,180,100,${light * 0.5})`
          ctx.fill()
        }
      })

      const termX = cx + R * 0.15
      const termGrad = ctx.createLinearGradient(termX - 60, 0, termX + 60, 0)
      termGrad.addColorStop(0, 'rgba(20,60,140,0)')
      termGrad.addColorStop(0.4, 'rgba(255,140,40,0.06)')
      termGrad.addColorStop(0.5, 'rgba(255,180,80,0.1)')
      termGrad.addColorStop(0.6, 'rgba(255,140,40,0.06)')
      termGrad.addColorStop(1, 'rgba(20,60,140,0)')
      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.clip()
      ctx.fillStyle = termGrad
      ctx.fillRect(termX - 60, cy - R, 120, R * 2)
      ctx.restore()

      const atmo = ctx.createRadialGradient(cx, cy, R - 4, cx, cy, R + 22)
      atmo.addColorStop(0, 'rgba(80,160,255,0.22)')
      atmo.addColorStop(0.5, 'rgba(60,120,220,0.08)')
      atmo.addColorStop(1, 'rgba(30,80,180,0)')
      ctx.beginPath()
      ctx.arc(cx, cy, R + 22, 0, Math.PI * 2)
      ctx.fillStyle = atmo
      ctx.fill()

      const sunAtmo = ctx.createRadialGradient(cx + R * 0.6, cy, 0, cx + R * 0.6, cy, R * 0.8)
      sunAtmo.addColorStop(0, 'rgba(255,200,100,0.06)')
      sunAtmo.addColorStop(1, 'rgba(255,200,100,0)')
      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.clip()
      ctx.fillStyle = sunAtmo
      ctx.fillRect(cx - R, cy - R, R * 2, R * 2)
      ctx.restore()

      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(100,180,255,0.25)'
      ctx.lineWidth = 1
      ctx.stroke()

      const spec = ctx.createRadialGradient(cx - 70, cy - 70, 0, cx - 50, cy - 50, 110)
      spec.addColorStop(0, 'rgba(200,230,255,0.09)')
      spec.addColorStop(1, 'rgba(200,230,255,0)')
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.fillStyle = spec
      ctx.fill()

      rot += 0.08
      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animId)
  }, [])

  return <canvas ref={canvasRef} className={styles.globe} />
}

export default function Contact() {
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id='contact' className={styles.contact} ref={ref}>
      <div className={styles.inner}>

        {/* Desktop: globe in left column */}
        <motion.div
          className={styles.left}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>
          <div className={styles.globeWrap}>
            <NightGlobe />
            <div className={styles.globeGlow} />
          </div>
        </motion.div>

        {/* Mobile: globe behind content */}
        <div className={styles.mobileGlobeBg} aria-hidden='true'>
          <NightGlobe />
        </div>

        <div className={styles.right}>
          <div className={styles.glassBox}>
            <motion.span className={styles.label}
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.6 }}>
              Contact
            </motion.span>

            <motion.h2 className={styles.heading}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>
              Lets talk.
            </motion.h2>

            <motion.p className={styles.sub}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}>
              Open for full-time roles, freelance projects,<br />and interesting collaborations.
            </motion.p>

            <motion.div className={styles.links}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}>
              {[
                { label: 'GitHub',   href: 'https://github.com/KhushSharma262',          sub: 'KhushSharma262'           },
                { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sharmakhush/',    sub: 'Khush Sharma'             },
                { label: 'Email',    href: 'mailto:khushsharma262@gmail.com',             sub: 'khushsharma262@gmail.com' },
              ].map((l, i) => (
                <motion.a key={l.label} href={l.href} target='_blank' rel='noreferrer'
                  className={styles.link}
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  whileHover={{ x: 6 }}>
                  <div>
                    <span className={styles.linkLabel}>{l.label}</span>
                    <span className={styles.linkSub}>{l.sub}</span>
                  </div>
                  <span className={styles.arrow}>→</span>
                </motion.a>
              ))}
            </motion.div>

            <motion.a href='/Khush_Sharma_Resume.pdf' target='_blank'
              className={styles.resumeBtn}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}>
              Download Resume ↓
            </motion.a>
          </div>
        </div>

      </div>
    </section>
  )
}
