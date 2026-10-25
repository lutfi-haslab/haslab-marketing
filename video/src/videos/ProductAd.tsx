// ProductAd — the 63s portrait branding ad, parameterized per product.
// Scene flow: logo intro → problem hook → UI showcase (camera rig) →
// features → stats → outro. Wrapped by the Hyperframe stage.
import React from 'react';
import {
  AbsoluteFill, Audio, Easing, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig,
  Series,
} from 'remotion';
import type {Product} from '../brand';
import {
  CLAMP, Chip, CountUp, FONT, GradientField, GridOverlay, IN_OUT_CUBIC, KineticText, Marquee,
  MONO, ParticleField, ProductMark, SceneShell, Vignette,
} from '../hyperframe';
import {Icon} from '../ui/Icons';
import {Glass} from '../hyperframe';

const DUR = 1890;

// ── 1 · Logo intro (100f) ───────────────────────────────────────────────────
const LogoIntro: React.FC<{p: Product}> = ({p}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const mark = spring({frame: f - 3, fps, config: {damping: 14, stiffness: 120, mass: 0.8}});
  const ring = interpolate(f, [0, 42], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const rise = interpolate(f, [58, 96], [0, -26], {...CLAMP, easing: IN_OUT_CUBIC});
  return (
    <SceneShell dur={100}>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        {/* expanding halo */}
        <div style={{
          position: 'absolute', width: 340 + ring * 900, height: 340 + ring * 900, borderRadius: '50%',
          border: `2px solid ${p.accent}`, opacity: (1 - ring) * 0.55,
        }} />
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          transform: `translateY(${rise}px)`,
        }}>
          <div style={{transform: `scale(${mark})`, opacity: mark}}>
            <ProductMark name={p.name} size={168} accent={p.accent} accent2={p.accent2} spin />
          </div>
          <div style={{height: 34}} />
          <div style={{
            fontFamily: FONT, fontSize: 108, fontWeight: 800, letterSpacing: '-0.03em', color: '#F6F3FB',
            textShadow: `0 0 60px ${p.accent}66`,
          }}>
            {p.name}
          </div>
          <div style={{height: 22}} />
          <Chip color={p.accent}>{p.kicker}</Chip>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

// ── 2 · Problem hook (210f) ─────────────────────────────────────────────────
const Problem: React.FC<{p: Product}> = ({p}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const flash = spring({frame: f - 96, fps, config: {damping: 200}});
  const ringR = interpolate(f, [96, 150], [120, 900], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const ringO = interpolate(f, [96, 150], [0.5, 0], CLAMP);
  return (
    <SceneShell dur={210}>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', padding: '0 90px'}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, width: '100%'}}>
          <Chip color="rgba(255,255,255,0.45)" style={{marginBottom: 26}}>KENAPA?</Chip>
          <KineticText text={p.hookLines[0]} size={74} delay={8} color="rgba(238,233,246,0.85)" weight={800} />
          <KineticText text={p.hookLines[1]} size={74} delay={26} color="rgba(238,233,246,0.85)" weight={800} />
          <div style={{height: 40}} />
          {/* punch line */}
          <div style={{position: 'relative'}}>
            <div style={{
              position: 'absolute', left: '50%', top: '50%',
              width: ringR * 2, height: ringR * 2, marginLeft: -ringR, marginTop: -ringR,
              borderRadius: '50%', border: `3px solid ${p.accent}`, opacity: ringO,
            }} />
            <KineticText
              text={p.punch} size={92} delay={98} stagger={2.4}
              gradient={[p.accent, p.accent2]} glow={`${p.accent}AA`}
            />
            <div style={{opacity: flash * 0.25, position: 'absolute', inset: -80, pointerEvents: 'none',
              background: `radial-gradient(circle, ${p.accent}55, transparent 65%)`}} />
          </div>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

// ── 3 · UI showcase with camera rig (700f) ──────────────────────────────────
const Showcase: React.FC<{p: Product; UI: React.FC<{dur: number; accent: string}>}> = ({p, UI}) => {
  const f = useCurrentFrame();
  // camera: A → B → C with eased blends
  const b1 = interpolate(f, [218, 248], [0, 1], {...CLAMP, easing: IN_OUT_CUBIC});
  const b2 = interpolate(f, [452, 482], [0, 1], {...CLAMP, easing: IN_OUT_CUBIC});
  const focus = [p.phases[0].focus, p.phases[1].focus, p.phases[2].focus];
  const mix = (k: 'scale' | 'tx' | 'ty') =>
    b1 < 1 ? focus[0][k] + (focus[1][k] - focus[0][k]) * b1 : focus[1][k] + (focus[2][k] - focus[1][k]) * b2;
  const scale = mix('scale');
  const tx = mix('tx');
  const ty = mix('ty');
  const capOpacity = (i: number) => {
    if (i === 0) return interpolate(f, [-1, 8, 232, 252], [0, 1, 1, 0], CLAMP);
    if (i === 1) return interpolate(f, [232, 252, 452, 472], [0, 1, 1, 0], CLAMP);
    return interpolate(f, [452, 474], [0, 1], CLAMP);
  };
  return (
    <SceneShell dur={700}>
      <AbsoluteFill>
        {/* header */}
        <div style={{position: 'absolute', top: 172, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20}}>
          <div style={{position: 'relative', height: 58, width: 720}}>
            {p.phases.map((ph, i) => (
              <div key={i} style={{position: 'absolute', left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: capOpacity(i)}}>
                <Chip color={p.accent} filled={i === 2}>{ph.chip}</Chip>
              </div>
            ))}
          </div>
        </div>
        {/* device + camera */}
        <div style={{
          position: 'absolute', top: 320, left: 0, right: 0, bottom: 300,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          perspective: 1600,
        }}>
          <div style={{
            transform: `translateY(${Math.sin(f / 58) * 7}px) translate(${tx}px, ${ty}px) scale(${scale}) rotateX(${interpolate(f, [0, 20], [9, 0], {...CLAMP, easing: Easing.out(Easing.cubic)})}deg)`,
            transformOrigin: 'center center',
            willChange: 'transform',
          }}>
            <UI dur={700} accent={p.accent} />
          </div>
        </div>
        {/* caption */}
        <div style={{position: 'absolute', bottom: 218, left: 100, right: 100, textAlign: 'center', height: 100}}>
          {p.phases.map((ph, i) => (
            <div key={i} style={{
              position: 'absolute', left: 0, right: 0, opacity: capOpacity(i),
              fontFamily: FONT, fontSize: 34, fontWeight: 600, color: 'rgba(238,233,246,0.85)', lineHeight: 1.4,
              textShadow: '0 4px 30px rgba(0,0,0,0.7)',
            }}>
              {ph.caption}
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

// ── 4 · Features grid (400f) ────────────────────────────────────────────────
const Features: React.FC<{p: Product}> = ({p}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <SceneShell dur={400}>
      <AbsoluteFill style={{padding: '150px 84px 0', alignItems: 'center'}}>
        <KineticText text={`Kenapa ${p.name}?`} size={78} delay={4} gradient={[p.accent, p.accent2]} />
        <div style={{
          marginTop: 66, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, width: '100%',
        }}>
          {p.features.map((ft, i) => {
            const s = spring({frame: f - 22 - i * 12, fps, config: {damping: 16, stiffness: 130, mass: 0.8}});
            const float = Math.sin((f + i * 40) / 44) * 5;
            return (
              <div key={ft.title} style={{
                opacity: s, transform: `translateY(${(1 - s) * 60 + float}px) scale(${0.92 + s * 0.08})`,
              }}>
                <Glass accent={p.accent} style={{height: 372, padding: '34px 32px', display: 'flex', flexDirection: 'column'}}>
                  <div style={{
                    width: 74, height: 74, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: `linear-gradient(140deg, ${p.accent}33, ${p.accent}11)`,
                    border: `1.5px solid ${p.accent}55`,
                    boxShadow: `0 0 34px -8px ${p.accent}88`,
                  }}>
                    <Icon name={ft.icon} size={34} color={p.accent} stroke={2.1} />
                  </div>
                  <div style={{marginTop: 26, fontFamily: FONT, fontSize: 31, fontWeight: 800, color: '#F5F2FA', letterSpacing: '-0.01em'}}>
                    {ft.title}
                  </div>
                  <div style={{marginTop: 12, fontFamily: FONT, fontSize: 22.5, lineHeight: 1.45, color: 'rgba(230,224,240,0.62)', fontWeight: 500}}>
                    {ft.desc}
                  </div>
                </Glass>
              </div>
            );
          })}
        </div>
        <div style={{position: 'absolute', bottom: 128, left: 0, right: 0}}>
          <Marquee items={[p.name, p.kicker]} color={p.accent} />
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

// ── 5 · Stats (210f) ────────────────────────────────────────────────────────
const Stats: React.FC<{p: Product}> = ({p}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <SceneShell dur={210}>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', padding: '0 110px'}}>
        <div style={{width: '100%'}}>
          <KineticText text={`Angka yang bicara`} size={56} delay={2} color="rgba(238,233,246,0.75)" weight={700} align="left" />
          <div style={{height: 54}} />
          {p.stats.map((st, i) => {
            const s = spring({frame: f - 12 - i * 20, fps, config: {damping: 18, stiffness: 120}});
            const lineW = interpolate(f, [16 + i * 20, 46 + i * 20], [0, 1], CLAMP);
            return (
              <div key={st.label} style={{marginBottom: 44, opacity: s, transform: `translateX(${(1 - s) * -46}px)`}}>
                <div style={{display: 'flex', alignItems: 'baseline', gap: 14}}>
                  <span style={{
                    fontFamily: FONT, fontSize: 118, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1,
                    backgroundImage: `linear-gradient(100deg, ${p.accent}, ${p.accent2})`,
                    WebkitBackgroundClip: 'text', color: 'transparent',
                    textShadow: 'none',
                  }}>
                    <CountUp to={st.value} decimals={st.decimals ?? 0} start={12 + i * 20} dur={44} />
                    <span style={{fontSize: 58, letterSpacing: 0}}>{st.suffix}</span>
                  </span>
                </div>
                <div style={{
                  height: 2, width: `${lineW * 100}%`, marginTop: 16, marginBottom: 14,
                  background: `linear-gradient(90deg, ${p.accent}, transparent)`,
                }} />
                <div style={{fontFamily: FONT, fontSize: 28, color: 'rgba(230,224,240,0.66)', fontWeight: 500}}>
                  {st.label}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

// ── 6 · Outro (270f) ────────────────────────────────────────────────────────
const Outro: React.FC<{p: Product}> = ({p}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - 4, fps, config: {damping: 15, stiffness: 110, mass: 0.9}});
  const ringR = interpolate(f, [30, 100], [100, 1000], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const ringO = interpolate(f, [30, 100], [0.4, 0], CLAMP);
  const pulse = Math.sin(f / 9);
  return (
    <SceneShell dur={270}>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{
          position: 'absolute', width: ringR * 2, height: ringR * 2, borderRadius: '50%',
          border: `2px solid ${p.accent}`, opacity: ringO,
        }} />
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          transform: `scale(${0.8 + s * 0.2})`, opacity: s,
        }}>
          <ProductMark name={p.name} size={120} accent={p.accent} accent2={p.accent2} />
          <div style={{height: 30}} />
          <div style={{
            fontFamily: FONT, fontSize: 118, fontWeight: 800, letterSpacing: '-0.03em', color: '#F6F3FB',
            textShadow: `0 0 70px ${p.accent}77`,
          }}>
            {p.name}
          </div>
          <div style={{height: 22}} />
          <div style={{fontFamily: FONT, fontSize: 38, fontWeight: 600, color: 'rgba(238,233,246,0.8)', textAlign: 'center', lineHeight: 1.4}}>
            {p.tagline[0]}<br />{p.tagline[1]}
          </div>
          <div style={{height: 52}} />
          {/* CTA */}
          <div style={{
            fontFamily: MONO, fontSize: p.cta.length > 26 ? 27 : 34, fontWeight: 700, color: '#120A16',
            background: `linear-gradient(100deg, ${p.accent}, ${p.accent2})`,
            borderRadius: 999, padding: '26px 54px',
            boxShadow: `0 0 ${46 + pulse * 22}px -8px ${p.accent}CC`,
            transform: `scale(${1 + pulse * 0.014})`,
            display: 'flex', alignItems: 'center', gap: 16,
            maxWidth: 940,
          }}>
            <Icon name="zap" size={30} color="#120A16" stroke={2.6} />
            {p.cta}
          </div>
          <div style={{height: 26}} />
          <div style={{fontFamily: MONO, fontSize: 24, color: 'rgba(230,224,240,0.55)'}}>{p.handle}</div>
          <div style={{height: 44, width: 3, background: 'transparent'}} />
          <div style={{width: 340, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)'}} />
          <div style={{height: 30}} />
          <div style={{fontFamily: FONT, fontSize: 33, fontWeight: 700, color: 'rgba(240,235,248,0.9)'}}>
            {p.author}
          </div>
          <div style={{height: 12}} />
          <div style={{fontFamily: MONO, fontSize: 20, color: 'rgba(230,224,240,0.42)', letterSpacing: '0.08em'}}>
            Haslab-dev · dibuat dengan Hyperframe × Remotion
          </div>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

// ── Full ad ─────────────────────────────────────────────────────────────────
export const ProductAd: React.FC<{p: Product; UI: React.FC<{dur: number; accent: string}>}> = ({p, UI}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{backgroundColor: '#050408', fontFamily: FONT}}>
      <GradientField a={p.accent} b={p.accent2} seed={p.name.length} />
      <ParticleField color={p.accent} seed={p.name.length * 3} />
      <GridOverlay />
      <Series>
        <Series.Sequence durationInFrames={100}><LogoIntro p={p} /></Series.Sequence>
        <Series.Sequence durationInFrames={210}><Problem p={p} /></Series.Sequence>
        <Series.Sequence durationInFrames={700}><Showcase p={p} UI={UI} /></Series.Sequence>
        <Series.Sequence durationInFrames={400}><Features p={p} /></Series.Sequence>
        <Series.Sequence durationInFrames={210}><Stats p={p} /></Series.Sequence>
        <Series.Sequence durationInFrames={270}><Outro p={p} /></Series.Sequence>
      </Series>
      <Vignette />
      {/* progress hairline */}
      <div style={{
        position: 'absolute', bottom: 26, left: 90, right: 90, height: 5, borderRadius: 3,
        background: 'rgba(255,255,255,0.09)',
      }}>
        <div style={{
          height: '100%', borderRadius: 3,
          width: `${((f + 1) / DUR) * 100}%`,
          background: `linear-gradient(90deg, ${p.accent}, ${p.accent2})`,
          boxShadow: `0 0 14px ${p.accent}AA`,
        }} />
      </div>
      <Audio
        src={staticFile(`audio/${p.track}.wav`)}
        volume={(frame) =>
          interpolate(frame, [0, 24, DUR - 40, DUR - 4], [0, 0.85, 0.85, 0], CLAMP)
        }
      />
    </AbsoluteFill>
  );
};
