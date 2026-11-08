// =========================================================================
// SIGNARY — Pustaka animasi isyarat (keyframe per tahap).
//
// Setiap isyarat = daftar tahap. Tiap tahap berisi pose tangan kanan (r) dan
// kiri (l) peraga. Tangan yang tidak dipakai cukup diisi null (posisi
// istirahat). Koordinat mengikuti viewBox 240x220 pada SignScene, peraga
// menghadap penonton: tangan KANAN peraga ada di sisi KIRI layar.
//
//   x, y   : posisi pergelangan
//   shape  : bentuk tangan (lihat SHAPES di handModel.js)
//   roll   : putaran di bidang layar (derajat, + = berlawanan jarum jam)
//   yaw    : putaran pada sumbu jari (0 = telapak ke penonton, 180 = punggung)
//   pitch  : condong jari ke arah penonton (+) / menjauh (-)
//   s      : skala (lebih besar = lebih dekat ke penonton)
//   dur    : lama transisi menuju tahap ini (ms), hold: lama diam (ms)
//
// Catatan: ilustrasi ini adalah panduan visual yang disusun dari deskripsi
// gerakan di kamus SIGNARY. Variasi daerah tetap ada, terutama pada BISINDO.
// =========================================================================

const P = (x, y, shape, o = {}) => ({ x, y, shape, ...o });

