import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Circle, Square, Trash2, Download, Upload, Brain, Play, Pause, Info } from 'lucide-react';
import { usePersistentState } from '../../lib/storage';
import {
  frameFeatures,
  resample,
  buildModel,
  classify,
  summarize,
  RECORD_MS,
  MIN_SAMPLES_PER_LABEL,
} from '../../lib/signRecognizer';

const WINDOW_MS = 1600; // panjang jendela gerakan yang dicocokkan
const CLASSIFY_EVERY = 350;
const COOLDOWN_MS = 2200;

/**
 * Pengenal isyarat pribadi: pengguna merekam beberapa contoh tiap kata,
 * lalu kamera mengenali kata tersebut secara langsung.
 * Frame dikirim oleh induk lewat frameSinkRef.current(result).
 */
export default function RecognizerPanel({ frameSinkRef, cameraReady, suggestions, onRecognized, onLabelPick, showToast }) {
  const [samples, setSamples] = usePersistentState('recognizerSamples', []);
  const [label, setLabel] = useState(suggestions[0] || '');
  const [phase, setPhase] = useState('idle'); // idle | countdown | recording
  const [countdown, setCountdown] = useState(0);
  const [recognizing, setRecognizing] = useState(false);
  const [guess, setGuess] = useState(null);

  const model = useMemo(() => buildModel(samples), [samples]);
  const counts = useMemo(() => summarize(samples), [samples]);
  const labels = Object.keys(counts);

  // Ref untuk dipakai di dalam callback frame (tanpa membuat ulang loop)
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const recognizingRef = useRef(recognizing);
  recognizingRef.current = recognizing;
  const modelRef = useRef(model);
  modelRef.current = model;
  const recordBuf = useRef([]);
  const liveBuf = useRef([]);
  const lastClassify = useRef(0);
  const cooldownUntil = useRef(0);
  const streak = useRef({ label: null, n: 0 });
  const onRecognizedRef = useRef(onRecognized);
  onRecognizedRef.current = onRecognized;
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Penerima frame dari kamera
  useEffect(() => {
    frameSinkRef.current = (result) => {
      const f = frameFeatures(result);
      const now = performance.now();
      if (phaseRef.current === 'recording' && f) recordBuf.current.push(f);
      if (!recognizingRef.current) return;
      if (f) liveBuf.current.push({ t: now, f });
      liveBuf.current = liveBuf.current.filter((x) => now - x.t <= WINDOW_MS);
      if (now - lastClassify.current < CLASSIFY_EVERY || now < cooldownUntil.current) return;
      lastClassify.current = now;
      if (liveBuf.current.length < 6) {
        setGuess(null);
        streak.current = { label: null, n: 0 };
        return;
      }
      const r = classify(modelRef.current, liveBuf.current.map((x) => x.f));
      setGuess(r);
      if (r?.label && r.label === streak.current.label) streak.current.n += 1;
      else streak.current = { label: r?.label || null, n: r?.label ? 1 : 0 };
      // Butuh 2 hasil berturut-turut yang sama agar tidak "berkedip"
      if (streak.current.label && streak.current.n >= 2) {
        onRecognizedRef.current?.(streak.current.label, r.confidence);
        cooldownUntil.current = now + COOLDOWN_MS;
        liveBuf.current = [];
        streak.current = { label: null, n: 0 };
      }
    };
    return () => {
      frameSinkRef.current = null;
    };
  }, [frameSinkRef]);

  const startRecording = () => {
    const name = label.trim();
    if (!name) return showToast('Tulis kata/arti isyarat terlebih dahulu.');
    if (!cameraReady) return showToast('Nyalakan kamera dan tunggu tracking tangan siap.');
    setRecognizing(false);
    setPhase('countdown');
    let n = 3;
    setCountdown(n);
    const tick = () => {
      n -= 1;
      if (n > 0) {
        setCountdown(n);
        timers.current.push(setTimeout(tick, 700));
        return;
      }
      recordBuf.current = [];
      setPhase('recording');
      timers.current.push(
        setTimeout(() => {
          setPhase('idle');
          const frames = recordBuf.current;
          if (frames.length < 6) {
            showToast('Tangan tidak cukup terlihat. Coba rekam ulang.');
            return;
          }
          setSamples((prev) => [...prev, { label: name, frames: resample(frames), at: Date.now() }]);
          showToast(`Contoh "${name}" tersimpan.`);
        }, RECORD_MS),
      );
    };
    timers.current.push(setTimeout(tick, 700));
  };

  const removeLabel = (name) => {
    if (!window.confirm(`Hapus semua contoh untuk "${name}"?`)) return;
    setSamples((prev) => prev.filter((s) => s.label !== name));
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ app: 'SIGNARY', version: 1, samples }, null, 0)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `signary-data-isyarat-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = async (file) => {
    try {
      const data = JSON.parse(await file.text());
      const incoming = (data.samples || []).filter(
        (s) => typeof s.label === 'string' && Array.isArray(s.frames) && s.frames.length && Array.isArray(s.frames[0]),
      );
      if (!incoming.length) throw new Error('kosong');
      setSamples((prev) => [...prev, ...incoming]);
      showToast(`${incoming.length} contoh berhasil dimuat.`);
    } catch {
      showToast('File tidak valid. Gunakan file hasil "Unduh Data" SIGNARY.');
    }
  };

  const readyLabels = model?.labels || [];

  return (
    <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-4 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Brain className="w-4 h-4 text-primary-600" /> Pengenal Isyarat Pribadi
          </h4>
          <p className="text-[0.6875rem] text-slate-500 leading-relaxed">
            Rekam minimal {MIN_SAMPLES_PER_LABEL} contoh per kata, lalu kamera akan mengenalinya. Data disimpan di browser ini saja.
          </p>
        </div>
        <button
          onClick={() => {
            if (!readyLabels.length) return showToast(`Rekam minimal ${MIN_SAMPLES_PER_LABEL} contoh untuk satu kata dulu.`);
            if (!cameraReady) return showToast('Nyalakan kamera terlebih dahulu.');
            liveBuf.current = [];
            setGuess(null);
            setRecognizing((v) => !v);
          }}
          disabled={phase !== 'idle'}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 disabled:opacity-50 ${
            recognizing ? 'bg-amber-500 text-white' : 'bg-primary-600 hover:bg-primary-700 text-white'
          }`}
        >
          {recognizing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          {recognizing ? 'Berhenti' : 'Mulai Mengenali'}
        </button>
      </div>

      {recognizing && (
        <div className="p-3 rounded-2xl bg-slate-900 text-white text-xs flex items-center justify-between gap-3" aria-live="polite">
          <span className="text-slate-300">Tebakan saat ini:</span>
          <span className="font-bold text-sm">
            {guess?.label ? `${guess.label} (${Math.round(guess.confidence * 100)}%)` : guess ? 'Tidak dikenali' : 'Menunggu gerakan…'}
          </span>
        </div>
      )}

      {/* Rekam contoh */}
      <div className="space-y-2">
        <label htmlFor="rec-label" className="block text-[0.6875rem] font-bold text-slate-500 uppercase tracking-wider">
          Kata / arti isyarat yang direkam
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            id="rec-label"
            list="rec-label-suggestions"
            value={label}
            onChange={(e) => {
              setLabel(e.target.value);
              onLabelPick?.(e.target.value);
            }}
            placeholder="Contoh: Halo"
            className="flex-1 min-w-0 px-3.5 py-2.5 bg-white/90 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
          />
          <datalist id="rec-label-suggestions">
            {suggestions.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
          <button
            onClick={startRecording}
            disabled={phase !== 'idle'}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 text-white ${
              phase === 'recording' ? 'bg-red-600' : phase === 'countdown' ? 'bg-amber-500' : 'bg-slate-900 hover:bg-slate-800'
            }`}
          >
            {phase === 'recording' ? <Square className="w-3.5 h-3.5 fill-white" /> : <Circle className="w-3.5 h-3.5 fill-red-500 text-red-500" />}
            {phase === 'countdown' ? `Bersiap… ${countdown}` : phase === 'recording' ? 'Merekam…' : 'Rekam Contoh (1,5 dtk)'}
          </button>
        </div>
        <p className="text-[0.6875rem] text-slate-400">
          Tip: rekam dengan sedikit variasi (posisi & kecepatan) agar pengenalan lebih andal. Lakukan isyarat dari awal sampai akhir dalam 1,5 detik.
        </p>
      </div>

      {/* Daftar kata */}
      {labels.length > 0 ? (
        <ul className="divide-y divide-slate-200/70 border border-slate-200/70 rounded-2xl overflow-hidden">
          {labels.map((name) => {
            const n = counts[name];
            const ready = n >= MIN_SAMPLES_PER_LABEL;
            return (
              <li key={name} className="flex items-center justify-between gap-2 px-3 py-2 bg-white/60 text-xs">
                <button onClick={() => setLabel(name)} className="font-bold text-slate-800 hover:text-primary-600 text-left truncate">
                  {name}
                </button>
                <span className="flex items-center gap-2 shrink-0">
                  <span className={`px-2 py-0.5 rounded-full font-bold ${ready ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {n} contoh{ready ? ' ✓' : ` (kurang ${MIN_SAMPLES_PER_LABEL - n})`}
                  </span>
                  <button onClick={() => removeLabel(name)} className="p-1 text-slate-400 hover:text-red-600" aria-label={`Hapus ${name}`} title="Hapus">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-xs text-slate-500 italic">Belum ada contoh. Nyalakan kamera, tulis kata, lalu tekan "Rekam Contoh".</p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={exportData}
          disabled={!samples.length}
          className="px-3 py-1.5 rounded-lg text-[0.6875rem] font-bold border border-slate-200 bg-white/80 text-slate-600 hover:text-primary-600 disabled:opacity-40 flex items-center gap-1"
        >
          <Download className="w-3.5 h-3.5" /> Unduh Data
        </button>
        <label className="px-3 py-1.5 rounded-lg text-[0.6875rem] font-bold border border-slate-200 bg-white/80 text-slate-600 hover:text-primary-600 cursor-pointer flex items-center gap-1">
          <Upload className="w-3.5 h-3.5" /> Muat Data
          <input
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={(e) => {
              if (e.target.files?.[0]) importData(e.target.files[0]);
              e.target.value = '';
            }}
          />
        </label>
        {samples.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Hapus semua contoh isyarat yang direkam?')) setSamples([]);
            }}
            className="px-3 py-1.5 rounded-lg text-[0.6875rem] font-bold text-red-600 hover:bg-red-50"
          >
            Hapus Semua
          </button>
        )}
      </div>

      <p className="flex items-start gap-1.5 text-[0.6875rem] text-slate-500 leading-relaxed">
        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
        Model ini mengenali kata yang Anda rekam sendiri (satu tangan, posisi & gerak). Akurasinya bergantung pada jumlah dan
        keragaman contoh, dan paling cocok untuk orang yang merekamnya. Data bisa diunduh untuk dikumpulkan bersama komunitas Tuli.
      </p>
    </div>
  );
}
