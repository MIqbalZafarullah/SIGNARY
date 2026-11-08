import { SIGNS } from '../data/signLibrary';

// Kata/frasa yang dipetakan ke animasi isyarat yang tersedia.
const KEYWORDS = {
  halo: ['halo', 'hallo', 'hai', 'hi'],
  terimaKasih: ['terima kasih', 'terimakasih', 'makasih', 'trims'],
  keluarga: ['keluarga'],
  belajar: ['belajar'],
  makan: ['makan'],
  sepuluh: ['sepuluh', '10'],
  rumahSakit: ['rumah sakit', 'rs'],
  senang: ['senang', 'bahagia', 'gembira'],
  darurat: ['darurat'],
  ai: ['ai', 'kecerdasan buatan'],
  sekolah: ['sekolah'],
  komputer: ['komputer', 'laptop'],
  saya: ['saya', 'aku'],
  bagus: ['bagus', 'hebat', 'keren'],
};

const PHRASES = Object.entries(KEYWORDS)
  .flatMap(([id, words]) => words.map((w) => ({ id, words: w.split(' ') })))
  .filter(({ id }) => SIGNS[id])
  .sort((a, b) => b.words.length - a.words.length);

/** Daftar kata yang sudah punya animasi (untuk ditampilkan ke pengguna). */
export const SUPPORTED_WORDS = Object.keys(KEYWORDS)
  .filter((id) => SIGNS[id])
  .map((id) => SIGNS[id].title);

/**
 * Memecah teks menjadi token. Token yang cocok dengan kamus diberi signId,
 * yang belum tersedia tetap ditampilkan agar pengguna tahu.
 */
export function textToSigns(text) {
  const tokens = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean);
  const out = [];
  let i = 0;
  while (i < tokens.length) {
    const match = PHRASES.find(({ words }) => words.every((w, k) => tokens[i + k] === w));
    if (match) {
      out.push({ text: match.words.join(' '), signId: match.id });
      i += match.words.length;
    } else {
      out.push({ text: tokens[i], signId: null });
      i += 1;
    }
  }
  return out;
}
