import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  GraduationCap, 
  BookOpen, 
  CheckCircle2, 
  Lock, 
  Play, 
  Award, 
  Trophy, 
  Sparkles, 
  HelpCircle, 
  Gamepad2, 
  RotateCcw, 
  ChevronRight, 
  Check, 
  X, 
  Flame, 
  Star 
} from 'lucide-react';

export default function SignAcademyPage({ onNavigate, showToast }) {
  const [activeTab, setActiveTab] = useState('modul'); // 'modul', 'quiz', 'game'
  const [selectedModule, setSelectedModule] = useState(null);

  // Lock body scroll and handle Escape key when module detail is open
  useEffect(() => {
    if (selectedModule) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setSelectedModule(null);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [selectedModule]);

  // Curriculum: 7 learning modules + 1 practical exam
  const modules = [
    {
      id: 1,
      title: 'Pengenalan Bahasa Isyarat & Budaya Tuli',
      category: 'Fondasi',
      description: 'Memahami etika komunikasi, visual grammar, peran ekspresi wajah (non-manual markers), dan sejarah komunitas Tuli di Indonesia.',
      lessonsCount: 6,
      duration: '45 Menit',
      xp: 150,
      status: 'completed', // completed, in-progress, locked
      progress: 100,
      level: 'Pemula'
    },
    {
      id: 2,
      title: 'Sapaan & Kesantunan Sehari-hari',
      category: 'Komunikasi Dasar',
      description: 'Pelajari isyarat salam santun: Halo, Selamat Pagi/Siang/Malam, Terima Kasih, Maaf, Tolong, dan Sampai Jumpa dengan benar.',
      lessonsCount: 8,
      duration: '50 Menit',
      xp: 200,
      status: 'completed',
      progress: 100,
      level: 'Pemula'
    },
    {
      id: 3,
      title: 'Angka, Waktu, & Penanggalan',
      category: 'Struktur Informasi',
      description: 'Penguasaan isyarat hitungan 1-100, pembacaan jam, nama hari, bulan, serta konsep kemarin, hari ini, dan besok.',
      lessonsCount: 10,
      duration: '60 Menit',
      xp: 250,
      status: 'completed',
      progress: 100,
      level: 'Dasar'
    },
    {
      id: 4,
      title: 'Keluarga & Relasi Sosial',
      category: 'Sosial',
      description: 'Mengenal isyarat anggota keluarga inti (ayah, ibu, saudara), status hubungan, teman, dan sapaan penghormatan.',
      lessonsCount: 8,
      duration: '55 Menit',
      xp: 220,
      status: 'in-progress',
      progress: 65,
      level: 'Menengah'
    },
    {
      id: 5,
      title: 'Aktivitas Sehari-hari & Kata Kerja Utama',
      category: 'Aksi & Interaksi',
      description: 'Belajar mengekspresikan tindakan: makan, minum, mandi, belajar, bekerja, beristirahat, dan bepergian dengan tepat.',
      lessonsCount: 12,
      duration: '75 Menit',
      xp: 300,
      status: 'locked',
      progress: 0,
      level: 'Menengah'
    },
    {
      id: 6,
      title: 'Fasilitas Publik & Keadaan Darurat',
      category: 'Pelayanan Publik',
      description: 'Komunikasi esensial di rumah sakit, stasiun, kantor polisi, isyarat minta bantuan darurat, dan instruksi evakuasi.',
      lessonsCount: 9,
      duration: '60 Menit',
      xp: 280,
      status: 'locked',
      progress: 0,
      level: 'Lanjutan'
    },
    {
      id: 7,
      title: 'Dunia Kerja, Teknologi, & Pendidikan',
      category: 'Profesional',
      description: 'Kosakata rapat formal, istilah teknologi komputer, presentasi inklusif, dan kolaborasi profesional teman Dengar-Tuli.',
      lessonsCount: 10,
      duration: '70 Menit',
      xp: 320,
      status: 'locked',
      progress: 0,
      level: 'Lanjutan'
    },
    {
      id: 8,
      title: 'Ujian Praktik Komprehensif (Sertifikasi)',
      category: 'Evaluasi & Sertifikasi',
      description: 'Evaluasi dua arah menyeluruh: deteksi gestur real-time, kuis pemahaman budaya Tuli, dan simulasi skenario percakapan.',
      lessonsCount: 1,
      duration: '90 Menit',
      xp: 500,
      status: 'locked',
      progress: 0,
      level: 'Ujian Akhir'
    }
  ];

  // Quiz State
  const quizQuestions = [
    {
      id: 1,
      question: 'Dalam budaya Tuli dan tata bahasa isyarat, apa fungsi utama dari Non-Manual Markers (NMM) seperti ekspresi wajah dan gerakan kepala?',
      options: [
        'Hanya sebagai pemanis gerakan tangan tanpa arti tata bahasa',
        'Sebagai unsur tata bahasa penentu intonasi kalimat tanya, seru, atau negasi',
        'Menggantikan ejaan jari alfabet secara keseluruhan',
        'Menandakan bahwa penutur sedang berbicara verbal'
      ],
      correct: 1,
      explanation: 'Ekspresi wajah dan gerakan kepala (NMM) adalah komponen krusial dalam tata bahasa isyarat untuk menentukan jenis kalimat (tanya, sanggahan, atau penekanan intensitas).'
    },
    {
      id: 2,
      question: 'Manakah etika yang paling tepat saat ingin memanggil atau menarik perhatian seorang teman Tuli di ruangan?',
      options: [
        'Berteriak sekeras mungkin di dekat telinganya',
        'Menepuk bahu secara lembut atau melambaikan tangan di dalam jangkauan pandangnya',
        'Melempar benda kecil ke arah tubuhnya',
        'Menarik pakaiannya dengan tiba-tiba dari belakang'
      ],
      correct: 1,
      explanation: 'Menepuk bahu secara perlahan atau melambaikan tangan di bidang pandang depan adalah etika sopan yang paling diterima dalam komunitas Tuli.'
    },
    {
      id: 3,
      question: 'Apa perbedaan mendasar antara BISINDO (Bahasa Isyarat Indonesia) dan SIBI (Sistem Isyarat Bahasa Indonesia)?',
      options: [
        'BISINDO adalah bahasa isyarat alami komunitas Tuli, sedangkan SIBI adalah sistem isyarat buatan berbasis tata bahasa Indonesia verbal',
        'BISINDO hanya menggunakan satu tangan, sedangkan SIBI selalu menggunakan dua tangan',
        'SIBI diciptakan secara alami oleh masyarakat pesisir',
        'Tidak ada perbedaan sama sekali antara keduanya'
      ],
      correct: 0,
      explanation: 'BISINDO lahir secara alami dan organik dari komunitas Tuli Indonesia, sedangkan SIBI adalah sistem isyarat bentukan yang mengadopsi struktur kalimat verbal bahasa Indonesia beserta imbuhan.'
    },
    {
      id: 4,
      question: 'Bagaimana isyarat BISINDO yang umum untuk ungkapan rasa syukur "Terima Kasih"?',
      options: [
        'Menyilangkan kedua tangan di depan dada',
        'Menyentuhkan ujung jemari tangan terbuka ke dagu lalu menggerakkannya ke depan ke arah lawan bicara',
        'Mengepalkan kedua tangan dan menghentakkannya ke bawah',
        'Menepuk kening dengan punggung telapak tangan'
      ],
      correct: 1,
      explanation: 'Isyarat "Terima Kasih" umumnya dilakukan dengan menyentuh area bibir/dagu dengan ujung jari kemudian diayunkan ke depan dengan senyuman santun.'
    },
    {
      id: 5,
      question: 'Mengapa dalam ekosistem SIGNARY, AI diposisikan sebagai jembatan pendukung dan BUKAN pengganti komunitas Tuli?',
      options: [
        'Karena AI tidak memiliki server yang cukup besar',
        'Karena bahasa isyarat kaya akan konteks budaya, rasa kemanusiaan, dan komunitas Tuli adalah pencipta serta validator hakiki',
        'Karena komunitas Tuli menolak seluruh bentuk teknologi digital',
        'Hanya untuk menghemat biaya lisensi software'
      ],
      correct: 1,
      explanation: 'Bahasa isyarat bukan sekadar kode mekanis, melainkan identitas budaya hidup yang membutuhkan validasi komunitas Tuli sebagai co-creator dan penjaga kemurnian bahasa.'
    }
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  // Handle quiz option click
  const handleOptionSelect = (index) => {
    if (showAnswerFeedback) return;
    setSelectedOption(index);
    setShowAnswerFeedback(true);

    const isCorrect = index === quizQuestions[currentQuestionIndex].correct;
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
      showToast('Jawaban Benar! +50 XP');
    } else {
      showToast('Kurang tepat, pelajari penjelasannya.');
    }
  };

  // Next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < quizQuestions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowAnswerFeedback(false);
    } else {
      setIsQuizCompleted(true);
    }
  };

  // Reset quiz
  const handleResetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowAnswerFeedback(false);
    setQuizScore(0);
    setIsQuizCompleted(false);
  };

  // Mini-game "Sign Match" state
  const initialCards = [
    { id: 1, matchId: 'halo', type: 'text', content: 'Halo / Salam', flipped: false, matched: false },
    { id: 2, matchId: 'halo', type: 'sign', content: '👋 Lambaian tangan terbuka setinggi pelipis', flipped: false, matched: false },
    { id: 3, matchId: 'terimakasih', type: 'text', content: 'Terima Kasih', flipped: false, matched: false },
    { id: 4, matchId: 'terimakasih', type: 'sign', content: '🙏 Sentuh dagu & ayunkan ke depan', flipped: false, matched: false },
    { id: 5, matchId: 'tolong', type: 'text', content: 'Tolong / Bantuan', flipped: false, matched: false },
    { id: 6, matchId: 'tolong', type: 'sign', content: '🤲 Dua telapak tangan terbuka menadah naik', flipped: false, matched: false },
    { id: 7, matchId: 'belajar', type: 'text', content: 'Belajar', flipped: false, matched: false },
    { id: 8, matchId: 'belajar', type: 'sign', content: '📖 Mengambil ilmu dari telapak kiri ke kening', flipped: false, matched: false }
  ];

  const [cards, setCards] = useState(() => [...initialCards].sort(() => Math.random() - 0.5));
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchCount, setMatchCount] = useState(0);

  const handleCardClick = (card) => {
    if (card.flipped || card.matched || selectedCards.length === 2) return;

    const newCards = cards.map(c => c.id === card.id ? { ...c, flipped: true } : c);
    setCards(newCards);

    const newSelected = [...selectedCards, card];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      if (newSelected[0].matchId === newSelected[1].matchId) {
        // Matched!
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.matchId === newSelected[0].matchId ? { ...c, matched: true } : c
          ));
          setSelectedCards([]);
          setMatchCount(prev => prev + 1);
          showToast('Pasangan Cocok! Hebat!');
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            (c.id === newSelected[0].id || c.id === newSelected[1].id) ? { ...c, flipped: false } : c
          ));
          setSelectedCards([]);
        }, 1000);
      }
    }
  };

  const handleResetGame = () => {
    setCards([...initialCards].sort(() => Math.random() - 0.5));
    setSelectedCards([]);
    setMatchCount(0);
  };

  return (
    <div className="space-y-8">
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="p-2.5 rounded-2xl liquid-glass text-slate-600 hover:text-primary-600 hover:border-primary-200 transition-all duration-200 active:scale-95 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                Sign Academy
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary-50 text-primary-700 border border-primary-100">
                Kurikulum 7 Modul + 1 Ujian
              </span>
            </div>
            <p className="text-sm text-slate-500 font-medium">
              Pelajari bahasa isyarat berstruktur dengan kuis interaktif, mini-game, dan evaluasi berbasis AI.
            </p>
          </div>
        </div>

        {/* Level and XP Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl liquid-glass border border-white/80 shadow-sm">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold text-slate-700">Streak 5 Hari</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl liquid-glass border border-white/80 shadow-sm">
            <Trophy className="w-4 h-4 text-primary-600" />
            <span className="text-xs font-bold text-slate-900">Level 4 • 1,450 XP</span>
          </div>
        </div>
      </div>

      {/* Tabs Switcher: Modul, Kuis, Game */}
      <div className="flex justify-center">
        <div className="liquid-glass p-1.5 rounded-2xl flex max-w-2xl w-full shadow-lg border border-white/80">
          <button
            onClick={() => setActiveTab('modul')}
            className={`flex-1 py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'modul'
                ? 'bg-gradient-to-r from-primary-600 to-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>Kurikulum Modul</span>
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'quiz'
                ? 'bg-gradient-to-r from-primary-600 to-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-4 h-4 shrink-0" />
            <span>Kuis Pemahaman</span>
          </button>
          <button
            onClick={() => setActiveTab('game')}
            className={`flex-1 py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'game'
                ? 'bg-gradient-to-r from-primary-600 to-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Gamepad2 className="w-4 h-4 shrink-0" />
            <span>Game: Sign Match</span>
          </button>
        </div>
      </div>

      {/* TAB 1: MODUL KURIKULUM */}
      {activeTab === 'modul' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {modules.map((mod) => (
              <div 
                key={mod.id}
                onClick={() => setSelectedModule(mod)}
                className={`liquid-glass rounded-3xl p-6 border transition-all duration-300 cursor-pointer flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 ${
                  mod.status === 'completed'
                    ? 'border-emerald-200/80 hover:border-emerald-300'
                    : mod.status === 'in-progress'
                    ? 'border-primary-300 shadow-md ring-2 ring-primary-500/20'
                    : 'border-white/80 opacity-80'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                      Modul {mod.id}
                    </span>
                    {mod.status === 'completed' && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                        <CheckCircle2 className="w-4 h-4" /> Selesai
                      </span>
                    )}
                    {mod.status === 'in-progress' && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-primary-600">
                        <Play className="w-3.5 h-3.5 fill-primary-600" /> Sedang Belajar
                      </span>
                    )}
                    {mod.status === 'locked' && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                        <Lock className="w-3.5 h-3.5" /> Terkunci
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-slate-900 leading-snug line-clamp-2">
                    {mod.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {mod.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200/60 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                    <span>{mod.lessonsCount} Sesi • {mod.duration}</span>
                    <span className="text-primary-600 font-bold">+{mod.xp} XP</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        mod.status === 'completed' 
                          ? 'bg-emerald-500' 
                          : 'bg-primary-600'
                      }`}
                      style={{ width: `${mod.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Module Detail Modal */}
          {selectedModule && (
            <div 
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200"
              onClick={(e) => {
                if (e.target === e.currentTarget) setSelectedModule(null);
              }}
            >
              <div className="liquid-glass rounded-[32px] max-w-lg w-full max-h-[85vh] bg-white/95 border border-white/90 shadow-2xl flex flex-col relative overflow-hidden animate-in zoom-in-95 duration-200">
                
                {/* Modal Header (Fixed / Pinned Top) */}
                <div className="p-6 pb-4 border-b border-slate-100 flex items-start justify-between shrink-0 bg-white/95 backdrop-blur-md z-10">
                  <div>
                    <span className="text-xs font-bold text-primary-600 tracking-wider uppercase">
                      Detail Modul Pembelajaran {selectedModule.id}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-1">
                      {selectedModule.title}
                    </h3>
                  </div>
                  <button 
                    onClick={() => setSelectedModule(null)}
                    className="p-2 rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    title="Tutup (Esc)"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Body (Scrollable) */}
                <div className="p-6 pt-4 space-y-4 overflow-y-auto overscroll-contain flex-1">
                  <div className="p-4 rounded-2xl bg-white/70 border border-slate-200/60 space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">Fokus Pembelajaran:</span>
                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                      {selectedModule.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="block text-xs text-slate-400">Tingkat</span>
                      <span className="text-xs font-bold text-slate-800">{selectedModule.level}</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="block text-xs text-slate-400">Durasi</span>
                      <span className="text-xs font-bold text-slate-800">{selectedModule.duration}</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="block text-xs text-slate-400">Hadiah</span>
                      <span className="text-xs font-bold text-primary-600">+{selectedModule.xp} XP</span>
                    </div>
                  </div>
                </div>

                {/* Modal Footer (Fixed / Pinned Bottom) */}
                <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0 bg-white/95 backdrop-blur-md z-10">
                  <button
                    onClick={() => setSelectedModule(null)}
                    className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    Tutup
                  </button>
                  <button
                    onClick={() => {
                      setSelectedModule(null);
                      showToast(`Memulai sesi: "${selectedModule.title}"`);
                      setActiveTab('quiz');
                    }}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs liquid-btn-primary text-white text-center shadow-md active:scale-95 transition-all"
                  >
                    Mulai Belajar Modul Ini
                  </button>
                </div>

              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: KUIS PEMAHAMAN INTERAKTIF */}
      {activeTab === 'quiz' && (
        <div className="max-w-2xl mx-auto">
          {!isQuizCompleted ? (
            <div className="liquid-glass rounded-3xl p-6 md:p-8 border border-white/80 shadow-2xl space-y-6">
              {/* Question Progress Header */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-primary-600">
                  Pertanyaan {currentQuestionIndex + 1} dari {quizQuestions.length}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Skor: <strong className="text-emerald-600">{quizScore}</strong> Benar
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-600 transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
                ></div>
              </div>

              {/* Question Text */}
              <h3 className="text-lg font-bold text-slate-900 leading-snug">
                {quizQuestions[currentQuestionIndex].question}
              </h3>

              {/* Options */}
              <div className="space-y-3">
                {quizQuestions[currentQuestionIndex].options.map((option, idx) => {
                  let btnStyle = "bg-white/80 border-slate-200/80 text-slate-700 hover:bg-primary-50 hover:border-primary-200";
                  if (showAnswerFeedback) {
                    if (idx === quizQuestions[currentQuestionIndex].correct) {
                      btnStyle = "bg-emerald-50 border-emerald-300 text-emerald-900 font-bold";
                    } else if (idx === selectedOption) {
                      btnStyle = "bg-red-50 border-red-300 text-red-900";
                    } else {
                      btnStyle = "bg-white/40 border-slate-200/40 text-slate-400 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(idx)}
                      disabled={showAnswerFeedback}
                      className={`w-full text-left p-4 rounded-2xl border text-sm font-medium transition-all duration-200 flex items-center justify-between ${btnStyle}`}
                    >
                      <span className="flex-1 pr-3">{option}</span>
                      {showAnswerFeedback && idx === quizQuestions[currentQuestionIndex].correct && (
                        <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {showAnswerFeedback && idx === selectedOption && idx !== quizQuestions[currentQuestionIndex].correct && (
                        <X className="w-5 h-5 text-red-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Answer Explanation & Next Button */}
              {showAnswerFeedback && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <Sparkles className="w-4 h-4 text-primary-600" />
                    Penjelasan Kunci Jawaban:
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {quizQuestions[currentQuestionIndex].explanation}
                  </p>
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-2.5 rounded-xl font-bold text-xs liquid-btn-primary text-white shadow-md active:scale-95"
                    >
                      {currentQuestionIndex + 1 === quizQuestions.length ? 'Lihat Hasil Akhir' : 'Lanjut Pertanyaan ➔'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Quiz Completed View */
            <div className="liquid-glass rounded-3xl p-8 border border-white/80 shadow-2xl text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-lg">
                <Trophy className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Kuis Selesai!
                </h3>
                <p className="text-sm text-slate-500 font-medium mt-1">
                  Kamu berhasil menjawab <strong className="text-emerald-600 font-bold">{quizScore}</strong> dari {quizQuestions.length} pertanyaan dengan benar.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-primary-50 border border-primary-100 max-w-xs mx-auto">
                <span className="block text-xs font-bold text-primary-700">Hadiah Evaluasi:</span>
                <span className="text-xl font-extrabold text-primary-800">+{quizScore * 50} XP Diperoleh</span>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={handleResetQuiz}
                  className="px-6 py-3 rounded-2xl font-bold text-xs glass-pill text-slate-700 hover:bg-white active:scale-95 flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Ulangi Kuis
                </button>
                <button
                  onClick={() => setActiveTab('modul')}
                  className="px-6 py-3 rounded-2xl font-bold text-xs liquid-btn-primary text-white active:scale-95"
                >
                  Kembali ke Modul
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MINI GAME "SIGN MATCH" */}
      {activeTab === 'game' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Sign Match: Pasangkan Makna & Isyarat
              </h3>
              <p className="text-xs text-slate-500">
                Buka kartu dan cocokkan kosakata dengan deskripsi gerakannya.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700">
                Cocok: <strong className="text-primary-600">{matchCount} / 4</strong>
              </span>
              <button
                onClick={handleResetGame}
                className="p-2 rounded-xl glass-pill text-slate-600 hover:bg-white"
                title="Acak Ulang Kartu"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {cards.map((card) => {
              const isRevealed = card.flipped || card.matched;
              return (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card)}
                  disabled={card.matched}
                  className={`h-32 rounded-2xl p-4 text-center flex flex-col items-center justify-center border transition-all duration-300 text-xs font-bold leading-snug ${
                    card.matched
                      ? 'bg-emerald-50/80 border-emerald-300 text-emerald-800 shadow-sm opacity-90'
                      : isRevealed
                      ? 'liquid-glass border-primary-300 text-primary-900 shadow-md scale-105'
                      : 'bg-white/80 border-slate-200 hover:border-primary-300 text-slate-400 hover:text-slate-600 shadow-sm'
                  }`}
                >
                  {isRevealed ? (
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block mb-1">
                        {card.type === 'text' ? 'Kosakata' : 'Isyarat Gerak'}
                      </span>
                      <span>{card.content}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-slate-300">
                      <GraduationCap className="w-6 h-6" />
                      <span className="text-[10px] tracking-wider uppercase font-extrabold">SIGNARY</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {matchCount === 4 && (
            <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-in fade-in duration-300">
              <Trophy className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="text-base font-bold text-emerald-900">
                Luar Biasa! Semua Kartu Cocok!
              </h4>
              <p className="text-xs text-emerald-700 font-medium">
                Daya ingat gestur dan kosakata Anda sangat tajam. Pertahankan latihan konsisten setiap hari!
              </p>
              <button
                onClick={handleResetGame}
                className="px-6 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 text-white shadow-md hover:bg-emerald-700 active:scale-95"
              >
                Mainkan Sekali Lagi
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
