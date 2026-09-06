import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Copy, 
  Check, 
  Volume2, 
  Activity, 
  Sparkles,
  Info,
  Send,
  RotateCcw,
  Layers,
  MessageSquare,
  ShieldAlert
} from 'lucide-react';

export default function FeatureDetectionPage({ onNavigate, showToast }) {
  const [activeTab, setActiveTab] = useState('suara'); // suara, gerakan
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  // Translation text results
  const [voiceResult, setVoiceResult] = useState('');
  const [gestureResult, setGestureResult] = useState('');
  
  // Indicators
  const [voiceStatus, setVoiceStatus] = useState('Siap merekam suara');
  const [gestureStatus, setGestureStatus] = useState('Kamera tidak aktif');
  const [detectedConfidence, setDetectedConfidence] = useState(null);

  // Multi-turn inclusive conversation log
  const [conversation, setConversation] = useState([
    {
      id: 1,
      sender: 'hearing',
      name: 'Rian (Pendengar)',
      text: 'Halo! Selamat pagi rekan semua, senang bertemu dengan Anda hari ini.',
      mode: 'Suara ➔ Teks',
      time: '10:14'
    },
    {
      id: 2,
      sender: 'deaf',
      name: 'Maya (Teman Tuli)',
      text: 'Selamat pagi juga. Terima kasih sudah menggunakan SIGNARY untuk berkomunikasi.',
      mode: 'Isyarat ➔ Teks',
      time: '10:15'
    }
  ]);

  // Trigger copy to clipboard
  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    showToast('Teks terjemahan berhasil disalin!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Simulate Speech to Text
  useEffect(() => {
    let timer;
    if (isRecording) {
      setVoiceStatus('Mendengarkan ucapan verbal...');
      setVoiceResult('Sedang menganalisis gelombang audio...');
      
      const phrases = [
        'Halo, selamat pagi rekan semua.',
        'Terima kasih banyak atas waktu dan kolaborasi Anda hari ini.',
        'Bisakah Anda menunjukkan isyarat untuk kata "Teknologi Inklusif"?',
        'Bagaimana saya bisa menuju ke ruang pertemuan komunitas?',
        'Senang sekali bisa belajar bahasa isyarat bersama teman-teman tuli.'
      ];
      
      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      
      timer = setTimeout(() => {
        setVoiceResult(randomPhrase);
        setVoiceStatus('Deteksi ucapan selesai (Simulasi)');
        setIsRecording(false);
        setConversation(prev => [
          ...prev,
          {
            id: Date.now(),
            sender: 'hearing',
            name: 'Rian (Pendengar)',
            text: randomPhrase,
            mode: 'Suara ➔ Teks (Simulasi)',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        showToast('Terjemahan suara berhasil dideteksi!');
      }, 2600);
    }
    return () => clearTimeout(timer);
  }, [isRecording]);

  // Simulate Gesture to Text
  const triggerMockGesture = (gestureName, translationText, confidenceVal = '98.6%') => {
    if (!isCameraOn) {
      showToast('Nyalakan kamera terlebih dahulu!');
      return;
    }
    setGestureStatus(`Mendeteksi landmark 3D: "${gestureName}"...`);
    setGestureResult('Menganalisis pola kerangka 21 titik tangan...');
    setDetectedConfidence(null);
    
    setTimeout(() => {
      setGestureResult(translationText);
      setDetectedConfidence(confidenceVal);
      setGestureStatus(`Terverifikasi: ${gestureName}`);
      setConversation(prev => [
        ...prev,
        {
          id: Date.now(),
          sender: 'deaf',
          name: 'Maya (Teman Tuli)',
          text: translationText,
          mode: `Isyarat ➔ Teks (${confidenceVal})`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      showToast(`Gestur "${gestureName}" berhasil diterjemahkan!`);
    }, 1400);
  };

  // Turn camera on/off
  const toggleCamera = () => {
    if (isCameraOn) {
      setIsCameraOn(false);
      setGestureResult('');
      setDetectedConfidence(null);
      setGestureStatus('Kamera tidak aktif');
    } else {
      setIsCameraOn(true);
      setGestureStatus('Kamera aktif. Tracking 21 Hand Landmarks siap.');
      setGestureResult('Lakukan gerakan isyarat atau tekan tombol simulasi di bawah.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Back Button & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="p-2.5 rounded-2xl liquid-glass text-slate-600 hover:text-primary-600 hover:border-primary-200 transition-all duration-200 active:scale-95 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                Live Interpreter Multimodal
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/80">
                Prototype Detection
              </span>
            </div>
            <p className="text-sm text-slate-500 font-medium">
              Jembatan komunikasi dua arah: Terjemahan Suara ➔ Teks dan Bahasa Isyarat ➔ Teks secara instan.
            </p>
          </div>
        </div>

        {/* Action Shortcuts */}
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

      {/* Tab Selectors (Liquid Glass Container) */}
      <div className="flex justify-center">
        <div className="liquid-glass p-1.5 rounded-2xl flex max-w-md w-full shadow-lg border border-white/80">
          <button
            onClick={() => setActiveTab('suara')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === 'suara'
                ? 'bg-gradient-to-r from-primary-600 to-blue-600 text-white shadow-md shadow-primary-500/25 scale-[1.02]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mic className="w-4 h-4" />
            Suara ➔ Teks
          </button>
          <button
            onClick={() => setActiveTab('gerakan')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === 'gerakan'
                ? 'bg-gradient-to-r from-primary-600 to-blue-600 text-white shadow-md shadow-primary-500/25 scale-[1.02]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Video className="w-4 h-4" />
            Isyarat ➔ Teks
          </button>
        </div>
      </div>

      {/* Translator Workspaces */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Viewports (Microphone Wave / Camera Frame) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* TAB A: Suara to Teks Workspace */}
          {activeTab === 'suara' && (
            <div className="liquid-glass rounded-[36px] border border-white/80 p-8 shadow-2xl text-center space-y-8">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <h3 className="text-lg font-bold text-slate-900">
                    Input Audio Verbal (Mikrofon)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Bicara melalui mikrofon untuk mendeteksi percakapan ke teks secara real-time.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary-50 text-primary-700 border border-primary-100 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary-600" />
                  Speech-to-Text Engine
                </span>
              </div>
              
              {/* Mic Icon & Wave Visualizer Container */}
              <div className="h-64 bg-slate-900/90 rounded-3xl border border-slate-800 flex flex-col items-center justify-center p-6 relative overflow-hidden shadow-inner text-white">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:16px_16px] opacity-20"></div>

                {isRecording ? (
                  /* Animated Waveform */
                  <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 h-20">
                      <div className="w-2 bg-sky-400 rounded-full animate-bounce h-8" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 bg-primary-400 rounded-full animate-bounce h-14" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 bg-sky-300 rounded-full animate-bounce h-20" style={{ animationDelay: '300ms' }}></div>
                      <div className="w-2 bg-primary-500 rounded-full animate-bounce h-16" style={{ animationDelay: '100ms' }}></div>
                      <div className="w-2 bg-sky-400 rounded-full animate-bounce h-10" style={{ animationDelay: '250ms' }}></div>
                      <div className="w-2 bg-primary-300 rounded-full animate-bounce h-18" style={{ animationDelay: '350ms' }}></div>
                      <div className="w-2 bg-sky-500 rounded-full animate-bounce h-12" style={{ animationDelay: '200ms' }}></div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                      MEREKAM SUARA AKTIF...
                    </div>
                  </div>
                ) : (
                  /* Idle microphone icon */
                  <div className="relative z-10 flex flex-col items-center gap-3 text-slate-400">
                    <div className="w-20 h-20 bg-slate-800/80 rounded-full flex items-center justify-center border border-slate-700 text-slate-300 shadow-lg">
                      <Mic className="w-10 h-10" />
                    </div>
                    <p className="text-xs text-slate-400 font-medium max-w-xs">
                      Klik tombol di bawah untuk memulai simulasi deteksi suara verbal.
                    </p>
                  </div>
                )}
                
                <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-primary-400" />
                    Frekuensi: 16kHz Mono
                  </span>
                  <span>Status: {voiceStatus}</span>
                </div>
              </div>

              {/* Record Button trigger */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all duration-200 shadow-lg ${
                    isRecording
                      ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20 active:scale-95'
                      : 'liquid-btn-primary text-white active:scale-95'
                  }`}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="w-4 h-4" />
                      Hentikan Merekam
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      Mulai Merekam Suara
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setVoiceResult('Halo, saya ingin bertanya tentang modul pembelajaran di SIGNARY.');
                    setVoiceStatus('Input instan dimasukkan');
                    showToast('Contoh audio dimasukkan');
                  }}
                  className="px-5 py-4 rounded-2xl font-bold text-xs glass-pill text-slate-700 hover:bg-white active:scale-95"
                >
                  Gunakan Sampel Cepat
                </button>
              </div>
            </div>
          )}

          {/* TAB B: Gerakan to Teks Workspace */}
          {activeTab === 'gerakan' && (
            <div className="liquid-glass rounded-[36px] border border-white/80 p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Input Isyarat Komputer Vision (Kamera)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tracking 21 titik koordinat sendi tangan (Landmarks MediaPipe).
                  </p>
                </div>
                <button
                  onClick={toggleCamera}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 active:scale-95 ${
                    isCameraOn
                      ? 'bg-red-50 text-red-600 border border-red-200/60'
                      : 'glass-pill text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  {isCameraOn ? (
                    <>
                      <VideoOff className="w-3.5 h-3.5" />
                      Matikan Kamera
                    </>
                  ) : (
                    <>
                      <Video className="w-3.5 h-3.5" />
                      Nyalakan Kamera
                    </>
                  )}
                </button>
              </div>

              {/* Camera view screen simulation */}
              <div className="relative aspect-[16/10] bg-slate-950 rounded-3xl overflow-hidden flex items-center justify-center border border-slate-800 shadow-inner">
                {isCameraOn ? (
                  <>
                    <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:16px_16px] opacity-25"></div>
                      
                      {/* Viewfinder brackets */}
                      <div className="absolute top-6 left-6 w-6 h-6 border-t-2 border-l-2 border-white/50"></div>
                      <div className="absolute top-6 right-6 w-6 h-6 border-t-2 border-r-2 border-white/50"></div>
                      <div className="absolute bottom-6 left-6 w-6 h-6 border-b-2 border-l-2 border-white/50"></div>
                      <div className="absolute bottom-6 right-6 w-6 h-6 border-b-2 border-r-2 border-white/50"></div>
                      
                      {/* Simulated 21-landmarks hand skeleton */}
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 400">
                        {/* Palm lines */}
                        <path d="M 300,340 L 260,280 L 240,220 M 300,340 L 290,260 L 285,180 M 300,340 L 320,260 L 325,170 M 300,340 L 350,270 L 360,190 M 300,340 L 380,300 L 410,260" 
                          stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8" />
                        
                        {/* Finger joints (landmarks) */}
                        <circle cx="300" cy="340" r="7" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                        <circle cx="260" cy="280" r="5" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
                        <circle cx="240" cy="220" r="6" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
                        
                        <circle cx="290" cy="260" r="5" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
                        <circle cx="285" cy="180" r="6" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
                        
                        <circle cx="320" cy="260" r="5" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
                        <circle cx="325" cy="170" r="6" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
                        
                        <circle cx="350" cy="270" r="5" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
                        <circle cx="360" cy="190" r="6" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
                        
                        <circle cx="380" cy="300" r="5" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
                        <circle cx="410" cy="260" r="6" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
                      </svg>

                      {/* HUD Overlays */}
                      <div className="absolute top-6 left-6 flex items-center gap-2 bg-slate-950/70 px-3 py-1.5 rounded-full backdrop-blur-md text-[10px] text-white font-bold border border-slate-700/60">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
                        LIVE TRACKING 30 FPS
                      </div>

                      <div className="absolute top-6 right-6 flex items-center gap-2 bg-slate-950/70 px-3 py-1.5 rounded-full backdrop-blur-md text-[10px] text-sky-400 font-bold border border-slate-700/60">
                        <Layers className="w-3 h-3 text-sky-400" />
                        21 Points Active
                      </div>

                      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-[11px] text-slate-300 bg-slate-950/80 px-4 py-2 rounded-2xl backdrop-blur-md border border-slate-800">
                        <span>Status: <strong className="text-white font-semibold">{gestureStatus}</strong></span>
                        {detectedConfidence && (
                          <span className="text-emerald-400 font-bold">Akurasi: {detectedConfidence}</span>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-slate-500 p-6 text-center">
                    <VideoOff className="w-12 h-12 text-slate-600" />
                    <span className="text-sm font-bold text-slate-300">Kamera Dinonaktifkan</span>
                    <span className="text-xs text-slate-400 max-w-xs leading-relaxed font-medium">
                      Aktifkan kamera simulasi untuk mendemonstrasikan penangkapan gestur isyarat oleh AI.
                    </span>
                    <button
                      onClick={toggleCamera}
                      className="mt-2 px-5 py-2.5 rounded-xl text-xs font-bold liquid-btn-primary text-white"
                    >
                      Nyalakan Kamera Sekarang
                    </button>
                  </div>
                )}
              </div>

              {/* Presets simulator triggers */}
              {isCameraOn && (
                <div className="space-y-3">
                  <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Picu Isyarat Simulasi (Tekan untuk Demo Juri):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      onClick={() => triggerMockGesture('Lambaian Tangan', 'Halo, Selamat Pagi', '98.8%')}
                      className="px-3 py-2.5 glass-pill hover:bg-primary-50 text-xs font-bold text-slate-700 hover:text-primary-600 transition-all active:scale-95 text-center"
                    >
                      👋 Halo
                    </button>
                    <button
                      onClick={() => triggerMockGesture('Sentuh Dagu ke Depan', 'Terima Kasih Banyak', '99.1%')}
                      className="px-3 py-2.5 glass-pill hover:bg-primary-50 text-xs font-bold text-slate-700 hover:text-primary-600 transition-all active:scale-95 text-center"
                    >
                      🙏 Terima Kasih
                    </button>
                    <button
                      onClick={() => triggerMockGesture('Telunjuk ke Dada', 'Saya Teman Tuli', '97.5%')}
                      className="px-3 py-2.5 glass-pill hover:bg-primary-50 text-xs font-bold text-slate-700 hover:text-primary-600 transition-all active:scale-95 text-center"
                    >
                      ☝️ Saya
                    </button>
                    <button
                      onClick={() => triggerMockGesture('Ibu Jari Tegak & Tersenyum', 'Bagus Sekali / Hebat', '98.4%')}
                      className="px-3 py-2.5 glass-pill hover:bg-primary-50 text-xs font-bold text-slate-700 hover:text-primary-600 transition-all active:scale-95 text-center"
                    >
                      👍 Bagus Sekali
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Translation Output & Inclusive Conversation Stream */}
        <div className="lg:col-span-5 space-y-6">
          {/* Real-time Output Card */}
          <div className="liquid-glass rounded-[36px] border border-white/80 p-6 md:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-slate-900">
                  Hasil Terjemahan Real-time
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  Multimodal
                </span>
              </div>
              
              <button
                onClick={() => handleCopy(activeTab === 'suara' ? voiceResult : gestureResult)}
                disabled={!(activeTab === 'suara' ? voiceResult : gestureResult)}
                className="p-2.5 glass-pill hover:bg-white disabled:opacity-40 text-slate-600 transition-all duration-200 active:scale-95"
                title="Salin Hasil Teks"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Output Viewport */}
            <div className="min-h-40 bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/70 p-6 flex flex-col justify-between shadow-inner">
              <div>
                {activeTab === 'suara' ? (
                  voiceResult ? (
                    <p className="text-lg font-bold text-slate-900 leading-relaxed animate-in fade-in duration-300">
                      "{voiceResult}"
                    </p>
                  ) : (
                    <p className="text-sm text-slate-400 italic font-medium">
                      Belum ada suara terekam. Tekan tombol mikrofon untuk memulai simulasi input ucapan verbal.
                    </p>
                  )
                ) : (
                  gestureResult ? (
                    <p className="text-lg font-bold text-slate-900 leading-relaxed animate-in fade-in duration-300">
                      "{gestureResult}"
                    </p>
                  ) : (
                    <p className="text-sm text-slate-400 italic font-medium">
                      Kamera mati atau belum ada isyarat terdeteksi. Nyalakan kamera dan pilih gestur simulasi.
                    </p>
                  )
                )}
              </div>

              {/* Status footer info */}
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider pt-4 border-t border-slate-200/50 mt-4">
                <span>Status: {activeTab === 'suara' ? voiceStatus : gestureStatus}</span>
                {activeTab === 'gerakan' && detectedConfidence && (
                  <span className="text-emerald-600 font-extrabold normal-case">AI: {detectedConfidence}</span>
                )}
              </div>
            </div>

            {/* Prototype Transparency Note */}
            <div className="bg-amber-500/10 border border-amber-200/80 text-amber-900 rounded-2xl p-4 text-xs leading-relaxed flex items-start gap-3 backdrop-blur-md">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Simulasi Prototipe PIMNAS:</span> Antarmuka ini mensimulasikan inferensi model Computer Vision dan Speech-to-Text secara lokal tanpa mengirimkan audio/kamera ke server luar demi privasi data.
              </div>
            </div>
          </div>

          {/* Inclusive Dialogue Stream (Percakapan Dua Arah) */}
          <div className="liquid-glass rounded-[36px] border border-white/80 p-6 md:p-8 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary-600" />
                <h4 className="text-sm font-bold text-slate-800">
                  Aliran Percakapan Dua Arah Inklusif
                </h4>
              </div>
              <button
                onClick={() => setConversation([])}
                className="text-[11px] text-slate-400 hover:text-slate-600 font-semibold"
              >
                Bersihkan
              </button>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {conversation.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6 italic">
                  Belum ada riwayat obrolan. Coba simulasikan ucapan atau isyarat di sebelah kiri.
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
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                      <span className="font-bold">{msg.name}</span>
                      <span>{msg.time} • {msg.mode}</span>
                    </div>
                    <p className="font-semibold text-slate-800 leading-relaxed">
                      {msg.text}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
