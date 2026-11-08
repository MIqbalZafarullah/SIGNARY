import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Video, VideoOff, CheckCircle2, XCircle, Loader2, Hand, Trophy, ArrowRight, Info } from 'lucide-react';
import SignAnimator from '../sign/SignAnimator';
import useCameraStream from '../../lib/useCameraStream';
import useHandTracking from '../../lib/useHandTracking';
import { analyzeHand, evaluateShape, PRACTICE_TARGETS } from '../../lib/handShape';
import { letterSign } from '../../data/signLibrary';
import { usePersistentState } from '../../lib/storage';
import { usePreferences } from '../../lib/preferences';

const HOLD_MS = 900; // bentuk harus bertahan sebentar agar dihitung berhasil
const XP_PER_TARGET = 25;

/**
 * Latihan bentuk tangan dengan umpan balik kamera secara langsung.
 * Membandingkan keadaan tiap jari (dari MediaPipe) dengan target huruf SIBI.
 */
export default function HandPractice({ addXp, showToast }) {
  const { prefs } = usePreferences();
  const [targetId, setTargetId] = usePersistentState('practiceTarget', 'A');
  const [mastered, setMastered] = usePersistentState('practiceMastered', {});
  const [evaluation, setEvaluation] = useState(null);
  const [handVisible, setHandVisible] = useState(false);
  const [success, setSuccess] = useState(false);
  const [holdPct, setHoldPct] = useState(0);

  const camera = useCameraStream();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const holdStart = useRef(0);
  const lastKey = useRef('');
  const successRef = useRef(false);

  const target = PRACTICE_TARGETS.find((t) => t.id === targetId) || PRACTICE_TARGETS[0];
  const demoSign = useMemo(() => letterSign(target.id), [target.id]);

  useEffect(() => {
    if (videoRef.current && camera.stream) videoRef.current.srcObject = camera.stream;
  }, [camera.stream]);

  // Reset saat target berganti
  useEffect(() => {
    setSuccess(false);
    successRef.current = false;
    setEvaluation(null);
    setHoldPct(0);
    holdStart.current = 0;
    lastKey.current = '';
  }, [targetId]);

  const onResult = (result) => {
    const world = result.worldLandmarks?.[0];
    const visible = !!world;
    setHandVisible((v) => (v === visible ? v : visible));
    if (!visible) {
      holdStart.current = 0;
      setHoldPct(0);
      return;
    }
    const analysis = analyzeHand(world);
    const ev = evaluateShape(analysis, target);
    const key = ev.checks.map((c) => (c.ok ? 1 : 0)).join('');
    if (key !== lastKey.current) {
      lastKey.current = key;
      setEvaluation(ev);
    }
    if (successRef.current) return;
    if (ev.ok) {
      if (!holdStart.current) holdStart.current = performance.now();
      const pct = Math.min(100, ((performance.now() - holdStart.current) / HOLD_MS) * 100);
      setHoldPct(Math.round(pct / 10) * 10);
      if (pct >= 100) {
        successRef.current = true;
        setSuccess(true);
        if (!mastered[target.id]) {
          setMastered((m) => ({ ...m, [target.id]: true }));
          addXp?.(XP_PER_TARGET);
          showToast?.(`Huruf ${target.id} dikuasai! +${XP_PER_TARGET} XP`);
        } else {
          showToast?.(`Bagus! Huruf ${target.id} benar.`);
        }
      }
    } else {
      holdStart.current = 0;
      setHoldPct(0);
    }
  };

  const tracking = useHandTracking(videoRef, canvasRef, !!camera.stream, {
    onResult,
    color: success ? '#10b981' : evaluation?.ok ? '#22c55e' : undefined,
  });

  const nextTarget = () => {
    const i = PRACTICE_TARGETS.findIndex((t) => t.id === target.id);
    setTargetId(PRACTICE_TARGETS[(i + 1) % PRACTICE_TARGETS.length].id);
  };

  const masteredCount = PRACTICE_TARGETS.filter((t) => mastered[t.id]).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Kamera */}
      <div className="lg:col-span-7 liquid-glass rounded-[32px] border border-white/80 p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Latihan Bentuk Tangan</h3>
            <p className="text-xs text-slate-500">Tirukan huruf target di depan kamera. Jari diperiksa satu per satu.</p>
          </div>
          <button
            onClick={() => (camera.stream ? camera.stop() : camera.start(prefs.cameraQuality))}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 ${
              camera.stream ? 'bg-red-50 text-red-600 border border-red-200/60' : 'liquid-btn-primary text-white'
            }`}
          >
            {camera.stream ? <VideoOff className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
            {camera.stream ? 'Matikan Kamera' : 'Nyalakan Kamera'}
          </button>
        </div>

        <div className="relative aspect-[4/3] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800">
          {camera.stream ? (
            <>
              <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover -scale-x-100" />
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover -scale-x-100 pointer-events-none" />

              <div className="absolute top-3 left-3 flex items-center gap-2 bg-slate-950/75 px-3 py-1.5 rounded-full text-[0.625rem] text-white font-bold">
                {tracking.status === 'loading' && <Loader2 className="w-3 h-3 animate-spin text-sky-400" />}
                {tracking.status === 'loading'
                  ? 'Memuat model…'
                  : tracking.status === 'error'
                    ? 'Model gagal dimuat'
                    : handVisible
                      ? 'Tangan terdeteksi'
                      : 'Tunjukkan satu tangan ke kamera'}
              </div>
              <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-white/95 text-slate-900 text-sm font-black shadow">
                Target: {target.id}
              </div>

              {/* Indikator tahan posisi */}
              {!success && holdPct > 0 && (
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                    <div className="h-full bg-emerald-400 transition-all" style={{ width: `${holdPct}%` }} />
                  </div>
                  <p className="mt-1 text-center text-[0.6875rem] font-bold text-white drop-shadow">Tahan posisinya…</p>
                </div>
              )}

              {success && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-emerald-900/55 backdrop-blur-[2px] text-white text-center p-4">
                  <Trophy className="w-12 h-12 text-amber-300" />
                  <p className="text-2xl font-black">Huruf {target.id} benar!</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSuccess(false);
                        successRef.current = false;
                        holdStart.current = 0;
                      }}
                      className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-xs font-bold"
                    >
                      Ulangi
                    </button>
                    <button onClick={nextTarget} className="px-4 py-2 rounded-xl bg-white text-emerald-800 text-xs font-bold flex items-center gap-1">
                      Huruf berikutnya <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center p-6">
              <Hand className="w-12 h-12 text-slate-600" />
              <p className="text-sm font-bold text-slate-300">Kamera belum menyala</p>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                Gambar kamera diproses di perangkat Anda dan tidak dikirim ke server.
              </p>
              {camera.error && <p className="text-xs font-semibold text-red-300">{camera.error}</p>}
              <button
                onClick={() => camera.start(prefs.cameraQuality)}
                disabled={camera.starting}
                className="mt-1 px-5 py-2.5 rounded-xl text-xs font-bold liquid-btn-primary text-white disabled:opacity-60"
              >
                Nyalakan Kamera
              </button>
            </div>
          )}
        </div>

        <p className="flex items-start gap-1.5 text-[0.6875rem] text-slate-500 leading-relaxed">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          Yang diperiksa adalah posisi tiap jari. Arah telapak dan gerakan belum dinilai, jadi tetap bandingkan dengan contoh peraga.
          Hasil terbaik: cahaya cukup, satu tangan, jarak ±50 cm dari kamera.
        </p>
      </div>

      {/* Target & umpan balik */}
      <div className="lg:col-span-5 space-y-5">
        <div className="liquid-glass rounded-[32px] border border-white/80 p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900">Pilih Huruf (SIBI)</h4>
            <span className="text-[0.6875rem] font-bold text-emerald-600">
              Dikuasai {masteredCount}/{PRACTICE_TARGETS.length}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {PRACTICE_TARGETS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTargetId(t.id)}
                aria-pressed={t.id === target.id}
                className={`relative py-2.5 rounded-xl text-base font-black border transition-all ${
                  t.id === target.id
                    ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                    : 'bg-white/80 text-slate-700 border-slate-200 hover:bg-primary-50'
                }`}
              >
                {t.id}
                {mastered[t.id] && <CheckCircle2 className="absolute -top-1.5 -right-1.5 w-4 h-4 text-emerald-500 bg-white rounded-full" />}
              </button>
            ))}
          </div>
        </div>

        <div className="liquid-glass rounded-[32px] border border-white/80 p-5 shadow-xl space-y-3">
          <h4 className="text-sm font-bold text-slate-900">Umpan Balik Langsung</h4>
          {!camera.stream ? (
            <p className="text-xs text-slate-500">Nyalakan kamera untuk melihat penilaian tiap jari.</p>
          ) : !handVisible || !evaluation ? (
            <p className="text-xs text-slate-500">Menunggu tangan terlihat di kamera…</p>
          ) : (
            <ul className="space-y-1.5" aria-live="polite">
              {evaluation.checks.map((c) => (
                <li
                  key={c.key}
                  className={`flex items-start gap-2 p-2 rounded-xl text-xs ${
                    c.ok ? 'bg-emerald-50 text-emerald-900' : 'bg-red-50 text-red-900'
                  }`}
                >
                  {c.ok ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
                  <span>
                    <strong>{c.label}:</strong> {c.ok ? `sudah ${c.expected}` : `harus ${c.expected} (sekarang ${c.actual})`}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <p className="text-xs text-slate-600 bg-slate-50 rounded-xl p-2.5 border border-slate-200/70">
            <strong>Tips {target.id}:</strong> {target.tip}
          </p>
        </div>

        <div className="liquid-glass rounded-[32px] border border-white/80 p-5 shadow-xl space-y-2">
          <h4 className="text-sm font-bold text-slate-900">Contoh Peraga: Huruf {target.id}</h4>
          <SignAnimator key={target.id} sign={demoSign} variant="compact" defaultMirror />
        </div>
      </div>
    </div>
  );
}
