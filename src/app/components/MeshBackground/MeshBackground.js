'use client'
import { useEffect, useRef } from 'react'

export default function MeshBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let W, H

    const resize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    let cursorX = null
    let cursorY = null
    let smoothX = 0
    let smoothY = 0

    window.addEventListener('mousemove', (e) => {
      cursorX = e.clientX
      cursorY = e.clientY
    })

    const bodies = [
      { color: '10,70,255',  alpha: 0.52, size: 200 },
      { color: '0,170,255',  alpha: 0.50, size: 140 },
      { color: '15,35,175',  alpha: 0.42, size: 260 },
      { color: '70,130,255', alpha: 0.58, size: 95  },
      { color: '5,50,200',   alpha: 0.36, size: 300 },
      { color: '0,210,195',  alpha: 0.44, size: 115 },
      { color: '50,90,235',  alpha: 0.46, size: 160 },
    ]

    bodies.forEach((b, i) => {
      const angle = (i / bodies.length) * Math.PI * 2
      b.x = W * 0.5 + Math.cos(angle) * W * 0.28
      b.y = H * 0.5 + Math.sin(angle) * H * 0.22
      b.vx = 0
      b.vy = 0
    })

    let lastT = Date.now()

    function draw() {
      const now = Date.now()
      const dt = Math.min(now - lastT, 40)
      lastT = now

      const tx = cursorX !== null ? cursorX : W * 0.5
      const ty = cursorY !== null ? cursorY : H * 0.5
      smoothX += (tx - smoothX) * 0.06
      smoothY += (ty - smoothY) * 0.06

      bodies.forEach((b) => {
        const radius = b.size * (W / 1440)

        const dcx = smoothX - b.x
        const dcy = smoothY - b.y
        const distC = Math.sqrt(dcx * dcx + dcy * dcy) + 0.001

        const proximity = Math.max(0, 1 - distC / (W * 0.38))
        const dynAlpha = b.alpha * (0.25 + proximity * 0.75)

        const attractF = 0.000065
        b.vx += (dcx / distC) * distC * attractF
        b.vy += (dcy / distC) * distC * attractF

        bodies.forEach((other) => {
          if (other === b) return
          const otherRadius = other.size * (W / 1440)
          const minDist = (radius + otherRadius) * 0.9
          const dx = b.x - other.x
          const dy = b.y - other.y
          const dist = Math.sqrt(dx * dx + dy * dy) + 0.001
          if (dist < minDist) {
            const force = (minDist - dist) / minDist * 0.012
            b.vx += (dx / dist) * force
            b.vy += (dy / dist) * force
          }
        })

        const margin = radius * 0.5
        if (b.x < margin)     b.vx += 0.008
        if (b.x > W - margin) b.vx -= 0.008
        if (b.y < margin)     b.vy += 0.008
        if (b.y > H - margin) b.vy -= 0.008

        b.vx *= 0.91
        b.vy *= 0.91

        b.x += b.vx * dt
        b.y += b.vy * dt

        b._dynAlpha = dynAlpha
        b._radius = radius
      })

      ctx.clearRect(0, 0, W, H)

      bodies.forEach((b) => {
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b._radius)
        grad.addColorStop(0,    `rgba(${b.color}, ${b._dynAlpha.toFixed(2)})`)
        grad.addColorStop(0.30, `rgba(${b.color}, ${(b._dynAlpha * 0.4).toFixed(2)})`)
        grad.addColorStop(0.65, `rgba(${b.color}, 0.04)`)
        grad.addColorStop(1,    `rgba(${b.color}, 0)`)

        ctx.beginPath()
        ctx.arc(b.x, b.y, b._radius, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()
      })

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
