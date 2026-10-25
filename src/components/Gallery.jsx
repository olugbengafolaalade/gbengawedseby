import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { gallery } from '../data/content.js'
import { Reveal } from './bits.jsx'
import { Divider } from './Ornaments.jsx'

export default function Gallery() {
  const [open, setOpen] = useState(null)
  useEffect(() => {
    if (open === null) return
    const k = (e) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') setOpen((o) => (o + 1) % gallery.length)
      if (e.key === 'ArrowLeft') setOpen((o) => (o - 1 + gallery.length) % gallery.length)
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [open])

  return (
    <section className="section gallery" id="gallery">
      <Reveal className="section-head">
        <p className="eyebrow">Moments</p>
        <h2 className="display">Our Gallery</h2>
        <Divider />
      </Reveal>
      <div className="gallery-grid">
        {gallery.map((g, i) => (
          <motion.button
            key={g.src}
            className={`g-item size-${g.size}`}
            onClick={() => setOpen(i)}
            initial={{ opacity: 0, y: 60, rotate: i % 2 ? 4 : -4 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            whileHover={{ y: -8, rotate: i % 2 ? -2 : 2 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.9, delay: (i % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
            aria-label={`Open photo: ${g.caption}`}
          >
            <span className={`g-frame shape-${g.shape}`}>
              <img src={g.src} alt={g.caption} loading="lazy" />
            </span>
            <span className="g-cap">{g.caption}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)} role="dialog" aria-modal="true">
            <motion.figure initial={{ scale: 0.88, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92 }} onClick={(e) => e.stopPropagation()}>
              <img src={gallery[open].src} alt={gallery[open].caption} />
              <figcaption>{gallery[open].caption}</figcaption>
            </motion.figure>
            <button className="lb-btn lb-prev" onClick={(e) => { e.stopPropagation(); setOpen((open - 1 + gallery.length) % gallery.length) }} aria-label="Previous">‹</button>
            <button className="lb-btn lb-next" onClick={(e) => { e.stopPropagation(); setOpen((open + 1) % gallery.length) }} aria-label="Next">›</button>
            <button className="lb-btn lb-close" onClick={() => setOpen(null)} aria-label="Close">×</button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
