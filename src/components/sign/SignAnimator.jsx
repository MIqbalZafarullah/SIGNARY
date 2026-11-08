import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, FlipHorizontal2, Gauge, Hand } from 'lucide-react';
import SignScene from './SignScene';
import { resolveHand, lerpHand } from './handModel';
import { SIGNS } from '../../data/signLibrary';

// Posisi istirahat (tangan turun, di luar bingkai)
const REST_R = { x: 48, y: 320, shape: 'open', yaw: 90 };
const REST_L = { x: 192, y: 320, shape: 'open', yaw: 90 };
const LOOP_PAUSE = 700;

const ease = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);

function buildTimeline(sign) {
  const poses = sign.steps.map((st) => ({
    r: resolveHand(st.r || REST_R),
    l: resolveHand(st.l || REST_L),
    face: st.face || sign.face,
    front: st.front,
  }));
  let acc = 0;
  const steps = sign.steps.map((st) => {
    const dur = st.dur ?? 600;
    const hold = st.hold ?? 600;
    const seg = { start: acc, holdStart: acc + dur, end: acc + dur + hold, dur };
    acc += dur + hold;
    return seg;
  });
  return { poses, steps, total: acc + LOOP_PAUSE };
}

function lerpPose(A, B, k) {
  return {
    r: lerpHand(A.r, B.r, k),
    l: lerpHand(A.l, B.l, k),
    face: k < 0.5 ? A.face : B.face,
    front: B.front,
  };
}

function poseAt(tl, t) {
  const last = tl.poses.length - 1;
  for (let i = 0; i <= last; i++) {
    const seg = tl.steps[i];
    if (t < seg.holdStart) {
      const from = i === 0 ? tl.poses[last] : tl.poses[i - 1];
      const k = ease(Math.min(1, Math.max(0, (t - seg.start) / (seg.dur || 1))));
      return { pose: lerpPose(from, tl.poses[i], k), index: i };
    }
    if (t < seg.end) return { pose: tl.poses[i], index: i };
  }
  return { pose: tl.poses[last], index: last };
}

// Bayangan pose sebelumnya hanya untuk tangan yang benar-benar berpindah
function ghostFor(tl, i) {
  if (i === 0) return null;
  const prev = tl.poses[i - 1];
  const cur = tl.poses[i];
  const moved = (a, b) => Math.hypot(a.x - b.x, a.y - b.y) > 8 || Math.abs(a.roll - b.roll) > 15;
  const g = {
    r: moved(prev.r, cur.r) && prev.r.y < 240 ? prev.r : null,
    l: moved(prev.l, cur.l) && prev.l.y < 240 ? prev.l : null,
  };
  return g.r || g.l ? g : null;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);
  return reduced;
}

/**
 * Animasi peraga bahasa isyarat + gambar per tahap.
 *
 * variant:
 *  - 'card'    : panggung kecil, diputar saat `active` (hover) atau diketuk.
 *  - 'full'    : panggung + kontrol + daftar gambar tiap tahap.
 *  - 'compact' : panggung + kontrol + teks tahap aktif (tanpa daftar gambar).
 */
