// =========================================================================
// Analisis bentuk tangan dari 21 titik MediaPipe (worldLandmarks, satuan
// meter, 3D). Dipakai untuk memberi umpan balik latihan di Sign Academy.
//
// Titik: 0 pergelangan; ibu jari 1-4; telunjuk 5-8; tengah 9-12;
// manis 13-16; kelingking 17-20 (MCP, PIP, DIP, ujung).
// =========================================================================

export const FINGER_NAMES = {
  thumb: 'Ibu jari',
  index: 'Telunjuk',
  middle: 'Jari tengah',
  ring: 'Jari manis',
  pinky: 'Kelingking',
};

const FINGER_IDX = {
  index: [5, 6, 7, 8],
  middle: [9, 10, 11, 12],
  ring: [13, 14, 15, 16],
  pinky: [17, 18, 19, 20],
};

const sub = (a, b) => [a.x - b.x, a.y - b.y, a.z - b.z];
const len = (v) => Math.hypot(v[0], v[1], v[2]);
const dist = (a, b) => len(sub(a, b));
const dot = (u, v) => u[0] * v[0] + u[1] * v[1] + u[2] * v[2];

function angleBetween(u, v) {
  const c = dot(u, v) / ((len(u) * len(v)) || 1);
  return (Math.acos(Math.max(-1, Math.min(1, c))) * 180) / Math.PI;
}

// Sudut tekukan pada sendi b (0 = lurus)
const bendAt = (a, b, c) => angleBetween(sub(b, a), sub(c, b));

/**
 * Mengukur keadaan tiap jari.
 * fingers[nama].state: 'up' (lurus) | 'half' (setengah) | 'down' (menekuk)
 * thumb.state: 'out' (terbuka ke samping) | 'side' (menempel) | 'across' (melintang di telapak)
 */
export function analyzeHand(lm) {
  if (!lm || lm.length < 21) return null;
  const palm = dist(lm[0], lm[9]) || 1;

  const fingers = {};
  Object.entries(FINGER_IDX).forEach(([name, [m, p, d, t]]) => {
    const curl = bendAt(lm[0], lm[m], lm[p]) + bendAt(lm[m], lm[p], lm[d]) + bendAt(lm[p], lm[d], lm[t]);
    // Pembanding jarak: ujung jari jauh dari pergelangan = lurus
    const reach = dist(lm[t], lm[0]) / palm;
    let state = 'half';
    // Jangkauan (ujung jari ke pergelangan / panjang telapak) paling stabil;
    // sudut tekuk dipakai sebagai penguat untuk jari yang agak melengkung.
    if (reach >= 1.65 || (curl < 75 && reach > 1.5)) state = 'up';
    else if (curl > 140 || reach < 1.15) state = 'down';
    fingers[name] = { state, curl: Math.round(curl), reach: +reach.toFixed(2) };
  });

  const thumbOut = dist(lm[4], lm[5]) / palm; // jauh dari pangkal telunjuk
  const thumbToPinky = dist(lm[4], lm[17]) / palm; // dekat pangkal kelingking = melintang
  const thumbCurl = bendAt(lm[1], lm[2], lm[3]) + bendAt(lm[2], lm[3], lm[4]);
  let thumbState = 'side';
  if (thumbOut > 0.75 && thumbCurl < 60) thumbState = 'out';
  else if (thumbToPinky < 0.75) thumbState = 'across';

  const spread = angleBetween(sub(lm[8], lm[5]), sub(lm[12], lm[9]));

  return {
    fingers,
    thumb: {
      state: thumbState,
      out: +thumbOut.toFixed(2),
      toPinky: +thumbToPinky.toFixed(2),
      curl: Math.round(thumbCurl),
    },
    spreadIndexMiddle: Math.round(spread),
  };
}

// ---------------------------------------------------------------------------
// Target latihan: huruf SIBI yang bisa dibedakan dari keadaan jari.
// up/down/half untuk jari; out/side/across untuk ibu jari; 'any' = bebas.
// spread: 'apart' (V) atau 'together' (U, B).
// ---------------------------------------------------------------------------
export const PRACTICE_TARGETS = [
  { id: 'A', thumb: 'side', fingers: { index: 'down', middle: 'down', ring: 'down', pinky: 'down' }, tip: 'Kepalkan tangan, ibu jari tegak menempel di sisi telunjuk (jangan di depan jari).' },
  { id: 'B', thumb: 'across', fingers: { index: 'up', middle: 'up', ring: 'up', pinky: 'up' }, spread: 'together', tip: 'Rapatkan empat jari yang tegak, lipat ibu jari ke telapak.' },
  { id: 'D', thumb: 'any', fingers: { index: 'up', middle: 'down', ring: 'down', pinky: 'down' }, tip: 'Hanya telunjuk yang tegak; jari lain melengkung menyentuh ibu jari.' },
  { id: 'I', thumb: 'any', fingers: { index: 'down', middle: 'down', ring: 'down', pinky: 'up' }, tip: 'Hanya kelingking yang tegak.' },
  { id: 'L', thumb: 'out', fingers: { index: 'up', middle: 'down', ring: 'down', pinky: 'down' }, tip: 'Telunjuk tegak dan ibu jari terbuka ke samping membentuk L.' },
  { id: 'V', thumb: 'any', fingers: { index: 'up', middle: 'up', ring: 'down', pinky: 'down' }, spread: 'apart', tip: 'Telunjuk dan jari tengah tegak dan direnggangkan.' },
  { id: 'W', thumb: 'any', fingers: { index: 'up', middle: 'up', ring: 'up', pinky: 'down' }, tip: 'Tiga jari tegak (telunjuk, tengah, manis); kelingking ditekuk.' },
  { id: 'Y', thumb: 'out', fingers: { index: 'down', middle: 'down', ring: 'down', pinky: 'up' }, tip: 'Ibu jari dan kelingking terbuka, tiga jari lain menggenggam.' },
];

const STATE_TEXT = { up: 'lurus/tegak', down: 'ditekuk', half: 'setengah ditekuk' };
const THUMB_TEXT = { out: 'terbuka ke samping', side: 'menempel di sisi telunjuk', across: 'dilipat ke telapak' };

/**
 * Membandingkan hasil analisis dengan target.
 * Mengembalikan daftar pemeriksaan { label, ok, expected, actual } dan skor 0..1.
 */
export function evaluateShape(analysis, target) {
  if (!analysis || !target) return null;
  const checks = [];
  if (target.thumb !== 'any') {
    checks.push({
      key: 'thumb',
      label: FINGER_NAMES.thumb,
      ok: analysis.thumb.state === target.thumb,
      expected: THUMB_TEXT[target.thumb],
      actual: THUMB_TEXT[analysis.thumb.state],
    });
  }
  Object.entries(target.fingers).forEach(([name, want]) => {
    const got = analysis.fingers[name].state;
    checks.push({
      key: name,
      label: FINGER_NAMES[name],
      ok: got === want,
      expected: STATE_TEXT[want],
      actual: STATE_TEXT[got],
    });
  });
  if (target.spread) {
    const s = analysis.spreadIndexMiddle;
    const ok = target.spread === 'apart' ? s >= 14 : s <= 12;
    checks.push({
      key: 'spread',
      label: 'Jarak telunjuk–tengah',
      ok,
      expected: target.spread === 'apart' ? 'direnggangkan' : 'dirapatkan',
      actual: s >= 14 ? 'renggang' : 'rapat',
    });
  }
  const score = checks.filter((c) => c.ok).length / (checks.length || 1);
  return { checks, score, ok: checks.every((c) => c.ok) };
}
