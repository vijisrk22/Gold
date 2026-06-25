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
      // Wait for fade out animation to finish before unmounting
      setTimeout(onComplete, 800); 
    }, 6000);

    return () => clearTimeout(timer);
  }, [onComplete]);

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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '40px',
        animation: 'slide-up-fade 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}>
        <h1 style={{
          fontSize: '4rem',
          fontWeight: 900,
          letterSpacing: '-1px',
          background: 'linear-gradient(90deg, #aa8000 0%, #ffd700 25%, #fff 50%, #ffd700 75%, #aa8000 100%)',
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: 0,
          animation: 'shine 3s linear infinite',
          filter: 'drop-shadow(0 4px 12px rgba(255, 215, 0, 0.15))'
        }}>
          Maatal.com
        </h1>

        {/* Modern Orbital Spinner */}
        <div style={{ position: 'relative', width: '64px', height: '64px' }}>
          <div className="orbit orbit-1" />
          <div className="orbit orbit-2" />
          <div className="orbit orbit-3" />
          {/* Inner core */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '12px',
            height: '12px',
            backgroundColor: '#ffd700',
            borderRadius: '50%',
            boxShadow: '0 0 15px 4px rgba(255, 215, 0, 0.4)',
            animation: 'core-pulse 2s ease-in-out infinite'
          }} />
        </div>
      </div>

      <style>{`
        .orbit {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 2px solid transparent;
        }
        .orbit-1 {
          border-top-color: #ffd700;
          animation: spin 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
        }
        .orbit-2 {
          border-right-color: rgba(255, 215, 0, 0.6);
          border-bottom-color: rgba(255, 215, 0, 0.6);
          width: 80%;
          height: 80%;
          top: 10%;
          left: 10%;
          animation: spin-reverse 2s linear infinite;
        }
        .orbit-3 {
          border-left-color: rgba(255, 215, 0, 0.3);
          width: 60%;
          height: 60%;
          top: 20%;
          left: 20%;
          animation: spin 3s ease-in-out infinite;
        }

        @keyframes shine {
          to { background-position: 200% center; }
        }
        @keyframes slide-up-fade {
          0% { opacity: 0; transform: translateY(30px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes spin { 
          to { transform: rotate(360deg); } 
        }
        @keyframes spin-reverse { 
          to { transform: rotate(-360deg); } 
        }
        @keyframes ambient-pulse {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.1); opacity: 0.8; }
        }
        @keyframes core-pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
          50% { transform: translate(-50%, -50%) scale(1.5); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
