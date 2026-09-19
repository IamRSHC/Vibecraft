import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

/* ---------- pixel texture helpers (NearestFilter = crisp Minecraft look) ---------- */
export function pixelTexture(size: number, draw: (ctx: CanvasRenderingContext2D, s: number) => void) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d') as CanvasRenderingContext2D
  draw(ctx, size)
  const t = new THREE.CanvasTexture(c)
  t.magFilter = THREE.NearestFilter
  t.minFilter = THREE.NearestFilter
  t.colorSpace = THREE.SRGBColorSpace
  return t
}
function speckle(ctx: CanvasRenderingContext2D, s: number, palette: string[], n: number) {
  for (let i = 0; i < n; i++) {
    ctx.fillStyle = palette[(Math.random() * palette.length) | 0]
    ctx.fillRect((Math.random() * s) | 0, (Math.random() * s) | 0, 1, 1)
  }
}

export function useVoxelTextures() {
  return useMemo(() => {
    const grassTop = pixelTexture(16, (ctx, s) => {
      ctx.fillStyle = '#5a9b39'
      ctx.fillRect(0, 0, s, s)
      speckle(ctx, s, ['#6fb04a', '#4e8c30', '#66a840', '#569636'], 80)
    })
    const dirt = pixelTexture(16, (ctx, s) => {
      ctx.fillStyle = '#79542f'
      ctx.fillRect(0, 0, s, s)
      speckle(ctx, s, ['#6b4826', '#875e35', '#5f4020', '#916640'], 70)
    })
    const grassSide = pixelTexture(16, (ctx, s) => {
      ctx.fillStyle = '#79542f'
      ctx.fillRect(0, 0, s, s)
      speckle(ctx, s, ['#6b4826', '#875e35', '#5f4020'], 60)
      ctx.fillStyle = '#5a9b39'
      ctx.fillRect(0, 0, s, 4)
      for (let x = 0; x < s; x++) {
        if (Math.random() > 0.5) ctx.fillRect(x, 4, 1, 1)
        if (Math.random() > 0.75) ctx.fillRect(x, 5, 1, 1)
      }
      speckle(ctx, s, ['#6fb04a', '#4e8c30'], 12)
    })
    const tnt = pixelTexture(16, (ctx, s) => {
      ctx.fillStyle = '#c0392b'
      ctx.fillRect(0, 0, s, s)
      speckle(ctx, s, ['#a93226', '#cb4335'], 40)
      ctx.fillStyle = '#f5f0e6'
      ctx.fillRect(0, 6, s, 5)
      ctx.fillStyle = '#1b140c'
      ctx.font = 'bold 5px monospace'
      ctx.fillText('TNT', 2, 10.5)
    })
    const steveFace = pixelTexture(8, (ctx) => {
      ctx.fillStyle = '#b58863'
      ctx.fillRect(0, 0, 8, 8)
      ctx.fillStyle = '#3a2a16'
      ctx.fillRect(0, 0, 8, 2)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(1, 3, 2, 2)
      ctx.fillRect(5, 3, 2, 2)
      ctx.fillStyle = '#4a3aa0'
      ctx.fillRect(2, 3, 1, 2)
      ctx.fillRect(5, 3, 1, 2)
      ctx.fillStyle = '#7a5030'
      ctx.fillRect(3, 6, 2, 1)
    })
    const alexFace = pixelTexture(8, (ctx) => {
      ctx.fillStyle = '#d3a074'
      ctx.fillRect(0, 0, 8, 8)
      ctx.fillStyle = '#b5651d'
      ctx.fillRect(0, 0, 8, 2)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(1, 3, 2, 2)
      ctx.fillRect(5, 3, 2, 2)
      ctx.fillStyle = '#2e7d32'
      ctx.fillRect(2, 3, 1, 2)
      ctx.fillRect(5, 3, 1, 2)
      ctx.fillStyle = '#9a6540'
      ctx.fillRect(3, 6, 2, 1)
    })
    const creeperFace = pixelTexture(8, (ctx) => {
      ctx.fillStyle = '#5aad42'
      ctx.fillRect(0, 0, 8, 8)
      speckle(ctx, 8, ['#4f9b3a', '#6fbf4f', '#468f34'], 16)
      ctx.fillStyle = '#0e1a0b'
      ctx.fillRect(1, 2, 2, 2)
      ctx.fillRect(5, 2, 2, 2)
      ctx.fillRect(3, 4, 2, 3)
      ctx.fillRect(2, 5, 1, 2)
      ctx.fillRect(5, 5, 1, 2)
    })
    return { grassTop, dirt, grassSide, tnt, steveFace, alexFace, creeperFace }
  }, [])
}

export type Tex = ReturnType<typeof useVoxelTextures>

/* ---------- a grass block (grass top, dirt bottom, grassy sides) ---------- */
export function GrassBlock({ position, tex }: { position: [number, number, number]; tex: Tex }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial attach="material-0" map={tex.grassSide} />
      <meshStandardMaterial attach="material-1" map={tex.grassSide} />
      <meshStandardMaterial attach="material-2" map={tex.grassTop} />
      <meshStandardMaterial attach="material-3" map={tex.dirt} />
      <meshStandardMaterial attach="material-4" map={tex.grassSide} />
      <meshStandardMaterial attach="material-5" map={tex.grassSide} />
    </mesh>
  )
}

