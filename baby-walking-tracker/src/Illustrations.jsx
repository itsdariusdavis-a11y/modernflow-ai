import React from 'react';

// Hand-built, detailed flat-vector illustrations — no external image API required.
// Every individual exercise gets its own distinct scene (pose + props + setting),
// not just each week, so the picture actually changes with each selection.

const SKIN = '#FFD9A8';
const SKIN_SHADE = '#F0BE8C';
const HAIR = '#7A4E2C';
const BLUSH = '#F7A6A6';

// --- SHARED SCENE SHELL: sky/wall, floor, rug, window, plant, baseboard ---
function SceneFrame({ id, wallTop, wallBottom, floorTop, floorBottom, rugColor, label, children }) {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full max-h-[260px]" role="img" aria-label={label}>
      <defs>
        <linearGradient id={`${id}-wall`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={wallTop} />
          <stop offset="100%" stopColor={wallBottom} />
        </linearGradient>
        <linearGradient id={`${id}-floor`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={floorTop} />
          <stop offset="100%" stopColor={floorBottom} />
        </linearGradient>
        <radialGradient id={`${id}-vignette`} cx="50%" cy="35%" r="75%">
          <stop offset="60%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.06" />
        </radialGradient>
      </defs>

      <rect width="400" height="300" rx="24" fill={`url(#${id}-wall)`} />

      {/* window with soft light rays */}
      <g opacity="0.9">
        <rect x="24" y="24" width="64" height="84" rx="8" fill="#FFFDF6" opacity="0.55" stroke="#FFFFFF" strokeWidth="3" />
        <line x1="56" y1="24" x2="56" y2="108" stroke="#FFFFFF" strokeWidth="3" opacity="0.7" />
        <line x1="24" y1="66" x2="88" y2="66" stroke="#FFFFFF" strokeWidth="3" opacity="0.7" />
        <path d="M 88 40 L 200 130 L 88 130 Z" fill="#FFFFFF" opacity="0.12" />
      </g>

      {/* potted plant, back corner */}
      <g transform="translate(358 150)">
        <ellipse cx="0" cy="46" rx="16" ry="6" fill="#00000014" />
        <path d="M -10 40 L -14 16 L 14 16 L 10 40 Z" fill="#C9835A" />
        <path d="M -12 16 Q 0 4 12 16 Z" fill="#B5744C" />
        <ellipse cx="-6" cy="-2" rx="10" ry="18" fill="#7FA96A" transform="rotate(-18 -6 -2)" />
        <ellipse cx="6" cy="-4" rx="10" ry="20" fill="#8FBE79" transform="rotate(14 6 -4)" />
        <ellipse cx="0" cy="-16" rx="9" ry="17" fill="#6E9D5A" />
      </g>

      {/* floor + rug */}
      <rect x="0" y="208" width="400" height="92" fill={`url(#${id}-floor)`} />
      <rect x="0" y="205" width="400" height="5" fill="#00000012" />
      <ellipse cx="200" cy="252" rx="150" ry="34" fill={rugColor} opacity="0.55" />
      <ellipse cx="200" cy="252" rx="150" ry="34" fill="none" stroke="#FFFFFF" strokeOpacity="0.5" strokeWidth="3" strokeDasharray="2 10" />

      {children}

      <rect width="400" height="300" rx="24" fill={`url(#${id}-vignette)`} />
    </svg>
  );
}

// --- BABY BUILDING BLOCKS ---
function Shadow({ x = 0, y = 70, rx = 32, ry = 7 }) {
  return <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#00000022" />;
}

function Head({ tilt = 0, x = 0, y = -46 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${tilt})`}>
      <circle cx="0" cy="0" r="19" fill={SKIN} />
      <path d="M -19 -2 A 19 19 0 0 1 19 -2" fill={SKIN_SHADE} opacity="0.5" />
      {/* hair */}
      <path d="M -17 -8 Q -14 -26 0 -25 Q 14 -26 17 -8 Q 10 -16 0 -15 Q -10 -16 -17 -8 Z" fill={HAIR} />
      <path d="M -3 -24 Q 0 -30 4 -24" stroke={HAIR} strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* ears */}
      <circle cx="-18" cy="1" r="4" fill={SKIN} />
      <circle cx="18" cy="1" r="4" fill={SKIN} />
      {/* cheeks */}
      <circle cx="-10" cy="5" r="3.4" fill={BLUSH} opacity="0.75" />
      <circle cx="10" cy="5" r="3.4" fill={BLUSH} opacity="0.75" />
      {/* eyes */}
      <circle cx="-7" cy="-2" r="2.1" fill="#4A3323" />
      <circle cx="7" cy="-2" r="2.1" fill="#4A3323" />
      <circle cx="-6.3" cy="-2.7" r="0.7" fill="#FFFFFF" />
      <circle cx="7.7" cy="-2.7" r="0.7" fill="#FFFFFF" />
      {/* smile */}
      <path d="M -6 6 Q 0 11 6 6" stroke="#B5623F" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    </g>
  );
}

function Torso({ accent, cx = 0, cy = 6, rx = 17, ry = 28, rotate = 0 }) {
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rotate})`}>
      <ellipse cx="0" cy="0" rx={rx} ry={ry} fill={accent} />
      <ellipse cx="0" cy="4" rx={rx * 0.55} ry={ry * 0.62} fill="#FFFFFF" opacity="0.25" />
      <circle cx="0" cy={-ry * 0.25} r="1.6" fill="#FFFFFF" opacity="0.7" />
      <circle cx="0" cy={ry * 0.05} r="1.6" fill="#FFFFFF" opacity="0.7" />
      <circle cx="0" cy={ry * 0.35} r="1.6" fill="#FFFFFF" opacity="0.7" />
    </g>
  );
}

