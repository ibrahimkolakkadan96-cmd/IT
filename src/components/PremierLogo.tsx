import React, { useState } from 'react';

interface PremierLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  textVariant?: 'light' | 'dark';
  subtext?: string;
  animateOnHover?: boolean;
}

const sizeMap = {
  xs: 'w-5 h-5',
  sm: 'w-7 h-7',
  md: 'w-9 h-9',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
  '2xl': 'w-24 h-24',
};

const textSizeMap = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
};

export const PremierLogo: React.FC<PremierLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
  textVariant = 'dark',
  subtext,
  animateOnHover = true,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className={`relative ${sizeMap[size]} shrink-0 rounded-full overflow-hidden flex items-center justify-center shadow-xs ${
          animateOnHover ? 'group cursor-pointer' : ''
        }`}
      >
        {!imageError ? (
          <img
            src="/premier_logo.jpg"
            alt="Premier Logo"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className={`w-full h-full object-contain ${
              animateOnHover ? 'transition-transform duration-500 group-hover:rotate-45' : ''
            }`}
          />
        ) : (
          /* High fidelity vector fallback in case image asset is blocked or missing */
          <svg
            viewBox="0 0 100 100"
            className={`w-full h-full ${
              animateOnHover ? 'transition-transform duration-500 group-hover:rotate-45' : ''
            }`}
          >
            {/* Outer cogwheel ring */}
            <circle cx="50" cy="50" r="46" fill="#1e293b" />
            <path
              d="M 50,5 A 45,45 0 0,1 90,30 L 72,38 A 25,25 0 0,0 50,25 Z"
              fill="#ef4444"
            />
            <path
              d="M 90,30 A 45,45 0 0,1 70,90 L 60,72 A 25,25 0 0,0 72,38 Z"
              fill="#2563eb"
            />
            <path
              d="M 70,90 A 45,45 0 0,1 15,65 L 32,58 A 25,25 0 0,0 60,72 Z"
              fill="#16a34a"
            />
            <path
              d="M 15,65 A 45,45 0 0,1 50,5 L 50,25 A 25,25 0 0,0 32,58 Z"
              fill="#dc2626"
            />
            {/* Center green ring and white core */}
            <circle cx="50" cy="50" r="22" fill="#22c55e" />
            <circle cx="50" cy="50" r="16" fill="#ffffff" />
            <text
              x="50"
              y="57"
              textAnchor="middle"
              fill="#dc2626"
              fontSize="20"
              fontWeight="900"
              fontFamily="sans-serif"
            >
              P
            </text>
          </svg>
        )}
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-black tracking-tight leading-tight uppercase font-sans ${textSizeMap[size]} ${
              textVariant === 'light' ? 'text-white' : 'text-slate-900'
            }`}
          >
            Premier <span className="text-blue-500 font-extrabold">IT</span>
          </span>
          {subtext && (
            <span
              className={`text-[10px] uppercase font-mono tracking-wider -mt-0.5 ${
                textVariant === 'light' ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {subtext}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
