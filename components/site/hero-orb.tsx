'use client'

import { useEffect, useRef } from 'react'
import { Renderer, Program, Mesh, Triangle, Vec2 } from 'ogl'

/**
 * Fullscreen WebGL "liquid energy" field. A single screen-filling triangle is
 * shaded with domain-warped fractal noise, producing a slow, premium magenta
 * plasma flow with bright pink filaments and a soft volumetric core. It's a
 * single draw call with zero geometry, so it's extremely fast. The flow eases
 * toward the cursor and freezes under prefers-reduced-motion. Degrades silently
 * if WebGL is unavailable.
 */
export function HeroOrb() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = ref.current
    if (!mount) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let renderer: Renderer
    try {
      renderer = new Renderer({
        alpha: true,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio, 2),
      })
    } catch {
      return
    }

    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)
    mount.appendChild(gl.canvas)
    gl.canvas.style.width = '100%'
    gl.canvas.style.height = '100%'
    gl.canvas.style.display = 'block'

    const geometry = new Triangle(gl)

    const vertex = /* glsl */ `
      attribute vec2 uv;
      attribute vec2 position;
      varying vec2 vUv;
      void main(){
        vUv = uv;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `

    const fragment = /* glsl */ `
      precision highp float;
      varying vec2 vUv;
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uMouse;

      // -- 2D simplex-ish value noise --
      float hash(vec2 p){
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }
      float noise(vec2 p){
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }
      float fbm(vec2 p){
        float v = 0.0;
        float amp = 0.5;
        for(int i = 0; i < 5; i++){
          v += amp * noise(p);
          p *= 2.02;
          amp *= 0.5;
        }
        return v;
      }

      void main(){
        // aspect-correct, centered coords
        vec2 uv = (vUv - 0.5);
        uv.x *= uResolution.x / uResolution.y;

        float t = uTime * 0.08;
        vec2 m = uMouse * 0.35;

        // domain warping for liquid flow
        vec2 q = vec2(fbm(uv * 1.6 + t + m), fbm(uv * 1.6 - t + 4.3));
        vec2 r = vec2(
          fbm(uv * 1.6 + 1.7 * q + vec2(8.3, 2.8) + t * 1.3),
          fbm(uv * 1.6 + 1.7 * q + vec2(1.2, 6.5) - t * 1.1)
        );
        float f = fbm(uv * 1.6 + 2.2 * r);

        // radial core glow, drifts slightly with cursor
        float d = length(uv - m * 0.6);
        float core = smoothstep(1.35, 0.0, d);

        // brand palette
        vec3 black = vec3(0.04, 0.0, 0.05);
        vec3 mag   = vec3(0.95, 0.12, 0.60);
        vec3 pink  = vec3(1.0, 0.55, 0.88);
        vec3 deep  = vec3(0.45, 0.03, 0.30);

        vec3 col = mix(black, deep, clamp(f * 1.8, 0.0, 1.0));
        col = mix(col, mag, smoothstep(0.25, 0.80, f) * core);
        // bright filaments where the warp folds
        float fil = smoothstep(0.50, 0.60, abs(r.x - r.y));
        col = mix(col, pink, fil * core);
        col += mag * smoothstep(0.4, 1.0, f) * core * 0.5;
        col += pink * pow(core, 2.5) * 0.8;

        // vignette / alpha so it melts into the black hero
        float alpha = core * (0.55 + f * 0.75);
        alpha = clamp(alpha, 0.0, 1.0);
        gl_FragColor = vec4(col, alpha);
      }
    `

    const program = new Program(gl, {
      vertex,
      fragment,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Vec2(1, 1) },
        uMouse: { value: new Vec2(0, 0) },
      },
    })

    const mesh = new Mesh(gl, { geometry, program })

    const target = new Vec2(0, 0)
    const current = new Vec2(0, 0)
    const onMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect()
      target.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -(((e.clientY - rect.top) / rect.height) * 2 - 1),
      )
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    function resize() {
      if (!mount) return
      const w = mount.clientWidth
      const h = mount.clientHeight
      renderer.setSize(w, h)
      program.uniforms.uResolution.value.set(w, h)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(mount)
    resize()

    let raf = 0
    const start = performance.now()
    function update() {
      raf = requestAnimationFrame(update)
      const t = (performance.now() - start) / 1000
      program.uniforms.uTime.value = reduceMotion ? 0 : t

      current.x += (target.x - current.x) * 0.04
      current.y += (target.y - current.y) * 0.04
      program.uniforms.uMouse.value.set(current.x, current.y)

      renderer.render({ scene: mesh })
    }
    update()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
      if (gl.canvas.parentNode === mount) mount.removeChild(gl.canvas)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  )
}
