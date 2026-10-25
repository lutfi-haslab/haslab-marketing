// MixAd — "Satu Ekosistem": showreel gabungan keempat produk Haslab.
// 63s portrait: intro HASLAB → 4 segmen produk (kartu → momen UI terbaik →
// punch line) → grid ekosistem → outro. Total 1890 frame @30fps.
import React from 'react';
import {
  AbsoluteFill, Audio, interpolate, Series, spring, staticFile,
  useCurrentFrame, useVideoConfig,
} from 'remotion';
import {PRODUCTS, type Product} from '../brand';
import {
  CLAMP, Chip, FONT, GradientField, GridOverlay, KineticText, MONO, ParticleField,
  ProductMark, SceneShell, Vignette,
} from '../hyperframe';
import {ForgeADEUI} from '../ui/ForgeADEUI';
import {KendaliAIUI} from '../ui/KendaliAIUI';
import {RakitKodeUI} from '../ui/RakitKodeUI';
import {PanduJevUI} from '../ui/PanduJevUI';

const DUR = 1890;
const MIX: {p: Product; ui: React.FC<{dur: number; accent: string; fixed?: number}>; fixed: number; line: string; scale: number}[] = [
  {p: PRODUCTS.ForgeADE, ui: ForgeADEUI, fixed: 1, line: 'IDE native dengan agent otonom — dibangun untuk velocity.', scale: 1.16},
  {p: PRODUCTS.KendaliAI, ui: KendaliAIUI, fixed: 1, line: 'Agent pribadi berkarakter — terhubung tools & semua channel.', scale: 1.16},
  {p: PRODUCTS.RakitKode, ui: RakitKodeUI, fixed: 1, line: 'Engine agent coding dalam satu library Go — embed di mana saja.', scale: 1.2},
  {p: PRODUCTS.PanduJev, ui: PanduJevUI, fixed: 1, line: 'Refleks mikrodetik, 100% lokal — LLM memikirkan, Pandu memutuskan.', scale: 1.2},
];

// ── Intro (120f) ────────────────────────────────────────────────────────────
const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - 3, fps, config: {damping: 14, stiffness: 110, mass: 0.9}});
  const orbit = f * 0.9;
  const marks = [PRODUCTS.ForgeADE, PRODUCTS.KendaliAI, PRODUCTS.RakitKode, PRODUCTS.PanduJev];
  return (
    <SceneShell dur={120}>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{position: 'absolute', width: 720, height: 720, transform: `rotate(${orbit}deg)`, opacity: s * 0.4}}>
          {marks.map((m, i) => {
            const a = (i / 4) * Math.PI * 2;
            return (
              <div key={i} style={{
                position: 'absolute', left: 360 + Math.cos(a) * 330 - 27, top: 360 + Math.sin(a) * 330 - 27,
                transform: `rotate(${-orbit}deg)`,
              }}>
                <ProductMark name={m.name} size={54} accent={m.accent} accent2={m.accent2} />
              </div>
            );
          })}
        </div>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          transform: `scale(${0.85 + s * 0.15})`, opacity: s,
        }}>
          <div style={{
            width: 132, height: 132, borderRadius: '50%', background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 90px -10px rgba(232,85,111,0.5)',
          }}>
            <ProductMark name="ForgeADE" size={64} accent="#E8556F" accent2="#F5A524" spin />
          </div>
          <div style={{height: 30}} />
          <div style={{
            fontFamily: FONT, fontSize: 122, fontWeight: 800, letterSpacing: '0.04em', color: '#F6F3FB',
            textShadow: '0 0 70px rgba(232,85,111,0.45)',
          }}>
            HASLAB
          </div>
          <div style={{height: 20}} />
          <KineticText text="Empat produk AI. Satu ekosistem." size={44} delay={20} color="rgba(238,233,246,0.85)" weight={700} />
          <div style={{height: 26}} />
          <Chip color="#E8556F">by LUTFI IKBAL MAJID</Chip>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

