// ─── Hyperframe ─────────────────────────────────────────────────────────────
// Motion engine for the Haslab brand ads. Deterministic, frame-driven,
// built on top of Remotion springs & interpolators.
import React from 'react';
import {
  AbsoluteFill, Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig,
} from 'remotion';

export const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const OUT_CUBIC = Easing.out(Easing.cubic);
export const IN_OUT_CUBIC = Easing.inOut(Easing.cubic);
export const OUT_EXPO = Easing.out(Easing.exp);

export const FONT = "'Plus Jakarta Sans', 'Helvetica Neue', Arial, sans-serif";
export const MONO = "'JetBrains Mono', 'SF Mono', Menlo, monospace";

// ── Scene shell: enter (rise+fade) & exit (fade+scale) wrapper ──────────────
export const SceneShell: React.FC<{dur: number; children: React.ReactNode}> = ({dur, children}) => {
  const f = useCurrentFrame();
  const enter = interpolate(f, [0, 16], [0, 1], {...CLAMP, easing: OUT_EXPO});
  const exit = interpolate(f, [dur - 14, dur - 1], [1, 0], CLAMP);
  const exitScale = interpolate(f, [dur - 14, dur - 1], [1, 1.045], {...CLAMP, easing: IN_OUT_CUBIC});
  return (
    <AbsoluteFill style={{
      opacity: enter * exit,
      transform: `translateY(${(1 - enter) * 46}px) scale(${exitScale})`,
    }}>
      {children}
    </AbsoluteFill>
  );
};

// ── Animated multi-blob gradient field (pre-blurred radials, GPU cheap) ─────
export const GradientField: React.FC<{a: string; b: string; seed?: number; intensity?: number}> = ({
  a, b, seed = 1, intensity = 1,
}) => {
  const f = useCurrentFrame();
  const blobs = [
    {c: a, x: 20 + Math.sin(f / 95 + seed) * 14, y: 16 + Math.cos(f / 120 + seed) * 10, s: 90},
    {c: b, x: 82 + Math.cos(f / 110 + seed * 2) * 12, y: 74 + Math.sin(f / 140 + seed) * 10, s: 100},
    {c: a, x: 70 + Math.sin(f / 150 + seed * 3) * 10, y: 30 + Math.cos(f / 100 + seed * 2) * 12, s: 55},
    {c: b, x: 25 + Math.cos(f / 130 + seed * 4) * 9, y: 82 + Math.sin(f / 115 + seed * 3) * 8, s: 60},
  ];
  return (
    <AbsoluteFill style={{backgroundColor: '#050408'}}>
      {blobs.map((bl, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${bl.x}%`, top: `${bl.y}%`,
          width: `${bl.s}%`, paddingTop: `${bl.s}%`,
          marginLeft: `-${bl.s / 2}%`, marginTop: `-${bl.s / 2}%`,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${bl.c}${Math.round(0x33 * intensity).toString(16).padStart(2, '0')} 0%, transparent 68%)`,
          opacity: 0.85 * intensity,
        }} />
      ))}
    </AbsoluteFill>
  );
};

