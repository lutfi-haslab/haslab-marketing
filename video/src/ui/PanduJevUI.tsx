// PanduJev UI (research showcase) — frozen LLM intent → µs policy reflex →
// calibrated uncertainty. GridWorld closed-loop visualization.
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {CLAMP, MONO, FONT} from '../hyperframe';
import {WindowFrame, RiseIn, Bar, UITimeCtx} from './atoms';
import {Icon} from './Icons';

const PHASES = 3;

const IntentView: React.FC<{t: number; accent: string}> = ({t, accent}) => {
  const intent = '{ "goal": "collect", "avoid": ["enemy"], "horizon": 8 }';
  const n = Math.round(interpolate(t, [58, 96], [0, intent.length], CLAMP));
  return (
    <div style={{flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0}}>
      <RiseIn at={2} style={{
        alignSelf: 'flex-end', maxWidth: '78%', borderRadius: '14px 14px 4px 14px',
        background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
        padding: '9px 14px', fontSize: 13, color: '#EFE9F6', fontFamily: FONT,
      }}>
        “kejar koin, hindari musuh — jangan sampai Terverifikasi gagal”
      </RiseIn>
      <RiseIn at={16} style={{
        display: 'flex', alignItems: 'center', gap: 9, borderRadius: 12,
        border: '1px solid rgba(154,124,250,0.35)', background: 'rgba(154,124,250,0.08)', padding: '11px 14px',
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg,#9A7CFA,#6A9BFF)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, color: '#0D0A16',
        }}>L</div>
        <div>
          <div style={{fontSize: 12.5, fontWeight: 800, color: '#F2EDF8'}}>SmolLM2 · beku (frozen)</div>
          <div style={{fontSize: 11, fontFamily: MONO, color: 'rgba(230,224,240,0.5)'}}>
            {t < 16 ? 'memikirkan maksud…' : 'maksud dipahami — sekali, di awal'}
          </div>
        </div>
        <span style={{marginLeft: 'auto', fontSize: 10, fontFamily: MONO, color: '#9A7CFA'}}>~300ms · offline</span>
      </RiseIn>
      <div style={{display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center'}}>
        <div style={{height: 1, flex: 1, background: 'linear-gradient(90deg, transparent, rgba(154,124,250,0.5))'}} />
        <span style={{fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', color: '#9A7CFA'}}>CANONICAL INTENT PROTOCOL</span>
        <div style={{height: 1, flex: 1, background: 'linear-gradient(90deg, rgba(154,124,250,0.5), transparent)'}} />
      </div>
      <div style={{
        borderRadius: 12, border: `1px solid ${accent}44`, background: 'rgba(0,0,0,0.3)',
        padding: '12px 16px', fontFamily: MONO, fontSize: 13, color: accent, minHeight: 24, lineHeight: '20px',
      }}>
        {intent.slice(0, n)}
        {t >= 58 && n < intent.length ? <span style={{opacity: Math.floor(t / 10) % 2 ? 0 : 1}}>▊</span> : null}
      </div>
      <RiseIn at={104} style={{display: 'flex', gap: 10}}>
        {[
          ['intent', 'sekali · di awal'],
          ['refleks', 'berulang · tiap langkah'],
          ['kontrol', 'milik policy network'],
        ].map(([a, b]) => (
          <div key={a} style={{
            flex: 1, textAlign: 'center', borderRadius: 10, padding: '8px 6px',
            border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)',
          }}>
            <div style={{fontSize: 11, fontWeight: 800, color: '#F2EDF8'}}>{a}</div>
            <div style={{fontSize: 9.5, fontFamily: MONO, color: 'rgba(230,224,240,0.45)', marginTop: 2}}>{b}</div>
          </div>
        ))}
      </RiseIn>
      <RiseIn at={122} style={{
        marginTop: 'auto', fontSize: 15, fontWeight: 700, color: 'rgba(240,235,248,0.9)', textAlign: 'center', fontFamily: FONT,
      }}>
        “The LLM thinks about what is meant.{' '}
        <span style={{color: accent}}>Pandu decides what to do right now.</span>”
      </RiseIn>
    </div>
  );
};

const GRID = 8;
const PATH: [number, number][] = [
  [1, 6], [2, 6], [3, 5], [3, 4], [4, 4], [5, 3], [5, 2], [6, 2], [6, 1],
];
const WALLS = new Set(['2,4', '4,2', '4,6', '6,4', '1,2', '5,5', '3,1', '7,6']);
const COINS = ['1,4', '3,3', '5,1', '6,3'];

const ReflexView: React.FC<{t: number; accent: string}> = ({t, accent}) => {
  const step = Math.min(PATH.length - 1, Math.floor(interpolate(t, [30, 175], [0, PATH.length - 1], CLAMP)));
  const pos = PATH[step];
  const us = (17.3 + 4.2 * Math.abs(Math.sin(t / 21))).toFixed(1);
  return (
    <div style={{flex: 1, padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0}}>
      <div style={{display: 'flex', gap: 12, alignItems: 'stretch'}}>
        <div style={{
          width: 318, flexShrink: 0, borderRadius: 14, overflow: 'hidden',
          border: `1px solid ${accent}44`, background: 'rgba(0,0,0,0.3)', padding: 10,
        }}>
          <div style={{display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8}}>
            <Icon name="box" size={12} color={accent} />
            <span style={{fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', color: accent}}>GRIDWORLD · CLOSED-LOOP</span>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: `repeat(${GRID}, 1fr)`, gap: 4}}>
            {Array.from({length: GRID * GRID}, (_, idx) => {
              const cx = idx % GRID, cy = Math.floor(idx / GRID);
              const isWall = WALLS.has(`${cx},${cy}`);
              const isCoin = COINS.includes(`${cx},${cy}`) && !PATH.slice(0, step + 1).some(([px, py]) => px === cx && py === cy);
              const isAgent = pos[0] === cx && pos[1] === cy;
              const onPath = PATH.slice(0, step).some(([px, py]) => px === cx && py === cy);
              return (
                <div key={idx} style={{
                  paddingTop: '100%', position: 'relative',
                  borderRadius: 5,
                  background: isWall ? 'rgba(255,255,255,0.1)' : onPath ? `${accent}26` : 'rgba(255,255,255,0.035)',
                  border: onPath ? `1px solid ${accent}55` : '1px solid rgba(255,255,255,0.04)',
                }}>
                  {isAgent ? (
                    <div style={{
                      position: 'absolute', inset: '12%',
                      borderRadius: 6, background: `linear-gradient(135deg, ${accent}, #38B6FF)`,
                      boxShadow: `0 0 16px ${accent}`, transform: `scale(${1 + 0.1 * Math.sin(t / 5)})`,
                    }} />
                  ) : isCoin ? (
                    <div style={{
                      position: 'absolute', inset: '30%', borderRadius: '50%',
                      background: '#F5C542', boxShadow: '0 0 10px #F5C54288',
                      transform: `scale(${0.85 + 0.15 * Math.sin(t / 8)})`,
                    }} />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 9, minWidth: 0}}>
          <div style={{
            borderRadius: 12, border: `1px solid ${accent}55`, background: `${accent}0F`, padding: '12px 14px',
          }}>
            <div style={{fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', color: accent, marginBottom: 4}}>
              WAKTU KEPUTUSAN
            </div>
            <div style={{fontFamily: FONT, fontSize: 44, fontWeight: 800, color: '#F2EDF8', lineHeight: 1}}>
              {us}<span style={{fontSize: 20, color: accent}}> µs</span>
            </div>
            <div style={{fontSize: 10, fontFamily: MONO, color: 'rgba(230,224,240,0.45)', marginTop: 4}}>
              4.980 parameter · 19 KB · tanpa GPU
            </div>
          </div>
          {[
            ['observasi', 'posisi · koin · ancaman', '#38B6FF'],
            ['forward pass', '1 layer · 17–24 µs', accent],
            ['aksi', '↑ → ↓ ← · deterministik', '#F5C542'],
          ].map(([a, b, c], i) => (
            <RiseIn key={a} at={26 + i * 12} style={{
              display: 'flex', alignItems: 'center', gap: 9, borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', padding: '8px 12px',
            }}>
              <div style={{width: 8, height: 8, borderRadius: 2, background: c, boxShadow: `0 0 8px ${c}`}} />
              <span style={{fontSize: 11.5, fontWeight: 700, color: '#F2EDF8'}}>{a}</span>
              <span style={{marginLeft: 'auto', fontSize: 9.5, fontFamily: MONO, color: 'rgba(230,224,240,0.45)'}}>{b}</span>
            </RiseIn>
          ))}
          <div style={{marginTop: 'auto', fontSize: 11, fontFamily: MONO, color: 'rgba(230,224,240,0.5)'}}>
            koin terkumpul: <span style={{color: accent, fontWeight: 700}}>{step}</span>/4 · langkah tanpa tabrakan: <span style={{color: accent, fontWeight: 700}}>{step}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const CalibView: React.FC<{t: number; accent: string}> = ({t, accent}) => (
  <div style={{flex: 1, padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: 11, minWidth: 0}}>
    <div style={{fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', color: 'rgba(230,224,240,0.4)'}}>
      UNCERTAINTY CALIBRATION · 5 SEED
    </div>
    {[
      ['ECE (confidence error)', '0.86%', 0.05, 'semakin kecil semakin jujur'],
      ['AUROC (kapan ragu)', '0.952', 0.95, 'hampir selalu tahu batasnya'],
      ['Refleks p99', '24 µs', 0.9, 'di bawah satu frame game 60fps'],
    ].map(([label, val, frac, note], i) => (
      <RiseIn key={label as string} at={4 + i * 12} style={{
        borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', padding: '10px 14px',
      }}>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 8}}>
          <span style={{fontSize: 12, fontWeight: 700, color: 'rgba(240,235,248,0.9)'}}>{label}</span>
          <span style={{marginLeft: 'auto', fontSize: 18, fontWeight: 800, color: accent, fontFamily: FONT}}>{val}</span>
        </div>
        <div style={{margin: '7px 0 4px'}}>
          <Bar w="100%" accent={accent} at={10 + i * 12} h={5} />
        </div>
        <div style={{fontSize: 9.5, fontFamily: MONO, color: 'rgba(230,224,240,0.4)'}}>{note}</div>
      </RiseIn>
    ))}
    <div style={{display: 'flex', gap: 10, marginTop: 2}}>
      {[
        ['Chess Arena', '2048 game mandiri'],
        ['Snake RL', 'closed-loop 60fps'],
        ['Racing', 'A* expert clone'],
      ].map(([a, b], i) => (
        <RiseIn key={a} at={48 + i * 9} style={{
          flex: 1, borderRadius: 11, padding: '10px 10px',
          border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.25)', textAlign: 'center',
        }}>
          <div style={{fontSize: 11.5, fontWeight: 800, color: '#F2EDF8'}}>{a}</div>
          <div style={{fontSize: 9.5, fontFamily: MONO, color: 'rgba(230,224,240,0.45)', marginTop: 3}}>{b}</div>
          <div style={{
            margin: '8px auto 0', width: 26, height: 4, borderRadius: 2,
            background: i === 0 ? accent : i === 1 ? '#38B6FF' : '#F5C542',
            boxShadow: `0 0 8px ${accent}`,
          }} />
        </RiseIn>
      ))}
    </div>
    <RiseIn at={80} style={{
      marginTop: 'auto', borderRadius: 12, padding: '12px 16px',
      border: `1px solid ${accent}44`, background: `${accent}0D`,
      fontSize: 13.5, color: '#F2EDF8', fontFamily: FONT, textAlign: 'center',
    }}>
      <span style={{color: accent, fontWeight: 800}}>Zero-API.</span> Pikir mahal hanya saat perlu — sisanya refleks lokal.
    </RiseIn>
  </div>
);

export const PanduJevUI: React.FC<{dur: number; accent: string; fixed?: number}> = ({dur, accent, fixed}) => {
  const t = useCurrentFrame();
  const phaseLen = Math.round(dur / PHASES);
  const phase = fixed !== undefined ? fixed : Math.min(PHASES - 1, Math.floor(t / phaseLen));
  const tl = fixed !== undefined ? t : t - phase * phaseLen;
  return (
    <WindowFrame title="pandu-jev — research console" accent={accent} w={860} h={520} badge="lokal · 0 API">
      <UITimeCtx.Provider value={tl}>
        {phase === 0 ? <IntentView t={tl} accent={accent} /> : null}
        {phase === 1 ? <ReflexView t={tl} accent={accent} /> : null}
        {phase === 2 ? <CalibView t={tl} accent={accent} /> : null}
      </UITimeCtx.Provider>
    </WindowFrame>
  );
};
