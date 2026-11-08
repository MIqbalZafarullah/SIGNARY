// =========================================================================
// SIGNARY — Model tangan sederhana untuk animasi bahasa isyarat.
//
// Tangan dimodelkan dalam koordinat lokal 3D (satuan bebas, skala 1):
//   x+ = sisi ibu jari (untuk tangan KANAN), y+ = arah jari, z+ = arah telapak.
// Saat yaw = 0, telapak menghadap ke penonton. Tangan kiri adalah cermin
// tangan kanan, sehingga parameter yang sama menghasilkan pose simetris.
// Pose kemudian diproyeksikan secara ortografis ke bidang layar (SVG).
// =========================================================================

const DEG = Math.PI / 180;

// ---- Geometri dasar tangan kanan -----------------------------------------
const PALM = [
  [-14, 0], [14, 0], [19, 14], [19, 42], [11, 47], [1, 48], [-9, 47], [-17, 43], [-18, 16],
];

const FINGERS = [
  { base: [13.5, 44], len: [18, 11, 8.5], w: 8.6 }, // telunjuk
  { base: [4.5, 46], len: [20, 12.5, 9], w: 8.9 }, // tengah
  { base: [-5, 45], len: [18.5, 11.5, 8.5], w: 8.4 }, // manis
  { base: [-13.5, 41], len: [14, 9, 7.5], w: 7.6 }, // kelingking
];

const THUMB_BASE = [12, 10, 3];
const THUMB_LEN = [18, 14, 11];
const THUMB_W = 9.6;

// ---- Posisi ibu jari (arah tiap ruas, koordinat lokal tangan kanan) ------
export const THUMBS = {
  // terbuka ke samping (huruf L, angka 5, Y)
  out: [[0.85, 0.45, 0.25], [0.9, 0.42, 0.05], [0.9, 0.44, 0]],
  // lurus ke samping penuh (jempol "bagus" sebelum diputar)
  straight: [[0.95, 0.15, 0.3], [1, 0.05, 0.05], [1, 0.02, 0]],
  // posisi santai pada tangan terbuka
  relaxed: [[0.6, 0.72, 0.3], [0.5, 0.86, 0.12], [0.4, 0.92, 0]],
  // menempel di sisi telunjuk (huruf A)
  side: [[0.35, 0.85, 0.42], [0.12, 0.98, 0.25], [0.02, 1, 0.12]],
  // terlipat melintang di telapak (huruf B, 4)
  across: [[0.15, 0.7, 0.7], [-0.75, 0.42, 0.5], [-0.95, 0.2, 0.25]],
  // melintang di depan jari yang tergenggam (huruf S, kepalan)
  over: [[0.2, 0.75, 0.75], [-0.55, 0.55, 0.7], [-0.92, 0.32, 0.35]],
  // terselip di bawah jari (huruf E, M, N)
  tuck: [[0.1, 0.75, 0.6], [-0.6, 0.6, 0.45], [-0.85, 0.5, 0.15]],
  // menyelip di antara telunjuk & tengah (huruf T)
  between: [[0.15, 0.8, 0.6], [-0.2, 0.85, 0.55], [-0.4, 0.85, 0.4]],
  // naik di antara telunjuk & tengah (huruf K, P)
  kup: [[-0.21, 0.95, 0.24], [-0.09, 0.97, 0.2], [0.01, 0.98, 0.18]],
  // ujung bertemu ujung telunjuk membentuk lingkaran (O, F)
  ring: [[0.24, 0.92, 0.3], [0.02, 0.73, 0.68], [-0.19, 0.38, 0.9]],
  // melengkung membentuk huruf C
  cee: [[-0.26, 0.83, 0.49], [0.17, 0.68, 0.71], [0.53, 0.41, 0.74]],
  // bertemu ujung semua jari (paruh / flat-O)
  pinch: [[-0.31, 0.51, 0.81], [0.02, 0.65, 0.76], [0.31, 0.67, 0.67]],
  // menyentuh jari tengah yang menekuk (huruf D)
  touchMid: [[0.14, 0.58, 0.8], [-0.19, 0.71, 0.68], [-0.47, 0.75, 0.47]],
  // menahan kelingking (huruf W, angka 3 SIBI)
  touchPinky: [[0.1, 0.7, 0.7], [-0.7, 0.45, 0.55], [-0.95, 0.25, 0.25]],
  // sejajar telunjuk (huruf G, Q)
  parallel: [[0.55, 0.75, 0.4], [0.3, 0.95, 0.15], [0.2, 0.98, 0.05]],
};

