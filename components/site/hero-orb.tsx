'use client'

import { useEffect, useRef } from 'react'
import { Renderer, Camera, Transform, Program, Mesh, Geometry, Vec2 } from 'ogl'

/**
 * Interactive WebGL particle energy sphere. Thousands of GPU points are
 * distributed on a sphere and displaced by layered simplex noise, producing a
 * living, breathing "data core" with magenta->pink additive glow against black.
 * Rotates on its own and eases toward the cursor. Pure OGL + GL_POINTS, so it
 * stays extremely fast. Degrades gracefully on reduced-motion / no WebGL.
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
        antialias: true,
        dpr: Math.min(window.devicePixelRatio, 2),
      })
    } catch {
      return
    }

    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)
    // additive blending for glow
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
    mount.appendChild(gl.canvas)
    gl.canvas.style.width = '100%'
    gl.canvas.style.height = '100%'
    gl.canvas.style.display = 'block'

    const camera = new Camera(gl, { fov: 35 })
    camera.position.set(0, 0, 7)

    const scene = new Transform()

    // ---- Build a fibonacci-sphere point cloud ----
    const COUNT = reduceMotion ? 6000 : 14000
    const positions = new Float32Array(COUNT * 3)
    const randoms = new Float32Array(COUNT)
    const golden = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < COUNT; i++) {
      const y = 1 - (i / (COUNT - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const theta = golden * i
      positions[i * 3] = Math.cos(theta) * r * 1.6
      positions[i * 3 + 1] = y * 1.6
      positions[i * 3 + 2] = Math.sin(theta) * r * 1.6
      randoms[i] = Math.random()
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      aRandom: { size: 1, data: randoms },
    })

    const vertex = /* glsl */ `
      precision highp float;
      attribute vec3 position;
      attribute float aRandom;
      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;
      uniform float uTime;
      uniform float uAmp;
      uniform float uSize;
      varying float vGlow;

      vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
      vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
      float snoise(vec3 v){
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i  = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        i = mod(i, 289.0);
        vec4 p = permute(permute(permute(
                 i.z + vec4(0.0, i1.z, i2.z, 1.0))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0))
               + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        float n_ = 1.0/7.0;
        vec3 ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
        p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }

      void main(){
        vec3 dir = normalize(position);
        float n = snoise(position * 0.9 + uTime * 0.22);
        float n2 = snoise(position * 2.3 - uTime * 0.12);
        float disp = (n * 0.6 + n2 * 0.25) * uAmp;
        vec3 pos = position + dir * disp;

        vGlow = smoothstep(-0.2, 0.5, n) * (0.5 + aRandom * 0.5);

        vec4 mv = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mv;
        // size attenuates with depth; tiny twinkle
        float tw = 0.7 + 0.3 * sin(uTime * 2.0 + aRandom * 30.0);
        gl_PointSize = uSize * tw * (1.0 / -mv.z);
      }
    `

    const fragment = /* glsl */ `
      precision highp float;
      varying float vGlow;
      void main(){
        // round soft point
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        if (d > 0.5) discard;
        float alpha = smoothstep(0.5, 0.0, d);

        vec3 mag  = vec3(0.95, 0.13, 0.62);
        vec3 pink = vec3(1.0, 0.55, 0.9);
        vec3 col = mix(mag, pink, vGlow);

        gl_FragColor = vec4(col, alpha * (0.35 + vGlow * 0.65));
      }
    `

    const program = new Program(gl, {
      vertex,
      fragment,
      transparent: true,
      depthTest: false,
      uniforms: {
        uTime: { value: 0 },
        uAmp: { value: reduceMotion ? 0.18 : 0.42 },
        uSize: { value: Math.min(window.devicePixelRatio, 2) * 130 },
      },
    })

    const mesh = new Mesh(gl, { geometry, program, mode: gl.POINTS })
    mesh.setParent(scene)

    const target = new Vec2(0, 0)
    const current = new Vec2(0, 0)
    const onMove = (e: PointerEvent) => {
      const r = mount.getBoundingClientRect()
      target.set(
        ((e.clientX - r.left) / r.width) * 2 - 1,
        ((e.clientY - r.top) / r.height) * 2 - 1,
      )
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    function resize() {
      if (!mount) return
      const w = mount.clientWidth
      const h = mount.clientHeight
      renderer.setSize(w, h)
      camera.perspective({ aspect: w / h })
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

      current.x += (target.x - current.x) * 0.05
      current.y += (target.y - current.y) * 0.05
      mesh.rotation.y = current.x * 0.6 + (reduceMotion ? 0 : t * 0.12)
      mesh.rotation.x = current.y * 0.45

      renderer.render({ scene, camera })
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
