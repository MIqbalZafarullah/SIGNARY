// Teks ke suara memakai speechSynthesis bawaan browser (diproses di perangkat
// atau oleh suara bawaan sistem operasi).

export const ttsSupported = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

function pickIndonesianVoice() {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang === 'id-ID') ||
    voices.find((v) => v.lang?.toLowerCase().startsWith('id')) ||
    null
  );
}

/** Membacakan teks dalam bahasa Indonesia. Mengembalikan false bila tidak didukung. */
export function speak(text, { rate = 1 } = {}) {
  if (!ttsSupported() || !text) return false;
  const synth = window.speechSynthesis;
  synth.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'id-ID';
  utter.rate = rate;
  const voice = pickIndonesianVoice();
  if (voice) utter.voice = voice;
  synth.speak(utter);
  return true;
}

export function stopSpeaking() {
  if (ttsSupported()) window.speechSynthesis.cancel();
}
