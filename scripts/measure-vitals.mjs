// Lab measurement of LCP, CLS and transfer size per route under mobile throttling.
// Usage: node scripts/measure-vitals.mjs [baseUrl]
// Lab numbers from one machine, not field data; use them to compare builds.
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const BASE = process.argv[2] ?? 'http://localhost:3110'
const ROUTES = process.argv[3] ? process.argv[3].split(',') : ['/', '/engineering-construction', '/work', '/growth-partner', '/process', '/about', '/contact']
const exe = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
].find(existsSync)
const port = 9334
const proc = spawn(exe, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${join(tmpdir(), 'mtf-vitals')}`, 'about:blank'])

let target
for (let i = 0; i < 50 && !target; i++) {
  try {
    target = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === 'page')
  } catch {}
  if (!target) await new Promise((r) => setTimeout(r, 200))
}
const ws = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((r) => ws.addEventListener('open', r, { once: true }))
let id = 0
const pending = new Map()
const listeners = []
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data)
  if (m.id) pending.get(m.id)?.(m)
  else listeners.forEach((l) => l(m))
})
const send = (method, params = {}) =>
  new Promise((res) => {
    const i = ++id
    pending.set(i, (m) => res(m.result))
    ws.send(JSON.stringify({ id: i, method, params }))
  })

await send('Page.enable')
await send('Network.enable')
await send('Network.setCacheDisabled', { cacheDisabled: true })
// Roughly Lighthouse's mobile profile: Moto G-class CPU, slow 4G.
await send('Emulation.setCPUThrottlingRate', { rate: 4 })
await send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 })
await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 2, mobile: true })
await send('Page.addScriptToEvaluateOnNewDocument', {
  source: `window.__v={lcp:0,cls:0};
    new PerformanceObserver(l=>{for(const e of l.getEntries())window.__v.lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});
    new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.__v.cls+=e.value}).observe({type:'layout-shift',buffered:true});`,
})

const rows = []
for (const path of ROUTES) {
  let bytes = 0
  const onMsg = (m) => {
    if (m.method === 'Network.loadingFinished') bytes += m.params.encodedDataLength
  }
  listeners.push(onMsg)
  const loaded = new Promise((r) => listeners.push((m) => m.method === 'Page.loadEventFired' && r()))
  await send('Page.navigate', { url: BASE + path })
  await loaded
  await new Promise((r) => setTimeout(r, 2500))
  const { result } = await send('Runtime.evaluate', { expression: 'JSON.stringify(window.__v)', returnByValue: true })
  const v = JSON.parse(result.value)
  listeners.length = 0
  rows.push({ path, lcpMs: Math.round(v.lcp), cls: Number(v.cls.toFixed(3)), transferKB: Math.round(bytes / 1024) })
}
console.table(rows)
console.log(JSON.stringify(rows))
ws.close()
proc.kill()

