import { useMemo } from 'react'
import { motion } from 'framer-motion'

/* ---------- Traditional: dark filigree corner (drawn in currentColor) ---------- */
const leaf = (x, y, r, s = 1) => (
  <path
    transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}
    d="M0 0 C 8 -10, 24 -10, 34 0 C 24 10, 8 10, 0 0 Z"
  />
)
const flower = (x, y, s = 1, r = 0) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    {[0, 72, 144, 216, 288].map((a) => (
      <path key={a} transform={`rotate(${a})`} d="M0 0 C -7 -10, -6 -22, 0 -26 C 6 -22, 7 -10, 0 0 Z" />
    ))}
    <circle r="4" fill="var(--bg)" />
  </g>
)

export function FiligreeCorner({ className = '', style }) {
  return (
    <svg className={`ornament ${className}`} style={style} viewBox="0 0 300 300" fill="currentColor" aria-hidden="true">
      {/* main sweeping vine */}
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        d="M0 190 C 40 190, 70 150, 70 110 C 70 70, 40 60, 38 85 C 36 108, 62 110, 70 92
           M0 120 C 60 120, 110 90, 130 40 C 138 18, 120 2, 108 20 C 98 36, 118 48, 128 36
           M30 0 C 30 50, 70 70, 120 70 C 160 70, 185 50, 200 24
           M0 235 C 30 232, 52 215, 60 195"
      />
      {leaf(70, 112, -30)}
      {leaf(70, 112, 50, 0.8)}
      {leaf(110, 82, -60, 0.9)}
      {leaf(126, 48, 20, 0.8)}
      {leaf(30, 60, 70, 0.9)}
      {leaf(70, 70, -10, 1)}
      {leaf(150, 68, -45, 0.9)}
      {leaf(190, 42, -70, 0.75)}
      {leaf(20, 170, 20, 0.9)}
      {leaf(48, 160, -50, 0.9)}
      {leaf(40, 214, 30, 0.7)}
      {flower(86, 150, 1.1, 20)}
      {flower(150, 20, 0.9, 140)}
      {flower(204, 22, 0.55, 200)}
      {flower(16, 100, 0.7, 90)}
      {flower(24, 255, 0.55, 40)}
      {/* fleur */}
      <g transform="translate(150 118)">
        <path d="M0 -26 C 14 -12, 14 6, 0 26 C -14 6, -14 -12, 0 -26 Z" />
        <path d="M-6 6 C -26 -2, -34 -22, -22 -30 C -22 -14, -14 -6, -2 0 Z" />
        <path d="M6 6 C 26 -2, 34 -22, 22 -30 C 22 -14, 14 -6, 2 0 Z" />
        <circle r="5" cy="-4" fill="var(--bg)" />
      </g>
      {/* ink specks */}
      {[[210,90,2.5],[236,64,1.6],[190,140,2],[250,30,2.2],[120,180,1.8],[160,160,1.4]].map(([x,y,r],i)=>(<circle key={i} cx={x} cy={y} r={r}/>))}
    </svg>
  )
}

/* ---------- White wedding: watercolour sprig, sage + gold-foil leaves ---------- */
export function Sprig({ className = '', style, flip = false, variant = 0 }) {
  const leaves = useMemo(() => {
    const out = []
    const n = 9
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1)
      const x = 20 + t * 200
      const y = 150 - Math.sin(t * Math.PI * 0.9) * 90 + t * 10
      const side = i % 2 ? 1 : -1
      out.push({ x, y, r: side * (40 + (i * 13 + variant * 17) % 35) - 10, s: 0.75 + ((i * 7 + variant) % 5) * 0.1, gold: (i + variant) % 3 === 0 })
    }
    return out
  }, [variant])
  return (
    <svg className={`ornament sprig ${className}`} style={{ ...style, transform: `${flip ? 'scaleX(-1) ' : ''}${style?.transform || ''}` }} viewBox="0 0 240 200" aria-hidden="true">
      <defs>
        <linearGradient id={`gold${variant}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#f6e29b" />
          <stop offset=".5" stopColor="#c9a24a" />
          <stop offset="1" stopColor="#f1d983" />
        </linearGradient>
        <linearGradient id={`sage${variant}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#a9b69a" />
          <stop offset="1" stopColor="#6f7f62" />
        </linearGradient>
      </defs>
      <path d="M10 160 C 60 150, 100 120, 125 85 C 150 50, 190 40, 232 52" fill="none" stroke="#6f7f62" strokeWidth="1.6" strokeLinecap="round" />
      {leaves.map((l, i) => (
        <path
          key={i}
          transform={`translate(${l.x} ${l.y}) rotate(${l.r}) scale(${l.s})`}
          d="M0 0 C 10 -13, 30 -13, 44 0 C 30 13, 10 13, 0 0 Z"
          fill={l.gold ? `url(#gold${variant})` : `url(#sage${variant})`}
          opacity={l.gold ? 0.95 : 0.78}
          stroke={l.gold ? '#b8923a' : '#5c6c50'}
          strokeWidth="0.6"
        />
      ))}
      {[[70, 142, 3.5], [96, 118, 3], [160, 62, 3.2], [205, 46, 2.6]].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={`url(#gold${variant})`} />
      ))}
    </svg>
  )
}

