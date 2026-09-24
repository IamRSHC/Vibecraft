import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useReducedMotion } from 'framer-motion'
import HologramTimer from './HologramTimer'
import type { TimerView } from '../lib/timer'
import { useVoxelTextures, GrassBlock, Character, Creeper, Torch, FloatBlock } from './voxel/parts'

interface Props {
  view: TimerView
  label: string
  live: boolean
}

function Scene({ reduce }: { reduce: boolean }) {
  const tex = useVoxelTextures()
  const grass: [number, number, number][] = []
  for (let x = -1; x <= 2; x++) for (let z = -1; z <= 2; z++) grass.push([x - 0.5, -0.5, z - 0.5])

  return (
    <group>
      <hemisphereLight args={['#b9c6ff', '#26243a', 0.55]} />
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[5, 8, 4]}
        intensity={1.15}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={25}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />

      {grass.map((p, i) => (
        <GrassBlock key={i} position={p} tex={tex} />
      ))}
      <mesh position={[0.5, -1.6, 0.5]} receiveShadow castShadow>
        <boxGeometry args={[4, 1.2, 4]} />
        <meshStandardMaterial map={tex.dirt} />
      </mesh>

      <Torch reduce={reduce} />

      <Character
        position={[-0.9, 0, 0.35]}
        rotation={0.35}
        face={tex.steveFace}
        skin="#b58863"
        shirt="#1f8a8f"
        pants="#3a3a8c"
        hair="#3a2a16"
        reduce={reduce}
        phase={0}
      />
      <Character
        position={[0.95, 0, 0.15]}
        rotation={-0.4}
        face={tex.alexFace}
        skin="#d3a074"
        shirt="#4c7a2e"
        pants="#6b5a3a"
        hair="#b5651d"
        armW={0.2}
        reduce={reduce}
        phase={1.5}
      />
      <Creeper position={[1.7, 0, -1.1]} tex={tex} reduce={reduce} />

      <FloatBlock position={[-1.9, 1.8, 0.4]} map={tex.tnt} reduce={reduce} />
      <FloatBlock position={[1.9, 2.2, -0.2]} color="#54d0e6" emissive="#2aa9c9" reduce={reduce} />
      <FloatBlock position={[0.1, 2.7, -1.1]} color="#7c4dff" emissive="#5a2ec9" reduce={reduce} />
      <FloatBlock position={[-1.3, 2.5, -1.2]} color="#ffcf3f" emissive="#e0a000" reduce={reduce} />
    </group>
  )
}

export default function VoxelDiorama({ view, label, live }: Props) {
  const reduce = useReducedMotion() ?? false

  return (
    <div className="diorama" style={{ position: 'relative', width: '100%', maxWidth: 540, margin: '0 auto' }}>
      <div style={{ width: '100%', height: 'clamp(320px, 60vw, 460px)' }}>
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          camera={{ position: [5.5, 4.4, 6], fov: 34 }}
          frameloop={reduce ? 'demand' : 'always'}
        >
          <Suspense fallback={null}>
            <Scene reduce={reduce} />
          </Suspense>
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            autoRotate={!reduce}
            autoRotateSpeed={0.6}
            target={[0.2, 0.9, 0]}
            minPolarAngle={Math.PI / 3.4}
            maxPolarAngle={Math.PI / 2.15}
          />
        </Canvas>
      </div>

      <div
        style={{
          position: 'absolute',
          top: '1%',
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
        }}
      >
        <HologramTimer view={view} label={label} live={live} />
      </div>
    </div>
  )
}