// ── Product segment (396f each) ─────────────────────────────────────────────
const Segment: React.FC<{p: Product; UI: React.FC<{dur: number; accent: string; fixed?: number}>; fixed: number; line: string; scale: number}> = ({
  p, UI, fixed, line, scale,
}) => {
  const f = useCurrentFrame();
  const card = 96;
  const uiDur = 200;
  const lineStart = card + uiDur; // 296
  const inUI = f >= card && f < lineStart;
  const inLine = f >= lineStart;
  const k = Math.min(1, Math.max(0, (f - card - 6) / 16)) * Math.min(1, Math.max(0, (lineStart - 4 - f) / 14));
  return (
    <SceneShell dur={396}>
      <AbsoluteFill>
        {/* brand wash per product */}
        <AbsoluteFill style={{
          background: `radial-gradient(70% 46% at 50% ${f < card ? '38%' : '50%'}, ${p.accent}24 0%, transparent 70%)`,
          opacity: 1,
        }} />
        {/* card phase */}
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: f < card ? 1 : 0}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <ProductMark name={p.name} size={130} accent={p.accent} accent2={p.accent2} />
            <div style={{height: 26}} />
            <div style={{
              fontFamily: FONT, fontSize: 96, fontWeight: 800, letterSpacing: '-0.03em', color: '#F6F3FB',
              textShadow: `0 0 60px ${p.accent}66`,
            }}>
              {p.name}
            </div>
            <div style={{height: 18}} />
            <Chip color={p.accent}>{p.kicker}</Chip>
          </div>
        </AbsoluteFill>
        {/* UI phase */}
        <AbsoluteFill style={{
          alignItems: 'center', justifyContent: 'center',
          opacity: inUI ? k : 0,
        }}>
          <div style={{
            transform: `scale(${scale}) translateY(${Math.sin((f - card) / 30) * 6}px)`,
          }}>
            <UI dur={uiDur} accent={p.accent} fixed={fixed} />
          </div>
        </AbsoluteFill>
        {/* line phase */}
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', padding: '0 110px', opacity: inLine ? 1 : 0}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30}}>
            <ProductMark name={p.name} size={74} accent={p.accent} accent2={p.accent2} />
            <KineticText text={line} size={62} delay={lineStart + 4} stagger={2.2} weight={800} />
            <div style={{height: 8}} />
            <div style={{fontFamily: MONO, fontSize: 24, color: 'rgba(230,224,240,0.5)', opacity: f > lineStart + 20 ? 1 : 0}}>
              {p.handle}
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </SceneShell>
  );
};

// ── Ecosystem grid (96f) ────────────────────────────────────────────────────
const Eco: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <SceneShell dur={96}>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '38px 90px'}}>
          {MIX.map(({p}, i) => {
            const s = spring({frame: f - i * 7, fps, config: {damping: 16, stiffness: 130}});
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 22, opacity: s,
                transform: `translateY(${(1 - s) * 34}px)`,
              }}>
                <ProductMark name={p.name} size={62} accent={p.accent} accent2={p.accent2} />
                <div>
                  <div style={{fontFamily: FONT, fontSize: 40, fontWeight: 800, color: '#F6F3FB'}}>{p.name}</div>
                  <div style={{fontFamily: MONO, fontSize: 16.5, color: 'rgba(230,224,240,0.5)', marginTop: 3}}>{p.handle}</div>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

// ── Outro (90f) ─────────────────────────────────────────────────────────────
const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f, fps, config: {damping: 15, stiffness: 110}});
  return (
    <SceneShell dur={90}>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: s, transform: `scale(${0.9 + s * 0.1})`}}>
          <div style={{fontFamily: FONT, fontSize: 108, fontWeight: 800, letterSpacing: '0.04em', color: '#F6F3FB', textShadow: '0 0 70px rgba(232,85,111,0.5)'}}>
            HASLAB
          </div>
          <div style={{height: 16}} />
          <KineticText text="Dipakai sendiri. Dibagikan gratis." size={40} delay={10} color="rgba(238,233,246,0.8)" weight={600} />
          <div style={{height: 40}} />
          <div style={{
            fontFamily: MONO, fontSize: 27, fontWeight: 700, color: '#140A10',
            background: 'linear-gradient(100deg, #E8556F, #F5A524)',
            borderRadius: 999, padding: '22px 46px',
            boxShadow: '0 0 60px -10px rgba(232,85,111,0.8)',
            transform: `scale(${1 + Math.sin(f / 8) * 0.012})`,
          }}>
            github.com/Haslab-dev
          </div>
          <div style={{height: 38}} />
          <div style={{fontFamily: FONT, fontSize: 30, fontWeight: 700, color: 'rgba(240,235,248,0.9)'}}>
            by Lutfi Ikbal Majid
          </div>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

// ── Composition ─────────────────────────────────────────────────────────────
export const MixAd: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{backgroundColor: '#050408', fontFamily: FONT}}>
      <GradientField a="#E8556F" b="#9F7CFA" seed={9} intensity={0.85} />
      <ParticleField color="#E8556F" seed={17} />
      <GridOverlay />
      <Series>
        <Series.Sequence durationInFrames={120}><Intro /></Series.Sequence>
        {MIX.map(({p, ui, fixed, line, scale}) => (
          <Series.Sequence key={p.id} durationInFrames={396}>
            <Segment p={p} UI={ui} fixed={fixed} line={line} scale={scale} />
          </Series.Sequence>
        ))}
        <Series.Sequence durationInFrames={96}><Eco /></Series.Sequence>
        <Series.Sequence durationInFrames={90}><Outro /></Series.Sequence>
      </Series>
      <Vignette />
      <div style={{
        position: 'absolute', bottom: 26, left: 90, right: 90, height: 5, borderRadius: 3,
        background: 'rgba(255,255,255,0.09)',
      }}>
        <div style={{
          height: '100%', borderRadius: 3,
          width: `${((f + 1) / DUR) * 100}%`,
          background: 'linear-gradient(90deg, #E8556F, #9F7CFA, #3DDC97)',
          boxShadow: '0 0 14px rgba(232,85,111,0.8)',
        }} />
      </div>
      <Audio
        src={staticFile('audio/mix.wav')}
        volume={(frame) => interpolate(frame, [0, 24, DUR - 40, DUR - 4], [0, 0.85, 0.85, 0], CLAMP)}
      />
    </AbsoluteFill>
  );
};
