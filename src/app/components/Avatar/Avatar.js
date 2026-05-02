'use client'
import { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment, ContactShadows, Float } from '@react-three/drei'

function Model({ mouse }) {
  const group = useRef()
  const { scene } = useGLTF('/model/avatar_model.glb')

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.getElapsedTime()
    group.current.rotation.y +=
      (mouse.current.x * 0.4 - group.current.rotation.y) * 0.05
    group.current.rotation.x +=
      (mouse.current.y * 0.15 - group.current.rotation.x) * 0.05
    group.current.position.y = Math.sin(t * 0.5) * 0.06
  })

  return (
    <group ref={group}>
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.2}>
        <primitive object={scene} scale={1.8} position={[0, -1.6, 0]} />
      </Float>
    </group>
  )
}

function Fallback() {
  const mesh = useRef()
  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.rotation.y = clock.getElapsedTime() * 0.4
    }
  })
  return (
    <mesh ref={mesh}>
      <torusKnotGeometry args={[0.8, 0.25, 128, 32]} />
      <meshStandardMaterial color='#38bdf8' metalness={0.9} roughness={0.1} />
    </mesh>
  )
}

export default function AvatarCanvas({ mouse }) {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 3.5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]}  intensity={0.8} color='#e2e8f0' />
      <pointLight       position={[-3, 2, 2]} intensity={2.0} color='#38bdf8' />
      <pointLight       position={[3, -2,-2]} intensity={1.0} color='#818cf8' />
      <pointLight       position={[0, 4, 0]}  intensity={0.8} color='#7dd3fc' />

      <Suspense fallback={<Fallback />}>
        <Model mouse={mouse} />
        <Environment preset='city' />
        <ContactShadows
          position={[0, -1.8, 0]}
          opacity={0.4}
          scale={4}
          blur={2}
          color='#38bdf8'
        />
      </Suspense>
    </Canvas>
  )
}
