import { useCallback, useEffect, useRef, useState } from 'react';

/** Menyalakan/mematikan kamera depan dan membersihkannya saat komponen ditutup. */
export default function useCameraStream() {
  const [stream, setStream] = useState(null);
  const [error, setError] = useState('');
  const [starting, setStarting] = useState(false);
  const streamRef = useRef(null);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setStream(null);
  }, []);

  const start = useCallback(async (quality = 720) => {
    setError('');
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Browser ini tidak mendukung akses kamera.');
      return false;
    }
    setStarting(true);
    try {
      const h = Number(quality) || 720;
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', height: { ideal: h }, width: { ideal: Math.round((h * 16) / 9) } },
        audio: false,
      });
      streamRef.current = s;
      setStream(s);
      return true;
    } catch {
      setError('Akses kamera ditolak atau kamera tidak tersedia.');
      return false;
    } finally {
      setStarting(false);
    }
  }, []);

  useEffect(() => () => streamRef.current?.getTracks().forEach((t) => t.stop()), []);

  return { stream, error, starting, start, stop };
}