// ── Deterministic drifting particle field ───────────────────────────────────
export const ParticleField: React.FC<{count?: number; color: string; seed?: number}> = ({
  count = 46, color, seed = 5,
}) => {
  const f = useCurrentFrame();
  const parts = React.useMemo(() => Array.from({length: count}, (_, i) => ({
    x: random(`${seed}x${i}`) * 100,
    y: random(`${seed}y${i}`) * 100,
    s: 2 + random(`${seed}s${i}`) * 5,
    sp: 0.4 + random(`${seed}p${i}`) * 1.1,
    ph: random(`${seed}o${i}`) * Math.PI * 2,
  })), [count, seed]);
  return (
    <AbsoluteFill>
      {parts.map((p, i) => {
        const drift = Math.sin(f / 70 * p.sp + p.ph) * 16;
        const rise = ((f * p.sp + p.y * 12) % 110) - 5;
        const tw = 0.25 + 0.75 * Math.abs(Math.sin(f / 42 * p.sp + p.ph));
        return (
          <div key={i} style={{
            position: 'absolute',
            left: `${p.x}%`, top: `${100 - rise}%`,
            width: p.s, height: p.s, borderRadius: '50%',
            background: color,
            opacity: 0.16 * tw,
            transform: `translate(${drift}px, 0)`,
            boxShadow: `0 0 ${p.s * 3}px ${color}`,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

// ── Subtle blueprint grid ───────────────────────────────────────────────────
export const GridOverlay: React.FC<{color?: string}> = ({color = 'rgba(255,255,255,0.045)'}) => (
  <AbsoluteFill style={{
    backgroundImage:
      `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
    backgroundSize: '72px 72px',
    maskImage: 'radial-gradient(ellipse 90% 70% at 50% 45%, black 30%, transparent 100%)',
    WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 45%, black 30%, transparent 100%)',
  }} />
);

// ── Vignette to focus center stage ──────────────────────────────────────────
export const Vignette: React.FC = () => (
  <AbsoluteFill style={{
    background: 'radial-gradient(ellipse 120% 90% at 50% 42%, transparent 55%, rgba(0,0,0,0.5) 100%)',
  }} />
);

// ── Kinetic headline: words pop in with spring stagger ─────────────────────
export const KineticText: React.FC<{
  text: string;
  size: number;
  color?: string;
  weight?: number;
  delay?: number;
  stagger?: number;
  glow?: string;
  align?: 'center' | 'left';
  gradient?: [string, string];
}> = ({text, size, color = '#F4F1FA', weight = 800, delay = 0, stagger = 3, glow, align = 'center', gradient}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = text.split(' ');
  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', justifyContent: align === 'center' ? 'center' : 'flex-start',
      gap: `0 ${size * 0.26}px`, rowGap: size * 0.28,
    }}>
      {words.map((w, i) => {
        const t = Math.max(0, f - delay - i * stagger);
        const s = spring({frame: t, fps, config: {damping: 18, stiffness: 160, mass: 0.7}});
        return (
          <span key={i} style={{
            display: 'inline-block',
            fontSize: size, fontWeight: weight, fontFamily: FONT,
            letterSpacing: '-0.02em', lineHeight: 1.14,
            color: gradient ? 'transparent' : color,
            backgroundImage: gradient ? `linear-gradient(100deg, ${gradient[0]}, ${gradient[1]})` : undefined,
            WebkitBackgroundClip: gradient ? 'text' : undefined,
            opacity: s,
            transform: `translateY(${(1 - s) * 44}px) scale(${0.86 + s * 0.14})`,
            textShadow: glow ? `0 0 ${size * 0.55}px ${glow}` : undefined,
            filter: glow && s < 0.9 ? `brightness(${1 + (1 - s) * 0.8})` : undefined,
          }}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

// ── The shared 4-point "spark" mark (forge-ade / kendali-ai family glyph) ──
export const SparkMark: React.FC<{size: number; colorA: string; colorB: string; spin?: boolean; glow?: boolean}> = ({
  size, colorA, colorB, spin = false, glow = true,
}) => {
  const f = useCurrentFrame();
  const gid = `hf-spark-${`${colorA}${colorB}${size}`.replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <div style={{
      width: size, height: size, position: 'relative',
      filter: glow ? `drop-shadow(0 0 ${size * 0.22}px ${colorA}) drop-shadow(0 0 ${size * 0.5}px ${colorA}55)` : undefined,
      transform: spin ? `rotate(${f * 1.4}deg)` : undefined,
    }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={colorA} />
            <stop offset="100%" stopColor={colorB} />
          </linearGradient>
        </defs>
        <path
          d="M50 2 C55.5 34 66 44.5 98 50 C66 55.5 55.5 66 50 98 C44.5 66 34 55.5 2 50 C34 44.5 44.5 34 50 2 Z"
          fill={`url(#${gid})`}
        />
        <circle cx="82" cy="18" r="7" fill={colorB} />
      </svg>
    </div>
  );
};

// ── Product logomark: spark for the IDE family, custom marks otherwise ─────
export const ProductMark: React.FC<{name: string; size: number; accent: string; accent2: string; spin?: boolean}> = ({
  name, size, accent, accent2, spin,
}) => {
  if (name === 'RakitKode') {
    const gid = `hf-rk-${`${accent}${accent2}${size}`.replace(/[^a-zA-Z0-9]/g, '')}`;
    return (
      <div style={{width: size, height: size, position: 'relative', filter: `drop-shadow(0 0 ${size * 0.2}px ${accent}88)`}}>
        <svg width={size} height={size} viewBox="0 0 100 100">
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={accent} /><stop offset="100%" stopColor={accent2} />
            </linearGradient>
          </defs>
          <rect x="14" y="16" width="72" height="20" rx="6" fill={`url(#${gid})`} opacity="0.55" />
          <rect x="24" y="44" width="52" height="20" rx="6" fill={`url(#${gid})`} opacity="0.8" />
          <rect x="34" y="72" width="32" height="20" rx="6" fill={`url(#${gid})`} />
        </svg>
      </div>
    );
  }
  if (name === 'PanduJev') {
    return (
      <div style={{width: size, height: size, position: 'relative', filter: `drop-shadow(0 0 ${size * 0.2}px ${accent}88)`, transform: spin ? `rotate(${Math.sin(useCurrentFrame() / 40) * 24}deg)` : undefined}}>
        <svg width={size} height={size} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke={accent} strokeWidth="6" opacity="0.5" />
          <path d="M50 50 L74 26 L58 58 Z" fill={accent2} />
          <path d="M50 50 L26 74 L42 42 Z" fill={accent} />
          <circle cx="50" cy="50" r="8" fill={accent2} />
        </svg>
      </div>
    );
  }
  return <SparkMark size={size} colorA={accent} colorB={accent2} spin={spin} />;
};

// ── Glass panel ─────────────────────────────────────────────────────────────
export const Glass: React.FC<{
  children: React.ReactNode; style?: React.CSSProperties; accent?: string; pad?: number;
}> = ({children, style, accent, pad = 0}) => (
  <div style={{
    background: 'linear-gradient(160deg, rgba(255,255,255,0.075), rgba(255,255,255,0.028))',
    border: `1px solid ${accent ? `${accent}3D` : 'rgba(255,255,255,0.12)'}`,
    borderRadius: 28,
    boxShadow: accent ? `0 24px 80px -24px ${accent}59` : '0 24px 80px -30px rgba(0,0,0,0.8)',
    padding: pad,
    overflow: 'hidden',
    ...style,
  }}>
    {children}
  </div>
);

// ── Count-up number ─────────────────────────────────────────────────────────
export const CountUp: React.FC<{
  to: number; decimals?: number; start?: number; dur?: number; style?: React.CSSProperties;
}> = ({to, decimals = 0, start = 0, dur = 40, style}) => {
  const f = useCurrentFrame();
  const v = interpolate(f, [start, start + dur], [0, to], {...CLAMP, easing: OUT_EXPO});
  return <span style={style}>{v.toFixed(decimals)}</span>;
};

// ── Pill chip ───────────────────────────────────────────────────────────────
export const Chip: React.FC<{children: React.ReactNode; color: string; filled?: boolean; style?: React.CSSProperties}> = ({
  children, color, filled, style,
}) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: 12,
    fontFamily: FONT, fontSize: 26, fontWeight: 700, letterSpacing: '0.22em',
    color: filled ? '#0B0710' : color,
    background: filled ? `linear-gradient(100deg, ${color}, #fff3)` : `${color}14`,
    border: `1.5px solid ${color}66`,
    borderRadius: 999, padding: '14px 30px',
    ...style,
  }}>
    {children}
  </div>
);

// ── Marquee ticker ──────────────────────────────────────────────────────────
export const Marquee: React.FC<{items: string[]; color: string; speed?: number; style?: React.CSSProperties}> = ({
  items, color, speed = 2.4, style,
}) => {
  const f = useCurrentFrame();
  const row = [...items, ...items, ...items];
  const w = 100 / 3;
  return (
    <div style={{overflow: 'hidden', whiteSpace: 'nowrap', ...style}}>
      <div style={{display: 'inline-flex', gap: 56, transform: `translateX(${-((f * speed) % w)}%)`}}>
        {row.map((it, i) => (
          <span key={i} style={{
            fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: '0.3em',
            color, opacity: 0.5,
          }}>
            {it} <span style={{opacity: 0.5}}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
};

// ── Status dot ──────────────────────────────────────────────────────────────
export const PulseDot: React.FC<{color: string; size?: number; mode?: 'pulse' | 'steady'}> = ({
  color, size = 10, mode = 'pulse',
}) => {
  const f = useCurrentFrame();
  const k = mode === 'pulse' ? 0.5 + 0.5 * Math.abs(Math.sin(f / 16)) : 1;
  return (
    <div style={{position: 'relative', width: size, height: size}}>
      <div style={{
        position: 'absolute', inset: -size * 0.6, borderRadius: '50%',
        background: color, opacity: 0.25 * k,
      }} />
      <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}`}} />
    </div>
  );
};

// ── Typed text (monospace, deterministic) ───────────────────────────────────
export const useTypewriter = (text: string, start: number, cps: number, blinkFrom?: number) => {
  const f = useCurrentFrame();
  const n = Math.round(interpolate(f, [start, start + text.length / cps], [0, text.length], CLAMP));
  const done = n >= text.length;
  const caretOn = blinkFrom === undefined || f < blinkFrom ? true : Math.floor((f - blinkFrom) / 14) % 2 === 0;
  return {out: text.slice(0, n) + (done && caretOn ? '▊' : ''), done};
};
