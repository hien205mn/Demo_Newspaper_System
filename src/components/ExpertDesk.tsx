import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  PenTool, 
  FileText, 
  Eye, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  Filter, 
  Send, 
  Sparkles, 
  Building2, 
  Award, 
  BookOpen, 
  Layers, 
  Coins, 
  RotateCcw, 
  ExternalLink, 
  Plus, 
  Flame, 
  Share2, 
  ThumbsUp, 
  MessageSquare, 
  Paperclip, 
  Check, 
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Globe,
  Tag
} from 'lucide-react';
import { 
  Submission, 
  EditorialArticle, 
  EditorialArticleStatus, 
  RoyaltyTier, 
  AuthUser,
  ExpertApplication
} from '../types';
import { INITIAL_EDITORIAL_ARTICLES } from '../data/initialArticles';
import { CitizenPortal } from './CitizenPortal';
import { CitizenSubmissionForm } from './CitizenSubmissionForm';
import { CitizenProfile } from './CitizenProfile';

interface ExpertDeskProps {
  submissions: Submission[];
  onUpdateSubmission: (updated: Submission) => void;
  onSelectSubmission: (submission: Submission) => void;
  onOpenEditProfile?: () => void;
  currentUser: AuthUser | null;
  reputationScore?: number;
  onOpenTrack?: (code?: string) => void;
}

export type ExpertActiveTab = 
  | 'WORKSPACE'       // Bàn Tác Nghiệp Chuyên Gia (Viết, Theo dõi, Chỉnh sửa)
  | 'CITIZEN_PORTAL'  // Cổng thông tin dân sinh (như người dân)
  | 'CITIZEN_SUBMIT'  // Gửi tin phản ánh dân sinh
  | 'EXPERT_PROFILE'; // Hồ sơ chuyên gia & Chứng nhận

export type ExpertWorkspaceSubTab = 
  | 'WRITE'           // Viết bài mới
  | 'TRACK'           // Theo dõi bài viết
  | 'EDIT';           // Chỉnh sửa bài viết

const EXPERT_CATEGORIES = [
  'Quy hoạch & Đô thị',
  'Môi trường & Biến đổi khí hậu',
  'Pháp lý & Quyền dân sinh',
  'Giao thông & Hạ tầng',
  'Kinh tế & Bất động sản',
  'An ninh mạng & Kinh tế số',
  'Y tế công cộng & Đời sống'
];

