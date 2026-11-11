import React, { useMemo } from 'react';

interface Petal {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  rotation: number;
  color: string;
}

export const RosePetals: React.FC<{ count?: number }> = ({ count = 18 }) => {
  const petals = useMemo<Petal[]>(() => {
    const colors = [
      '#F8DCE5', // blush
      '#FCEEF2', // soft pink
      '#E8B4C8', // rose
      '#D88CA5', // vibrant rose
      '#FFF0F5'  // lavender blush
    ];

    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 96,
      size: 14 + Math.random() * 16,
      duration: 10 + Math.random() * 14,
      delay: Math.random() * 15,
      rotation: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
  }, [count]);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-10"
      aria-hidden="true"
    >
      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute opacity-0"
          style={{
            left: `${p.left}%`,
            top: '-20px',
            animation: `swayPetal ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`
          }}
        >
          <svg
            width={p.size}
            height={p.size}
            viewBox="0 0 24 24"
            fill={p.color}
            style={{
              transform: `rotate(${p.rotation}deg)`,
              filter: 'drop-shadow(0 2px 4px rgba(183, 95, 125, 0.2))'
            }}
          >
            {/* Elegant organic rose petal shape */}
            <path d="M12 2C7.5 2 4 6.5 4 11.5C4 16.5 7.5 21.5 12 22C16.5 21.5 20 16.5 20 11.5C20 6.5 16.5 2 12 2Z" />
          </svg>
        </div>
      ))}
    </div>
  );
};
