import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const COUNT = 15000; // High particle count

// Custom Shader Material for GPU-based morphing
const morphVertexShader = `
  uniform float uTime;
  uniform float uScroll;
  uniform float uPixelRatio;
  
  attribute vec3 position2;
  attribute vec3 position3;
  attribute vec3 position4;
  attribute vec3 position5;
  attribute float size;
  
  varying vec3 vColor;
  
  // Simplex noise function
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute( permute( permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                  dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    vec3 pos1 = position;
    
    // ADJUSTED SCROLL MAPPING
    // 0-1: Mic -> Waveform
    // 1-2: Waveform -> Question Mark
    // 2-3: Question Mark -> Brain
    // 3-4: Brain -> Cloud
    
    // We multiply uScroll by 4.0 because we have 5 states (4 transitions)
    float section = min(uScroll * 4.0, 3.999); 
    float sectionIndex = floor(section);
    float progress = fract(section);
    float t = smoothstep(0.1, 0.9, progress); // Smoother transition
    
    vec3 currentPos = pos1;
    
    if (sectionIndex < 0.5) {
      currentPos = mix(pos1, position2, t);
    } else if (sectionIndex < 1.5) {
      currentPos = mix(position2, position3, t);
    } else if (sectionIndex < 2.5) {
      currentPos = mix(position3, position4, t);
    } else {
      currentPos = mix(position4, position5, t);
    }
    
    float noise = snoise(currentPos * 0.5 + uTime * 0.2);
    currentPos += vec3(noise * 0.05, noise * 0.05, noise * 0.05);
    
    vec4 mvPosition = modelViewMatrix * vec4(currentPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    float sizeAtten = size * uPixelRatio * (30.0 / -mvPosition.z);
    gl_PointSize = max(0.5, sizeAtten); 
    
    // Emerald Green Theme
    float brightness = 0.5 + noise * 0.5;
    vColor = vec3(0.0, 0.9, 0.5) * brightness;
  }
`;

const morphFragmentShader = `
  varying vec3 vColor;
  
  void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    if (dist > 0.5) discard;
    gl_FragColor = vec4(vColor, 0.8);
  }
`;

