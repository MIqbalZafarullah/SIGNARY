import React from 'react';
import logoImg from '../assets/logo.png';

export default function SignaryLogo({ 
  size = 40, 
  showText = true, 
  showTagline = false,
  className = "", 
  textClassName = "text-2xl font-black tracking-tight text-slate-900",
  taglineClassName = "text-[10px] font-bold tracking-wider uppercase text-primary-600"
}) {
  return (
    <div className={`inline-flex items-center gap-3.5 ${className}`}>
      <div className="relative flex items-center justify-center shrink-0">
        <img 
          src={logoImg} 
          alt="SIGNARY Logo" 
          style={{ width: `${size}px`, height: `${size}px` }}
          className="object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105"
        />
      </div>
      
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={textClassName}>
            SIGNARY
          </span>
          {showTagline && (
            <span className={`mt-1 ${taglineClassName}`}>
              AI Multimodal Inklusif
            </span>
          )}
        </div>
      )}
    </div>
  );
}
