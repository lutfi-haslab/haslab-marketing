// ForgeADE UI clone — port 1:1 dari app native asli (screenshots v1.0.0 #49):
// sidebar New task/Projects tree, agent home + composer chips, task run dengan
// floating "Runtime & Tasks" panel + sub-agents, dan editor native (explorer,
// tabs, minimap, status bar).
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {CLAMP, FONT, MONO, SparkMark} from '../hyperframe';
import {WindowFrame, RiseIn, ComposerChips, GemIcon, UITimeCtx} from './atoms';
import {Icon} from './Icons';

const PHASES = 3;
const BG = '#131118';
const BG2 = '#17151C';
const LINE = 'rgba(255,255,255,0.07)';
const TXT = '#ECEAF2';
const MUT = 'rgba(230,224,240,0.55)';
const FNT = 'rgba(230,224,240,0.35)';

const NavRow: React.FC<{icon: React.ReactNode; label: string; kbd?: string; at: number}> = ({icon, label, kbd, at}) => (
  <RiseIn at={at} d={7} style={{display: 'flex', alignItems: 'center', gap: 10, padding: '7px 9px', borderRadius: 8}}>
    {icon}
    <span style={{fontSize: 13, fontWeight: 600, color: TXT}}>{label}</span>
    {kbd ? <span style={{marginLeft: 'auto', fontFamily: MONO, fontSize: 10.5, color: FNT}}>{kbd}</span> : null}
  </RiseIn>
);

