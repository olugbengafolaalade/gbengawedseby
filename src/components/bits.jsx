import { useEffect, useState, useMemo } from 'react'
import { motion, useScroll, useSpring, animate, useInView } from 'framer-motion'
import { useRef } from 'react'

export function Reveal({ children, delay = 0, y = 28, as = 'div', className = '', ...rest }) {
  const Tag = motion[as] || motion.div
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export function useCountdown(iso) {
  const calc = () => {
    const diff = new Date(iso).getTime() - Date.now()
    if (diff <= 0) return null
    return {
      days: Math.floor(diff / 864e5),
      hours: Math.floor((diff / 36e5) % 24),
      minutes: Math.floor((diff / 6e4) % 60),
      seconds: Math.floor((diff / 1e3) % 60),
    }
  }
  const [t, setT] = useState(calc)
  useEffect(() => {
    setT(calc())
    const id = setInterval(() => setT(calc()), 1000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iso])
  return t
}

export const mapsUrl = (w) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(w.mapQuery)}`

export function downloadIcs(w) {
  const fmt = (d) => new Date(d).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//gbengawedseby//EN',
    'BEGIN:VEVENT',
    `UID:${w.id}@gbengawedseby.com`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(w.date)}`,
    `DTEND:${fmt(w.endDate)}`,
    `SUMMARY:Ebele & Gbenga — ${w.title}`,
    `LOCATION:${w.venue}\\, ${w.address}`,
    'DESCRIPTION:Join us as we celebrate. www.gbengawedseby.com',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }))
  const a = Object.assign(document.createElement('a'), { href: url, download: `ebele-gbenga-${w.id}.ics` })
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function WeddingToggle({ theme, setTheme, compact = false }) {
  const opts = [
    ['traditional', 'Traditional'],
    ['white', 'White Wedding'],
  ]
  return (
    <div className={`toggle ${compact ? 'compact' : ''}`} role="tablist" aria-label="Choose a celebration" data-active={theme}>
      <motion.span
        className="toggle-pill"
        layout
        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        style={{ left: theme === 'traditional' ? 4 : '50%' }}
      />
      {opts.map(([id, label]) => (
        <button key={id} role="tab" aria-selected={theme === id} className={theme === id ? 'on' : ''} onClick={() => setTheme(id)}>
          {label}
        </button>
      ))}
    </div>
  )
}

export function ProgressBar() {
  const { scrollYProgress } = useScroll()
  const x = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  return <motion.div className="progress" style={{ scaleX: x }} />
}

/* confetti of gold petals when the theme changes */
export function Burst({ trigger }) {
  const parts = useMemo(
    () => Array.from({ length: 46 }, (_, i) => ({
      left: (i * 2.17 + (i % 7) * 3) % 100,
      delay: (i % 12) * 0.05,
      dur: 2.2 + ((i * 7) % 15) / 10,
      size: 8 + ((i * 5) % 12),
      rot: (i * 53) % 360,
      drift: ((i * 31) % 160) - 80,
      kind: i % 3,
    })),
    []
  )
  if (!trigger) return null
  return (
    <div className="burst" key={trigger} aria-hidden="true">
      {parts.map((p, i) => (
        <i key={i} className={`k${p.kind}`} style={{ left: `${p.left}%`, width: p.size, height: p.size * 1.3, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s`, '--rot': `${p.rot}deg`, '--drift': `${p.drift}px` }} />
      ))}
    </div>
  )
}

/* tiny gold stars trailing the pointer (fine pointers only) */
export function CursorTrail() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let last = 0
    const on = (e) => {
      const now = performance.now()
      if (now - last < 45) return
      last = now
      const el = document.createElement('span')
      el.className = 'trail'
      el.style.left = e.clientX + 'px'
      el.style.top = e.clientY + 'px'
      el.style.setProperty('--dx', (Math.random() * 40 - 20) + 'px')
      el.style.setProperty('--s', 6 + Math.random() * 8 + 'px')
      document.body.appendChild(el)
      setTimeout(() => el.remove(), 900)
    }
    window.addEventListener('pointermove', on, { passive: true })
    return () => window.removeEventListener('pointermove', on)
  }, [])
  return null
}

export function Marquee({ items }) {
  const row = [...items, ...items]
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {row.concat(row).map((t, i) => <span key={i}>{t}<i>✦</i></span>)}
      </div>
    </div>
  )
}

export function Counter({ to }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, { duration: 1.6, ease: 'easeOut', onUpdate: (x) => setV(Math.round(x)) })
    return () => c.stop()
  }, [inView, to])
  return <b ref={ref}>{v}</b>
}
