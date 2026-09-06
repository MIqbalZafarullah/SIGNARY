import React from 'react';
import { 
  BookOpen, 
  Languages, 
  GraduationCap, 
  MessageSquare, 
  Award, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  CheckCircle2, 
  Play,
  Flame,
  ChevronRight,
  User,
  Settings
} from 'lucide-react';

export default function DashboardPage({ currentUser, onNavigate, showToast }) {
  const studentStats = [
    { label: 'Level Belajar', value: 'Level 4', desc: 'Isyarat Menengah', icon: Award, color: 'text-amber-600 bg-amber-50 border-amber-200/50' },
    { label: 'Total Poin XP', value: '1,450 XP', desc: '+50 XP hari ini', icon: Flame, color: 'text-orange-600 bg-orange-50 border-orange-200/50' },
    { label: 'Jam Latihan', value: '28.5 Jam', desc: 'Konsisten 14 hari berturut', icon: Clock, color: 'text-blue-600 bg-blue-50 border-blue-200/50' },
    { label: 'Kosakata Dikuasai', value: '84 Kosakata', desc: 'BISINDO & SIBI', icon: BookOpen, color: 'text-emerald-600 bg-emerald-50 border-emerald-200/50' }
  ];

  const recentActivities = [
    { 
      type: 'academy', 
      title: 'Menyelesaikan Kuis Modul 2: Sapaan Dasar', 
      score: 'Skor 100/100 (+40 XP)', 
      time: '2 jam yang lalu', 
      icon: GraduationCap, 
      color: 'bg-emerald-500/10 text-emerald-600' 
    },
    { 
      type: 'penerjemah', 
      title: 'Latihan Live Interpreter: Mode Isyarat ke Teks', 
      score: '3 gestur tervalidasi', 
      time: 'Kemarin, 16:30 WIB', 
      icon: Languages, 
      color: 'bg-sky-500/10 text-sky-600' 
    },
    { 
      type: 'forum', 
      title: 'Memberikan masukan usulan kata di Inclusive Community', 
      score: '1 tanggapan di-upvote', 
      time: '2 hari yang lalu', 
      icon: MessageSquare, 
      color: 'bg-indigo-500/10 text-indigo-600' 
    }
  ];

  return (
    <div className="space-y-8 md:space-y-10">
      
      {/* 1. WELCOME GREETING BANNER */}
      <section className="relative rounded-[32px] overflow-hidden bg-gradient-to-r from-primary-700 via-primary-800 to-slate-900 text-white p-6 sm:p-8 md:p-10 shadow-xl border border-white/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-sky-300" />
              <span>Personal Learning Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Selamat datang kembali, {currentUser?.name || 'Rian Adiputra'}!
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm font-medium leading-relaxed">
              Anda telah membuat kemajuan luar biasa minggu ini. Lanjutkan modul pembelajaran Anda atau gunakan Live Interpreter untuk berlatih komunikasi langsung.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('academy')}
              className="px-5 py-3 rounded-2xl bg-white text-slate-900 font-bold text-xs sm:text-sm shadow-md hover:bg-slate-100 active:scale-95 transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 text-primary-600 fill-primary-600" />
              <span>Lanjut Belajar</span>
            </button>
            <button
              onClick={() => onNavigate('profil')}
              className="px-4 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm backdrop-blur-md border border-white/25 transition-all"
            >
              Lihat Profil
            </button>
          </div>
        </div>
      </section>

      {/* 2. STATISTIK BELAJAR PENGGUNA (KPI METRICS) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {studentStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div 
              key={idx}
              className="liquid-glass rounded-3xl p-5 border border-white/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</span>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{stat.value}</span>
                <span className="block text-xs font-semibold text-slate-400 mt-1">{stat.desc}</span>
              </div>
            </div>
          );
        })}
      </section>

      {/* 3. PROGRESS BELAJAR UTAMA & REKOMENDASI MODUL */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Col: Progress Belajar (65%) */}
        <div className="lg:col-span-7 liquid-glass rounded-[32px] p-6 sm:p-8 border border-white/80 shadow-md space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-primary-600 uppercase tracking-wider">Silabus Kurikulum</span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">Progress Pembelajaran Sign Academy</h2>
            </div>
            <span className="text-2xl font-black text-primary-600">65%</span>
          </div>

          {/* Progress Bar Container */}
          <div className="space-y-2">
            <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-primary-600 via-sky-500 to-emerald-500 rounded-full transition-all duration-1000 shadow-sm"
                style={{ width: '65%' }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>5 dari 7 Modul Terlewati</span>
              <span>Target Ujian Praktik: 100%</span>
            </div>
          </div>

          {/* Current Recommended Lesson Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/70 border border-blue-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-200/80 text-blue-800">
                Rekomendasi Modul Berikutnya
              </span>
              <h4 className="text-sm sm:text-base font-bold text-slate-900">
                Modul 3: Bahasa Isyarat Angka, Hari & Waktu
              </h4>
              <p className="text-xs text-slate-600 font-medium">
                Pelajari representasi angka 1-100 dan penunjuk waktu dalam dialek BISINDO.
              </p>
            </div>

            <button
              onClick={() => onNavigate('academy')}
              className="px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shrink-0 shadow-sm flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Mulai Modul 3</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Col: Aktivitas Terakhir */}
        <div className="lg:col-span-5 liquid-glass rounded-[32px] p-6 sm:p-8 border border-white/80 shadow-md space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Aktivitas Terakhir</h3>
            <span className="text-xs font-semibold text-slate-400">Riwayat</span>
          </div>

          <div className="space-y-3.5">
            {recentActivities.map((act, idx) => {
              const Icon = act.icon;
              return (
                <div key={idx} className="p-3.5 rounded-2xl bg-white/70 border border-slate-200/60 flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${act.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-slate-900 leading-snug truncate">{act.title}</h5>
                    <span className="block text-[11px] font-semibold text-emerald-600 mt-0.5">{act.score}</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">{act.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </section>

      {/* 4. SHORTCUT 4 FITUR UTAMA */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Shortcut Layanan Utama</h2>
          <span className="text-xs text-slate-400 font-medium">Akses langsung fitur</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { id: 'kamus', title: 'Smart Dictionary', desc: 'Cari 8.750+ kosakata BISINDO & SIBI', icon: BookOpen, color: 'text-blue-600 bg-blue-50 border-blue-200/50' },
            { id: 'penerjemah', title: 'Live Interpreter', desc: 'Translasi Suara & Isyarat Kamera AI', icon: Languages, color: 'text-sky-600 bg-sky-50 border-sky-200/50' },
            { id: 'academy', title: 'Sign Academy', desc: '7 Modul, Kuis Interaktif & Game', icon: GraduationCap, color: 'text-emerald-600 bg-emerald-50 border-emerald-200/50' },
            { id: 'forum', title: 'Inclusive Community', desc: 'Diskusi & validasi bersama kawan Tuli', icon: MessageSquare, color: 'text-indigo-600 bg-indigo-50 border-indigo-200/50' }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="group p-5 rounded-3xl liquid-glass border border-white/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left flex flex-col justify-between"
              >
                <div>
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${item.color} mb-3`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-primary-600">
                  <span>Akses Sekarang</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. COMMUNITY UPDATE & FEED REKOMENDASI */}
      <section className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Pemberitahuan Komunitas</span>
          <h3 className="text-lg font-bold text-slate-900">
            Ada 4 usulan kosakata baru membutuhkan validasi Anda!
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Kawan Tuli dan pengajar SLB baru saja membagikan variasi dialek BISINDO daerah Jawa Timur.
          </p>
        </div>

        <button
          onClick={() => onNavigate('forum')}
          className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shrink-0 flex items-center gap-2 transition-all"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Buka Community Hub</span>
        </button>
      </section>

    </div>
  );
}