function Limb({ from, ctrl, to, width = 9, color = SKIN, endR = 6.5 }) {
  return (
    <g>
      <path
        d={`M ${from[0]} ${from[1]} Q ${ctrl[0]} ${ctrl[1]} ${to[0]} ${to[1]}`}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        fill="none"
      />
      <circle cx={to[0]} cy={to[1]} r={endR} fill={color} />
    </g>
  );
}

function ParentHand({ x, y, rotate = 0, color = '#D98A5C' }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <path d="M -44 34 Q -14 -6 0 0" stroke={color} strokeWidth="16" strokeLinecap="round" fill="none" />
      <circle cx="0" cy="0" r="9" fill={color} />
    </g>
  );
}

function ParentFigure({ x, y, accent = '#D98A5C' }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="52" rx="34" ry="8" fill="#00000018" />
      <ellipse cx="0" cy="10" rx="26" ry="42" fill={accent} />
      <circle cx="0" cy="-38" r="17" fill={SKIN} />
      <path d="M -17 -42 Q -14 -58 0 -57 Q 14 -58 17 -42 Q 9 -50 0 -49 Q -9 -50 -17 -42 Z" fill="#5B3B24" />
      <path d="M -22 -22 Q -46 -8 -50 20" stroke={accent} strokeWidth="14" strokeLinecap="round" fill="none" />
      <path d="M 22 -22 Q 46 -8 50 20" stroke={accent} strokeWidth="14" strokeLinecap="round" fill="none" />
      <circle cx="-50" cy="20" r="8" fill={SKIN} />
      <circle cx="50" cy="20" r="8" fill={SKIN} />
    </g>
  );
}

function PropBlock({ x, y, size, color, rotate = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <rect x={-size / 2} y={-size / 2} width={size} height={size} rx="5" fill={color} />
      <rect x={-size / 2} y={-size / 2} width={size} height={size * 0.4} rx="5" fill="#FFFFFF" opacity="0.25" />
    </g>
  );
}

// ============================================================
// WEEK 1 — Core Stability (warm amber)
// ============================================================

