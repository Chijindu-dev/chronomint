import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      overflow: 'hidden',
      background: 'var(--bg-darker)'
    }}>
      {/* Precision Glow Blobs */}
      <motion.div
        animate={{
          x: [0, 40, 0],
          y: [0, 60, 0],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute',
          top: '5%',
          right: '5%',
          width: '50vw',
          height: '50vw',
          background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(100px)'
        }}
      />

      <motion.div
        animate={{
          x: [0, -40, 0],
          y: [0, -60, 0],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute',
          bottom: '5%',
          left: '5%',
          width: '60vw',
          height: '60vw',
          background: 'radial-gradient(circle, var(--secondary-glow) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(120px)'
        }}
      />

      {/* Modern Grid Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(to right, var(--border) 1px, transparent 1px),
          linear-gradient(to bottom, var(--border) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
        maskImage: 'radial-gradient(circle at center, black, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(circle at center, black, transparent 80%)',
        opacity: 0.15
      }} />

      {/* Noise Texture for that premium feels */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.02,
        pointerEvents: 'none',
        backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")'
      }} />
    </div>
  );
};

export default AnimatedBackground;
