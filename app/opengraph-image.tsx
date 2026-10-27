import { ImageResponse } from 'next/og'

export const alt = "Manny's Tech Furnish — websites and local search for engineering and construction firms"
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/** Social preview in the site's drawing-sheet style; system fonts keep it dependency-free. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#f5f5f2',
          color: '#15181b',
          padding: '64px 72px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '3px solid #15181b', paddingTop: 20, fontSize: 24, color: '#4a5058' }}>
          <span style={{ color: '#b93a0b' }}>S-01</span>
          <span>Bay Area engineering &amp; construction firms</span>
        </div>
        <div style={{ display: 'flex', fontSize: 72, fontWeight: 700, lineHeight: 1.08, letterSpacing: -1.5, maxWidth: 980 }}>
          Websites and local search for engineering and construction firms.
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: 28 }}>
          <span style={{ fontWeight: 700 }}>Manny&apos;s Tech Furnish</span>
          <span style={{ color: '#4a5058' }}>AEC Digital Growth Partner · $1,000/month</span>
        </div>
      </div>
    ),
    size,
  )
}