// ---------------------------------------------------------------- KATA ----
const WORDS = {
  halo: {
    title: 'Halo',
    face: 'smile',
    steps: [
      { text: 'Angkat tangan kanan terbuka di samping pelipis, telapak menghadap ke depan.', r: P(66, 92, 'open', { roll: -4 }), dur: 700, hold: 500 },
      { text: 'Lambaikan telapak ke arah luar.', r: P(60, 90, 'open', { roll: 20 }), dur: 320, hold: 80 },
      { text: 'Lambaikan kembali ke dalam.', r: P(66, 92, 'open', { roll: -8 }), dur: 320, hold: 80 },
      { text: 'Ulangi lambaian sekali lagi dengan santai.', r: P(60, 90, 'open', { roll: 20 }), dur: 320, hold: 300 },
    ],
  },

  terimaKasih: {
    title: 'Terima Kasih',
    steps: [
      { text: 'Rapatkan jari tangan kanan, sentuhkan ujung jari ke dagu / bibir bawah. Punggung tangan menghadap lawan bicara.', r: P(110, 152, 'flat', { yaw: 180, roll: -8 }), dur: 700, hold: 700 },
      { text: 'Gerakkan tangan maju dan sedikit turun ke arah lawan bicara hingga telapak menghadap ke atas.', r: P(92, 184, 'flat', { yaw: 180, pitch: 30, roll: 14, s: 1.2 }), face: 'smile', dur: 650, hold: 900 },
    ],
  },

  keluarga: {
    title: 'Keluarga',
    steps: [
      { text: 'Bentuk huruf K dengan kedua tangan di depan dada (telunjuk tegak, jari tengah condong ke depan, ibu jari di antaranya). Ujung jari saling berdekatan.', r: P(102, 178, 'K', { roll: -8 }), l: P(138, 178, 'K', { roll: -8 }), dur: 700, hold: 600 },
      { text: 'Gerakkan kedua tangan memutar ke arah luar seperti menggambar lingkaran.', r: P(70, 184, 'K', { roll: 12, yaw: -50 }), l: P(170, 184, 'K', { roll: 12, yaw: -50 }), dur: 550, hold: 100 },
      { text: 'Lanjutkan putaran ke depan hingga sisi kelingking kedua tangan bertemu kembali.', r: P(104, 196, 'K', { roll: -4, yaw: 170 }), l: P(136, 196, 'K', { roll: -4, yaw: 170 }), dur: 550, hold: 800 },
    ],
  },

  belajar: {
    title: 'Belajar',
    steps: [
      { text: 'Buka tangan kiri datar menghadap ke atas seperti buku. Tangan kanan terbuka di atasnya.', l: P(158, 182, 'flat', { roll: -90, yaw: -70 }), r: P(112, 106, 'claw', { roll: 180, elbow: [66, 200] }), dur: 700, hold: 600 },
      { text: 'Kuncupkan jari tangan kanan seolah mengambil sesuatu dari telapak kiri.', l: P(158, 182, 'flat', { roll: -90, yaw: -70 }), r: P(112, 114, 'flatO', { roll: 180, elbow: [66, 204] }), dur: 400, hold: 400 },
      { text: 'Bawa tangan kanan yang menguncup ke dahi, seperti memasukkan ilmu ke kepala.', l: P(158, 182, 'flat', { roll: -90, yaw: -70 }), r: P(94, 100, 'flatO', { roll: -30, pitch: -20 }), dur: 650, hold: 900 },
    ],
  },

  makan: {
    title: 'Makan',
    steps: [
      { text: 'Kuncupkan semua ujung jari tangan kanan, arahkan ke mulut.', r: P(104, 132, 'flatO', { roll: -18, pitch: -25 }), dur: 700, hold: 400 },
      { text: 'Gerakkan sedikit menjauh dari bibir.', r: P(98, 146, 'flatO', { roll: -14, pitch: -10, s: 1.06 }), dur: 300, hold: 80 },
      { text: 'Dekatkan kembali ke bibir — ulangi 2 kali secara natural.', r: P(104, 132, 'flatO', { roll: -18, pitch: -25 }), dur: 300, hold: 80 },
      { text: 'Gerakan berulang menandakan aktivitas makan.', r: P(98, 146, 'flatO', { roll: -14, pitch: -10, s: 1.06 }), dur: 300, hold: 80 },
      { text: 'Akhiri dengan ujung jari dekat bibir.', r: P(104, 132, 'flatO', { roll: -18, pitch: -25 }), dur: 300, hold: 600 },
    ],
  },

  sepuluh: {
    title: 'Sepuluh (10)',
    steps: [
      { text: 'Genggam tangan kanan dengan ibu jari tegak ke atas, di depan dada sebelah kanan.', r: P(104, 160, 'thumbUp', { roll: 90, yaw: -40, s: 1.3, elbow: [70, 224] }), dur: 700, hold: 500 },
      { text: 'Putar pergelangan tangan ke luar.', r: P(104, 160, 'thumbUp', { roll: 112, yaw: -40, s: 1.3, elbow: [70, 224] }), dur: 260, hold: 60 },
      { text: 'Putar kembali ke dalam — goyangkan 2 kali.', r: P(104, 160, 'thumbUp', { roll: 72, yaw: -40, s: 1.3, elbow: [70, 224] }), dur: 260, hold: 60 },
      { text: 'Kembali tegak.', r: P(104, 160, 'thumbUp', { roll: 90, yaw: -40, s: 1.3, elbow: [70, 224] }), dur: 260, hold: 600 },
    ],
  },

  rumahSakit: {
    title: 'Rumah Sakit',
    steps: [
      { text: 'Bentuk atap rumah: kedua telapak terbuka, ujung jari saling bertemu di depan wajah.', r: P(82, 158, 'flat', { roll: -42, yaw: -40 }), l: P(158, 158, 'flat', { roll: -42, yaw: -40 }), dur: 700, hold: 700 },
      { text: 'Turunkan tangan kiri. Arahkan telunjuk kanan ke bahu/lengan atas kiri.', r: P(120, 168, 'point', { roll: -58 }), dur: 600, hold: 200 },
      { text: 'Gambar garis tegak (vertikal) dari atas ke bawah.', r: P(120, 186, 'point', { roll: -58 }), dur: 380, hold: 200 },
      { text: 'Pindahkan telunjuk untuk garis mendatar.', r: P(110, 178, 'point', { roll: -58 }), dur: 300, hold: 150 },
      { text: 'Gambar garis mendatar ke kanan hingga membentuk tanda palang (+).', r: P(130, 178, 'point', { roll: -58 }), dur: 380, hold: 800 },
    ],
  },

  senang: {
    title: 'Senang / Bahagia',
    face: 'smile',
    steps: [
      { text: 'Letakkan kedua telapak terbuka di dada bagian bawah, diiringi wajah tersenyum.', r: P(102, 200, 'flat', { roll: -30, yaw: 180 }), l: P(138, 200, 'flat', { roll: -30, yaw: 180 }), dur: 700, hold: 400 },
      { text: 'Usapkan kedua tangan ke atas di sepanjang dada.', r: P(104, 172, 'flat', { roll: -30, yaw: 180 }), l: P(136, 172, 'flat', { roll: -30, yaw: 180 }), dur: 420, hold: 80 },
      { text: 'Putar sedikit ke depan lalu kembali ke bawah (gerak melingkar), ulangi.', r: P(94, 196, 'flat', { roll: -26, yaw: 180, s: 1.06 }), l: P(146, 196, 'flat', { roll: -26, yaw: 180, s: 1.06 }), dur: 420, hold: 80 },
      { text: 'Usap ke atas sekali lagi.', r: P(104, 172, 'flat', { roll: -30, yaw: 180 }), l: P(136, 172, 'flat', { roll: -30, yaw: 180 }), dur: 420, hold: 600 },
    ],
  },

  darurat: {
    title: 'Darurat',
    face: 'urgent',
    steps: [
      { text: 'Kepalkan kedua tangan lalu silangkan pergelangan di depan dada membentuk huruf X.', r: P(134, 186, 'fist', { roll: -38, yaw: 180 }), l: P(106, 186, 'fist', { roll: -38, yaw: 180 }), front: 'R', dur: 700, hold: 700 },
      { text: 'Buka semua jari dengan cepat dan tegas.', r: P(138, 182, 'five', { roll: -40, yaw: 180 }), l: P(102, 182, 'five', { roll: -40, yaw: 180 }), front: 'R', dur: 160, hold: 900 },
    ],
  },

  ai: {
    title: 'Kecerdasan Buatan (AI)',
    steps: [
      { text: 'Eja huruf A: kepalkan tangan, ibu jari menempel di sisi telunjuk.', r: P(98, 160, 'A', { s: 1.1 }), dur: 700, hold: 600 },
      { text: 'Eja huruf I: kelingking tegak, jari lain menggenggam.', r: P(98, 160, 'I', { s: 1.1 }), dur: 400, hold: 600 },
      { text: 'Arahkan telunjuk ke pelipis.', r: P(92, 118, 'point', { roll: 6 }), dur: 500, hold: 200 },
      { text: 'Gerakkan kecil memancar keluar dari pelipis seperti sinyal.', r: P(82, 112, 'point', { roll: 18 }), dur: 300, hold: 700 },
    ],
  },

  sekolah: {
    title: 'Sekolah',
    steps: [
      { text: 'Tangan kiri datar menghadap ke atas. Tangan kanan datar menghadap ke bawah di atasnya.', l: P(158, 184, 'flat', { roll: -90, yaw: -70 }), r: P(84, 150, 'flat', { roll: -90, yaw: 70, elbow: [58, 210] }), dur: 700, hold: 400 },
      { text: 'Tepukkan telapak kanan ke telapak kiri.', l: P(158, 184, 'flat', { roll: -90, yaw: -70 }), r: P(84, 172, 'flat', { roll: -90, yaw: 70, elbow: [58, 216] }), dur: 260, hold: 120 },
      { text: 'Angkat sedikit.', l: P(158, 184, 'flat', { roll: -90, yaw: -70 }), r: P(84, 150, 'flat', { roll: -90, yaw: 70, elbow: [58, 210] }), dur: 260, hold: 60 },
      { text: 'Tepuk sekali lagi dengan ritme teratur (2 kali tepukan).', l: P(158, 184, 'flat', { roll: -90, yaw: -70 }), r: P(84, 172, 'flat', { roll: -90, yaw: 70, elbow: [58, 216] }), dur: 260, hold: 800 },
    ],
  },

  komputer: {
    title: 'Komputer / Laptop',
    steps: [
      { text: 'Buka kedua tangan menghadap ke bawah di depan perut, seperti di atas papan ketik.', r: P(90, 186, 'open', { pitch: 62 }), l: P(150, 186, 'open', { pitch: 62 }), dur: 700, hold: 300 },
      { text: 'Gerakkan jari-jari seperti mengetik, bergantian.', r: P(90, 186, 'typeA', { pitch: 62 }), l: P(150, 186, 'typeB', { pitch: 62 }), dur: 180, hold: 60 },
      { text: 'Ganti jari yang menekan.', r: P(90, 186, 'typeB', { pitch: 62 }), l: P(150, 186, 'typeA', { pitch: 62 }), dur: 180, hold: 60 },
      { text: 'Ulangi gerakan mengetik.', r: P(90, 186, 'typeA', { pitch: 62 }), l: P(150, 186, 'typeB', { pitch: 62 }), dur: 180, hold: 60 },
      { text: 'Ulangi gerakan mengetik.', r: P(90, 186, 'typeB', { pitch: 62 }), l: P(150, 186, 'typeA', { pitch: 62 }), dur: 180, hold: 500 },
    ],
  },

  // ---- Gestur pada Live Interpreter ----
  saya: {
    title: 'Saya',
    steps: [
      { text: 'Kepalkan tangan kanan dengan telunjuk lurus.', r: P(84, 182, 'point', { roll: -40, yaw: -60 }), dur: 700, hold: 300 },
      { text: 'Sentuhkan ujung telunjuk ke dada sendiri.', r: P(92, 176, 'point', { roll: -55, yaw: -60, pitch: -25 }), dur: 350, hold: 800 },
    ],
  },

  bagus: {
    title: 'Bagus Sekali',
    face: 'smile',
    steps: [
      { text: 'Genggam tangan kanan dengan ibu jari tegak di depan dada.', r: P(104, 162, 'thumbUp', { roll: 90, yaw: -40, s: 1.3, elbow: [70, 224] }), dur: 700, hold: 400 },
      { text: 'Dorong sedikit ke depan dengan mantap sambil tersenyum.', r: P(100, 170, 'thumbUp', { roll: 90, yaw: -40, s: 1.48, elbow: [66, 228] }), dur: 350, hold: 900 },
    ],
  },
};

export const SIGNS = WORDS;
