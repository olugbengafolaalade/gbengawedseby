import { motion } from 'framer-motion'
import { journey } from '../data/content.js'
import { Counter } from './bits.jsx'

// Rough outline of Africa, [lon, lat], clockwise from Tangier
const AFRICA = [[-5.9,35.8],[-2,35.1],[3,36.8],[10,37.2],[11,33.5],[15,32.3],[20,32.2],[25,31.6],[32,31.2],[34,28],[35,24],[37.2,21],[37.5,18],[39.5,15.5],[43.2,12.7],[44,10.4],[51.2,11.8],[50.8,10.4],[48,5],[43,0],[40.5,-2.5],[39.2,-6.5],[40.5,-10.5],[40.5,-15],[35,-19.5],[35.5,-24],[32.5,-26],[32.8,-28.5],[30,-31.5],[27,-33.7],[22,-34.1],[18.4,-34.2],[17.5,-30],[15,-27],[14.4,-22.5],[11.8,-17.2],[13.5,-12],[12.2,-6],[9.3,-1],[9.6,2.5],[8.7,4.5],[6,4.3],[4.5,6.3],[1.5,6],[-2,4.8],[-4.5,5.2],[-7.5,4.4],[-11.5,7],[-13.5,9.5],[-16.7,12.5],[-17.5,14.7],[-16.5,19],[-16,22],[-13,27.5],[-10,29.5],[-9.8,32],[-8.8,33],[-6.5,34]]

const W = 420, H = 460
const px = ([lon, lat]) => [((lon + 19) / 73) * W, ((38 - lat) / 74) * H]

export default function Journey() {
  const outline = AFRICA.map((p, i) => (i ? 'L' : 'M') + px(p).map((n) => n.toFixed(1)).join(' ')).join(' ') + ' Z'
  const home = journey.cities.find((c) => c.home)
  const [hx, hy] = px([home.lon, home.lat])
  const arcs = journey.cities.filter((c) => !c.home).map((c) => {
    const [x, y] = px([c.lon, c.lat])
    const mx = (hx + x) / 2, my = Math.min(hy, y) - 40 - Math.abs(x - hx) * 0.12
    return { c, x, y, d: `M${hx} ${hy} Q${mx} ${my} ${x} ${y}` }
  })
  return (
    <div className="journey">
      <svg viewBox={`0 0 ${W} ${H}`} className="map" role="img" aria-label="Map of Africa with the cities Ebele and Gbenga have travelled to">
        <defs>
          <pattern id="dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.1" fill="currentColor" opacity=".35" /></pattern>
          <clipPath id="africa"><path d={outline} /></clipPath>
        </defs>
        <motion.path d={outline} fill="none" stroke="currentColor" strokeWidth="1.4" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2.4, ease: 'easeInOut' }} />
        <motion.rect width={W} height={H} fill="url(#dots)" clipPath="url(#africa)" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1, duration: 1.5 }} />
        {arcs.map(({ c, d }, i) => (
          <motion.path key={c.name} d={d} fill="none" stroke="var(--accent)" strokeWidth="1.6" strokeDasharray="4 5" strokeLinecap="round" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, delay: 1.2 + i * 0.35 }} />
        ))}
        {journey.cities.map((c, i) => {
          const [x, y] = px([c.lon, c.lat])
          const L = { Accra: [-10, 16, 'end'], Lagos: [10, -8, 'start'], Marrakesh: [10, 12, 'start'], Casablanca: [10, -2, 'start'], 'Addis Ababa': [-10, 4, 'end'], Nairobi: [-10, 4, 'end'] }[c.name]
          return (
            <motion.g key={c.name} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.8 + i * 0.3, type: 'spring' }} style={{ transformOrigin: `${x}px ${y}px` }}>
              {c.home && <circle cx={x} cy={y} r="14" fill="var(--accent)" opacity=".18" className="pulse" />}
              <circle cx={x} cy={y} r={c.home ? 6 : 4.5} fill="var(--accent)" />
              <circle cx={x} cy={y} r={c.home ? 2.4 : 1.8} fill="var(--bg)" />
              <text x={x + L[0]} y={y + L[1]} textAnchor={L[2]} className="map-label">{c.name}</text>
            </motion.g>
          )
        })}
      </svg>
      <div className="journey-side">
        <ul className="city-list">
          {journey.cities.map((c, i) => (
            <motion.li key={c.name} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.12 }}>
              <b>{c.name}</b><span>{c.note}</span>
            </motion.li>
          ))}
        </ul>
        <div className="stats">
          {journey.stats.map((s) => (
            <div key={s.label}><Counter to={s.n} /><span>{s.label}</span></div>
          ))}
        </div>
      </div>
    </div>
  )
}
