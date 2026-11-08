// Aturan level sederhana: setiap 400 XP naik satu level.
export const XP_PER_LEVEL = 400;

export const levelForXp = (xp) => 1 + Math.floor((xp || 0) / XP_PER_LEVEL);

/** Persentase menuju level berikutnya (0-100). */
export const levelProgress = (xp) => Math.round((((xp || 0) % XP_PER_LEVEL) / XP_PER_LEVEL) * 100);

export const formatXp = (xp) => `${(xp || 0).toLocaleString('id-ID')} XP`;
