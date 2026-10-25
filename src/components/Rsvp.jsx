import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { weddings } from '../data/content.js'
import { Reveal } from './bits.jsx'
import { Divider } from './Ornaments.jsx'

const EMAIL = import.meta.env.VITE_CONTACT_EMAIL
const WHATSAPP = import.meta.env.VITE_CONTACT_WHATSAPP

const blank = (theme) => ({
  name: '', email: '', phone: '', guests: 1, guestNames: '', city: '',
  events: { traditional: theme === 'traditional', white: theme === 'white' },
  response: { traditional: 'yes', white: 'yes' },
  dietary: '', needsTravelHelp: false, message: '', website: '',
})

export default function Rsvp({ theme }) {
  const [f, setF] = useState(() => blank(theme))
  const [status, setStatus] = useState('idle') // idle | sending | done | error
  const [err, setErr] = useState('')
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }))
  const toggleEvent = (id) => setF((s) => ({ ...s, events: { ...s.events, [id]: !s.events[id] } }))

  const submit = async (e) => {
    e.preventDefault()
    if (!f.events.traditional && !f.events.white) {
      setErr('Please choose at least one celebration.')
      return
    }
    setErr('')
    setStatus('sending')
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(f),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Something went wrong.')
      setStatus('done')
    } catch (ex) {
      setErr(ex.message)
      setStatus('error')
    }
  }

  const attendingAny = Object.keys(f.events).some((k) => f.events[k] && f.response[k] === 'yes')

  return (
    <section className="section rsvp" id="rsvp">
      <Reveal className="section-head">
        <p className="eyebrow">Kindly respond</p>
        <h2 className="display">RSVP</h2>
        <Divider />
        <p className="lede">Tell us which celebration(s) you’ll be joining — it helps us make sure there is a seat, a plate and a dance with your name on it.</p>
      </Reveal>

      <Reveal className="form-wrap">
        <AnimatePresence mode="wait">
          {status === 'done' ? (
            <motion.div key="done" className="thanks" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
              <div className="rings" aria-hidden="true"><i /><i /></div>
              <h3 className="display">Thank you, {f.name.split(' ')[0]}!</h3>
              <p>
                {attendingAny
                  ? 'Your RSVP has been received. We can’t wait to celebrate with you.'
                  : 'Your response has been received. We’ll miss you, and thank you for letting us know.'}
              </p>
              <button className="btn ghost" onClick={() => { setF(blank(theme)); setStatus('idle') }}>Submit another RSVP</button>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={submit} noValidate={false} exit={{ opacity: 0 }}>
              <fieldset className="events">
                <legend>I’m responding for</legend>
                {Object.values(weddings).map((w) => (
                  <div key={w.id} className={`event-pick ${f.events[w.id] ? 'on' : ''}`}>
                    <label>
                      <input type="checkbox" checked={f.events[w.id]} onChange={() => toggleEvent(w.id)} />
                      <span className="event-name">{w.title}</span>
                      <span className="event-meta">{w.dateLabel} · {w.city}</span>
                    </label>
                    {f.events[w.id] && (
                      <div className="seg">
                        {[['yes', 'Joyfully accepts'], ['no', 'Regretfully declines']].map(([v, l]) => (
                          <button type="button" key={v} className={f.response[w.id] === v ? 'on' : ''} onClick={() => setF((s) => ({ ...s, response: { ...s.response, [w.id]: v } }))}>{l}</button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </fieldset>

              <div className="fields">
                <label>Full name *<input required value={f.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" /></label>
                <label>Email *<input required type="email" value={f.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" /></label>
                <label>Phone / WhatsApp<input type="tel" value={f.phone} onChange={(e) => set('phone', e.target.value)} autoComplete="tel" /></label>
                <label>Travelling from<input placeholder="City, country" value={f.city} onChange={(e) => set('city', e.target.value)} /></label>
                {attendingAny && (
                  <>
                    <label>Number in your party (including you)
                      <select value={f.guests} onChange={(e) => set('guests', Number(e.target.value))}>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <option key={n}>{n}</option>)}
                      </select>
                    </label>
                    <label>Dietary needs / allergies<input value={f.dietary} onChange={(e) => set('dietary', e.target.value)} /></label>
                    {f.guests > 1 && (
                      <label className="wide">Names of your guests<input value={f.guestNames} onChange={(e) => set('guestNames', e.target.value)} placeholder="Separate names with commas" /></label>
                    )}
                    <label className="check wide">
                      <input type="checkbox" checked={f.needsTravelHelp} onChange={(e) => set('needsTravelHelp', e.target.checked)} />
                      I’m travelling in and would appreciate help with accommodation or transport info
                    </label>
                  </>
                )}
                <label className="wide">A note for the couple<textarea rows="3" value={f.message} onChange={(e) => set('message', e.target.value)} placeholder="Wishes, advice, a favourite memory…" /></label>
                {/* honeypot */}
                <input className="hp" tabIndex="-1" autoComplete="off" aria-hidden="true" value={f.website} onChange={(e) => set('website', e.target.value)} />
              </div>

              {err && (
                <p className="form-error" role="alert">
                  {err}
                  {status === 'error' && (EMAIL || WHATSAPP) && (
                    <> You can also reach us directly{EMAIL && <> at <a href={`mailto:${EMAIL}?subject=RSVP`}>{EMAIL}</a></>}{WHATSAPP && <> or on <a href={`https://wa.me/${WHATSAPP.replace(/\D/g, '')}`}>WhatsApp</a></>}.</>
                  )}
                </p>
              )}
              <button className="btn big" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send RSVP'}</button>
            </motion.form>
          )}
        </AnimatePresence>
      </Reveal>
    </section>
  )
}
