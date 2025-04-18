"use client";

import { useState, useEffect, useRef } from "react";
import * as THREE from 'three';
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Sphere, PointLight, AmbientLight } from '@react-three/drei';

const mskTime = 19;

const DigitalGlobe = () => {
  const [users, setUsers] = useState(Array(50).fill(0).map(() => ({
    x: Math.random() * 2 - 1,
    y: Math.random() * 2 - 1,
    z: Math.random() * 2 - 1,
    username: `user${Math.floor(Math.random() * 100)}`
  })));

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isTransforming, setIsTransforming] = useState(false);
  const [isTime, setIsTime] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const earthRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (currentTime.getUTCHours() + 3 === mskTime && !isTime) {
      setIsTransforming(true);
      setIsTime(true);
      setTimeout(() => {
        setSelectedUsers(pickRandomUsers(users));
      }, 5000);
    } else if (currentTime.getUTCHours() + 3 !== mskTime) {
      setIsTime(false);
      setIsTransforming(false);
    }
  }, [currentTime, isTime, users]);

  const pickRandomUsers = (users: { x: number; y: number; z: number; username: string; }[]) => {
    const shuffled = [...users].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3).map(user => user.username);
  };

  useFrame(() => {
    if (earthRef.current && !isTransforming) {
      earthRef.current.rotation.y += 0.001;
    }
  });

  return (
    <div className="relative w-full h-screen bg-background flex items-center justify-center overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <AmbientLight intensity={0.1} />
        <PointLight position={[10, 10, 10]} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade={true} />

        {isTransforming ? (
          <Sphere ref={earthRef} args={[1, 32, 32]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#7DF9FF" emissive="#7DF9FF" wireframe={true} />
          </Sphere>
        ) : (
          <Sphere ref={earthRef} args={[1, 32, 32]} position={[0, 0, 0]}>
            <meshStandardMaterial color="gray" />
          </Sphere>
        )}

        {users.map((user, index) => (
          <mesh key={index} position={[user.x, user.y, user.z]}>
            <sphereGeometry args={[0.02, 32, 32]} />
            <meshBasicMaterial color={selectedUsers.includes(user.username) ? "#9D00FF" : "#7DF9FF"} />
          </mesh>
        ))}
      </Canvas>

      {selectedUsers.length > 0 && (
        <div className="absolute bottom-10 left-0 w-full flex items-center justify-center">
          <div className="bg-accent text-accent-foreground rounded-full px-6 py-3 shadow-lg">
            Selected Users: {selectedUsers.join(", ")}
          </div>
        </div>
      )}
    </div>
  );
}

export default DigitalGlobe;
