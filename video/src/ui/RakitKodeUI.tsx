// RakitKode UI (terminal-native showcase) — Go agent engine: embed, run, resume.
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {CLAMP, MONO, FONT} from '../hyperframe';
import {WindowFrame, RiseIn, UITimeCtx} from './atoms';
import {Icon} from './Icons';

const PHASES = 3;

const Line: React.FC<{t: number; at: number; children: React.ReactNode; d?: number}> = ({t, at, children, d = 7}) => {
  if (t < at) return <div style={{height: 21}}>&nbsp;</div>;
  const k = interpolate(t, [at, at + d], [0, 1], CLAMP);
  return <div style={{opacity: k, transform: `translateX(${(1 - k) * 10}px)`, height: 21}}>{children}</div>;
};

const Prompt: React.FC<{t: number; at: number; text: string; accent: string; cps?: number}> = ({t, at, text, accent, cps = 1.6}) => {
  const n = Math.round(interpolate(t, [at, at + text.length / cps], [0, text.length], CLAMP));
  return (
    <div style={{fontFamily: MONO, fontSize: 13.5, whiteSpace: 'pre'}}>
      <span style={{color: '#3DDC97'}}>➜ </span>
      <span style={{color: '#6A9BFF'}}>rakit </span>
      <span style={{color: '#EFE9F6'}}>{text.slice(0, n)}</span>
      <span style={{color: accent, opacity: Math.floor(t / 11) % 2 ? 0 : 1}}>▊</span>
    </div>
  );
};

