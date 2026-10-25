// Shared atoms for the in-video product UI clones.
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {CLAMP, FONT, MONO, PulseDot} from '../hyperframe';
import {Icon} from './Icons';

// UI subtrees run on phase-local time (provided by each UI root) so their
// entrance animations replay on every showcase camera phase.
export const UITimeCtx = React.createContext<number | null>(null);
export const useUITime = (): number => {
  const raw = useCurrentFrame();
  const ctx = React.useContext(UITimeCtx);
  return ctx ?? raw;
};

export const APPEAR = (f: number, at: number, d = 12) => interpolate(f, [at, at + d], [0, 1], {...CLAMP});

export const RiseIn: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties; d?: number}> = ({
  at, children, style, d = 12,
}) => {
  const f = useUITime();
  const k = APPEAR(f, at, d);
  return <div style={{opacity: k, transform: `translateY(${(1 - k) * 14}px)`, ...style}}>{children}</div>;
};

export const WindowFrame: React.FC<{
  title: string; accent: string; children: React.ReactNode; w: number; h: number;
  badge?: string; bare?: boolean;
}> = ({title, accent, children, w, h, badge, bare}) => {
  if (bare) {
    return (
      <div style={{
        width: w, height: h, borderRadius: 18, position: 'relative',
        background: 'linear-gradient(170deg, #17151D 0%, #131118 60%, #111015 100%)',
        border: `1px solid ${accent}2E`,
        boxShadow: `0 60px 140px -40px ${accent}66, 0 40px 90px -50px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.06)`,
        transform: 'none',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        fontFamily: FONT,
      }}>
        {children}
      </div>
    );
  }
  const f = useCurrentFrame();
  const enter = interpolate(f, [0, 22], [0, 1], {...CLAMP});
  return (
    <div style={{
      width: w, height: h, borderRadius: 20, position: 'relative',
      background: 'linear-gradient(170deg, #1D1726 0%, #14101B 60%, #120E17 100%)',
      border: `1px solid ${accent}2E`,
      boxShadow: `0 60px 140px -40px ${accent}66, 0 40px 90px -50px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.07)`,
      transform: `translateY(${(1 - enter) * 60}px) scale(${0.94 + enter * 0.06})`,
      opacity: enter,
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      fontFamily: FONT,
    }}>
      <div style={{
        height: 44, display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px',
        borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.025)',
        flexShrink: 0,
      }}>
        {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
          <div key={c} style={{width: 11, height: 11, borderRadius: '50%', background: c, opacity: 0.9}} />
        ))}
        <div style={{
          flex: 1, textAlign: 'center', color: 'rgba(235,230,245,0.55)', fontSize: 13, fontWeight: 600,
          letterSpacing: '0.02em', marginRight: 60,
        }}>
          {title}
        </div>
        {badge ? (
          <div style={{
            position: 'absolute', right: 14, fontSize: 11, fontWeight: 700, color: accent,
            border: `1px solid ${accent}55`, borderRadius: 6, padding: '2px 8px', letterSpacing: '0.06em',
          }}>{badge}</div>
        ) : null}
      </div>
      <div style={{flex: 1, display: 'flex', minHeight: 0}}>{children}</div>
    </div>
  );
};

export const SideItem: React.FC<{icon?: React.ReactNode; label: string; kbd?: string; active?: boolean; accent: string; at: number}> = ({
  icon, label, kbd, active, accent, at,
}) => {
  const f = useCurrentFrame();
  const k = APPEAR(f, at, 8);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 9, padding: '7px 10px', borderRadius: 9,
      background: active ? `${accent}22` : 'transparent',
      border: `1px solid ${active ? `${accent}44` : 'transparent'}`,
      color: active ? '#F2EDF8' : 'rgba(230,224,240,0.6)',
      fontSize: 13.5, fontWeight: 600, opacity: k, transform: `translateX(${(1 - k) * -10}px)`,
    }}>
      {icon}{label}
      {kbd ? <span style={{marginLeft: 'auto', fontSize: 10.5, opacity: 0.45, fontFamily: MONO}}>{kbd}</span> : null}
    </div>
  );
};

export const MiniToggle: React.FC<{on: boolean; accent: string; at: number}> = ({on, accent, at}) => {
  const f = useUITime();
  const k = interpolate(f, [at, at + 10], [0, 1], {...CLAMP});
  return (
    <div style={{
      width: 34, height: 19, borderRadius: 999, flexShrink: 0, position: 'relative',
      background: on ? `${accent}CC` : 'rgba(255,255,255,0.12)',
      transition: 'none',
    }}>
      <div style={{
        position: 'absolute', top: 2.5, left: on ? 17.5 : 2.5,
        width: 14, height: 14, borderRadius: '50%', background: '#fff',
        transform: `scale(${0.8 + k * 0.2})`,
        boxShadow: on ? `0 0 10px ${accent}` : 'none',
      }} />
    </div>
  );
};