const TaskRow: React.FC<{name: string; time: string; gem: [string, string]; at: number; sel?: boolean}> = ({name, time, gem, at, sel}) => (
  <RiseIn at={at} d={7} style={{
    display: 'flex', alignItems: 'center', gap: 8, padding: '5.5px 8px 5.5px 26px', borderRadius: 8,
    background: sel ? 'rgba(255,255,255,0.06)' : 'transparent',
  }}>
    <GemIcon from={gem[0]} to={gem[1]} />
    <span style={{fontSize: 12, color: 'rgba(236,234,242,0.85)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1}}>{name}</span>
    <span style={{fontSize: 10, color: FNT, fontFamily: FONT}}>{time}</span>
  </RiseIn>
);

const FolderRow: React.FC<{label: string; at: number}> = ({label, at}) => (
  <RiseIn at={at} d={7} style={{display: 'flex', alignItems: 'center', gap: 7, padding: '6px 8px 4px'}}>
    <Icon name="chevron" size={9} color={FNT} stroke={2.6} />
    <Icon name="folder" size={13} color={MUT} stroke={2} />
    <span style={{fontSize: 12.5, fontWeight: 700, color: TXT}}>{label}</span>
  </RiseIn>
);

const Sidebar: React.FC = () => (
  <div style={{
    width: 240, flexShrink: 0, borderRight: `1px solid ${LINE}`, background: BG,
    display: 'flex', flexDirection: 'column', padding: '10px 8px 8px', overflow: 'hidden',
  }}>
    <div style={{display: 'flex', alignItems: 'center', gap: 8, padding: '2px 6px 10px'}}>
      {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
        <div key={c} style={{width: 11, height: 11, borderRadius: '50%', background: c}} />
      ))}
      <Icon name="sidebarToggle" size={13} color={MUT} stroke={2} />
    </div>
    <NavRow at={2} icon={<Icon name="plus" size={14} color={MUT} stroke={2.2} />} label="New task" kbd="⌘N" />
    <NavRow at={4} icon={<Icon name="search" size={14} color={MUT} stroke={2.2} />} label="Search" kbd="⌘K" />
    <NavRow at={6} icon={<Icon name="calendar" size={14} color={MUT} stroke={2} />} label="Automations" />
    <NavRow at={8} icon={<Icon name="board" size={14} color={MUT} stroke={2} />} label="Board" />
    <NavRow at={10} icon={<Icon name="git" size={14} color={MUT} stroke={2.2} />} label="Git Client" />
    <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '10px 9px 8px'}}>
      <Icon name="funnel" size={12} color={MUT} stroke={2} />
      <span style={{flex: 1}} />
      <Icon name="trash" size={12} color={FNT} stroke={2} />
      <Icon name="pin" size={12} color={FNT} stroke={2} />
    </div>
    <div style={{
      margin: '0 4px 8px', padding: '7px 10px', borderRadius: 8, fontSize: 12, color: FNT,
      border: `1px solid ${LINE}`, display: 'flex', alignItems: 'center', gap: 7,
    }}>
      <Icon name="search" size={11} color={FNT} stroke={2.2} /> Search tasks...
    </div>
    <div style={{display: 'flex', gap: 2, padding: '0 4px 6px'}}>
      {['Active', 'Pinned', 'Snoozed', 'Archived'].map((c, i) => (
        <div key={c} style={{
          fontSize: 11, fontWeight: 600, padding: '4px 9px', borderRadius: 999,
          background: i === 0 ? 'rgba(255,255,255,0.1)' : 'transparent',
          color: i === 0 ? TXT : MUT,
        }}>{c}</div>
      ))}
    </div>
    <div style={{fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', color: FNT, padding: '4px 10px 4px'}}>
      PROJECTS
    </div>
    <div style={{minHeight: 0, overflow: 'hidden'}}>
      <FolderRow at={12} label="General" />
      <TaskRow at={14} name="Hi there" time="4d" gem={['#4CC3F0', '#2E7CD6']} />
      <TaskRow at={16} name="5-slide pitch deck for…" time="6d" gem={['#7C6AF0', '#4E3FB8']} />
      <TaskRow at={18} name="Buatkan task baru di…" time="6d" gem={['#7C6AF0', '#4E3FB8']} />
      <TaskRow at={20} name="Hi" time="7d" gem={['#7C6AF0', '#4E3FB8']} />
      <TaskRow at={22} name="Explore my codebase" time="12d" gem={['#7C6AF0', '#4E3FB8']} />
      <RiseIn at={24} d={7} style={{padding: '4px 10px 4px 26px', fontSize: 11.5, color: MUT}}>Show more</RiseIn>
      <FolderRow at={26} label="forge-ade" />
      <TaskRow at={28} name="Create release forge-ade…" time="6d" gem={['#4CC3F0', '#2E7CD6']} sel />
      <TaskRow at={30} name="Use sub agent research:…" time="7d" gem={['#4CC3F0', '#2E7CD6']} />
      <TaskRow at={32} name="/goal research how the…" time="7d" gem={['#4CC3F0', '#2E7CD6']} />
      <TaskRow at={34} name="Hi there" time="7d" gem={['#4CC3F0', '#2E7CD6']} />
    </div>
    <div style={{marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 8px 2px', borderTop: `1px solid ${LINE}`}}>
      <Icon name="moon" size={14} color={MUT} stroke={2} />
      <span style={{
        fontFamily: MONO, fontSize: 10, color: MUT, border: `1px solid ${LINE}`,
        borderRadius: 6, padding: '2px 8px', background: 'rgba(255,255,255,0.03)',
      }}>v1.0.0 #49</span>
      <span style={{marginLeft: 'auto'}}><Icon name="gear" size={14} color={MUT} stroke={2} /></span>
    </div>
  </div>
);

const TopIcons: React.FC = () => (
  <div style={{position: 'absolute', top: 12, right: 14, display: 'flex', alignItems: 'center', gap: 12, zIndex: 5}}>
    <span style={{
      width: 26, height: 26, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(255,255,255,0.08)',
    }}><Icon name="code" size={13} color={TXT} stroke={2.2} /></span>
    <Icon name="folder" size={15} color={MUT} stroke={2} />
    <Icon name="image" size={15} color={MUT} stroke={2} />
    <Icon name="panel" size={15} color={MUT} stroke={2} />
    <span style={{
      display: 'flex', alignItems: 'center', gap: 6, border: `1px solid ${LINE}`,
      borderRadius: 999, padding: '3px 9px',
    }}>
      <span style={{width: 8, height: 8, borderRadius: 4, background: '#E8556F', boxShadow: '0 0 6px #E8556F'}} />
      <Icon name="chevron" size={9} color={MUT} stroke={2.6} />
    </span>
  </div>
);

const Home: React.FC<{t: number}> = ({t}) => {
  const prompt = 'create release forge-ade motion teaser for 30s social';
  const n = Math.round(interpolate(t, [8, 62], [0, prompt.length], CLAMP));
  return (
    <div style={{flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 40px'}}>
      <TopIcons />
      <SparkMark size={46} colorA="#FFFFFF" colorB="#D9D6E4" glow={false} />
      <div style={{textAlign: 'center', color: '#F7F6FB', fontWeight: 700, fontSize: 21, marginTop: 12, letterSpacing: '-0.01em'}}>
        What should we do in <span style={{borderBottom: '2px dotted rgba(236,234,242,0.45)'}}>test-app</span>?
      </div>
      <div style={{
        marginTop: 16, width: 'min(600px, 92%)', borderRadius: 16,
        border: `1px solid ${t > 4 && t < 66 ? 'rgba(232,85,111,0.5)' : LINE}`,
        background: BG2, padding: '10px 14px 12px',
        boxShadow: t > 4 && t < 66 ? '0 0 30px -8px rgba(232,85,111,0.4)' : '0 10px 30px -18px rgba(0,0,0,0.9)',
      }}>
        <div style={{display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 8, borderBottom: `1px solid ${LINE}`}}>
          <Icon name="folder" size={12} color={MUT} stroke={2} />
          <span style={{fontSize: 11.5, fontWeight: 600, color: 'rgba(236,234,242,0.85)'}}>test-app</span>
          <Icon name="chevron" size={9} color={FNT} stroke={2.6} />
          <span style={{width: 10}} />
          <Icon name="git" size={12} color={MUT} stroke={2} />
          <span style={{fontSize: 11.5, fontWeight: 600, color: 'rgba(236,234,242,0.85)'}}>main</span>
          <Icon name="chevron" size={9} color={FNT} stroke={2.6} />
        </div>
        <div style={{fontFamily: FONT, fontSize: 14, color: '#EFEAF4', padding: '10px 0 14px', minHeight: 20}}>
          {prompt.slice(0, n)}
          {t < 66 ? <span style={{color: '#E8556F', opacity: Math.floor(t / 12) % 2 ? 0 : 1}}>▏</span> : null}
        </div>
        <ComposerChips
          engineIcon={<SparkMark size={13} colorA="#E8556F" colorB="#F5A524" glow={false} />}
          engineLabel="Google Antigr…"
          model="gemini-3.8-flas…"
        />
      </div>
    </div>
  );
};

const RuntimePanel: React.FC<{t: number}> = ({t}) => {
  const items = [
    {label: 'Inspect project features and motion/deck assets', state: 'done' as const, at: 30},
    {label: 'Creating the 30-second Forge ADE teaser', state: 'run' as const, at: 44},
    {label: 'Verify teaser timing and deliverable', state: 'wait' as const, at: 0},
  ];
  const prog = interpolate(t, [28, 60], [0.18, 0.38], CLAMP);
  return (
    <RiseIn at={24} style={{
      position: 'absolute', top: 34, right: 16, width: 300, borderRadius: 14,
      background: 'rgba(24,22,30,0.97)', border: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 30px 70px -20px rgba(0,0,0,0.85)', padding: '13px 14px',
    }}>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 7}}>
        <span style={{fontSize: 13.5, fontWeight: 800, color: TXT}}>Runtime &amp; Tasks</span>
        <span style={{fontFamily: MONO, fontSize: 10.5, color: MUT}}>1/3</span>
        <span style={{marginLeft: 'auto'}}><Icon name="dots" size={13} color={FNT} /></span>
      </div>
      <div style={{height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.1)', margin: '9px 0 11px', overflow: 'hidden'}}>
        <div style={{width: `${prog * 100}%`, height: '100%', background: '#ECEAF2', borderRadius: 2}} />
      </div>
      {items.map((it) => {
        if (it.state === 'wait' || t < it.at) {
          return (
            <div key={it.label} style={{display: 'flex', gap: 8, alignItems: 'center', padding: '4px 0'}}>
              <div style={{width: 12, height: 12, borderRadius: 7, border: '1.6px solid rgba(230,224,240,0.35)', flexShrink: 0}} />
              <span style={{fontSize: 11.5, color: MUT}}>{it.label}</span>
            </div>
          );
        }
        if (it.state === 'done') {
          return (
            <div key={it.label} style={{display: 'flex', gap: 8, alignItems: 'center', padding: '4px 0'}}>
              <Icon name="check" size={12} color="#3DDC97" stroke={2.6} />
              <span style={{fontSize: 11.5, color: MUT, textDecoration: 'line-through'}}>{it.label}</span>
            </div>
          );
        }
        return (
          <div key={it.label} style={{display: 'flex', gap: 8, alignItems: 'center', padding: '4px 0'}}>
            <span style={{color: '#E8556F', fontSize: 12, lineHeight: 1}}>→</span>
            <span style={{fontSize: 11.5, fontWeight: 700, color: '#F4F2F8'}}>{it.label}</span>
          </div>
        );
      })}
      <div style={{display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 10, paddingTop: 9, borderTop: `1px solid ${LINE}`}}>
        <span style={{fontSize: 12, fontWeight: 800, color: TXT}}>Agents</span>
        <span style={{marginLeft: 'auto', fontFamily: MONO, fontSize: 10, color: FNT}}>2 total</span>
      </div>
      {['Research Agent Sub-agent', 'Coding Agent Sub-agent'].map((a, i) => (
        <RiseIn key={a} at={48 + i * 8} d={7} style={{
          display: 'flex', alignItems: 'center', gap: 8, marginTop: 7,
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 9, padding: '7px 10px',
        }}>
          <Icon name="cpu" size={12} color={MUT} stroke={2} />
          <span style={{fontSize: 11.5, fontWeight: 600, color: 'rgba(236,234,242,0.9)'}}>{a}</span>
          <span style={{marginLeft: 'auto', fontFamily: MONO, fontSize: 9, letterSpacing: '0.1em', color: MUT, border: `1px solid ${LINE}`, borderRadius: 5, padding: '1.5px 6px'}}>IDLE</span>
        </RiseIn>
      ))}
    </RiseIn>
  );
};

const Run: React.FC<{t: number}> = ({t}) => (
  <div style={{flex: 1, position: 'relative', padding: '44px 20px 10px', display: 'flex', flexDirection: 'column', minWidth: 0}}>
    <div style={{textAlign: 'center', fontSize: 13, fontWeight: 700, color: 'rgba(236,234,242,0.9)'}}>
      Create release forge-ade…
    </div>
    <div style={{flex: 1, width: 'min(560px, 88%)', margin: '14px auto 0', overflow: 'hidden'}}>
      <RiseIn at={6} style={{display: 'flex', justifyContent: 'flex-end'}}>
        <div style={{
          background: '#26242E', borderRadius: 14, padding: '9px 13px', fontSize: 12.5,
          color: '#F2F0F7', maxWidth: '78%', lineHeight: 1.45,
        }}>
          create release forge-ade motion teaser for 30s social
        </div>
      </RiseIn>
      <RiseIn at={16} style={{marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 7}}>
        <span style={{fontSize: 11.5, color: MUT}}>Worked for 4s</span>
        <Icon name="chevron" size={9} color={FNT} stroke={2.6} />
      </RiseIn>
      <RiseIn at={20} style={{
        marginTop: 9, display: 'flex', alignItems: 'center', gap: 8,
        background: 'rgba(255,255,255,0.04)', border: `1px solid ${LINE}`, borderRadius: 10, padding: '8px 11px',
      }}>
        <Icon name="wrench" size={12} color={MUT} stroke={2.1} />
        <span style={{fontFamily: MONO, fontSize: 11, color: 'rgba(236,234,242,0.8)', whiteSpace: 'nowrap', overflow: 'hidden'}}>
          Update tasks &#123;"tasks":[&#123;"active_form":"Inspecting pr…
        </span>
      </RiseIn>
      <RiseIn at={64} style={{marginTop: 10, display: 'flex', justifyContent: 'flex-end'}}>
        <span style={{border: `1px solid ${LINE}`, borderRadius: 999, padding: '6px 14px', fontSize: 12, fontWeight: 700, color: TXT, background: 'rgba(255,255,255,0.05)'}}>
          continue
        </span>
      </RiseIn>
      <RiseIn at={78} style={{
        marginTop: 14, borderRadius: 12, border: `1px solid ${LINE}`, background: BG2, padding: '10px 12px',
      }}>
        <div style={{display: 'flex', alignItems: 'center', gap: 7}}>
          <Icon name="sparkle" size={13} color="#F5A524" stroke={2} />
          <span style={{fontFamily: MONO, fontSize: 11.5, fontWeight: 700, color: TXT}}>open-design-hyperframes</span>
          <span style={{fontFamily: MONO, fontSize: 10, color: FNT}}>· (111 lines)</span>
          <span style={{marginLeft: 'auto', fontSize: 10.5, color: MUT}}>Copy ⌄</span>
        </div>
        <div style={{marginTop: 6, fontSize: 11, color: MUT, lineHeight: 1.5}}>
          Author code-driven motion graphics, video compositions, kinetic typography &amp; animations — deterministic MP4 in HTML.
        </div>
      </RiseIn>
    </div>
    <RuntimePanel t={t} />
    <div style={{position: 'absolute', bottom: 10, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
      <span style={{border: `1px solid ${LINE}`, background: BG2, borderRadius: 999, padding: '6px 14px', fontSize: 11.5, fontWeight: 700, color: TXT, display: 'inline-flex', alignItems: 'center', gap: 6}}>
        <Icon name="arrowup" size={11} color={MUT} stroke={2.4} /> Jump to latest
      </span>
      <div style={{
        width: 'min(560px, 88%)', borderRadius: 14, border: `1px solid ${LINE}`, background: BG2, padding: '9px 13px',
      }}>
        <div style={{fontSize: 12.5, color: FNT, paddingBottom: 8}}>Ask for follow-up changes</div>
        <ComposerChips
          engineIcon={<SparkMark size={13} colorA="#E8556F" colorB="#F5A524" glow={false} />}
          engineLabel="ForgeADE Inter…"
          model="gpt-6-luna"
        />
      </div>
    </div>
  </div>
);

const ED_CODE: {parts: [string, string][]; at: number}[] = [
  {at: 8, parts: [['import ', '#C586C0'], ['Navbar', '#9CDCFE'], [' from ', '#C586C0'], ["'./components/Navbar'", '#E8A56B']]},
  {at: 11, parts: [['import ', '#C586C0'], ['Hero', '#9CDCFE'], [' from ', '#C586C0'], ["'./components/Hero'", '#E8A56B']]},
  {at: 14, parts: [['import ', '#C586C0'], ['Section', '#9CDCFE'], [' from ', '#C586C0'], ["'./components/Section'", '#E8A56B']]},
  {at: 17, parts: [['import ', '#C586C0'], ['About', '#9CDCFE'], [' from ', '#C586C0'], ["'./components/About'", '#E8A56B']]},
  {at: 20, parts: [['import ', '#C586C0'], ['Projects', '#9CDCFE'], [' from ', '#C586C0'], ["'./components/Projects'", '#E8A56B']]},
  {at: 23, parts: [['import ', '#C586C0'], ['Footer', '#9CDCFE'], [' from ', '#C586C0'], ["'./components/Footer'", '#E8A56B']]},
  {at: 27, parts: [['', '#D4D4D4']]},
  {at: 30, parts: [['function ', '#C586C0'], ['App', '#9CDCFE'], ['() {', '#D4D4D4']]},
  {at: 33, parts: [['  return ', '#C586C0'], ['(', '#D4D4D4']]},
  {at: 36, parts: [['    <div ', '#808080'], ['className', '#E8A56B'], ['=', '#D4D4D4'], ['"min-h-screen bg-white dark:bg-gray-950"', '#E8A56B'], ['>', '#808080']]},
  {at: 40, parts: [['      <a ', '#808080'], ['href', '#E8A56B'], ['=', '#D4D4D4'], ['"#konten-utama"', '#E8A56B'], ['>', '#808080'], ['Lompat ke konten utama', '#9CDCFE'], ['</a>', '#808080']]},
  {at: 44, parts: [['      <Navbar />', '#808080']]},
  {at: 47, parts: [['      <Section ', '#808080'], ['id', '#E8A56B'], ['=', '#D4D4D4'], ['"tentang"', '#E8A56B'], [' title', '#E8A56B'], ['=', '#D4D4D4'], ['"Merancang dan membangun"', '#E8A56B'], ['>', '#808080']]},
  {at: 51, parts: [['        <About />', '#808080']]},
  {at: 54, parts: [['      </Section>', '#808080']]},
  {at: 57, parts: [['    </div>', '#808080']]},
  {at: 60, parts: [['  );', '#D4D4D4']]},
  {at: 63, parts: [['}', '#D4D4D4']]},
];

const FILES: [string, number, boolean?][] = [
  ['.forge', 0], ['.git', 0], ['.workspace', 0], ['dist', 0], ['node_modules', 0], ['public', 0],
  ['src', 1], ['assets', 2], ['components', 2], ['data', 2], ['hooks', 2],
  ['App.css', 2], ['App.tsx', 2, true], ['index.css', 2], ['main.tsx', 2],
  ['coba.txt', 0], ['data.json', 0], ['index.html', 0], ['package.json', 0],
];

const Editor: React.FC<{t: number}> = ({t}) => (
  <div style={{flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0}}>
    <div style={{height: 40, display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', borderBottom: `1px solid ${LINE}`}}>
      <span style={{fontSize: 12.5, fontWeight: 700, color: TXT}}>App.tsx</span>
      <Icon name="folder" size={12} color={MUT} stroke={2} />
      <span style={{fontSize: 11.5, color: MUT}}>test-app</span>
      <Icon name="chevron" size={9} color={FNT} stroke={2.6} />
      <Icon name="git" size={12} color={MUT} stroke={2} />
      <span style={{fontSize: 11.5, color: MUT}}>main</span>
      <Icon name="chevron" size={9} color={FNT} stroke={2.6} />
      <span style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12}}>
        <span style={{
          width: 26, height: 26, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(255,255,255,0.08)',
        }}><Icon name="code" size={13} color={TXT} stroke={2.2} /></span>
        <Icon name="folder" size={14} color={MUT} stroke={2} />
        <Icon name="image" size={14} color={MUT} stroke={2} />
        <Icon name="panel" size={14} color={MUT} stroke={2} />
      </span>
    </div>
    <div style={{display: 'flex', flex: 1, minHeight: 0}}>
      <div style={{width: 44, flexShrink: 0, borderRight: `1px solid ${LINE}`, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 12, gap: 14}}>
        <Icon name="folder" size={15} color={MUT} stroke={2} />
        <Icon name="search" size={15} color={MUT} stroke={2} />
        <div style={{position: 'relative'}}>
          <Icon name="git" size={15} color={MUT} stroke={2} />
          <span style={{
            position: 'absolute', top: -5, right: -7, background: '#E8556F', color: '#fff',
            fontSize: 8.5, fontWeight: 800, borderRadius: 7, padding: '0.5px 4px',
          }}>9</span>
        </div>
      </div>
      <div style={{width: 200, flexShrink: 0, borderRight: `1px solid ${LINE}`, padding: '10px 8px', overflow: 'hidden'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 6, padding: '2px 6px 8px'}}>
          <span style={{fontSize: 10.5, fontWeight: 800, letterSpacing: '0.08em', color: MUT}}>EXPLORER</span>
          <span style={{marginLeft: 'auto'}}><Icon name="dots" size={12} color={FNT} /></span>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 5, padding: '2px 6px 6px'}}>
          <Icon name="chevron" size={9} color={FNT} stroke={2.6} />
          <span style={{fontSize: 11, fontWeight: 800, letterSpacing: '0.06em', color: 'rgba(236,234,242,0.8)'}}>TEST-APP</span>
        </div>
        {FILES.map(([name, depth, sel], i) => {
          if (t < 10 + i * 2.6) return null;
          const k = interpolate(t, [10 + i * 2.6, 14 + i * 2.6], [0, 1], CLAMP);
          return (
            <div key={name} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '3px 6px', borderRadius: 6,
              paddingLeft: 6 + depth * 13,
              background: sel ? 'rgba(232,85,111,0.13)' : 'transparent',
              opacity: k,
            }}>
              {depth === 0 ? <Icon name="chevron" size={8} color={FNT} stroke={2.6} /> : null}
              <span style={{
                fontSize: 11, fontFamily: MONO, color: sel ? '#F6C7D4' : 'rgba(236,234,242,0.72)',
                whiteSpace: 'nowrap',
              }}>{name}</span>
            </div>
          );
        })}
        <div style={{marginTop: 8, borderTop: `1px solid ${LINE}`, paddingTop: 7, fontSize: 10.5, fontWeight: 800, letterSpacing: '0.08em', color: MUT, padding: '7px 6px 0'}}>
          OUTLINE
        </div>
        <div style={{fontSize: 10.5, fontWeight: 800, letterSpacing: '0.08em', color: MUT, padding: '8px 6px 0'}}>
          TIMELINE
        </div>
      </div>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0}}>
        <div style={{display: 'flex', gap: 2, padding: '7px 10px 0', borderBottom: `1px solid ${LINE}`, fontSize: 11, fontFamily: MONO}}>
          {['README.md', 'index.html', 'data.json', 'package.json', 'App.tsx'].map((f, i) => (
            <div key={f} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: '7px 7px 0 0',
              background: i === 4 ? 'rgba(255,255,255,0.07)' : 'transparent',
              color: i === 4 ? TXT : MUT,
              borderBottom: i === 4 ? '2px solid #E8556F' : '2px solid transparent',
            }}>
              {i === 4 ? <Icon name="code" size={10} color="#E8556F" stroke={2.4} /> : null}
              {f}{i === 4 ? ' ×' : ' ×'}
            </div>
          ))}
        </div>
        <div style={{padding: '4px 12px', fontSize: 10.5, fontFamily: MONO, color: FNT, borderBottom: `1px solid ${LINE}`}}>
          test-app <span style={{opacity: 0.5}}>›</span> src <span style={{opacity: 0.5}}>›</span> <span style={{color: MUT}}>App.tsx</span>
        </div>
        <div style={{flex: 1, display: 'flex', minHeight: 0}}>
          <div style={{flex: 1, padding: '8px 0', fontFamily: MONO, fontSize: 12, lineHeight: '19px', overflow: 'hidden'}}>
            {ED_CODE.map((line, i) => {
              if (t < line.at) return <div key={i} style={{height: 19}}>&nbsp;</div>;
              return (
                <div key={i} style={{display: 'flex'}}>
                  <span style={{width: 34, textAlign: 'right', paddingRight: 12, color: 'rgba(230,224,240,0.22)'}}>{i + 1}</span>
                  <span style={{whiteSpace: 'pre'}}>
                    {line.parts.map(([txt, col], j) => <span key={j} style={{color: col}}>{txt}</span>)}
                    {i === Math.min(ED_CODE.length - 1, Math.floor((t - 8) / 3)) ? (
                      <span style={{color: '#E8556F', opacity: Math.floor(t / 10) % 2 ? 0 : 1}}>▊</span>
                    ) : null}
                  </span>
                </div>
              );
            })}
          </div>
          <div style={{width: 46, flexShrink: 0, borderLeft: `1px solid ${LINE}`, padding: '8px 4px', opacity: 0.5}}>
            {Array.from({length: 22}, (_, i) => (
              <div key={i} style={{
                height: 3, borderRadius: 2, marginBottom: 4,
                width: `${28 + Math.abs(Math.sin(i * 1.7)) * 62}%`,
                background: 'rgba(230,224,240,0.25)',
              }} />
            ))}
          </div>
        </div>
        <div style={{height: 26, borderTop: `1px solid ${LINE}`, display: 'flex', alignItems: 'center', padding: '0 14px', fontSize: 11, color: MUT}}>
          <span style={{fontFamily: MONO}}>test-app</span>
          <span style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12}}>
            <span style={{display: 'flex', alignItems: 'center', gap: 5}}><Icon name="code" size={11} color={MUT} stroke={2} /> TypeScript</span>
            <span style={{fontFamily: MONO}}>v1.0.0 #49</span>
            <span style={{display: 'flex', alignItems: 'center', gap: 4}}><Icon name="gear" size={11} color={MUT} stroke={2} /> Settings</span>
          </span>
        </div>
      </div>
    </div>
  </div>
);

export const ForgeADEUI: React.FC<{dur: number; accent: string; fixed?: number}> = ({dur, accent, fixed}) => {
  const t = useCurrentFrame();
  const phaseLen = Math.round(dur / PHASES);
  const phase = fixed !== undefined ? fixed : Math.min(PHASES - 1, Math.floor(t / phaseLen));
  const tl = fixed !== undefined ? t : t - phase * phaseLen;
  return (
    <WindowFrame title="ForgeADE" accent={accent} w={940} h={600} bare>
      <UITimeCtx.Provider value={tl}>
        <div style={{flex: 1, display: 'flex', minHeight: 0}}>
          {phase < 2 ? <Sidebar /> : null}
          {phase === 0 ? <Home t={tl} /> : null}
          {phase === 1 ? <Run t={tl} /> : null}
          {phase === 2 ? <Editor t={tl} /> : null}
        </div>
      </UITimeCtx.Provider>
    </WindowFrame>
  );
};
