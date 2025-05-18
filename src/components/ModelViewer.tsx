import { useRef, useEffect, useState, useMemo } from 'react';
import { useGLTF, PerspectiveCamera, Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface Particle {
  position: THREE.Vector3;
  color: string;
  speed: number;
  offset: number;
}

interface FireParticle extends Particle {
  size: number;
}

// Add new constants for fire particles
const FIRE_COLORS = ['#ff4500', '#ff7700', '#ffaa00', '#ffcc00', '#ffff00'];
const GLOW_COLOR = '#00ffff';
const SHIMMER_COLOR = '#ffffff';

const COLORS = ['#ff00ff', '#00ffff', '#7f00ff'];

const ModelViewer = () => {
  const modelRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const fireParticlesRef = useRef<THREE.Points>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const shimmerRef = useRef<THREE.Mesh>(null);
  const { scene } = useGLTF('/model.glb');
  const { viewport } = useThree();
  const [hovered, setHovered] = useState(false);

  // Create custom textures for effects
  const fireTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    if (context) {
      const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.3, 'rgba(255, 200, 0, 0.8)');
      gradient.addColorStop(0.7, 'rgba(255, 50, 0, 0.4)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 64, 64);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Create shimmer effect texture
  const shimmerTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    if (context) {
      const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      gradient.addColorStop(0.5, 'rgba(200, 255, 255, 0.5)');
      gradient.addColorStop(1, 'rgba(180, 220, 255, 0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 128, 128);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Add viewport-aware scaling
  const isMobile = viewport.width < 5; // Three.js units, roughly equivalent to viewport width < 768px
  
  // Calculate responsive font size and spacing
  const fontSize = isMobile ? 0.8 : 1.5;
  const verticalSpacing = isMobile ? 0.8 : 1.5;
  const zOffset = isMobile ? -1.5 : -2.5;

  // Create particles
  const particles = useMemo(() => {
    const temp: Particle[] = [];
    for (let i = 0; i < 300; i++) {
      temp.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        ),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        speed: Math.random() * 0.2 + 0.1,
        offset: Math.random() * Math.PI * 2
      });
    }
    return temp;
  }, []);

  // Create particles geometry
  const particlesGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particles.length * 3);
    const colors = new Float32Array(particles.length * 3);

    particles.forEach((particle, i) => {
      positions[i * 3] = particle.position.x;
      positions[i * 3 + 1] = particle.position.y;
      positions[i * 3 + 2] = particle.position.z;

      const color = new THREE.Color(particle.color);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    });

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geometry;
  }, [particles]);

  // Create fire particles
  const fireParticles = useMemo(() => {
    const temp: FireParticle[] = [];
    for (let i = 0; i < 200; i++) {
      temp.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 2,  // Keep fire particles close to model
          (Math.random() - 0.5) * 2 - 1, // Mostly below the model
          (Math.random() - 0.5) * 2
        ),
        color: FIRE_COLORS[Math.floor(Math.random() * FIRE_COLORS.length)],
        speed: Math.random() * 0.3 + 0.2,
        offset: Math.random() * Math.PI * 2,
        size: Math.random() * 0.15 + 0.05
      });
    }
    return temp;
  }, []);

  // Create fire particles geometry
  const fireGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(fireParticles.length * 3);
    const colors = new Float32Array(fireParticles.length * 3);
    const sizes = new Float32Array(fireParticles.length);

    fireParticles.forEach((particle, i) => {
      positions[i * 3] = particle.position.x;
      positions[i * 3 + 1] = particle.position.y;
      positions[i * 3 + 2] = particle.position.z;

      const color = new THREE.Color(particle.color);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      sizes[i] = particle.size;
    });

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    return geometry;
  }, [fireParticles]);

  useEffect(() => {
    if (!scene || !modelRef.current) return;

    // Clone materials to preserve original colors
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        child.material = child.material.clone();
        // Enhance material properties without changing color
        child.material.envMapIntensity = 1.5;
        child.material.needsUpdate = true;
      }
    });

    // Center and scale the model
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    
    // Calculate scale based on viewport dimensions
    const targetWidth = viewport.width * 0.9; // Use 90% of viewport width
    const targetHeight = viewport.height * 0.9; // Use 90% of viewport height
    const scaleX = (targetWidth / size.x) ;
    const scaleY = targetHeight / size.y;
    const scale = Math.min(scaleX, scaleY) + 0.3; // Use the smaller scale to maintain aspect ratio
    
    scene.position.copy(center.multiplyScalar(-1));
    scene.scale.setScalar(scale);
  }, [scene, viewport]);

  useFrame((state) => {
    if (!modelRef.current || !particlesRef.current) return;
    
    // Update text materials time uniform for animation
    textMaterial1.uniforms.time.value = state.clock.elapsedTime;
    textMaterial2.uniforms.time.value = state.clock.elapsedTime + 1;
    textMaterial3.uniforms.time.value = state.clock.elapsedTime + 2;

    // Update glow and shimmer materials
    if (glowRef.current && glowMaterial) {
      glowMaterial.uniforms.time.value = state.clock.elapsedTime;
      glowMaterial.uniforms.viewVector.value = new THREE.Vector3().subVectors(
        state.camera.position,
        modelRef.current.position
      );
    }
    
    if (shimmerRef.current && shimmerMaterial) {
      shimmerMaterial.uniforms.time.value = state.clock.elapsedTime;
    }

    // Model animations
    modelRef.current.rotation.y += (state.mouse.x * 0.5 - modelRef.current.rotation.y) * 0.05;
    modelRef.current.rotation.x += (state.mouse.y * 0.3 - modelRef.current.rotation.x) * 0.08;
    modelRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;

    // Add this line for constant rotation
    modelRef.current.rotation.y += -0.04; // Constant clockwise rotation

    // Particle animations
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    particles.forEach((particle, i) => {
      const i3 = i * 3;
      positions[i3] += Math.sin(state.clock.elapsedTime * particle.speed + particle.offset) * 0.01;
      positions[i3 + 1] += Math.cos(state.clock.elapsedTime * particle.speed + particle.offset) * 0.01;
      positions[i3 + 2] += Math.sin(state.clock.elapsedTime * particle.speed * 0.5 + particle.offset) * 0.01;

      // Keep particles within bounds
      if (Math.abs(positions[i3]) > 10) positions[i3] *= -0.95;
      if (Math.abs(positions[i3 + 1]) > 10) positions[i3 + 1] *= -0.95;
      if (Math.abs(positions[i3 + 2]) > 10) positions[i3 + 2] *= -0.95;
    });
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Fire particle animations
    if (fireParticlesRef.current) {
      const firePositions = fireParticlesRef.current.geometry.attributes.position.array as Float32Array;
      const fireSizes = fireParticlesRef.current.geometry.attributes.size.array as Float32Array;
      
      fireParticles.forEach((particle, i) => {
        const i3 = i * 3;
        
        // Rising fire effect
        firePositions[i3 + 1] += particle.speed * 0.02;
        firePositions[i3] += Math.sin(state.clock.elapsedTime * particle.speed + particle.offset) * 0.01;
        firePositions[i3 + 2] += Math.cos(state.clock.elapsedTime * particle.speed + particle.offset) * 0.01;
        
        // Reset particles that go too high
        if (firePositions[i3 + 1] > 1.5) {
          firePositions[i3] = (Math.random() - 0.5) * 2;
          firePositions[i3 + 1] = -1 - Math.random() * 0.5;
          firePositions[i3 + 2] = (Math.random() - 0.5) * 2;
          fireSizes[i] = Math.random() * 0.15 + 0.05;
        }
        
        // Decrease size as particles rise
        fireSizes[i] *= 0.995;
      });
      
      fireParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      fireParticlesRef.current.geometry.attributes.size.needsUpdate = true;
    }
  });      const createTextMaterial = (color: string) => {
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(color) }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        varying vec2 vUv;
        
        // Noise function for fluid effect
        float noise(vec2 p) {
          return sin(p.x * 10.0 + time) * 0.5 + 0.5 * 
                 sin(p.y * 8.0 - time * 1.5) * 0.5 + 0.5;
        }
        
        void main() {
          // Fluid animation
          float fluid = noise(vUv + vec2(time * 0.2));
          fluid *= noise(vUv * 2.0 - vec2(time * 0.15));
          
          // Create outline effect with fluid distortion
          float dist = length(vUv - vec2(0.5));
          float outline = smoothstep(0.45, 0.5, dist + fluid * 0.05);
          
          // Create flowing effect
          vec3 flowColor = mix(vec3(1.0), color, fluid);
          vec3 glowColor = mix(flowColor, color, outline);
          
          // Enhanced glow with fluid motion
          float glowStrength = 0.8 + fluid * 0.4;
          
          // Final color mixing
          vec3 finalColor = mix(vec3(1.0), glowColor, outline);
          float alpha = mix(0.95, 1.0, outline) * glowStrength;
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,  // Important for transparency
    });
    return material;
  };

  const textMaterial1 = createTextMaterial('#ff00ff');  // Pink
  const textMaterial2 = createTextMaterial('#00ffff');  // Cyan
  const textMaterial3 = createTextMaterial('#7f00ff');  // Purple

  // Create glow effect shader material
  const glowMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(GLOW_COLOR) },
        viewVector: { value: new THREE.Vector3(0, 0, 1) }
      },
      vertexShader: `
        uniform float time;
        uniform vec3 viewVector;
        varying vec3 vNormal;
        varying vec3 vEyeVec;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vEyeVec = normalize(worldPos.xyz - cameraPosition);
          
          // Add subtle vertex animation
          vec3 animated = position + normal * sin(time * 2.0 + position.y * 3.0) * 0.02;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(animated, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        varying vec3 vNormal;
        varying vec3 vEyeVec;
        
        void main() {
          float rim = 1.0 - abs(dot(vNormal, -vEyeVec));
          rim = pow(rim, 2.0);
          
          // Animated rimlight intensity
          rim *= 0.8 + sin(time * 3.0) * 0.2;
          
          // Color pulsing effect
          vec3 glowColor = color * (0.8 + sin(time * 2.0) * 0.2);
          
          gl_FragColor = vec4(glowColor, rim);
        }
      `,
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
  }, []);

  // Create shimmer effect material
  const shimmerMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        baseColor: { value: new THREE.Color(SHIMMER_COLOR) },
        texture: { value: shimmerTexture }
      },
      vertexShader: `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 baseColor;
        uniform sampler2D texture;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          // Create animated UV coordinates for shimmer effect
          vec2 uv = vUv;
          uv.x += sin(uv.y * 10.0 + time) * 0.1;
          uv.y += cos(uv.x * 10.0 + time * 0.7) * 0.1;
          
          // Sample texture with animated UVs
          vec4 texColor = texture2D(texture, uv);
          
          // Create wave pattern
          float wave = sin(vPosition.x * 5.0 + time * 2.0) * 0.5 + 0.5;
          wave *= sin(vPosition.y * 5.0 + time * 1.5) * 0.5 + 0.5;
          
          // Apply shimmer color modulation
          vec3 finalColor = baseColor * texColor.rgb * (0.5 + wave * 0.5);
          
          // Opacity based on texture alpha and wave
          float opacity = texColor.a * wave * 0.7;
          
          gl_FragColor = vec4(finalColor, opacity);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    });
  }, [shimmerTexture]);

  return (
    <>
      <color attach="background" args={['#0a010f']} />
      
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />

      {/* Background Text */}
      <group position={[0, 0, zOffset]}>
        {/* Top Text */}
        <group position={[0, verticalSpacing, 0]}>
          <Text
            font="/fonts/PixelifySans-VariableFont_wght.ttf"
            fontSize={fontSize}
            letterSpacing={0.05}
            material={textMaterial1}
            position={[0, 0, 0]}
            anchorX="center"
            anchorY="middle"
            maxWidth={isMobile ? 2 : 4}
          >
            LITSOC
          </Text>
        </group>

        {/* Middle Text */}
        <group position={[0, 0, 0.2]}>
          <Text
            font="/fonts/PixelifySans-VariableFont_wght.ttf"
            fontSize={fontSize}
            letterSpacing={0.05}
            material={textMaterial2}
            position={[0, 0, 0]}
            anchorX="center"
            anchorY="middle"
            maxWidth={isMobile ? 2 : 4}
          >
            LITSOC
          </Text>
        </group>
        
        {/* Bottom Text */}
        <group position={[0, -verticalSpacing, 0]}>
          <Text
            font="/fonts/PixelifySans-VariableFont_wght.ttf"
            fontSize={fontSize}
            letterSpacing={0.05}
            material={textMaterial3}
            position={[0, 0, 0]}
            anchorX="center"
            anchorY="middle"
            maxWidth={isMobile ? 2 : 4}
          >
            LITSOC
          </Text>
        </group>
      </group>

      {/* Particles */}
      <points ref={particlesRef} geometry={particlesGeometry}>
        <pointsMaterial
          size={0.05}
          vertexColors
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Fire Particles */}
      <points ref={fireParticlesRef} geometry={fireGeometry}>
        <pointsMaterial
          size={0.1}
          vertexColors
          transparent
          alphaMap={fireTexture}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* Model */}
      <group
        ref={modelRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <primitive object={scene} />
      </group>

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <spotLight
        position={[5, 5, 5]}
        angle={0.4}
        penumbra={1}
        intensity={1}
        castShadow
      />
      <pointLight
        position={[-5, -5, -5]}
        intensity={0.2}
        color="#ffffff"
      />

      {/* Rim light for model definition */}
      <pointLight
        position={[2, 0, -2]}
        intensity={hovered ? 1 : 0.5}
        color="#ff00ff"
        distance={6}
        decay={2}
      />
      
      {/* Fire light effect */}
      <pointLight
        position={[0, -1, 0]}
        intensity={0.8}
        color="#ff5500"
        distance={4}
        decay={2}
      >
        <mesh>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color="#ff5500" />
        </mesh>
      </pointLight>
    </>
  );
};

export default ModelViewer;
