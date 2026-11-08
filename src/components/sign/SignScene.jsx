import React from 'react';
import { buildHand } from './handModel';

const SKIN = '#f3c6a2';
const SKIN_PALM = '#fbdcc4';
const SKIN_LINE = '#9a5a36';
const SHIRT = '#4f83ee';
const SHIRT_DARK = '#2f5fc4';
const SLEEVE = '#3f72e0';
const SLEEVE_DARK = '#1f4fb2';

function ptsAttr(pts) {
  return pts.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');
}

function HandParts({ hand, opacity = 1 }) {
  return (
    <g opacity={opacity}>
      {hand.parts.map((part, i) => {
        if (part.kind === 'palm') {
          const fill = part.palmFacing ? SKIN_PALM : SKIN;
          return (
            <g key={i}>
              <polygon points={ptsAttr(part.pts)} fill={fill} stroke={SKIN_LINE} strokeWidth={part.w + 2.4} strokeLinejoin="round" />
              <polygon points={ptsAttr(part.pts)} fill={fill} stroke={fill} strokeWidth={part.w} strokeLinejoin="round" />
            </g>
          );
        }
        return (
          <g key={i}>
            <polyline points={ptsAttr(part.pts)} fill="none" stroke={SKIN_LINE} strokeWidth={part.w + 2.4} strokeLinecap="round" strokeLinejoin="round" />
            <polyline points={ptsAttr(part.pts)} fill="none" stroke={SKIN} strokeWidth={part.w} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );
      })}
    </g>
  );
}

function Arm({ hand, shoulder }) {
  const { wrist, elbow } = hand;
  // Lengan bawah berhenti sedikit sebelum pergelangan (manset baju).
  const dx = wrist.x - elbow.x;
  const dy = wrist.y - elbow.y;
  const len = Math.hypot(dx, dy) || 1;
  const cut = Math.min(4, len * 0.2);
  const cuff = { x: wrist.x - (dx / len) * cut, y: wrist.y - (dy / len) * cut };
  const upper = `M ${shoulder[0]} ${shoulder[1]} L ${elbow.x.toFixed(2)} ${elbow.y.toFixed(2)}`;
  const fore = `M ${elbow.x.toFixed(2)} ${elbow.y.toFixed(2)} L ${cuff.x.toFixed(2)} ${cuff.y.toFixed(2)}`;
  return (
    <g>
      <path d={upper} stroke={SLEEVE_DARK} strokeWidth="23" strokeLinecap="round" fill="none" />
      <path d={upper} stroke={SLEEVE} strokeWidth="20" strokeLinecap="round" fill="none" />
      <path d={fore} stroke={SLEEVE_DARK} strokeWidth="18" strokeLinecap="round" fill="none" />
      <path d={fore} stroke={SLEEVE} strokeWidth="15" strokeLinecap="round" fill="none" />
    </g>
  );
}

function Face({ expression }) {
  const mouth = {
    smile: 'M 110 78 Q 120 87 130 78',
    open: 'M 113 78 Q 120 86 127 78 Q 120 80 113 78',
    urgent: 'M 112 82 Q 120 76 128 82',
    neutral: 'M 112 80 Q 120 83 128 80',
  }[expression || 'neutral'];
  const brows = expression === 'urgent'
    ? ['M 102 52 L 115 56', 'M 138 52 L 125 56']
    : ['M 103 55 Q 109 51 115 54', 'M 125 54 Q 131 51 137 55'];
  return (
    <g>
      <path d={brows[0]} stroke="#3f2a1d" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d={brows[1]} stroke="#3f2a1d" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <circle cx="109" cy="62" r="2.6" fill="#1e293b" />
      <circle cx="131" cy="62" r="2.6" fill="#1e293b" />
      <path d="M 120 64 Q 118 71 121 72" stroke={SKIN_LINE} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d={mouth} stroke="#9f3a2c" strokeWidth="2.2" fill={expression === 'open' ? '#9f3a2c' : 'none'} strokeLinecap="round" />
    </g>
  );
}

