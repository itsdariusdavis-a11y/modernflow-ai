import React from 'react';

// Hand-built flat-vector illustrations (no external image API required).
// One warm, theme-appropriate scene per week of the program.

function Frame({ children, gradId, from, to }) {
  return (
    <svg viewBox="0 0 400 280" className="w-full h-full max-h-[230px]" role="img" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="400" height="280" rx="24" fill={`url(#${gradId})`} />
      {children}
    </svg>
  );
}

function Baby({ x, y, scale = 1, tilt = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale}) rotate(${tilt})`}>
      {/* body */}
      <ellipse cx="0" cy="18" rx="22" ry="26" fill="#F4A94A" />
      {/* head */}
      <circle cx="0" cy="-20" r="20" fill="#FFD9A8" />
      {/* hair tuft */}
      <path d="M -6 -38 Q 0 -48 6 -38" stroke="#8A5A32" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* cheeks */}
      <circle cx="-9" cy="-16" r="3.2" fill="#F7A6A6" opacity="0.7" />
      <circle cx="9" cy="-16" r="3.2" fill="#F7A6A6" opacity="0.7" />
      {/* smile */}
      <path d="M -6 -12 Q 0 -6 6 -12" stroke="#8A5A32" strokeWidth="2.4" strokeLinecap="round" fill="none" />
    </g>
  );
}

function ParentArms({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M -40 40 Q -10 -10 0 0" stroke="#D98A5C" strokeWidth="14" strokeLinecap="round" fill="none" />
      <path d="M 40 40 Q 10 -10 0 0" stroke="#D98A5C" strokeWidth="14" strokeLinecap="round" fill="none" />
    </g>
  );
}

export function WeekOneIllustration() {
  return (
    <Frame gradId="g1" from="#FFF3E0" to="#FFE3C2">
      {/* low table */}
      <rect x="120" y="190" width="160" height="14" rx="6" fill="#C98A55" />
      <rect x="135" y="204" width="10" height="40" fill="#B87A47" />
      <rect x="255" y="204" width="10" height="40" fill="#B87A47" />
      {/* blocks on table */}
      <rect x="160" y="165" width="24" height="24" rx="4" fill="#F0A05A" />
      <rect x="190" y="160" width="24" height="30" rx="4" fill="#8FB88A" />
      <rect x="220" y="168" width="24" height="22" rx="4" fill="#7FA9D6" />
      {/* baby tall-kneeling reaching */}
      <Baby x="150" y="150" scale="1.35" tilt="-6" />
      <text x="200" y="255" textAnchor="middle" fontSize="13" fill="#8A5A32" fontFamily="sans-serif" fontWeight="700">
        Tall-kneeling &amp; reaching
      </text>
    </Frame>
  );
}

export function WeekTwoIllustration() {
  return (
    <Frame gradId="g2" from="#FFF0E8" to="#FFD9C4">
      {/* sofa frame */}
      <rect x="60" y="120" width="280" height="90" rx="18" fill="#E39B6B" />
      <rect x="60" y="100" width="280" height="30" rx="14" fill="#EFAF80" />
      {/* baby cruising sideways holding sofa */}
      <Baby x="230" y="150" scale="1.3" tilt="4" />
      <circle cx="150" cy="185" r="6" fill="#F0A05A" />
      <circle cx="130" cy="185" r="6" fill="#8FB88A" />
      <text x="200" y="255" textAnchor="middle" fontSize="13" fill="#8A5A32" fontFamily="sans-serif" fontWeight="700">
        Cruising along furniture
      </text>
    </Frame>
  );
}

export function WeekThreeIllustration() {
  return (
    <Frame gradId="g3" from="#FFF6E5" to="#FFE1B8">
      {/* box / cart */}
      <rect x="150" y="175" width="90" height="55" rx="8" fill="#C98A55" />
      <rect x="150" y="175" width="90" height="14" rx="6" fill="#E3A46E" />
      {/* wheels */}
      <circle cx="168" cy="235" r="8" fill="#8A5A32" />
      <circle cx="222" cy="235" r="8" fill="#8A5A32" />
      {/* baby pushing box */}
      <Baby x="120" y="165" scale="1.3" tilt="-8" />
      <text x="200" y="258" textAnchor="middle" fontSize="13" fill="#8A5A32" fontFamily="sans-serif" fontWeight="700">
        Pushing a weighted box
      </text>
    </Frame>
  );
}

export function WeekFourIllustration() {
  return (
    <Frame gradId="g4" from="#FFF8ED" to="#FFE8C7">
      <ParentArms x="290" y="150" />
      {/* baby taking independent steps */}
      <Baby x="140" y="160" scale="1.35" tilt="10" />
      {/* motion lines */}
      <path d="M 170 200 q 15 6 30 0" stroke="#D98A5C" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6" />
      <path d="M 175 210 q 12 5 24 0" stroke="#D98A5C" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.4" />
      <text x="200" y="255" textAnchor="middle" fontSize="13" fill="#8A5A32" fontFamily="sans-serif" fontWeight="700">
        Brave independent steps!
      </text>
    </Frame>
  );
}

const WEEK_ILLUSTRATIONS = {
  1: WeekOneIllustration,
  2: WeekTwoIllustration,
  3: WeekThreeIllustration,
  4: WeekFourIllustration,
};

export default function WeekIllustration({ week }) {
  const Component = WEEK_ILLUSTRATIONS[week] || WeekOneIllustration;
  return <Component />;
}
