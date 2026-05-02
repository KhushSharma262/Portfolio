'use client'
import { useRef, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment } from '@react-three/drei'

function AvatarModel({ mouse }) {
  const group        = useRef()
  const smoothMouse  = useRef({ x: 0, y: 0 })
  const wipeAnim     = useRef({ active: false, t: 0 })
  const bonesReady   = useRef(false)

  const Head         = useRef()
  const Neck         = useRef()
  const Spine1       = useRef()
  const Spine2       = useRef()
  const LeftArm      = useRef()
  const RightArm     = useRef()
  const LeftForeArm  = useRef()
  const RightForeArm = useRef()
  const LeftShoulder = useRef()
  const RightShoulder= useRef()
  const LeftHand     = useRef()
  const RightHand    = useRef()

  const { scene } = useGLTF('/model/avatar_model.glb')

  useEffect(() => {
    scene.traverse((obj) => {
      if (!obj.isBone && obj.type !== 'Bone') return
      switch (obj.name) {
        case 'Head':           Head.current          = obj; break
        case 'Neck':           Neck.current          = obj; break
        case 'Spine1':         Spine1.current        = obj; break
        case 'Spine2':         Spine2.current        = obj; break
        case 'LeftArm':        LeftArm.current       = obj; break
        case 'RightArm':       RightArm.current      = obj; break
        case 'LeftForeArm':    LeftForeArm.current   = obj; break
        case 'RightForeArm':   RightForeArm.current  = obj; break
        case 'LeftShoulder':   LeftShoulder.current  = obj; break
        case 'RightShoulder':  RightShoulder.current = obj; break
        case 'LeftHand':       LeftHand.current      = obj; break
        case 'RightHand':      RightHand.current     = obj; break
      }
    })

    // Shoulders — natural relaxed drop
    if (LeftShoulder.current)  { LeftShoulder.current.rotation.z  =  0.1;  LeftShoulder.current.rotation.x  = -0.05 }
    if (RightShoulder.current) { RightShoulder.current.rotation.z = -0.1;  RightShoulder.current.rotation.x = -0.05 }

    // Arms down, forearms resting forward on table
    if (LeftArm.current)       { LeftArm.current.rotation.z  =  1.3;  LeftArm.current.rotation.x  =  0.4;  LeftArm.current.rotation.y  = -0.1 }
    if (RightArm.current)      { RightArm.current.rotation.z = -1.3;  RightArm.current.rotation.x =  0.4;  RightArm.current.rotation.y =  0.1 }

    // Forearms bent inward — clasped on table
    if (LeftForeArm.current)   { LeftForeArm.current.rotation.z  =  0.05; LeftForeArm.current.rotation.x  =  0.6;  LeftForeArm.current.rotation.y  =  0.5 }
    if (RightForeArm.current)  { RightForeArm.current.rotation.z = -0.05; RightForeArm.current.rotation.x =  0.6;  RightForeArm.current.rotation.y = -0.5 }

    // Hands clasped toward each other
    if (LeftHand.current)      { LeftHand.current.rotation.z  =  0.1;  LeftHand.current.rotation.y  =  0.35 }
    if (RightHand.current)     { RightHand.current.rotation.z = -0.1;  RightHand.current.rotation.y = -0.35 }

    // Slight forward lean like resting on table
    if (Spine1.current)        { Spine1.current.rotation.x =  0.08 }
    if (Spine2.current)        { Spine2.current.rotation.x =  0.06 }

    bonesReady.current = true
  }, [scene])

  useFrame((state, delta) => {
    if (!bonesReady.current) return
    const t = state.clock.getElapsedTime()

    smoothMouse.current.x += (mouse.current.x - smoothMouse.current.x) * 0.05
    smoothMouse.current.y += (mouse.current.y - smoothMouse.current.y) * 0.05
    const mx = smoothMouse.current.x
    const my = smoothMouse.current.y

    // Breathing
    const breath = Math.sin(t * 1.1) * 0.008
    if (Spine1.current) Spine1.current.rotation.x = 0.08 + breath
    if (Spine2.current) Spine2.current.rotation.x = 0.06 + breath * 0.6

    // Wipe anim
    if (wipeAnim.current.active) {
      wipeAnim.current.t += delta * 2.8
      const wt    = wipeAnim.current.t
      const decay = Math.max(0, 1 - wt * 0.3)
      if (RightArm.current)     { RightArm.current.rotation.z     = -1.3 + Math.sin(wt) * 1.1 * decay }
      if (RightForeArm.current) { RightForeArm.current.rotation.x =  0.6 - Math.sin(wt) * 0.4 * decay }
      if (Head.current)         { Head.current.rotation.y          = mx * 0.3 - Math.sin(wt * 0.5) * 0.25 * decay }
      if (wipeAnim.current.t > Math.PI * 1.6) {
        wipeAnim.current.active = false
        wipeAnim.current.t = 0
        if (RightArm.current)     { RightArm.current.rotation.z = -1.3; RightArm.current.rotation.x = 0.4 }
        if (RightForeArm.current) { RightForeArm.current.rotation.x = 0.6 }
      }
      return
    }

    // Head follows mouse — faces slightly right toward contact info
    if (Head.current)   { Head.current.rotation.y   += (mx * 0.28 + 0.18 - Head.current.rotation.y)   * 0.06; Head.current.rotation.x   += (-my * 0.15 - Head.current.rotation.x)   * 0.06 }
    if (Neck.current)   { Neck.current.rotation.y   += (mx * 0.1  + 0.08 - Neck.current.rotation.y)   * 0.04 }
    if (Spine2.current) { Spine2.current.rotation.y += (mx * 0.05 - Spine2.current.rotation.y) * 0.03 }

    // Subtle float
    if (group.current) group.current.position.y = Math.sin(t * 0.55) * 0.008
  })

  const triggerWipe = () => {
    if (!wipeAnim.current.active) { wipeAnim.current.active = true; wipeAnim.current.t = 0 }
  }

  return (
    <group ref={group} onPointerEnter={triggerWipe}>
      <primitive
        object={scene}
        scale={1.55}
        position={[-0.1, -1.38, 0]}
        rotation={[0, 0.32, 0]}
      />
    </group>
  )
}

export default function ContactAvatar({ mouse }) {
  return (
    <Canvas
      camera={{ position: [0, 0.18, 1.6], fov: 24 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 4, 4]}    intensity={0.7}  color='#e2e8f0' />
      <pointLight       position={[2, 2, -1]}   intensity={3.0}  color='#38bdf8' />
      <pointLight       position={[-2, 3, 1]}   intensity={0.8}  color='#818cf8' />
      <pointLight       position={[0, 6, 1]}    intensity={0.5}  color='#7dd3fc' />
      <Suspense fallback={null}>
        <AvatarModel mouse={mouse} />
        <Environment preset='city' />
      </Suspense>
    </Canvas>
  )
}
