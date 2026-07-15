"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function Particles({ count = 420 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 13;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 3;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.03;
    ref.current.rotation.x = t * 0.012;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.035}
        color="#c1121f"
        transparent
        opacity={0.75}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function FloatingShape({
  position,
  scale = 1,
  speed = 0.3,
  color = "#c1121f",
  wireframe = true,
  emissive = "#3a0508",
}: {
  position: [number, number, number];
  scale?: number;
  speed?: number;
  color?: string;
  wireframe?: boolean;
  emissive?: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed;
    ref.current.rotation.x = t;
    ref.current.rotation.y = t * 0.8;
    ref.current.position.y = position[1] + Math.sin(t * 1.4) * 0.25;
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <icosahedronGeometry args={[1, 1]} />
      {wireframe ? (
        <meshBasicMaterial color={color} wireframe transparent opacity={0.5} />
      ) : (
        <meshStandardMaterial
          color="#0d0d11"
          emissive={emissive}
          emissiveIntensity={0.6}
          metalness={0.9}
          roughness={0.25}
          wireframe={false}
        />
      )}
    </mesh>
  );
}

function Rig() {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  useFrame(() => {
    if (!group.current) return;
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      pointer.x * 0.35,
      0.04,
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      -pointer.y * 0.22,
      0.04,
    );
  });
  return (
    <group ref={group}>
      <FloatingShape position={[0, 0.2, 0]} scale={1.7} speed={0.18} wireframe />
      <FloatingShape position={[-2.8, 1.1, -1]} scale={0.7} speed={0.35} />
      <FloatingShape position={[2.7, -0.8, -1.5]} scale={0.55} speed={-0.28} />
      <FloatingShape position={[2.1, 1.6, -2]} scale={0.45} speed={0.42} wireframe={false} />
      <FloatingShape position={[-2.3, -1.3, -1]} scale={0.5} speed={-0.3} wireframe={false} />

      {/* glowing wireframe ring */}
      <mesh rotation={[Math.PI / 2.4, 0, 0]} position={[0, 0, -2]}>
        <torusGeometry args={[3.4, 0.02, 16, 80]} />
        <meshBasicMaterial color="#c1121f" transparent opacity={0.35} />
      </mesh>
      <Particles />
    </group>
  );
}

export function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 4, 5]} intensity={40} color="#c1121f" distance={20} />
      <pointLight position={[-5, -3, 3]} intensity={20} color="#ff5a6a" distance={18} />
      <directionalLight position={[0, 4, 2]} intensity={0.6} />
      <Rig />
    </Canvas>
  );
}
