"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, OrbitControls, Float, Text, Sparkles, Html } from "@react-three/drei";
import * as THREE from "three";
import { storyNodes, StoryNode, Category } from "../data/nodes";
import { useStore } from "../store";

const CATEGORY_COLORS: Record<Category, string> = {
  Science: "#06b6d4", // Cyan
  History: "#f59e0b", // Amber
  Linguistics: "#d946ef", // Fuchsia
};

function CameraController() {
  const { camera, controls } = useThree();
  const targetNode = useStore((state) => state.targetNode);
  const [isFlying, setIsFlying] = useState(false);

  useFrame((state, delta) => {
    if (targetNode && !isFlying) {
      setIsFlying(true);
    }

    if (isFlying && targetNode) {
      const targetPos = new THREE.Vector3(...targetNode.coordinates);
      // Offset camera slightly so we don't be inside the node
      const cameraTargetPos = targetPos.clone().add(new THREE.Vector3(0, 0, 4));

      // Smoothly interpolate camera position
      camera.position.lerp(cameraTargetPos, 2 * delta);

      // Make camera look at the node
      if (controls) {
        // @ts-expect-error OrbitControls type definition might be slightly off in some versions
        const currentTarget = controls.target as THREE.Vector3;
        currentTarget.lerp(targetPos, 2 * delta);
        // @ts-expect-error update method exists
        controls.update();
      }

      // Check if close enough to stop "flying" mode (optional, or just keep following)
      if (camera.position.distanceTo(cameraTargetPos) < 0.1) {
        // setIsFlying(false); // Keep it true to lock on, or false to release
      }
    }
  });

  return null;
}

function NodeStar({ node }: { node: StoryNode }) {
  const [hovered, setHovered] = useState(false);
  const color = CATEGORY_COLORS[node.category];
  const setTargetNode = useStore((state) => state.setTargetNode);

  return (
    <group position={node.coordinates}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh
          onPointerOver={() => {
            setHovered(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = 'auto';
          }}
          onClick={() => {
            console.log("Clicked node:", node.title);
            setTargetNode(node);
          }}
        >
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 3 : 1}
            toneMapped={false}
          />
        </mesh>

        {/* Halo effect */}
        <mesh scale={1.5}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.2} />
        </mesh>
      </Float>

      {/* Label - visible on hover or always if preferred */}
      <Html position={[0, 0.5, 0]} center distanceFactor={10} style={{ pointerEvents: 'none', opacity: hovered ? 1 : 0.5, transition: 'opacity 0.2s' }}>
        <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-white text-xs whitespace-nowrap border border-white/10">
          {node.title}
        </div>
      </Html>
    </group>
  );
}

function Portal() {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Outer Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3, 0.05, 16, 100]} />
        <meshStandardMaterial color="#4f46e5" emissive="#4f46e5" emissiveIntensity={2} toneMapped={false} />
      </mesh>

      {/* Inner Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={0.8}>
        <torusGeometry args={[3, 0.05, 16, 100]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={2} toneMapped={false} />
      </mesh>

      {/* The Core */}
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <mesh>
          <icosahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial
            roughness={0}
            metalness={1}
            color="#1e1b4b"
            emissive="#4338ca"
            emissiveIntensity={0.5}
            transmission={0.6}
            thickness={2}
          />
        </mesh>
      </Float>
    </group>
  );
}

export default function Observatory() {
  return (
    <div className="w-full h-full absolute inset-0 bg-black">
      <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
        <color attach="background" args={["#000000"]} />

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, -10, -10]} intensity={0.5} color="purple" />

        {/* Environment */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Sparkles count={200} scale={10} size={2} speed={0.4} opacity={0.5} color="#67e8f9" />

        {/* Objects */}
        <Portal />

        {/* Render Nodes */}
        {storyNodes.map((node) => (
          <NodeStar key={node.id} node={node} />
        ))}

        {/* Logic */}
        <CameraController />

        {/* Controls */}
        <OrbitControls
          makeDefault // Important for useThree to pick it up
          enableZoom={true}
          enablePan={true}
          autoRotate={false}
          maxDistance={20}
          minDistance={2}
        />
      </Canvas>
    </div>
  );
}
