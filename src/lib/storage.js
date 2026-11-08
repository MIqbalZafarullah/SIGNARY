import { useEffect, useState } from 'react';

// Penyimpanan lokal di browser. Data hanya ada di perangkat ini dan bisa
// hilang bila pengguna menghapus data situs / memakai mode penyamaran,
// jadi setiap akses dibungkus try/catch dan selalu punya nilai cadangan.
const PREFIX = 'signary:';

export function readStore(key, fallback) {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeStore(key, value) {
  try {
    if (value === undefined || value === null) window.localStorage.removeItem(PREFIX + key);
    else window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch {
    // Kuota penuh atau penyimpanan diblokir: aplikasi tetap berjalan tanpa menyimpan.
    return false;
  }
}

export function clearAllStore() {
  try {
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => window.localStorage.removeItem(k));
  } catch {
    /* abaikan */
  }
}

/** useState yang otomatis tersimpan di localStorage. */
export function usePersistentState(key, initial) {
  const [value, setValue] = useState(() =>
    readStore(key, typeof initial === 'function' ? initial() : initial),
  );
  useEffect(() => {
    writeStore(key, value);
  }, [key, value]);
  return [value, setValue];
}
