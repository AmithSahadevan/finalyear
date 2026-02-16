import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { MorphingParticles } from './ui/MorphingParticles';

export const ParticleBackground: React.FC = () => {
    // Determine mobile state but render everywhere for consistency
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-[-1]">
      <Canvas
        // Camera positioned to see the side content
        camera={{ position: [0, 0, 14], fov: 45 }}
        dpr={[1, 2]} // Support high-DPI screens
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <Suspense fallback={null}>
          <MorphingParticles />
        </Suspense>
      </Canvas>
    </div>
  );
};
