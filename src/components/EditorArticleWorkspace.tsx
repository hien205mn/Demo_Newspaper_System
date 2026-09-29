import React, { useState, useEffect } from 'react';
import { 
  EditorialArticle, 
  ArticleSourceType, 
  EditorialArticleStatus, 
  RoyaltyTier 
} from '../types';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Edit3, 
  Send, 
  RotateCcw, 
  XCircle, 
  Award, 
  Coins, 
  User, 
  Building2, 
  Phone, 
  Mail, 
  Tag, 
  Calendar, 
  Check, 
  Save, 
  Eye, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Camera,
  GraduationCap,
  Newspaper
} from 'lucide-react';

interface EditorArticleWorkspaceProps {
  sourceType: ArticleSourceType;
  articles: EditorialArticle[];
  onUpdateArticle: (updated: EditorialArticle) => void;
}

export const EditorArticleWorkspace: React.FC<EditorArticleWorkspaceProps> = ({
  sourceType,
  articles,
  onUpdateArticle,
}) => {
  // Filter by source type
  const sourceArticles = articles.filter((a) => a.sourceType === sourceType);

  const [selectedArticleId, setSelectedArticleId] = useState<string>(
    sourceArticles[0]?.id || ''
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Editing state for active article
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedSapo, setEditedSapo] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [editorFeedbackNote, setEditorFeedbackNote] = useState('');
  const [selectedRoyaltyTier, setSelectedRoyaltyTier] = useState<RoyaltyTier>('TIER_A');
  const [selectedRoyaltyAmount, setSelectedRoyaltyAmount] = useState<number>(1500000);

  // Revision request modal state
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [revisionNotesInput, setRevisionNotesInput] = useState('');

  // Active article selection
  const activeArticle = sourceArticles.find((a) => a.id === selectedArticleId) || sourceArticles[0];

  useEffect(() => {
    if (activeArticle) {
      setEditedTitle(activeArticle.title);
      setEditedSapo(activeArticle.sapo);
      setEditedContent(activeArticle.content);
      setEditorFeedbackNote(activeArticle.editorNote || '');
      setSelectedRoyaltyTier(activeArticle.royaltyTier || 'TIER_A');
      setSelectedRoyaltyAmount(activeArticle.royaltyAmount || 1500000);
      setIsEditingMode(false);
    }
  }, [selectedArticleId, activeArticle]);

  // Filtered list
  const filteredArticles = sourceArticles.filter((art) => {
    const matchesSearch = 
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || art.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || art.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Unique categories
  const categories = Array.from(new Set(sourceArticles.map((a) => a.category)));

  // Source-specific theme & titles
  const getSourceConfig = () => {
    switch (sourceType) {
      case 'CTV':
        return {
          title: 'Hồ Sơ Bài Viết Từ Cộng Tác Viên (CTV Hiện Trường)',
          badge: 'CỘNG TÁC VIÊN HIỆN TRƯỜNG',
          badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          desc: 'Tiếp nhận bài viết thực địa, tin phóng sự nóng từ mạng lưới CTV 63 tỉnh thành gửi về tòa soạn.',
          icon: <Camera className="w-5 h-5 text-emerald-600" />,
          accentBg: 'bg-emerald-600',
        };
      case 'EXPERT':
        return {
          title: 'Chuyên Mục Bài Viết Từ Chuyên Gia & Học Giả',
          badge: 'CHUYÊN GIA & HỌC GIẢ',
          badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
          desc: 'Các bài xã luận, phân tích chính sách, góc nhìn khoa học và phản biện độc lập từ các viện nghiên cứu, trường đại học, luật sư.',
          icon: <GraduationCap className="w-5 h-5 text-slate-600" />,
          accentBg: 'bg-slate-600',
        };
      case 'JOURNALIST':
        return {
          title: 'Tuyến Bài Điều Tra Từ Nhà Báo & Phóng Viên Chính Quy',
          badge: 'NHÀ BÁO & PHÓNG VIÊN CHÍNH QUY',
          badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
          desc: 'Các phóng sự điều tra độc quyền, chuyên đề nhiều kỳ do đội ngũ nhà báo, phóng viên chuyên trách của tòa soạn thực hiện.',
          icon: <Newspaper className="w-5 h-5 text-rose-600" />,
          accentBg: 'bg-rose-600',
        };
    }
  };

  const config = getSourceConfig();

  // Status helper
  const getStatusBadge = (status: EditorialArticleStatus) => {
    switch (status) {
      case 'PENDING_REVIEW':
        return { label: 'Chờ thẩm định', color: 'bg-amber-100 text-amber-800 border-amber-300' };
      case 'EDITING':
        return { label: 'Đang biên tập', color: 'bg-slate-100 text-slate-800 border-slate-300' };
      case 'REVISION_REQUESTED':
        return { label: 'Yêu cầu sửa bài', color: 'bg-orange-100 text-orange-800 border-orange-300' };
      case 'TRANSFERRED_TO_DEPUTY':
        return { label: 'Đã chuyển Phó TBT', color: 'bg-slate-100 text-slate-800 border-slate-300' };
      case 'APPROVED':
        return { label: 'Đã duyệt xuất bản', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'PUBLISHED':
        return { label: 'Đã lên trang', color: 'bg-teal-100 text-teal-800 border-teal-300' };
      case 'REJECTED':
        return { label: 'Từ chối xuất bản', color: 'bg-slate-100 text-slate-700 border-slate-300' };
    }
  };

  // Actions
  const handleSaveEdits = () => {
    if (!activeArticle) return;
    const updated: EditorialArticle = {
      ...activeArticle,
      title: editedTitle,
      sapo: editedSapo,
      content: editedContent,
      editorNote: editorFeedbackNote,
      royaltyTier: selectedRoyaltyTier,
      royaltyAmount: selectedRoyaltyAmount,
      status: 'EDITING',
      updatedAt: new Date().toLocaleString('sv-SE').slice(0, 16).replace('T', ' '),
    };
    onUpdateArticle(updated);
    setIsEditingMode(false);
    alert('Đã lưu nội dung biên tập bài viết thành công!');
  };

  const handleTransferToDeputy = () => {
    if (!activeArticle) return;
    const note = prompt(
      'Ghi chú ý kiến thẩm định chuyên môn gửi Phó Tổng Biên Tập:',
      editorFeedbackNote || 'Kính trình Phó Tổng Biên Tập xem xét duyệt xuất bản. Bài viết có nguồn tin xác thực và tính thời sự cao.'
    );
    if (note === null) return;

    const updated: EditorialArticle = {
      ...activeArticle,
      title: editedTitle,
      sapo: editedSapo,
      content: editedContent,
      editorNote: note,
      status: 'TRANSFERRED_TO_DEPUTY',
      updatedAt: new Date().toLocaleString('sv-SE').slice(0, 16).replace('T', ' '),
    };
    onUpdateArticle(updated);
    alert(`Đã chuyển bài viết "${activeArticle.code} - ${activeArticle.title}" lên Phó Tổng Biên Tập phê duyệt!`);
  };

  const handleSendRevisionRequest = () => {
    if (!activeArticle) return;
    if (!revisionNotesInput.trim()) {
      alert('Vui lòng nhập rõ nội dung cần yêu cầu tác giả bổ sung / chỉnh sửa!');
      return;
    }

    const updated: EditorialArticle = {
      ...activeArticle,
      revisionRequestNote: revisionNotesInput,
      status: 'REVISION_REQUESTED',
      updatedAt: new Date().toLocaleString('sv-SE').slice(0, 16).replace('T', ' '),
    };
    onUpdateArticle(updated);
    setIsRevisionModalOpen(false);
    setRevisionNotesInput('');
    alert(`Đã phát lệnh yêu cầu tác giả (${activeArticle.authorName}) chỉnh sửa bài viết!`);
  };

  const handleRejectArticle = () => {
    if (!activeArticle) return;
    const reason = prompt('Nhập lý do từ chối xuất bản bài viết:', 'Đề tài trùng lặp hoặc chưa đủ tài liệu kiểm chứng độc lập.');
    if (reason === null) return;

    const updated: EditorialArticle = {
      ...activeArticle,
      editorNote: `TỪ CHỐI XUẤT BẢN: ${reason}`,
      status: 'REJECTED',
      updatedAt: new Date().toLocaleString('sv-SE').slice(0, 16).replace('T', ' '),
    };
    onUpdateArticle(updated);
    alert('Đã từ chối xuất bản bài viết.');
  };

  return (
    <div className="space-y-6">
      {/* Screen Header Banner */}
      <div className="bg-white rounded-lg p-6 sm:p-7 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-md ${config.accentBg}`}>
              {config.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${config.badgeColor}`}>
                  {config.badge}
                </span>
                <span className="text-xs text-slate-400 font-mono font-bold">
                  {sourceArticles.length} bài nộp
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                {config.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-3xl leading-relaxed">
                {config.desc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center min-w-[90px]">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Chờ xử lý</div>
              <div className="text-lg font-black text-amber-600 font-mono">
                {sourceArticles.filter((a) => a.status === 'PENDING_REVIEW' || a.status === 'EDITING').length}
              </div>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center min-w-[90px]">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Trình lãnh đạo</div>
              <div className="text-lg font-black text-slate-600 font-mono">
                {sourceArticles.filter((a) => a.status === 'TRANSFERRED_TO_DEPUTY').length}
              </div>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center min-w-[90px]">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Đã duyệt</div>
              <div className="text-lg font-black text-emerald-600 font-mono">
                {sourceArticles.filter((a) => a.status === 'APPROVED' || a.status === 'PUBLISHED').length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Article Queue & Filters (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wide">
                Danh sách bài viết ({filteredArticles.length})
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                Chọn bài để biên tập
              </span>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm tiêu đề, tác giả, mã bài..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Trạng thái:
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none"
                >
                  <option value="ALL">Tất cả trạng thái</option>
                  <option value="PENDING_REVIEW">Chờ thẩm định</option>
                  <option value="EDITING">Đang biên tập</option>
                  <option value="REVISION_REQUESTED">Yêu cầu sửa bài</option>
                  {sourceType !== 'EXPERT' && (
                    <option value="TRANSFERRED_TO_DEPUTY">Đã chuyển Phó TBT</option>
                  )}
                  <option value="APPROVED">Đã duyệt xuất bản</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Chuyên mục:
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none"
                >
                  <option value="ALL">Tất cả chuyên mục</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
            {filteredArticles.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-lg border border-slate-200 text-slate-400 text-xs">
                Không tìm thấy bài viết nào phù hợp bộ lọc.
              </div>
            ) : (
              filteredArticles.map((art) => {
                const isSelected = activeArticle?.id === art.id;
                const statusBadge = getStatusBadge(art.status);

                return (
                  <div
                    key={art.id}
                    onClick={() => setSelectedArticleId(art.id)}
                    className={`p-4 rounded-lg border transition-all cursor-pointer text-left shadow-sm ${
                      isSelected
                        ? 'bg-red-50/50 border-red-500 ring-2 ring-red-400/20 shadow-md'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono text-[10px] font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {art.code}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusBadge.color}`}>
                        {statusBadge.label}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 leading-snug mb-2">
                      {art.title}
                    </h4>

                    {/* Author Chip & Date */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 truncate">
                        <img
                          src={art.authorAvatar}
                          alt={art.authorName}
                          className="w-5 h-5 rounded-full object-cover shrink-0"
                        />
                        <span className="font-semibold text-slate-800 truncate">
                          {art.authorName}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {art.submittedAt.slice(5)}
                      </span>
                    </div>

                    {/* Nhuận bút tag */}
                    {art.royaltyAmount && (
                      <div className="mt-2 flex items-center justify-between text-[10px] text-amber-700 bg-amber-50 px-2 py-1 rounded-lg font-mono font-bold">
                        <span>Nhuận bút dự kiến:</span>
                        <span>{art.royaltyAmount.toLocaleString('vi-VN')} đ</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Active Article Workspace & Editor (8 cols) */}
        <div className="lg:col-span-8">
          {activeArticle ? (
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 sm:p-7 space-y-6">
              {/* Header Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {activeArticle.code}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(activeArticle.status).color}`}>
                    {getStatusBadge(activeArticle.status).label}
                  </span>
                  {activeArticle.relatedSubmissionCode && (
                    <span className="text-[11px] text-slate-500 bg-slate-50 text-slate-700 px-2 py-0.5 rounded font-mono">
                      Khớp tin dân sinh: {activeArticle.relatedSubmissionCode}
                    </span>
                  )}
                </div>

                {/* Top Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  {!isEditingMode ? (
                    <button
                      type="button"
                      onClick={() => setIsEditingMode(true)}
                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Biên tập bài viết</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSaveEdits}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-900/30 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Lưu biên tập</span>
                    </button>
                  )}

                  {sourceType !== 'EXPERT' ? (
                    <button
                      type="button"
                      onClick={handleTransferToDeputy}
                      className="px-3.5 py-1.5 bg-slate-600 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                      title="Chuyển lên Phó Tổng Biên Tập duyệt xuất bản"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Trình Phó TBT</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        if (!activeArticle) return;
                        const updated: EditorialArticle = {
                          ...activeArticle,
                          title: editedTitle,
                          sapo: editedSapo,
                          content: editedContent,
                          editorNote: editorFeedbackNote || 'Đã duyệt xuất bản bài viết chuyên gia.',
                          status: 'APPROVED',
                          updatedAt: new Date().toLocaleString('sv-SE').slice(0, 16).replace('T', ' '),
                        };
                        onUpdateArticle(updated);
                        alert(`Đã duyệt xuất bản bài viết "${activeArticle.code} - ${activeArticle.title}" thành công!`);
                      }}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                      title="Duyệt xuất bản bài viết chuyên gia"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Duyệt xuất bản</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsRevisionModalOpen(true)}
                    className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-orange-600" />
                    <span>Yêu cầu sửa</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRejectArticle}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5 text-red-600" />
                    <span>Từ chối</span>
                  </button>
                </div>
              </div>

              {/* Author & Verification Card */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-lg border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3.5">
                  <img
                    src={activeArticle.authorAvatar}
                    alt={activeArticle.authorName}
                    className="w-12 h-12 rounded-lg object-cover border-2 border-white shadow-sm shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-slate-900 text-sm sm:text-base">
                        {activeArticle.authorName}
                      </h4>
                      {activeArticle.authorPenName && (
                        <span className="text-xs text-slate-500 font-medium">
                          ({activeArticle.authorPenName})
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-amber-700 font-semibold mt-0.5">
                      {activeArticle.authorTitle}
                    </div>
                    {activeArticle.authorOrganization && (
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        <span>{activeArticle.authorOrganization}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-left sm:text-right space-y-1 text-xs">
                  <div className="flex items-center sm:justify-end gap-1.5 text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono">{activeArticle.authorPhone}</span>
                  </div>
                  <div className="flex items-center sm:justify-end gap-1.5 text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{activeArticle.authorEmail}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Nộp bài: {activeArticle.submittedAt}
                  </div>
                </div>
              </div>

              {/* Fact Check & Peer Review Banner */}
              {activeArticle.factCheckNotes && (
                <div className="bg-emerald-50 border border-emerald-200/80 rounded-lg p-3.5 flex items-start gap-3 text-xs text-emerald-900">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-black text-emerald-950">
                      Thẩm định xác thực tư liệu (Độ tin cậy: {activeArticle.factCheckScore || 95}/100đ):
                    </span>
                    <p className="mt-0.5 text-emerald-800 leading-relaxed">
                      {activeArticle.factCheckNotes}
                    </p>
                  </div>
                </div>
              )}

              {/* Revision Request Banner (if any) */}
              {activeArticle.status === 'REVISION_REQUESTED' && activeArticle.revisionRequestNote && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-xs text-orange-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-orange-950">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    <span>Yêu cầu chỉnh sửa gửi tác giả:</span>
                  </div>
                  <p className="text-orange-800 leading-relaxed italic">
                    "{activeArticle.revisionRequestNote}"
                  </p>
                </div>
              )}

              {/* ARTICLE READER / EDITOR FORM */}
              <div className="space-y-4 pt-2">
                {/* Title */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Tiêu đề bài viết (Headline):
                  </label>
                  {isEditingMode ? (
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-base font-black text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                    />
                  ) : (
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                      {activeArticle.title}
                    </h1>
                  )}
                </div>

                {/* Sapo */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Đoạn dẫn mở đầu (Sapo):
                  </label>
                  {isEditingMode ? (
                    <textarea
                      rows={3}
                      value={editedSapo}
                      onChange={(e) => setEditedSapo(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:ring-2 focus:ring-red-500 outline-none leading-relaxed"
                    />
                  ) : (
                    <p className="text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border-l-4 border-red-600">
                      {activeArticle.sapo}
                    </p>
                  )}
                </div>

                {/* Article Content */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Nội dung chi tiết (Body):
                  </label>
                  {isEditingMode ? (
                    <textarea
                      rows={14}
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="w-full p-4 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm font-normal text-slate-900 focus:ring-2 focus:ring-red-500 outline-none leading-relaxed font-serif"
                    />
                  ) : (
                    <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-serif bg-white p-2">
                      {activeArticle.content}
                    </div>
                  )}
                </div>

                {/* Media Attachments */}
                {activeArticle.attachments && activeArticle.attachments.length > 0 && (
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <span className="text-xs font-bold text-slate-900 uppercase">
                      Hình ảnh & Tư liệu kèm theo ({activeArticle.attachments.length})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeArticle.attachments.map((att) => (
                        <div key={att.id} className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50 shadow-sm">
                          <img
                            src={att.url}
                            alt={att.caption}
                            className="w-full h-44 object-cover"
                          />
                          <div className="p-2.5 text-[11px] text-slate-600 italic">
                            {att.caption}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Editorial Notes & Remuneration Settings */}
                <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* BTV Ghi chú thẩm định */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Ý kiến thẩm định của Biên tập viên:
                    </label>
                    <textarea
                      rows={3}
                      value={editorFeedbackNote}
                      onChange={(e) => setEditorFeedbackNote(e.target.value)}
                      placeholder="Ghi rõ nhận xét văn phong, độ tin cậy nguồn tin, hoặc kiến nghị xuất bản..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                    />
                  </div>

                  {/* Nhuận bút */}
                  <div className="bg-amber-50/50 p-4 rounded-lg border border-amber-200/80 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                      <Coins className="w-4 h-4 text-amber-600" />
                      <span>Định Mức Nhuận Bút Tòa Soạn</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="block text-[10px] font-bold text-amber-800 mb-1">
                          Hạng mục bài:
                        </label>
                        <select
                          value={selectedRoyaltyTier}
                          onChange={(e) => {
                            const tier = e.target.value as RoyaltyTier;
                            setSelectedRoyaltyTier(tier);
                            if (tier === 'SPECIAL') setSelectedRoyaltyAmount(3000000);
                            else if (tier === 'TIER_A') setSelectedRoyaltyAmount(1800000);
                            else if (tier === 'TIER_B') setSelectedRoyaltyAmount(1200000);
                            else setSelectedRoyaltyAmount(800000);
                          }}
                          className="w-full p-1.5 bg-white border border-amber-300 rounded-lg text-xs font-bold text-slate-900 outline-none"
                        >
                          <option value="SPECIAL">Chuyên đề đặc biệt (Xuất sắc)</option>
                          <option value="TIER_A">Hạng A (Phóng sự sâu / Phản biện)</option>
                          <option value="TIER_B">Hạng B (Tin bài thời sự tiêu chuẩn)</option>
                          <option value="TIER_C">Hạng C (Tin phản ánh ngắn)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-amber-800 mb-1">
                          Mức nhuận bút (VNĐ):
                        </label>
                        <input
                          type="number"
                          step={100000}
                          value={selectedRoyaltyAmount}
                          onChange={(e) => setSelectedRoyaltyAmount(Number(e.target.value))}
                          className="w-full p-1.5 bg-white border border-amber-300 rounded-lg text-xs font-mono font-bold text-amber-950 outline-none"
                        />
                      </div>
                    </div>

                    <div className="text-[10px] text-amber-700/80 pt-1">
                      Nhuận bút được tự động chuyển khoản qua số tài khoản định danh của tác giả sau khi bài viết được xuất bản chính thức.
                    </div>
                  </div>
                </div>

                {isEditingMode && (
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleSaveEdits}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-950/20 flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Lưu toàn bộ thay đổi bài viết</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center text-slate-400">
              Vui lòng chọn một bài viết từ danh sách bên trái để biên tập.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Yêu cầu sửa bài */}
      {isRevisionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-lg border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-orange-600 font-bold text-sm">
                <RotateCcw className="w-4 h-4" />
                <span>Yêu Cầu Tác Giả Bổ Sung / Sửa Bài Viết</span>
              </div>
              <button
                type="button"
                onClick={() => setIsRevisionModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Thông báo này sẽ được gửi trực tiếp đến tác giả <strong>{activeArticle?.authorName}</strong> ({activeArticle?.authorEmail}). Hãy nêu cụ thể đoạn cần sửa, các số liệu cần bổ sung kiểm chứng.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nội dung yêu cầu chi tiết *:
              </label>
              <textarea
                rows={5}
                required
                value={revisionNotesInput}
                onChange={(e) => setRevisionNotesInput(e.target.value)}
                placeholder="Ví dụ: Cần bổ sung ý kiến phản hồi từ phía chính quyền địa phương; Làm rõ số liệu thiệt hại kinh tế ở đoạn 3..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-orange-500 outline-none leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsRevisionModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSendRevisionRequest}
                className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Gửi yêu cầu chỉnh sửa</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
