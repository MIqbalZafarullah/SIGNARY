import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { usePersistentState } from './storage';

const DEFAULT_PREFS = {
  fontSize: 'normal', // normal | large | xlarge
  highContrast: false,
  darkMode: false,
  animSpeed: 1, // 0.75 | 1 | 1.25
  speechLang: 'id-ID', // id-ID | en-US
  cameraQuality: '720', // 480 | 720 | 1080
};

const FONT_PX = { normal: '16px', large: '18px', xlarge: '20px' };

const PreferencesContext = createContext({ prefs: DEFAULT_PREFS, setPref: () => {} });

export function PreferencesProvider({ children }) {
  const [stored, setStored] = usePersistentState('prefs', DEFAULT_PREFS);
  const prefs = useMemo(() => ({ ...DEFAULT_PREFS, ...stored }), [stored]);

  // Terapkan ke elemen <html> agar berlaku di seluruh halaman
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = prefs.darkMode ? 'dark' : 'light';
    root.dataset.contrast = prefs.highContrast ? 'high' : 'normal';
    root.style.fontSize = FONT_PX[prefs.fontSize] || FONT_PX.normal;
    root.style.colorScheme = prefs.darkMode ? 'dark' : 'light';
  }, [prefs.darkMode, prefs.highContrast, prefs.fontSize]);

  const value = useMemo(
    () => ({
      prefs,
      setPref: (key, val) => setStored((prev) => ({ ...DEFAULT_PREFS, ...prev, [key]: val })),
      resetPrefs: () => setStored(DEFAULT_PREFS),
    }),
    [prefs, setStored],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export const usePreferences = () => useContext(PreferencesContext);
