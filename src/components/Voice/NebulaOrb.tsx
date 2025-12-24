import { useRef, useEffect, useCallback, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

export type OrbState = 'idle' | 'listening' | 'processing' | 'speaking';
export type OrbShape = 'sphere' | 'heart' | 'saturn' | 'torus' | 'spiral';

interface NebulaOrbProps {
  state: OrbState;
  shape?: OrbShape;
  audioLevel?: number;
  onReady?: () => void;
}

// Vertex shader with multi-shape morphing
const vertexShader = `
  uniform float uTime;
  uniform float uAudioLevel;
  uniform float uMorphSphere;
  uniform float uMorphHeart;
  uniform float uMorphSaturn;
  uniform float uMorphTorus;
  uniform float uMorphSpiral;
  uniform float uPulse;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  
  attribute vec3 aSphere;
  attribute vec3 aHeart;
  attribute vec3 aSaturn;
  attribute vec3 aTorus;
  attribute vec3 aSpiral;
  attribute float aRandom;
  
  varying vec3 vColor;
  varying float vAlpha;
  varying float vDepth;
  
  // Simplex noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    
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
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  void main() {
    // Blend between all shapes based on morph uniforms
    vec3 pos = aSphere * uMorphSphere 
             + aHeart * uMorphHeart 
             + aSaturn * uMorphSaturn 
             + aTorus * uMorphTorus 
             + aSpiral * uMorphSpiral;
    
    // Curl noise for liquid movement
    float noiseFreq = 0.7;
    float noiseAmp = 0.12 + (uAudioLevel * 0.35);
    float timeOffset = uTime * 0.12 + aRandom * 6.28;
    
    vec3 noisePos = pos * noiseFreq + timeOffset;
    float noise1 = snoise(noisePos);
    float noise2 = snoise(noisePos + vec3(100.0));
    float noise3 = snoise(noisePos + vec3(200.0));
    
    pos += vec3(noise1, noise2, noise3) * noiseAmp;
    
    // Breathing pulse
    float pulse = sin(uTime * 1.5 + aRandom * 3.14) * 0.025 * (1.0 + uAudioLevel * 2.0);
    pos *= 1.0 + pulse + uPulse * 0.08;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    // Size based on audio and distance
    float size = (10.0 / -mvPosition.z) * (1.0 + uAudioLevel * 1.2);
    size *= 0.7 + aRandom * 0.6;
    gl_PointSize = size;
    gl_Position = projectionMatrix * mvPosition;
    
    // Dynamic color based on shape and position
    float dist = length(pos);
    float colorMix = sin(dist * 2.5 + uTime * 0.4) * 0.5 + 0.5;
    float colorMix2 = cos(atan(pos.y, pos.x) + uTime * 0.2) * 0.5 + 0.5;
    
    vec3 baseColor = mix(uColorA, uColorB, colorMix);
    vColor = mix(baseColor, uColorC, colorMix2 * 0.4 + uAudioLevel * 0.3);
    
    // Boost color intensity for bloom
    vColor *= 1.2 + uAudioLevel * 0.5;
    
    vAlpha = 0.5 + aRandom * 0.5;
    vDepth = -mvPosition.z;
  }
`;

// Fragment shader with enhanced glow for bloom
const fragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;
  varying float vDepth;
  
  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    
    // Soft circular gradient with hot center
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    alpha = pow(alpha, 1.3) * vAlpha;
    
    // Inner glow intensity for bloom pickup
    float glow = 1.0 - smoothstep(0.0, 0.25, dist);
    glow = pow(glow, 2.0);
    
    vec3 finalColor = vColor + vColor * glow * 0.6;
    
    // Depth-based fade
    float depthFade = clamp(vDepth / 5.0, 0.4, 1.0);
    
    gl_FragColor = vec4(finalColor, alpha * 0.7 * depthFade);
  }
