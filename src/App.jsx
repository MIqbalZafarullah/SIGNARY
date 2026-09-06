import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LogoutModal from './components/LogoutModal';
import Toast from './components/Toast';

import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import FeatureDictionaryPage from './pages/FeatureDictionaryPage';
import FeatureDetectionPage from './pages/FeatureDetectionPage';
import SignAcademyPage from './pages/SignAcademyPage';
import CommunityForumPage from './pages/CommunityForumPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activePage, setActivePage] = useState('dashboard');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast({ message });
  };

  const handleLogoutConfirm = () => {
    setCurrentUser(null);
    setIsLogoutModalOpen(false);
    showToast('Anda berhasil keluar dari SIGNARY.');
  };

  // If not logged in, render login / signup screen
  if (!currentUser) {
    return (
      <>
        <LoginPage onLoginSuccess={setCurrentUser} />
        {toast && (
          <Toast message={toast.message} onClose={() => setToast(null)} />
        )}
      </>
    );
  }

  // Route renderer
  const renderPage = () => {
    switch (activePage) {
      case 'beranda':
      case 'home':
        return (
          <HomePage 
            currentUser={currentUser} 
            onNavigate={setActivePage} 
          />
        );
      case 'dashboard':
        return (
          <DashboardPage 
            currentUser={currentUser} 
            onNavigate={setActivePage} 
            showToast={showToast} 
          />
        );
      case 'kamus':
        return (
          <FeatureDictionaryPage 
            onNavigate={setActivePage} 
            showToast={showToast} 
          />
        );
      case 'penerjemah':
        return (
          <FeatureDetectionPage 
            onNavigate={setActivePage} 
            showToast={showToast} 
          />
        );
      case 'academy':
        return (
          <SignAcademyPage 
            onNavigate={setActivePage} 
            showToast={showToast} 
          />
        );
      case 'forum':
        return (
          <CommunityForumPage 
            onNavigate={setActivePage} 
            showToast={showToast} 
          />
        );
      case 'profil':
        return (
          <ProfilePage 
            currentUser={currentUser} 
            setCurrentUser={setCurrentUser} 
            onNavigate={setActivePage} 
            showToast={showToast} 
          />
        );
      case 'pengaturan':
        return (
          <SettingsPage 
            onNavigate={setActivePage} 
            onLogoutClick={() => setIsLogoutModalOpen(true)} 
            showToast={showToast} 
          />
        );
      default:
        return (
          <DashboardPage 
            currentUser={currentUser} 
            onNavigate={setActivePage} 
            showToast={showToast} 
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden font-sans antialiased selection:bg-primary-500 selection:text-white">
      
      {/* Background Ambient Mesh Light Spheres (Apple Specular Glass Effect) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft Blue Orb top-right */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-400/20 via-sky-300/15 to-transparent blur-[100px] animate-mesh-1" />
        {/* Soft Indigo Orb mid-left */}
        <div className="absolute top-[35%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-indigo-300/15 via-blue-200/10 to-transparent blur-[120px] animate-mesh-2" />
        {/* Soft Sky Orb bottom-right */}
        <div className="absolute bottom-[-10%] right-[15%] w-[450px] h-[450px] rounded-full bg-gradient-to-tl from-sky-400/15 via-blue-300/10 to-transparent blur-[90px] animate-mesh-1" />
      </div>

      {/* Top and Bottom Liquid Navigation Bars */}
      <Navbar 
        activePage={activePage} 
        onNavigate={setActivePage} 
        onLogoutClick={() => setIsLogoutModalOpen(true)} 
        currentUser={currentUser}
      />

      {/* Main Spacious Content Area with Liquid Glass Backdrop */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 pb-28 md:pb-12 relative z-10">
        {renderPage()}
      </main>

      {/* Page Footer */}
      <Footer onNavigate={setActivePage} />

      {/* Confirmation Dialogs & Alert Toasts */}
      <LogoutModal 
        isOpen={isLogoutModalOpen} 
        onClose={() => setIsLogoutModalOpen(false)} 
        onConfirm={handleLogoutConfirm} 
      />

      {toast && (
        <Toast message={toast.message} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
