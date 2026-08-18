/**
 * Tao Tajima–style distortion hero (shadcn-style path: components/ui).
 *
 * Recreates the signature taotajima.jp feel: a full-bleed media plane (video or image)
 * with a continuously flowing liquid/wave distortion, a mouse-follow ripple, and a subtle
 * RGB (chromatic) shift. Built on vanilla Three.js with a custom GLSL shader.
 *
 * Pass `videoSrc` for the cinematic video version (recommended, like the reference site)
 * and/or `imageSrc` as an instant-loading poster + graceful fallback.
 *
 * @see https://taotajima.jp/works/the-9d-project/
 */
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`

const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform sampler2D uTexture;
  uniform vec2 uResolution;   // canvas size (px)
  uniform vec2 uImageRes;     // texture size (px)
  uniform float uTime;
  uniform vec2 uMouse;        // smoothed pointer in 0..1
  uniform float uHover;       // 0..1 pointer presence
  uniform float uAmp;         // global amplitude (reduced-motion aware)

  // Ashima 2D simplex noise
  vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec2 mod289(vec2 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec3 permute(vec3 x){ return mod289(((x*34.0)+1.0)*x); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0))
                            + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // background-cover uv remap so the media never stretches
  vec2 coverUv(vec2 uv){
    vec2 s = uResolution / uImageRes;
    float scale = max(s.x, s.y);
    vec2 size = uImageRes * scale;
    vec2 offset = (uResolution - size) * 0.5;
    return (uv * uResolution - offset) / size;
  }

  void main(){
    vec2 uv = coverUv(vUv);

    // continuous flowing distortion (the "liquid" base motion)
    float t = uTime * 0.18;
    float n1 = snoise(vec2(uv.x * 2.5 + t, uv.y * 2.5 - t * 1.1));
    float n2 = snoise(vec2(uv.y * 3.5 - t * 0.8, uv.x * 3.5 + t * 0.6));
    vec2 flow = vec2(n1, n2) * 0.015 * uAmp;

    // mouse ripple — radial wave that fades with distance
    float d = distance(vUv, uMouse);
    float ripple = sin(d * 42.0 - uTime * 3.2) * exp(-d * 7.0);
    vec2 dir = normalize(vUv - uMouse + 1e-4);
    vec2 mouseDisp = dir * ripple * 0.018 * uHover * uAmp;

    vec2 disp = flow + mouseDisp;
    float mag = length(disp);

    // chromatic / RGB split scales with displacement magnitude
    vec2 shift = disp * 1.6 + dir * (0.004 + 0.02 * uHover) * mag * 60.0;
    float r = texture2D(uTexture, uv + disp + shift).r;
    float g = texture2D(uTexture, uv + disp).g;
    float b = texture2D(uTexture, uv + disp - shift).b;
    vec3 col = vec3(r, g, b);

    // gentle cinematic vignette
    float vig = smoothstep(1.15, 0.35, distance(vUv, vec2(0.5)));
    col *= mix(0.78, 1.0, vig);

    gl_FragColor = vec4(col, 1.0);
  }
`

