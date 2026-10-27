// Full-page screenshots at exact device widths, for QA evidence.
// Usage: node scripts/capture-screenshots.mjs [baseUrl] [outDir]
// Needs a local Chrome or Edge; uses the DevTools protocol directly (no dependencies).
import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const BASE = process.argv[2] ?? 'http://localhost:3110'
const OUT = process.argv[3] ?? 'docs/evidence/screenshots'
const ROUTES = {
  home: '/',
  disciplines: '/engineering-construction',
  work: '/work',
  offer: '/growth-partner',
  process: '/process',
  about: '/about',
  contact: '/contact',
  privacy: '/privacy',
  accessibility: '/accessibility',
}
const WIDTHS = [375, 768, 1440]
const BROWSERS = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
]
const exe = BROWSERS.find(existsSync)
if (!exe) throw new Error('No Chrome or Edge found')

const port = 9333
const proc = spawn(exe, [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${join(tmpdir(), 'mtf-cdp-profile')}`,
  '--hide-scrollbars',
  'about:blank',
])

async function wsUrl() {
  for (let i = 0; i < 50; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()
      const page = list.find((t) => t.type === 'page')
      if (page) return page.webSocketDebuggerUrl
    } catch {}
    await new Promise((r) => setTimeout(r, 200))
  }
  throw new Error('DevTools endpoint did not start')
}

const ws = new WebSocket(await wsUrl())
await new Promise((r) => ws.addEventListener('open', r, { once: true }))
let nextId = 0
const pending = new Map()
const waiters = []
ws.addEventListener('message', (e) => {
  const msg = JSON.parse(e.data)
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg)
    pending.delete(msg.id)
  } else if (msg.method) {
    waiters.filter((w) => w.method === msg.method).forEach((w) => w.resolve(msg))
  }
})
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const id = ++nextId
    pending.set(id, (m) => (m.error ? reject(new Error(m.error.message)) : resolve(m.result)))
    ws.send(JSON.stringify({ id, method, params }))
  })
const once = (method) => new Promise((resolve) => waiters.push({ method, resolve }))

await send('Page.enable')
mkdirSync(OUT, { recursive: true })
const report = []
for (const width of WIDTHS) {
  const mobile = width < 768
  for (const [name, path] of Object.entries(ROUTES)) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile })
    const loaded = once('Page.loadEventFired')
    await send('Page.navigate', { url: BASE + path })
    await loaded
    await new Promise((r) => setTimeout(r, 400))
    const { result } = await send('Runtime.evaluate', {
      expression:
        'JSON.stringify({h: document.documentElement.scrollHeight, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth})',
      returnByValue: true,
    })
    const m = JSON.parse(result.value)
    await send('Emulation.setDeviceMetricsOverride', { width, height: m.h, deviceScaleFactor: 1, mobile })
    await new Promise((r) => setTimeout(r, 200))
    const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
    const file = join(OUT, `${name}-${width}.png`)
    writeFileSync(file, Buffer.from(shot.data, 'base64'))
    report.push({ route: path, width, height: m.h, horizontalOverflow: m.sw > m.cw, file })
  }
}
writeFileSync(join(OUT, 'capture-report.json'), JSON.stringify(report, null, 2))
console.log(report.map((r) => `${r.width}\t${r.route}\th=${r.height}\toverflow=${r.horizontalOverflow}`).join('\n'))
ws.close()
proc.kill()