const EmbedView: React.FC<{t: number; accent: string}> = ({t, accent}) => {
  const code: [string, string][][] = [
    [['import ', '#C792EA'], ['{ engine } ', '#EFE9F6'], ['from ', '#C792EA'], ['"github.com/Haslab-dev/RakitKode"', '#3DDC97']],
    [['', '#EFE9F6']],
    [['eng := ', '#EFE9F6'], ['engine.New', '#82AAFF'], ['(engine.Config{', '#EFE9F6']],
    [['  Provider: ', '#F5A524'], ['"claude"', '#3DDC97'], [',', '#EFE9F6']],
    [['  Skills:   ', '#F5A524'], ['rakit.SkillsFromHome()', '#82AAFF'], [',', '#EFE9F6']],
    [['  Tools:    ', '#F5A524'], ['rakit.DefaultTools()', '#82AAFF'], [',', '#EFE9F6']],
    [['})', '#EFE9F6']],
    [['', '#EFE9F6']],
    [['out, err := ', '#EFE9F6'], ['eng.Run', '#82AAFF'], ['(ctx, task)', '#EFE9F6']],
  ];
  const layers = ['agent', 'harness', 'tools', 'llm', 'mcp', 'skills', 'plugins', 'events'];
  return (
    <div style={{flex: 1, display: 'flex', gap: 0, minWidth: 0}}>
      <div style={{flex: 1.25, padding: '14px 8px 14px 18px', fontFamily: MONO, fontSize: 13, lineHeight: '21px'}}>
        {code.map((line, i) => (
          <Line key={i} t={t} at={6 + i * 8}>
            <span style={{width: 26, display: 'inline-block', textAlign: 'right', paddingRight: 12, color: 'rgba(230,224,240,0.25)'}}>{i + 1}</span>
            {line.map(([txt, col], j) => <span key={j} style={{color: col}}>{txt}</span>)}
            {i === Math.min(code.length - 1, Math.floor((t - 6) / 8)) ? (
              <span style={{color: accent, opacity: Math.floor(t / 10) % 2 ? 0 : 1}}>▊</span>
            ) : null}
          </Line>
        ))}
      </div>
      <div style={{
        width: 268, flexShrink: 0, borderLeft: '1px solid rgba(255,255,255,0.07)',
        padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        <div style={{fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', color: 'rgba(230,224,240,0.4)'}}>
          PUBLIC LAYERS
        </div>
        {layers.map((l, i) => (
          <RiseIn key={l} at={26 + i * 6} d={7} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px',
            borderRadius: 8, border: `1px solid ${accent}2E`, background: `${accent}0B`,
          }}>
            <div style={{width: 8, height: 8, borderRadius: 2, background: accent, boxShadow: `0 0 8px ${accent}`}} />
            <span style={{fontFamily: MONO, fontSize: 12, color: '#EFE9F6'}}>{l}</span>
            <span style={{marginLeft: 'auto', fontFamily: MONO, fontSize: 9, color: 'rgba(230,224,240,0.35)'}}>pkg/</span>
          </RiseIn>
        ))}
        <div style={{marginTop: 'auto', fontFamily: MONO, fontSize: 10, color: 'rgba(230,224,240,0.4)'}}>
          satu <span style={{color: accent}}>go get</span> — langsung embed
        </div>
      </div>
    </div>
  );
};

const RunView: React.FC<{t: number; accent: string}> = ({t, accent}) => {
  const steps: [string, string, string][] = [
    ['plan', 'dekomposisi → 4 subtask · approval mode: confirm', '#9F7CFA'],
    ['read', 'auth/session.go · auth/token.go', 'rgba(230,224,240,0.7)'],
    ['edit', 'auth/token.go +24 −9 · 2 hunk', accent],
    ['test', 'go test ./auth/ → ok · 1.8s', '#3DDC97'],
    ['diff', 'ringkasan: rotasi refresh token + revoke replay', 'rgba(230,224,240,0.7)'],
    ['done', '✔ selesai · 42 tool calls · 3,2s · $0,04', '#3DDC97'],
  ];
  return (
    <div style={{flex: 1, padding: '16px 20px', fontFamily: MONO, fontSize: 13.5, minWidth: 0}}>
      <Prompt t={t} at={2} text={'run "refactor auth ke refresh token" --json'} accent={accent} />
      <div style={{height: 10}} />
      {steps.map(([tag, txt, col], i) => (
        <Line key={tag} t={t} at={34 + i * 16}>
          <span style={{display: 'inline-block', width: 12, color: col}}>{i === 5 ? '' : '❯'}</span>
          <span style={{color: col, fontWeight: 700}}> {tag.padEnd(5, ' ')}</span>
          <span style={{color: 'rgba(240,235,248,0.82)'}}> {txt}</span>
        </Line>
      ))}
      {t > 34 && t < 34 + 5 * 16 + 8 ? (
        <div style={{marginTop: 2}}>
          <span style={{color: accent}}>{['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'][Math.floor(t / 4) % 10]}</span>
          <span style={{color: 'rgba(230,224,240,0.5)'}}> bekerja…</span>
        </div>
      ) : null}
      {t > 130 ? (
        <RiseIn at={132} style={{
          marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 8,
          border: '1px solid rgba(61,220,151,0.4)', background: 'rgba(61,220,151,0.1)',
          borderRadius: 9, padding: '7px 12px', fontFamily: MONO, fontSize: 12, color: '#3DDC97',
        }}>
          <Icon name="check" size={12} color="#3DDC97" /> diff siap review — lanjut commit?
        </RiseIn>
      ) : null}
    </div>
  );
};

const ResumeView: React.FC<{t: number; accent: string}> = ({t, accent}) => {
  const providers = [
    ['claude', 'sonnet 4.6', '#F5A524'],
    ['gpt', 'codex-max', '#3DDC97'],
    ['gemini', '2.5 pro', '#6A9BFF'],
    ['local', 'ollama/qwen3', '#9F7CFA'],
  ];
  return (
    <div style={{flex: 1, padding: '16px 20px', fontFamily: MONO, fontSize: 13.5, minWidth: 0}}>
      <Prompt t={t} at={2} text={'-c  lanjutkan sesi kemarin'} accent={accent} />
      <div style={{height: 8}} />
      <Line t={t} at={16}>
        <span style={{color: 'rgba(240,235,248,0.82)'}}>sesi <span style={{color: accent}}>a1f2-42</span> dipulihkan · 12 pesan · memori termuat ✓</span>
      </Line>
      <div style={{height: 12}} />
      <Prompt t={t} at={34} text={'run "selesaikan migrasi" --yolo'} accent={accent} />
      <div style={{height: 8}} />
      <Line t={t} at={62}><span style={{color: '#F5A524'}}>⚡ yolo</span><span style={{color: 'rgba(240,235,248,0.82)'}}> auto-approve — tanpa henti, 0 gate</span></Line>
      <Line t={t} at={78}><span style={{color: 'rgba(240,235,248,0.82)'}}>migrasi selesai · 9 file · semua tes hijau ✓</span></Line>
      <div style={{height: 16}} />
      <div style={{fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', color: 'rgba(230,224,240,0.4)', marginBottom: 8}}>
        MULTI-PROVIDER · DARI ~/.RAKIT
      </div>
      <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
        {providers.map(([n, m, c], i) => (
          <RiseIn key={n} at={96 + i * 8} style={{
            display: 'flex', alignItems: 'center', gap: 7, padding: '7px 12px', borderRadius: 9,
            border: `1px solid ${c}44`, background: `${c}10`,
          }}>
            <div style={{width: 8, height: 8, borderRadius: 4, background: c, boxShadow: `0 0 8px ${c}`}} />
            <span style={{fontSize: 12, color: '#EFE9F6', fontWeight: 700}}>{n}</span>
            <span style={{fontSize: 10, color: 'rgba(230,224,240,0.45)'}}>{m}</span>
          </RiseIn>
        ))}
      </div>
      <div style={{height: 16}} />
      <Line t={t} at={134}>
        <span style={{color: '#3DDC97'}}>➜ </span>
        <span style={{color: '#6A9BFF'}}>rakit </span>
        <span style={{color: '#EFE9F6'}}>import --from ~/.forge-ade</span>
      </Line>
      <Line t={t} at={150}>
        <span style={{color: 'rgba(240,235,248,0.82)'}}>profil · skill · mcp tersalin ✓ — <span style={{color: accent}}>satu otak, banyak wujud</span></span>
      </Line>
    </div>
  );
};

export const RakitKodeUI: React.FC<{dur: number; accent: string; fixed?: number}> = ({dur, accent, fixed}) => {
  const t = useCurrentFrame();
  const phaseLen = Math.round(dur / PHASES);
  const phase = fixed !== undefined ? fixed : Math.min(PHASES - 1, Math.floor(t / phaseLen));
  const tl = fixed !== undefined ? t : t - phase * phaseLen;
  return (
    <WindowFrame title="rakit — zsh · 80×24" accent={accent} w={860} h={520} badge="Go engine">
      <UITimeCtx.Provider value={tl}>
        {phase === 0 ? <EmbedView t={tl} accent={accent} /> : null}
        {phase === 1 ? <RunView t={tl} accent={accent} /> : null}
        {phase === 2 ? <ResumeView t={tl} accent={accent} /> : null}
      </UITimeCtx.Provider>
    </WindowFrame>
  );
};
