// FILE: src/components/layout/Logo.tsx
interface LogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  size?: number;
  showText?: boolean;
}

/**
 * "The Isometric Sentinel" — two overlapping angled blocks forming a
 * subtle 3D chevron / "S" mark. A vibrant royal-blue block locks into a
 * deep navy block, with a soft drop shadow at the seam where they meet.
 */
export default function Logo({
  className = "",
  iconClassName = "",
  textClassName = "",
  size = 30,
  showText = true,
}: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={Math.round((size * 28) / 44)}
        viewBox="0 0 44 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className={`flex-shrink-0 ${iconClassName}`}
      >
        <defs>
          <filter id="sentinel-lock-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="-0.75" stdDeviation="0.6" floodColor="#050F1F" floodOpacity="0.45" />
          </filter>
        </defs>
        {/* Primary block — vibrant royal blue */}
        <polygon points="26,2 34,14 38,14 30,2" fill="#2D6BEF" />
        <polygon points="2,2 26,2 34,14 10,14" fill="#5E95F5" />
        {/* Secondary block — deep navy, locks over the primary block */}
        <polygon points="26,12 34,24 38,24 30,12" fill="#050F1F" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
        <polygon
          points="2,12 26,12 34,24 10,24"
          fill="#081A33"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="0.5"
          filter="url(#sentinel-lock-shadow)"
        />
      </svg>
      {showText && (
        <span className={`text-[16px] font-extrabold tracking-tight text-[var(--color-text-primary)] ${textClassName}`}>
          ShadowSweep
        </span>
      )}
    </div>
  );
}
