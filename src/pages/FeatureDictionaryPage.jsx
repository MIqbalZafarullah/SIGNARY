import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ArrowLeft, 
  Info, 
  ChevronRight, 
  Sparkles, 
  X, 
  Bookmark, 
  BookmarkCheck, 
  Volume2, 
  Layers,
  HelpCircle,
  Eye
} from 'lucide-react';
import SignAnimator from '../components/sign/SignAnimator';
import { usePersistentState } from '../lib/storage';

export default function FeatureDictionaryPage({ onNavigate, showToast }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDialect, setSelectedDialect] = useState('Semua'); // 'Semua', 'BISINDO', 'SIBI'
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedWordDetail, setSelectedWordDetail] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = usePersistentState('bookmarks', [1, 2, 8]);
  const [hoveredId, setHoveredId] = useState(null);

  // Lock background scroll when modal is open to prevent page scrolling behind it
  useEffect(() => {
    if (selectedWordDetail) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedWordDetail]);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedWordDetail(null);
      }
    };
    if (selectedWordDetail) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedWordDetail]);

  // 9 Kategori Sesuai Permintaan User (Butir 3)
  const categories = [
    'Semua',
    'Sapaan',
    'Keluarga',
    'Pendidikan',
    'Aktivitas Sehari-hari',
    'Angka',
    'Tempat',
    'Perasaan',
    'Kesehatan',
    'Teknologi'
  ];

  // Dummy vocabulary data lengkap dengan 9 kategori
  const vocabularies = [
    {
      id: 1,
      sign: 'halo',
      word: 'Halo',
      dialect: 'BISINDO',
      category: 'Sapaan',
      meaning: 'Ungkapan salam saat bertemu seseorang secara santai maupun formal.',
      description: 'Lambaikan tangan kanan ke arah depan sejajar dengan pelipis, telapak tangan menghadap ke depan dengan jari-jari rapat terbuka lembut.',
      exampleSentence: 'Halo, senang sekali bisa belajar bahasa isyarat bersama Anda hari ini.'
    },
    {
      id: 2,
      sign: 'terimaKasih',
      word: 'Terima Kasih',
      dialect: 'BISINDO',
      category: 'Sapaan',
      meaning: 'Ungkapan rasa syukur atau penghargaan atas bantuan orang lain.',
      description: 'Sentuhkan ujung jari-jari tangan kanan ke dagu/bibir bawah, lalu gerakkan tangan ke depan dan sedikit menurun ke arah lawan bicara.',
      exampleSentence: 'Terima kasih telah menemani saya berkunjung ke komunitas Tuli.'
    },
    {
      id: 3,
      sign: 'keluarga',
      word: 'Keluarga',
      dialect: 'SIBI',
      category: 'Keluarga',
      meaning: 'Unit sosial terkecil yang terdiri dari ayah, ibu, dan anak.',
      description: 'Kedua tangan membentuk huruf K (jari telunjuk dan tengah tegak, jempol di antara keduanya), lalu buat gerakan memutar melingkar hingga ujung tangan bertemu.',
      exampleSentence: 'Keluarga saya sangat mendukung literasi bahasa isyarat sejak dini.'
    },
    {
      id: 4,
      sign: 'belajar',
      word: 'Belajar',
      dialect: 'BISINDO',
      category: 'Pendidikan',
      meaning: 'Proses memperoleh pengetahuan, keterampilan, atau pemahaman baru.',
      description: 'Letakkan tangan kiri terbuka datar seperti buku, lalu gunakan tangan kanan untuk mengambil ilmu dari telapak kiri menuju dahi/kening.',
      exampleSentence: 'Setiap sore kami belajar kosakata baru di Sign Academy.'
    },
    {
      id: 5,
      sign: 'makan',
      word: 'Makan',
      dialect: 'BISINDO',
      category: 'Aktivitas Sehari-hari',
      meaning: 'Memasukkan makanan ke dalam mulut untuk nutrisi tubuh.',
      description: 'Rapatkan ujung semua jari tangan kanan mengarah ke mulut, lalu gerakkan berulang mendekati bibir secara natural.',
      exampleSentence: 'Mari kita makan siang bersama teman-teman komunitas.'
    },
    {
      id: 6,
      sign: 'sepuluh',
      word: 'Sepuluh (10)',
      dialect: 'SIBI',
      category: 'Angka',
      meaning: 'Bilangan cacah bernilai sepuluh.',
      description: 'Genggam tangan kanan dengan ibu jari tegak lurus ke atas, lalu gerakkan pergelangan tangan berputar kecil atau goyangkan ibu jari ke depan.',
      exampleSentence: 'Ada sepuluh peserta baru yang mengikuti orientasi isyarat.'
    },
    {
      id: 7,
      sign: 'rumahSakit',
      word: 'Rumah Sakit',
      dialect: 'BISINDO',
      category: 'Tempat',
      meaning: 'Gedung tempat merawat orang sakit dan pelayanan medis.',
      description: 'Bentuk simbol atap rumah dengan kedua tangan, dilanjutkan dengan tanda palang merah di bahu kiri menggunakan jari telunjuk kanan.',
      exampleSentence: 'Layanan interpreter isyarat kini tersedia di rumah sakit umum.'
    },
    {
      id: 8,
      sign: 'senang',
      word: 'Senang / Bahagia',
      dialect: 'BISINDO',
      category: 'Perasaan',
      meaning: 'Kondisi emosi positif yang menunjukkan kegembiraan hati.',
      description: 'Letakkan kedua telapak tangan terbuka di dada, lalu buat gerakan memutar ke atas secara melingkar diiringi senyuman wajah berseri.',
      exampleSentence: 'Saya sangat senang bisa berkomunikasi lancar tanpa sekat.'
    },
    {
      id: 9,
      sign: 'darurat',
      word: 'Darurat',
      dialect: 'SIBI',
      category: 'Kesehatan',
      meaning: 'Keadaan genting yang memerlukan pertolongan cepat.',
      description: 'Silangkan kedua pergelangan tangan membentuk huruf X dengan mengepal di depan dada, lalu buka jari-jari tangan dengan cepat dan tegas.',
      exampleSentence: 'Tekan tombol darurat jika memerlukan bantuan medis segera.'
    },
    {
      id: 10,
      sign: 'ai',
      word: 'Kecerdasan Buatan (AI)',
      dialect: 'BISINDO',
      category: 'Teknologi',
      meaning: 'Teknologi komputer yang mensimulasikan kecerdasan manusia.',
      description: 'Bentuk huruf A dan I secara bergantian dengan jari, lalu gerakkan tangan menunjuk pelipis dengan simbol sinyal sensorik yang memancar.',
      exampleSentence: 'AI pada SIGNARY mendukung pengenalan suara dan gestur kamera.'
    },
    {
      id: 11,
      sign: 'sekolah',
      word: 'Sekolah',
      dialect: 'SIBI',
      category: 'Pendidikan',
      meaning: 'Lembaga formal untuk proses belajar mengajar murid.',
      description: 'Tepukkan kedua telapak tangan secara mendatar dua kali di depan dada dengan ritme yang teratur.',
      exampleSentence: 'Sekolah luar biasa ini memiliki program literasi inklusif.'
    },
    {
      id: 12,
      sign: 'komputer',
      word: 'Komputer / Laptop',
      dialect: 'BISINDO',
      category: 'Teknologi',
      meaning: 'Perangkat elektronik untuk mengolah data dan program.',
      description: 'Buka kedua telapak tangan menghadap ke bawah, lalu gerakkan semua jari seperti sedang mengetik di atas papan ketik secara bergantian.',
      exampleSentence: 'Buka SIGNARY di komputer Anda untuk mengakses Live Interpreter.'
    }
  ];

  // Filter logic
  const filteredVocabs = vocabularies.filter(item => {
    const matchesSearch = item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDialect = selectedDialect === 'Semua' || item.dialect === selectedDialect;
    const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
    return matchesSearch && matchesDialect && matchesCategory;
  });

  const toggleBookmark = (id, wordName) => {
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter(bId => bId !== id));
      showToast(`Dihapus dari simpanan: "${wordName}"`);
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
      showToast(`Disimpan ke daftar hafalan: "${wordName}"`);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header Back Button & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="p-2.5 rounded-2xl liquid-glass text-slate-600 hover:text-primary-600 hover:border-primary-200 transition-all active:scale-95 shadow-sm shrink-0"
            title="Kembali ke Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[0.6875rem] font-bold uppercase tracking-wider mb-1">
              <Layers className="w-3 h-3" />
              <span>Smart Dictionary BISINDO & SIBI</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Kamus Digital Bahasa Isyarat
            </h1>
          </div>
        </div>

        <div className="text-xs font-semibold text-slate-500 bg-white/70 px-4 py-2 rounded-2xl border border-slate-200/60 shadow-xs">
          Menampilkan <strong className="text-primary-600">{filteredVocabs.length}</strong> kosakata terstandarisasi
        </div>
      </div>

      {/* SEARCH BAR BESAR & FILTER DIALEK (SESUAI BUTIR 3) */}
      <div className="liquid-glass rounded-3xl p-6 border border-white/80 shadow-lg space-y-5">
        
        {/* Large Search Input */}
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
          <input
            type="text"
            placeholder="Cari kosakata isyarat, arti, atau contoh kalimat (contoh: 'Halo', 'Keluarga', 'Makan')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-12 py-4 bg-white/90 border border-slate-200 rounded-2xl text-slate-900 text-base font-medium placeholder:text-slate-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dialect Selector: BISINDO / SIBI */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Standar:</span>
            {['Semua', 'BISINDO', 'SIBI'].map((dialect) => (
              <button
                key={dialect}
                onClick={() => setSelectedDialect(dialect)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedDialect === dialect
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25'
                    : 'bg-white/80 text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {dialect}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-400 font-medium hidden sm:inline-block">
            Tips: BISINDO alami digunakan komunitas Tuli, SIBI umum di sekolah formal.
          </span>
        </div>

        {/* 9 Categories Filter Pills */}
        <div className="pt-2 border-t border-slate-200/60">
          <span className="block text-[0.6875rem] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Kategori Kosakata (9 Bidang):
          </span>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white/80 text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* VOCABULARY CARDS GRID */}
      {filteredVocabs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVocabs.map((item) => {
            const isBookmarked = bookmarkedIds.includes(item.id);
            return (
              <div 
                key={item.id}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="liquid-glass rounded-3xl p-5 border border-white/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Header: Dialect tag & Bookmark button */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-md text-[0.625rem] font-black uppercase tracking-wider ${
                        item.dialect === 'BISINDO' 
                          ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {item.dialect}
                      </span>
                      <span className="text-[0.6875rem] font-semibold text-slate-400">
                        {item.category}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleBookmark(item.id, item.word)}
                      className="text-slate-400 hover:text-amber-500 transition-colors p-1"
                      title={isBookmarked ? 'Hapus Simpanan' : 'Simpan Kosakata'}
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-4 h-4 text-amber-500 fill-amber-500" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Word Title & Meaning */}
                  <h3 className="text-xl font-black text-slate-900 mb-1">
                    {item.word}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium line-clamp-2 mb-3">
                    {item.meaning}
                  </p>

                  {/* SVG Gesture Visual Box */}
                  <div className="bg-gradient-to-b from-sky-50 to-white rounded-2xl border border-slate-200/60 mb-3 overflow-hidden">
                    <SignAnimator signId={item.sign} variant="card" active={hoveredId === item.id} />
                  </div>

                  {/* Instruction description snippet */}
                  <p className="text-xs text-slate-600 font-medium line-clamp-2 leading-relaxed bg-white/70 p-2.5 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-800">Gerakan: </span>
                    {item.description}
                  </p>
                </div>

                {/* Detail Button */}
                <button
                  onClick={() => setSelectedWordDetail(item)}
                  className="mt-4 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-primary-50 text-slate-700 hover:text-primary-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Lihat Detail Lengkap</span>
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="liquid-glass rounded-3xl p-12 text-center border border-white/80 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Kosakata Tidak Ditemukan</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Tidak ada kata yang cocok dengan kata kunci "{searchQuery}" pada filter yang dipilih. Silakan coba kata lain atau usulkan di Inclusive Community.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedDialect('Semua'); setSelectedCategory('Semua'); }}
            className="px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-bold"
          >
            Reset Semua Filter
          </button>
        </div>
      )}

      {/* MODAL DETAIL KOSAKATA */}
      {selectedWordDetail && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedWordDetail(null);
          }}
        >
          <div className="liquid-glass w-full max-w-2xl max-h-[90vh] rounded-[32px] border border-white/90 shadow-2xl bg-white/95 flex flex-col relative overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header (Fixed / Pinned Top) */}
            <div className="p-6 pb-4 border-b border-slate-100 flex items-start justify-between shrink-0 bg-white/95 backdrop-blur-md z-10">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-[0.625rem] font-extrabold uppercase tracking-wider ${
                    selectedWordDetail.dialect === 'BISINDO' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {selectedWordDetail.dialect}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Kategori: {selectedWordDetail.category}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                  {selectedWordDetail.word}
                </h2>
              </div>

              <button
                onClick={() => setSelectedWordDetail(null)}
                className="p-2 rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Tutup (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Smoothly Scrollable) */}
            <div className="p-6 pt-4 space-y-4 overflow-y-auto overscroll-contain flex-1">
              {/* Visual Big Preview */}
              <SignAnimator key={selectedWordDetail.id} signId={selectedWordDetail.sign} variant="full" />

              {/* Content info */}
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-100/80">
                  <span className="block font-bold text-blue-900 mb-1">Definisi:</span>
                  <p className="text-slate-700 font-medium leading-relaxed">{selectedWordDetail.meaning}</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/60">
                  <span className="block font-bold text-slate-900 mb-1">Ringkasan Gerakan:</span>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    {selectedWordDetail.description}
                  </p>
                </div>

                {selectedWordDetail.exampleSentence && (
                  <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-100/80">
                    <span className="block font-bold text-emerald-950 mb-1">Contoh Penggunaan Kalimat:</span>
                    <p className="text-slate-700 italic font-medium leading-relaxed">
                      "{selectedWordDetail.exampleSentence}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions (Fixed / Pinned Bottom) */}
            <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0 bg-white/95 backdrop-blur-md z-10">
              <button
                onClick={() => {
                  toggleBookmark(selectedWordDetail.id, selectedWordDetail.word);
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {bookmarkedIds.includes(selectedWordDetail.id) ? 'Hapus Simpanan' : 'Simpan Kata'}
              </button>

              <button
                onClick={() => {
                  setSelectedWordDetail(null);
                  onNavigate('penerjemah');
                }}
                className="px-5 py-2.5 rounded-xl liquid-btn-primary text-white text-xs font-bold shadow-md active:scale-95 transition-all"
              >
                Coba di Live Interpreter ➔
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