export function TallKneelingReach() {
  const accent = '#F2A354';
  return (
    <SceneFrame id="w1a1" wallTop="#FFF6E9" wallBottom="#FFE6C4" floorTop="#F3D9AE" floorBottom="#E4C08A" rugColor="#F0A05A" label="Illustration of a baby tall-kneeling upright in front of a low coffee table, reaching sideways for a colorful wooden block.">
      {/* coffee table */}
      <g transform="translate(230 195)">
        <rect x="-70" y="-8" width="140" height="16" rx="7" fill="#B87A47" />
        <rect x="-70" y="-8" width="140" height="6" rx="3" fill="#D3986A" />
        <rect x="-58" y="8" width="10" height="38" fill="#9C6539" />
        <rect x="48" y="8" width="10" height="38" fill="#9C6539" />
        <PropBlock x={-40} y={-24} size={26} color="#F0A05A" rotate="-6" />
        <PropBlock x={-4} y={-28} size={26} color="#7FA9D6" rotate="8" />
        <PropBlock x={34} y={-30} size={22} color="#8FB88A" rotate="-4" />
      </g>
      {/* baby kneeling tall, reaching for the far block */}
      <g transform="translate(150 168)">
        <Shadow y={60} rx={30} />
        <Limb from={[-13, -18]} ctrl={[-32, -8]} to={[-38, 4]} width={9} />
        <Limb from={[-9, 30]} ctrl={[-16, 46]} to={[-10, 52]} width={11} />
        <Limb from={[9, 30]} ctrl={[16, 46]} to={[18, 52]} width={11} />
        <Torso accent={accent} rotate={-4} />
        <Limb from={[13, -18]} ctrl={[38, -34]} to={[58, -38]} width={9} endR={6} />
        <Head tilt={-6} x={4} y={-46} />
      </g>
    </SceneFrame>
  );
}

export function LowStoolBlockStacking() {
  const accent = '#F2A354';
  return (
    <SceneFrame id="w1a2" wallTop="#FFF6E9" wallBottom="#FFE6C4" floorTop="#F3D9AE" floorBottom="#E4C08A" rugColor="#F0A05A" label="Illustration of a baby sitting on a small stool with feet flat, leaning forward to pick up a block from the floor.">
      {/* stool */}
      <g transform="translate(200 214)">
        <ellipse cx="0" cy="-2" rx="34" ry="10" fill="#C98A55" />
        <ellipse cx="0" cy="-5" rx="34" ry="10" fill="#DFA671" />
        <rect x="-26" y="4" width="8" height="26" fill="#A56A3D" />
        <rect x="18" y="4" width="8" height="26" fill="#A56A3D" />
      </g>
      <PropBlock x={150} y={244} size={20} color="#8FB88A" rotate="10" />
      <PropBlock x={128} y={252} size={18} color="#7FA9D6" rotate="-8" />
      {/* baby sitting, leaning forward reaching toes */}
      <g transform="translate(202 176)">
        <Shadow y={62} rx={30} />
        <Limb from={[-9, 30]} ctrl={[-14, 50]} to={[-12, 60]} width={11} />
        <Limb from={[9, 30]} ctrl={[16, 50]} to={[16, 60]} width={11} />
        <Torso accent={accent} rotate={10} cy={8} />
        <Limb from={[-11, -12]} ctrl={[-22, 6]} to={[-26, 22]} width={9} />
        <Limb from={[13, -8]} ctrl={[-6, 4]} to={[-32, 32]} width={9} />
        <Head tilt={14} x={-6} y={-40} />
      </g>
    </SceneFrame>
  );
}

