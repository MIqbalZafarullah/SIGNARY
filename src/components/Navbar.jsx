import React, { useState, useEffect, useRef } from 'react';
import SignaryLogo from './SignaryLogo';
import { 
  Home,
  LayoutDashboard,
  BookOpen, 
  Languages, 
  GraduationCap,
  MessageSquare, 
  User, 
  Settings, 
  LogOut 
} from 'lucide-react';

export default function Navbar({ activePage, onNavigate, onLogoutClick, currentUser }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const desktopNavRef = useRef(null);
  const itemRefs = useRef({});
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  const navItems = [
    { id: 'beranda', label: 'Beranda', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'kamus', label: 'Smart Dictionary', icon: BookOpen },
    { id: 'penerjemah', label: 'Live Interpreter', icon: Languages },
    { id: 'academy', label: 'Sign Academy', icon: GraduationCap },
    { id: 'forum', label: 'Community', icon: MessageSquare },
  ];

  // Detect scroll to increase blur & opacity
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update sliding indicator position on activePage change
  useEffect(() => {
    const updatePosition = () => {
      const activeEl = itemRefs.current[activePage];
      if (activeEl) {
        setIndicatorStyle({
          left: activeEl.offsetLeft,
          width: activeEl.offsetWidth,
          opacity: 1
        });
      } else {
        setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [activePage]);

  return (
    <>
      {/* Desktop Apple iOS 26 / WhatsApp Floating Liquid Glass Pill Navbar */}
      <header className="sticky top-4 z-50 w-full px-4 sm:px-6 lg:px-8 hidden md:block">
        <div 
          className={`max-w-7xl mx-auto h-16 px-6 liquid-glass-nav flex items-center justify-between transition-all duration-300 ${
            isScrolled ? 'is-scrolled shadow-2xl' : 'shadow-xl'
          }`}
        >
          
          {/* Logo Brand with Interactive Scale */}
          <div className="flex items-center gap-6 lg:gap-8 z-10">
            <button 
              onClick={() => onNavigate('beranda')} 
              className="nav-item-interactive flex items-center hover:opacity-90 active:scale-95 focus:outline-none"
              title="Kembali ke Beranda SIGNARY"
            >
              <SignaryLogo size={32} showTagline={false} />
            </button>
            
            {/* Desktop Navigation Container with Liquid Spring Sliding Indicator */}
            <nav ref={desktopNavRef} className="relative flex items-center p-1 rounded-full bg-slate-200/35 border border-white/30 backdrop-blur-md">
              
              {/* Sliding Active Pill (Pill Kaca di Dalam Pill Kaca) */}
              <div 
                className="absolute top-1 bottom-1 liquid-glass-active-pill liquid-spring-transition pointer-events-none z-0"
                style={{
                  transform: `translateX(${indicatorStyle.left}px)`,
                  width: `${indicatorStyle.width}px`,
                  opacity: indicatorStyle.opacity
                }}
              />

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    ref={(el) => (itemRefs.current[item.id] = el)}
                    onClick={() => onNavigate(item.id)}
                    className={`nav-item-interactive relative z-10 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs lg:text-sm font-bold transition-colors duration-200 focus:outline-none ${
                      isActive 
                        ? 'text-white drop-shadow-xs' 
                        : 'text-slate-700 hover:text-slate-950'
                    }`}
                  >
                    <Icon className={`w-4 h-4 transition-transform duration-200 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User Quick Profile & Controls */}
          <div className="flex items-center gap-3 z-10">
            <button
              onClick={() => onNavigate('profil')}
              className={`nav-item-interactive flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all duration-200 focus:outline-none ${
                activePage === 'profil'
                  ? 'bg-primary-500/15 border-primary-400 text-primary-700 shadow-sm'
                  : 'bg-white/60 border-white/70 text-slate-700 hover:bg-white'
              }`}
              title="Profil Pengguna"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary-600 to-blue-500 text-white text-[10px] font-extrabold flex items-center justify-center shrink-0 shadow-xs">
                {currentUser?.name ? currentUser.name.charAt(0) : 'R'}
              </div>
              <span className="max-w-[80px] lg:max-w-[110px] truncate">
                {currentUser?.name || 'Rian'}
              </span>
            </button>

            <button
              onClick={() => onNavigate('pengaturan')}
              className={`nav-item-interactive p-2 rounded-full border text-xs font-semibold transition-all duration-200 focus:outline-none ${
                activePage === 'pengaturan'
                  ? 'bg-primary-500/15 border-primary-400 text-primary-700'
                  : 'bg-white/60 border-white/70 text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
              title="Pengaturan & Aksesibilitas"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={onLogoutClick}
              className="nav-item-interactive flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-600 border border-red-200/60 text-xs font-bold transition-all duration-200 active:scale-95 shadow-xs focus:outline-none"
              title="Keluar dari Akun"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Top Floating Pill Header */}
      <header className="sticky top-2 z-50 w-full px-3 py-1 md:hidden">
        <div className="h-14 px-4 liquid-glass-nav flex items-center justify-between shadow-lg">
          <button onClick={() => onNavigate('beranda')} className="flex items-center focus:outline-none">
            <SignaryLogo size={26} textClassName="text-base font-black tracking-tight text-slate-900" />
          </button>
          
          <div className="flex items-center gap-2 z-10">
            <button
              onClick={() => onNavigate('profil')}
              className="w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-xs border border-primary-200/60 shadow-xs"
            >
              {currentUser?.name ? currentUser.name.charAt(0) : 'R'}
            </button>
            <button
              onClick={onLogoutClick}
              className="p-2 rounded-full text-slate-500 hover:text-red-600 hover:bg-red-50/80 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Floating Bottom Tab Bar (Apple Liquid Glass) */}
      <nav className="fixed bottom-3 left-3 right-3 z-50 md:hidden">
        <div className="h-16 liquid-glass-nav grid grid-cols-6 items-center px-1.5 shadow-2xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative z-10 flex flex-col items-center justify-center gap-1 transition-all duration-200 py-1.5 rounded-full ${
                  isActive ? 'text-primary-600 font-extrabold scale-105' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="text-[8.5px] leading-none tracking-tighter text-center truncate max-w-full px-0.5">
                  {item.id === 'penerjemah' ? 'Live' : item.label}
                </span>
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-primary-600 mt-0.5"></span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