`;

// Shape generators
function generateSphere(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const phi = Math.acos(-1 + (2 * i) / count);
    const theta = Math.sqrt(count * Math.PI) * phi;
    
    const r = radius * (0.9 + Math.random() * 0.2);
    positions[i * 3] = r * Math.cos(theta) * Math.sin(phi);
    positions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  return positions;
}

function generateHeart(count: number, scale: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
    const z = (Math.random() - 0.5) * 8;
    
    const jitter = 0.15;
    positions[i * 3] = (x / 16) * scale + (Math.random() - 0.5) * jitter;
    positions[i * 3 + 1] = (y / 16) * scale + (Math.random() - 0.5) * jitter;
    positions[i * 3 + 2] = (z / 16) * scale * 0.3;
  }
  return positions;
}

function generateSaturn(count: number, planetRadius: number, ringRadius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const planetParticles = Math.floor(count * 0.4);
  
  for (let i = 0; i < planetParticles; i++) {
    const phi = Math.acos(-1 + (2 * i) / planetParticles);
    const theta = Math.sqrt(planetParticles * Math.PI) * phi;
    
    positions[i * 3] = planetRadius * Math.cos(theta) * Math.sin(phi);
    positions[i * 3 + 1] = planetRadius * Math.sin(theta) * Math.sin(phi) * 0.8;
    positions[i * 3 + 2] = planetRadius * Math.cos(phi);
  }
  
  for (let i = planetParticles; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const ringDist = ringRadius + (Math.random() - 0.5) * 0.4;
    
    positions[i * 3] = Math.cos(angle) * ringDist;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 0.05;
    positions[i * 3 + 2] = Math.sin(angle) * ringDist;
  }
  return positions;
}

function generateTorus(count: number, radius: number, tubeRadius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = (i / count) * Math.PI * 2;
    const v = Math.random() * Math.PI * 2;
    
    const x = (radius + tubeRadius * Math.cos(v)) * Math.cos(u);
    const y = tubeRadius * Math.sin(v);
    const z = (radius + tubeRadius * Math.cos(v)) * Math.sin(u);
    
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }
  return positions;
}

function generateSpiral(count: number, radius: number, height: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const turns = 4;
  
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const angle = t * Math.PI * 2 * turns;
    const r = radius * (0.3 + t * 0.7) + (Math.random() - 0.5) * 0.1;
    
    positions[i * 3] = Math.cos(angle) * r;
    positions[i * 3 + 1] = (t - 0.5) * height;
    positions[i * 3 + 2] = Math.sin(angle) * r;
  }
  return positions;
}

// Color palettes for different states
const colorPalettes = {
  idle: {
    colorA: new THREE.Color(0.35, 0.18, 0.7),
    colorB: new THREE.Color(0.15, 0.45, 0.8),
    colorC: new THREE.Color(0.55, 0.25, 0.6),
  },
  listening: {
    colorA: new THREE.Color(0.1, 0.55, 0.8),
    colorB: new THREE.Color(0.2, 0.75, 0.7),
    colorC: new THREE.Color(0.1, 0.35, 0.7),
  },
  processing: {
    colorA: new THREE.Color(0.65, 0.35, 0.8),
    colorB: new THREE.Color(0.9, 0.25, 0.55),
    colorC: new THREE.Color(0.45, 0.15, 0.7),
  },
  speaking: {
    colorA: new THREE.Color(0.25, 0.7, 0.5),
    colorB: new THREE.Color(0.15, 0.8, 0.7),
    colorC: new THREE.Color(0.35, 0.9, 0.6),
  },
};

export function NebulaOrb({ state, shape, audioLevel = 0, onReady }: NebulaOrbProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    particles: THREE.Points;
    material: THREE.ShaderMaterial;
    geometry: THREE.BufferGeometry;
    maxParticles: number;
    animationId: number;
  } | null>(null);
  
  const [isInitialized, setIsInitialized] = useState(false);

  const init = useCallback(() => {
    if (!containerRef.current || sceneRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({
      antialias: false, // Disable for performance
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    // Lower pixel ratio for better performance (max 1.5)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);


    // LOD: Calculate particle count based on container size
    const minSize = Math.min(width, height);
    const getLODParticleCount = (size: number) => {
      if (size >= 400) return 18000;      // High quality
      if (size >= 300) return 12000;      // Medium quality
      if (size >= 200) return 8000;       // Low quality
      return 5000;                         // Ultra low for tiny containers
    };
    
    const particleCount = getLODParticleCount(minSize);
    const geometry = new THREE.BufferGeometry();
    
    const sphere = generateSphere(particleCount, 1);
    const heart = generateHeart(particleCount, 1.1);
    const saturn = generateSaturn(particleCount, 0.6, 1.3);
    const torus = generateTorus(particleCount, 0.8, 0.35);
    const spiral = generateSpiral(particleCount, 1, 2);
    
    const randoms = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      randoms[i] = Math.random();
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(sphere, 3));
    geometry.setAttribute('aSphere', new THREE.BufferAttribute(sphere, 3));
    geometry.setAttribute('aHeart', new THREE.BufferAttribute(heart, 3));
    geometry.setAttribute('aSaturn', new THREE.BufferAttribute(saturn, 3));
    geometry.setAttribute('aTorus', new THREE.BufferAttribute(torus, 3));
    geometry.setAttribute('aSpiral', new THREE.BufferAttribute(spiral, 3));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
    
    // Set draw range for LOD - can be adjusted dynamically
    geometry.setDrawRange(0, particleCount);

    const palette = colorPalettes.idle;
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uAudioLevel: { value: 0 },
        uMorphSphere: { value: 1 },
        uMorphHeart: { value: 0 },
        uMorphSaturn: { value: 0 },
        uMorphTorus: { value: 0 },
        uMorphSpiral: { value: 0 },
        uPulse: { value: 0 },
        uColorA: { value: palette.colorA.clone() },
        uColorB: { value: palette.colorB.clone() },
        uColorC: { value: palette.colorC.clone() },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    sceneRef.current = {
      scene,
      camera,
      renderer,
      particles,
      material,
      geometry,
      maxParticles: particleCount,
      animationId: 0
    };

    // Animation loop with proper timing
    let lastTime = performance.now();
    const animate = (currentTime: number) => {
      if (!sceneRef.current) return;
      
      const { renderer: r, scene: s, camera: cam, particles: p, material: m } = sceneRef.current;
      
      // Use delta time for consistent animation speed
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      
      m.uniforms.uTime.value += deltaTime;
      
      // Gentle rotation
      p.rotation.y += 0.002 * deltaTime * 60;
      p.rotation.x = Math.sin(m.uniforms.uTime.value * 0.1) * 0.15;
      p.rotation.z = Math.cos(m.uniforms.uTime.value * 0.08) * 0.05;
      
      // Standard rendering
      r.render(s, cam);
      
      sceneRef.current.animationId = requestAnimationFrame(animate);
    };

    sceneRef.current.animationId = requestAnimationFrame(animate);
    setIsInitialized(true);
    onReady?.();

    // LOD helper for resize
    const getLODCount = (size: number) => {
      if (size >= 400) return 18000;
      if (size >= 300) return 12000;
      if (size >= 200) return 8000;
      return 5000;
    };

    const handleResize = () => {
      if (!sceneRef.current || !containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      sceneRef.current.camera.aspect = w / h;
      sceneRef.current.camera.updateProjectionMatrix();
      sceneRef.current.renderer.setSize(w, h);
      
      // Dynamic LOD adjustment on resize
      const minSize = Math.min(w, h);
      const targetParticles = Math.min(getLODCount(minSize), sceneRef.current.maxParticles);
      sceneRef.current.geometry.setDrawRange(0, targetParticles);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [onReady]);

  useEffect(() => {
    const cleanup = init();
    
    return () => {
      cleanup?.();
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);
        sceneRef.current.renderer.dispose();
        sceneRef.current.particles.geometry.dispose();
        (sceneRef.current.particles.material as THREE.Material).dispose();
        containerRef.current?.removeChild(sceneRef.current.renderer.domElement);
        sceneRef.current = null;
      }
    };
  }, [init]);

  // Update audio level - throttled for performance
  const lastAudioUpdateRef = useRef(0);
  useEffect(() => {
    if (!sceneRef.current) return;
    
    // Throttle audio updates to max 30fps
    const now = performance.now();
    if (now - lastAudioUpdateRef.current < 33) return;
    lastAudioUpdateRef.current = now;
    
    // Direct update instead of gsap for better performance
    sceneRef.current.material.uniforms.uAudioLevel.value = 
      sceneRef.current.material.uniforms.uAudioLevel.value * 0.7 + audioLevel * 0.3;
  }, [audioLevel]);

  // Handle state transitions with shape morphing
  useEffect(() => {
    if (!sceneRef.current) return;
    
    const { material } = sceneRef.current;
    const u = material.uniforms;
    const palette = colorPalettes[state];
    
    // Transition colors
    gsap.to(u.uColorA.value, { r: palette.colorA.r, g: palette.colorA.g, b: palette.colorA.b, duration: 1.2 });
    gsap.to(u.uColorB.value, { r: palette.colorB.r, g: palette.colorB.g, b: palette.colorB.b, duration: 1.2 });
    gsap.to(u.uColorC.value, { r: palette.colorC.r, g: palette.colorC.g, b: palette.colorC.b, duration: 1.2 });
    
    switch (state) {
      case 'idle':
        gsap.to(u.uMorphSphere, { value: 1, duration: 1.5, ease: 'power3.inOut' });
        gsap.to(u.uMorphHeart, { value: 0, duration: 1.2, ease: 'power3.inOut' });
        gsap.to(u.uMorphSaturn, { value: 0, duration: 1.2, ease: 'power3.inOut' });
        gsap.to(u.uMorphTorus, { value: 0, duration: 1.2, ease: 'power3.inOut' });
        gsap.to(u.uMorphSpiral, { value: 0, duration: 1.2, ease: 'power3.inOut' });
        gsap.to(u.uPulse, { value: 0, duration: 0.5 });
        break;
        
      case 'listening':
        gsap.to(u.uMorphSphere, { value: 0, duration: 1, ease: 'power2.inOut' });
        gsap.to(u.uMorphTorus, { value: 1, duration: 1.2, ease: 'power3.out' });
        gsap.to(u.uMorphHeart, { value: 0, duration: 1, ease: 'power2.inOut' });
        gsap.to(u.uMorphSaturn, { value: 0, duration: 1, ease: 'power2.inOut' });
        gsap.to(u.uMorphSpiral, { value: 0, duration: 1, ease: 'power2.inOut' });
        gsap.to(u.uPulse, { value: 0.6, duration: 0.4 });
        break;
        
      case 'processing':
        gsap.to(u.uMorphSphere, { value: 0, duration: 0.8, ease: 'power2.inOut' });
        gsap.to(u.uMorphSpiral, { value: 1, duration: 1, ease: 'power3.out' });
        gsap.to(u.uMorphTorus, { value: 0, duration: 0.8, ease: 'power2.inOut' });
        gsap.to(u.uMorphHeart, { value: 0, duration: 0.8, ease: 'power2.inOut' });
        gsap.to(u.uMorphSaturn, { value: 0, duration: 0.8, ease: 'power2.inOut' });
        gsap.to(u.uPulse, { 
          value: 1, 
          duration: 0.3, 
          yoyo: true, 
          repeat: -1, 
          ease: 'sine.inOut' 
        });
        break;
        
      case 'speaking':
        gsap.to(u.uMorphSphere, { value: 0, duration: 1, ease: 'power2.inOut' });
        gsap.to(u.uMorphSaturn, { value: 1, duration: 1.4, ease: 'power3.out' });
        gsap.to(u.uMorphSpiral, { value: 0, duration: 1, ease: 'power2.inOut' });
        gsap.to(u.uMorphTorus, { value: 0, duration: 1, ease: 'power2.inOut' });
        gsap.to(u.uMorphHeart, { value: 0, duration: 1, ease: 'power2.inOut' });
        gsap.killTweensOf(u.uPulse);
        gsap.to(u.uPulse, { value: 0.3, duration: 0.5 });
        break;
    }
  }, [state]);

  // Handle explicit shape override
  useEffect(() => {
    if (!sceneRef.current || !shape) return;
    
    const { material } = sceneRef.current;
    const u = material.uniforms;
    
    gsap.killTweensOf([u.uMorphSphere, u.uMorphHeart, u.uMorphSaturn, u.uMorphTorus, u.uMorphSpiral]);
    
    const morphTargets = {
      sphere: { uMorphSphere: 1, uMorphHeart: 0, uMorphSaturn: 0, uMorphTorus: 0, uMorphSpiral: 0 },
      heart: { uMorphSphere: 0, uMorphHeart: 1, uMorphSaturn: 0, uMorphTorus: 0, uMorphSpiral: 0 },
      saturn: { uMorphSphere: 0, uMorphHeart: 0, uMorphSaturn: 1, uMorphTorus: 0, uMorphSpiral: 0 },
      torus: { uMorphSphere: 0, uMorphHeart: 0, uMorphSaturn: 0, uMorphTorus: 1, uMorphSpiral: 0 },
      spiral: { uMorphSphere: 0, uMorphHeart: 0, uMorphSaturn: 0, uMorphTorus: 0, uMorphSpiral: 1 },
    };
    
    const target = morphTargets[shape];
    Object.entries(target).forEach(([key, value]) => {
      gsap.to(u[key], { value, duration: 1.5, ease: 'power3.inOut' });
    });
  }, [shape]);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full absolute inset-0"
      style={{ 
        opacity: isInitialized ? 1 : 0,
        transition: 'opacity 0.8s ease-out'
      }}
    />
  );
}