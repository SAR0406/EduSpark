
import type { SVGProps } from 'react';

export function EduSparkLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 170 30"
      aria-label="EduSpark Logo"
      role="img"
      {...props}
    >
      <defs>
        <linearGradient id="sparkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <g transform="translate(0,2)">
        <path d="M14 0 L16.5 7 L24 9 L16.5 11 L14 18 L11.5 11 L4 9 L11.5 7 Z" fill="url(#sparkGrad)" opacity="0.95" />
        <circle cx="14" cy="9" r="2" fill="currentColor" />
      </g>
      <text
        x="34"
        y="22"
        fontFamily="Inter, sans-serif"
        fontSize="22"
        fontWeight="800"
        fill="currentColor"
      >
        EduSpark
      </text>
    </svg>
  );
}
