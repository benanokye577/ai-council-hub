import { useRef, useEffect, useCallback, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

export type OrbState = 'idle' | 'listening' | 'processing' | 'speaking';

interface NebulaOrbProps {
  state: OrbState;
  audioLevel?: number;
  onReady?: () => void;
}

// Vertex shader for particle movement
const vertexShader = `
  uniform float uTime;
  uniform float uAudioLevel;
  uniform float uMorph;
  uniform float uPulse;
  
  attribute vec3 aTarget;
  attribute float aRandom;
  
  varying vec3 vColor;
  varying float vAlpha;
  
  // Simplex noise functions
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
    vec3 pos = mix(position, aTarget, uMorph);
    
    // Curl noise for liquid movement
    float noiseFreq = 0.8;
    float noiseAmp = 0.15 + (uAudioLevel * 0.4);
    float timeOffset = uTime * 0.15 + aRandom * 6.28;
    
    vec3 noisePos = pos * noiseFreq + timeOffset;
    float noise1 = snoise(noisePos);
    float noise2 = snoise(noisePos + vec3(100.0));
    float noise3 = snoise(noisePos + vec3(200.0));
    
    pos += vec3(noise1, noise2, noise3) * noiseAmp;
    
    // Breathing pulse
    float pulse = sin(uTime * 2.0 + aRandom * 3.14) * 0.03 * (1.0 + uAudioLevel);
    pos *= 1.0 + pulse + uPulse * 0.1;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    // Size based on audio and distance
    float size = (12.0 / -mvPosition.z) * (1.0 + uAudioLevel * 1.5);
    size *= 0.8 + aRandom * 0.4;
    gl_PointSize = size;
    gl_Position = projectionMatrix * mvPosition;
    
    // Color gradient based on position and state
    float dist = length(pos);
    vec3 colorA = vec3(0.4, 0.2, 0.8); // Deep purple
    vec3 colorB = vec3(0.1, 0.6, 0.9); // Cyan
    vec3 colorC = vec3(0.9, 0.3, 0.6); // Pink
    
    float colorMix = sin(dist * 2.0 + uTime * 0.5) * 0.5 + 0.5;
    vColor = mix(mix(colorA, colorB, colorMix), colorC, uAudioLevel * 0.5);
    
    vAlpha = 0.6 + aRandom * 0.4;
  }
`;

// Fragment shader for soft glowing particles
const fragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;
  
  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    alpha *= alpha * vAlpha;
    
    // Add glow
    vec3 glow = vColor * (1.0 - dist * 2.0) * 0.5;
    
    gl_FragColor = vec4(vColor + glow, alpha * 0.7);
  }
`;

// Generate sphere coordinates
function generateSpherePositions(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const phi = Math.acos(-1 + (2 * i) / count);
    const theta = Math.sqrt(count * Math.PI) * phi;
    
    const x = radius * Math.cos(theta) * Math.sin(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(phi);
    
    // Add some randomness
    const jitter = 0.1;
    positions[i * 3] = x + (Math.random() - 0.5) * jitter;
    positions[i * 3 + 1] = y + (Math.random() - 0.5) * jitter;
    positions[i * 3 + 2] = z + (Math.random() - 0.5) * jitter;
  }
  return positions;
}

// Generate torus/ring shape for "active" state
function generateTorusPositions(count: number, radius: number, tubeRadius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = (i / count) * Math.PI * 2;
    const v = Math.random() * Math.PI * 2;
    
    const x = (radius + tubeRadius * Math.cos(v)) * Math.cos(u);
    const y = (radius + tubeRadius * Math.cos(v)) * Math.sin(u);
    const z = tubeRadius * Math.sin(v);
    
    positions[i * 3] = x;
    positions[i * 3 + 1] = z; // Swap y and z for horizontal orientation
    positions[i * 3 + 2] = y;
  }
  return positions;
}

export function NebulaOrb({ state, audioLevel = 0, onReady }: NebulaOrbProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    particles: THREE.Points;
    material: THREE.ShaderMaterial;
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
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 3.5;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Particles
    const particleCount = 35000;
    const geometry = new THREE.BufferGeometry();
    
    const positions = generateSpherePositions(particleCount, 1);
    const targets = generateTorusPositions(particleCount, 0.9, 0.35);
    const randoms = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      randoms[i] = Math.random();
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aTarget', new THREE.BufferAttribute(targets, 3));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uAudioLevel: { value: 0 },
        uMorph: { value: 0 },
        uPulse: { value: 0 }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Store refs
    sceneRef.current = {
      scene,
      camera,
      renderer,
      particles,
      material,
      animationId: 0
    };

    // Animation loop
    const animate = () => {
      if (!sceneRef.current) return;
      
      const { renderer: r, scene: s, camera: c, particles: p, material: m } = sceneRef.current;
      
      m.uniforms.uTime.value += 0.016;
      
      // Slow rotation
      p.rotation.y += 0.001;
      p.rotation.x = Math.sin(m.uniforms.uTime.value * 0.1) * 0.1;
      
      r.render(s, c);
      sceneRef.current.animationId = requestAnimationFrame(animate);
    };

    animate();
    setIsInitialized(true);
    onReady?.();

    // Handle resize
    const handleResize = () => {
      if (!sceneRef.current || !containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      sceneRef.current.camera.aspect = w / h;
      sceneRef.current.camera.updateProjectionMatrix();
      sceneRef.current.renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [onReady]);

  // Initialize on mount
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

  // Update audio level
  useEffect(() => {
    if (!sceneRef.current) return;
    gsap.to(sceneRef.current.material.uniforms.uAudioLevel, {
      value: audioLevel,
      duration: 0.1,
      ease: 'power2.out'
    });
  }, [audioLevel]);

  // Handle state transitions
  useEffect(() => {
    if (!sceneRef.current) return;
    
    const { material } = sceneRef.current;
    
    switch (state) {
      case 'idle':
        gsap.to(material.uniforms.uMorph, { value: 0, duration: 1.5, ease: 'power3.inOut' });
        gsap.to(material.uniforms.uPulse, { value: 0, duration: 0.5 });
        break;
      case 'listening':
        gsap.to(material.uniforms.uMorph, { value: 0.3, duration: 1, ease: 'power2.out' });
        gsap.to(material.uniforms.uPulse, { value: 0.5, duration: 0.3 });
        break;
      case 'processing':
        gsap.to(material.uniforms.uMorph, { value: 0.6, duration: 0.8, ease: 'power2.inOut' });
        gsap.to(material.uniforms.uPulse, { value: 1, duration: 0.2, yoyo: true, repeat: -1 });
        break;
      case 'speaking':
        gsap.to(material.uniforms.uMorph, { value: 1, duration: 1.2, ease: 'power3.out' });
        gsap.killTweensOf(material.uniforms.uPulse);
        gsap.to(material.uniforms.uPulse, { value: 0.3, duration: 0.5 });
        break;
    }
  }, [state]);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full absolute inset-0"
      style={{ 
        opacity: isInitialized ? 1 : 0,
        transition: 'opacity 1s ease-out'
      }}
    />
  );
}