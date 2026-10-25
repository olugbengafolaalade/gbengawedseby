import { motion, useScroll, useSpring } from 'framer-motion'
import { useRef } from 'react'
import { story } from '../data/content.js'
import { Reveal } from './bits.jsx'
import { Divider } from './Ornaments.jsx'

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
          <Reveal key={c.title} className={`chapter ${i % 2 ? 'right' : 'left'}`} y={40}>
            <span className="dot" />
            <div className="chapter-card">
              <p className="kicker">{c.kicker}</p>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal className="story-quote">
        <p>“Whatever our souls are made of, his and mine are the same.”<cite>— Emily Brontë</cite></p>
      </Reveal>
    </section>
  )
}