export const Bar: React.FC<{w: number | string; accent: string; at: number; h?: number; color?: string}> = ({w, accent, at, h = 6, color}) => {
  const f = useUITime();
  const k = interpolate(f, [at, at + 18], [0, 1], {...CLAMP});
  return (
    <div style={{width: w, height: h, borderRadius: h, background: 'rgba(255,255,255,0.08)', overflow: 'hidden', flexShrink: 0}}>
      <div style={{
        width: `${k * 100}%`, height: '100%', borderRadius: h,
        background: color ?? `linear-gradient(90deg, ${accent}, ${accent}88)`,
        boxShadow: `0 0 10px ${accent}66`,
      }} />
    </div>
  );
};

export const Sparkline: React.FC<{w: number; h: number; accent: string; seed: number; at: number; fill?: boolean}> = ({
  w, h, accent, seed, at, fill = true,
}) => {
  const f = useUITime();
  const pts = Array.from({length: 14}, (_, i) => {
    const v = 0.35 + 0.65 * Math.abs(Math.sin(seed + i * 0.9)) * (0.6 + 0.4 * Math.sin(seed * 2 + i * 0.35));
    return `${(i / 13) * w},${h - v * h * 0.86 - 2}`;
  }).join(' ');
  const k = interpolate(f, [at, at + 26], [0, 1], {...CLAMP});
  return (
    <svg width={w} height={h} style={{display: 'block'}}>
      {fill ? (
        <polygon points={`0,${h} ${pts} ${w},${h}`} fill={`${accent}1E`} opacity={k} />
      ) : null}
      <polyline points={pts} fill="none" stroke={accent} strokeWidth={2.2}
        strokeDasharray={w * 2} strokeDashoffset={(1 - k) * w * 2} strokeLinecap="round" />
    </svg>
  );
};

export const TaskDot: React.FC<{kind: 'run' | 'think' | 'ok' | 'warn'; accent: string; at: number}> = ({kind, accent, at}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const color = kind === 'ok' ? '#3DDC97' : kind === 'warn' ? '#F5A524' : kind === 'think' ? '#9F7CFA' : accent;
  return <PulseDot color={color} size={9} mode={kind === 'ok' ? 'steady' : 'pulse'} />;
};

// ── Composer bottom chip row — mirrors the real apps exactly:
//    + · 🛡 Full ▾ · <engine> ▾ · <model> ▾ · ◎ Medium ▾  …  (send) ──
export const ComposerChips: React.FC<{
  engineIcon: React.ReactNode; engineLabel: string; model: string;
}> = ({engineIcon, engineLabel, model}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
    <Icon name="plus" size={14} color="rgba(230,224,240,0.7)" stroke={2.2} />
    <span style={{display: 'flex', alignItems: 'center', gap: 5}}>
      <Icon name="shield" size={13} color="#F5A524" stroke={2.2} />
      <ChipTxt>Full</ChipTxt>
      <Icon name="chevron" size={10} color="rgba(230,224,240,0.5)" stroke={2.4} />
    </span>
    <span style={{display: 'flex', alignItems: 'center', gap: 5}}>
      {engineIcon}
      <ChipTxt>{engineLabel}</ChipTxt>
      <Icon name="chevron" size={10} color="rgba(230,224,240,0.5)" stroke={2.4} />
    </span>
    <span style={{display: 'flex', alignItems: 'center', gap: 5}}>
      <span style={{fontFamily: MONO, fontSize: 11.5, color: 'rgba(230,224,240,0.85)'}}>{model}</span>
      <Icon name="chevron" size={10} color="rgba(230,224,240,0.5)" stroke={2.4} />
    </span>
    <span style={{display: 'flex', alignItems: 'center', gap: 5}}>
      <Icon name="target" size={13} color="#E8556F" stroke={2.1} />
      <ChipTxt>Medium</ChipTxt>
      <Icon name="chevron" size={10} color="rgba(230,224,240,0.5)" stroke={2.4} />
    </span>
    <span style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10}}>
      <div style={{width: 7, height: 7, borderRadius: 4, background: 'rgba(230,224,240,0.25)'}} />
      <div style={{
        width: 26, height: 26, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(180deg, #FF7D9C, #E8446E)',
        boxShadow: '0 4px 14px -4px #E8446E99',
      }}>
        <Icon name="arrowup" size={13} color="#fff" stroke={2.6} />
      </div>
    </span>
  </div>
);

const ChipTxt: React.FC<{children: React.ReactNode}> = ({children}) => (
  <span style={{fontSize: 11.5, fontWeight: 600, color: 'rgba(240,235,248,0.92)'}}>{children}</span>
);

