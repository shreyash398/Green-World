import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Box } from "@react-three/drei";
import * as THREE from "three";

function FloatingElement({ position, color, size, speed }: any) {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += speed * 0.01;
      ref.current.rotation.y += speed * 0.02;
      ref.current.position.y += Math.sin(Date.now() * 0.001 * speed) * 0.005;
    }
  });

  return (
    <group ref={ref} position={position}>
      <Sphere args={[size, 32, 32]}>
        <meshPhongMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          shininess={100}
        />
      </Sphere>
    </group>
  );
}

function FloatingBox({ position, color, scale, speed }: any) {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += speed * 0.005;
      ref.current.rotation.z += speed * 0.01;
      ref.current.position.y += Math.sin(Date.now() * 0.0008 * speed) * 0.003;
    }
  });

  return (
    <group ref={ref} position={position}>
      <Box args={[scale, scale, scale]}>
        <meshPhongMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
          wireframe={false}
        />
      </Box>
    </group>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.5} color="#ffffff" />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#4b7c5f" />
      <pointLight position={[-10, -10, 5]} intensity={0.6} color="#7fa881" />
      <pointLight position={[0, 20, 0]} intensity={0.4} color="#b5d4b8" />
    </>
  );
}

export function AnimatedBackground() {
  return (
    <Canvas
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
      }}
      camera={{ position: [0, 0, 15], fov: 75 }}
      dpr={[1, 2]}
    >
      <Lights />

      {/* Floating spheres - green theme */}
      <FloatingElement
        position={[-8, 5, -5]}
        color="#4b7c5f"
        size={1.2}
        speed={0.5}
      />
      <FloatingElement
        position={[8, -4, -8]}
        color="#7fa881"
        size={0.8}
        speed={0.7}
      />
      <FloatingElement
        position={[0, 8, -10]}
        color="#b5d4b8"
        size={1.0}
        speed={0.4}
      />
      <FloatingElement
        position={[-5, -5, -6]}
        color="#6ba86f"
        size={0.6}
        speed={0.6}
      />
      <FloatingElement
        position={[6, 3, -7]}
        color="#5a8f65"
        size={0.9}
        speed={0.8}
      />

      {/* Floating boxes - geometric accent */}
      <FloatingBox
        position={[3, 6, -5]}
        color="#4b7c5f"
        scale={0.5}
        speed={0.3}
      />
      <FloatingBox
        position={[-6, -2, -8]}
        color="#7fa881"
        scale={0.4}
        speed={0.5}
      />
      <FloatingBox
        position={[7, -6, -6]}
        color="#b5d4b8"
        scale={0.6}
        speed={0.4}
      />

      {/* Additional floating elements for depth */}
      <FloatingElement
        position={[10, 0, -12]}
        color="#5a8f65"
        size={0.5}
        speed={0.3}
      />
      <FloatingElement
        position={[-10, -8, -10]}
        color="#6ba86f"
        size={0.7}
        speed={0.6}
      />
    </Canvas>
  );
}