// ---- Bentuk tangan --------------------------------------------------------
// f: tekukan jari [telunjuk, tengah, manis, kelingking]
//    angka 0..1 (0 = lurus, 1 = menggenggam) atau [MCP, PIP, DIP] dalam derajat.
// s: renggang tiap jari (derajat, + ke arah ibu jari).
// t: kunci THUMBS.
const C = 1; // menggenggam penuh
export const SHAPES = {
  open: { f: [0, 0, 0, 0], s: [3, 0, -3, -6], t: 'relaxed' },
  five: { f: [0, 0, 0, 0], s: [12, 1, -10, -22], t: 'out' },
  flat: { f: [0, 0, 0, 0], s: [1, 0, -1, -2], t: 'side' },
  fist: { f: [C, C, C, C], s: [0, 0, 0, 0], t: 'over' },
  thumbUp: { f: [C, C, C, C], s: [0, 0, 0, 0], t: 'straight' },
  point: { f: [0, C, C, C], s: [0, 0, 0, 0], t: 'over' },
  flatO: { f: [[72, 40, 20], [72, 40, 20], [72, 40, 20], [72, 42, 20]], s: [-4, -1, 2, 5], t: 'pinch' },
  claw: { f: [[25, 55, 35], [25, 55, 35], [25, 55, 35], [25, 55, 35]], s: [10, 1, -9, -18], t: 'out' },
  bent: { f: [[80, 0, 0], [80, 0, 0], [80, 0, 0], [80, 0, 0]], s: [1, 0, -1, -2], t: 'side' },
  // jari mengetik (bergantian)
  typeA: { f: [[45, 30, 15], [8, 8, 0], [45, 30, 15], [8, 8, 0]], s: [6, 0, -6, -12], t: 'relaxed' },
  typeB: { f: [[8, 8, 0], [45, 30, 15], [8, 8, 0], [45, 30, 15]], s: [6, 0, -6, -12], t: 'relaxed' },
  // Abjad jari SIBI
  A: { f: [C, C, C, C], s: [0, 0, 0, 0], t: 'side' },
  B: { f: [0, 0, 0, 0], s: [1, 0, -1, -2], t: 'across' },
  C: { f: [[30, 45, 25], [30, 45, 25], [30, 45, 25], [30, 45, 25]], s: [0, 0, 0, 0], t: 'cee' },
  D: { f: [0, [55, 70, 40], [55, 70, 40], [55, 70, 40]], s: [0, 0, 0, 0], t: 'touchMid' },
  E: { f: [[15, 100, 70], [15, 100, 70], [15, 100, 70], [15, 100, 70]], s: [0, 0, 0, 0], t: 'tuck' },
  F: { f: [[45, 70, 50], 0, 0, 0], s: [0, 4, -6, -14], t: 'ring' },
  G: { f: [0, C, C, C], s: [0, 0, 0, 0], t: 'parallel' },
  H: { f: [0, 0, C, C], s: [1, -1, 0, 0], t: 'over' },
  I: { f: [C, C, C, 0], s: [0, 0, 0, -4], t: 'over' },
  K: { f: [0, [55, 0, 0], C, C], s: [6, -6, 0, 0], t: 'kup' },
  L: { f: [0, C, C, C], s: [0, 0, 0, 0], t: 'straight' },
  M: { f: [[85, 95, 50], [85, 95, 50], [85, 95, 50], C], s: [0, 0, 0, 0], t: 'tuck' },
  N: { f: [[85, 95, 50], [85, 95, 50], C, C], s: [0, 0, 0, 0], t: 'tuck' },
  O: { f: [[45, 70, 50], [45, 70, 50], [45, 70, 50], [45, 70, 50]], s: [0, 0, 0, 0], t: 'ring' },
  R: { f: [0, 0, C, C], s: [-9, 8, 0, 0], t: 'over' },
  S: { f: [C, C, C, C], s: [0, 0, 0, 0], t: 'over' },
  T: { f: [[70, 100, 60], C, C, C], s: [0, 0, 0, 0], t: 'between' },
  U: { f: [0, 0, C, C], s: [1, -1, 0, 0], t: 'over' },
  V: { f: [0, 0, C, C], s: [12, -10, 0, 0], t: 'over' },
  W: { f: [0, 0, 0, C], s: [14, 0, -14, 0], t: 'touchPinky' },
  X: { f: [[10, 95, 70], C, C, C], s: [0, 0, 0, 0], t: 'over' },
  Y: { f: [C, C, C, 0], s: [0, 0, 0, -28], t: 'straight' },
};

// ---- Resolusi & interpolasi bentuk ---------------------------------------
function curlToAngles(c) {
  return [90 * c, 100 * c, 65 * c];
}

function norm(v) {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
}

export function resolveShape(name) {
  const def = SHAPES[name] || SHAPES.open;
  return {
    fingers: def.f.map((f, i) => ({
      a: Array.isArray(f) ? f : curlToAngles(f),
      s: def.s[i] || 0,
    })),
    thumb: THUMBS[def.t].map(norm),
  };
}

const lerp = (a, b, k) => a + (b - a) * k;

export function lerpShape(A, B, k) {
  return {
    fingers: A.fingers.map((fa, i) => ({
      a: fa.a.map((v, j) => lerp(v, B.fingers[i].a[j], k)),
      s: lerp(fa.s, B.fingers[i].s, k),
    })),
    thumb: A.thumb.map((v, i) => norm(v.map((c, j) => lerp(c, B.thumb[i][j], k)))),
  };
}

