import { useCallback, useEffect, useRef, useState } from 'react';

// Web Speech API: tersedia di Chrome, Edge, dan Safari (sebagian).
// Catatan privasi: Chrome/Edge memproses audio di server Google/Microsoft.
const getRecognitionClass = () =>
  typeof window === 'undefined' ? null : window.SpeechRecognition || window.webkitSpeechRecognition || null;

const ERROR_MESSAGES = {
  'not-allowed': 'Izin mikrofon ditolak. Izinkan mikrofon di pengaturan browser.',
  'service-not-allowed': 'Layanan pengenalan suara tidak diizinkan di browser ini.',
  'audio-capture': 'Mikrofon tidak ditemukan.',
  network: 'Pengenalan suara butuh koneksi internet.',
  'language-not-supported': 'Bahasa Indonesia belum didukung di browser ini.',
};

/**
 * Pengenalan suara ke teks secara langsung (bahasa Indonesia).
 * onFinal(text) dipanggil setiap kali satu kalimat selesai dikenali.
 */
export default function useSpeechRecognition({ lang = 'id-ID', onFinal } = {}) {
  const supported = !!getRecognitionClass();
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState('');
  const [error, setError] = useState('');
  const recRef = useRef(null);
  const wantRef = useRef(false);
  const onFinalRef = useRef(onFinal);
  onFinalRef.current = onFinal;

  const stop = useCallback(() => {
    wantRef.current = false;
    recRef.current?.stop();
  }, []);

  const start = useCallback(() => {
    const Rec = getRecognitionClass();
    if (!Rec) return;
    setError('');
    setInterim('');
    wantRef.current = true;

    const rec = new Rec();
    rec.lang = lang;
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onstart = () => setListening(true);
    rec.onresult = (event) => {
      let pending = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        const text = res[0].transcript.trim();
        if (res.isFinal) {
          if (text) onFinalRef.current?.(text);
        } else {
          pending += `${text} `;
        }
      }
      setInterim(pending.trim());
    };
    rec.onerror = (event) => {
      if (event.error === 'no-speech' || event.error === 'aborted') return;
      setError(ERROR_MESSAGES[event.error] || `Pengenalan suara gagal (${event.error}).`);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed' || event.error === 'audio-capture') {
        wantRef.current = false;
      }
    };
    rec.onend = () => {
      // Chrome berhenti sendiri setelah jeda hening; lanjutkan selama pengguna belum menekan "Berhenti".
      if (wantRef.current) {
        try {
          rec.start();
          return;
        } catch {
          wantRef.current = false;
        }
      }
      setListening(false);
      setInterim('');
    };

    recRef.current = rec;
    try {
      rec.start();
    } catch {
      setError('Tidak dapat memulai pengenalan suara.');
      wantRef.current = false;
    }
  }, [lang]);

  useEffect(
    () => () => {
      wantRef.current = false;
      recRef.current?.abort();
    },
    [],
  );

  return { supported, listening, interim, error, start, stop };
}
