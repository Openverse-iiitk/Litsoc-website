import { useRef, useEffect } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Box3, Vector3 } from 'three';


interface ModelProps {
  mousePosition: { x: number; y: number };
  scrollProgress: number;
}

export const Model: React.FC<ModelProps> = ({ mousePosition, scrollProgress }) => {
  const gltf = useLoader(GLTFLoader, '/model.glb');
  const modelRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const rotationRef = useRef(0);
  
  // Center and scale model once loaded
  useEffect(() => {
    if (!modelRef.current) return;
    
    const model = modelRef.current;
    const box = new Box3().setFromObject(model);
    const center = box.getCenter(new Vector3());
    model.position.set(-center.x, -center.y, -center.z);
    
    const size = box.getSize(new Vector3()).length();
    const targetSize = 6;
    model.scale.multiplyScalar(targetSize / size);
    
    camera.position.z = 5;
    camera.lookAt(0, 0, 0);
  }, [gltf, camera]);
  
  // Animate based on scroll position and continuous rotation
  useFrame((_, delta) => {
    if (modelRef.current) {
      // Continuous slow rotation
      rotationRef.current += delta * 0.3; // Adjust speed here
      
      // Apply smooth rotation with mouse influence
      const mouseInfluence = Math.max(0, 1 - scrollProgress * 2); // Reduce mouse influence as we scroll
      modelRef.current.rotation.y = rotationRef.current + mousePosition.x * Math.PI * 0.2 * mouseInfluence;
      modelRef.current.rotation.x = mousePosition.y * Math.PI * 0.1 * mouseInfluence;
      
      // Handle transition based on scroll
      if (scrollProgress > 0.4) {
        // Move model to the right as we scroll past threshold
        const positionX = THREE.MathUtils.lerp(0, 2, (scrollProgress - 0.4) * 2);
        modelRef.current.position.x = positionX;
        
        // Add slight tilt for effect
        modelRef.current.rotation.z = THREE.MathUtils.lerp(0, 0.2, (scrollProgress - 0.4) * 2);
      }
    }
  });
  
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight intensity={1} position={[1, 1, 1]} />
      <directionalLight intensity={0.5} position={[-1, -1, -1]} />
      <primitive ref={modelRef} object={gltf.scene} />
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={scrollProgress < 0.4} />
    </>
  );
};

const ModelViewer: React.FC = () => {
  const mousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const scrollProgressRef = useRef(0);
  
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mousePositionRef.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: (event.clientY / window.innerHeight) * 2 - 1
      };
    };
    
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgressRef.current = window.scrollY / scrollHeight;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return <Model mousePosition={mousePositionRef.current} scrollProgress={scrollProgressRef.current} />;
};

export default ModelViewer;
