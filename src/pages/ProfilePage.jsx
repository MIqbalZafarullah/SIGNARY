import React, { useState } from 'react';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  BookOpen, 
  Languages, 
  Edit, 
  Save, 
  X,
  FileText,
  GraduationCap,
  Award,
  Sparkles,
  Trophy,
  Flame,
  CheckCircle2,
  Share2
} from 'lucide-react';

export default function ProfilePage({ currentUser, setCurrentUser, onNavigate, showToast }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name || 'Rian Adiputra');
  const [email, setEmail] = useState(currentUser.email || 'rian.adiputra@signary.id');
  const [bio, setBio] = useState(currentUser.bio || 'Pelajar bahasa isyarat aktif yang antusias menjembatani komunikasi setara antara teman Dengar dan komunitas Tuli.');

  const handleSave = (e) => {
    e.preventDefault();
    setCurrentUser({
      ...currentUser,
      name,
      email,
      bio
    });
    setIsEditing(false);
    showToast('Profil pengguna SIGNARY berhasil diperbarui!');
  };

  const handleCancel = () => {
    setName(currentUser.name || 'Rian Adiputra');
    setEmail(currentUser.email || 'rian.adiputra@signary.id');
    setBio(currentUser.bio || '');
    setIsEditing(false);
  };

  const badges = [
    { id: 1, name: 'Pionir Inklusif', desc: 'Bergabung di era awal SIGNARY', icon: '🌟', date: 'Agt 2026' },
    { id: 2, name: 'Pembelajar Cepat', desc: 'Menyelesaikan 3 modul kurikulum berturut-turut', icon: '⚡', date: 'Sep 2026' },
    { id: 3, name: 'Sahabat Tuli', desc: 'Terlibat aktif di 10+ diskusi inklusif', icon: '🤝', date: 'Sep 2026' },
    { id: 4, name: 'Co-Creator Aktif', desc: 'Mengusulkan kosakata isyarat baru', icon: '💎', date: 'Sep 2026' }
  ];

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
              Profil Pengguna & Prestasi
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary-50 text-primary-700 border border-primary-100">
              Level 4
            </span>
          </div>
          <p className="text-sm text-slate-500 font-medium">
            Kelola data diri, pantau pencapaian XP, dan kelola portofolio lencana inklusif Anda.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Avatar, Info Card, & Badges */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Profile Info Card */}
          <div className="liquid-glass rounded-[36px] border border-white/80 p-6 md:p-8 shadow-2xl space-y-6">
            {!isEditing ? (
              /* View Mode */
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  {/* Avatar Photo */}
                  <div className="relative group">
                    <img 
                      src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'} 
                      alt={currentUser.name} 
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-[28px] object-cover border-4 border-white/80 shadow-md"
                    />
                    <div 
                      onClick={() => showToast('Fitur unggah foto lokal aktif')}
                      className="absolute inset-0 bg-black/40 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold cursor-pointer backdrop-blur-xs"
                    >
                      Ubah Foto
                    </div>
                  </div>

                  {/* Name & Bio */}
                  <div className="flex-1 text-center sm:text-left space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-2xl font-extrabold text-slate-950">{currentUser.name || 'Rian Adiputra'}</h3>
                        <p className="text-sm font-semibold text-primary-600 mt-0.5">Pelajar Isyarat & Relawan Inklusi</p>
                      </div>
                      
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2.5 rounded-xl glass-pill text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-white transition-all duration-200 active:scale-95 self-center sm:self-start"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit Profil
                      </button>
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed pt-2 font-medium">
                      {currentUser.bio || bio}
                    </p>
                  </div>
                </div>

                {/* Personal Details List */}
                <div className="border-t border-slate-200/60 pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3.5 rounded-2xl bg-white/60 border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Email Terdaftar</span>
                    <p className="text-xs font-bold text-slate-800 truncate">{currentUser.email || email}</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/60 border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Peran Komunitas</span>
                    <p className="text-xs font-bold text-primary-700">Dengar (Belajar Isyarat)</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/60 border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Status Akun</span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Terverifikasi
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Edit Mode Form */
              <form onSubmit={handleSave} className="space-y-6">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/50">
                  <h3 className="text-lg font-bold text-slate-900">Ubah Data Diri SIGNARY</h3>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="p-2 rounded-xl glass-pill text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-primary-500 focus:outline-none transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Alamat Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-primary-500 focus:outline-none transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Bio Singkat
                  </label>
                  <textarea
                    rows="3"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-primary-500 focus:outline-none transition-all duration-200"
                  />
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-200/50 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-5 py-2.5 rounded-xl glass-pill text-slate-700 font-bold text-sm transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl liquid-btn-primary text-white font-bold text-sm shadow-md flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Badges / Lencana Showcase */}
          <div className="liquid-glass rounded-[36px] border border-white/80 p-6 md:p-8 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h4 className="text-base font-bold text-slate-900">
                  Lencana & Prestasi Inklusif ({badges.length})
                </h4>
              </div>
              <span className="text-xs font-bold text-primary-600">Terbuka Semua</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {badges.map((b) => (
                <div 
                  key={b.id}
                  className="p-4 rounded-2xl bg-white/70 border border-slate-200/60 text-center space-y-2 hover:scale-105 transition-transform"
                >
                  <div className="text-3xl">{b.icon}</div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 leading-tight">{b.name}</h5>
                    <p className="text-[10px] text-slate-400 mt-1 leading-snug">{b.desc}</p>
                  </div>
                  <span className="inline-block text-[9px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                    {b.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Learning Metrics & Level Progress */}
        <div className="lg:col-span-4 space-y-6">
          <div className="liquid-glass rounded-[36px] border border-white/80 p-6 md:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-slate-900">
                Pencapaian XP & Level
              </h4>
              <span className="flex items-center gap-1 text-xs font-bold text-amber-600">
                <Flame className="w-4 h-4 fill-amber-500 text-amber-500" /> 5 Hari Streak
              </span>
            </div>

            {/* Level card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary-600 to-blue-600 text-white shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-blue-100 font-semibold uppercase tracking-wider">Status Belajar</span>
                  <h5 className="text-xl font-extrabold">Level 4: Penutur Mandiri</h5>
                </div>
                <Trophy className="w-8 h-8 text-amber-300" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-blue-100">
                  <span>1,450 XP</span>
                  <span>2,000 XP Menuju Level 5</span>
                </div>
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '72%' }}></div>
                </div>
              </div>
            </div>

            {/* Pillar Metrics List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/60 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-primary-600 flex items-center justify-center font-bold text-xs">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-800">Smart Dictionary</span>
                    <span className="text-[10px] text-slate-400">Kosakata dipelajari</span>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-slate-900">84 Kata</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/60 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                    <Languages className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-800">Live Interpreter</span>
                    <span className="text-[10px] text-slate-400">Sesi terjemahan</span>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-slate-900">24 Sesi</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/60 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-800">Sign Academy</span>
                    <span className="text-[10px] text-slate-400">Modul diselesaikan</span>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-slate-900">3 dari 8</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/60 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-800">Inclusive Community</span>
                    <span className="text-[10px] text-slate-400">Post & usulan kosakata</span>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-slate-900">3 Kontribusi</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('pengaturan')}
              className="w-full py-3 rounded-2xl font-bold text-xs glass-pill text-slate-700 hover:bg-white text-center block active:scale-95 transition-all"
            >
              Buka Pengaturan Akun & Aksesibilitas
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
