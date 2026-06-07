'use client'

import { useEffect, useRef } from 'react'
import { Renderer, Camera, Transform, Program, Mesh, Sphere, Vec2 } from 'ogl'

/**
 * Interactive WebGL 3D hero object: an organically morphing sphere lit with a
 * magenta fresnel rim against deep black. Rotates on its own and eases toward
 * the cursor. Pure OGL (tiny) so it stays fast. Falls back to nothing on
 * unsupported devices / reduced-motion.
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
    mount.appendChild(gl.canvas)
    gl.canvas.style.width = '100%'
    gl.canvas.style.height = '100%'
    gl.canvas.style.display = 'block'

    const camera = new Camera(gl, { fov: 35 })
    camera.position.set(0, 0, 7)

    const scene = new Transform()
    const geometry = new Sphere(gl, { radius: 1.6, widthSegments: 128, heightSegments: 128 })

    const vertex = /* glsl */ `
      precision highp float;
      attribute vec3 position;
      attribute vec3 normal;
      attribute vec2 uv;
      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;
      uniform mat3 normalMatrix;
      uniform float uTime;
      uniform float uAmp;
      varying vec3 vNormal;
      varying vec3 vView;
      varying float vDisp;

      // classic 3D simplex noise (Ashima)
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
        float n = snoise(position * 0.9 + uTime * 0.25);
        float n2 = snoise(position * 2.2 - uTime * 0.15);
        float disp = (n * 0.55 + n2 * 0.2) * uAmp;
        vec3 pos = position + normal * disp;
        vDisp = disp;
        vNormal = normalize(normalMatrix * normal);
        vec4 mv = modelViewMatrix * vec4(pos, 1.0);
        vView = -mv.xyz;
        gl_Position = projectionMatrix * mv;
      }
    `

    const fragment = /* glsl */ `
      precision highp float;
      varying vec3 vNormal;
      varying vec3 vView;
      varying float vDisp;
      uniform float uTime;

      void main(){
        vec3 N = normalize(vNormal);
        vec3 V = normalize(vView);
        float fres = pow(1.0 - max(dot(N, V), 0.0), 1.8);

        // key light from upper-left for 3D form readability
        vec3 L = normalize(vec3(-0.5, 0.8, 0.6));
        float diff = max(dot(N, L), 0.0);

        vec3 base = vec3(0.07, 0.03, 0.10);
        vec3 mag  = vec3(0.95, 0.13, 0.62);
        vec3 pink = vec3(1.0, 0.5, 0.88);

        vec3 col = base;
        col += mag * diff * 0.55;                       // soft body shading
        col = mix(col, mag, fres);                      // magenta fresnel rim
        col += pink * smoothstep(0.45, 1.0, fres) * 1.1; // bright rim highlight
        col += mag * max(vDisp, 0.0) * 0.7;             // glow on ridges

        gl_FragColor = vec4(col, 1.0);
      }
    `

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uAmp: { value: reduceMotion ? 0.12 : 0.32 },
      },
    })

    const mesh = new Mesh(gl, { geometry, program })
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
      mesh.rotation.y = current.x * 0.6 + (reduceMotion ? 0 : t * 0.15)
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
