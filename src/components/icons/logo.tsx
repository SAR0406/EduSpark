
import type { SVGProps } from 'react';
import { Inter } from 'next/font/google';

// It's better to manage fonts in the layout, but for a standalone SVG this is one approach.
// However, it's best practice to assume the font is loaded by the parent context.

export function EduSparkLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 130 30"
      aria-label="EduSpark Logo"
      {...props}
    >
      <text
        x="0"
        y="22"
        fontFamily="Inter, sans-serif"
        fontSize="24"
        fontWeight="bold"
        fill="currentColor"
      >
        EduSpark
      </text>
    </svg>
  );
}