export function PillowMountainCrawler() {
  return (
    <SceneFrame id="w1a3" wallTop="#FFF6E9" wallBottom="#FFE6C4" floorTop="#F3D9AE" floorBottom="#E4C08A" rugColor="#8FB88A" label="Illustration of a baby crawling on hands and knees over a row of soft cushions, reaching forward toward a set of keys.">
      {/* cushion mountains */}
      <g>
        <ellipse cx="290" cy="222" rx="48" ry="26" fill="#8FB88A" />
        <ellipse cx="290" cy="216" rx="48" ry="22" fill="#A3CC91" />
        <ellipse cx="235" cy="230" rx="42" ry="22" fill="#7FA9D6" />
        <ellipse cx="235" cy="224" rx="42" ry="18" fill="#93BBE0" />
      </g>
      {/* keys motivator */}
      <g transform="translate(330 176)">
        <circle r="7" fill="none" stroke="#D6B24B" strokeWidth="3" />
        <rect x="0" y="-2" width="16" height="4" fill="#D6B24B" />
        <rect x="12" y="-4" width="3" height="4" fill="#D6B24B" />
      </g>
      {/* baby crawling: horizontal composition, front leg planted, rear leg extended */}
      <g transform="translate(160 224)">
        <Shadow y={22} rx={40} ry={8} />
        {/* far-side (back) limbs first */}
        <Limb from={[-26, -6]} ctrl={[-30, 14]} to={[-30, 22]} width={9} color={SKIN_SHADE} />
        <Limb from={[18, -8]} ctrl={[36, -18]} to={[52, -8]} width={9} color={SKIN_SHADE} />
        {/* horizontal torso */}
        <ellipse cx="-4" cy="-8" rx="34" ry="16" fill="#F2A354" transform="rotate(-8 -4 -8)" />
        <ellipse cx="-4" cy="-12" rx="18" ry="8" fill="#FFFFFF" opacity="0.22" transform="rotate(-8 -4 -8)" />
        {/* near-side limbs */}
        <Limb from={[-22, 2]} ctrl={[-26, 18]} to={[-24, 24]} width={10} />
        <Limb from={[22, -4]} ctrl={[40, -6]} to={[54, 2]} width={10} />
        <Head tilt={-18} x={-38} y={-24} />
      </g>
    </SceneFrame>
  );
}

// ============================================================
// WEEK 2 — Cruising & Hip Mobilization (mint / teal)
// ============================================================

export function CouchShuffle() {
  const accent = '#4FB3A9';
  return (
    <SceneFrame id="w2a1" wallTop="#EAFBF6" wallBottom="#CDEFE5" floorTop="#CDE7DF" floorBottom="#AFD4C8" rugColor="#4FB3A9" label="Illustration of a baby cruising sideways along a bare sofa frame, gripping the edge with both hands.">
      {/* sofa frame, cushions removed */}
      <g transform="translate(200 158)">
        <rect x="-150" y="-20" width="300" height="66" rx="20" fill="#3D8F86" />
        <rect x="-150" y="-30" width="300" height="26" rx="13" fill="#57A79C" />
        <rect x="-140" y="-14" width="280" height="10" rx="5" fill="#2E7770" opacity="0.6" />
        <PropBlock x={-90} y={-6} size={16} color="#F0A05A" rotate="8" />
        <circle cx="60" cy={-2} r="9" fill="#F7D97A" />
      </g>
      {/* baby cruising, side-step stance, both hands on frame */}
      <g transform="translate(150 190)">
        <Shadow y={58} rx={32} />
        <Limb from={[-9, 28]} ctrl={[-22, 46]} to={[-26, 58]} width={11} />
        <Limb from={[9, 26]} ctrl={[20, 40]} to={[16, 52]} width={11} />
        <Torso accent={accent} rotate={-3} />
        <Limb from={[-13, -22]} ctrl={[-28, -46]} to={[-30, -62]} width={9} endR={6} />
        <Limb from={[13, -22]} ctrl={[30, -44]} to={[34, -60]} width={9} endR={6} />
        <Head tilt={2} />
      </g>
    </SceneFrame>
  );
}

export function LivingRoomRift() {
  const accent = '#4FB3A9';
  return (
    <SceneFrame id="w2a2" wallTop="#EAFBF6" wallBottom="#CDEFE5" floorTop="#CDE7DF" floorBottom="#AFD4C8" rugColor="#4FB3A9" label="Illustration of a baby standing between an armchair and a sofa, stretching one hand across the gap to reach a toy.">
      {/* armchair left */}
      <g transform="translate(90 190)">
        <rect x="-46" y="-46" width="92" height="70" rx="16" fill="#57A79C" />
        <rect x="-52" y="-10" width="18" height="46" rx="8" fill="#3D8F86" />
      </g>
      {/* sofa right, with a gap */}
      <g transform="translate(320 190)">
        <rect x="-46" y="-30" width="92" height="54" rx="16" fill="#3D8F86" />
        <circle cx="-38" cy="-38" r="9" fill="#F0A05A" />
      </g>
      {/* baby stretching across the gap */}
      <g transform="translate(210 200)">
        <Shadow y={54} rx={30} />
        <Limb from={[-9, 28]} ctrl={[-16, 44]} to={[-14, 54]} width={11} />
        <Limb from={[9, 24]} ctrl={[22, 30]} to={[30, 24]} width={9} endR={5.5} />
        <Torso accent={accent} rotate={10} />
        <Limb from={[-13, -20]} ctrl={[-46, -30]} to={[-58, -18]} width={9} endR={6} />
        <Limb from={[13, -20]} ctrl={[46, -34]} to={[62, -38]} width={9} endR={6} />
        <Head tilt={8} x={10} y={-42} />
      </g>
    </SceneFrame>
  );
}

