import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

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
