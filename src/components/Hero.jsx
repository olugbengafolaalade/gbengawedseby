import { AnimatePresence, motion } from 'framer-motion'
import { weddings } from '../data/content.js'
import { FiligreeCorner, Sprig, Sparkles, Petals } from './Ornaments.jsx'
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

export default function Hero({ theme, setTheme }) {
  const w = weddings[theme]
  const isWhite = theme === 'white'
  return (
    <header className="hero" id="top">
      {isWhite ? <Sparkles /> : <Petals />}
      <AnimatePresence mode="wait">
        <motion.div key={theme} className="hero-ornaments" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
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
          <motion.figure
            key={theme + 'photo'}
            className="hero-photo"
            initial={{ opacity: 0, scale: 1.04, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src={w.photo} alt="Ebele and Gbenga" />
          </motion.figure>
        </AnimatePresence>

        <div className="hero-copy">
          <AnimatePresence mode="wait">
            <motion.div
              key={theme + 'copy'}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="eyebrow">{w.eyebrow}</p>
              {isWhite ? (
                <>
                  <h1 className="names names-white">
                    <span className="script">Wedding of</span>
                    <span className="caps">Ebele Okafor</span>
                    <span className="amp">&amp;</span>
                    <span className="caps">Gbenga Fola-Alade</span>
                  </h1>
                </>
              ) : (
                <h1 className="names names-trad">
                  <span className="script">Ebele Okafor &amp;</span>
                  <span className="script">Gbenga Fola-Alade</span>
                </h1>
              )}
              <p className="invite">{w.invite}</p>

              <div className="datebar">
                {isWhite ? (
                  <p className="date-white">
                    {w.dateLabel.toUpperCase()}<br />
                    <small>{w.timeLabel}</small>
                  </p>
                ) : (
                  <p className="date-trad">
                    <span>{w.dateParts[0]}</span><i /><span>{w.dateParts[1]}</span><i /><span>{w.dateParts[2]}</span>
                    <small>AT 2 PM</small>
                  </p>
                )}
              </div>
              <p className="venue-line">
                <b>{w.venue}</b>
                <br />
                {w.address}
              </p>
              <Countdown iso={w.date} />
            </motion.div>
          </AnimatePresence>

          <div className="hero-cta">
            <WeddingToggle theme={theme} setTheme={setTheme} />
            <a href="#rsvp" className="btn">RSVP now</a>
          </div>
        </div>
      </div>

      <a href="#story" className="scroll-cue" aria-label="Read our story">
        <span>Our story</span>
        <i />
      </a>
    </header>
  )
}
