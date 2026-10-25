import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Hero from './components/Hero.jsx'
import Story from './components/Story.jsx'
import Gallery from './components/Gallery.jsx'
import Details from './components/Details.jsx'
import { Attire, Gifts } from './components/Extras.jsx'
import Travel from './components/Travel.jsx'
import Rsvp from './components/Rsvp.jsx'
import { WeddingToggle, ProgressBar, Burst, CursorTrail, Marquee } from './components/bits.jsx'
import { Sprig, FiligreeCorner, ClipDefs } from './components/Ornaments.jsx'

const initialTheme = () => {
  try {
    const q = new URLSearchParams(location.search).get('wedding')
    if (q === 'white' || q === 'traditional') return q
    return localStorage.getItem('wedding-theme') || 'traditional'
  } catch {
    return 'traditional'
  }
}

export default function App() {
  const [theme, setThemeState] = useState(initialTheme)
  const [burst, setBurst] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const first = useRef(true)

  const setTheme = (t) => {
    if (t === theme) return
    setThemeState(t)
    setBurst((b) => b + 1)
  }

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'white' ? '#faf8ee' : '#fffdea')
    try { localStorage.setItem('wedding-theme', theme) } catch { /* ignore */ }
    first.current = false
  }, [theme])

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <>
      <ClipDefs />
      <ProgressBar />
      <CursorTrail />
      <Burst trigger={burst} />
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <a href="#top" className="monogram">E <i>&amp;</i> G</a>
        <div className="nav-links">
          <a href="#story">Story</a>
          <a href="#gallery">Gallery</a>
          <a href="#details">Details</a>
          <a href="#travel">Travel</a>
          <a href="#rsvp">RSVP</a>
        </div>
        <WeddingToggle theme={theme} setTheme={setTheme} compact />
      </nav>

      <Hero theme={theme} setTheme={setTheme} />
      <Marquee items={['Two cultures', 'Two families', 'Two celebrations', 'One love']} />
      <main>
        <Story />
        <Gallery />
        <Details theme={theme} setTheme={setTheme} />
        <Attire theme={theme} />
        <Travel theme={theme} />
        <Gifts />
        <Rsvp theme={theme} />
      </main>

      <footer className="footer">
        {theme === 'white' ? <Sprig className="f-orn" variant={3} /> : <FiligreeCorner className="f-orn" style={{ transform: 'rotate(90deg)' }} />}
        <motion.p className="script big" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.4 }}>
          Ebele &amp; Gbenga
        </motion.p>
        <p>26 December 2026 · Nnewi, Anambra &nbsp;|&nbsp; 2 January 2027 · Ikoyi, Lagos</p>
        <p className="tiny">With love, and with gratitude for you · www.gbengawedseby.com</p>
      </footer>
    </>
  )
}
