// Procedural ad soundtrack generator — no dependencies, writes 16-bit stereo WAV.
// Each product gets its own mood: key, progression, bpm, energy.
// Usage: node scripts/make-track.mjs --out ../public/audio/forgeade.wav --bpm 102 --root 45 --mode minor --seed 7 --energy 0.9
import {writeFileSync} from 'node:fs';

const args = process.argv.slice(2);
const opt = (k, d) => {
  const i = args.indexOf(`--${k}`);
  return i >= 0 ? args[i + 1] : d;
};

const sr = 44100;
const out = opt('out', 'track.wav');
const bpm = Number(opt('bpm', 100));
const rootMidi = Number(opt('root', 45)); // A2
const mode = opt('mode', 'minor');
const seed = Number(opt('seed', 7));
const energy = Number(opt('energy', 0.8));
const seconds = Number(opt('seconds', 63));

// deterministic PRNG
let s = seed >>> 0 || 1;
const rnd = () => {
  s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0;
  return s / 4294967296;
};

const minor = [0, 3, 7, 10];   // m7 flavor
const major = [0, 4, 7, 11];   // maj7 flavor
const chordSet = mode === 'minor' ? minor : major;
// 4-chord progression as scale degrees (semitone offsets from root)
const prog = mode === 'minor' ? [0, 8, 3, 10] : [0, 7, 9, 5];

const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
const N = Math.floor(seconds * sr);
const L = new Float32Array(N);
const R = new Float32Array(N);

const beat = 60 / bpm;
const bar = beat * 4;
const bars = Math.ceil(seconds / bar);

// one-pole lowpass state
let lpL = 0, lpR = 0, lpAmt = 0.18 + 0.1 * energy;

const add = (i, l, r) => {
  if (i >= 0 && i < N) { L[i] += l; R[i] += r; }
};

// ---- PAD: detuned saws through LP, one chord per bar ----
for (let b = 0; b < bars; b++) {
  const deg = prog[b % prog.length];
  const start = Math.floor(b * bar * sr);
  const len = Math.floor(bar * sr);
  for (const iv of chordSet) {
    const f = mtof(rootMidi + 12 + deg + iv);
    for (let i = 0; i < len; i++) {
      const t = i / sr;
      const env = Math.min(1, t / 0.9) * Math.min(1, (len / sr - t) / 1.1);
      if (env <= 0) continue;
      // two detuned saws, cheap polyblep-free (slight aliasing masked by LP)
      const ph1 = (f * t) % 1, ph2 = ((f * 1.006) * t + 0.3) % 1;
      const saw = 2 * ph1 - 1, saw2 = 2 * ph2 - 1;
      let v = (saw * 0.6 + saw2 * 0.4) * env * 0.05;
      add(start + i, v, v * 0.96);
    }
  }
}

// ---- BASS: root pluck on beats 1 & 3 ----
for (let b = 0; b < bars; b++) {
  const deg = prog[b % prog.length];
  for (const bq of [0, 2]) {
    const start = Math.floor((b * bar + bq * beat) * sr);
    const len = Math.floor(0.5 * sr);
    const f = mtof(rootMidi + deg);
    for (let i = 0; i < len; i++) {
      const t = i / sr;
      const env = Math.exp(-t * 6);
      const v = Math.sin(2 * Math.PI * f * t) * env * 0.16 * energy;
      add(start + i, v, v);
    }
  }
}

// ---- ARP: 16th-note plucks over chord tones ----
const arpPat = [0, 2, 1, 3, 2, 0, 3, 1];
for (let b = 0; b < bars; b++) {
  const deg = prog[b % prog.length];
  const sixteenth = beat / 4;
  for (let k = 0; k < 16; k++) {
    if (rnd() > 0.62 + 0.3 * energy) continue; // musical gaps
    const start = Math.floor((b * bar + k * sixteenth) * sr);
    const iv = chordSet[arpPat[k % arpPat.length]];
    const f = mtof(rootMidi + 24 + deg + iv);
    const len = Math.floor(0.22 * sr);
    const pan = k % 2 === 0 ? 0.7 : 0.35;
    for (let i = 0; i < len; i++) {
      const t = i / sr;
      const env = Math.exp(-t * 14);
      const tri = Math.asin(Math.sin(2 * Math.PI * f * t)) * (2 / Math.PI);
      const v = tri * env * 0.11;
      add(start + i, v * pan, v * (1 - pan));
    }
  }
}

// ---- KICK: four on the floor ----
for (let b = 0; b < bars; b++) {
  for (let q = 0; q < 4; q++) {
    const start = Math.floor((b * bar + q * beat) * sr);
    const len = Math.floor(0.24 * sr);
    for (let i = 0; i < len; i++) {
      const t = i / sr;
      const f = 42 + 90 * Math.exp(-t * 38);
      const env = Math.exp(-t * 16);
      const v = Math.sin(2 * Math.PI * f * t) * env * 0.34 * energy;
      add(start + i, v, v);
    }
  }
}

// ---- HAT: offbeat 8ths, airy noise ----
for (let b = 0; b < bars; b++) {
  for (let q = 0; q < 8; q++) {
    if (q % 2 === 0) continue;
    const start = Math.floor((b * bar + q * beat / 2) * sr);
    const len = Math.floor(0.05 * sr);
    for (let i = 0; i < len; i++) {
      const t = i / sr;
      const env = Math.exp(-t * 90);
      const v = (rnd() * 2 - 1) * env * 0.045 * (0.5 + energy / 2);
      add(start + i, v * 0.6, v);
    }
  }
}

// ---- global LP + sidechain-lite + fades + soft clip ----
const fade = Math.floor(1.5 * sr);
for (let i = 0; i < N; i++) {
  const beatIdx = i / (beat * sr);
  const phase = beatIdx % 1;
  const duck = 1 - 0.22 * Math.exp(-phase * 9); // gentle pump
  lpL += lpAmt * (L[i] * duck - lpL);
  lpR += lpAmt * (R[i] * duck - lpR);
  let g = 1.25;
  if (i < fade) g *= i / fade;
  if (i > N - fade) g *= (N - i) / fade;
  const cl = (x) => Math.max(-1, Math.min(1, Math.tanh(x * 1.1)));
  L[i] = cl(lpL * g); R[i] = cl(lpR * g);
}

// ---- WAV encode (16-bit stereo) ----
const dataLen = N * 4;
const buf = Buffer.alloc(44 + dataLen);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + dataLen, 4); buf.write('WAVE', 8);
buf.write('fmt ', 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20);
buf.writeUInt16LE(2, 22); buf.writeUInt32LE(sr, 24); buf.writeUInt32LE(sr * 4, 28);
buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
buf.write('data', 36); buf.writeUInt32LE(dataLen, 40);
for (let i = 0; i < N; i++) {
  buf.writeInt16LE((L[i] * 32767) | 0, 44 + i * 4);
  buf.writeInt16LE((R[i] * 32767) | 0, 46 + i * 4);
}
writeFileSync(new URL(out, import.meta.url).pathname, buf);
console.log('wrote', out, (dataLen / 1048576).toFixed(1) + 'MB', `${seconds}s @ ${bpm}bpm ${mode}`);
