// Brand configuration for the four Haslab AI products — facts sourced from the
// real repos (forge-ade, kendali-ai, RakitKode, pandu-jev).
export type IconName =
  | 'bolt' | 'shield' | 'layers' | 'code' | 'chart' | 'compass' | 'clock'
  | 'chat' | 'check' | 'bell' | 'coins' | 'cpu' | 'git' | 'terminal'
  | 'globe' | 'users' | 'zap' | 'box'
  | 'plus' | 'search' | 'calendar' | 'board' | 'funnel' | 'trash' | 'pin'
  | 'moon' | 'gear' | 'newspaper' | 'wrench' | 'chevron' | 'target'
  | 'arrowup' | 'folder' | 'image' | 'panel' | 'dots' | 'burger'
  | 'sidebarToggle' | 'sparkle';

export type Feature = {icon: IconName; title: string; desc: string};
export type Stat = {value: number; decimals?: number; suffix: string; label: string};
export type Phase = {chip: string; caption: string; focus: {scale: number; tx: number; ty: number}};

export type Product = {
  id: string;
  name: string;
  version: string;
  kicker: string;
  tagline: [string, string];
  accent: string;
  accent2: string;
  bgA: string;
  bgB: string;
  hookLines: [string, string];
  punch: string;
  phases: [Phase, Phase, Phase];
  features: [Feature, Feature, Feature, Feature];
  stats: [Stat, Stat, Stat];
  cta: string;
  handle: string;
  author: string;
  track: string;
};

