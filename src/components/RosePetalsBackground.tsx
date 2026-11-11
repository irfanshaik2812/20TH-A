import React, { useMemo } from 'react';

interface PetalConfig {
  id: number;
  left: number; // percentage (0-100)
  size: number; // pixels
  duration: number; // seconds
  delay: number; // seconds
  swayDistance: number; // pixels left/right
  rotationStart: number;
  rotationEnd: number;
  color: string;
  petalType: 'curved' | 'flutter' | 'heart';
  layer: 'foreground' | 'midground' | 'background';
}

export const RosePetalsBackground: React.FC<{ count?: number }> = ({ count = 26 }) => {
  const petals = useMemo<PetalConfig[]>(() => {
    const palette = [
      '#F8DCE5', // soft blush
      '#FCEEF2', // pale petal pink
      '#E8B4C8', // antique rose
      '#D88CA5', // romantic rose
      '#B75F7D', // rich berry rose
      '#FFF0F5'  // lavender blush
    ];

    const types: ('curved' | 'flutter' | 'heart')[] = ['curved', 'flutter', 'heart'];

    return Array.from({ length: count }, (_, i) => {
      // 3 depth layers for natural cinematic depth of field
      const layerRand = Math.random();
      let layer: 'foreground' | 'midground' | 'background' = 'midground';
      let size = 18 + Math.random() * 10;
      let duration = 12 + Math.random() * 12;

      if (layerRand < 0.25) {
        layer = 'foreground';
        size = 26 + Math.random() * 12;
        duration = 9 + Math.random() * 8; // falls faster
      } else if (layerRand > 0.75) {
        layer = 'background';
        size = 11 + Math.random() * 7;
        duration = 18 + Math.random() * 14; // floats gently
      }

      return {
        id: i,
        left: Math.random() * 98,
        size,
        duration,
        delay: -(Math.random() * 25), // negative delay so petals are already falling when page loads!
        swayDistance: 35 + Math.random() * 55,
        rotationStart: Math.random() * 360,
        rotationEnd: (Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 720),
        color: palette[Math.floor(Math.random() * palette.length)],
        petalType: types[Math.floor(Math.random() * types.length)],
        layer
      };
    });
  }, [count]);

  const renderPetalPath = (type: 'curved' | 'flutter' | 'heart') => {
    switch (type) {
      case 'heart':
        return (
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        );
      case 'flutter':
        return (
          <path d="M12 2C8 4 4 9 4 14c0 4.5 3.5 8 8 8s8-3.5 8-8c0-5-4-10-8-12z" />
        );
      case 'curved':
      default:
        return (
          <path d="M12 2C6.5 2 3 7 3 12.5c0 5 4.5 9.5 9 9.5s9-4.5 9-9.5C21 7 17.5 2 12 2zm0 18c-3.5 0-7-3.5-7-8s3-8 7-8 7 3.5 7 8-3.5 8-7 8z" />
        );
    }
  };

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-20 select-none"
      aria-hidden="true"
    >
      {petals.map((p) => {
        const opacity =
          p.layer === 'foreground' ? 0.88 : p.layer === 'midground' ? 0.72 : 0.45;
        const blur = p.layer === 'foreground' ? 'blur(0.5px)' : 'none';

        return (
          <div
            key={p.id}
            className="absolute top-[-40px]"
            style={{
              left: `${p.left}%`,
              animation: `fallingPetalSway ${p.duration}s linear infinite`,
              animationDelay: `${p.delay}s`,
              opacity,
              filter: blur,
              willChange: 'transform, opacity'
            }}
          >
            <div
              style={{
                animation: `petalFlutter ${p.duration * 0.4}s ease-in-out infinite alternate`,
                transformStyle: 'preserve-3d'
              }}
            >
              <svg
                width={p.size}
                height={p.size}
                viewBox="0 0 24 24"
                fill={p.color}
                style={{
                  filter: 'drop-shadow(0 3px 6px rgba(183, 95, 125, 0.22))'
                }}
              >
                <defs>
                  <radialGradient id={`petal-grad-${p.id}`} cx="40%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#FFF5F8" stopOpacity="0.9" />
                    <stop offset="65%" stopColor={p.color} stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#9E4B66" stopOpacity="0.6" />
                  </radialGradient>
                </defs>
                <g fill={`url(#petal-grad-${p.id})`}>
                  {renderPetalPath(p.petalType)}
                </g>
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
};
