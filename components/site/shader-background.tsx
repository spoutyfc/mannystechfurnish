'use client'

import { useEffect, useRef } from 'react'
import { Renderer, Program, Mesh, Triangle } from 'ogl'

/**
 * Animated WebGL gradient field rendered behind all content.
 * - Fixed, pointer-events-none, sits at z-0 behind the page.
 * - Fails silently to the CSS background if WebGL is unavailable.
 * - Respects prefers-reduced-motion (renders a single static frame).
 */
export function ShaderBackground() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = ref.current
    if (!mount) return

    let renderer: Renderer
    let raf = 0
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Skip the live WebGL field on phones/tablets: the CSS gradient fallback
    // is shown instead, saving battery and keeping scroll smooth.
    const isSmallOrTouch =
      window.matchMedia('(max-width: 768px)').matches ||
      window.matchMedia('(pointer: coarse)').matches
    if (isSmallOrTouch) return

    try {
      renderer = new Renderer({ alpha: true, antialias: false, dpr: Math.min(window.devicePixelRatio, 1.5) })
    } catch {
      return
    }

    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)
    mount.appendChild(gl.canvas)
    gl.canvas.style.width = '100%'
    gl.canvas.style.height = '100%'
    gl.canvas.style.display = 'block'

    const vertex = /* glsl */ `
      attribute vec2 uv;
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `

    // Clean deep-space field: near-black base, slow drifting nebula,
    // a soft brand glow that follows the cursor. Kept low-contrast so
    // foreground text always wins.
    const fragment = /* glsl */ `
      precision highp float;
      varying vec2 vUv;
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uMouse;

      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
      float noise(vec2 p){
        vec2 i = floor(p); vec2 f = fract(p);
        vec2 u = f*f*(3.0-2.0*f);
        return mix(mix(hash(i+vec2(0.0,0.0)), hash(i+vec2(1.0,0.0)), u.x),
                   mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), u.x), u.y);
      }
      float fbm(vec2 p){
        float v = 0.0; float a = 0.5;
        for(int i=0;i<5;i++){ v += a*noise(p); p *= 2.0; a *= 0.5; }
        return v;
      }

      void main(){
        vec2 uv = gl_FragCoord.xy / uResolution.xy;
        float aspect = uResolution.x / uResolution.y;
        vec2 p = uv; p.x *= aspect;

        // Deep, near-black base with a faint vertical lift.
        vec3 base = vec3(0.027, 0.027, 0.043);
        base += vec3(0.015, 0.012, 0.03) * (1.0 - uv.y);

        // Slow drifting nebula — very subtle, low alpha.
        float t = uTime * 0.025;
        float n = fbm(p * 1.6 + vec2(t, -t));
        vec3 nebula = mix(vec3(0.06, 0.03, 0.12), vec3(0.18, 0.05, 0.22), n);
        vec3 col = mix(base, nebula, smoothstep(0.45, 0.95, n) * 0.35);

        // Reactive glow that trails the cursor.
        vec2 m = vec2(uMouse.x * aspect, uMouse.y);
        float md = distance(p, m);
        float glow = smoothstep(0.55, 0.0, md);
        col += vec3(0.55, 0.12, 0.5) * glow * 0.18;

        // Fine grain to avoid banding.
        col += (hash(uv * uTime) - 0.5) * 0.012;

        // Vignette to deepen edges and frame the content.
        float vig = smoothstep(1.3, 0.35, length(uv - 0.5));
        col *= mix(0.6, 1.0, vig);

        gl_FragColor = vec4(col, 1.0);
      }
    `

    const geometry = new Triangle(gl)
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [gl.canvas.width, gl.canvas.height] },
        uMouse: { value: [0.5, 0.5] },
      },
    })
    const mesh = new Mesh(gl, { geometry, program })

    const resize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      renderer.setSize(w, h)
      program.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height]
    }
    resize()
    window.addEventListener('resize', resize)

    const targetMouse = [0.5, 0.5]
    const onMove = (e: PointerEvent) => {
      targetMouse[0] = e.clientX / window.innerWidth
      targetMouse[1] = 1 - e.clientY / window.innerHeight
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    const start = performance.now()
    const render = () => {
      program.uniforms.uTime.value = (performance.now() - start) / 1000
      // Smoothly trail the cursor for a reactive glow.
      const m = program.uniforms.uMouse.value as number[]
      m[0] += (targetMouse[0] - m[0]) * 0.05
      m[1] += (targetMouse[1] - m[1]) * 0.05
      renderer.render({ scene: mesh })
      raf = requestAnimationFrame(render)
    }

    if (reduceMotion) {
      renderer.render({ scene: mesh })
    } else {
      raf = requestAnimationFrame(render)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      const ext = gl.getExtension('WEBGL_lose_context')
      if (ext) ext.loseContext()
      if (gl.canvas.parentNode) gl.canvas.parentNode.removeChild(gl.canvas)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-90"
      style={{
        background:
          'radial-gradient(120% 80% at 50% 0%, rgba(46,10,58,0.55) 0%, rgba(10,10,16,0.9) 55%, #07070c 100%)',
      }}
    />
  )
}
