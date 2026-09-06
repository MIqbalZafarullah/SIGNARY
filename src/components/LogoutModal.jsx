import React, { useEffect } from 'react';
import { LogOut, X } from 'lucide-react';

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative liquid-glass rounded-[32px] p-8 max-w-sm w-full shadow-2xl border border-white/80 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-white/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 border border-red-200/60 flex items-center justify-center mb-4 shadow-sm">
          <LogOut className="w-6 h-6" />
        </div>
        
        <h3 className="text-xl font-extrabold text-slate-900 mb-1.5">
          Konfirmasi Keluar
        </h3>
        
        <p className="text-xs text-slate-500 leading-relaxed mb-6 font-medium">
          Apakah Anda yakin ingin mengakhiri sesi di <strong className="text-slate-800">SIGNARY</strong>? Anda perlu masuk kembali untuk mengakses riwayat belajar.
        </p>
        
        <div className="grid grid-cols-2 gap-3 w-full">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl glass-pill text-slate-700 font-bold text-xs hover:bg-white transition-all active:scale-95"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="w-full py-3 rounded-2xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 active:scale-95"
          >
            Ya, Keluar
          </button>
        </div>
      </div>
    </div>
  );
}
