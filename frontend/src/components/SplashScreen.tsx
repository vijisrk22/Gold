import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Show splash for 6 seconds, then start fade out
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(onComplete, 800); 
    }, 6000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Generate 24 deterministic stars for the explosion/sparkle effect
  const stars = Array.from({ length: 24 }).map((_, i) => {
    const angle = i * 15; // 360 / 24
    const distance = 70 + (i % 4) * 35; // Distances: 70, 105, 140, 175
    const delay = (i % 6) * 0.3;
    const duration = 1.5 + (i % 3) * 0.5;
    const size = 3 + (i % 3) * 2; // Sizes: 3px, 5px, 7px
    
    return { id: i, angle, distance, delay, duration, size };
  });

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#1c110b', // Deep rich espresso brown
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      opacity: isFadingOut ? 0 : 1,
      transition: 'opacity 0.8s cubic-bezier(0.65, 0, 0.35, 1)',
      pointerEvents: isFadingOut ? 'none' : 'auto',
      overflow: 'hidden'
    }}>
      {/* Background ambient glow */}
      <div style={{
        position: 'absolute',
        width: '150vw',
        height: '150vh',
        background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, rgba(28, 17, 11, 0) 60%)',
        animation: 'ambient-pulse 4s ease-in-out infinite alternate',
        zIndex: -1
      }} />

      <div style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'slide-up-fade 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}>
        
        {/* Sparkling Stars Container */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0
        }}>
          {stars.map((star) => (
            <div 
              key={star.id} 
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: `${star.size}px`,
                height: `${star.size}px`,
                backgroundColor: '#ffd700',
                borderRadius: '50%',
                boxShadow: '0 0 10px 2px rgba(255, 215, 0, 0.8)',
                transform: 'translate(-50%, -50%)',
                // Custom CSS variables for the keyframes
                '--angle': `${star.angle}deg`,
                '--distance': `${star.distance}px`,
                animation: `shoot-star ${star.duration}s cubic-bezier(0.25, 1, 0.5, 1) ${star.delay}s infinite`
              } as React.CSSProperties}
            >
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '100%',
                height: '100%',
                backgroundColor: '#fff',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                animation: `twinkle ${star.duration * 0.8}s ease-in-out ${star.delay}s infinite alternate`
              }} />
            </div>
          ))}
        </div>

        {/* Logo Text */}
        <h1 style={{
          position: 'relative',
          zIndex: 1,
          fontSize: '4rem',
          fontWeight: 900,
          letterSpacing: '-1px',
          background: 'linear-gradient(90deg, #aa8000 0%, #ffd700 25%, #fff 50%, #ffd700 75%, #aa8000 100%)',
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: 0,
          padding: '20px',
          animation: 'shine 3s linear infinite',
          filter: 'drop-shadow(0 4px 12px rgba(255, 215, 0, 0.15))'
        }}>
          Maatal.com
        </h1>
      </div>

      <style>{`
        @keyframes shoot-star {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) rotate(var(--angle)) translateY(0) scale(0);
          }
          20% {
            opacity: 1;
            transform: translate(-50%, -50%) rotate(var(--angle)) translateY(calc(var(--distance) * -0.5)) scale(1.2);
          }
          80% {
            opacity: 0.8;
            transform: translate(-50%, -50%) rotate(var(--angle)) translateY(calc(var(--distance) * -0.9)) scale(0.8);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) rotate(var(--angle)) translateY(calc(var(--distance) * -1)) scale(0);
          }
        }
        
        @keyframes twinkle {
          0% { opacity: 0.3; transform: translate(-50%, -50%) scale(0.5); box-shadow: 0 0 5px #ffd700; }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1.5); box-shadow: 0 0 20px 5px #fff; }
        }

        @keyframes shine {
          to { background-position: 200% center; }
        }
        
        @keyframes slide-up-fade {
          0% { opacity: 0; transform: translateY(30px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        @keyframes ambient-pulse {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.1); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};
