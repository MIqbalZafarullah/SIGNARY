import React from 'react';
import { 
  BookOpen, 
  Languages, 
  GraduationCap,
  MessageSquare, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  Users,
  Award,
  Clock,
  HeartHandshake,
  CheckCircle2,
  Play
} from 'lucide-react';

export default function HomePage({ currentUser, onNavigate }) {
  const mainFeatures = [
    {
      id: 'kamus',
      title: 'Smart Dictionary',
      description: 'Kamus digital komprehensif kosakata BISINDO & SIBI dengan visualisasi gerakan tangan interaktif, arti kata, contoh kalimat, dan kategorisasi terstruktur.',
      icon: BookOpen,
      color: 'bg-blue-500/10 text-blue-600 border-blue-200/50',
      badge: 'Kosakata Terlengkap',
      details: ['Kamus BISINDO & SIBI', '9 Kategori Kosakata', 'Visual Gerakan Interaktif']
    },
    {
      id: 'penerjemah',
      title: 'Live Interpreter',
      description: 'Penerjemahan dua arah berbasis AI multimodal (Suara ➔ Teks & Isyarat ➔ Teks) untuk meruntuhkan sekat komunikasi spontan antara kawan Dengar dan Tuli.',
      icon: Languages,
      color: 'bg-sky-500/10 text-sky-600 border-sky-200/50',
      badge: 'AI Multimodal Dua Arah',
      details: ['Voice-to-Text Cepat', 'Camera Gesture Tracking', 'Transkrip Percakapan Riil']
    },
    {
      id: 'academy',
      title: 'Sign Academy',
      description: 'Ruang pembelajaran terstruktur dengan 7 modul kurikulum, kuis evaluasi interaktif, mini-game latihan gestur, sistem level, dan perolehan XP.',
      icon: GraduationCap,
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200/50',
      badge: 'Ruang Belajar & Kuis',
      details: ['7 Modul + 1 Ujian Praktik', 'Kuis Skor Dinamis', 'Gamifikasi XP & Badge']
    },
    {
      id: 'forum',
      title: 'Inclusive Community',
      description: 'Wadah kolaborasi inklusif di mana Komunitas Tuli bertindak sebagai co-creator dan validator untuk mengusulkan kosakata baru dan berbagi pengalaman.',
      icon: MessageSquare,
      color: 'bg-indigo-500/10 text-indigo-600 border-indigo-200/50',
      badge: 'Co-Creator & Validasi',
      details: ['Forum Diskusi Komunitas', 'Usulan Kosakata Baru', 'Validasi Dialek Lokal']
    }
  ];

  const userStats = [
    { label: 'Pengguna Terdaftar', value: '12,540+', desc: 'Kawan Dengar & Tuli Nasional', icon: Users, color: 'text-blue-600 bg-blue-50' },
    { label: 'Pengguna Aktif', value: '4,280+', desc: 'Berinteraksi setiap minggu', icon: Zap, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Kosakata Terindeks', value: '8,750+', desc: 'BISINDO & SIBI tervalidasi', icon: BookOpen, color: 'text-sky-600 bg-sky-50' },
    { label: 'Sesi Pembelajaran', value: '3,240+', desc: 'Terselesaikan di Sign Academy', icon: Award, color: 'text-amber-600 bg-amber-50' }
  ];

  return (
    <div className="space-y-12 md:space-y-16">
      
      {/* 1. HERO SECTION (SESUAI ARAHAN PROMPT BUTIR 7) */}
      <section className="relative rounded-[36px] overflow-hidden bg-gradient-to-br from-primary-700 via-primary-800 to-slate-900 text-white p-8 md:p-14 shadow-2xl border border-white/20">
        {/* Glow Ambient Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 text-xs font-bold tracking-wider uppercase backdrop-blur-xl border border-white/25 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-sky-300 animate-spin-slow" />
            <span>Dashboard AI Multimodal</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white">
            Komunikasi Lebih Inklusif dengan <span className="bg-gradient-to-r from-sky-300 via-white to-blue-200 bg-clip-text text-transparent">SIGNARY</span>
          </h1>

          <p className="text-slate-200 text-sm md:text-base lg:text-lg leading-relaxed font-medium max-w-2xl">
            Ekosistem digital berbasis AI multimodal untuk belajar, memahami, dan membangun komunikasi bahasa isyarat. Menghubungkan kawan Dengar dan Tuli dalam kesetaraan interaksi dua arah.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('academy')}
              className="px-6 py-3.5 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-2"
            >
              <GraduationCap className="w-4 h-4 text-primary-600" />
              <span>Mulai Belajar</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('penerjemah')}
              className="px-6 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-semibold text-sm backdrop-blur-md border border-white/30 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-2"
            >
              <Languages className="w-4 h-4 text-sky-300" />
              <span>Coba Live Interpreter</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. STATISTIK PENGGUNA (SESUAI BUTIR 8) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-slate-900">
              Statistik Jangkauan Platform
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Data terakumulasi dari ekosistem pembelajaran dan uji coba komunitas (Data Prototype).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {userStats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx} 
                className="liquid-glass rounded-3xl p-5 md:p-6 border border-white/80 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${stat.color} shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                    Aktif
                  </span>
                </div>
                <div>
                  <span className="block text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{stat.value}</span>
                  <span className="block text-xs font-bold text-slate-600 mt-1">{stat.label}</span>
                  <span className="block text-[11px] text-slate-400 mt-0.5">{stat.desc}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. EMPAT FITUR UTAMA SIGNARY (SESUAI BUTIR 2) */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Zap className="w-3.5 h-3.5" />
              <span>4 Pilar Utama SIGNARY</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
              Ekosistem Terintegrasi Komunikasi Inklusif
            </h2>
            <p className="text-sm text-slate-500 mt-1 font-medium max-w-2xl">
              Jelajahi empat fitur utama yang dirancang untuk mendukung pembelajaran mandiri, translasi spontan, dan keterlibatan aktif Komunitas Tuli.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {mainFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div 
                key={feat.id}
                className="group relative liquid-glass rounded-[32px] p-6 sm:p-8 flex flex-col justify-between hover:border-primary-300 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300"
              >
                <div>
                  {/* Badge & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[11px] font-extrabold tracking-wider text-slate-500 uppercase px-3 py-1 rounded-full bg-white/80 border border-slate-200/60 shadow-xs">
                      {feat.badge}
                    </span>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${feat.color} shadow-inner`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-2.5 leading-relaxed font-medium">
                    {feat.description}
                  </p>

                  {/* Feature Bullets */}
                  <ul className="mt-5 space-y-2 border-t border-slate-200/50 pt-4">
                    {feat.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Action Button */}
                <button
                  onClick={() => onNavigate(feat.id)}
                  className="mt-6 w-full py-3 rounded-2xl liquid-btn-primary text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md"
                >
                  <span>Buka {feat.title}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. NARASI KETERLIBATAN KOMUNITAS TULI (SESUAI BUTIR 19) */}
      <section className="relative rounded-3xl p-6 sm:p-8 md:p-10 bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 border border-blue-100">
        <div className="max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Prinsip Etika & Inklusi</span>
          </div>

          <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            AI sebagai Pendukung, Komunitas Tuli sebagai Co-Creator Utama
          </h3>

          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            Di dalam SIGNARY, teknologi kecerdasan buatan (AI) <strong>tidak pernah diposisikan untuk menggantikan</strong> peran manusia ataupun pengajar bahasa isyarat. Sebaliknya, AI hadir sebagai infrastruktur pendukung komunikasi. Komunitas Tuli dilibatkan secara langsung sebagai pengguna aktif, validator dialek BISINDO/SIBI, dan co-creator dalam pengujian sistem.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-white/80 p-4 rounded-2xl border border-blue-100">
              <span className="block text-xs font-bold text-blue-700">1. Validator Bahasa</span>
              <p className="text-xs text-slate-500 mt-1">Memastikan ketepatan gestur dan konteks budaya lokal Tuli.</p>
            </div>
            <div className="bg-white/80 p-4 rounded-2xl border border-blue-100">
              <span className="block text-xs font-bold text-blue-700">2. Sumber Kosakata</span>
              <p className="text-xs text-slate-500 mt-1">Mengajukan ragam isyarat baru melalui Inclusive Community.</p>
            </div>
            <div className="bg-white/80 p-4 rounded-2xl border border-blue-100">
              <span className="block text-xs font-bold text-blue-700">3. Evaluasi Empiris</span>
              <p className="text-xs text-slate-500 mt-1">Memberikan umpan balik langsung demi kenyamanan aksesibilitas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. AJAKAN BERGABUNG & PROGRESS RINGKASAN */}
      <section className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/80 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-xl font-bold text-slate-900">
            Siap Menjelajahi Ekosistem SIGNARY?
          </h3>
          <p className="text-sm text-slate-500 font-medium max-w-xl">
            Akses dashboard personal Anda untuk memantau progress modul belajar, riwayat simulasi penerjemah, dan aktivitas diskusi terbaru.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
          >
            <span>Buka Dashboard Personal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
}