export default function SignAnimator({
  signId,
  sign: signProp,
  variant = 'full',
  active,
  autoPlay = true,
  defaultMirror = false,
  className = '',
  onLoopEnd,
}) {
  const sign = signProp || SIGNS[signId];
  const tl = useMemo(() => (sign ? buildTimeline(sign) : null), [sign]);
  const reduced = usePrefersReducedMotion();
  const rawId = useId();
  const uid = `sg${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  const isCard = variant === 'card';
  const [selfPlaying, setSelfPlaying] = useState(!isCard && autoPlay);
  const [speed, setSpeed] = useState(1);
  const [mirror, setMirror] = useState(defaultMirror);
  const [t, setT] = useState(() => (tl ? tl.steps[0].holdStart : 0));
  const speedRef = useRef(speed);
  speedRef.current = speed;
  const onLoopEndRef = useRef(onLoopEnd);
  onLoopEndRef.current = onLoopEnd;
  const tRef = useRef(t);
  tRef.current = t;

  const playing = !!tl && (selfPlaying || (isCard && active)) && !(reduced && isCard && !selfPlaying);

  // Reset ketika isyarat berganti
  useEffect(() => {
    if (tl) setT(tl.steps[0].holdStart);
  }, [tl]);

  // Kartu kembali ke tahap 1 saat berhenti di-hover
  useEffect(() => {
    if (isCard && !playing && tl) setT(tl.steps[0].holdStart);
  }, [isCard, playing, tl]);

  // Respect prefers-reduced-motion: jangan putar otomatis
  useEffect(() => {
    if (reduced) setSelfPlaying(false);
  }, [reduced]);

  useEffect(() => {
    if (!playing || !tl) return undefined;
    let raf;
    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min(64, now - last);
      last = now;
      const next = tRef.current + dt * speedRef.current;
      if (next >= tl.total && onLoopEndRef.current) {
        // Satu putaran selesai: biarkan induk memutuskan (mis. lanjut ke isyarat berikutnya)
        tRef.current = tl.steps[0].holdStart;
        setT(tRef.current);
        onLoopEndRef.current();
      } else {
        tRef.current = next % tl.total;
        setT(tRef.current);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, tl]);

  const thumbs = useMemo(
    () => (tl ? tl.poses.map((pose, i) => ({ pose, ghost: ghostFor(tl, i) })) : []),
    [tl],
  );

  if (!sign || !tl) return null;

  const { pose, index } = poseAt(tl, t);
  const stepCount = sign.steps.length;

  const goTo = (i) => {
    const n = (i + stepCount) % stepCount;
    setSelfPlaying(false);
    setT(tl.steps[n].holdStart);
  };

  // ---------------------------------------------------------------- CARD
  if (isCard) {
    return (
      <div
        className={`relative w-full select-none cursor-pointer ${className}`}
        onClick={(e) => {
          e.stopPropagation();
          setSelfPlaying((p) => !p);
        }}
        title={playing ? 'Klik untuk berhenti' : 'Arahkan kursor / ketuk untuk memutar animasi'}
      >
        <SignScene pose={pose} mirror={mirror} markerId={uid} className="w-full h-40" title={`Animasi isyarat ${sign.title}`} />
        <div className="absolute top-1.5 left-1.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 border border-slate-200 text-[10px] font-bold text-slate-600">
          {playing ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          {stepCount} tahap
        </div>
        <div className="absolute bottom-1.5 left-0 right-0 flex justify-center gap-1">
          {sign.steps.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${i === index ? 'w-4 bg-orange-500' : 'w-1.5 bg-slate-300'}`}
            />
          ))}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------- FULL / COMPACT
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="relative rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-slate-200/70 overflow-hidden">
        <SignScene pose={pose} mirror={mirror} markerId={uid} className="w-full h-auto max-h-80 mx-auto block" title={`Animasi isyarat ${sign.title}`} />
        <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-white/90 border border-slate-200 text-[11px] font-bold text-slate-700 shadow-xs">
          Tahap {index + 1}/{stepCount}
        </div>
        <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-white/90 border border-slate-200 text-[10px] font-semibold text-slate-500 shadow-xs">
          {mirror ? 'Mode cermin' : 'Sudut pandang lawan bicara'}
        </div>
      </div>

      {/* Teks tahap aktif */}
      <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-orange-50/80 border border-orange-100 min-h-[3.5rem]">
        <span className="shrink-0 w-6 h-6 rounded-full bg-orange-500 text-white text-[11px] font-black flex items-center justify-center">
          {index + 1}
        </span>
        <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">{sign.steps[index].text}</p>
      </div>

      {/* Kontrol */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={() => goTo(index - 1)} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700" title="Tahap sebelumnya" aria-label="Tahap sebelumnya">
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setSelfPlaying((p) => !p)}
            className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold flex items-center gap-1.5"
          >
            {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {playing ? 'Jeda' : 'Putar'}
          </button>
          <button type="button" onClick={() => goTo(index + 1)} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700" title="Tahap berikutnya" aria-label="Tahap berikutnya">
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSpeed((s) => (s === 1 ? 0.5 : 1))}
            className={`px-2.5 py-2 rounded-xl text-[11px] font-bold flex items-center gap-1 border ${speed !== 1 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-white text-slate-600 border-slate-200'}`}
            title="Ubah kecepatan"
          >
            <Gauge className="w-3.5 h-3.5" />
            {speed === 1 ? '1x' : '0.5x'}
          </button>
          <button
            type="button"
            onClick={() => setMirror((m) => !m)}
            className={`px-2.5 py-2 rounded-xl text-[11px] font-bold flex items-center gap-1 border ${mirror ? 'bg-primary-50 text-primary-700 border-primary-200' : 'bg-white text-slate-600 border-slate-200'}`}
            title="Mode cermin: tangan kanan peraga tampil di kanan layar, seperti bercermin"
          >
            <FlipHorizontal2 className="w-3.5 h-3.5" />
            Cermin
          </button>
        </div>
      </div>

      {/* Gambar per tahap */}
      {variant === 'full' && (
        <div>
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            <Hand className="w-3.5 h-3.5" /> Gambar Gerakan per Tahap
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {thumbs.map((th, i) => (
              <button
                type="button"
                key={i}
                onClick={() => goTo(i)}
                className={`text-left rounded-2xl border p-1.5 transition-all ${
                  i === index ? 'border-orange-400 bg-orange-50/70 ring-2 ring-orange-200' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="relative rounded-xl bg-sky-50/70 overflow-hidden">
                  <SignScene pose={th.pose} ghost={th.ghost} mirror={mirror} markerId={`${uid}t${i}`} className="w-full h-auto block" title={`Tahap ${i + 1}`} />
                  <span className="absolute top-1 left-1 w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-black flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <p className="mt-1.5 px-1 text-[11px] leading-snug font-medium text-slate-600 line-clamp-3">{sign.steps[i].text}</p>
              </button>
            ))}
          </div>
          <p className="mt-2 text-[10px] text-slate-400 leading-relaxed">
            Bayangan samar = posisi tahap sebelumnya, panah oranye = arah gerakan.
          </p>
        </div>
      )}
    </div>
  );
}