const FULL = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const PRODUCTS: Record<string, Product> = {
  ForgeADE: {
    id: 'forgeade',
    name: 'ForgeADE',
    version: 'v1.0.7',
    kicker: 'NATIVE AI DEVELOPMENT ENVIRONMENT',
    tagline: ['The Native AI Development Environment', 'Built for Velocity.'],
    accent: '#F65CA6',
    accent2: '#FF6A5C',
    bgA: '#150E1A',
    bgB: '#241426',
    hookLines: ['IDE berat, agent AI tercecer,', 'dan semuanya terasa lambat.'],
    punch: 'Semua harusnya jadi satu binary.',
    phases: [
      {chip: 'AGENT HOME', caption: 'Composer serba-bisa — @ thread, $ skill, atau / perintah', focus: {scale: 1.42, tx: 130, ty: 60}},
      {chip: 'AUTONOMOUS RUN', caption: 'Sub-agent & task checklist berjalan sendiri — kamu tinggal setujui', focus: {scale: 1.28, tx: -20, ty: -20}},
      {chip: 'EDITOR NATIVE', caption: 'Explorer, tab & minimap — startup di bawah 100ms', focus: {scale: 1.35, tx: 60, ty: 40}},
    ],
    features: [
      {icon: 'bolt', title: 'Autonomous Agent Harness', desc: 'Loop reasoning multi-langkah, approval gate, sub-agent & task checklist'},
      {icon: 'terminal', title: 'Terminal PTY Asli', desc: 'claude, codex, vim, htop — native session, startup < 100ms'},
      {icon: 'git', title: 'Git Orchestration', desc: 'Diff gutter visual, staging & AI commit generator dalam satu layar'},
      {icon: 'globe', title: 'Browser Use Engine', desc: 'Agent membuka, mengklik & memeriksa halaman web secara mandiri'},
    ],
    stats: [
      {value: 0.1, decimals: 1, suffix: 's', label: 'cold start — bukan 10 detik seperti Electron'},
      {value: 80, suffix: 'MB', label: 'RAM idle — native Go + Wails v3, zero bloat'},
      {value: 1, suffix: ' binary', label: 'semua kekuatan dalam satu aplikasi desktop'},
    ],
    cta: 'Unduh ForgeADE — Gratis & Open Source',
    handle: 'forge-ade.pages.dev',
    author: 'by Lutfi Ikbal Majid',
    track: 'forgeade',
  },
  KendaliAI: {
    id: 'kendaliai',
    name: 'KendaliAI',
    version: 'Hermes Gateway',
    kicker: 'SELF-HOSTED AI AGENT GATEWAY',
    tagline: ['Satu daemon Go.', 'Banyak agent. Semua channel.'],
    accent: '#9F7CFA',
    accent2: '#6A9BFF',
    bgA: '#110E1E',
    bgB: '#191236',
    hookLines: ['Agent, bot & model AI kamu', 'hidup berpencah di banyak channel?'],
    punch: 'Ambil kendali dari satu gerbang.',
    phases: [
      {chip: 'AGENT PRIBADI', caption: 'Setiap agent punya karakter — pilih, lalu ngobrol langsung', focus: {scale: 1.42, tx: 130, ty: 40}},
      {chip: 'TOOLS NYATA', caption: 'Terhubung Google Calendar & tools — jawaban berupa kartu hasil', focus: {scale: 1.3, tx: -60, ty: 30}},
      {chip: 'SATU GERBANG', caption: 'Web, Telegram, CLI & API — semua channel ke sesi yang sama', focus: {scale: 1.6, tx: 205, ty: 50}},
    ],
    features: [
      {icon: 'users', title: 'Multi-Channel Gateway', desc: 'Web, Telegram bot, CLI & REST/WebSocket dalam satu daemon ringan'},
      {icon: 'chat', title: 'Sesi & Memori Bersama', desc: 'Semua channel berbagi konteks — event sourcing penuh'},
      {icon: 'shield', title: 'Policy Guardrails', desc: 'Sandboxing RBAC, tool budget & policy per agent'},
      {icon: 'chart', title: 'Executive Telemetry', desc: 'CPU, memori, storage, log live & scheduler dalam satu papan'},
    ],
    stats: [
      {value: 1, suffix: ' daemon', label: 'untuk seluruh armada AI kamu'},
      {value: 4, suffix: '+ channel', label: 'Web · Telegram · CLI · REST/WebSocket'},
      {value: 100, suffix: '%', label: 'self-hosted — datamu tetap milikmu'},
    ],
    cta: 'Deploy KendaliAI Sekarang',
    handle: 'github.com/Haslab-dev/kendali-ai',
    author: 'by Lutfi Ikbal Majid',
    track: 'kendaliai',
  },
  RakitKode: {
    id: 'rakitkode',
    name: 'RakitKode',
    version: 'v0.1 · Go Engine',
    kicker: 'GO AGENT ENGINE UNTUK TUGAS CODING',
    tagline: ['Satu otak, banyak wujud.', 'Embed. Jalankan. Selesai.'],
    accent: '#F5A524',
    accent2: '#FF7A1A',
    bgA: '#171006',
    bgB: '#231508',
    hookLines: ['Butuh agent coding di dalam produkmu?', 'Jangan bangun otaknya dari nol.'],
    punch: 'Rakit dari engine-nya.',
    phases: [
      {chip: '01 · EMBED', caption: 'engine.New() — seluruh harness dalam satu library Go', focus: {scale: 1.22, tx: 0, ty: 46}},
      {chip: '02 · RUN', caption: 'rakit run — plan → tools → diff → done', focus: {scale: 1.18, tx: 0, ty: -24}},
      {chip: '03 · LANJUTKAN', caption: 'Sesi bisa di-resume, multi-provider & --yolo', focus: {scale: 1.22, tx: 0, ty: 112}},
    ],
    features: [
      {icon: 'code', title: 'Engine Go Embeddable', desc: 'agent · harness · tools · llm · mcp · skills · plugins · events'},
      {icon: 'terminal', title: 'CLI `rakit`', desc: 'rakit run, --json, sesi interaktif & --yolo auto-approve'},
      {icon: 'layers', title: 'Skills · MCP · Plugins', desc: 'Ekstensibilitas penuh — rakit import dari forge-ade'},
      {icon: 'cpu', title: 'Multi-Provider', desc: 'Profil model dari ~/.rakit — ganti otak sesuai tugas'},
    ],
    stats: [
      {value: 1, suffix: ' library', label: 'engine + CLI — satu modul Go'},
      {value: 8, suffix: ' layer', label: 'API publik: dari agent sampai events'},
      {value: 100, suffix: '%', label: 'open source — lisensi MIT'},
    ],
    cta: 'go get github.com/Haslab-dev/RakitKode',
    handle: 'github.com/Haslab-dev/RakitKode',
    author: 'by Lutfi Ikbal Majid',
    track: 'rakitkode',
  },
  PanduJev: {
    id: 'pandujev',
    name: 'PanduJev',
    version: 'v0.1 · Research',
    kicker: 'LOCAL POLICY INTELLIGENCE',
    tagline: ['LLM memikirkan maksud.', 'Pandu memutuskan aksi.'],
    accent: '#3DDC97',
    accent2: '#38B6FF',
    bgA: '#0A1510',
    bgB: '#0F2029',
    hookLines: ['LLM itu pintar — tapi lambat & mahal', 'untuk keputusan sepersekian detik.'],
    punch: 'Refleks mikrodetik. 100% lokal.',
    phases: [
      {chip: '01 · INTENT', caption: 'LLM beku memahami maksud → Canonical Intent Protocol', focus: {scale: 1.22, tx: 0, ty: -40}},
      {chip: '02 · REFLEX', caption: 'Policy network memutuskan dalam mikrodetik, closed-loop', focus: {scale: 1.25, tx: 0, ty: 12}},
      {chip: '03 · CALIBRATED', caption: 'Uncertainty terkalibrasi — ia tahu kapan dirinya ragu', focus: {scale: 1.22, tx: 0, ty: 112}},
    ],
    features: [
      {icon: 'cpu', title: 'Micro Policy Networks', desc: '2.916 parameter, ~11 KB — muat di mikrokontroler sekalipun'},
      {icon: 'zap', title: 'Refleks 17µs', desc: 'Keputusan motorik 17–24 µs untuk kontrol closed-loop'},
      {icon: 'shield', title: 'Uncertainty Calibration', desc: 'ECE 0.86% · AUROC 0.952 — keyakinan yang jujur'},
      {icon: 'compass', title: 'Grounded Language', desc: 'Semantik SmolLM2 · ModernBERT lepas dari loop kontrol'},
    ],
    stats: [
      {value: 17, suffix: 'µs', label: 'refleks keputusan motorik — bukan detik'},
      {value: 11, suffix: 'KB', label: 'ukuran policy network — tanpa GPU'},
      {value: 0, suffix: '', label: 'biaya API cloud — murni berjalan lokal'},
    ],
    cta: 'Jelajahi Risetnya',
    handle: 'github.com/Haslab-dev/pandu-jev',
    author: 'by Lutfi Ikbal Majid',
    track: 'pandujev',
  },
};

export const FULL_CLAMP = FULL;