export const ExpertDesk: React.FC<ExpertDeskProps> = ({
  submissions,
  onUpdateSubmission,
  onSelectSubmission,
  onOpenEditProfile,
  currentUser,
  reputationScore = 98,
  onOpenTrack,
}) => {
  // Top-level Navigation: Chuyên gia có trọn vẹn function Người dân + Viết bài
  const [mainTab, setMainTab] = useState<ExpertActiveTab>('WORKSPACE');
  const [workspaceSubTab, setWorkspaceSubTab] = useState<ExpertWorkspaceSubTab>('TRACK');

  // Load articles from localStorage or fallback
  const [articles, setArticles] = useState<EditorialArticle[]>(() => {
    try {
      const saved = localStorage.getItem('news_portal_editorial_articles');
      if (saved) {
        const parsed: EditorialArticle[] = JSON.parse(saved);
        // Normalize any expert article that had TRANSFERRED_TO_DEPUTY to APPROVED
        const normalized = parsed.map((a) => {
          if (a.sourceType === 'EXPERT' && a.status === 'TRANSFERRED_TO_DEPUTY') {
            return { ...a, status: 'APPROVED' as EditorialArticleStatus };
          }
          return a;
        });
        return normalized;
      }
    } catch (e) {
      console.warn(e);
    }
    return INITIAL_EDITORIAL_ARTICLES;
  });

  // Save articles to localStorage
  const saveArticles = (next: EditorialArticle[]) => {
    setArticles(next);
    try {
      localStorage.setItem('news_portal_editorial_articles', JSON.stringify(next));
    } catch (e) {
      console.warn(e);
    }
  };

  // Identify current expert's articles
  // For demo, include articles by Expert or current author name
  const expertArticles = articles.filter(
    (a) => a.sourceType === 'EXPERT'
  );

  // Filters for Track tab
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected article for tracking detail / editing
  const [selectedArticleId, setSelectedArticleId] = useState<string>(
    expertArticles[0]?.id || ''
  );

  // Form State for Writing / Editing
  const [articleForm, setArticleForm] = useState({
    id: '',
    code: '',
    title: '',
    sapo: '',
    content: '',
    category: EXPERT_CATEGORIES[0],
    tagsInput: '',
    relatedSubmissionCode: '',
    authorName: currentUser?.name || 'PGS. TS Trần Đình Khiêm',
    authorTitle: currentUser?.title || 'Viện trưởng Viện Nghiên cứu Đô thị & Thủy văn',
    authorOrganization: currentUser?.department || 'Viện Hàn lâm Khoa học & Công nghệ',
    authorPhone: currentUser?.phone || '0903.456.789',
    authorEmail: currentUser?.email || 'khiem.tran@vast.ac.vn',
    editorNote: '',
    revisionRequestNote: '',
    status: 'PENDING_REVIEW' as EditorialArticleStatus,
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    imageCaption: 'Mô hình nghiên cứu thực nghiệm hạ tầng đô thị',
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // When selected article changes, populate edit form if in EDIT mode
  const activeArticle = expertArticles.find((a) => a.id === selectedArticleId) || expertArticles[0];

  const handleStartEditArticle = (art: EditorialArticle) => {
    setSelectedArticleId(art.id);
    setArticleForm({
      id: art.id,
      code: art.code,
      title: art.title,
      sapo: art.sapo,
      content: art.content,
      category: art.category || EXPERT_CATEGORIES[0],
      tagsInput: (art.tags || []).join(', '),
      relatedSubmissionCode: art.relatedSubmissionCode || '',
      authorName: art.authorName,
      authorTitle: art.authorTitle,
      authorOrganization: art.authorOrganization || '',
      authorPhone: art.authorPhone,
      authorEmail: art.authorEmail,
      editorNote: art.editorNote || '',
      revisionRequestNote: art.revisionRequestNote || '',
      status: art.status,
      imageUrl: art.attachments?.[0]?.url || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
      imageCaption: art.attachments?.[0]?.caption || 'Hình ảnh minh họa số liệu phân tích',
    });
    setWorkspaceSubTab('EDIT');
  };

  const handleResetNewArticleForm = () => {
    setArticleForm({
      id: '',
      code: `EXP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      title: '',
      sapo: '',
      content: '',
      category: EXPERT_CATEGORIES[0],
      tagsInput: 'Phân tích chính sách, Đô thị bền vững, Góc nhìn chuyên gia',
      relatedSubmissionCode: '',
      authorName: currentUser?.name || 'PGS. TS Trần Đình Khiêm',
      authorTitle: currentUser?.title || 'Viện trưởng Viện Nghiên cứu Đô thị & Thủy văn',
      authorOrganization: currentUser?.department || 'Viện Hàn lâm Khoa học & Công nghệ',
      authorPhone: currentUser?.phone || '0903.456.789',
      authorEmail: currentUser?.email || 'khiem.tran@vast.ac.vn',
      editorNote: '',
      revisionRequestNote: '',
      status: 'PENDING_REVIEW',
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
      imageCaption: 'Biểu đồ phân tích thủy văn và không gian quy hoạch',
    });
    setWorkspaceSubTab('WRITE');
  };

  // Submit newly written article or save draft
  const handleSaveArticle = (isDraft: boolean) => {
    if (!articleForm.title.trim() || !articleForm.content.trim()) {
      triggerToast('Vui lòng nhập đầy đủ tiêu đề và nội dung bài viết!');
      return;
    }

    const tags = articleForm.tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const isEditing = Boolean(articleForm.id);

    if (isEditing) {
      // Update existing article
      const updatedArticle: EditorialArticle = {
        ...activeArticle,
        title: articleForm.title,
        sapo: articleForm.sapo,
        content: articleForm.content,
        category: articleForm.category,
        tags: tags.length > 0 ? tags : activeArticle.tags,
        relatedSubmissionCode: articleForm.relatedSubmissionCode || undefined,
        status: isDraft ? 'PENDING_REVIEW' : 'PENDING_REVIEW',
        updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        attachments: [
          {
            id: `att-exp-${Date.now()}`,
            name: 'minh_hoa_chuyen_gia.jpg',
            url: articleForm.imageUrl,
            caption: articleForm.imageCaption,
            type: 'image',
          },
        ],
      };

      const next = articles.map((a) => (a.id === updatedArticle.id ? updatedArticle : a));
      saveArticles(next);
      triggerToast(
        isDraft 
          ? 'Đã lưu bản cập nhật bài viết!' 
          : 'Đã hoàn tất chỉnh sửa & gửi lại bài cho Ban Biên Tập thẩm định!'
      );
      setWorkspaceSubTab('TRACK');
      setSelectedArticleId(updatedArticle.id);
    } else {
      // Create brand new article
      const newArticleId = `art-exp-${Date.now()}`;
      const newCode = articleForm.code || `EXP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

      const newArticle: EditorialArticle = {
        id: newArticleId,
        code: newCode,
        sourceType: 'EXPERT',
        title: articleForm.title,
        sapo: articleForm.sapo,
        content: articleForm.content,
        category: articleForm.category,
        tags: tags.length > 0 ? tags : ['Ý kiến chuyên gia', 'Phân tích'],
        authorName: articleForm.authorName,
        authorPenName: articleForm.authorName,
        authorTitle: articleForm.authorTitle,
        authorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        authorOrganization: articleForm.authorOrganization,
        authorPhone: articleForm.authorPhone,
        authorEmail: articleForm.authorEmail,
        submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        status: isDraft ? 'PENDING_REVIEW' : 'PENDING_REVIEW',
        royaltyTier: 'SPECIAL',
        royaltyAmount: 2500000,
        relatedSubmissionCode: articleForm.relatedSubmissionCode || undefined,
        factCheckScore: 98,
        factCheckNotes: 'Hồ sơ chuyên gia đã qua thẩm định; các viện dẫn chính sách và công thức chuẩn xác.',
        attachments: [
          {
            id: `att-exp-${Date.now()}`,
            name: 'minh_hoa_chuyen_gia.jpg',
            url: articleForm.imageUrl,
            caption: articleForm.imageCaption,
            type: 'image',
          },
        ],
      };

      saveArticles([newArticle, ...articles]);
      triggerToast('Đã nộp bài viết chuyên gia thành công tới Ban Biên Tập!');
      setSelectedArticleId(newArticle.id);
      setWorkspaceSubTab('TRACK');
    }
  };

  // Filtered expert articles
  const filteredExpertArticles = expertArticles.filter((a) => {
    if (categoryFilter !== 'ALL' && a.category !== categoryFilter) return false;
    if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        a.code.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        (a.sapo && a.sapo.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getStatusBadge = (status: EditorialArticleStatus) => {
    switch (status) {
      case 'PENDING_REVIEW':
        return {
          label: 'Chờ BTV Tiếp Nhận',
          style: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
          icon: <Clock className="w-3.5 h-3.5" />,
        };
      case 'EDITING':
        return {
          label: 'Đang Biên Tập & Hiệu Đính',
          style: 'bg-slate-500/10 text-slate-500 border-slate-500/30',
          icon: <Edit3 className="w-3.5 h-3.5" />,
        };
      case 'REVISION_REQUESTED':
        return {
          label: 'BTV Yêu Cầu Chỉnh Sửa',
          style: 'bg-rose-500/10 text-rose-500 border-rose-500/30 animate-pulse',
          icon: <AlertCircle className="w-3.5 h-3.5" />,
        };
      case 'APPROVED':
        return {
          label: 'Đã Duyệt Xuất Bản',
          style: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        };
      case 'PUBLISHED':
        return {
          label: 'Đã Lên Trang Báo',
          style: 'bg-emerald-600 text-white border-emerald-700',
          icon: <Globe className="w-3.5 h-3.5" />,
        };
      case 'REJECTED':
        return {
          label: 'Từ Chối Đăng',
          style: 'bg-slate-500/10 text-slate-500 border-slate-500/30',
          icon: <AlertCircle className="w-3.5 h-3.5" />,
        };
      default:
        return {
          label: status,
          style: 'bg-slate-500/10 text-slate-500 border-slate-500/30',
          icon: <FileText className="w-3.5 h-3.5" />,
        };
    }
  };

  // Stats calculation
  const totalCount = expertArticles.length;
  const pendingCount = expertArticles.filter((a) => a.status === 'PENDING_REVIEW' || a.status === 'EDITING').length;
  const revisionCount = expertArticles.filter((a) => a.status === 'REVISION_REQUESTED').length;
  const approvedCount = expertArticles.filter((a) => a.status === 'APPROVED' || a.status === 'PUBLISHED').length;
  const totalRoyalty = expertArticles.reduce((sum, a) => sum + (a.royaltyAmount || 0), 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-5 z-50 p-4 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-2xl border border-slate-500 flex items-center gap-3 animate-fade-in">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-2 underline cursor-pointer"
          >
            Đóng
          </button>
        </div>
      )}

      {/* TOP HEADER: ROLE HERO & DUAL FUNCTION MODE BAR */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white rounded-lg p-6 sm:p-8 shadow-xl border border-slate-900/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-slate-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center text-white shadow-lg shadow-slate-950/60 shrink-0 border border-slate-300/30">
              <GraduationCap className="w-9 h-9" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-500/30 text-slate-300 border border-slate-400/40">
                  VAI TRÒ CHUYÊN GIA BÁO CHÍ
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-400" />
                  Đã Kiểm Định Học Vị
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
                KHÔNG GIAN TÁC NGHIỆP CHUYÊN GIA
              </h1>
              <p className="text-xs text-slate-200/80 mt-1 max-w-2xl leading-relaxed">
                Bao trọn toàn bộ tính năng của <strong>Người dân</strong> (gửi tin nóng, tra cứu hồ sơ, theo dõi dân sinh) kết hợp công cụ chuyên sâu: <strong>Viết bài phản biện</strong>, <strong>Theo dõi tiến độ duyệt bài</strong> và <strong>Chỉnh sửa bài viết</strong> cùng Ban Biên Tập.
              </p>
            </div>
          </div>

          {/* Quick Actions in Hero */}
          <div className="flex flex-wrap items-center gap-2.5 self-stretch md:self-auto">
            <button
              onClick={handleResetNewArticleForm}
              className="flex-1 md:flex-initial px-4 py-3 bg-gradient-to-r from-slate-600 to-slate-600 hover:from-slate-500 hover:to-slate-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-slate-950/50 flex items-center justify-center gap-2 transition transform active:scale-95 cursor-pointer"
            >
              <PenTool className="w-4 h-4 text-slate-200" />
              <span>✍️ Viết Bài Mới</span>
            </button>

            {onOpenEditProfile && (
              <button
                onClick={onOpenEditProfile}
                className="px-3.5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                <span>Hồ sơ</span>
              </button>
            )}
          </div>
        </div>

        {/* PRIMARY ROLE TABS: Bao trọn mọi chức năng của Người dân + Bàn Chuyên gia */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setMainTab('WORKSPACE')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              mainTab === 'WORKSPACE'
                ? 'bg-slate-600 text-white shadow-md shadow-slate-950/50'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
            }`}
          >
            <BookOpen className="w-4 h-4 text-slate-300" />
            <span>1. Tác Nghiệp Chuyên Gia (Viết • Theo Dõi • Chỉnh Sửa)</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-900 text-slate-200 font-mono">
              {expertArticles.length} bài
            </span>
          </button>

          <button
            onClick={() => setMainTab('CITIZEN_PORTAL')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              mainTab === 'CITIZEN_PORTAL'
                ? 'bg-red-600 text-white shadow-md shadow-red-950/50'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
            }`}
          >
            <Globe className="w-4 h-4 text-amber-400" />
            <span>2. Cổng Thông Tin Dân Sinh (Chức Năng Người Dân)</span>
          </button>

          <button
            onClick={() => setMainTab('CITIZEN_SUBMIT')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              mainTab === 'CITIZEN_SUBMIT'
                ? 'bg-red-600 text-white shadow-md shadow-red-950/50'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
            }`}
          >
            <Flame className="w-4 h-4 text-red-400" />
            <span>3. Gửi Tin Phản Ánh Dân Sinh</span>
          </button>

          <button
            onClick={() => setMainTab('EXPERT_PROFILE')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              mainTab === 'EXPERT_PROFILE'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-950/50'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>4. Hồ Sơ & Chứng Nhận Chuyên Gia</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: EXPERT WORKSPACE (VIẾT BÀI • THEO DÕI BÀI • CHỈNH SỬA BÀI) */}
      {mainTab === 'WORKSPACE' && (
        <div className="space-y-6 animate-fade-in">
          {/* Sub Navigation Bar for the 3 Core Capabilities */}
          <div className="bg-white rounded-lg p-2.5 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setWorkspaceSubTab('TRACK')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                  workspaceSubTab === 'TRACK'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Layers className="w-4 h-4 text-slate-400" />
                <span>Theo Dõi Bài Viết ({expertArticles.length})</span>
                {revisionCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white animate-pulse">
                    {revisionCount} cần sửa
                  </span>
                )}
              </button>

              <button
                onClick={handleResetNewArticleForm}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                  workspaceSubTab === 'WRITE'
                    ? 'bg-slate-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Plus className="w-4 h-4 text-white" />
                <span>Viết Bài Mới</span>
              </button>

              <button
                onClick={() => {
                  if (activeArticle) handleStartEditArticle(activeArticle);
                  else setWorkspaceSubTab('EDIT');
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                  workspaceSubTab === 'EDIT'
                    ? 'bg-slate-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Edit3 className="w-4 h-4 text-slate-400" />
                <span>Chỉnh Sửa Bài Viết</span>
                {articleForm.id && (
                  <span className="text-[10px] text-slate-200 font-mono">
                    ({articleForm.code || 'Bản thảo'})
                  </span>
                )}
              </button>
            </div>

            {/* Quick KPI pills */}
            <div className="hidden lg:flex items-center gap-3 text-xs pr-2">
              <span className="text-slate-500">
                Đã duyệt/xuất bản: <strong className="text-emerald-600 font-bold">{approvedCount} bài</strong>
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500">
                Nhuận bút tích lũy: <strong className="text-amber-600 font-mono font-bold">{totalRoyalty.toLocaleString('vi-VN')} đ</strong>
              </span>
            </div>
          </div>

          {/* SUB-TAB 1: THEO DÕI BÀI VIẾT (TRACKING & STATS) */}
          {workspaceSubTab === 'TRACK' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Tổng bài đóng góp
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                    {totalCount}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Phân tích, bình luận & ý kiến
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-amber-200 bg-amber-50/40 shadow-sm space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                    Chờ BTV thẩm định
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-800 font-mono">
                    {pendingCount}
                  </div>
                  <div className="text-[11px] text-amber-600">
                    Đang trong quy trình rà soát
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-rose-200 bg-rose-50/40 shadow-sm space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
                    BTV yêu cầu chỉnh sửa
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-rose-800 font-mono">
                    {revisionCount}
                  </div>
                  <div className="text-[11px] text-rose-600">
                    Cần phản hồi & hiệu đính
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-emerald-200 bg-emerald-50/40 shadow-sm space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                    Đã xuất bản lên báo
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-800 font-mono">
                    {approvedCount}
                  </div>
                  <div className="text-[11px] text-emerald-600">
                    Đạt chuẩn đăng tải chính thức
                  </div>
                </div>
              </div>

              {/* Filters Bar: Lọc nhiệm vụ thành từng loại & lọc theo trạng thái */}
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  {/* Search box */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm bài viết theo tiêu đề, mã bài, chuyên mục, từ khóa..."
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:bg-white"
                    />
                  </div>

                  {/* Reset Filters button */}
                  {(categoryFilter !== 'ALL' || statusFilter !== 'ALL' || searchQuery) && (
                    <button
                      onClick={() => {
                        setCategoryFilter('ALL');
                        setStatusFilter('ALL');
                        setSearchQuery('');
                      }}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg flex items-center gap-1 transition cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Xóa bộ lọc</span>
                    </button>
                  )}
                </div>

                {/* Filter Row 1: Lọc theo chuyên mục / loại bài viết */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <div className="text-xs font-bold text-slate-500 whitespace-nowrap flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5 text-slate-500" />
                    <span>Chuyên mục:</span>
                  </div>
                  <button
                    onClick={() => setCategoryFilter('ALL')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                      categoryFilter === 'ALL'
                        ? 'bg-slate-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Tất cả chuyên mục ({expertArticles.length})
                  </button>
                  {EXPERT_CATEGORIES.map((cat) => {
                    const count = expertArticles.filter((a) => a.category === cat).length;
                    return (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                          categoryFilter === cat
                            ? 'bg-slate-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {cat} ({count})
                      </button>
                    );
                  })}
                </div>

                {/* Filter Row 2: Lọc theo trạng thái xử lý tòa soạn */}
                <div className="flex items-center gap-2 overflow-x-auto pt-1 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-500 whitespace-nowrap flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>Trạng thái:</span>
                  </div>
                  {[
                    { id: 'ALL', label: 'Tất cả' },
                    { id: 'PENDING_REVIEW', label: 'Chờ duyệt' },
                    { id: 'EDITING', label: 'Đang biên tập' },
                    { id: 'REVISION_REQUESTED', label: 'Yêu cầu sửa' },
                    { id: 'APPROVED', label: 'Đã duyệt' },
                    { id: 'PUBLISHED', label: 'Đã xuất bản' },
                  ].map((s) => {
                    const count = s.id === 'ALL' 
                      ? expertArticles.length 
                      : expertArticles.filter((a) => a.status === s.id).length;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setStatusFilter(s.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                          statusFilter === s.id
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {s.label} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Master-Detail Layout for Tracking */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Article List (5 cols) */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                    <span>Danh sách bài viết ({filteredExpertArticles.length})</span>
                    <span>Bấm vào bài để xem tiến độ chi tiết</span>
                  </div>

                  {filteredExpertArticles.length === 0 ? (
                    <div className="bg-white p-8 rounded-lg border border-slate-200 text-center space-y-3">
                      <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                      <p className="text-sm font-bold text-slate-700">
                        Không tìm thấy bài viết phù hợp
                      </p>
                      <p className="text-xs text-slate-400">
                        Hãy thử điều chỉnh bộ lọc hoặc bấm "Viết Bài Mới" để khởi tạo bài viết đầu tiên.
                      </p>
                      <button
                        onClick={handleResetNewArticleForm}
                        className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                      >
                        + Khởi tạo bài viết mới
                      </button>
                    </div>
                  ) : (
                    filteredExpertArticles.map((art) => {
                      const isSelected = activeArticle?.id === art.id;
                      const badge = getStatusBadge(art.status);
                      const isRevision = art.status === 'REVISION_REQUESTED';

                      return (
                        <div
                          key={art.id}
                          onClick={() => setSelectedArticleId(art.id)}
                          className={`p-4 rounded-lg border transition cursor-pointer space-y-2.5 ${
                            isSelected
                              ? 'bg-slate-50/70 border-slate-500 shadow-md ring-1 ring-slate-500/30'
                              : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              {art.code}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.style}`}
                            >
                              {badge.icon}
                              <span>{badge.label}</span>
                            </span>
                          </div>

                          <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                            {art.title}
                          </h3>

                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {art.sapo}
                          </p>

                          {/* Revision alert note if flagged */}
                          {isRevision && art.revisionRequestNote && (
                            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] flex items-start gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                              <span className="line-clamp-2">
                                <strong>BTV ghi chú:</strong> {art.revisionRequestNote}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                            <span className="text-slate-600 font-semibold">{art.category}</span>
                            <span>{art.submittedAt}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Right: Active Article Tracking Detail (7 cols) */}
                <div className="lg:col-span-7">
                  {activeArticle ? (
                    <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-7 shadow-sm space-y-6 sticky top-24">
                      {/* Top Action Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-100 text-slate-800">
                            {activeArticle.code}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${
                              getStatusBadge(activeArticle.status).style
                            }`}
                          >
                            {getStatusBadge(activeArticle.status).icon}
                            <span>{getStatusBadge(activeArticle.status).label}</span>
                          </span>
                        </div>

                        {/* CTA: Chỉnh sửa bài viết */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleStartEditArticle(activeArticle)}
                            className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Chỉnh Sửa Bài Viết Này</span>
                          </button>
                        </div>
                      </div>

                      {/* Editorial Directive / Revision Box */}
                      {activeArticle.status === 'REVISION_REQUESTED' && (
                        <div className="p-4 rounded-lg bg-rose-50 border border-rose-300 text-rose-900 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs uppercase tracking-wide flex items-center gap-1.5 text-rose-800">
                              <AlertCircle className="w-4 h-4 text-rose-600" />
                              YÊU CẦU CHỈNH SỬA TỪ BAN BIÊN TẬP
                            </span>
                            <button
                              onClick={() => handleStartEditArticle(activeArticle)}
                              className="px-2.5 py-1 bg-rose-600 text-white rounded-lg text-[11px] font-bold hover:bg-rose-700 transition cursor-pointer"
                            >
                              Sửa ngay →
                            </button>
                          </div>
                          <p className="text-xs leading-relaxed">
                            {activeArticle.revisionRequestNote || 'Ban Biên Tập yêu cầu cập nhật thêm số liệu dẫn chứng và rút gọn sapo trước khi chuyển cấp phê duyệt.'}
                          </p>
                        </div>
                      )}

                      {/* Article Headline & Sapo */}
                      <div className="space-y-3">
                        <div className="inline-block text-xs font-bold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md">
                          {activeArticle.category}
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                          {activeArticle.title}
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-600 italic bg-slate-50 p-3.5 rounded-xl border-l-4 border-slate-500 leading-relaxed">
                          "{activeArticle.sapo}"
                        </p>
                      </div>

                      {/* Metadata Details & Workflow Tracking */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">
                            Chuyên gia tác giả
                          </span>
                          <span className="font-bold text-slate-800">{activeArticle.authorName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">
                            Nhuận bút dự kiến
                          </span>
                          <span className="font-mono font-bold text-emerald-600">
                            {(activeArticle.royaltyAmount || 2000000).toLocaleString('vi-VN')} đ
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">
                            Điểm Fact-Check AI
                          </span>
                          <span className="font-mono font-bold text-slate-600">
                            {activeArticle.factCheckScore || 98}/100đ
                          </span>
                        </div>
                      </div>

                      {/* Content Preview */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Nội dung toàn văn bài viết:
                        </h4>
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-line max-h-72 overflow-y-auto">
                          {activeArticle.content}
                        </div>
                      </div>

                      {/* Attachments */}
                      {activeArticle.attachments && activeArticle.attachments.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Tài liệu / Ảnh đính kèm:
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {activeArticle.attachments.map((att) => (
                              <div
                                key={att.id}
                                className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50"
                              >
                                <img
                                  src={att.url}
                                  alt={att.caption}
                                  className="w-full h-32 object-cover"
                                />
                                <div className="p-2 text-[11px] text-slate-600 font-medium">
                                  {att.caption}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg border border-slate-200 p-8 text-center text-slate-500">
                      Chọn một bài viết để xem chi tiết
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SUB-TAB 2 & 3: FORM VIẾT BÀI / CHỈNH SỬA BÀI VIẾT */}
          {(workspaceSubTab === 'WRITE' || workspaceSubTab === 'EDIT') && (
            <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              {/* Form Title & Context Banner */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-50 text-slate-700 border border-slate-200">
                    {workspaceSubTab === 'WRITE' ? '✍️ KHỞI TẠO BÀI VIẾT MỚI' : '🛠️ HIỆU ĐÍNH & CHỈNH SỬA BÀI VIẾT'}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                    {workspaceSubTab === 'WRITE'
                      ? 'Soạn Thảo Bài Phân Tích & Bình Luận Chuyên Gia'
                      : `Chỉnh Sửa Bài Viết: ${articleForm.code || 'Bản Thảo'}`}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setWorkspaceSubTab('TRACK')}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  >
                    ← Quay lại danh sách
                  </button>
                  <button
                    onClick={() => handleSaveArticle(true)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Lưu bản nháp
                  </button>
                  <button
                    onClick={() => handleSaveArticle(false)}
                    className="px-5 py-2.5 bg-gradient-to-r from-slate-600 to-slate-600 hover:from-slate-500 hover:to-slate-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-slate-950/30 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>
                      {workspaceSubTab === 'WRITE' ? 'Nộp Bài Lên Ban Biên Tập' : 'Cập Nhật & Nộp Lại Cho BTV'}
                    </span>
                  </button>
                </div>
              </div>

              {/* If editing and has editor note, show prominently */}
              {workspaceSubTab === 'EDIT' && (articleForm.revisionRequestNote || articleForm.editorNote) && (
                <div className="p-4 rounded-lg bg-amber-50 border border-amber-300 text-amber-950 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wide text-amber-800">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Ý KIẾN / HƯỚNG DẪN CỦA BAN BIÊN TẬP CẦN ĐIỀU CHỈNH:</span>
                  </div>
                  <p className="text-xs leading-relaxed pl-6">
                    {articleForm.revisionRequestNote || articleForm.editorNote}
                  </p>
                </div>
              )}

              {/* Form Body */}
              <div className="space-y-5">
                {/* Category & Related Case */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                      Chuyên mục bài viết *
                    </label>
                    <select
                      value={articleForm.category}
                      onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-500 text-xs font-semibold text-slate-900 bg-white"
                    >
                      {EXPERT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                      Liên kết vụ việc dân sinh (Tùy chọn)
                    </label>
                    <select
                      value={articleForm.relatedSubmissionCode}
                      onChange={(e) => setArticleForm({ ...articleForm, relatedSubmissionCode: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-500 text-xs font-mono text-slate-900 bg-white"
                    >
                      <option value="">-- Không liên kết --</option>
                      {submissions.map((sub) => (
                        <option key={sub.id} value={sub.trackingCode}>
                          {sub.trackingCode} - {sub.title.slice(0, 38)}...
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                      Từ khóa (Tags, phân cách bằng dấu phẩy)
                    </label>
                    <input
                      type="text"
                      value={articleForm.tagsInput}
                      onChange={(e) => setArticleForm({ ...articleForm, tagsInput: e.target.value })}
                      placeholder="Quy hoạch, Sạt lở, Thủy văn..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-500 text-xs text-slate-900 bg-white"
                    />
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Tiêu đề bài viết (Headline) *
                  </label>
                  <input
                    type="text"
                    required
                    value={articleForm.title}
                    onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                    placeholder="Ví dụ: Đánh giá nguy cơ sạt lở chuỗi đèo Tây Nguyên và khuyến nghị công nghệ cảnh báo sớm..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-500 text-sm font-bold text-slate-900 bg-white"
                  />
                </div>

                {/* Sapo */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Đoạn tóm tắt mở đầu (Sapo) *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={articleForm.sapo}
                    onChange={(e) => setArticleForm({ ...articleForm, sapo: e.target.value })}
                    placeholder="Tóm tắt luận điểm cốt lõi, vấn đề trọng tâm và giải pháp đề xuất của chuyên gia (khoảng 2-3 câu)..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-500 text-xs sm:text-sm text-slate-800 bg-white"
                  />
                </div>

                {/* Main Content */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center justify-between">
                    <span>Nội dung bài viết chuyên sâu *</span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      Hỗ trợ xuống dòng, trích dẫn số liệu, phân tích đa chiều
                    </span>
                  </label>
                  <textarea
                    rows={12}
                    required
                    value={articleForm.content}
                    onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                    placeholder="Trình bày chi tiết phân tích chuyên môn, bối cảnh thực địa, nguyên nhân căn cơ, so sánh mô hình quốc tế và kiến nghị chính sách cụ thể..."
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-500 text-xs sm:text-sm text-slate-900 font-mono leading-relaxed bg-white"
                  />
                </div>

                {/* Image & Evidence attachment */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                      <Paperclip className="w-3.5 h-3.5 text-slate-600" />
                      URL hình ảnh minh họa / sơ đồ phân tích
                    </label>
                    <input
                      type="url"
                      value={articleForm.imageUrl}
                      onChange={(e) => setArticleForm({ ...articleForm, imageUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 font-mono bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Chú thích hình ảnh (Caption)
                    </label>
                    <input
                      type="text"
                      value={articleForm.imageCaption}
                      onChange={(e) => setArticleForm({ ...articleForm, imageCaption: e.target.value })}
                      placeholder="Mô tả số liệu trong hình..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white"
                    />
                  </div>
                </div>

                {/* Author Metadata Footer */}
                <div className="p-4 bg-slate-50/60 rounded-lg border border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-600 text-white font-bold flex items-center justify-center shrink-0">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{articleForm.authorName}</div>
                      <div className="text-slate-500 text-[11px]">{articleForm.authorTitle} • {articleForm.authorOrganization}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleSaveArticle(true)}
                      className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition cursor-pointer"
                    >
                      Lưu bản nháp
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveArticle(false)}
                      className="px-6 py-2.5 bg-gradient-to-r from-slate-600 to-slate-600 hover:from-slate-500 hover:to-slate-500 text-white rounded-xl font-bold shadow-md shadow-slate-950/30 flex items-center gap-2 transition cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>{workspaceSubTab === 'WRITE' ? 'Nộp bài lên BTV' : 'Cập nhật & Nộp lại'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: CỔNG THÔNG TIN DÂN SINH (TOÀN VẸN CHỨC NĂNG NGƯỜI DÂN) */}
      {mainTab === 'CITIZEN_PORTAL' && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-3 bg-red-50 border border-red-200 text-red-900 rounded-lg flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-red-600" />
              Bạn đang trải nghiệm giao diện Cổng Dân Sinh dưới tư cách Chuyên gia được công nhận
            </span>
            <button
              onClick={() => setMainTab('WORKSPACE')}
              className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition cursor-pointer"
            >
              ← Về Bàn Tác Nghiệp Chuyên Gia
            </button>
          </div>

          <CitizenPortal
            onOpenSubmit={() => setMainTab('CITIZEN_SUBMIT')}
            onOpenTrack={(code) => {
              if (onOpenTrack) onOpenTrack(code);
            }}
            onOpenProfile={() => setMainTab('EXPERT_PROFILE')}
            onOpenEditProfile={onOpenEditProfile}
            reputationScore={reputationScore}
            submissions={submissions}
            onSelectSubmission={onSelectSubmission}
          />
        </div>
      )}

      {/* VIEW 3: GỬI TIN PHẢN ÁNH DÂN SINH (FORM CHẤM ĐIỂM IMPACT SCORE) */}
      {mainTab === 'CITIZEN_SUBMIT' && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-3 bg-red-50 border border-red-200 text-red-900 rounded-lg flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-red-600" />
              Gửi tin phản ánh hiện trường trực tiếp từ tư cách Chuyên Gia cộng đồng
            </span>
            <button
              onClick={() => setMainTab('WORKSPACE')}
              className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition cursor-pointer"
            >
              ← Về Bàn Tác Nghiệp Chuyên Gia
            </button>
          </div>

          <CitizenSubmissionForm
            onBack={() => setMainTab('WORKSPACE')}
            onSubmitSuccess={(newSub) => {
              onUpdateSubmission(newSub);
              triggerToast('Đã gửi tin nóng dân sinh thành công!');
              setMainTab('CITIZEN_PORTAL');
            }}
          />
        </div>
      )}

      {/* VIEW 4: HỒ SƠ & CHỨNG NHẬN CHUYÊN GIA */}
      {mainTab === 'EXPERT_PROFILE' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-lg flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-2">
              <Award className="w-4 h-4 text-slate-600" />
              Hồ sơ học thuật & Chứng chỉ chuyên gia được cấp bởi Tòa Soạn Báo Dân Sinh
            </span>
            <button
              onClick={() => setMainTab('WORKSPACE')}
              className="px-3 py-1 bg-slate-600 text-white rounded-lg text-xs font-bold hover:bg-slate-700 transition cursor-pointer"
            >
              ← Về Bàn Tác Nghiệp Chuyên Gia
            </button>
          </div>

          <CitizenProfile
            onBack={() => setMainTab('WORKSPACE')}
            onOpenApplyCTV={() => {
              triggerToast('Bạn đã sở hữu vai trò Chuyên Gia cao cấp!');
            }}
            onOpenSubmitNews={() => setMainTab('CITIZEN_SUBMIT')}
            onSelectSubmission={onSelectSubmission}
            submissions={submissions}
            ctvApplication={null}
            reputationScore={reputationScore}
          />
        </div>
      )}
    </div>
  );
};