function Body({ expression }) {
  return (
    <g>
      {/* Badan */}
      <path
        d="M 30 222 L 38 160 Q 44 128 80 120 L 104 112 Q 120 120 136 112 L 160 120 Q 196 128 202 160 L 210 222 Z"
        fill={SHIRT}
        stroke={SHIRT_DARK}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M 104 112 Q 120 128 136 112" fill="none" stroke={SHIRT_DARK} strokeWidth="2" />
      {/* Leher */}
      <path d="M 109 92 L 109 112 Q 120 120 131 112 L 131 92 Z" fill={SKIN} stroke={SKIN_LINE} strokeWidth="1.6" />
      {/* Kepala */}
      <ellipse cx="94" cy="64" rx="4.5" ry="7" fill={SKIN} stroke={SKIN_LINE} strokeWidth="1.6" />
      <ellipse cx="146" cy="64" rx="4.5" ry="7" fill={SKIN} stroke={SKIN_LINE} strokeWidth="1.6" />
      <ellipse cx="120" cy="64" rx="25" ry="29" fill={SKIN} stroke={SKIN_LINE} strokeWidth="1.8" />
      {/* Rambut */}
      <path d="M 95 62 Q 92 34 120 33 Q 148 34 145 62 Q 142 46 128 44 Q 112 48 99 46 Q 96 52 95 62 Z" fill="#2b2118" />
      <Face expression={expression} />
    </g>
  );
}

function MoveArrow({ from, to, markerId }) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.hypot(dx, dy);
  if (dist < 9) return null;
  // Lengkung kecil agar arah gerak mudah dibaca
  const mx = (from.x + to.x) / 2 - dy * 0.18;
  const my = (from.y + to.y) / 2 + dx * 0.18;
  const shrink = Math.min(10, dist * 0.25);
  const ex = to.x - (dx / dist) * shrink;
  const ey = to.y - (dy / dist) * shrink;
  return (
    <path
      d={`M ${from.x.toFixed(1)} ${from.y.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`}
      fill="none"
      stroke="#f97316"
      strokeWidth="3"
      strokeDasharray="5 4"
      strokeLinecap="round"
      markerEnd={`url(#${markerId})`}
    />
  );
}

/**
 * Menggambar satu frame peraga.
 * pose: { r, l, face } (r/l hasil resolveHand / lerpHand)
 * ghost: pose sebelumnya (opsional) untuk ditampilkan samar + panah arah gerak.
 */
export default function SignScene({ pose, ghost, mirror = false, markerId = 'arrow', className = '', title }) {
  const R = buildHand(pose.r, 'R');
  const L = buildHand(pose.l, 'L');
  const gR = ghost?.r ? buildHand(ghost.r, 'R') : null;
  const gL = ghost?.l ? buildHand(ghost.l, 'L') : null;

  // Tangan yang lebih "dekat" ke penonton digambar terakhir
  const order = pose.front === 'L' || (pose.front !== 'R' && L.depth > R.depth + 4)
    ? [['R', R], ['L', L]]
    : [['L', L], ['R', R]];

  return (
    <svg viewBox="0 0 240 220" className={className} role="img" aria-label={title}>
      <defs>
        <marker id={markerId} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#f97316" />
        </marker>
        <clipPath id={`${markerId}-clip`}>
          <rect x="0" y="0" width="240" height="220" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${markerId}-clip)`}>
        <g transform={mirror ? 'translate(240 0) scale(-1 1)' : undefined}>
          <Body expression={pose.face} />
          {gR && <HandParts hand={gR} opacity={0.22} />}
          {gL && <HandParts hand={gL} opacity={0.22} />}
          {order.map(([side, h]) => (
            <g key={side}>
              <Arm hand={h} shoulder={side === 'R' ? [80, 128] : [160, 128]} />
              <HandParts hand={h} />
            </g>
          ))}
          {gR && <MoveArrow from={gR.center} to={R.center} markerId={markerId} />}
          {gL && <MoveArrow from={gL.center} to={L.center} markerId={markerId} />}
        </g>
      </g>
    </svg>
  );
}
