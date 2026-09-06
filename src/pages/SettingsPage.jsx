import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Settings, 
  HelpCircle, 
  Info, 
  Moon, 
  Sun,
  Shield, 
  LogOut, 
  ChevronRight,
  Eye,
  Sliders,
  Sparkles,
  Lock,
  Volume2
} from 'lucide-react';

export default function SettingsPage({ onNavigate, onLogoutClick, showToast }) {
  const [darkMode, setDarkMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState('normal'); // 'normal', 'large', 'xlarge'
  const [gestureSpeed, setGestureSpeed] = useState('1.0x');
  const [cameraQuality, setCameraQuality] = useState('HD (720p)');
  const [speechLanguage, setSpeechLanguage] = useState('Bahasa Indonesia');
  const [localEdgeProcessing, setLocalEdgeProcessing] = useState(true);

  const handleToggleTheme = () => {
    setDarkMode(!darkMode);
    showToast(`Mode tema: ${!darkMode ? 'Gelap' : 'Terang'}`);
  };

  const handleSaveSettings = () => {
    showToast('Preferensi aksesibilitas SIGNARY berhasil disimpan!');
  };

  return (
    <div className="space-y-8">
      {/* Header Back Button */}
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
              Pengaturan & Aksesibilitas
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary-50 text-primary-700 border border-primary-100">
              Preferensi Ekosistem
            </span>
          </div>
          <p className="text-sm text-slate-500 font-medium">
            Kustomisasi antarmuka inklusif, resolusi pemrosesan AI, dan panduan bantuan sistem SIGNARY.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: General Settings Forms */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Inclusivity & Accessibility Card */}
          <div className="liquid-glass rounded-[36px] border border-white/80 p-6 md:p-8 shadow-2xl space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary-600" />
              Aksesibilitas & Tampilan Visual
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Ukuran Teks
                </label>
                <select
                  value={fontSize}
                  onChange={(e) => {
                    setFontSize(e.target.value);
                    showToast(`Ukuran font diatur ke: ${e.target.value}`);
                  }}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:border-primary-500"
                >
                  <option value="normal">Standar (Default 16px)</option>
                  <option value="large">Besar (+20% Keterbacaan)</option>
                  <option value="xlarge">Ekstra Besar (Kenyamanan Maksimal)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Kecepatan Animasi Gestur Isyarat
                </label>
                <select
                  value={gestureSpeed}
                  onChange={(e) => {
                    setGestureSpeed(e.target.value);
                    showToast(`Kecepatan animasi diatur ke: ${e.target.value}`);
                  }}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:border-primary-500"
                >
                  <option value="0.75x">0.75x - Lambat (Mudah Diikuti Pemula)</option>
                  <option value="1.0x">1.0x - Kecepatan Normal Alami</option>
                  <option value="1.25x">1.25x - Dinamis Cepat</option>
                </select>
              </div>
            </div>

            {/* High Contrast Toggle */}
            <div className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm">
              <div>
                <span className="block text-sm font-bold text-slate-800">Mode Kontras Tinggi (High Contrast)</span>
                <span className="block text-xs text-slate-400 font-medium">Mempertegas garis kontur antarmuka untuk kenyamanan penglihatan</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setHighContrast(!highContrast);
                  showToast(`Kontras tinggi ${!highContrast ? 'diaktifkan' : 'dinonaktifkan'}`);
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  highContrast ? 'bg-primary-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    highContrast ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* AI & Sensor Processing Preferences */}
          <div className="liquid-glass rounded-[36px] border border-white/80 p-6 md:p-8 shadow-2xl space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-primary-600" />
              Preferensi Sensor & Pemrosesan AI
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Kualitas Frame Kamera Vision
                </label>
                <select
                  value={cameraQuality}
                  onChange={(e) => {
                    setCameraQuality(e.target.value);
                    showToast(`Kualitas kamera diset: ${e.target.value}`);
                  }}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:border-primary-500"
                >
                  <option value="SD (480p)">SD (480p) - Hemat Bandwidth</option>
                  <option value="HD (720p)">HD (720p) - Rekomendasi Akurasi 98%</option>
                  <option value="FHD (1080p)">Full HD (1080p) - Presisi Tertinggi</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Bahasa Masukan Verbal (STT)
                </label>
                <select
                  value={speechLanguage}
                  onChange={(e) => {
                    setSpeechLanguage(e.target.value);
                    showToast(`Bahasa ucapan diset: ${e.target.value}`);
                  }}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:border-primary-500"
                >
                  <option value="Bahasa Indonesia">Bahasa Indonesia (Utama)</option>
                  <option value="English (US)">English (US)</option>
                </select>
              </div>
            </div>

            {/* Edge AI toggle */}
            <div className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm">
              <div className="pr-4">
                <span className="block text-sm font-bold text-slate-800">Privasi Edge AI (Pemrosesan di Perangkat)</span>
                <span className="block text-xs text-slate-400 font-medium">Video kamera dan audio tidak disimpan ke server luar demi perlindungan privasi pengguna</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setLocalEdgeProcessing(!localEdgeProcessing);
                  showToast(`Edge AI ${!localEdgeProcessing ? 'diaktifkan' : 'dinonaktifkan'}`);
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  localEdgeProcessing ? 'bg-primary-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    localEdgeProcessing ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSaveSettings}
                className="px-6 py-2.5 rounded-xl liquid-btn-primary text-white font-bold text-xs shadow-md active:scale-95 transition-all"
              >
                Simpan Semua Preferensi
              </button>
            </div>
          </div>

          {/* Help Center Card */}
          <div className="liquid-glass rounded-[36px] border border-white/80 p-6 md:p-8 shadow-2xl space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary-600" />
              Pusat Bantuan & Panduan Pengguna
            </h3>

            <div className="divide-y divide-slate-200/60">
              {[
                { 
                  q: 'Apa perbedaan mendasar antara SIGNARY dan aplikasi penerjemah isyarat biasa?', 
                  a: 'SIGNARY adalah ekosistem digital holistik yang menggabungkan 4 pilar: Smart Dictionary, Live Interpreter multimodal, kurikulum Sign Academy berjenjang, dan Co-Creator Hub tempat komunitas Tuli berperan sebagai validator utama bahasa.' 
                },
                { 
                  q: 'Bagaimana cara menggunakan Live Interpreter dua arah?', 
                  a: 'Gunakan Mode A (Suara ke Teks) saat penutur verbal berbicara di dekat mikrofon, dan gunakan Mode B (Isyarat ke Teks) saat rekan Tuli berisyarat di depan kamera dengan tracking kerangka tangan 21 titik.' 
                },
                { 
                  q: 'Bagaimana cara mengusulkan kosakata isyarat baru?', 
                  a: 'Buka menu Inclusive Community, pilih tab "Usulan Isyarat Baru", dan klik tombol "Usulkan Kosakata". Usulan Anda akan dikurasi bersama komunitas penutur asli Tuli.' 
                },
                { 
                  q: 'Apakah data kamera atau audio saya dikirimkan ke server luar?', 
                  a: 'Tidak. SIGNARY dirancang dengan arsitektur privasi Edge AI di mana kalkulasi sensor berlangsung aman secara lokal di peramban Anda.' 
                }
              ].map((faq, idx) => (
                <div key={idx} className="py-4 first:pt-0 last:pb-0 space-y-1.5">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center justify-between group cursor-pointer">
                    {faq.q}
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary-600 transition-colors shrink-0 ml-2" />
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: About & Session Card */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* About Section Card */}
          <div className="liquid-glass rounded-[36px] border border-white/80 p-6 md:p-8 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary-600" />
              Tentang SIGNARY
            </h3>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed font-medium">
              <div className="p-3 rounded-2xl bg-primary-50/60 border border-primary-100">
                <span className="block text-[10px] font-extrabold uppercase tracking-wider text-primary-700">Versi Prototipe</span>
                <strong className="text-slate-900 text-sm">SIGNARY v2.4.0 Multimodal</strong>
              </div>
              <p>
                <strong className="text-slate-900">SIGNARY</strong> adalah Dashboard AI Multimodal untuk Ekosistem Komunikasi Inklusif Komunitas Tuli, dikembangkan untuk Lomba Esai Inovasi PIMNAS 6 (Sub Tema Teknologi).
              </p>
              <p>
                Menjembatani komunikasi dua arah tanpa menghilangkan peran manusia: memposisikan komunitas Tuli sebagai pencipta, validator, dan pengembang sejati bahasa isyarat.
              </p>
            </div>
          </div>

          {/* Logout Trigger Danger Card */}
          <div className="bg-red-500/10 backdrop-blur-md rounded-[36px] border border-red-200/60 p-6 md:p-8 space-y-4">
            <h3 className="text-base font-bold text-red-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-500" />
              Sesi & Keamanan Akun
            </h3>
            
            <p className="text-xs text-red-700 leading-relaxed font-medium">
              Pastikan Anda mengakhiri sesi jika menggunakan perangkat publik agar preferensi belajar dan data akun Anda tetap aman.
            </p>
            
            <button
              onClick={onLogoutClick}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-red-600/20 transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              Keluar dari SIGNARY
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