/* Gold-dust sparkles drifting up (white theme) */
export function Sparkles({ count = 26 }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: (i * 37.7 + 11) % 100,
        size: 3 + ((i * 7) % 6),
        delay: -((i * 1.7) % 14),
        dur: 12 + ((i * 3) % 10),
        drift: ((i * 13) % 60) - 30,
      })),
    [count]
  )
  return (
    <div className="sparkles" aria-hidden="true">
      {items.map((s, i) => (
        <span key={i} style={{ left: `${s.left}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s`, animationDuration: `${s.dur}s`, '--drift': `${s.drift}px` }} />
      ))}
    </div>
  )
}

/* Falling petals / ink flecks (traditional theme) */
export function Petals({ count = 14 }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: (i * 53.3 + 7) % 100,
        size: 8 + ((i * 5) % 10),
        delay: -((i * 2.3) % 18),
        dur: 16 + ((i * 3) % 12),
        rot: (i * 47) % 360,
      })),
    [count]
  )
  return (
    <div className="petals" aria-hidden="true">
      {items.map((s, i) => (
        <i key={i} style={{ left: `${s.left}%`, width: s.size, height: s.size * 1.4, animationDelay: `${s.delay}s`, animationDuration: `${s.dur}s`, '--rot': `${s.rot}deg` }} />
      ))}
    </div>
  )
}

export function Divider() {
  return (
    <motion.div className="divider" aria-hidden="true" initial="h" whileInView="v" viewport={{ once: true }}>
      <motion.span variants={{ h: { scaleX: 0 }, v: { scaleX: 1 } }} transition={{ duration: 1, ease: 'easeOut' }} style={{ originX: 1 }} />
      <motion.svg viewBox="0 0 40 24" width="40" height="24" variants={{ h: { scale: 0, rotate: -90 }, v: { scale: 1, rotate: 0 } }} transition={{ duration: 0.9, delay: 0.3, type: 'spring' }}>
        <path d="M20 2 C 26 8, 26 16, 20 22 C 14 16, 14 8, 20 2 Z M4 12 C 10 6, 14 8, 17 12 C 14 16, 10 18, 4 12 Z M36 12 C 30 6, 26 8, 23 12 C 26 16, 30 18, 36 12 Z" fill="currentColor" />
      </motion.svg>
      <motion.span variants={{ h: { scaleX: 0 }, v: { scaleX: 1 } }} transition={{ duration: 1, ease: 'easeOut' }} style={{ originX: 0 }} />
    </motion.div>
  )
}

/* Text running around a circle, slowly rotating */
export function RingText({ text, className = '', size = 200 }) {
  const id = useMemo(() => 'ring' + Math.random().toString(36).slice(2, 7), [])
  return (
    <svg className={`ring-text ${className}`} viewBox="0 0 200 200" width={size} height={size} aria-hidden="true">
      <defs><path id={id} d="M100,100 m-70,0 a70,70 0 1,1 140,0 a70,70 0 1,1 -140,0" /></defs>
      <text><textPath href={`#${id}`} startOffset="0" textLength="436" lengthAdjust="spacing">{text}</textPath></text>
    </svg>
  )
}

/* Shared clip-paths for photo shapes */
export function ClipDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <clipPath id="clip-heart" clipPathUnits="objectBoundingBox">
          <path d="M0.5,0.94 C0.08,0.64 -0.04,0.34 0.14,0.14 C0.28,-0.01 0.45,0.05 0.5,0.22 C0.55,0.05 0.72,-0.01 0.86,0.14 C1.04,0.34 0.92,0.64 0.5,0.94 Z" />
        </clipPath>
        <clipPath id="clip-blob" clipPathUnits="objectBoundingBox">
          <path d="M0.82,0.12 C0.98,0.28 1.02,0.6 0.88,0.80 C0.74,1.0 0.4,1.04 0.2,0.9 C0.0,0.76 -0.04,0.44 0.1,0.24 C0.24,0.04 0.6,-0.06 0.82,0.12 Z" />
        </clipPath>
        <clipPath id="clip-scallop" clipPathUnits="objectBoundingBox">
          <path d="M0.5,0 C0.58,0 0.62,0.06 0.7,0.08 C0.78,0.1 0.86,0.08 0.9,0.14 C0.94,0.2 0.92,0.28 0.95,0.35 C0.98,0.42 1,0.46 1,0.5 C1,0.54 0.98,0.58 0.95,0.65 C0.92,0.72 0.94,0.8 0.9,0.86 C0.86,0.92 0.78,0.9 0.7,0.92 C0.62,0.94 0.58,1 0.5,1 C0.42,1 0.38,0.94 0.3,0.92 C0.22,0.9 0.14,0.92 0.1,0.86 C0.06,0.8 0.08,0.72 0.05,0.65 C0.02,0.58 0,0.54 0,0.5 C0,0.46 0.02,0.42 0.05,0.35 C0.08,0.28 0.06,0.2 0.1,0.14 C0.14,0.08 0.22,0.1 0.3,0.08 C0.38,0.06 0.42,0 0.5,0 Z" />
        </clipPath>
      </defs>
    </svg>
  )
}
