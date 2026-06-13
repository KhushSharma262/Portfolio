'use client'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'

export default function Globe() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let width = mount.clientWidth
    let height = mount.clientHeight || width

    const scene = new THREE.Scene()
    // wider FOV pulled FAR back => flat, orbital look (no fisheye)
    const camera = new THREE.PerspectiveCamera(24, width / height, 0.1, 100)
    camera.position.z = 5.4

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.08
    mount.appendChild(renderer.domElement)

    // ---- starfield ----
    const starGeo = new THREE.BufferGeometry()
    const starCount = 900
    const starPos = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      const r = 22 + Math.random() * 18
      const t = Math.random() * Math.PI * 2
      const p = Math.acos(2 * Math.random() - 1)
      starPos[i*3]   = r * Math.sin(p) * Math.cos(t)
      starPos[i*3+1] = r * Math.sin(p) * Math.sin(t)
      starPos[i*3+2] = r * Math.cos(p)
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xaaccff, size: 0.06, transparent: true, opacity: 0.6, sizeAttenuation: true }))
    scene.add(stars)

    const group = new THREE.Group()
    group.rotation.z = (23.5 * Math.PI) / 180
    scene.add(group)

    const loader = new THREE.TextureLoader()
    const maxAniso = renderer.capabilities.getMaxAnisotropy()
    const dayTex = loader.load('/textures/earth_day.jpg')
    const nightTex = loader.load('/textures/earth_night.jpg')
    const cloudTex = loader.load('/textures/earth_clouds.jpg')
    ;[dayTex, nightTex, cloudTex].forEach((t) => { t.anisotropy = maxAniso })
    dayTex.colorSpace = THREE.SRGBColorSpace
    nightTex.colorSpace = THREE.SRGBColorSpace

    const sunDirection = new THREE.Vector3(1.0, 0.15, 0.12).normalize()

    const earthMat = new THREE.ShaderMaterial({
      uniforms: {
        dayTexture: { value: dayTex },
        nightTexture: { value: nightTex },
        sunDirection: { value: sunDirection },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vWorldNormal;
        void main() {
          vUv = uv;
          vWorldNormal = normalize(mat3(modelMatrix) * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: `
        uniform sampler2D dayTexture;
        uniform sampler2D nightTexture;
        uniform vec3 sunDirection;
        varying vec2 vUv;
        varying vec3 vWorldNormal;

        // luminance as a cheap height proxy (land brighter than ocean)
        float heightAt(vec2 uv) {
          vec3 c = texture2D(dayTexture, uv).rgb;
          return dot(c, vec3(0.299, 0.587, 0.114));
        }

        void main() {
          vec3 day = texture2D(dayTexture, vUv).rgb;
          vec3 night = texture2D(nightTexture, vUv).rgb;

          // ---- derive terrain normal from height (bump mapping) ----
          float texel = 2.5 / 1024.0;
          float hL = heightAt(vUv - vec2(texel, 0.0));
          float hR = heightAt(vUv + vec2(texel, 0.0));
          float hD = heightAt(vUv - vec2(0.0, texel));
          float hU = heightAt(vUv + vec2(0.0, texel));
          float strength = 4.5;
          vec3 bump = normalize(vec3((hL - hR) * strength, (hD - hU) * strength, 1.0));

          // build a tangent basis and perturb the world normal
          vec3 N = normalize(vWorldNormal);
          vec3 up = abs(N.y) < 0.99 ? vec3(0.0,1.0,0.0) : vec3(1.0,0.0,0.0);
          vec3 T = normalize(cross(up, N));
          vec3 B = cross(N, T);
          vec3 perturbed = normalize(T * bump.x + B * bump.y + N * bump.z);

          float intensity = dot(perturbed, normalize(sunDirection));
          float baseIntensity = dot(N, normalize(sunDirection));
          float mixAmt = smoothstep(-0.18, 0.12, baseIntensity);

          // diffuse shading from terrain normal makes relief visible
          float diffuse = clamp(intensity, 0.0, 1.0);
          day = pow(day, vec3(1.05)) * 0.95;
          day += day * 0.12;
          day *= (0.45 + 0.95 * diffuse);

          vec3 nightCol = night * 2.4 + vec3(0.005, 0.012, 0.03);
          vec3 color = mix(nightCol, day, mixAmt);

          // warm sunset band along terminator
          float term = 1.0 - abs(baseIntensity);
          // terminator tint removed

          // fresnel rim
          float rim = pow(1.0 - max(dot(N, vec3(0.0,0.0,1.0)), 0.0), 3.0);
          color += vec3(0.15, 0.32, 0.7) * rim * 0.5;

          gl_FragColor = vec4(color, 1.0);
        }
      `,
    })
    const earth = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 96), earthMat)
    group.add(earth)

    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry(1.006, 96, 96),
      new THREE.MeshBasicMaterial({ map: cloudTex, transparent: true, opacity: 0.22, depthWrite: false, blending: THREE.AdditiveBlending })
    )
    group.add(clouds)

    // ---- atmosphere ----
    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.13, 96, 96),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
        uniforms: { sunDirection: { value: sunDirection } },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vWorldNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vWorldNormal = normalize(mat3(modelMatrix) * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 sunDirection;
          varying vec3 vNormal;
          varying vec3 vWorldNormal;
          void main() {
            float intensity = pow(0.66 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.6);
            float lit = smoothstep(-0.3, 0.5, dot(normalize(vWorldNormal), normalize(sunDirection)));
            vec3 col = vec3(0.30, 0.55, 1.0);
            gl_FragColor = vec4(col, 1.0) * intensity * (0.35 + lit * 0.9);
          }
        `,
      })
    )
    group.add(atmosphere)

    // ---- interaction ----
    let dragVel = 0, dragging = false, lastX = 0
    const auto = 0.0007
    const onDown = (e) => { dragging = true; lastX = e.clientX ?? 0 }
    const onMove = (e) => {
      if (!dragging) return
      const x = e.clientX ?? 0
      dragVel = (x - lastX) * 0.0008
      lastX = x
    }
    const onUp = () => { dragging = false }
    renderer.domElement.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)

    let raf
    const animate = () => {
      group.rotation.y += auto + dragVel
      clouds.rotation.y += 0.00018
      stars.rotation.y -= 0.0001
      if (!dragging) dragVel *= 0.95
      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }
    animate()

    const ro = new ResizeObserver(() => {
      width = mount.clientWidth
      height = mount.clientHeight || width
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    })
    ro.observe(mount)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      renderer.domElement.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      renderer.dispose()
      earth.geometry.dispose(); earthMat.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />
}








