import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

interface LordIconProps {
  src: string;
  trigger?: 'hover' | 'click' | 'loop' | 'loop-on-hover' | 'morph' | 'boomerang';
  colors?: {
    primary?: string;
    secondary?: string;
  };
  size?: number;
  delay?: number;
  style?: React.CSSProperties;
}

export const LordIcon: React.FC<LordIconProps> = ({
  src,
  trigger = 'hover',
  colors = {},
  size = 32,
  delay = 0,
  style = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animation = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const loadAnimation = async () => {
      try {
        const response = await fetch(src);
        if (!response.ok) {
          throw new Error(`Failed to load icon: ${response.status} ${response.statusText}`);
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Invalid response: Expected JSON but received ' + contentType);
        }
        const animationData = await response.json();

        // Apply colors to the animation data if provided
        if (colors.primary || colors.secondary) {
          const layers = animationData.layers;
          layers.forEach((layer: any) => {
            if (layer.shapes) {
              layer.shapes.forEach((shape: any) => {
                if (shape.it) {
                  shape.it.forEach((item: any) => {
                    if (item.c?.k) {
                      // Convert hex to RGB values
                      const color = colors.primary || '#000000';
                      const r = parseInt(color.slice(1, 3), 16) / 255;
                      const g = parseInt(color.slice(3, 5), 16) / 255;
                      const b = parseInt(color.slice(5, 7), 16) / 255;
                      item.c.k = [r, g, b, 1];
                    }
                  });
                }
              });
            }
          });
        }

        // Destroy any existing animation
        if (animation.current) {
          animation.current.destroy();
        }

        // Create new animation
        animation.current = lottie.loadAnimation({
          container: containerRef.current!,
          renderer: 'svg',
          loop: trigger === 'loop' || trigger === 'boomerang',
          autoplay: trigger === 'loop',
          animationData,
        });

        // Set up trigger interactions
        const container = containerRef.current;
        const anim = animation.current;

        if (trigger === 'hover' || trigger === 'loop-on-hover') {
          const handleMouseEnter = () => anim.play();
          const handleMouseLeave = () => {
            if (trigger === 'hover') {
              anim.stop();
            }
          };

          container.addEventListener('mouseenter', handleMouseEnter);
          container.addEventListener('mouseleave', handleMouseLeave);

          return () => {
            container.removeEventListener('mouseenter', handleMouseEnter);
            container.removeEventListener('mouseleave', handleMouseLeave);
          };
        } else if (trigger === 'click') {
          const handleClick = () => anim.play();
          container.addEventListener('click', handleClick);

          return () => {
            container.removeEventListener('click', handleClick);
          };
        }

        // Apply delay if specified
        if (delay > 0 && trigger === 'loop') {
          setTimeout(() => {
            anim.play();
          }, delay);
        }
      } catch (error) {
        console.error('Error loading LordIcon:', error);
      }
    };

    loadAnimation();

    return () => {
      if (animation.current) {
        animation.current.destroy();
        animation.current = null;
      }
    };
  }, [src, trigger, colors, delay]);

  return (
    <div
      ref={containerRef}
      style={{
        width: size,
        height: size,
        cursor: trigger === 'click' ? 'pointer' : 'default',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    />
  );
};
