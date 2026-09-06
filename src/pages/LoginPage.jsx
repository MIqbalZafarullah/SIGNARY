import React, { useState } from 'react';
import SignaryLogo from '../components/SignaryLogo';
import { Mail, Lock, User, Eye, EyeOff, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';

export default function LoginPage({ onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regConsent, setRegConsent] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Error/validation message
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    // Simple prototype validation
    const userEmail = loginEmail.trim() || 'rian.adiputra@signary.id';
    onLoginSuccess({
      name: userEmail.includes('rian') ? 'Rian Adiputra' : 'Pengguna SIGNARY',
      email: userEmail,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=256&auto=format&fit=crop',
      role: 'Inklusif Advocator (Teman Dengar)',
      level: 4,
      xp: 1450,
      bio: 'Mahasiswa dan pegiat inklusi yang berkomitmen mempelajari dan mengembangkan ekosistem komunikasi bahasa isyarat BISINDO & SIBI.'
    });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!regName.trim()) {
      setErrorMsg('Nama lengkap wajib diisi.');
      return;
    }
    if (!regEmail.trim()) {
      setErrorMsg('Alamat email wajib diisi.');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setErrorMsg('Kata sandi minimal 6 karakter.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Konfirmasi kata sandi tidak cocok.');
      return;
    }
    if (!regConsent) {
      setErrorMsg('Harap setujui komitmen ekosistem komunikasi inklusif.');
      return;
    }

    // Register success simulation
    onLoginSuccess({
      name: regName,
      email: regEmail,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=256&auto=format&fit=crop',
      role: 'Anggota Baru SIGNARY',
      level: 1,
      xp: 100,
      bio: 'Baru bergabung di SIGNARY untuk belajar dan mendukung komunikasi setara bersama Komunitas Tuli.'
    });
  };

  const handleQuickDemo = (role = 'rian') => {
    if (role === 'rian') {
      setLoginEmail('rian.adiputra@signary.id');
      setLoginPassword('demo123');
    } else {
      setLoginEmail('bambang.tuli@gerkatin.org');
      setLoginPassword('gerkatin123');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      
      {/* Background Ambient Mesh Light Spheres */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-blue-400/25 to-sky-300/20 blur-[130px] animate-mesh-1" />
        <div className="absolute bottom-1/4 right-1/4 w-[480px] h-[480px] rounded-full bg-gradient-to-tr from-indigo-400/20 to-blue-300/15 blur-[110px] animate-mesh-2" />
      </div>

      {/* Main Glass Card */}
      <div className="w-full max-w-[460px] liquid-glass rounded-[32px] sm:rounded-[36px] p-6 sm:p-8 md:p-9 border border-white/80 shadow-2xl relative z-10">
        
        {/* Header Logo */}
        <div className="flex flex-col items-center text-center mb-6">
          <SignaryLogo size={62} showText={false} className="mb-3 drop-shadow-md" />
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            SIGNARY
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Dashboard AI Multimodal untuk Ekosistem Komunikasi Inklusif
          </p>
        </div>

        {/* Tab Switcher: Login vs Sign Up */}
        <div className="grid grid-cols-2 p-1 bg-slate-100/80 rounded-2xl mb-6 border border-slate-200/60">
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all duration-200 ${
              activeTab === 'login'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Masuk (Login)
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all duration-200 ${
              activeTab === 'register'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Daftar Akun Baru
          </button>
        </div>

        {/* Error Alert Box if any */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
            {errorMsg}
          </div>
        )}

        {/* LOGIN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Email atau Nama Pengguna
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Contoh: rian.adiputra@signary.id"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-2xl text-slate-900 text-sm focus:bg-white focus:border-primary-500 focus:outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-2xl text-slate-900 text-sm focus:bg-white focus:border-primary-500 focus:outline-none transition-all shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500 w-3.5 h-3.5" 
                />
                Ingat saya
              </label>
              <button 
                type="button" 
                onClick={() => alert('Simulasi Reset Sandi: Tautan pemulihan akun telah dikirim ke email demo Anda.')} 
                className="text-primary-600 font-bold hover:text-primary-700"
              >
                Lupa sandi?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 mt-2 liquid-btn-primary text-white font-bold rounded-2xl shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <span>Masuk ke Dashboard</span>
              <span>➔</span>
            </button>

            {/* Quick Demo Fill Buttons */}
            <div className="pt-4 border-t border-slate-200/60 text-center">
              <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                Shortcut Demo Juri & Penguji:
              </span>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('rian')}
                  className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold border border-blue-200 transition-colors"
                >
                  Akun Pelajar (Rian)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('bambang')}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold border border-emerald-200 transition-colors"
                >
                  Akun Validator (Kawan Tuli)
                </button>
              </div>
            </div>
          </form>
        )}

        {/* REGISTER / SIGN UP FORM */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Contoh: Rian Adiputra"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-white/70 border border-slate-200/80 rounded-2xl text-slate-900 text-sm focus:bg-white focus:border-primary-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-white/70 border border-slate-200/80 rounded-2xl text-slate-900 text-sm focus:bg-white focus:border-primary-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  placeholder="Minimal 6 karakter"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-2.5 bg-white/70 border border-slate-200/80 rounded-2xl text-slate-900 text-sm focus:bg-white focus:border-primary-500 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Konfirmasi Kata Sandi
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  placeholder="Ketik ulang kata sandi"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-white/70 border border-slate-200/80 rounded-2xl text-slate-900 text-sm focus:bg-white focus:border-primary-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={regConsent}
                  onChange={(e) => setRegConsent(e.target.checked)}
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500 w-4 h-4 mt-0.5 shrink-0"
                />
                <span>
                  Saya setuju berpartisipasi aktif dalam ekosistem komunikasi inklusif yang menghormati etika dan budaya Komunitas Tuli.
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-2xl shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <span>Daftar Sekarang</span>
              <span>➔</span>
            </button>
          </form>
        )}

        {/* Prototype Transparency Notice */}
        <div className="mt-6 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
          <span>SIGNARY Prototype Mode • Simulasi Autentikasi Interaktif</span>
        </div>

      </div>
    </div>
  );
}
