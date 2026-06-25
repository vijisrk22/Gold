import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Show splash for 1.5 seconds, then start fade out
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      // Wait for fade out animation to finish before unmounting
      setTimeout(onComplete, 500); 
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#2a1a11', // Dark brown
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999, // Ensure it covers everything
      opacity: isFadingOut ? 0 : 1,
      transition: 'opacity 0.5s ease-in-out',
      pointerEvents: isFadingOut ? 'none' : 'auto', // Allow clicks to pass through as it fades
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px'
      }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #ffd700 0%, #d4af37 50%, #aa8000 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: 0,
          animation: 'pulse-glow 2s infinite ease-in-out'
        }}>
          Maatal.com
        </h1>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(255, 215, 0, 0.1)',
          borderTopColor: '#d4af37',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>

      <style>{`
        @keyframes pulse-glow {
          0% { filter: drop-shadow(0 0 4px rgba(212, 175, 55, 0.2)); transform: scale(0.98); }
          50% { filter: drop-shadow(0 0 15px rgba(212, 175, 55, 0.6)); transform: scale(1.02); }
          100% { filter: drop-shadow(0 0 4px rgba(212, 175, 55, 0.2)); transform: scale(0.98); }
        }
        @keyframes spin { 
          to { transform: rotate(360deg); } 
        }
      `}</style>
    </div>
  );
};
