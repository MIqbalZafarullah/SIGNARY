import React from 'react';
import SignaryLogo from './SignaryLogo';

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-white border-t border-slate-100 mt-auto py-10 pb-28 md:pb-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <SignaryLogo size={28} textClassName="text-lg font-black text-slate-800" showTagline={true} />
            <p className="text-xs text-slate-400 text-center md:text-left max-w-sm mt-1">
              Dashboard AI Multimodal untuk Ekosistem Komunikasi Inklusif Komunitas Tuli.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-600 font-semibold">
            <button onClick={() => onNavigate('beranda')} className="hover:text-primary-600 transition-colors">Beranda</button>
            <button onClick={() => onNavigate('dashboard')} className="hover:text-primary-600 transition-colors">Dashboard</button>
            <button onClick={() => onNavigate('kamus')} className="hover:text-primary-600 transition-colors">Smart Dictionary</button>
            <button onClick={() => onNavigate('penerjemah')} className="hover:text-primary-600 transition-colors">Live Interpreter</button>
            <button onClick={() => onNavigate('academy')} className="hover:text-primary-600 transition-colors">Sign Academy</button>
            <button onClick={() => onNavigate('forum')} className="hover:text-primary-600 transition-colors">Inclusive Community</button>
          </div>
        </div>
        
        <div className="border-t border-slate-100 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} SIGNARY — Inovasi Teknologi Inklusif Komunitas Tuli. Hak Cipta Dilindungi.
          </p>
          <div className="flex items-center gap-2 text-xs text-primary-600 bg-primary-50 px-3.5 py-1.5 rounded-full border border-primary-100 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-ping"></span>
            Prototype Mode • AI Multimodal
          </div>
        </div>
      </div>
    </footer>
  );
}
