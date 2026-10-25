import { motion, AnimatePresence } from 'framer-motion'
import { weddings } from '../data/content.js'
import { Reveal, mapsUrl, downloadIcs } from './bits.jsx'
import { Divider } from './Ornaments.jsx'

export default function Details({ theme, setTheme }) {
  const w = weddings[theme]
  const other = theme === 'white' ? weddings.traditional : weddings.white
  return (
    <section className="section details" id="details">
      <Reveal className="section-head">
        <p className="eyebrow">Two celebrations</p>
        <h2 className="display">{w.title}</h2>
        <Divider />
      </Reveal>

      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          className="detail-card"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="detail-blurb">{w.blurb}</p>
          <dl className="detail-grid">
            <div><dt>Date</dt><dd>{w.dayName}<br />{w.dateLabel}</dd></div>
            <div><dt>Time</dt><dd>{w.timeLabel}</dd></div>
            <div><dt>Venue</dt><dd>{w.venue}<br /><span>{w.address}</span></dd></div>
          </dl>
          <div className="detail-actions">
            <a className="btn" href={mapsUrl(w)} target="_blank" rel="noreferrer">Open in Maps</a>
            <button className="btn ghost" onClick={() => downloadIcs(w)}>Add to calendar</button>
            <a className="btn ghost" href="#rsvp">RSVP</a>
          </div>
        </motion.div>
      </AnimatePresence>

      <Reveal className="other-card">
        <span>Also celebrating:</span>
        <button onClick={() => { setTheme(other.id); window.scrollTo({ top: document.getElementById('details').offsetTop - 60, behavior: 'smooth' }) }}>
          {other.title} — {other.dateLabel}, {other.city} →
        </button>
      </Reveal>
    </section>
  )
}