// Pose tangan lengkap (posisi pergelangan + orientasi + bentuk)
export function resolveHand(h) {
  return {
    x: h.x, y: h.y,
    roll: h.roll || 0, yaw: h.yaw || 0, pitch: h.pitch || 0,
    s: h.s || 1,
    shape: resolveShape(h.shape),
    elbow: h.elbow || null,
  };
}

export function lerpHand(A, B, k) {
  return {
    x: lerp(A.x, B.x, k), y: lerp(A.y, B.y, k),
    roll: lerp(A.roll, B.roll, k), yaw: lerp(A.yaw, B.yaw, k), pitch: lerp(A.pitch, B.pitch, k),
    s: lerp(A.s, B.s, k),
    shape: lerpShape(A.shape, B.shape, k),
    elbow: A.elbow && B.elbow
      ? [lerp(A.elbow[0], B.elbow[0], k), lerp(A.elbow[1], B.elbow[1], k)]
      : (k < 0.5 ? A.elbow : B.elbow),
  };
}

// ---- Proyeksi ke layar ----------------------------------------------------
function makeRot(yaw, pitch, roll) {
  const cy = Math.cos(yaw * DEG), sy = Math.sin(yaw * DEG);
  const cp = Math.cos(pitch * DEG), sp = Math.sin(pitch * DEG);
  const cr = Math.cos(roll * DEG), sr = Math.sin(roll * DEG);
  return ([x, y, z]) => {
    const x1 = x * cy + z * sy;
    const z1 = -x * sy + z * cy;
    const y2 = y * cp - z1 * sp;
    const z2 = y * sp + z1 * cp;
    return [x1 * cr - y2 * sr, x1 * sr + y2 * cr, z2];
  };
}

const HAND_SCALE = 0.74;

/**
 * Menghasilkan bagian-bagian tangan yang siap digambar (sudah diurutkan
 * berdasarkan kedalaman) beserta titik siku untuk lengan bawah.
 * side: 'R' | 'L'
 */
export function buildHand(pose, side) {
  const m = side === 'L' ? -1 : 1;
  const yaw = pose.yaw * m;
  const roll = pose.roll * m;
  const rot = makeRot(yaw, pose.pitch, roll);
  const sc = HAND_SCALE * pose.s;
  const toScreen = (p) => {
    const r = rot([p[0] * m, p[1], p[2]]);
    return { x: pose.x + r[0] * sc, y: pose.y - r[1] * sc, z: r[2] };
  };

  const parts = [];

  // Telapak
  const palmPts = PALM.map(([x, y]) => toScreen([x * 0.86, y * 0.94 + 1.5, 0]));
  const normal = rot([0, 0, 1]);
  parts.push({
    kind: 'palm',
    pts: palmPts,
    z: -0.5,
    w: 10 * sc,
    palmFacing: normal[2] > 0.2,
  });

  // Jari-jari
  pose.shape.fingers.forEach((f, i) => {
    const def = FINGERS[i];
    const s = f.s * DEG;
    const u = [Math.sin(s), Math.cos(s), 0];
    let p = [def.base[0], def.base[1], 0];
    const pts = [toScreen(p)];
    let theta = 0;
    for (let j = 0; j < 3; j++) {
      theta += f.a[j] * DEG;
      const d = [u[0] * Math.cos(theta), u[1] * Math.cos(theta), Math.sin(theta)];
      p = [p[0] + d[0] * def.len[j], p[1] + d[1] * def.len[j], p[2] + d[2] * def.len[j]];
      pts.push(toScreen(p));
    }
    const zAvg = pts.reduce((a, q) => a + q.z, 0) / pts.length;
    parts.push({ kind: 'finger', pts, z: zAvg + (i === 0 ? 0.05 : 0) - i * 0.01, w: def.w * sc });
  });

  // Ibu jari
  {
    let p = [...THUMB_BASE];
    const pts = [toScreen(p)];
    pose.shape.thumb.forEach((d, j) => {
      p = [p[0] + d[0] * THUMB_LEN[j], p[1] + d[1] * THUMB_LEN[j], p[2] + d[2] * THUMB_LEN[j]];
      pts.push(toScreen(p));
    });
    // Kedalaman ibu jari dihitung dari dua ruas terakhir agar tampil di depan
    // jari yang menggenggam ketika memang melintang di depannya.
    const zAvg = (pts[2].z + pts[3].z) / 2;
    parts.push({ kind: 'thumb', pts, z: zAvg, w: THUMB_W * sc });
  }

  parts.sort((a, b) => a.z - b.z);

  // Lengan bawah mengikuti sumbu tangan (-y), kecuali siku ditentukan manual.
  const wrist = toScreen([0, 0, 0]);
  let elbow;
  if (pose.elbow) {
    elbow = { x: pose.elbow[0], y: pose.elbow[1] };
  } else {
    const down = rot([0, -1, 0]);
    const L = 62 * pose.s;
    elbow = { x: wrist.x + down[0] * L, y: wrist.y - down[1] * L };
  }
  const center = toScreen([0, 26, 0]);
  return { parts, wrist, elbow, center, depth: parts.reduce((a, q) => a + q.z, 0) / parts.length };
}