export const MorphingParticles: React.FC = () => {
  const meshRef = useRef<THREE.Points>(null);
  
  const { geometry, material } = useMemo(() => {
    const pos1 = new Float32Array(COUNT * 3);
    const pos2 = new Float32Array(COUNT * 3);
    const pos3 = new Float32Array(COUNT * 3); // Question Mark
    const pos4 = new Float32Array(COUNT * 3); // Brain
    const pos5 = new Float32Array(COUNT * 3); // Cloud
    const s = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
        const i3 = i * 3;
        
        // --- SHAPE 1: HERO MIC ---
        // Requirement 2: Make it big
        // Requirement 1: Anchor vertically (move down)
        
        const offsetX1 = 5.0; // Moved right
        const micScale = 1.6; // Scale up sizing
        const micYOffset = -1.5; // Move down more to center vertically with text
        
        const rnd = Math.random();
        
        if (rnd < 0.5) {
            // CAPSULE BODY
            const h = (Math.random() - 0.5) * 2.2 * micScale; 
            const theta = Math.random() * Math.PI * 2;
            const r = 0.6 * Math.sqrt(Math.random()) * micScale; 
            
            pos1[i3] = (r * Math.cos(theta)) + offsetX1;
            pos1[i3+1] = h + 1.2 * micScale + micYOffset; // Scaled offset
            pos1[i3+2] = r * Math.sin(theta);

        } else if (rnd < 0.9) {
            // U-SHAPE CUP
            const subRnd = Math.random();
            const cupR = 0.85 * micScale; 
            
            if (subRnd < 0.6) {
                // Bottom Bowl
                const arcAngle = Math.PI * (Math.random());
                const x = cupR * Math.cos(arcAngle);
                const y = -cupR * Math.sin(arcAngle); 
                
                const depthTheta = Math.random() * Math.PI * 2;
                const thickness = 0.1 * micScale;
                
                pos1[i3] = x + offsetX1; 
                pos1[i3+1] = y + 0.6 * micScale + micYOffset; 
                pos1[i3+2] = thickness * Math.sin(depthTheta);
            } else {
                 // Vertical Sides
                 const side = Math.random() > 0.5 ? 1 : -1;
                 const hSide = Math.random() * 0.8 * micScale; 
                 const depthTheta = Math.random() * Math.PI * 2;
                 const thickness = 0.1 * micScale;
                 
                 pos1[i3] = (side * cupR) + offsetX1;
                 pos1[i3+1] = 0.6 * micScale + hSide + micYOffset;
                 pos1[i3+2] = thickness * Math.sin(depthTheta);
            }
            
        } else {
             // STEM
             const stemH = Math.random() * 0.6 * micScale;
             const rStem = 0.1 * Math.sqrt(Math.random()) * micScale;
             const thetaStem = Math.random() * Math.PI * 2;
             
             pos1[i3] = (rStem * Math.cos(thetaStem)) + offsetX1;
             pos1[i3+1] = -0.2 * micScale - stemH + micYOffset; // Adjust attachment point
             pos1[i3+2] = rStem * Math.sin(thetaStem); 
             
             // Base
             if (Math.random() > 0.7) {
                 const baseW = (Math.random() - 0.5) * 1.0 * micScale;
                 pos1[i3] = baseW + offsetX1;
                 pos1[i3+1] = -0.8 * micScale - stemH + micYOffset;
                 pos1[i3+2] = (Math.random()-0.5) * 0.1;
             }
        }


        // --- SHAPE 2: PHILOSOPHY WAVEFORM ---
        // Requirement: "zig zaggy design", "whole width of the window"
        
        const offsetX2 = 0.0; // Centered horizontally
        
        const width = 24.0; // Much wider, basically full screen width
        const xPos = (Math.random() - 0.5) * width;
        
        // Multi-layered "Zig Zaggy" / Digital Audio look
        // We can stack a few sine waves with high frequency to create that nervous/active look
        // The attached image often looks like a filled waveform or multiple lines.
        
        // Create 3 "lines" or layers within the wave
        const layer = Math.floor(Math.random() * 3);
        
        let signal = 0;
        
        // High frequency "carrier" for the zig-zag look
        const carrier = Math.sin(xPos * 5.0 + (Math.random()*0.5)); 
        
        // Envelope to taper off at the edges of the screen
        const envelope = Math.exp(-xPos*xPos * 0.05); 
        
        if (layer === 0) {
            // Main loud wave
            signal = Math.sin(xPos * 3.0) * carrier * 1.5;
        } else if (layer === 1) {
            // Secondary harmonic
            signal = Math.cos(xPos * 4.5) * carrier * 1.0;
        } else {
            // Tertiary
            signal = Math.sin(xPos * 2.0 + 1.0) * carrier * 0.8;
        }
        
        // Sharpness for "zig zag" feel
        // If we quantize or add noise it looks digital
        // Let's just create vertical "bars" feel by varying Y randomly per X
        const yBase = signal * envelope;
        
        // Use random height to simulate the vertical lines in a spectrum visualizer
        const yPos = (Math.random() - 0.5) * 4.0 * Math.abs(yBase);
        
        const zPos = (Math.random() - 0.5) * 2.0;
        
        pos2[i3] = xPos + offsetX2; 
        pos2[i3+1] = yPos * 1.5; // Scale vertical amplitude
        pos2[i3+2] = zPos;

        // --- SHAPE 3: QUESTION MARK ---
        // Requirement: "question mark at the centre of the screen"
        
        const qOffsetX = 0.0; // Centered
        const qOffsetY = 0.5; // Slight adjustment up
        const qScale = 1.2;
        
        const type = Math.random();
        
        if (type < 0.15) {
            // THE DOT
            const theta = Math.random() * Math.PI * 2;
            const r = Math.sqrt(Math.random()) * 0.4 * qScale;
            
            pos3[i3] = (r * Math.cos(theta)) + qOffsetX;
            pos3[i3+1] = (-2.5 * qScale) + (Math.random()*0.2) + qOffsetY;
            pos3[i3+2] = r * Math.sin(theta);
            
        } else if (type < 0.45) {
             // THE STEM (Vertical part below hook)
             const w = (Math.random() - 0.5) * 0.4 * qScale;
             const h = Math.random() * 1.5 * qScale;
             const z = (Math.random() - 0.5) * 0.2;
             
             pos3[i3] = w + qOffsetX;
             pos3[i3+1] = (-1.5 * qScale) + h + qOffsetY;
             pos3[i3+2] = z;
             
        } else {
             // THE CURL / HOOK
             // Parametric equation for the top part
             // A semi-circle that continues inward
             
             // Angle 0 at top?
             // Let's use polar coords for the main arc
             // Start from angle -0.5 (leftish) to +PI (bottom right) to curl in
             
             // Simplest visual approx:
             // Arc center roughly at (0, 1.0)
             // Radius ~1.2
             // Angle from -2.5 (bottom left of arc) to 0.5 (inside curl) ? 
             
             // Let's create a thick arc
             const angle = -0.5 + (Math.random() * (Math.PI + 1.5)); 
             // Angle range needs tuning to look like '?'
             // Let's map 0..1 to the path of the question mark curve
             
             // Better path approach:
             // Main arc:
             const rBase = 1.3 * qScale;
             const thickness = 0.3 * qScale;
             
             // We want the arc to go from say 200 degrees (bottom left) up and around to center
             const t = Math.random(); 
             
             // Angle mapping: 
             // Start at PI (left), go up (PI/2), go right (0), go down/in (-PI/2)
             const theta = Math.PI - (t * (Math.PI * 1.6));
             
             const r = rBase + (Math.random()-0.5) * thickness;
             
             pos3[i3] = (r * Math.cos(theta)) + qOffsetX;
             pos3[i3+1] = (r * Math.sin(theta) + 1.0 * qScale) + qOffsetY;
             pos3[i3+2] = (Math.random()-0.5) * 0.5;
        }

        // --- SHAPE 4: FEATURES BRAIN/GLOBE ---
        // Was Shape 3
        
        const offsetX3 = 5.0; 
        
        // Sphere/Globe Shape
        const r3 = 2.5;
        // Even distribution on sphere surface
        const u = Math.random();
        const v = Math.random();
        const theta3 = 2 * Math.PI * u;
        const phi3 = Math.acos(2 * v - 1);
        
        // Noisy sphere (Globe)
        const radVar = 1.0 + (Math.sin(theta3*10.0)*0.05 + Math.cos(phi3*10.0)*0.05);
        
        pos4[i3] = (r3 * radVar * Math.sin(phi3) * Math.cos(theta3)) + offsetX3;
        pos4[i3+1] = r3 * radVar * Math.sin(phi3) * Math.sin(theta3);
        pos4[i3+2] = r3 * radVar * Math.cos(phi3);

        // --- SHAPE 5: CLOUD ---
        // Was Shape 4
        const theta4 = Math.random() * Math.PI * 2;
        const r4 = 4.0 + Math.random() * 10.0; 
        const h4 = (Math.random() - 0.5) * 20.0;
        
        pos5[i3] = r4 * Math.cos(theta4);
        pos5[i3+1] = h4;
        pos5[i3+2] = r4 * Math.sin(theta4);

        // Random particle size - TINY DUST
        s[i] = Math.pow(Math.random(), 3.0) * 0.8 + 0.1; 
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos1, 3));
    geo.setAttribute('position2', new THREE.BufferAttribute(pos2, 3));
    geo.setAttribute('position3', new THREE.BufferAttribute(pos3, 3));
    geo.setAttribute('position4', new THREE.BufferAttribute(pos4, 3));
    geo.setAttribute('position5', new THREE.BufferAttribute(pos5, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(s, 1));

    const mat = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uScroll: { value: 0 },
            uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
        },
        vertexShader: morphVertexShader,
        fragmentShader: morphFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    return { geometry: geo, material: mat };
  }, []);

  const targetScroll = useRef(0);
  const currentScrollValue = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
        try {
            // Use Viewport Height units instead of total percentage for precise section timing
            // 0 = Top (Hero)
            // 1 = Philosophy (Waveform)
            // 2 = How It Works (Question Mark)
            // 3 = Features (Brain)
            
            const vh = window.innerHeight;
            const scrollVh = window.scrollY / vh; 
            
            // SMOOTH SCROLL MAPPING
            // We need a continuous function to avoid jumps/glitches.
            // 0.0 -> 1.0: Normal speed
            // 1.0 -> 2.0: Accelerate significantly to finish Question Mark early
            // 2.0 -> 3.0: Decelerate/Hold to keep Question Mark visible? No, transition to Brain.
            // 3.0 -> 4.0: Super slow to keep Brain visible.
            
            let target = scrollVh;
            
            // Piecewise continuous function
            if (scrollVh <= 1.0) {
                // Intro -> Philosophy: 1:1
                target = scrollVh;
            } else if (scrollVh <= 2.0) {
                // Philosophy -> How It Works: Accelerate to show Question Mark earlier
                // Map input [1.0, 2.0] to output [1.0, 2.2]
                // This means at Scroll 2.0 ("How It Works"), we are already 20% into the NEXT transition
                // ensuring the Question Mark is fully done.
                target = 1.0 + (scrollVh - 1.0) * 1.2;
            } else if (scrollVh <= 3.0) {
                // How It Works -> Features:
                // We are starting from 2.2 (from previous step continuity)
                // We need to end at 3.0 (Features fully formed)
                // Map input [2.0, 3.0] to output [2.2, 3.0]
                // This is slightly slower than 1:1, allowing user to see the transition
                target = 2.2 + (scrollVh - 2.0) * 0.8;
            } else {
                // Features -> Footer/Cloud
                // Start from 3.0
                // Slow down significantly to keep Brain visible
                // Map input [3.0, infinity] -> start at 3.0, slope 0.5
                target = 3.0 + (scrollVh - 3.0) * 0.5;
            }
            
            targetScroll.current = target / 4.0;
        } catch (e) {
            targetScroll.current = 0;
        }
    };
    handleScroll(); 
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame((state) => {
    if (material) {
        material.uniforms.uTime.value = state.clock.getElapsedTime();
        const target = targetScroll.current;
        currentScrollValue.current += (target - currentScrollValue.current) * 0.05;
        material.uniforms.uScroll.value = currentScrollValue.current;
        material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
    }
    if (meshRef.current) {
         meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.05;
    }
  });

  return (
    <points ref={meshRef} geometry={geometry} material={material} frustumCulled={false} />
  );
};