export default function DistortionHero({
    sectionId = 'hero',
    imageSrc,
    videoSrc,
    className = '',
    children,
}) {
    const containerRef = useRef(null)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return undefined

        const reduce =
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
        })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
        renderer.setSize(container.clientWidth, container.clientHeight)
        container.appendChild(renderer.domElement)
        Object.assign(renderer.domElement.style, {
            position: 'absolute',
            inset: '0',
            width: '100%',
            height: '100%',
            display: 'block',
        })

        const scene = new THREE.Scene()
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

        const uniforms = {
            uTexture: { value: null },
            uResolution: {
                value: new THREE.Vector2(container.clientWidth, container.clientHeight),
            },
            uImageRes: { value: new THREE.Vector2(1, 1) },
            uTime: { value: 0 },
            uMouse: { value: new THREE.Vector2(0.5, 0.5) },
            uHover: { value: 0 },
            uAmp: { value: reduce ? 0.25 : 1 },
        }

        const material = new THREE.ShaderMaterial({
            uniforms,
            vertexShader: VERTEX_SHADER,
            fragmentShader: FRAGMENT_SHADER,
        })
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)
        scene.add(mesh)

        let videoEl = null
        let activeTexture = null

        const setTexture = (texture, width, height) => {
            const previous = activeTexture
            activeTexture = texture
            uniforms.uTexture.value = texture
            uniforms.uImageRes.value.set(width || 1, height || 1)
            if (previous && previous !== texture) previous.dispose()
        }

        // 1) instant image (poster + fallback)
        if (imageSrc) {
            const loader = new THREE.TextureLoader()
            loader.setCrossOrigin('anonymous')
            loader.load(imageSrc, (tex) => {
                tex.minFilter = THREE.LinearFilter
                tex.magFilter = THREE.LinearFilter
                tex.generateMipmaps = false
                const img = tex.image
                setTexture(tex, img?.naturalWidth || img?.width, img?.naturalHeight || img?.height)
            })
        }

        // 2) upgrade to video when it can play (the cinematic version)
        if (videoSrc) {
            videoEl = document.createElement('video')
            videoEl.src = videoSrc
            videoEl.muted = true
            videoEl.loop = true
            videoEl.playsInline = true
            videoEl.crossOrigin = 'anonymous'
            videoEl.preload = 'auto'
            const onReady = () => {
                const vTex = new THREE.VideoTexture(videoEl)
                vTex.minFilter = THREE.LinearFilter
                vTex.magFilter = THREE.LinearFilter
                vTex.generateMipmaps = false
                setTexture(vTex, videoEl.videoWidth, videoEl.videoHeight)
                if (!reduce) {
                    const p = videoEl.play()
                    if (p && typeof p.catch === 'function') p.catch(() => {})
                }
            }
            videoEl.addEventListener('canplay', onReady, { once: true })
            videoEl.load()
        }

        // pointer (smoothed) + hover
        const targetMouse = new THREE.Vector2(0.5, 0.5)
        let targetHover = 0
        const onPointerMove = (e) => {
            const rect = container.getBoundingClientRect()
            targetMouse.set(
                (e.clientX - rect.left) / rect.width,
                1 - (e.clientY - rect.top) / rect.height
            )
            targetHover = 1
        }
        const onPointerLeave = () => {
            targetHover = 0
        }
        window.addEventListener('pointermove', onPointerMove, { passive: true })
        container.addEventListener('pointerleave', onPointerLeave)

        // resize
        const resize = () => {
            const w = container.clientWidth
            const h = container.clientHeight
            renderer.setSize(w, h)
            uniforms.uResolution.value.set(w, h)
        }
        const ro = new ResizeObserver(resize)
        ro.observe(container)

        const clock = new THREE.Clock()
        let raf = 0
        const tick = () => {
            const dt = clock.getDelta()
            uniforms.uTime.value += dt
            uniforms.uMouse.value.lerp(targetMouse, 0.06)
            uniforms.uHover.value += (targetHover - uniforms.uHover.value) * 0.05
            renderer.render(scene, camera)
            raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)

        return () => {
            cancelAnimationFrame(raf)
            ro.disconnect()
            window.removeEventListener('pointermove', onPointerMove)
            container.removeEventListener('pointerleave', onPointerLeave)
            if (videoEl) {
                videoEl.pause()
                videoEl.removeAttribute('src')
                videoEl.load()
            }
            mesh.geometry.dispose()
            material.dispose()
            if (activeTexture) activeTexture.dispose()
            renderer.dispose()
            if (renderer.domElement.parentNode === container) {
                container.removeChild(renderer.domElement)
            }
        }
    }, [imageSrc, videoSrc])

    return (
        <section
            id={sectionId}
            className={`relative min-h-screen w-full overflow-hidden bg-bg-primary text-text-primary ${className}`}
        >
            <div ref={containerRef} className="absolute inset-0 z-0" aria-hidden />
            {/* cinematic scrim so overlay text stays readable */}
            <div
                className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-t from-bg-primary/85 via-bg-primary/20 to-bg-primary/55"
                aria-hidden
            />
            <div className="relative z-[2] min-h-screen pointer-events-none">{children}</div>
        </section>
    )
}
