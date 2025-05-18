import { useRef, useEffect, useState, useMemo } from 'react';
import { useGLTF, PerspectiveCamera, useAnimations, Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { vh } from 'framer-motion';

interface Particle {
  position: THREE.Vector3;
  color: string;
  speed: number;
  offset: number;
}

const COLORS = ['#ff00ff', '#00ffff', '#7f00ff'];

const ModelViewer = () => {
  const modelRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const { scene, animations } = useGLTF('/model.glb');
  const { viewport } = useThree();
  const [hovered, setHovered] = useState(false);

  // Add viewport-aware scaling
  const isMobile = viewport.width < 5; // Three.js units, roughly equivalent to viewport width < 768px
  
  // Calculate responsive font size and spacing
  const fontSize = isMobile ? 1.2 : 2;
  const verticalSpacing = isMobile ? 1.2 : 2;
  const zOffset = isMobile ? -2 : -3;

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

    // Model animations
    modelRef.current.rotation.y += (state.mouse.x * 0.5 - modelRef.current.rotation.y) * 0.05;
    modelRef.current.rotation.x += (state.mouse.y * 0.3 - modelRef.current.rotation.x) * 0.05;
    modelRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;

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

  return (
    <>
      <color attach="background" args={['#211d24']} />
      
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />

      {/* Background Text */}
      <group position={[0, 0, zOffset]}>
        {/* Top Text */}
        <group position={[0, verticalSpacing, 0]}>
          <Text
            font="/fonts/PixelifySans-VariableFont_wght.ttf"
            fontSize={fontSize}
            letterSpacing={0.1}
            material={textMaterial1}
            position={[0, 0, 0]}
            anchorX="center"
            anchorY="middle"
            maxWidth={isMobile ? 3 : 6}
          >
            LITSOC
          </Text>
        </group>

        {/* Middle Text */}
        <group position={[0, 0, 0.5]}>
          <Text
            font="/fonts/PixelifySans-VariableFont_wght.ttf"
            fontSize={fontSize}
            letterSpacing={0.1}
            material={textMaterial2}
            position={[0, 0, 0]}
            anchorX="center"
            anchorY="middle"
            maxWidth={isMobile ? 3 : 6}
          >
            LITSOC
          </Text>
        </group>
        
        {/* Bottom Text */}
        <group position={[0, -verticalSpacing, 0]}>
          <Text
            font="/fonts/PixelifySans-VariableFont_wght.ttf"
            fontSize={fontSize}
            letterSpacing={0.1}
            material={textMaterial3}
            position={[0, 0, 0]}
            anchorX="center"
            anchorY="middle"
            maxWidth={isMobile ? 3 : 6}
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
    </>
  );
};

export default ModelViewer;
