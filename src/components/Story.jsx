import { motion, useScroll, useSpring } from 'framer-motion'
import { useRef } from 'react'
import { story } from '../data/content.js'
import { Reveal } from './bits.jsx'
import { Divider } from './Ornaments.jsx'
import Journey from './Journey.jsx'

export default function Story() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  const grow = useSpring(scrollYProgress, { stiffness: 90, damping: 26 })
  return (
    <section className="section story" id="story">
      <Reveal className="section-head">
        <p className="eyebrow">Our love story</p>
        <h2 className="display">How it all began</h2>
        <Divider />
      </Reveal>
      <div className="timeline" ref={ref}>
        <div className="timeline-rail"><motion.div className="timeline-fill" style={{ scaleY: grow }} /></div>
        {story.map((c, i) => (
          <motion.div
            key={c.title}
            className={`chapter ${i % 2 ? 'right' : 'left'} ${c.journey ? 'has-journey' : ''}`}
            initial={{ opacity: 0, y: 50, x: i % 2 ? 40 : -40 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.span className="dot" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', delay: 0.2 }}>
              <em aria-hidden="true">{c.icon}</em>
            </motion.span>
            <div className="chapter-body">
              {c.media && (
                <motion.div className={`chapter-media shape-${c.media.shape}`} whileHover={{ rotate: i % 2 ? -3 : 3, scale: 1.04 }} transition={{ type: 'spring', stiffness: 200 }}>
                  <img src={c.media.img} alt={c.media.alt} loading="lazy" />
                </motion.div>
              )}
              <div className="chapter-card">
                <p className="kicker">{c.kicker}</p>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </div>
            </div>
            {c.journey && <Journey />}
          </motion.div>
        ))}
      </div>
      <Reveal className="story-quote">
        <p>“Whatever our souls are made of, his and mine are the same.”<cite>— Emily Brontë</cite></p>
      </Reveal>
    </section>
  )
}
