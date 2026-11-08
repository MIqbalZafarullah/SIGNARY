import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ArrowLeft,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Activity,
  Sparkles,
  Send,
  Layers,
  MessageSquare,
  ShieldAlert,
  Hand,
  Type,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import SignAnimator from '../components/sign/SignAnimator';
import RecognizerPanel from '../components/recognizer/RecognizerPanel';
import useSpeechRecognition from '../lib/useSpeechRecognition';
import useHandTracking from '../lib/useHandTracking';
import { speak, ttsSupported } from '../lib/speak';
import { textToSigns, SUPPORTED_WORDS } from '../lib/textToSign';
import { SIGNS } from '../data/signLibrary';
import { usePersistentState } from '../lib/storage';
import { usePreferences } from '../lib/preferences';

// Gestur dasar untuk panduan & mode demo terjemahan isyarat
const GESTURE_PRESETS = [
  { id: 'halo', label: '👋 Halo', text: 'Halo, selamat pagi.' },
  { id: 'terimaKasih', label: '🙏 Terima Kasih', text: 'Terima kasih banyak.' },
  { id: 'saya', label: '☝️ Saya', text: 'Saya Teman Tuli.' },
  { id: 'bagus', label: '👍 Bagus Sekali', text: 'Bagus sekali!' },
];

const TABS = [
  { id: 'suara', label: 'Suara ➔ Teks', icon: Mic },
  { id: 'gerakan', label: 'Isyarat ➔ Teks', icon: Video },
  { id: 'teks', label: 'Teks ➔ Isyarat', icon: Type },
];

const nowTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default function FeatureDetectionPage({ onNavigate, showToast }) {
  const [activeTab, setActiveTab] = useState('suara');
  const [isCopied, setIsCopied] = useState(false);
  const { prefs } = usePreferences();
  // Riwayat percakapan & preferensi bacakan tersimpan di browser
  const [conversation, setConversation] = usePersistentState('conversation', []);
  const [autoSpeak, setAutoSpeak] = usePersistentState('autoSpeak', true);
  const [draft, setDraft] = useState('');
  const canSpeak = ttsSupported();

  const addMessage = (sender, text, mode) => {
    setConversation((prev) => [
      ...prev.slice(-99),
      {
        id: `${Date.now()}-${Math.random()}`,
        sender,
        name: sender === 'deaf' ? 'Teman Tuli' : 'Pendengar',
        text,
        mode,
        time: nowTime(),
      },
    ]);
  };

  const speakText = (text) => {
    if (!speak(text)) showToast('Browser ini belum mendukung fitur bacakan teks.');
  };

  // Pesan dari Teman Tuli dibacakan untuk lawan bicara yang mendengar
  const sendDeafMessage = (text, mode) => {
    addMessage('deaf', text, mode);
    if (autoSpeak) speak(text);
  };

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setIsCopied(true);
    showToast('Teks berhasil disalin!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  // =============================================================== SUARA
  const [voiceResult, setVoiceResult] = useState('');
  const speech = useSpeechRecognition({
    lang: prefs.speechLang,
    onFinal: (text) => {
      setVoiceResult(text);
      addMessage('hearing', text, 'Suara ➔ Teks');
    },
  });

  useEffect(() => {
    if (speech.error) showToast(speech.error);
  }, [speech.error]); // eslint-disable-line react-hooks/exhaustive-deps

  // Hentikan mikrofon saat berpindah tab
  useEffect(() => {
    if (activeTab !== 'suara' && speech.listening) speech.stop();
  }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  const voiceStatus = !speech.supported
    ? 'Browser tidak mendukung'
    : speech.listening
      ? 'Mendengarkan…'
      : voiceResult
        ? 'Kalimat terakhir dikenali'
        : 'Siap mendengarkan';

  // ============================================================= GERAKAN
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [gestureResult, setGestureResult] = useState('');
  const [gestureSource, setGestureSource] = useState(null); // 'demo' | 'model'
  const frameSinkRef = useRef(null);
  const [guideId, setGuideId] = useState('halo');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const guidePreset = GESTURE_PRESETS.find((g) => g.id === guideId) || GESTURE_PRESETS[0];
  const tracking = useHandTracking(videoRef, canvasRef, !!cameraStream && activeTab === 'gerakan', {
    onResult: (result) => frameSinkRef.current?.(result),
  });

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraStream(null);
  };

  useEffect(() => {
    if (videoRef.current && cameraStream) videoRef.current.srcObject = cameraStream;
  }, [cameraStream, activeTab]);

  useEffect(() => () => streamRef.current?.getTracks().forEach((t) => t.stop()), []);

  const toggleCamera = async () => {
    if (isCameraOn) {
      stopStream();
      setIsCameraOn(false);
      return;
    }
    setIsCameraOn(true);
    if (navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            height: { ideal: Number(prefs.cameraQuality) || 720 },
            width: { ideal: Math.round(((Number(prefs.cameraQuality) || 720) * 16) / 9) },
          },
          audio: false,
        });
        streamRef.current = stream;
        setCameraStream(stream);
        return;
      } catch {
        showToast('Akses kamera ditolak/tidak tersedia. Menampilkan tampilan simulasi.');
      }
    }
  };

  const gestureStatus = !isCameraOn
    ? 'Kamera tidak aktif'
    : !cameraStream
      ? 'Tampilan simulasi (kamera tidak tersedia)'
      : tracking.status === 'loading'
        ? 'Memuat model tracking tangan…'
        : tracking.status === 'error'
          ? 'Model tracking gagal dimuat (butuh internet saat pertama kali)'
          : tracking.handCount > 0
            ? `${tracking.handCount} tangan terdeteksi`
            : 'Arahkan tangan ke kamera';

  const handlePreset = (g) => {
    setGuideId(g.id);
    setGestureSource('demo');
    setGestureResult(g.text);
    sendDeafMessage(g.text, 'Isyarat ➔ Teks (Mode Demo)');
  };

  // Hasil pengenal isyarat pribadi (model dari contoh rekaman pengguna)
  const handleRecognized = (label) => {
    setGestureSource('model');
    setGestureResult(label);
    sendDeafMessage(label, 'Isyarat ➔ Teks (model pribadi)');
  };

  const recognizerSuggestions = useMemo(
    () => [...new Set([...GESTURE_PRESETS.map((g) => SIGNS[g.id]?.title), ...Object.values(SIGNS).map((x) => x.title)].filter(Boolean))],
    [],
  );

  const pickGuideForLabel = (label) => {
    const hit = Object.entries(SIGNS).find(([, v]) => v.title.toLowerCase() === label.trim().toLowerCase());
    if (hit) setGuideId(hit[0]);
  };

  // ================================================================ TEKS
  const [signInput, setSignInput] = useState('');
  const [signText, setSignText] = useState('');
  const [signIndex, setSignIndex] = useState(0);
  const [playSequence, setPlaySequence] = useState(true);
  const [spellUnknown, setSpellUnknown] = usePersistentState('spellUnknown', true);
  const tokens = useMemo(() => textToSigns(signText, { spell: spellUnknown }), [signText, spellUnknown]);
  const matched = useMemo(
    () => tokens.map((tk, i) => ({ ...tk, i })).filter((tk) => tk.signId || tk.sign),
    [tokens],
  );
  const current = matched[Math.min(signIndex, Math.max(0, matched.length - 1))];

  const showInSigns = (text) => {
    setSignInput(text);
    setSignText(text);
    setSignIndex(0);
    setPlaySequence(true);
    setActiveTab('teks');
  };

  const nextSign = () => {
    if (!playSequence) return;
    setSignIndex((i) => (i + 1 < matched.length ? i + 1 : i));
    if (signIndex + 1 >= matched.length) setPlaySequence(false);
  };

  // ============================================================== OUTPUT
  const outputText =
    activeTab === 'suara' ? voiceResult : activeTab === 'gerakan' ? gestureResult : signText;
  const outputStatus =
    activeTab === 'suara' ? voiceStatus : activeTab === 'gerakan' ? gestureStatus : `${matched.length} isyarat ditemukan`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('dashboard')}
            className="p-2.5 rounded-2xl liquid-glass text-slate-600 hover:text-primary-600 hover:border-primary-200 transition-all duration-200 active:scale-95 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Live Interpreter Multimodal</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[0.6875rem] font-bold bg-amber-50 text-amber-700 border border-amber-200/80">
                Prototype
              </span>
            </div>
            <p className="text-sm text-slate-500 font-medium">
              Jembatan komunikasi dua arah: suara ➔ teks, teks ➔ isyarat, dan teks ➔ suara.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('kamus')}
            className="px-4 py-2 rounded-xl text-xs font-bold glass-pill text-slate-700 hover:text-primary-600 hover:bg-primary-50 transition-all"
          >
            Buka Kamus Kosakata
          </button>
          <button
            onClick={() => onNavigate('academy')}
            className="px-4 py-2 rounded-xl text-xs font-bold liquid-btn-primary text-white transition-all shadow-sm"
          >
            Latihan di Academy
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="liquid-glass p-1.5 rounded-2xl flex max-w-2xl w-full shadow-lg border border-white/80">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 py-3 px-1 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 ${
                activeTab === id
                  ? 'bg-gradient-to-r from-primary-600 to-blue-600 text-white shadow-md shadow-primary-500/25'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ============================ KIRI: WORKSPACE ============================ */}
        <div className="lg:col-span-7 space-y-6">
          {/* ---------------------------- SUARA ---------------------------- */}
          {activeTab === 'suara' && (
            <div className="liquid-glass rounded-[36px] border border-white/80 p-6 sm:p-8 shadow-2xl text-center space-y-6">
              <div className="flex items-center justify-between gap-3">
                <div className="text-left">
                  <h3 className="text-lg font-bold text-slate-900">Input Suara (Mikrofon)</h3>
                  <p className="text-xs text-slate-500">Ucapan diubah menjadi teks secara langsung.</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary-50 text-primary-700 border border-primary-100 flex items-center gap-1.5 shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-primary-600" />
                  {prefs.speechLang === 'en-US' ? 'English (US)' : 'Bahasa Indonesia'}
                </span>
              </div>

              <div className="min-h-64 bg-slate-900/90 rounded-3xl border border-slate-800 flex flex-col items-center justify-center p-6 pb-14 relative overflow-hidden shadow-inner text-white">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:16px_16px] opacity-20"></div>

                {!speech.supported ? (
                  <div className="relative z-10 flex flex-col items-center gap-3 max-w-sm">
                    <AlertTriangle className="w-10 h-10 text-amber-400" />
                    <p className="text-sm font-bold">Browser ini belum mendukung pengenalan suara.</p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Buka SIGNARY di Google Chrome atau Microsoft Edge (desktop/Android) untuk memakai fitur Suara ➔ Teks.
                    </p>
                  </div>
                ) : speech.listening ? (
                  <div className="relative z-10 flex flex-col items-center gap-4 w-full">
                    <div className="flex items-center gap-2 h-16">
                      {[8, 14, 20, 16, 10, 18, 12].map((h, i) => (
                        <div
                          key={i}
                          className="w-2 bg-sky-400 rounded-full animate-bounce"
                          style={{ height: `${h * 4}px`, animationDelay: `${(i * 90) % 400}ms` }}
                        ></div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                      MENDENGARKAN…
                    </div>
                    <p className="text-base font-semibold text-white/90 min-h-6 max-w-md">
                      {speech.interim || <span className="text-slate-500 text-sm font-medium">Silakan bicara…</span>}
                    </p>
                  </div>
                ) : (
                  <div className="relative z-10 flex flex-col items-center gap-3 text-slate-400">
                    <div className="w-20 h-20 bg-slate-800/80 rounded-full flex items-center justify-center border border-slate-700 text-slate-300 shadow-lg">
                      <Mic className="w-10 h-10" />
                    </div>
                    <p className="text-xs text-slate-400 font-medium max-w-xs">
                      Tekan tombol di bawah, izinkan mikrofon, lalu bicara dengan jelas.
                    </p>
                  </div>
                )}

                <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between gap-2 text-[0.6875rem] font-bold text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-primary-400" />
                    {prefs.speechLang}
                  </span>
                  <span>Status: {voiceStatus}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => (speech.listening ? speech.stop() : speech.start())}
                  disabled={!speech.supported}
                  className={`px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                    speech.listening
                      ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20 active:scale-95'
                      : 'liquid-btn-primary text-white active:scale-95'
                  }`}
                >
                  {speech.listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  {speech.listening ? 'Berhenti Mendengarkan' : 'Mulai Mendengarkan'}
                </button>
                <button
                  onClick={() => showInSigns(voiceResult)}
                  disabled={!voiceResult}
                  className="px-5 py-4 rounded-2xl font-bold text-xs glass-pill text-slate-700 hover:bg-white active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <Hand className="w-4 h-4" />
                  Tampilkan dalam Isyarat
                </button>
              </div>

              <p className="text-[0.6875rem] text-slate-400 leading-relaxed">
                Tips akurasi: bicara jelas dan tidak terlalu cepat, dekatkan mikrofon, hindari tempat bising.
                Istilah khusus atau bahasa daerah bisa salah dikenali.
              </p>
            </div>
          )}

          {/* --------------------------- GERAKAN --------------------------- */}
          {activeTab === 'gerakan' && (
            <div className="liquid-glass rounded-[36px] border border-white/80 p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Kamera &amp; Tracking Tangan</h3>
                  <p className="text-xs text-slate-500">21 titik sendi tangan dideteksi langsung di perangkat Anda (MediaPipe).</p>
                </div>
                <button
                  onClick={toggleCamera}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 active:scale-95 shrink-0 ${
                    isCameraOn ? 'bg-red-50 text-red-600 border border-red-200/60' : 'glass-pill text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  {isCameraOn ? <VideoOff className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
                  {isCameraOn ? 'Matikan Kamera' : 'Nyalakan Kamera'}
                </button>
              </div>

              <div className="relative aspect-[16/10] bg-slate-950 rounded-3xl overflow-hidden flex items-center justify-center border border-slate-800 shadow-inner">
                {isCameraOn ? (
                  <div className="absolute inset-0 bg-slate-900">
                    {cameraStream ? (
                      <>
                        <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover -scale-x-100" />
                        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover -scale-x-100 pointer-events-none" />
                      </>
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:16px_16px] opacity-25"></div>
                        <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 600 400">
                          <path
                            d="M 300,340 L 260,280 L 240,220 M 300,340 L 290,260 L 285,180 M 300,340 L 320,260 L 325,170 M 300,340 L 350,270 L 360,190 M 300,340 L 380,300 L 410,260"
                            stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" fill="none"
                          />
                        </svg>
                      </>
                    )}

                    {/* HUD */}
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-slate-950/70 px-3 py-1.5 rounded-full backdrop-blur-md text-[0.625rem] text-white font-bold border border-slate-700/60">
                      {tracking.status === 'loading' ? (
                        <Loader2 className="w-3 h-3 animate-spin text-sky-400" />
                      ) : (
                        <span className={`w-2.5 h-2.5 rounded-full ${cameraStream ? 'bg-red-600 animate-pulse' : 'bg-slate-500'}`}></span>
                      )}
                      {cameraStream ? 'KAMERA PERANGKAT' : 'SIMULASI'}
                    </div>
                    {cameraStream && tracking.status === 'ready' && (
                      <div className="absolute top-4 right-4 flex items-center gap-2 bg-slate-950/70 px-3 py-1.5 rounded-full backdrop-blur-md text-[0.625rem] text-sky-400 font-bold border border-slate-700/60">
                        <Layers className="w-3 h-3" />
                        {tracking.handCount} tangan • {tracking.fps} FPS
                      </div>
                    )}

                    {/* Panduan gerakan (picture-in-picture) */}
                    <div className="absolute top-14 right-4 w-24 sm:w-32 rounded-2xl bg-white/95 border border-white shadow-lg overflow-hidden z-10">
                      <SignAnimator key={guideId} signId={guideId} variant="card" active defaultMirror />
                      <div className="px-2 pb-1.5 text-[0.625rem] font-bold text-slate-700 text-center truncate">
                        Tirukan: {guidePreset.label}
                      </div>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-[0.6875rem] text-slate-300 bg-slate-950/80 px-4 py-2 rounded-2xl backdrop-blur-md border border-slate-800">
                      Status: <strong className="text-white font-semibold">{gestureStatus}</strong>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-slate-500 p-6 text-center">
                    <VideoOff className="w-12 h-12 text-slate-600" />
                    <span className="text-sm font-bold text-slate-300">Kamera Dinonaktifkan</span>
                    <span className="text-xs text-slate-400 max-w-xs leading-relaxed font-medium">
                      Gambar kamera diproses di perangkat Anda dan tidak dikirim ke server.
                    </span>
                    <button onClick={toggleCamera} className="mt-2 px-5 py-2.5 rounded-xl text-xs font-bold liquid-btn-primary text-white">
                      Nyalakan Kamera Sekarang
                    </button>
                  </div>
                )}
              </div>

              {/* Pengenal isyarat sungguhan (few-shot) */}
              <RecognizerPanel
                frameSinkRef={frameSinkRef}
                cameraReady={!!cameraStream && tracking.status === 'ready'}
                suggestions={recognizerSuggestions}
                onRecognized={handleRecognized}
                onLabelPick={pickGuideForLabel}
                showToast={showToast}
              />

              {/* Mode demo untuk presentasi */}
              <div className="space-y-3">
                <div className="flex items-start gap-2 p-3 rounded-2xl bg-amber-50 border border-amber-200/80 text-[0.6875rem] leading-relaxed text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Mode Demo:</strong> tombol di bawah menampilkan panduan gerakan dan mensimulasikan hasil terjemahan tanpa
                    model (berguna untuk presentasi). Hasilnya ditandai "Mode Demo".
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {GESTURE_PRESETS.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => handlePreset(g)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 text-center ${
                        guideId === g.id
                          ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25'
                          : 'glass-pill text-slate-700 hover:bg-primary-50 hover:text-primary-600'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-900">Panduan Gerakan: {SIGNS[guideId]?.title}</h4>
                  <span className="text-[0.625rem] font-semibold text-slate-400">Mode cermin aktif agar mudah ditirukan</span>
                </div>
                <SignAnimator key={guideId} signId={guideId} variant="full" defaultMirror />
              </div>
            </div>
          )}

          {/* ----------------------------- TEKS ---------------------------- */}
          {activeTab === 'teks' && (
            <div className="liquid-glass rounded-[36px] border border-white/80 p-6 sm:p-8 shadow-2xl space-y-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Teks ➔ Isyarat</h3>
                <p className="text-xs text-slate-500">Ketik kalimat, lalu peraga memperagakan kata yang sudah ada di kamus secara berurutan.</p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  showInSigns(signInput);
                }}
                className="flex flex-col sm:flex-row gap-2"
              >
                <input
                  type="text"
                  value={signInput}
                  onChange={(e) => setSignInput(e.target.value)}
                  placeholder="Contoh: Halo, terima kasih, saya senang belajar"
                  className="flex-1 px-4 py-3 bg-white/90 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                />
                <button type="submit" className="px-5 py-3 rounded-2xl liquid-btn-primary text-white text-xs font-bold flex items-center justify-center gap-1.5">
                  <Hand className="w-4 h-4" />
                  Tampilkan Isyarat
                </button>
              </form>

              {signText && (
                <div className="flex flex-wrap gap-1.5">
                  {tokens.map((tk, i) =>
                    tk.signId || tk.sign ? (
                      <button
                        key={i}
                        onClick={() => {
                          setPlaySequence(false);
                          setSignIndex(matched.findIndex((m) => m.i === i));
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                          current?.i === i
                            ? 'bg-orange-500 text-white border-orange-500'
                            : tk.signId
                              ? 'bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100'
                              : 'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100'
                        }`}
                        title={tk.signId ? 'Isyarat dari kamus' : 'Dieja dengan abjad jari'}
                      >
                        {tk.signId ? tk.text : `${tk.text} (eja)`}
                      </button>
                    ) : (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 border border-dashed border-slate-300"
                        title="Belum ada di kamus SIGNARY"
                      >
                        {tk.text}
                      </span>
                    ),
                  )}
                </div>
              )}

              {signText && current ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-900">
                      {current.signId ? SIGNS[current.signId].title : current.sign.title}
                      <span className="ml-2 text-xs font-semibold text-slate-400">
                        ({matched.indexOf(current) + 1}/{matched.length})
                      </span>
                    </h4>
                    {matched.length > 1 && (
                      <button
                        onClick={() => {
                          setSignIndex(0);
                          setPlaySequence(true);
                        }}
                        className="text-[0.6875rem] font-bold text-primary-600 hover:text-primary-700"
                      >
                        Putar ulang dari awal
                      </button>
                    )}
                  </div>
                  <SignAnimator
                    key={`${current.i}-${current.signId || current.text}`}
                    signId={current.signId || undefined}
                    sign={current.sign || undefined}
                    variant="compact"
                    onLoopEnd={matched.length > 1 ? nextSign : undefined}
                  />
                </div>
              ) : signText ? (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  Belum ada kata yang cocok dengan kamus SIGNARY. Aktifkan "Eja kata lain" untuk mengeja dengan abjad jari.
                </div>
              ) : null}

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={spellUnknown}
                  onChange={(e) => setSpellUnknown(e.target.checked)}
                  className="w-4 h-4 accent-primary-600"
                />
                Eja kata lain dengan abjad jari SIBI (A–Z)
              </label>

              <p className="text-[0.6875rem] text-slate-400 leading-relaxed">
                <strong className="text-slate-500">Kata di kamus:</strong> {SUPPORTED_WORDS.join(', ')}. Kata berwarna ungu dieja per huruf;
                kata bergaris putus-putus tidak diperagakan.
              </p>
            </div>
          )}
        </div>

        {/* ============================ KANAN: OUTPUT ============================ */}
        <div className="lg:col-span-5 space-y-6">
          <div className="liquid-glass rounded-[36px] border border-white/80 p-6 md:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-slate-900">Hasil Terjemahan</h4>
                {activeTab === 'gerakan' && gestureSource === 'demo' && (
                  <span className="text-[0.625rem] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">Mode Demo</span>
                )}
                {activeTab === 'gerakan' && gestureSource === 'model' && (
                  <span className="text-[0.625rem] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Model Pribadi</span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => speakText(outputText)}
                  disabled={!outputText || !canSpeak}
                  className="p-2.5 glass-pill hover:bg-white disabled:opacity-40 text-slate-600 transition-all duration-200 active:scale-95"
                  title="Bacakan teks"
                  aria-label="Bacakan teks"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleCopy(outputText)}
                  disabled={!outputText}
                  className="p-2.5 glass-pill hover:bg-white disabled:opacity-40 text-slate-600 transition-all duration-200 active:scale-95"
                  title="Salin teks"
                  aria-label="Salin teks"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="min-h-40 bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/70 p-6 flex flex-col justify-between shadow-inner">
              <div>
                {outputText ? (
                  <p className="text-lg font-bold text-slate-900 leading-relaxed">"{outputText}"</p>
                ) : (
                  <p className="text-sm text-slate-400 italic font-medium">
                    {activeTab === 'suara'
                      ? 'Belum ada ucapan. Tekan "Mulai Mendengarkan" lalu bicara.'
                      : activeTab === 'gerakan'
                        ? 'Rekam contoh isyarat lalu tekan "Mulai Mengenali", atau pakai tombol demo.'
                        : 'Ketik kalimat untuk ditampilkan dalam bahasa isyarat.'}
                  </p>
                )}
                {activeTab === 'suara' && speech.interim && (
                  <p className="mt-2 text-sm text-slate-400 italic">{speech.interim}…</p>
                )}
              </div>
              <div className="text-[0.6875rem] font-bold text-slate-400 uppercase tracking-wider pt-4 border-t border-slate-200/50 mt-4">
                Status: {outputStatus}
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-200/80 text-amber-900 rounded-2xl p-4 text-xs leading-relaxed flex items-start gap-3 backdrop-blur-md">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p>
                  <span className="font-bold">Kamera:</span> tracking tangan diproses di perangkat, gambar tidak dikirim ke server.
                </p>
                <p>
                  <span className="font-bold">Suara:</span> memakai pengenalan suara bawaan browser. Di Chrome/Edge, audio diproses oleh server
                  penyedia browser.
                </p>
                <p>
                  <span className="font-bold">Isyarat ➔ Teks:</span> mengenali kata yang Anda rekam sendiri (model pribadi, di perangkat).
                  Tombol demo hanya simulasi.
                </p>
              </div>
            </div>
          </div>

          {/* Percakapan dua arah */}
          <div className="liquid-glass rounded-[36px] border border-white/80 p-6 md:p-8 shadow-xl space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary-600" />
                <h4 className="text-sm font-bold text-slate-800">Percakapan Dua Arah</h4>
              </div>
              <div className="flex items-center gap-3">
                {canSpeak && (
                  <button
                    onClick={() => setAutoSpeak((v) => !v)}
                    className={`flex items-center gap-1 text-[0.6875rem] font-semibold ${autoSpeak ? 'text-primary-600' : 'text-slate-400'}`}
                    title="Bacakan otomatis pesan dari Teman Tuli"
                  >
                    {autoSpeak ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                    Bacakan otomatis
                  </button>
                )}
                <button onClick={() => setConversation([])} className="text-[0.6875rem] text-slate-400 hover:text-slate-600 font-semibold">
                  Bersihkan
                </button>
              </div>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {conversation.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6 italic leading-relaxed">
                  Belum ada percakapan. Ucapan dari pendengar dan pesan dari Teman Tuli akan muncul di sini.
                </p>
              ) : (
                conversation.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3.5 rounded-2xl text-xs space-y-1 ${
                      msg.sender === 'hearing'
                        ? 'bg-primary-50/80 border border-primary-100 text-primary-950 ml-4'
                        : 'bg-white/80 border border-slate-200/80 text-slate-900 mr-4'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-[0.625rem] text-slate-500 font-medium">
                      <span className="font-bold">{msg.name}</span>
                      <span>
                        {msg.time} • {msg.mode}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-slate-800 leading-relaxed">{msg.text}</p>
                      <div className="flex items-center gap-1 shrink-0">
                        {msg.sender === 'hearing' && (
                          <button
                            onClick={() => showInSigns(msg.text)}
                            className="p-1 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-white"
                            title="Tampilkan dalam isyarat"
                            aria-label="Tampilkan dalam isyarat"
                          >
                            <Hand className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {canSpeak && (
                          <button
                            onClick={() => speakText(msg.text)}
                            className="p-1 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-white"
                            title="Bacakan"
                            aria-label="Bacakan"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Teman Tuli mengetik, lalu pesan dibacakan untuk pendengar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const text = draft.trim();
                if (!text) return;
                sendDeafMessage(text, 'Teks ➔ Suara');
                setDraft('');
              }}
              className="flex items-center gap-2 pt-1"
            >
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ketik pesan sebagai Teman Tuli…"
                className="flex-1 min-w-0 px-3.5 py-2.5 bg-white/90 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
              />
              <button
                type="submit"
                disabled={!draft.trim()}
                className="p-2.5 rounded-xl liquid-btn-primary text-white disabled:opacity-50"
                title={autoSpeak ? 'Kirim & bacakan' : 'Kirim'}
                aria-label="Kirim pesan"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