// ── Character avatars (KendaliAI roster) — cute deterministic SVG faces ────
export const FaceAvatar: React.FC<{
  kind: 'astro' | 'ghost' | 'girl' | 'bot'; size: number; ring?: string; dot?: boolean;
}> = ({kind, size, ring, dot}) => {
  const gid = `fa-${kind}-${size}`;
  const grads: Record<string, [string, string]> = {
    astro: ['#5BC9EA', '#3B7BF6'],
    ghost: ['#8CE8CF', '#4ECBA8'],
    girl: ['#E85CC8', '#8B5CF6'],
    bot: ['#9F8CFA', '#5F4BD8'],
  };
  const [g1, g2] = grads[kind];
  return (
    <div style={{position: 'relative', width: size, height: size, flexShrink: 0}}>
      {ring ? <div style={{
        position: 'absolute', inset: -3, borderRadius: '50%',
        border: `2.5px solid ${ring}`, boxShadow: `0 0 14px -2px ${ring}`,
      }} /> : null}
      <svg width={size} height={size} viewBox="0 0 64 64" style={{display: 'block'}}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={g1} /><stop offset="1" stopColor={g2} />
          </linearGradient>
          <clipPath id={`${gid}-c`}><circle cx="32" cy="32" r="30" /></clipPath>
        </defs>
        <circle cx="32" cy="32" r="30" fill={`url(#${gid})`} />
        <g clipPath={`url(#${gid}-c)`}>
          {kind === 'astro' ? (
            <>
              <rect x="8" y="22" width="48" height="18" rx="9" fill="#131120" />
              <circle cx="24" cy="31" r="3.4" fill="#BFF3FF" />
              <circle cx="40" cy="31" r="3.4" fill="#BFF3FF" />
              <path d="M14 12a22 22 0 0 1 36 0l-4 4a18 18 0 0 0-28 0z" fill="#EAF7FF" opacity="0.85" />
              <path d="M20 48c4 3 20 3 24 0v6c-4 3-20 3-24 0z" fill="#EAF7FF" opacity="0.4" />
            </>
          ) : null}
          {kind === 'ghost' ? (
            <>
              <path d="M32 10c11 0 17 8 17 19v17l-5.7-4-5.6 4-5.7-4-5.7 4-5.6-4-5.7 4V29c0-11 6-19 17-19z" fill="#F4FFFB" />
              <circle cx="26" cy="30" r="3.2" fill="#1B2A26" />
              <circle cx="38" cy="30" r="3.2" fill="#1B2A26" />
              <path d="M28 38q4 3 8 0" stroke="#1B2A26" strokeWidth="2" fill="none" strokeLinecap="round" />
            </>
          ) : null}
          {kind === 'girl' ? (
            <>
              <path d="M32 8c13 0 20 9 20 20v10l-6-2-2-12c-8 4-16 4-24 0l-2 12-6 2V28c0-11 7-20 20-20z" fill="#5B2D8F" />
              <circle cx="32" cy="34" r="11" fill="#FFD9C4" />
              <path d="M21 28c4-6 18-6 22 0-6-3-16-3-22 0z" fill="#5B2D8F" />
              <circle cx="27.5" cy="35" r="2.2" fill="#2A1B3D" />
              <circle cx="36.5" cy="35" r="2.2" fill="#2A1B3D" />
              <path d="M29.5 40q2.5 2 5 0" stroke="#B4635A" strokeWidth="1.8" fill="none" strokeLinecap="round" />
              <path d="M14 30a18 18 0 0 1 36 0" stroke="#312A45" strokeWidth="4" fill="none" strokeLinecap="round" />
              <rect x="12" y="28" width="5" height="9" rx="2.5" fill="#312A45" />
              <rect x="47" y="28" width="5" height="9" rx="2.5" fill="#312A45" />
            </>
          ) : null}
          {kind === 'bot' ? (
            <>
              <line x1="32" y1="6" x2="32" y2="14" stroke="#D8CFFF" strokeWidth="2.4" />
              <circle cx="32" cy="5" r="3" fill="#D8CFFF" />
              <rect x="14" y="16" width="36" height="30" rx="9" fill="#EDE9FF" />
              <circle cx="25" cy="30" r="3.4" fill="#3A2C6E" />
              <circle cx="39" cy="30" r="3.4" fill="#3A2C6E" />
              <rect x="26" y="37" width="12" height="3" rx="1.5" fill="#3A2C6E" opacity="0.7" />
            </>
          ) : null}
        </g>
      </svg>
      {dot ? (
        <div style={{
          position: 'absolute', right: 0, bottom: 1, width: size * 0.26, height: size * 0.26,
          borderRadius: '50%', background: '#3DDC97', border: `${Math.max(2, size * 0.06)}px solid #14101B`,
        }} />
      ) : null}
    </div>
  );
};

// ── Provider "gem" icon (task rows in ForgeADE sidebar) ────────────────────
export const GemIcon: React.FC<{size?: number; from: string; to: string}> = ({size = 13, from, to}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{flexShrink: 0}}>
    <defs>
      <linearGradient id={`gem-${from}${to}`.replace(/[^a-zA-Z0-9]/g, '')} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={from} /><stop offset="1" stopColor={to} />
      </linearGradient>
    </defs>
    {(() => {
      const id = `gem-${from}${to}`.replace(/[^a-zA-Z0-9]/g, '');
      return <rect x="4" y="4" width="16" height="16" rx="5" transform="rotate(45 12 12)" fill={`url(#${id})`} />;
    })()}
  </svg>
);
