import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { travel, faqs } from '../data/content.js'
import { Reveal } from './bits.jsx'
import { Divider } from './Ornaments.jsx'

export default function Travel({ theme }) {
  const t = travel[theme]
  const [open, setOpen] = useState(0)
  return (
    <section className="section travel" id="travel">
      <Reveal className="section-head">
        <p className="eyebrow">For our guests travelling in</p>
        <h2 className="display">Travel &amp; Stay</h2>
        <Divider />
        <p className="lede">{travel.intro}</p>
      </Reveal>

      <AnimatePresence mode="wait">
        <motion.div key={theme} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
          <h3 className="travel-title">{t.title}</h3>
          <div className="travel-grid">
            {t.getting.map((g, i) => (
              <motion.article key={g.heading} className="travel-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * i, duration: 0.6 }}>
                <span className="travel-icon" aria-hidden="true">{g.icon}</span>
                <h4>{g.heading}</h4>
                <p>{g.text}</p>
              </motion.article>
            ))}
          </div>
          <ul className="tips">
            {t.tips.map((tip) => <li key={tip}>{tip}</li>)}
          </ul>
        </motion.div>
      </AnimatePresence>
      <p className="travel-closing">{travel.closing}</p>

      <Reveal className="faq">
        <h3 className="travel-title">Good to know</h3>
        {faqs.map((f, i) => (
          <div key={f.q} className={`faq-item ${open === i ? 'open' : ''}`}>
            <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
              {f.q}<span>{open === i ? '–' : '+'}</span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                  {f.a}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        ))}
      </Reveal>
    </section>
  )
}