// ============================================================
// WEEK 3 — Supported Gait & Propulsion (sky blue)
// ============================================================

export function WeightedBoxPush() {
  const accent = '#5B9BD5';
  return (
    <SceneFrame id="w3a1" wallTop="#EDF5FF" wallBottom="#D3E6FA" floorTop="#D7C9AE" floorBottom="#C2AE87" rugColor="#5B9BD5" label="Illustration of a baby leaning forward pushing a wooden crate filled with books across the floor.">
      {/* crate with books */}
      <g transform="translate(255 200)">
        <rect x="-46" y="-30" width="92" height="52" rx="8" fill="#B5794A" />
        <rect x="-46" y="-30" width="92" height="14" rx="7" fill="#D3986A" />
        <rect x="-34" y="-24" width="26" height="16" rx="2" fill="#E3A46E" />
        <rect x="-4" y="-22" width="24" height="14" rx="2" fill="#8FB88A" />
        <rect x="22" y="-24" width="18" height="16" rx="2" fill="#7FA9D6" />
        <ellipse cx="0" cy="24" rx="48" ry="7" fill="#00000018" />
      </g>
      {/* motion lines behind pushing feet */}
      <path d="M 110 244 q 14 6 28 0" stroke="#5B9BD5" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.5" />
      <path d="M 100 254 q 12 5 24 0" stroke="#5B9BD5" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.35" />
      {/* baby leaning into the push */}
      <g transform="translate(178 196)">
        <Shadow y={56} rx={32} />
        <Limb from={[-9, 26]} ctrl={[-14, 48]} to={[-10, 60]} width={11} />
        <Limb from={[9, 24]} ctrl={[28, 44]} to={[46, 52]} width={11} />
        <Torso accent={accent} rotate={16} cy={4} />
        <Limb from={[-9, -18]} ctrl={[16, -6]} to={[36, 4]} width={9} endR={6} />
        <Limb from={[13, -22]} ctrl={[38, -16]} to={[54, -6]} width={9} endR={6} />
        <Head tilt={14} x={6} y={-40} />
      </g>
    </SceneFrame>
  );
}

export function WoodenSpoonWalk() {
  const accent = '#5B9BD5';
  return (
    <SceneFrame id="w3a2" wallTop="#EDF5FF" wallBottom="#D3E6FA" floorTop="#D7C9AE" floorBottom="#C2AE87" rugColor="#5B9BD5" label="Illustration of a baby mid-step, holding a wooden dowel at chest height while a parent's hands guide it from either side.">
      {/* parent hands entering from sides holding the spoon ends */}
      <ParentHand x={40} y={172} rotate={0} />
      <ParentHand x={360} y={172} rotate={180} />
      <rect x="60" y="166" width="280" height="9" rx="4.5" fill="#C98A55" />
      <rect x="60" y="166" width="280" height="3.5" rx="1.75" fill="#E3A46E" />
      {/* baby mid-stride below the bar */}
      <g transform="translate(200 214)">
        <Shadow y={54} rx={32} />
        <Limb from={[-9, 26]} ctrl={[-24, 44]} to={[-30, 56]} width={11} />
        <Limb from={[9, 26]} ctrl={[22, 42]} to={[26, 50]} width={11} />
        <Torso accent={accent} rotate={-2} />
        <Limb from={[-13, -20]} ctrl={[-14, -34]} to={[-8, -44]} width={9} endR={6} />
        <Limb from={[13, -20]} ctrl={[12, -34]} to={[8, -44]} width={9} endR={6} />
        <Head tilt={0} />
      </g>
    </SceneFrame>
  );
}

