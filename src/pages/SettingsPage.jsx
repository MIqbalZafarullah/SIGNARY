import React from 'react';
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
  Volume2,
  Trash2
} from 'lucide-react';
import { usePreferences } from '../lib/preferences';
import { clearAllStore } from '../lib/storage';

function Toggle({ on, onClick, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onClick}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
        on ? 'bg-primary-600' : 'bg-slate-300'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          on ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export default function SettingsPage({ onNavigate, onLogoutClick, showToast }) {
  const { prefs, setPref, resetPrefs } = usePreferences();

  const update = (key, value, message) => {
    setPref(key, value);
    if (message) showToast(message);
  };

  const handleClearData = () => {
    if (!window.confirm('Hapus semua data SIGNARY di perangkat ini (sesi login, bookmark, XP, riwayat percakapan, data latihan, dan pengaturan)?')) return;
    clearAllStore();
    window.location.reload();
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
            <span className="px-2.5 py-0.5 rounded-full text-[0.6875rem] font-bold bg-primary-50 text-primary-700 border border-primary-100">
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
                  value={prefs.fontSize}
                  onChange={(e) => update('fontSize', e.target.value, 'Ukuran teks diperbarui')}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:border-primary-500"
                >
                  <option value="normal">Standar (100%)</option>
                  <option value="large">Besar (112%)</option>
                  <option value="xlarge">Ekstra Besar (125%)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Kecepatan Animasi Gestur Isyarat
                </label>
                <select
                  value={prefs.animSpeed}
                  onChange={(e) => update('animSpeed', Number(e.target.value), `Kecepatan animasi: ${e.target.value}x`)}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:border-primary-500"
                >
                  <option value={0.75}>0.75x - Lambat (mudah diikuti pemula)</option>
                  <option value={1}>1x - Normal</option>
                  <option value={1.25}>1.25x - Cepat</option>
                </select>
              </div>
            </div>

            {/* Mode gelap */}
            <div className="flex items-center justify-between gap-4 p-4 bg-white/60 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm">
              <div className="flex items-start gap-3">
                {prefs.darkMode ? <Moon className="w-5 h-5 text-primary-600 shrink-0" /> : <Sun className="w-5 h-5 text-amber-500 shrink-0" />}
                <div>
                  <span className="block text-sm font-bold text-slate-800">Mode Gelap</span>
                  <span className="block text-xs text-slate-500 font-medium">Latar gelap yang lebih nyaman di ruangan redup</span>
                </div>
              </div>
              <Toggle
                on={prefs.darkMode}
                label="Mode gelap"
                onClick={() => update('darkMode', !prefs.darkMode, `Mode ${!prefs.darkMode ? 'gelap' : 'terang'} aktif`)}
              />
            </div>

            {/* Kontras tinggi */}
            <div className="flex items-center justify-between gap-4 p-4 bg-white/60 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm">
              <div>
                <span className="block text-sm font-bold text-slate-800">Mode Kontras Tinggi</span>
                <span className="block text-xs text-slate-500 font-medium">Teks lebih pekat, garis tepi tegas, dan latar tanpa efek transparan</span>
              </div>
              <Toggle
                on={prefs.highContrast}
                label="Mode kontras tinggi"
                onClick={() => update('highContrast', !prefs.highContrast, `Kontras tinggi ${!prefs.highContrast ? 'diaktifkan' : 'dinonaktifkan'}`)}
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  resetPrefs();
                  showToast('Pengaturan tampilan dikembalikan ke bawaan');
                }}
                className="text-xs font-bold text-slate-500 hover:text-primary-600"
              >
                Kembalikan ke bawaan
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
                  Kualitas Kamera
                </label>
                <select
                  value={prefs.cameraQuality}
                  onChange={(e) => update('cameraQuality', e.target.value, 'Kualitas kamera diperbarui (berlaku saat kamera dinyalakan ulang)')}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:border-primary-500"
                >
                  <option value="480">SD (480p) - ringan untuk perangkat lama</option>
                  <option value="720">HD (720p) - disarankan</option>
                  <option value="1080">Full HD (1080p) - lebih tajam, lebih berat</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Bahasa Pengenalan Suara
                </label>
                <select
                  value={prefs.speechLang}
                  onChange={(e) => update('speechLang', e.target.value, 'Bahasa pengenalan suara diperbarui')}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:border-primary-500"
                >
                  <option value="id-ID">Bahasa Indonesia (utama)</option>
                  <option value="en-US">English (US)</option>
                </select>
              </div>
            </div>

            {/* Info privasi (jujur sesuai cara kerja) */}
            <div className="p-4 bg-white/60 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm space-y-1.5 text-xs text-slate-600 font-medium leading-relaxed">
              <span className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
                <Lock className="w-4 h-4 text-primary-600" /> Privasi Data
              </span>
              <p>Kamera: tracking tangan diproses di perangkat Anda, gambar kamera tidak dikirim ke server.</p>
              <p>Suara: memakai pengenalan suara bawaan browser. Di Chrome/Edge, audio diproses oleh server penyedia browser.</p>
              <p>Data akun, XP, bookmark, riwayat percakapan, dan data latihan disimpan di browser perangkat ini saja.</p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-red-200/70 bg-red-50/60">
              <div>
                <span className="block text-sm font-bold text-red-900">Hapus Data di Perangkat Ini</span>
                <span className="block text-xs text-red-700 font-medium">Disarankan saat memakai komputer umum.</span>
              </div>
              <button
                onClick={handleClearData}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shrink-0"
              >
                <Trash2 className="w-4 h-4" /> Hapus Semua Data
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
                  a: 'Pendengar memakai tab Suara ➔ Teks (bicara di dekat mikrofon, sebaiknya di Chrome/Edge). Teman Tuli dapat mengetik pesan yang otomatis dibacakan, atau memakai tab Isyarat ➔ Teks untuk kata yang sudah dilatih. Tab Teks ➔ Isyarat menampilkan peraga untuk kata di kamus.' 
                },
                { 
                  q: 'Bagaimana cara mengusulkan kosakata isyarat baru?', 
                  a: 'Buka menu Inclusive Community, pilih tab "Usulan Isyarat Baru", dan klik tombol "Usulkan Kosakata". Usulan Anda akan dikurasi bersama komunitas penutur asli Tuli.' 
                },
                { 
                  q: 'Apakah data kamera atau audio saya dikirimkan ke server luar?', 
                  a: 'Gambar kamera tidak dikirim: tracking tangan berjalan di perangkat Anda. Untuk suara, SIGNARY memakai pengenalan suara bawaan browser; di Chrome/Edge audio diproses oleh server penyedia browser tersebut.' 
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
                <span className="block text-[0.625rem] font-extrabold uppercase tracking-wider text-primary-700">Versi Prototipe</span>
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
