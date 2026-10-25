import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { weddings } from '../data/content.js'
import { FiligreeCorner, Sprig, Sparkles, Petals, RingText } from './Ornaments.jsx'
import { WeddingToggle, useCountdown } from './bits.jsx'

function Countdown({ iso }) {
  const t = useCountdown(iso)
  if (!t) return <p className="count-done">Today is the day — see you there! 🎉</p>
  return (
    <div className="countdown" aria-label="Countdown to the wedding">
      {[['days', t.days], ['hours', t.hours], ['mins', t.minutes], ['secs', t.seconds]].map(([l, v]) => (
        <div key={l}>
          <b>{String(v).padStart(2, '0')}</b>
          <span>{l}</span>
        </div>
      ))}
    </div>
  )
}

/* "Ink-writing" reveal: a script line wipes in from the left */
const Ink = ({ children, delay = 0, className = '' }) => (
  <motion.span
    className={className}
    initial={{ clipPath: 'inset(-10% 100% -20% -2%)', opacity: 0.2 }}
    animate={{ clipPath: 'inset(-10% -4% -20% -2%)', opacity: 1 }}
    transition={{ duration: 1.6, delay, ease: [0.45, 0, 0.2, 1] }}
  >
    {children}
  </motion.span>
)

export default function Hero({ theme, setTheme }) {
  const w = weddings[theme]
  const other = theme === 'white' ? weddings.traditional : weddings.white
  const isWhite = theme === 'white'
  const { scrollY } = useScroll()
  const yA = useTransform(scrollY, [0, 700], [0, -90])
  const yB = useTransform(scrollY, [0, 700], [0, 70])
  const rot = useTransform(scrollY, [0, 900], [0, 40])

  return (
    <header className="hero" id="top">
      {isWhite ? <Sparkles /> : <Petals />}
      <AnimatePresence mode="wait">
        <motion.div key={theme} className="hero-ornaments" style={{ y: yB }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
          {isWhite ? (
            <>
              <Sprig className="o-tl" variant={1} />
              <Sprig className="o-br" variant={2} flip />
              <div className="gold-wash gw1" />
              <div className="gold-wash gw2" />
            </>
          ) : (
            <>
              <FiligreeCorner className="o-tl" />
              <FiligreeCorner className="o-bl" style={{ transform: 'scaleY(-1)' }} />
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <div className={`hero-grid ${isWhite ? 'is-white' : 'is-trad'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={theme + 'photo'}
            className="hero-art"
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="halo" />
            <figure className="hero-photo">
              <img src={w.photo} alt="Ebele and Gbenga" />
            </figure>
            <motion.div className="hero-mini" style={{ y: yA }}>
              <motion.div className="ring-wrap" style={{ rotate: rot }}>
                <RingText text={isWhite ? 'EBELE & GBENGA • 2 JAN 2027 • IKOYI • ' : 'EBELE & GBENGA • 26 DEC 2026 • NNEWI • '} size={190} />
              </motion.div>
              <img src={other.photo} alt="" className={isWhite ? 'mini-leaf' : 'mini-heart'} />
            </motion.div>
            <span className="twinkle t1">✦</span>
            <span className="twinkle t2">✦</span>
            <span className="twinkle t3">✦</span>
          </motion.div>
        </AnimatePresence>

        <div className="hero-copy">
          <AnimatePresence mode="wait">
            <motion.div key={theme + 'copy'} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
              <p className="eyebrow">{w.eyebrow}</p>
              {isWhite ? (
                <h1 className="names names-white">
                  <Ink className="script">Wedding of</Ink>
                  <motion.span className="caps" initial={{ opacity: 0, letterSpacing: '.5em' }} animate={{ opacity: 1, letterSpacing: '.3em' }} transition={{ duration: 1.6, delay: 0.5 }}>Ebele Okafor</motion.span>
                  <motion.span className="amp" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.1, type: 'spring' }}>&amp;</motion.span>
                  <motion.span className="caps" initial={{ opacity: 0, letterSpacing: '.5em' }} animate={{ opacity: 1, letterSpacing: '.3em' }} transition={{ duration: 1.6, delay: 0.8 }}>Gbenga Fola-Alade</motion.span>
                </h1>
              ) : (
                <h1 className="names names-trad">
                  <Ink className="script">Ebele Okafor &amp;</Ink>
                  <Ink className="script" delay={0.9}>Gbenga Fola-Alade</Ink>
                </h1>
              )}
              <p className="invite">{w.invite}</p>

              {isWhite ? (
                <p className="date-white">{w.dateLabel.toUpperCase()}<br /><small>{w.timeLabel}</small></p>
              ) : (
                <p className="date-trad">
                  <span>{w.dateParts[0]}</span><i /><span>{w.dateParts[1]}</span><i /><span>{w.dateParts[2]}</span>
                  <small>AT 2 PM</small>
                </p>
              )}
              <p className="venue-line"><b>{w.venue}</b><br />{w.address}</p>
              <Countdown iso={w.date} />
            </motion.div>
          </AnimatePresence>

          <div className="hero-cta">
            <WeddingToggle theme={theme} setTheme={setTheme} />
            <a href="#rsvp" className="btn">RSVP now</a>
          </div>
        </div>
      </div>

      <a href="#story" className="scroll-cue" aria-label="Read our story"><span>Our story</span><i /></a>
    </header>
  )
}
