// =========================================================================
// Pengenal isyarat sederhana berbasis contoh (few-shot), berjalan di browser.
//
// - Tiap frame diubah jadi fitur: posisi pergelangan di layar (untuk gerak)
//   + 20 titik jari relatif terhadap pergelangan, dinormalisasi ukuran telapak
//   (untuk bentuk tangan).
// - Satu contoh = urutan frame ±1,5 detik, disamakan panjangnya (resample).
// - Pencocokan memakai Dynamic Time Warping (DTW) + tetangga terdekat, jadi
//   isyarat diam (bentuk) maupun bergerak bisa dikenali tanpa server/GPU.
// - Ambang penolakan dihitung dari kemiripan antar-contoh label yang sama,
//   sehingga gerakan asing dijawab "tidak dikenali", bukan ditebak.
// =========================================================================

export const SEQ_LEN = 20; // jumlah frame setelah resample
export const RECORD_MS = 1500; // durasi rekam satu contoh
export const MIN_SAMPLES_PER_LABEL = 3;
const POS_WEIGHT = 2; // bobot posisi pergelangan (gerak) terhadap bentuk

const round = (v) => Math.round(v * 1000) / 1000;

/** Fitur satu frame dari hasil HandLandmarker (tangan pertama), atau null. */
export function frameFeatures(result) {
  const lm = result?.landmarks?.[0];
  if (!lm) return null;
  const w = lm[0];
  const palm = Math.hypot(lm[9].x - w.x, lm[9].y - w.y) || 1e-3;
  const f = [w.x * POS_WEIGHT, w.y * POS_WEIGHT];
  for (let i = 1; i < 21; i++) {
    f.push((lm[i].x - w.x) / palm, (lm[i].y - w.y) / palm);
  }
  return f.map(round);
}

/** Menyamakan panjang urutan dengan interpolasi linear. */
export function resample(seq, n = SEQ_LEN) {
  if (!seq.length) return [];
  if (seq.length === 1) return Array.from({ length: n }, () => seq[0]);
  const out = [];
  for (let i = 0; i < n; i++) {
    const t = (i * (seq.length - 1)) / (n - 1);
    const a = Math.floor(t);
    const b = Math.min(seq.length - 1, a + 1);
    const k = t - a;
    out.push(seq[a].map((v, j) => round(v + (seq[b][j] - v) * k)));
  }
  return out;
}

function frameDist(a, b) {
  let s = 0;
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i];
    s += d * d;
  }
  return Math.sqrt(s / a.length);
}

/** Jarak DTW dinormalisasi panjang jalur (0 = identik). */
export function dtw(A, B) {
  const n = A.length;
  const m = B.length;
  const INF = Infinity;
  let prev = new Array(m + 1).fill(INF);
  let prevLen = new Array(m + 1).fill(0);
  prev[0] = 0;
  for (let i = 1; i <= n; i++) {
    const cur = new Array(m + 1).fill(INF);
    const curLen = new Array(m + 1).fill(0);
    for (let j = 1; j <= m; j++) {
      const cost = frameDist(A[i - 1], B[j - 1]);
      let best = prev[j - 1];
      let len = prevLen[j - 1];
      if (prev[j] < best) {
        best = prev[j];
        len = prevLen[j];
      }
      if (cur[j - 1] < best) {
        best = cur[j - 1];
        len = curLen[j - 1];
      }
      cur[j] = cost + best;
      curLen[j] = len + 1;
    }
    prev = cur;
    prevLen = curLen;
  }
  return prev[m] / (prevLen[m] || 1);
}

/** Ringkasan jumlah contoh per label. */
export function summarize(samples) {
  const counts = {};
  samples.forEach((s) => {
    counts[s.label] = (counts[s.label] || 0) + 1;
  });
  return counts;
}

/**
 * Menyiapkan model dari contoh. Hanya label dengan >= MIN_SAMPLES_PER_LABEL contoh
 * yang dipakai. Ambang = 1,8 x median jarak contoh ke contoh terdekat berlabel sama.
 */
export function buildModel(samples) {
  const counts = summarize(samples);
  const usable = samples.filter((s) => counts[s.label] >= MIN_SAMPLES_PER_LABEL);
  const labels = [...new Set(usable.map((s) => s.label))];
  if (!labels.length) return null;
  const nn = usable.map((s, i) => {
    let best = Infinity;
    usable.forEach((o, j) => {
      if (i !== j && o.label === s.label) best = Math.min(best, dtw(s.frames, o.frames));
    });
    return best;
  });
  const sorted = nn.filter(Number.isFinite).sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)] || 0.1;
  return { samples: usable, labels, threshold: Math.max(0.04, median * 1.8) };
}

/**
 * Mengklasifikasi urutan frame. Mengembalikan label terbaik bila cukup dekat
 * dan cukup berbeda dari label lain; jika tidak, label = null.
 */
export function classify(model, seq) {
  if (!model || seq.length < 6) return null;
  const query = resample(seq);
  const bestPerLabel = {};
  model.samples.forEach((s) => {
    const d = dtw(query, s.frames);
    if (bestPerLabel[s.label] === undefined || d < bestPerLabel[s.label]) bestPerLabel[s.label] = d;
  });
  const ranked = Object.entries(bestPerLabel).sort((a, b) => a[1] - b[1]);
  const [label, distance] = ranked[0];
  const second = ranked[1]?.[1];
  const closeEnough = distance <= model.threshold;
  const distinct = second === undefined || (second - distance) / (second || 1) > 0.12;
  // Keyakinan kasar 0..1 untuk ditampilkan (bukan probabilitas statistik)
  const confidence = Math.max(0, Math.min(1, 1 - distance / (model.threshold * 1.5)));
  return { label: closeEnough && distinct ? label : null, distance, threshold: model.threshold, confidence, ranked };
}
