import React, { useState } from 'react';
import logoImg from '../assets/images/cm_spaced_monogram_logo_1788273595808.jpg';

interface LogoProps {
  variant?: 'light' | 'dark' | 'metallic' | 'cream';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'dark',
  className = '',
  size = 'md',
  showTagline = false,
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: {
      container: 'h-8 sm:h-9',
      image: 'h-8 sm:h-9 w-auto object-contain',
      tagline: 'text-[7px] tracking-[0.25em]',
    },
    md: {
      container: 'h-10 sm:h-11',
      image: 'h-10 sm:h-11 w-auto object-contain',
      tagline: 'text-[8px] sm:text-[9px] tracking-[0.3em]',
    },
    lg: {
      container: 'h-12 sm:h-14',
      image: 'h-12 sm:h-14 w-auto object-contain',
      tagline: 'text-[9px] sm:text-[10px] tracking-[0.35em]',
    },
    xl: {
      container: 'h-16 sm:h-20',
      image: 'h-16 sm:h-20 w-auto object-contain',
      tagline: 'text-[11px] sm:text-[12px] tracking-[0.4em]',
    },
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'light':
        return {
          imgFilter: 'invert(1) brightness(1.2) contrast(1.1) mix-blend-screen',
          tagline: 'text-neutral-300',
        };
      case 'metallic':
        return {
          imgFilter: 'sepia(0.8) hue-rotate(5deg) saturate(1.8) brightness(1.1) contrast(1.2)',
          tagline: 'text-amber-200/80',
        };
      case 'cream':
        return {
          imgFilter: 'invert(0.9) brightness(1.1)',
          tagline: 'text-[#E5E5E1]',
        };
      case 'dark':
      default:
        return {
          // Removes white background seamlessly without altering the crisp black monogram logo
          imgFilter: 'mix-blend-multiply contrast(1.15)',
          tagline: 'text-neutral-500',
        };
    }
  };

  const currentSize = sizeClasses[size];
  const styles = getVariantStyles();

  return (
    <div
      id="brand-logo"
      className={`inline-flex flex-col items-start select-none group cursor-pointer ${className}`}
    >
      <div className={`flex items-center gap-2 ${currentSize.container}`}>
        {!imgError ? (
          <img
            src={logoImg}
            alt="CM Quality Products Logo"
            className={`${currentSize.image} transition-transform duration-300 group-hover:scale-105`}
            style={{
              filter: styles.imgFilter,
            }}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
          />
        ) : (
          /* High-fidelity Spaced Serif Vector Monogram Fallback */
          <svg
            viewBox="0 0 140 90"
            className={`${currentSize.image}`}
            fill="currentColor"
          >
            {/* Letter C with classic luxury serif with balanced spacing */}
            <path
              d="M 38 18 C 24 18 14 30 14 48 C 14 66 24 78 38 78 C 47 78 53 74 56 69 L 51 65 C 48 68 43 71 38 71 C 29 71 22 62 22 48 C 22 34 29 25 38 25 C 44 25 48 28 52 32 L 57 27 C 53 21 46 18 38 18 Z"
              opacity="0.95"
            />
            {/* Letter M spaced out with half clearance */}
            <path
              d="M 68 20 L 68 76 L 76 76 L 76 38 L 92 76 L 98 76 L 114 38 L 114 76 L 122 76 L 122 20 L 112 20 L 95 59 L 78 20 Z"
              opacity="0.95"
            />
          </svg>
        )}
      </div>

      {showTagline && (
        <span
          className={`uppercase font-sans font-bold mt-1 ${currentSize.tagline} ${styles.tagline}`}
        >
          Quality Products
        </span>
      )}
    </div>
  );
};