/* ---------- a blocky character (Steve / Alex) ---------- */
export function Character({
  position,
  rotation = 0,
  face,
  skin,
  shirt,
  pants,
  hair,
  armW = 0.24,
  reduce,
  phase = 0,
}: {
  position: [number, number, number]
  rotation?: number
  face: THREE.Texture
  skin: string
  shirt: string
  pants: string
  hair: string
  armW?: number
  reduce: boolean
  phase?: number
}) {
  const g = useRef<THREE.Group>(null)
  const armL = useRef<THREE.Group>(null)
  const armR = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (reduce || !g.current) return
    const t = state.clock.elapsedTime + phase
    g.current.position.y = position[1] + Math.sin(t * 1.6) * 0.03
    const sw = Math.sin(t * 1.6) * 0.25
    if (armL.current) armL.current.rotation.x = sw
    if (armR.current) armR.current.rotation.x = -sw
  })
  return (
    <group ref={g} position={position} rotation={[0, rotation, 0]}>
      <mesh position={[-0.14, 0.36, 0]} castShadow>
        <boxGeometry args={[0.26, 0.72, 0.26]} />
        <meshStandardMaterial color={pants} />
      </mesh>
      <mesh position={[0.14, 0.36, 0]} castShadow>
        <boxGeometry args={[0.26, 0.72, 0.26]} />
        <meshStandardMaterial color={pants} />
      </mesh>
      <mesh position={[0, 1.06, 0]} castShadow>
        <boxGeometry args={[0.54, 0.72, 0.28]} />
        <meshStandardMaterial color={shirt} />
      </mesh>
      <group ref={armL} position={[-0.39, 1.42, 0]}>
        <mesh position={[0, -0.36, 0]} castShadow>
          <boxGeometry args={[armW, 0.72, 0.26]} />
          <meshStandardMaterial color={shirt} />
        </mesh>
      </group>
      <group ref={armR} position={[0.39, 1.42, 0]}>
        <mesh position={[0, -0.36, 0]} castShadow>
          <boxGeometry args={[armW, 0.72, 0.26]} />
          <meshStandardMaterial color={shirt} />
        </mesh>
      </group>
      <mesh position={[0, 1.75, 0]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial attach="material-0" color={skin} />
        <meshStandardMaterial attach="material-1" color={skin} />
        <meshStandardMaterial attach="material-2" color={hair} />
        <meshStandardMaterial attach="material-3" color={skin} />
        <meshStandardMaterial attach="material-4" map={face} />
        <meshStandardMaterial attach="material-5" color={hair} />
      </mesh>
    </group>
  )
}

export function Creeper({
  position,
  tex,
  reduce,
}: {
  position: [number, number, number]
  tex: Tex
  reduce: boolean
}) {
  const g = useRef<THREE.Group>(null)
  useFrame((s) => {
    if (reduce || !g.current) return
    g.current.position.y = position[1] + Math.sin(s.clock.elapsedTime * 1.2 + 2) * 0.03
  })
  const green = '#5aad42'
  return (
    <group ref={g} position={position} scale={0.8}>
      <mesh position={[0, 1.3, 0]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial attach="material-0" color={green} />
        <meshStandardMaterial attach="material-1" color={green} />
        <meshStandardMaterial attach="material-2" color={green} />
        <meshStandardMaterial attach="material-3" color={green} />
        <meshStandardMaterial attach="material-4" map={tex.creeperFace} />
        <meshStandardMaterial attach="material-5" color={green} />
      </mesh>
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[0.42, 0.9, 0.24]} />
        <meshStandardMaterial color={green} />
      </mesh>
      {[
        [-0.12, 0.15, 0.14],
        [0.12, 0.15, 0.14],
        [-0.12, 0.15, -0.14],
        [0.12, 0.15, -0.14],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} castShadow>
          <boxGeometry args={[0.2, 0.3, 0.2]} />
          <meshStandardMaterial color={green} />
        </mesh>
      ))}
    </group>
  )
}

export function Torch({ reduce, position = [0, 0, -1.15] }: { reduce: boolean; position?: [number, number, number] }) {
  const light = useRef<THREE.PointLight>(null)
  useFrame((s) => {
    if (reduce || !light.current) return
    light.current.intensity = 6 + Math.sin(s.clock.elapsedTime * 12) * 2 + Math.random() * 1.2
  })
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.12, 1, 0.12]} />
        <meshStandardMaterial color="#6b4a2a" />
      </mesh>
      <mesh position={[0, 1.06, 0]}>
        <boxGeometry args={[0.18, 0.18, 0.18]} />
        <meshStandardMaterial color="#ff9130" emissive="#ff7a1a" emissiveIntensity={2} />
      </mesh>
      <pointLight ref={light} position={[0, 1.2, 0]} color="#ff9a3c" intensity={6} distance={6} decay={2} castShadow />
    </group>
  )
}

export function FloatBlock({
  position,
  color,
  map,
  emissive,
  reduce,
}: {
  position: [number, number, number]
  color?: string
  map?: THREE.Texture
  emissive?: string
  reduce: boolean
}) {
  const inner = (
    <mesh castShadow>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color={color} map={map} emissive={emissive} emissiveIntensity={emissive ? 0.4 : 0} />
    </mesh>
  )
  if (reduce) return <group position={position}>{inner}</group>
  return (
    <Float position={position} speed={2} rotationIntensity={1.2} floatIntensity={1.4}>
      {inner}
    </Float>
  )
}
