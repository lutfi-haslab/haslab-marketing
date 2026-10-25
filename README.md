# Marketing — Video Iklan Branding Produk AI

Video motion iklan branding (portrait 9:16, **63 detik**, 1080×1920 @30fps) untuk empat
produk AI **by Lutfi Ikbal Majid (Haslab-dev)** — plus **video Mix** (showreel gabungan).
Dibuat dengan **Remotion** di atas engine motion **Hyperframe** (`video/src/hyperframe/`).

| Video | Produk | Aksen | Showcase UI (clone sesuai app asli) |
|---|---|---|---|
| `out/ForgeADE.mp4` | **ForgeADE** — Native AI Development Environment | Magenta `#E8556F` | Sidebar New task/Projects, agent home + composer chips (Full · engine · model · Medium), task run + panel **Runtime & Tasks** dengan sub-agent, editor native (explorer · tab · minimap · status bar) |
| `out/KendaliAI.mp4` | **KendaliAI** — Hermes Agent Gateway | Violet `#9F7CFA` | Rail avatar karakter (Astra/Kira/Fatima/Ops), chat home "What should we do in Fatima?", bubble biru + **kartu hasil putih** (Agenda Hari Ini), composer chips, FAB |
| `out/RakitKode.mp4` | **RakitKode** — Go Agent Engine | Amber `#F5A524` | Terminal `rakit`: embed → run → resume (`--yolo`, multi-provider) |
| `out/PanduJev.mp4` | **PanduJev** — Local Policy Intelligence | Emerald `#3DDC97` | Research console: intent LLM → GridWorld refleks µs → kalibrasi |
| `out/Mix.mp4` | **HASLAB Mix** — showreel gabungan | Multi | Intro orbit 4 logo → 4 segmen (kartu → momen UI terbaik → punch line) → grid ekosistem → outro |

## Struktur

```
marketing/
├── README.md                  ← file ini
├── uiclones/                  ← clone UI HTML mandiri (buka langsung di browser)
│   ├── forgeade.html             · 3 view auto-rotate: Agent Home → Task Run → Editor
│   └── kendaliai.html            · pilih agent di rail, demo home → chat → roster
├── out/                       ← video final MP4 (H.264 + audio)
│   ├── ForgeADE.mp4 · KendaliAI.mp4 · RakitKode.mp4 · PanduJev.mp4 · Mix.mp4
└── video/                     ← proyek Remotion × Hyperframe
    ├── package.json           ← `npm run studio` / render per-composition
    ├── public/fonts/          ← Plus Jakarta Sans & JetBrains Mono (variable woff2)
    ├── public/audio/          ← 5 soundtrack prosedural (per video, 63s)
    ├── scripts/               ← fetch-fonts.mjs · make-track.mjs (tanpa dependensi)
    └── src/
        ├── Root.tsx           ← 5 Composition: ForgeADE, KendaliAI, RakitKode, PanduJev, Mix
        ├── brand.ts           ← copy, warna, fitur, stats & fase kamera per produk
        ├── hyperframe/        ← ENGINE MOTION (spring deterministik, aman frame-akurat)
        ├── ui/
        │   ├── Icons.tsx      ← glyph sesuai app asli (plus/search/board/calendar/
        │   │                     funnel/target/chevron/arrow-up send, dll.)
        │   ├── atoms.tsx      ← WindowFrame, ComposerChips (Full·engine·model·Medium·send),
        │   │                     FaceAvatar (karakter SVG), GemIcon, Sparkline, dll.
        │   ├── ForgeADEUI.tsx · KendaliAIUI.tsx · RakitKodeUI.tsx · PanduJevUI.tsx
        └── videos/ProductAd.tsx · MixAd.tsx
```

## Alur iklan produk (63 detik)

| Waktu | Scene |
|---|---|
| 0–3s | Logo mark + nama produk + kicker |
| 3–10s | Hook masalah (kinetic typography) + punch line |
| 10–33s | Showcase UI clone dengan **camera rig** 3 fase (chip + caption berubah) |
| 33–46s | Grid 4 fitur unggulan |
| 46–54s | 3 angka kunci (count-up) |
| 54–63s | CTA, handle repo, kredit **by Lutfi Ikbal Majid** |

Alur **Mix**: intro HASLAB (0–4s) → 4 segmen produk @13s (kartu logo → momen UI → punch line) → grid ekosistem (3s) → outro HASLAB (3s).

## Perintah

```bash
cd video
npm install          # sekali
npm run studio       # pratinjau interaktif di browser

# render (satu per satu)
npx remotion render src/index.ts ForgeADE  ../out/ForgeADE.mp4
npx remotion render src/index.ts KendaliAI ../out/KendaliAI.mp4
npx remotion render src/index.ts RakitKode ../out/RakitKode.mp4
npx remotion render src/index.ts PanduJev  ../out/PanduJev.mp4
npx remotion render src/index.ts Mix       ../out/Mix.mp4

npm run typecheck     # validasi TypeScript
node scripts/fetch-fonts.mjs   # unduh ulang font
node scripts/make-track.mjs --out public/audio/mix.wav --bpm 100 --root 45 --mode minor --seed 77
```

## Catatan desain

- **Clone UI 1:1 dari screenshot app asli**: ForgeADE (native, traffic lights di sidebar,
  composer chip `test-app ▾ · main ▾ · + · 🛡 Full · ✦ Google Antigr… · gemini-3.8-flas… · ◎ Medium · (send)`,
  panel Runtime & Tasks dengan checklist + sub-agent IDLE, editor `v1.0.0 #49`) dan
  KendaliAI (rail spark pink + avatar karakter, chat Fatima, bubble `#2E6BF6`,
  kartu putih `Agenda Hari Ini` + pill hijau, FAB).
- **Hyperframe** = semua transisi berbasis spring/interpolate deterministik (frame-akurat).
- Format 1080×1920 (9:16) memenuhi **Instagram Story & Post/Reels**; elemen penting di
  safe-area tengah.
- Soundtrack disintesis prosedural per video (BPM/key/energy beda) — bebas hak cipta.
