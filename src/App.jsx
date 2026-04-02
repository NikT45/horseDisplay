import { useState, useEffect, useRef } from 'react'

import frame0  from '../ascii/ascii-art.txt?raw'
import frame1  from '../ascii/ascii-art (1).txt?raw'
import frame2  from '../ascii/ascii-art (2).txt?raw'
import frame3  from '../ascii/ascii-art (3).txt?raw'
import frame4  from '../ascii/ascii-art (4).txt?raw'
import frame5  from '../ascii/ascii-art (5).txt?raw'
import frame6  from '../ascii/ascii-art (6).txt?raw'
import frame7  from '../ascii/ascii-art (7).txt?raw'
import frame8  from '../ascii/ascii-art (8).txt?raw'
import frame9  from '../ascii/ascii-art (9).txt?raw'
import frame10 from '../ascii/ascii-art (10).txt?raw'
import frame11 from '../ascii/ascii-art (11).txt?raw'
import frame12 from '../ascii/ascii-art (12).txt?raw'
import frame13 from '../ascii/ascii-art (13).txt?raw'
import frame14 from '../ascii/ascii-art (14).txt?raw'

const RAW_FRAMES = [
  frame0,  frame1,  frame2,  frame3,  frame4,
  frame5,  frame6,  frame7,  frame8,  frame9,
  frame10, frame11, frame12, frame13, frame14,
]

// Normalize all frames to the same line count so the pre never resizes
const MAX_LINES = Math.max(...RAW_FRAMES.map(f => f.split('\n').length))
const FRAMES = RAW_FRAMES.map(f => {
  const lines = f.split('\n')
  while (lines.length < MAX_LINES) lines.push('')
  return lines.join('\n')
})

const FPS = 10

export default function App() {
  const [index, setIndex] = useState(0)
  const preRef = useRef(null)
  const [fontSize, setFontSize] = useState(13)

  // Pick font size so the pre fits inside the viewport
  useEffect(() => {
    function fit() {
      const el = preRef.current
      if (!el) return
      const lines = FRAMES[0].split('\n')
      const cols  = Math.max(...lines.map(l => l.length))
      const rows  = lines.length
      // approximate character aspect ratio for Courier New: width ≈ 0.6 × height
      const byW = (window.innerWidth  * 0.97) / (cols * 0.601)
      const byH = (window.innerHeight * 0.97) / (rows * 1.2)
      setFontSize(Math.min(byW, byH, 18))
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  // Advance frames
  useEffect(() => {
    const id = setInterval(() => {
      setIndex(i => (i + 1) % FRAMES.length)
    }, 1000 / FPS)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={styles.root}>

      <pre ref={preRef} style={{ ...styles.pre, fontSize, lineHeight: 1.2 }}>
        {FRAMES[index]}
      </pre>

      <div style={{ ...styles.label, fontSize: Math.max(fontSize * 0.65, 8) }}>
        HORSE.SYS &nbsp;·&nbsp; {String(index + 1).padStart(2, '0')}/{FRAMES.length}
      </div>

      {/* debug frame counter
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '16px',
        color: BLUE,
        fontFamily: '"Courier New", Courier, monospace',
        fontWeight: 'bold',
        fontSize: '24px',
        opacity: 0.9,
      }}>
        FRAME {index}
      </div>
      */}
    </div>
  )
}

const BLUE = '#0000ff'

const styles = {
  root: {
    position: 'relative',
    width: '100%',
    height: '100%',
    background: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  pre: {
    position: 'relative',
    color: BLUE,
    fontFamily: '"Courier New", Courier, monospace',
    fontWeight: 'bold',
    whiteSpace: 'pre',
    letterSpacing: 0,
    margin: 0,
    padding: 0,
    userSelect: 'none',
  },
  label: {
    position: 'absolute',
    bottom: '12px',
    right: '16px',
    color: BLUE,
    fontFamily: '"Courier New", Courier, monospace',
    opacity: 0.45,
    letterSpacing: '0.12em',
  },
}
