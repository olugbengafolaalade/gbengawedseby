import { motion, AnimatePresence } from 'framer-motion'
import { attire, gifts } from '../data/content.js'
import { Reveal } from './bits.jsx'
import { Divider } from './Ornaments.jsx'

export function Attire({ theme }) {
  const a = attire[theme]
  return (
    <section className="section attire" id="attire">
      <Reveal className="section-head">
        <p className="eyebrow">What to wear</p>
        <h2 className="display">Dress Code &amp; Aso-ebi</h2>
        <Divider />
      </Reveal>
      <AnimatePresence mode="wait">
        <motion.div key={theme} className="attire-card" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.6 }}>
          <h3 className="travel-title">{a.title}</h3>
          <div className="swatches" aria-label={a.paletteNote}>
            {a.palette.map((c, i) => (
              <motion.i key={c} style={{ background: c }} initial={{ scale: 0, y: 20 }} animate={{ scale: 1, y: 0 }} transition={{ delay: 0.1 * i, type: 'spring', stiffness: 220 }} />
            ))}
          </div>
          <p className="swatch-note">{a.paletteNote}</p>
          <p>{a.text}</p>
          <p className="asoebi"><b>Aso-ebi:</b> {a.asoebi}</p>
        </motion.div>
      </AnimatePresence>
    </section>
  )
}

export function Gifts() {
  return (
    <section className="section gifts" id="gifts">
      <Reveal className="section-head">
        <p className="eyebrow">With gratitude</p>
        <h2 className="display">Gifts &amp; Blessings</h2>
        <Divider />
        <p className="lede">{gifts.note}</p>
      </Reveal>
      {gifts.methods.length > 0 && (
        <div className="gift-grid">
          {gifts.methods.map((m) => (
            <Reveal key={m.label} className="gift-card">
              <h4>{m.label}</h4>
              {m.lines.map((l) => <p key={l}>{l}</p>)}
            </Reveal>
          ))}
        </div>
      )}
    </section>
  )
}
