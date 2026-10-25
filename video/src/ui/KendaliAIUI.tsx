// KendaliAI UI clone — port 1:1 dari web app asli (screenshots localhost:5173):
// AgentRail dengan avatar karakter, chat home "What should we do in Fatima?",
// percakapan dengan bubble biru + kartu hasil putih, composer chips, FAB.
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {CLAMP, FONT, MONO, SparkMark} from '../hyperframe';
import {WindowFrame, RiseIn, ComposerChips, FaceAvatar, UITimeCtx} from './atoms';
import {Icon} from './Icons';

const PHASES = 3;
const BG = '#131118';
const BG2 = '#1A1820';
const LINE = 'rgba(255,255,255,0.07)';
const TXT = '#ECEAF2';
const MUT = 'rgba(230,224,240,0.55)';
const FNT = 'rgba(230,224,240,0.35)';
const PINK = '#E8556F';

const Rail: React.FC<{t: number; active: number}> = ({t, active}) => (
  <div style={{
    width: 62, flexShrink: 0, borderRight: `1px solid ${LINE}`, background: BG,
    display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '14px 0', gap: 12,
  }}>
    <SparkMark size={24} colorA="#E8556F" colorB="#F08A9E" glow={false} />
    <div style={{display: 'flex', flexDirection: 'column', gap: 13, alignItems: 'center', paddingTop: 4}}>
      {(['astro', 'ghost', 'girl', 'bot'] as const).map((k, i) => (
        <RiseIn key={k} at={4 + i * 4} d={7}>
          <FaceAvatar kind={k} size={34} ring={i === active ? PINK : undefined} dot={i === active} />
        </RiseIn>
      ))}
      <RiseIn at={22} d={7} style={{
        width: 32, height: 32, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '1px dashed rgba(255,255,255,0.22)', color: MUT, fontSize: 15,
      }}>+</RiseIn>
    </div>
    <div style={{marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center'}}>
      <RiseIn at={30}><Icon name="newspaper" size={16} color={MUT} stroke={2} /></RiseIn>
      <RiseIn at={32}><Icon name="users" size={16} color={MUT} stroke={2} /></RiseIn>
      <RiseIn at={34}><Icon name="wrench" size={15} color={MUT} stroke={2} /></RiseIn>
      <RiseIn at={36}><Icon name="gear" size={16} color={MUT} stroke={2} /></RiseIn>
    </div>
  </div>
);

const TopRight: React.FC = () => (
  <div style={{position: 'absolute', top: 12, right: 14, display: 'flex', alignItems: 'center', gap: 12, zIndex: 5}}>
    <Icon name="dots" size={15} color={MUT} />
    <span style={{display: 'flex', alignItems: 'center', gap: 6, border: `1px solid ${LINE}`, borderRadius: 999, padding: '3px 9px', background: 'rgba(255,255,255,0.03)'}}>
      <span style={{width: 8, height: 8, borderRadius: 4, background: PINK, boxShadow: `0 0 6px ${PINK}`}} />
      <span style={{fontSize: 11, color: MUT}}>agnes-2-5</span>
      <Icon name="chevron" size={9} color={FNT} stroke={2.6} />
    </span>
    <Icon name="burger" size={15} color={MUT} stroke={2.2} />
  </div>
);

const Home: React.FC<{t: number}> = ({t}) => {
  const prompt = 'Cek agenda dan jadwal saya hari ini di Google Calendar';
  const n = Math.round(interpolate(t, [10, 64], [0, prompt.length], CLAMP));
  return (
    <div style={{flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 40px'}}>
      <TopRight />
      <FaceAvatar kind="girl" size={78} />
      <div style={{
        marginTop: 9, background: '#26242E', borderRadius: 10, padding: '4px 13px',
        fontSize: 12, fontWeight: 700, color: TXT,
      }}>Fatima</div>
      <div style={{textAlign: 'center', color: '#F7F6FB', fontWeight: 700, fontSize: 21, marginTop: 16, letterSpacing: '-0.01em'}}>
        What should we do in <span style={{borderBottom: '2px dotted rgba(236,234,242,0.45)'}}>Fatima</span>?
      </div>
      <div style={{
        marginTop: 18, width: 'min(620px, 92%)', borderRadius: 18,
        border: `1px solid ${t > 6 && t < 68 ? 'rgba(232,85,111,0.45)' : LINE}`,
        background: BG2, padding: '9px 14px 11px',
        boxShadow: t > 6 && t < 68 ? '0 0 34px -8px rgba(232,85,111,0.4)' : '0 10px 30px -18px rgba(0,0,0,0.9)',
      }}>
        <div style={{display: 'flex', alignItems: 'center', gap: 7, paddingBottom: 8, borderBottom: `1px solid ${LINE}`}}>
          <FaceAvatar kind="girl" size={18} />
          <span style={{fontSize: 11.5, fontWeight: 700, color: 'rgba(236,234,242,0.9)'}}>Fatima</span>
          <Icon name="chevron" size={9} color={FNT} stroke={2.6} />
        </div>
        <div style={{fontFamily: FONT, fontSize: 13.5, color: '#EFEAF4', padding: '10px 0 13px', minHeight: 19}}>
          {prompt.slice(0, n)}
          {t < 68 ? <span style={{color: PINK, opacity: Math.floor(t / 12) % 2 ? 0 : 1}}>▏</span> : null}
        </div>
        <ComposerChips
          engineIcon={<SparkMark size={13} colorA="#E8556F" colorB="#F5A524" glow={false} />}
          engineLabel="Rakit Kode"
          model="agnes-2-5-flash:fr…"
        />
      </div>
    </div>
  );
};

const Chat: React.FC<{t: number}> = ({t}) => {
  const reply = [
    'Sudah saya cek — hasilnya kosong. Tidak ada satu pun event di Google Calendar kamu',
    'lutfiikbalmajid2@gmail.com, timezone Asia/Jakarta, untuk hari ini 00:00–23:59 WIB.',
    'Artinya hari ini benar-benar terbuka — posisi bagus untuk deep work atau review materi.',
  ];
  return (
    <div style={{flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', minWidth: 0, padding: '0 0 12px'}}>
      <TopRight />
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 10}}>
        <FaceAvatar kind="girl" size={40} />
        <div style={{fontSize: 12, fontWeight: 700, color: TXT, marginTop: 5}}>Fatima</div>
        <div style={{fontFamily: FONT, fontSize: 10, color: FNT}}>Oct 25, 12:26 AM</div>
      </div>
      <div style={{flex: 1, width: 'min(560px, 88%)', margin: '12px auto 0', overflow: 'hidden'}}>
        <RiseIn at={8} style={{display: 'flex', justifyContent: 'flex-end'}}>
          <div style={{
            background: '#2E6BF6', borderRadius: 16, padding: '9px 14px', fontSize: 12.5,
            color: '#fff', maxWidth: '74%', fontWeight: 600,
          }}>
            Cek agenda dan jadwal saya hari ini di Google Calendar
          </div>
        </RiseIn>
        <RiseIn at={20} style={{marginTop: 14, display: 'flex', alignItems: 'center', gap: 7}}>
          <span style={{fontSize: 11.5, color: MUT}}>Worked for 2s</span>
          <Icon name="chevron" size={9} color={FNT} stroke={2.6} />
        </RiseIn>
        <div style={{marginTop: 9}}>
          {reply.map((line, i) => {
            if (t < 30 + i * 10) return null;
            const k = interpolate(t, [30 + i * 10, 38 + i * 10], [0, 1], CLAMP);
            return (
              <div key={i} style={{
                fontSize: 12.5, color: 'rgba(238,235,244,0.9)', lineHeight: 1.65, opacity: k,
              }}>
                {i === 1
                  ? <>tersambung ke <span style={{textDecoration: 'underline', color: '#9DB8FF'}}>lutfiikbalmajid2@gmail.com</span>, timezone Asia/Jakarta, untuk hari ini 00:00–23:59 WIB.</>
                  : line}
              </div>
            );
          })}
        </div>
        <RiseIn at={64} style={{
          marginTop: 13, background: '#FFFFFF', borderRadius: 13, padding: '12px 14px',
          boxShadow: '0 20px 50px -20px rgba(0,0,0,0.7)',
        }}>
          <div style={{fontSize: 13, fontWeight: 800, color: '#141218'}}>Agenda Hari Ini</div>
          <div style={{fontSize: 10.5, color: 'rgba(20,18,24,0.55)', marginTop: 2}}>Minggu, 25 Oktober 2026 · WIB</div>
          <div style={{fontSize: 11.5, color: 'rgba(20,18,24,0.8)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 7}}>
            Event terjadwal <span style={{fontFamily: MONO, fontWeight: 700}}>0</span>
          </div>
          <div style={{fontSize: 11, color: 'rgba(20,18,24,0.75)', marginTop: 7, fontFamily: FONT}}>
            Rentang dicek: 00:00 – 23:59 WIB · Kalender: lutfiikbalmajid2@gmail.com
          </div>
          <span style={{
            display: 'inline-block', marginTop: 9, background: '#DFF5E9', color: '#1E7F4F',
            fontSize: 10.5, fontWeight: 700, borderRadius: 7, padding: '3px 9px',
          }}>Hari sepenuhnya terbuka</span>
        </RiseIn>
      </div>
      <div style={{width: 'min(560px, 88%)', margin: '12px auto 0', borderRadius: 16, border: `1px solid ${LINE}`, background: BG2, padding: '9px 14px 11px'}}>
        <div style={{fontSize: 12.5, color: FNT, paddingBottom: 8}}>Ask for follow-up changes</div>
        <ComposerChips
          engineIcon={<SparkMark size={13} colorA="#E8556F" colorB="#F5A524" glow={false} />}
          engineLabel="Rakit Kode"
          model="deepseek-v4-1-flash"
        />
      </div>
    </div>
  );
};

const Roster: React.FC<{t: number}> = ({t}) => {
  const people: {k: 'astro' | 'ghost' | 'girl' | 'bot'; n: string; r: string}[] = [
    {k: 'astro', n: 'Astra', r: 'planner'},
    {k: 'ghost', n: 'Kira', r: 'researcher'},
    {k: 'girl', n: 'Fatima', r: 'asisten pribadi · calendar & agenda'},
    {k: 'bot', n: 'Ops', r: 'operator · scheduler'},
  ];
  return (
    <div style={{position: 'absolute', inset: 0, background: 'rgba(19,17,24,0.72)', zIndex: 4}}>
      {people.map((p, i) => (
        <RiseIn key={p.n} at={6 + i * 10} style={{
          position: 'absolute', left: 84, top: 78 + i * 62,
          display: 'flex', alignItems: 'center', gap: 11,
          background: 'rgba(30,28,38,0.97)', border: `1px solid ${i === 2 ? 'rgba(232,85,111,0.5)' : LINE}`,
          borderRadius: 13, padding: '9px 14px 9px 10px', boxShadow: '0 18px 44px -18px rgba(0,0,0,0.8)',
        }}>
          <FaceAvatar kind={p.k} size={30} ring={i === 2 ? PINK : undefined} />
          <div>
            <div style={{fontSize: 13, fontWeight: 800, color: TXT}}>{p.n}</div>
            <div style={{fontSize: 10.5, fontFamily: FONT, color: MUT}}>{p.r}</div>
          </div>
        </RiseIn>
      ))}
      <RiseIn at={52} style={{
        position: 'absolute', left: 84, top: 78 + 4 * 62 + 8,
        display: 'flex', alignItems: 'center', gap: 9, fontSize: 12, color: 'rgba(238,235,244,0.85)',
      }}>
        <Icon name="plus" size={13} color={MUT} stroke={2.2} /> Buat agent baru
      </RiseIn>
      <RiseIn at={62} style={{
        position: 'absolute', right: 26, bottom: 30, width: 46, height: 46, borderRadius: 23,
        background: '#26242E', border: '1px solid rgba(255,255,255,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 16px 40px -14px rgba(0,0,0,0.9)',
      }}>
        <FaceAvatar kind="ghost" size={30} />
      </RiseIn>
    </div>
  );
};

export const KendaliAIUI: React.FC<{dur: number; accent: string; fixed?: number}> = ({dur, accent, fixed}) => {
  const t = useCurrentFrame();
  const phaseLen = Math.round(dur / PHASES);
  const phase = fixed !== undefined ? fixed : Math.min(PHASES - 1, Math.floor(t / phaseLen));
  const tl = fixed !== undefined ? t : t - phase * phaseLen;
  return (
    <WindowFrame title="KendaliAI" accent={accent} w={940} h={600} bare>
      <UITimeCtx.Provider value={tl}>
        <div style={{flex: 1, display: 'flex', minHeight: 0, position: 'relative'}}>
          <Rail t={tl} active={phase === 0 ? 2 : 2} />
          {phase === 0 ? <Home t={tl} /> : null}
          {phase === 1 ? <Chat t={tl} /> : null}
          {phase === 2 ? (
            <>
              <Home t={999} />
              <Roster t={tl} />
            </>
          ) : null}
        </div>
      </UITimeCtx.Provider>
    </WindowFrame>
  );
};
