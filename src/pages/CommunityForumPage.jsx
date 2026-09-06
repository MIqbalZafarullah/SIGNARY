import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  MessageSquare, 
  ThumbsUp, 
  Share2, 
  Plus, 
  X, 
  MessageCircle,
  Eye,
  CheckCircle,
  Sparkles,
  Users,
  HandMetal,
  HelpCircle,
  Send,
  Filter
} from 'lucide-react';

export default function CommunityForumPage({ onNavigate, showToast }) {
  const [activeView, setActiveView] = useState('feed'); // 'feed', 'proposals'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('Semua');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');

  // Lock body scroll and handle Escape key when any modal is open
  useEffect(() => {
    const isAnyModalOpen = isPostModalOpen || isProposalModalOpen;
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setIsPostModalOpen(false);
          setIsProposalModalOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isPostModalOpen, isProposalModalOpen]);
  
  // New post fields
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Belajar');

  // New word proposal fields
  const [propWord, setPropWord] = useState('');
  const [propDialect, setPropDialect] = useState('BISINDO');
  const [propCategory, setPropCategory] = useState('Teknologi');
  const [propGestureDesc, setPropGestureDesc] = useState('');

  // Feed posts data
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Sarah Devina',
      role: 'Dengar (Pelajar Isyarat)',
      time: '2 jam yang lalu',
      title: 'Tips Cepat Menghafal Alfabet Jari BISINDO untuk Pemula!',
      content: 'Halo rekan-rekan! Kunci melatih ketangkasan ejaan jari adalah berlatih 10 menit setiap pagi di depan cermin. Cermin membantu memastikan bentuk tangan kita sudah akurat dari sudut pandang lawan bicara.',
      category: 'Belajar',
      comments: [
        { id: 101, author: 'Budi Santoso', role: 'Teman Tuli', text: 'Setuju sekali! Jangan lupa latihan relaksasi pergelangan tangan ya.' }
      ],
      likes: 48,
      views: 142
    },
    {
      id: 2,
      author: 'Ahmad Fauzi',
      role: 'Teman Tuli & Aktivis Komunitas',
      time: '5 jam yang lalu',
      title: 'Pertemuan Tatap Muka Komunitas Isyarat & Pengguna SIGNARY Akhir Pekan Ini',
      content: 'Kabar gembira! Akhir pekan ini kita akan mengadakan sesi kopi darat di Perpustakaan Nasional Jakarta lantai 24 jam 14.00 WIB. Kita akan menguji fitur multimodal SIGNARY bersama rekan-rekan tuli dan dengar.',
      category: 'Kegiatan',
      comments: [
        { id: 102, author: 'Dewi Sartika', role: 'JBI', text: 'Saya siap hadir mendampingi rekan-rekan baru!' }
      ],
      likes: 64,
      views: 210
    },
    {
      id: 3,
      author: 'Putri Amalia',
      role: 'Juru Bahasa Isyarat (JBI)',
      time: '1 hari yang lalu',
      title: 'Perkembangan Standardisasi Istilah Kecerdasan Buatan dalam Bahasa Isyarat',
      content: 'Dalam forum bahasa isyarat terbaru, kami membahas pentingnya keseragaman isyarat istilah teknologi baru seperti "Multimodal AI" dan "Machine Learning" agar mudah dipahami pelajar tuli di sekolah inklusi.',
      category: 'Aksesibilitas',
      comments: [],
      likes: 82,
      views: 315
    }
  ]);

  // Sign proposals by Deaf community (Co-creator Hub)
  const [proposals, setProposals] = useState([
    {
      id: 1,
      word: 'Multimodal',
      dialect: 'BISINDO',
      category: 'Teknologi',
      proposer: 'Gita Prasetya',
      proposerRole: 'Komunitas Tuli Jakarta',
      gestureDesc: 'Tangan kiri membentuk bidang datar (layar), tangan kanan menyebarkan lima jari secara bergelombang menandakan beragam sensor.',
      votes: 142,
      status: 'Terverifikasi Ahli Tuli'
    },
    {
      id: 2,
      word: 'Kecerdasan Buatan (AI)',
      dialect: 'BISINDO',
      category: 'Teknologi',
      proposer: 'Faisal Akbar',
      proposerRole: 'Teman Tuli Bandung',
      gestureDesc: 'Jari telunjuk menyentuh pelipis kanan lalu meluas membentuk jaringan simpul di udara di depan dada.',
      votes: 98,
      status: 'Masuk Kamus SIGNARY'
    },
    {
      id: 3,
      word: 'Inklusivitas Berdaya',
      dialect: 'BISINDO',
      category: 'Sosial',
      proposer: 'Rina Maryati',
      proposerRole: 'Aktivis Tuli Surabaya',
      gestureDesc: 'Dua tangan melingkar saling bertautan membentuk lingkaran utuh tanpa celah dengan senyum hangat.',
      votes: 76,
      status: 'Ditinjau Komunitas'
    }
  ]);

  // Handle like post
  const handleLike = (postId) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        showToast(`Menyukai postingan dari: ${p.author}`);
        return { ...p, likes: p.likes + 1 };
      }
      return p;
    }));
  };

  // Handle vote proposal
  const handleVoteProposal = (propId) => {
    setProposals(proposals.map(pr => {
      if (pr.id === propId) {
        showToast(`Dukungan diberikan untuk isyarat "${pr.word}"!`);
        return { ...pr, votes: pr.votes + 1 };
      }
      return pr;
    }));
  };

  // Create post
  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    const newPost = {
      id: Date.now(),
      author: 'Rian Adiputra',
      role: 'Pelajar Isyarat (Dengar)',
      time: 'Baru saja',
      title: newTitle,
      content: newContent,
      category: newCategory,
      comments: [],
      likes: 0,
      views: 1
    };

    setPosts([newPost, ...posts]);
    setIsPostModalOpen(false);
    setNewTitle('');
    setNewContent('');
    showToast('Postingan Anda berhasil diterbitkan di komunitas!');
  };

  // Propose new sign word
  const handleProposeWord = (e) => {
    e.preventDefault();
    if (!propWord || !propGestureDesc) return;

    const newProp = {
      id: Date.now(),
      word: propWord,
      dialect: propDialect,
      category: propCategory,
      proposer: 'Rian Adiputra (Kolaborator)',
      proposerRole: 'Pengguna Terverifikasi',
      gestureDesc: propGestureDesc,
      votes: 1,
      status: 'Ditinjau Komunitas'
    };

    setProposals([newProp, ...proposals]);
    setIsProposalModalOpen(false);
    setPropWord('');
    setPropGestureDesc('');
    showToast('Usulan isyarat Anda berhasil dikirimkan ke dewan komunitas Tuli!');
  };

  // Add comment
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText || !activeCommentPost) return;

    const updatedPosts = posts.map(p => {
      if (p.id === activeCommentPost.id) {
        return {
          ...p,
          comments: [
            ...p.comments,
            {
              id: Date.now(),
              author: 'Rian Adiputra',
              role: 'Pelajar Isyarat',
              text: newCommentText
            }
          ]
        };
      }
      return p;
    });

    setPosts(updatedPosts);
    setNewCommentText('');
    showToast('Komentar berhasil dikirimkan!');
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'Semua' || post.category === selectedTag;
    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-8">
      {/* Header & Action Buttons */}
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
                Inclusive Community & Co-Creator Hub
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200/60">
                Kolaborasi Tuli-Dengar
              </span>
            </div>
            <p className="text-sm text-slate-500 font-medium">
              Ruang diskusi setara, pertukaran budaya Tuli, dan validasi partisipatif kosakata isyarat baru.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsProposalModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 glass-pill text-slate-700 hover:text-primary-600 hover:bg-white font-bold text-xs rounded-2xl shadow-sm active:scale-95 transition-all"
          >
            <HandMetal className="w-4 h-4 text-primary-600" />
            Usulkan Kosakata
          </button>
          <button
            onClick={() => setIsPostModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 liquid-btn-primary text-white font-bold text-xs rounded-2xl shadow-lg active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            Buat Diskusi
          </button>
        </div>
      </div>

      {/* Primary Switcher: Feed vs Usulan Kosakata (Co-creator) */}
      <div className="flex justify-center">
        <div className="liquid-glass p-1.5 rounded-2xl flex max-w-md w-full shadow-lg border border-white/80">
          <button
            onClick={() => setActiveView('feed')}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeView === 'feed'
                ? 'bg-gradient-to-r from-primary-600 to-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Forum Diskusi (Feed)
          </button>
          <button
            onClick={() => setActiveView('proposals')}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeView === 'proposals'
                ? 'bg-gradient-to-r from-primary-600 to-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Usulan Isyarat Baru ({proposals.length})
          </button>
        </div>
      </div>

      {/* VIEW A: FORUM DISKUSI */}
      {activeView === 'feed' && (
        <div className="space-y-6">
          {/* Search & Tags Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            <div className="lg:col-span-8 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari topik diskusi, tips belajar, kegiatan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-2xl text-slate-900 text-sm focus:bg-white focus:border-primary-500 focus:outline-none shadow-sm transition-all duration-200"
              />
            </div>

            <div className="lg:col-span-4 flex overflow-x-auto gap-2 scrollbar-none pb-2 lg:pb-0">
              {['Semua', 'Belajar', 'Kegiatan', 'Aksesibilitas'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                    selectedTag === tag
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'glass-pill text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Feed Posts */}
          <div className="space-y-5">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <article 
                  key={post.id}
                  className="liquid-glass rounded-[32px] p-6 md:p-8 border border-white/80 shadow-lg hover:border-primary-200/80 transition-all duration-300 space-y-4"
                >
                  {/* Author Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-sky-500 text-white font-bold text-sm flex items-center justify-center shadow-md">
                        {post.author.charAt(0)}
                      </div>
                      <div>
                        <span className="block text-sm font-bold text-slate-900">{post.author}</span>
                        <span className="block text-[11px] font-semibold text-slate-400">{post.role}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-400 font-medium">{post.time}</span>
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Title & Body */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900 hover:text-primary-600 cursor-pointer transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed font-medium">
                      {post.content}
                    </p>
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200/60 text-slate-500 text-xs font-semibold">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => handleLike(post.id)}
                        className="flex items-center gap-1.5 hover:text-primary-600 transition-all active:scale-95 py-1 px-2.5 rounded-xl hover:bg-slate-100/60"
                      >
                        <ThumbsUp className="w-4 h-4 text-primary-500" />
                        <span>{post.likes}</span>
                      </button>
                      
                      <button 
                        onClick={() => setActiveCommentPost(activeCommentPost?.id === post.id ? null : post)}
                        className="flex items-center gap-1.5 hover:text-primary-600 transition-all active:scale-95 py-1 px-2.5 rounded-xl hover:bg-slate-100/60"
                      >
                        <MessageCircle className="w-4 h-4 text-slate-400" />
                        <span>{post.comments.length} Komentar</span>
                      </button>
                      
                      <span className="flex items-center gap-1.5 text-slate-400 py-1 px-2.5">
                        <Eye className="w-4 h-4" />
                        <span>{post.views}</span>
                      </span>
                    </div>

                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(post.title);
                        showToast('Link diskusi disalin!');
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-primary-600 hover:bg-slate-100/60 transition-all"
                      title="Bagikan"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Inline Comments Section */}
                  {activeCommentPost?.id === post.id && (
                    <div className="pt-4 mt-4 border-t border-slate-200/60 space-y-4 animate-in fade-in duration-200">
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                        {post.comments.length === 0 ? (
                          <p className="text-xs text-slate-400 italic">Belum ada tanggapan. Jadilah yang pertama berkomentar!</p>
                        ) : (
                          post.comments.map(c => (
                            <div key={c.id} className="p-3 rounded-2xl bg-white/60 border border-slate-100 text-xs space-y-0.5">
                              <div className="flex items-center justify-between text-slate-500 font-bold">
                                <span>{c.author} <span className="font-normal text-slate-400">({c.role})</span></span>
                              </div>
                              <p className="text-slate-700 font-medium">{c.text}</p>
                            </div>
                          ))
                        )}
                      </div>

                      <form onSubmit={handleAddComment} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Tulis balasan inklusif..."
                          value={newCommentText}
                          onChange={(e) => setNewCommentText(e.target.value)}
                          className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-primary-500"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2.5 rounded-xl liquid-btn-primary text-white text-xs font-bold flex items-center gap-1"
                        >
                          <Send className="w-3.5 h-3.5" /> Kirim
                        </button>
                      </form>
                    </div>
                  )}
                </article>
              ))
            ) : (
              <div className="liquid-glass rounded-3xl p-12 text-center text-slate-400">
                <p className="text-sm font-bold">Tidak ada topik diskusi ditemukan.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW B: CO-CREATOR HUB (USULAN ISYARAT BARU) */}
      {activeView === 'proposals' && (
        <div className="space-y-6">
          <div className="liquid-glass rounded-3xl p-6 border border-primary-200/60 bg-gradient-to-br from-primary-500/5 to-sky-500/5 space-y-3">
            <div className="flex items-center gap-2 text-primary-700 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-primary-600" />
              Filosofi Co-Creator SIGNARY: Komunitas Tuli Sebagai Pengembang Utama
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Bahasa isyarat terus berkembang seiring hadirnya konsep baru dalam teknologi dan masyarakat. SIGNARY tidak menciptakan isyarat secara sepihak dengan AI, melainkan menyediakan panggung bagi penutur asli Tuli untuk mengusulkan, mendiskusikan, dan memvalidasi kosakata baru secara demokratis.
            </p>
          </div>

          {/* Proposals List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {proposals.map((prop) => (
              <div 
                key={prop.id}
                className="liquid-glass rounded-3xl p-6 border border-white/80 shadow-md space-y-4 hover:shadow-xl transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {prop.dialect} • {prop.category}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1.5">
                      "{prop.word}"
                    </h3>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                    prop.status === 'Masuk Kamus SIGNARY'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : prop.status === 'Terverifikasi Ahli Tuli'
                      ? 'bg-sky-50 text-sky-700 border border-sky-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    <CheckCircle className="w-3.5 h-3.5" />
                    {prop.status}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/70 border border-slate-100 text-xs space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Deskripsi Gestur Tangan:</span>
                  <p className="text-slate-700 font-medium leading-relaxed">
                    {prop.gestureDesc}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 text-xs text-slate-500 font-medium">
                  <span>Diusulkan oleh: <strong className="text-slate-800">{prop.proposer}</strong></span>
                  <button
                    onClick={() => handleVoteProposal(prop.id)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary-50 text-primary-700 font-bold hover:bg-primary-100 active:scale-95 transition-all"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Dukung ({prop.votes})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Write Discussion Post */}
      {isPostModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsPostModalOpen(false);
          }}
        >
          <div className="liquid-glass rounded-[32px] max-w-lg w-full max-h-[85vh] bg-white/95 border border-white/90 shadow-2xl flex flex-col relative overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header (Fixed / Pinned Top) */}
            <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white/95 backdrop-blur-md z-10">
              <h3 className="text-lg font-bold text-slate-900">
                Buat Topik Diskusi Baru
              </h3>
              <button 
                onClick={() => setIsPostModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-2xl hover:bg-slate-100 transition-colors"
                title="Tutup (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="flex flex-col flex-1 overflow-hidden">
              {/* Modal Body (Scrollable) */}
              <div className="p-6 pt-4 space-y-4 overflow-y-auto overscroll-contain flex-1">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Judul Topik</label>
                  <input
                    type="text"
                    placeholder="Contoh: Diskusi isyarat untuk istilah kecerdasan buatan"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/90 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Kategori</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-white/90 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:border-primary-500"
                  >
                    <option value="Belajar">Belajar Isyarat</option>
                    <option value="Kegiatan">Kegiatan & Kopdar</option>
                    <option value="Aksesibilitas">Aksesibilitas & Advokasi</option>
                    <option value="Dialek Daerah">Dialek Daerah</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Isi Diskusi</label>
                  <textarea
                    rows="4"
                    placeholder="Tuliskan pemikiran atau pertanyaan Anda secara ramah dan inklusif..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/90 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              {/* Modal Footer (Fixed / Pinned Bottom) */}
              <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0 bg-white/95 backdrop-blur-md z-10">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl liquid-btn-primary text-white text-xs font-bold shadow-md"
                >
                  Terbitkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Usulkan Kosakata Baru (Co-Creator Hub) */}
      {isProposalModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsProposalModalOpen(false);
          }}
        >
          <div className="liquid-glass rounded-[32px] max-w-lg w-full max-h-[85vh] bg-white/95 border border-white/90 shadow-2xl flex flex-col relative overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header (Fixed / Pinned Top) */}
            <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white/95 backdrop-blur-md z-10">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-primary-600 tracking-wider">Co-Creator Hub</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Usulkan Kosakata Isyarat Baru
                </h3>
              </div>
              <button 
                onClick={() => setIsProposalModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-2xl hover:bg-slate-100 transition-colors"
                title="Tutup (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProposeWord} className="flex flex-col flex-1 overflow-hidden">
              {/* Modal Body (Scrollable) */}
              <div className="p-6 pt-4 space-y-3.5 overflow-y-auto overscroll-contain flex-1">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Kata / Frasa Isyarat</label>
                  <input
                    type="text"
                    placeholder="Contoh: Algoritma, Deep Learning, Cloud"
                    value={propWord}
                    onChange={(e) => setPropWord(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-white/90 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Ragam Bahasa</label>
                    <select
                      value={propDialect}
                      onChange={(e) => setPropDialect(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white/90 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:border-primary-500"
                    >
                      <option value="BISINDO">BISINDO (Alami)</option>
                      <option value="SIBI">SIBI (Resmi)</option>
                      <option value="Dialek Daerah">Dialek Daerah</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Kategori</label>
                    <select
                      value={propCategory}
                      onChange={(e) => setPropCategory(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white/90 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:border-primary-500"
                    >
                      <option value="Teknologi">Teknologi</option>
                      <option value="Pendidikan">Pendidikan</option>
                      <option value="Kesehatan">Kesehatan</option>
                      <option value="Sosial">Sosial & Budaya</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Deskripsi Pola Gerakan Tangan & Mimik Wajah</label>
                  <textarea
                    rows="3"
                    placeholder="Jelaskan orientasi telapak tangan, gerakan jari, posisi di depan tubuh, serta ekspresi wajah yang menyertainya..."
                    value={propGestureDesc}
                    onChange={(e) => setPropGestureDesc(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-white/90 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-[11px] text-amber-800 leading-relaxed font-medium">
                  💡 Usulan Anda akan diverifikasi oleh aktivis & penutur Tuli bersertifikasi sebelum resmi diintegrasikan ke kamus digital SIGNARY.
                </div>
              </div>

              {/* Modal Footer (Fixed / Pinned Bottom) */}
              <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0 bg-white/95 backdrop-blur-md z-10">
                <button
                  type="button"
                  onClick={() => setIsProposalModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl liquid-btn-primary text-white text-xs font-bold shadow-md"
                >
                  Kirimkan Usulan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