// ============================================================
// WEEK 4 — Unassisted Launch & Foot Control (coral / rose)
// ============================================================

export function SoftSurfaceRelease() {
  const accent = '#E8798A';
  return (
    <SceneFrame id="w4a1" wallTop="#FFF1F3" wallBottom="#FBDCE1" floorTop="#F0D8D2" floorBottom="#E0BFB6" rugColor="#E8798A" label="Illustration of a baby standing independently in the middle of a room with arms out for balance, a parent's hand hovering nearby.">
      {/* faint hovering support hand, not touching */}
      <g opacity="0.55">
        <ParentHand x={318} y={210} rotate={-14} />
      </g>
      {/* balance wobble arcs */}
      <path d="M 148 150 q 52 -26 104 0" stroke="#E8798A" strokeWidth="2.5" strokeDasharray="1 8" strokeLinecap="round" fill="none" opacity="0.5" />
      {/* baby standing free, arms wide for balance */}
      <g transform="translate(200 196)">
        <Shadow y={58} rx={30} />
        <Limb from={[-9, 28]} ctrl={[-18, 46]} to={[-18, 58]} width={11} />
        <Limb from={[9, 28]} ctrl={[20, 44]} to={[22, 56]} width={11} />
        <Torso accent={accent} rotate={0} />
        <Limb from={[-13, -22]} ctrl={[-34, -26]} to={[-46, -18]} width={9} endR={6} />
        <Limb from={[13, -22]} ctrl={[34, -26]} to={[46, -18]} width={9} endR={6} />
        <Head tilt={-2} />
      </g>
    </SceneFrame>
  );
}

export function SafeLaunchpad() {
  const accent = '#E8798A';
  return (
    <SceneFrame id="w4a2" wallTop="#FFF1F3" wallBottom="#FBDCE1" floorTop="#F0D8D2" floorBottom="#E0BFB6" rugColor="#E8798A" label="Illustration of a baby taking brave independent steps toward a parent kneeling with open arms.">
      {/* supportive cushion behind launch point */}
      <ellipse cx="110" cy="214" rx="30" ry="18" fill="#F2A9B5" />
      <ellipse cx="110" cy="208" rx="30" ry="14" fill="#F6C2CB" />
      {/* parent kneeling with open arms, warm glow behind */}
      <circle cx="330" cy="188" r="70" fill="#FFF3D6" opacity="0.5" />
      <ParentFigure x={332} y={214} accent="#D98A5C" />
      {/* motion lines trailing the steps */}
      <path d="M 170 246 q 16 6 32 0" stroke="#E8798A" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.5" />
      <path d="M 160 256 q 14 5 28 0" stroke="#E8798A" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.35" />
      {/* baby mid-step, arms forward reaching toward parent */}
      <g transform="translate(210 200)">
        <Shadow y={56} rx={30} />
        <Limb from={[-9, 26]} ctrl={[-26, 44]} to={[-34, 54]} width={11} />
        <Limb from={[9, 26]} ctrl={[22, 40]} to={[24, 48]} width={11} endR={5.5} />
        <Torso accent={accent} rotate={6} />
        <Limb from={[-13, -20]} ctrl={[-4, -38]} to={[6, -46]} width={9} endR={6} />
        <Limb from={[13, -20]} ctrl={[30, -30]} to={[42, -28]} width={9} endR={6} />
        <Head tilt={10} x={8} y={-42} />
      </g>
    </SceneFrame>
  );
}

const ACTIVITY_ILLUSTRATIONS = {
  'w1-a1': TallKneelingReach,
  'w1-a2': LowStoolBlockStacking,
  'w1-a3': PillowMountainCrawler,
  'w2-a1': CouchShuffle,
  'w2-a2': LivingRoomRift,
  'w3-a1': WeightedBoxPush,
  'w3-a2': WoodenSpoonWalk,
  'w4-a1': SoftSurfaceRelease,
  'w4-a2': SafeLaunchpad,
};

export default function ActivityIllustration({ activityId }) {
  const Component = ACTIVITY_ILLUSTRATIONS[activityId] || TallKneelingReach;
  return <Component />;
}
