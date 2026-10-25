// Vercel serverless function: validates an RSVP and forwards it to a Google Sheet
// through an Apps Script web-app (see README.md). Set RSVP_WEBHOOK_URL in Vercel.

const clean = (v, max = 500) => String(v ?? '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}

  // honeypot: pretend success so bots move on
  if (b.website) return res.status(200).json({ ok: true })

  const name = clean(b.name, 120)
  const email = clean(b.email, 160)
  if (!name) return res.status(400).json({ error: 'Please enter your name.' })
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Please enter a valid email address.' })

  const events = b.events || {}
  const response = b.response || {}
  const chosen = ['traditional', 'white'].filter((k) => events[k])
  if (!chosen.length) return res.status(400).json({ error: 'Please choose at least one celebration.' })

  const answer = (k) => (!events[k] ? '' : response[k] === 'no' ? 'Declined' : 'Attending')
  const row = {
    submittedAt: new Date().toISOString(),
    name,
    email,
    phone: clean(b.phone, 40),
    travellingFrom: clean(b.city, 120),
    traditional: answer('traditional'),
    whiteWedding: answer('white'),
    partySize: Math.min(Math.max(parseInt(b.guests, 10) || 1, 1), 20),
    guestNames: clean(b.guestNames),
    dietary: clean(b.dietary),
    needsTravelHelp: b.needsTravelHelp ? 'Yes' : '',
    message: clean(b.message, 1000),
  }

  const url = process.env.RSVP_WEBHOOK_URL
  if (!url) {
    console.error('RSVP_WEBHOOK_URL is not set. RSVP:', JSON.stringify(row))
    return res.status(503).json({ error: 'RSVPs are not switched on yet.' })
  }
  try {
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(row), redirect: 'follow' })
    if (!r.ok) throw new Error(`webhook ${r.status}`)
    return res.status(200).json({ ok: true })
  } catch (e) {
    console.error('RSVP forward failed', e, JSON.stringify(row))
    return res.status(502).json({ error: 'We couldn’t save your RSVP just now. Please try again in a moment.' })
  }
}
