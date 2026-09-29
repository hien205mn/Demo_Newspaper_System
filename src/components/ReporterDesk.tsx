import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  MapPin, 
  CheckCircle2, 
  Send, 
  FileText, 
  AlertTriangle, 
  Clock, 
  Radio, 
  Upload, 
  Compass, 
  Sparkles,
  ArrowRight,
  Eye,
  MessageSquare,
  Image as ImageIcon,
  Video,
  Film,
  Plus,
  Trash2,
  Play,
  Lock,
  ExternalLink,
  ShieldCheck,
  Check,
  Edit3
} from 'lucide-react';
import { Submission, FieldVerification, ArticleDraft, MediaAttachment, AppRole } from '../types';
import { MOCK_REPORTERS } from '../data/criteria';

interface ReporterDeskProps {
  submissions: Submission[];
  onUpdateSubmission: (updated: Submission) => void;
  onSelectSubmission: (submission: Submission) => void;
  onOpenEditProfile?: () => void;
  onSwitchRole?: (role: AppRole) => void;
}

export const ReporterDesk: React.FC<ReporterDeskProps> = ({
  submissions,
  onUpdateSubmission,
  onSelectSubmission,
  onOpenEditProfile,
  onSwitchRole,
}) => {
  const [currentReporter, setCurrentReporter] = useState(MOCK_REPORTERS[0]); // CTV-01
  const [selectedSubId, setSelectedSubId] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string>('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 5000);
  };

  // Field verification state
  const [findingSummary, setFindingSummary] = useState('');
  const [witnessCount, setWitnessCount] = useState(3);
  const [verifyStatus, setVerifyStatus] = useState<'CONFIRMED_TRUE' | 'EXAGGERATED' | 'FALSE_REPORT'>('CONFIRMED_TRUE');
  const [evidenceAttachments, setEvidenceAttachments] = useState<MediaAttachment[]>([]);

  // Hidden file inputs for image & video upload
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  // Article writing state
  const [articleTitle, setArticleTitle] = useState('');
  const [articleSapo, setArticleSapo] = useState('');
  const [articleContent, setArticleContent] = useState('');

  // CTV Tab State: 'VERIFICATION' (Kiểm chứng) vs 'ARTICLE' (Viết bài)
  const [activeTab, setActiveTab] = useState<'VERIFICATION' | 'ARTICLE'>('VERIFICATION');

  // Filter states for Tab 1: Kiểm chứng
  const [verifyCategoryFilter, setVerifyCategoryFilter] = useState<'ALL' | 'TIN_NONG' | 'KHIEU_NAI'>('ALL');
  const [verifyStatusFilter, setVerifyStatusFilter] = useState<'ALL' | 'FIELD_ASSIGNED' | 'FIELD_VERIFIED'>('ALL');

  // Filter states for Tab 2: Viết bài
  const [articleCategoryFilter, setArticleCategoryFilter] = useState<'ALL' | 'TIN_NONG' | 'KHIEU_NAI'>('ALL');
  const [articleStatusFilter, setArticleStatusFilter] = useState<'ALL' | 'ARTICLE_DRAFTING' | 'ARTICLE_SUBMITTED' | 'EDITOR_REVISION_REQUESTED' | 'PUBLISHED'>('ALL');

  // Tasks directly assigned to this CTV (Không có phần Chờ BTV giao việc - chỉ hiển thị nhiệm vụ được giao)
  const myAssignments = submissions.filter(
    (s) => s.fieldAssignment?.assignedReporterId === currentReporter.id
  );

  // Tab 1: Tasks in verification workflow
  const verificationTasks = myAssignments.filter(
    (s) => s.stage === 'FIELD_ASSIGNED' || s.stage === 'FIELD_VERIFIED'
  );

  // Tab 2: Tasks in writing workflow ("Viết những bài được yêu cầu đi kiểm chứng")
  const articleTasks = myAssignments.filter(
    (s) =>
      s.stage === 'ARTICLE_DRAFTING' ||
      s.stage === 'ARTICLE_SUBMITTED' ||
      s.stage === 'EDITOR_REVISION_REQUESTED' ||
      s.stage === 'AI_REVIEW_COMPLETED' ||
      s.stage === 'DEPUTY_PENDING' ||
      s.stage === 'EIC_PENDING' ||
      s.stage === 'READY_FOR_PUBLISHING' ||
      s.stage === 'PUBLISHED'
  );

  // Filtered lists for each tab
  const filteredVerificationTasks = verificationTasks.filter((s) => {
    const matchCategory = verifyCategoryFilter === 'ALL' || (s.category || 'TIN_NONG') === verifyCategoryFilter;
    const matchStatus = verifyStatusFilter === 'ALL' || s.stage === verifyStatusFilter;
    return matchCategory && matchStatus;
  });

  const filteredArticleTasks = articleTasks.filter((s) => {
    const matchCategory = articleCategoryFilter === 'ALL' || (s.category || 'TIN_NONG') === articleCategoryFilter;
    let matchStatus = true;
    if (articleStatusFilter === 'ARTICLE_DRAFTING') matchStatus = s.stage === 'ARTICLE_DRAFTING';
    else if (articleStatusFilter === 'ARTICLE_SUBMITTED') matchStatus = s.stage === 'ARTICLE_SUBMITTED';
    else if (articleStatusFilter === 'EDITOR_REVISION_REQUESTED') matchStatus = s.stage === 'EDITOR_REVISION_REQUESTED';
    else if (articleStatusFilter === 'PUBLISHED') matchStatus = s.stage === 'PUBLISHED' || s.stage === 'READY_FOR_PUBLISHING';
    return matchCategory && matchStatus;
  });

  const visibleTasks = activeTab === 'VERIFICATION' ? filteredVerificationTasks : filteredArticleTasks;
  const activeSub = visibleTasks.find((s) => s.id === selectedSubId) || visibleTasks[0] || (activeTab === 'VERIFICATION' ? verificationTasks[0] : articleTasks[0]) || myAssignments[0];

  // Auto-switch selected task if changing tab and selected task isn't in new tab
  const handleTabChange = (tab: 'VERIFICATION' | 'ARTICLE') => {
    setActiveTab(tab);
    const targetList = tab === 'VERIFICATION' ? filteredVerificationTasks : filteredArticleTasks;
    const fallbackList = tab === 'VERIFICATION' ? verificationTasks : articleTasks;
    if (targetList.length > 0) {
      if (!targetList.some((s) => s.id === selectedSubId)) {
        setSelectedSubId(targetList[0].id);
      }
    } else if (fallbackList.length > 0) {
      setSelectedSubId(fallbackList[0].id);
    }
  };

  // Sync state whenever activeSub changes
  useEffect(() => {
    if (activeSub) {
      if (activeSub.fieldVerification) {
        setFindingSummary(activeSub.fieldVerification.findingSummary || '');
        setWitnessCount(activeSub.fieldVerification.witnessCount ?? 3);
        setVerifyStatus(activeSub.fieldVerification.status || 'CONFIRMED_TRUE');
        setEvidenceAttachments(activeSub.fieldVerification.evidenceAttachments || []);
      } else {
        setFindingSummary('');
        setWitnessCount(3);
        setVerifyStatus('CONFIRMED_TRUE');
        // Pre-populate with default field photo if empty so CTV has starting media
        setEvidenceAttachments([
          {
            id: `vatt-init-${Date.now()}`,
            name: 'anh_hien_truong_ctv.jpg',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&auto=format&fit=crop&q=80',
            caption: 'Ảnh chụp vách taluy sạt lở đối chứng tại hiện trường',
          },
        ]);
      }

      if (activeSub.articleDraft) {
        setArticleTitle(activeSub.articleDraft.title || '');
        setArticleSapo(activeSub.articleDraft.sapo || '');
        setArticleContent(activeSub.articleDraft.content || '');
      } else {
        setArticleTitle('');
        setArticleSapo('');
        setArticleContent('');
      }
    }
  }, [activeSub?.id, activeSub?.stage]);

  // Workflow Stages
  // 1. isAwaitingVerification: CTV needs to verify on-site and upload photos/videos (Tab Kiểm chứng)
  // 2. isWaitingEditorDirective: CTV has submitted verification, WAITING for Editor to approve and command article writing
  // 3. isDraftingArticle: BTV has commanded CTV to write the article (ARTICLE_DRAFTING or REVISION)
  // 4. isArticleSubmitted: Article has been submitted to editor
  // 5. isPublished: Article has been published
  const isAwaitingVerification = activeSub?.stage === 'FIELD_ASSIGNED';
  const isWaitingEditorDirective = activeSub?.stage === 'FIELD_VERIFIED';
  const isDraftingArticle = activeSub?.stage === 'ARTICLE_DRAFTING' || activeSub?.stage === 'EDITOR_REVISION_REQUESTED';
  const isArticleSubmitted = activeSub?.stage === 'ARTICLE_SUBMITTED';
  const isPublished = activeSub?.stage === 'PUBLISHED' || activeSub?.stage === 'READY_FOR_PUBLISHING';
  const canWriteArticle = isDraftingArticle || isArticleSubmitted || isPublished;

  // Attach Image from local device
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const newAttachment: MediaAttachment = {
          id: `img-${Date.now()}`,
          name: file.name,
          type: 'image',
          url: event.target.result as string,
          caption: `Ảnh hiện trường do CTV ${currentReporter.name} chụp`,
        };
        setEvidenceAttachments((prev) => [...prev, newAttachment]);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Attach Video from local device
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const videoUrl = URL.createObjectURL(file);
    const newAttachment: MediaAttachment = {
      id: `vid-${Date.now()}`,
      name: file.name,
      type: 'video',
      url: videoUrl,
      caption: `Video phóng viên ghi nhận trực tiếp tại hiện trường`,
    };
    setEvidenceAttachments((prev) => [...prev, newAttachment]);
    e.target.value = '';
  };

  // Quick Preset Attachments
  const handleAddPresetPhoto = (sampleUrl: string, label: string) => {
    const newAttachment: MediaAttachment = {
      id: `preset-img-${Date.now()}`,
      name: `anh_thuc_dia_${Date.now().toString().slice(-4)}.jpg`,
      type: 'image',
      url: sampleUrl,
      caption: label,
    };
    setEvidenceAttachments((prev) => [...prev, newAttachment]);
  };

  const handleAddPresetVideo = (sampleUrl: string, label: string) => {
    const newAttachment: MediaAttachment = {
      id: `preset-vid-${Date.now()}`,
      name: `video_hien_truong_${Date.now().toString().slice(-4)}.mp4`,
      type: 'video',
      url: sampleUrl,
      caption: label,
    };
    setEvidenceAttachments((prev) => [...prev, newAttachment]);
  };

  const handleRemoveAttachment = (id: string) => {
    setEvidenceAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleUpdateCaption = (id: string, caption: string) => {
    setEvidenceAttachments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, caption } : a))
    );
  };

  // Submit verification report
  const handleSubmitVerification = () => {
    if (!activeSub) return;
    if (!findingSummary.trim()) {
      triggerToast('Vui lòng nhập báo cáo chi tiết kết quả kiểm chứng hiện trường.');
      return;
    }

    if (evidenceAttachments.length === 0) {
      triggerToast('Vui lòng tải lên hoặc đính kèm ít nhất 1 hình ảnh hoặc video hiện trường để chứng minh tính xác thực!');
      return;
    }

    const verification: FieldVerification = {
      verifiedAt: new Date().toLocaleString('sv-SE').slice(0, 16).replace('T', ' '),
      reporterId: currentReporter.id,
      reporterName: currentReporter.name,
      evidenceAttachments,
      locationGps: activeSub.gpsCoordinates || '21.0188° N, 105.7729° E',
      witnessCount,
      findingSummary,
      status: verifyStatus,
      editorNotes: 'Đã hoàn tất kiểm chứng hiện trường và nộp hồ sơ ảnh/video.',
    };

    const updated: Submission = {
      ...activeSub,
      stage: 'FIELD_VERIFIED',
      fieldVerification: verification,
    };

    onUpdateSubmission(updated);
    triggerToast(
      `✓ ĐÃ GỬI BÁO CÁO KIỂM CHỨNG & ${evidenceAttachments.length} TƯ LIỆU VỀ TÒA SOẠN! Đang chờ BTV duyệt và phát lệnh viết bài.`
    );
  };

  // Submit drafted article
  const handleSubmitArticle = () => {
    if (!activeSub) return;
    if (!articleTitle.trim() || !articleContent.trim()) {
      triggerToast('Vui lòng nhập đầy đủ tiêu đề và nội dung bài viết.');
      return;
    }

    const currentRound = activeSub.articleDraft?.revisionRound || 1;
    const draft: ArticleDraft = {
      title: articleTitle,
      sapo: articleSapo || articleContent.slice(0, 120) + '...',
      content: articleContent,
      authorName: currentReporter.name,
      authorId: currentReporter.id,
      updatedAt: new Date().toLocaleString('sv-SE').slice(0, 16).replace('T', ' '),
      revisionRound: currentRound,
      editorFeedbackNote: undefined, // Clear previous feedback
    };

    const updated: Submission = {
      ...activeSub,
      stage: 'ARTICLE_SUBMITTED',
      articleDraft: draft,
    };

    onUpdateSubmission(updated);
    triggerToast('✓ ĐÃ NỘP BÀI VIẾT HIỆN TRƯỜNG THÀNH CÔNG! Đang chờ BTV thẩm định.');
  };

  // Helper to prefill draft
  const handlePrefillDraft = () => {
    if (!activeSub) return;
    setArticleTitle(`Hiện trường vụ việc: ${activeSub.title}`);
    setArticleSapo(`Trực tiếp từ hiện trường tại ${activeSub.location}, phóng viên ghi nhận tình hình thực tế, đối chứng tư liệu và phản ánh tiếng nói của người dân sau sự việc.`);
    setArticleContent(`Theo ghi nhận của CTV ${currentReporter.name} vào sáng nay, sau khi nhận được lệnh điều phối tác nghiệp từ Ban Biên Tập về vụ việc "${activeSub.title}", phóng viên đã có mặt tại hiện trường tại ${activeSub.location}.\n\nQua kiểm chứng độc lập và phỏng vấn ${witnessCount} nhân chứng sở tại, sự việc được xác nhận là diễn ra đúng như thông tin bạn đọc phản ánh. Toàn bộ hình ảnh đối chứng và video ghi nhận hiện trường đã được gửi về Tòa soạn.\n\nHiện tại, các cơ quan chức năng địa phương đã nắm bắt thông tin và đang khẩn trương phối hợp giải quyết dứt điểm.`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-lg p-6 border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-lg">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black">BÀN CỘNG TÁC VIÊN HIỆN TRƯỜNG (CTV DESK)</h1>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                  TÁC NGHIỆP HIỆN TRƯỜNG
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Nhận lệnh tác nghiệp • Kiểm chứng thực địa • Soạn thảo bài viết tại hiện trường
              </p>
            </div>
          </div>

          {/* Reporter Selector & Profile Button */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 bg-slate-800/90 p-2 rounded-xl border border-slate-700 text-xs">
              <span className="text-slate-400">Đang đăng nhập:</span>
              <select
                value={currentReporter.id}
                onChange={(e) => {
                  const rep = MOCK_REPORTERS.find((r) => r.id === e.target.value);
                  if (rep) setCurrentReporter(rep);
                }}
                className="bg-slate-900 text-amber-300 font-bold px-2.5 py-1 rounded border border-slate-700 outline-none"
              >
                {MOCK_REPORTERS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.id} - {r.region})
                  </option>
                ))}
              </select>
            </div>

            {onOpenEditProfile && (
              <button
                type="button"
                onClick={onOpenEditProfile}
                className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-amber-950/40 cursor-pointer"
                title="Chỉnh sửa thông tin hồ sơ Phóng viên / CTV"
              >
                <Camera className="w-3.5 h-3.5 text-amber-200" />
                <span>Sửa hồ sơ CTV</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 2 Dedicated Tabs for CTV (Kiểm chứng & Viết bài) with Filters */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm space-y-3">
            {/* Header info */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-600" />
                Nhiệm vụ được giao ({myAssignments.length})
              </span>
              <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
                {currentReporter.id}
              </span>
            </div>

            {/* 2 Tabs: Kiểm chứng vs Viết bài */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => handleTabChange('VERIFICATION')}
                className={`py-2 px-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'VERIFICATION'
                    ? 'bg-slate-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>1. Kiểm chứng</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                  activeTab === 'VERIFICATION' ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {verificationTasks.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('ARTICLE')}
                className={`py-2 px-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'ARTICLE'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>2. Viết bài</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                  activeTab === 'ARTICLE' ? 'bg-amber-800 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {articleTasks.length}
                </span>
              </button>
            </div>

            {/* Filter Controls for active tab */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5 text-xs">
              {/* Filter 1: Lọc nhiệm vụ thành từng loại */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Lọc theo loại nhiệm vụ:
                </label>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (activeTab === 'VERIFICATION') setVerifyCategoryFilter('ALL');
                      else setArticleCategoryFilter('ALL');
                    }}
                    className={`py-1.5 px-1 rounded-lg text-[11px] font-bold text-center transition cursor-pointer ${
                      (activeTab === 'VERIFICATION' ? verifyCategoryFilter : articleCategoryFilter) === 'ALL'
                        ? 'bg-slate-800 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Tất cả loại
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (activeTab === 'VERIFICATION') setVerifyCategoryFilter('TIN_NONG');
                      else setArticleCategoryFilter('TIN_NONG');
                    }}
                    className={`py-1.5 px-1 rounded-lg text-[11px] font-bold text-center transition cursor-pointer truncate ${
                      (activeTab === 'VERIFICATION' ? verifyCategoryFilter : articleCategoryFilter) === 'TIN_NONG'
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-red-700 hover:bg-red-50'
                    }`}
                  >
                    🚨 Tin nóng
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (activeTab === 'VERIFICATION') setVerifyCategoryFilter('KHIEU_NAI');
                      else setArticleCategoryFilter('KHIEU_NAI');
                    }}
                    className={`py-1.5 px-1 rounded-lg text-[11px] font-bold text-center transition cursor-pointer truncate ${
                      (activeTab === 'VERIFICATION' ? verifyCategoryFilter : articleCategoryFilter) === 'KHIEU_NAI'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-amber-800 hover:bg-amber-50'
                    }`}
                  >
                    📋 Khiếu nại
                  </button>
                </div>
              </div>

              {/* Filter 2: Lọc theo trạng thái */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Lọc theo trạng thái ({activeTab === 'VERIFICATION' ? 'Kiểm chứng' : 'Viết bài'}):
                </label>
                {activeTab === 'VERIFICATION' ? (
                  <select
                    value={verifyStatusFilter}
                    onChange={(e: any) => setVerifyStatusFilter(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:ring-1 focus:ring-slate-500"
                  >
                    <option value="ALL">Tất cả trạng thái kiểm chứng ({verificationTasks.length})</option>
                    <option value="FIELD_ASSIGNED">1. Cần đi kiểm chứng ({verificationTasks.filter(s => s.stage === 'FIELD_ASSIGNED').length})</option>
                    <option value="FIELD_VERIFIED">2. Đã nộp báo cáo chờ duyệt ({verificationTasks.filter(s => s.stage === 'FIELD_VERIFIED').length})</option>
                  </select>
                ) : (
                  <select
                    value={articleStatusFilter}
                    onChange={(e: any) => setArticleStatusFilter(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="ALL">Tất cả trạng thái viết bài ({articleTasks.length})</option>
                    <option value="ARTICLE_DRAFTING">BTV yêu cầu viết bài ({articleTasks.filter(s => s.stage === 'ARTICLE_DRAFTING').length})</option>
                    <option value="ARTICLE_SUBMITTED">Đã nộp bài cho BTV ({articleTasks.filter(s => s.stage === 'ARTICLE_SUBMITTED').length})</option>
                    <option value="EDITOR_REVISION_REQUESTED">Yêu cầu sửa đổi ({articleTasks.filter(s => s.stage === 'EDITOR_REVISION_REQUESTED').length})</option>
                    <option value="PUBLISHED">Đã xuất bản ({articleTasks.filter(s => s.stage === 'PUBLISHED' || s.stage === 'READY_FOR_PUBLISHING').length})</option>
                  </select>
                )}
              </div>
            </div>

            {/* List of Tasks in Active Tab */}
            {visibleTasks.length === 0 ? (
              <div className="py-8 px-4 bg-slate-50 rounded-xl border border-slate-100 text-center space-y-1.5">
                <p className="text-xs font-bold text-slate-600">Không có nhiệm vụ nào phù hợp bộ lọc</p>
                <p className="text-[11px] text-slate-400">
                  {activeTab === 'VERIFICATION'
                    ? 'Bạn hiện không có nhiệm vụ kiểm chứng nào theo tiêu chí này'
                    : 'Chưa có bài viết nào được yêu cầu viết theo tiêu chí này'}
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
                {visibleTasks.map((sub) => {
                  const isSelected = activeSub?.id === sub.id;
                  const isKhieuNai = sub.category === 'KHIEU_NAI';
                  return (
                    <div
                      key={sub.id}
                      onClick={() => setSelectedSubId(sub.id)}
                      className={`p-3 rounded-xl border transition cursor-pointer space-y-1.5 ${
                        isSelected
                          ? activeTab === 'VERIFICATION'
                            ? 'bg-slate-50/80 border-slate-500 shadow-sm ring-1 ring-slate-400/50'
                            : 'bg-amber-50/80 border-amber-500 shadow-sm ring-1 ring-amber-400/50'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-slate-500 font-bold">{sub.trackingCode}</span>
                          <span className={`px-1.5 py-0.5 rounded font-black text-[9px] uppercase ${
                            isKhieuNai ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {isKhieuNai ? 'Khiếu nại' : 'Tin nóng'}
                          </span>
                        </div>
                        {sub.stage === 'FIELD_ASSIGNED' && (
                          <span className="font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                            Cần kiểm chứng
                          </span>
                        )}
                        {sub.stage === 'FIELD_VERIFIED' && (
                          <span className="font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300 animate-pulse">
                            Chờ BTV duyệt
                          </span>
                        )}
                        {sub.stage === 'ARTICLE_DRAFTING' && (
                          <span className="font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
                            BTV yêu cầu viết
                          </span>
                        )}
                        {sub.stage === 'ARTICLE_SUBMITTED' && (
                          <span className="font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                            Đã nộp bài
                          </span>
                        )}
                        {sub.stage === 'EDITOR_REVISION_REQUESTED' && (
                          <span className="font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded border border-red-300">
                            Yêu cầu sửa
                          </span>
                        )}
                        {sub.stage === 'PUBLISHED' && (
                          <span className="font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
                            Đã xuất bản
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-xs text-slate-900 line-clamp-2 leading-snug">
                        {sub.title}
                      </h4>

                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="truncate max-w-[170px]">{sub.province} • {sub.district}</span>
                        <span className="font-black text-slate-600">{sub.priority} ({sub.totalScore}đ)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Field Workstation (Verification & Article Writing) */}
        <div className="lg:col-span-8">
          {activeSub ? (
            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm space-y-6">
              {/* Toast Message Notification */}
              {toastMessage && (
                <div className="p-4 bg-emerald-600 text-white rounded-xl shadow-lg flex items-center justify-between text-xs font-bold animate-fade-in">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
                    <span>{toastMessage}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setToastMessage('')}
                    className="text-white hover:text-emerald-200 font-bold ml-2 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Task Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <span className="font-mono font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                      {activeSub.trackingCode}
                    </span>
                    <span>• {activeSub.location}</span>
                  </div>
                  <h2 className="text-lg font-black text-slate-900">
                    {activeSub.title}
                  </h2>
                </div>

                <div className="text-right shrink-0">
                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-200">
                    Mức độ: {activeSub.priority} ({activeSub.totalScore}đ)
                  </span>
                </div>
              </div>

              {/* 3-STEP WORKFLOW PIPELINE PROGRESS BAR */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2 bg-slate-100/90 rounded-lg border border-slate-200">
                {/* Bước 1 */}
                <div className={`p-3 rounded-xl flex items-center gap-2.5 text-xs transition ${
                  !canWriteArticle && !isWaitingEditorDirective
                    ? 'bg-slate-600 text-white font-black shadow-md ring-2 ring-slate-400/40'
                    : 'bg-white text-slate-700 font-bold border border-slate-200'
                }`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${
                    (isWaitingEditorDirective || canWriteArticle)
                      ? 'bg-emerald-500 text-white font-bold'
                      : !canWriteArticle && !isWaitingEditorDirective
                      ? 'bg-white/20 text-white font-bold'
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {(isWaitingEditorDirective || canWriteArticle) ? '✓' : '1'}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate">1. Xác thực thực địa</div>
                    <div className="text-[10px] font-normal opacity-85 truncate">
                      {evidenceAttachments.length > 0 ? `${evidenceAttachments.length} ảnh & video` : 'Gửi kèm ảnh & video'}
                    </div>
                  </div>
                </div>

                {/* Bước 2 */}
                <div className={`p-3 rounded-xl flex items-center gap-2.5 text-xs transition ${
                  isWaitingEditorDirective
                    ? 'bg-amber-600 text-white font-black shadow-md ring-2 ring-amber-400/50'
                    : canWriteArticle
                    ? 'bg-white text-slate-700 font-bold border border-slate-200'
                    : 'bg-slate-50 text-slate-400 border border-slate-200/60'
                }`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${
                    canWriteArticle
                      ? 'bg-emerald-500 text-white font-bold'
                      : isWaitingEditorDirective
                      ? 'bg-white/20 text-white font-bold'
                      : 'bg-slate-200 text-slate-400'
                  }`}>
                    {canWriteArticle ? '✓' : '2'}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate">2. Chờ BTV yêu cầu viết</div>
                    <div className="text-[10px] font-normal opacity-85 truncate">
                      {isWaitingEditorDirective ? 'Đang chờ BTV duyệt...' : 'Thẩm định tư liệu'}
                    </div>
                  </div>
                </div>

                {/* Bước 3 */}
                <div className={`p-3 rounded-xl flex items-center gap-2.5 text-xs transition ${
                  canWriteArticle
                    ? 'bg-emerald-600 text-white font-black shadow-md ring-2 ring-emerald-400/40'
                    : 'bg-slate-50 text-slate-400 border border-slate-200/60'
                }`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${
                    canWriteArticle
                      ? 'bg-white/20 text-white font-bold'
                      : 'bg-slate-200 text-slate-400'
                  }`}>
                    {canWriteArticle ? '✎' : <Lock className="w-3.5 h-3.5" />}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate">3. Soạn thảo bài viết</div>
                    <div className="text-[10px] font-normal opacity-85 truncate">
                      {canWriteArticle ? 'Đã mở khóa viết bài' : 'Khóa (Chờ lệnh BTV)'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Hidden file inputs for uploading Image and Video */}
              <input
                type="file"
                ref={imageInputRef}
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <input
                type="file"
                ref={videoInputRef}
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
              />

              {/* Revision Warning Banner if editor requested revision */}
              {activeSub.articleDraft?.editorFeedbackNote && (
                <div className="p-4 bg-red-50 rounded-xl border-2 border-red-300 space-y-1.5 animate-pulse">
                  <div className="flex items-center gap-2 text-red-900 font-bold text-xs uppercase">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>YÊU CẦU CHỈNH SỬA TỪ BIÊN TẬP VIÊN (BẢN THẢO VÒNG {activeSub.articleDraft.revisionRound})</span>
                  </div>
                  <p className="text-xs text-red-800 bg-white p-3 rounded-lg border border-red-200">
                    <strong>Ghi chú sai sót cần sửa:</strong> {activeSub.articleDraft.editorFeedbackNote}
                  </p>
                </div>
              )}

              {/* ========================================================================= */}
              {/* SCREEN 1: XÁC THỰC VÀ GỬI THÔNG TIN KIỂM CHỨNG HIỆN TRƯỜNG (KÈM ẢNH & VIDEO) */}
              {/* Hiển thị khi CTV mới nhận việc (FIELD_ASSIGNED) hoặc chưa gửi báo cáo       */}
              {/* ========================================================================= */}
              {!canWriteArticle && !isWaitingEditorDirective && (
                <div className="p-5 sm:p-6 bg-slate-50 rounded-lg border border-slate-200 space-y-5 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
                    <div>
                      <h3 className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
                        <Camera className="w-4 h-4 text-slate-600" />
                        XÁC THỰC & GỬI THÔNG TIN KIỂM CHỨNG HIỆN TRƯỜNG
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Kiểm tra thực địa, phỏng vấn nhân chứng và đính kèm đầy đủ hình ảnh, video đối chứng.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200 shrink-0">
                      Giai đoạn: Kiểm chứng thực địa
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Kết luận xác thực tính chính xác *
                      </label>
                      <select
                        value={verifyStatus}
                        onChange={(e: any) => setVerifyStatus(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-slate-500"
                      >
                        <option value="CONFIRMED_TRUE">✓ Xác thực đúng 100% phản ánh</option>
                        <option value="EXAGGERATED">⚠ Phản ánh có phóng đại một phần</option>
                        <option value="FALSE_REPORT">✕ Tin giả mạo / Không có thật</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Số nhân chứng/đối tượng đã phỏng vấn
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={witnessCount}
                        onChange={(e) => setWitnessCount(Number(e.target.value))}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-slate-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Báo cáo chi tiết hiện trường của CTV *
                    </label>
                    <textarea
                      rows={3}
                      value={findingSummary}
                      onChange={(e) => setFindingSummary(e.target.value)}
                      placeholder="Mô tả cụ thể những gì CTV tận mắt chứng kiến tại hiện trường, làm việc với ai, hiện trạng tài sản/sức khỏe người dân ra sao..."
                      className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs leading-relaxed outline-none focus:ring-2 focus:ring-slate-500"
                    />
                  </div>

                  {/* KHU VỰC ĐÍNH KÈM HÌNH ẢNH VÀ VIDEO HIỆN TRƯỜNG */}
                  <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-2">
                      <div className="flex items-center gap-2">
                        <Film className="w-4 h-4 text-slate-600" />
                        <span className="text-xs font-black text-slate-900 uppercase">
                          Hồ Sơ Tư Liệu Hiện Trường: Hình Ảnh & Video ({evidenceAttachments.length}) *
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        Bắt buộc tối thiểu 1 hình ảnh hoặc video đối chứng
                      </span>
                    </div>

                    {/* Action buttons: Upload ảnh / video */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Upload Photo Button */}
                      <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-slate-600" />
                        <span>+ Tải ảnh từ máy</span>
                      </button>

                      {/* Upload Video Button */}
                      <button
                        type="button"
                        onClick={() => videoInputRef.current?.click()}
                        className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Video className="w-3.5 h-3.5 text-slate-600" />
                        <span>+ Tải video từ máy</span>
                      </button>

                      {/* Quick Preset Photo */}
                      <button
                        type="button"
                        onClick={() =>
                          handleAddPresetPhoto(
                            'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
                            'Ảnh đối chứng hiện trường chụp góc cận cảnh'
                          )
                        }
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                      >
                        <Plus className="w-3 h-3 text-slate-500" />
                        <span>Thêm ảnh mẫu thực địa</span>
                      </button>

                      {/* Quick Preset Video */}
                      <button
                        type="button"
                        onClick={() =>
                          handleAddPresetVideo(
                            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                            'Video CTV ghi hình trực tiếp tại hiện trường (0:45s)'
                          )
                        }
                        className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                      >
                        <Play className="w-3 h-3 text-amber-600" />
                        <span>Thêm video hiện trường mẫu (0:45s)</span>
                      </button>
                    </div>

                    {/* Attachments List */}
                    {evidenceAttachments.length === 0 ? (
                      <div className="p-4 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-400">
                        Chưa có hình ảnh hoặc video nào được đính kèm. Vui lòng tải lên hoặc bấm các nút phía trên để bổ sung tư liệu hiện trường.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {evidenceAttachments.map((att, idx) => (
                          <div
                            key={att.id}
                            className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between gap-2 shadow-sm"
                          >
                            <div className="relative rounded-lg overflow-hidden bg-black flex items-center justify-center h-32">
                              {att.type === 'video' ? (
                                <video
                                  src={att.url}
                                  controls
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <img
                                  src={att.url}
                                  alt={att.name}
                                  className="w-full h-full object-cover"
                                />
                              )}
                              <span
                                className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-black uppercase shadow ${
                                  att.type === 'video'
                                    ? 'bg-slate-600 text-white'
                                    : 'bg-slate-600 text-white'
                                }`}
                              >
                                {att.type === 'video' ? '🎥 Video hiện trường' : '📸 Ảnh đối chứng'}
                              </span>
                            </div>

                            {/* Caption editor */}
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                                <span className="truncate max-w-[180px]">{att.name}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveAttachment(att.id)}
                                  className="text-red-500 hover:text-red-700 flex items-center gap-0.5 cursor-pointer font-sans"
                                  title="Xóa tệp này"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Xóa</span>
                                </button>
                              </div>
                              <input
                                type="text"
                                value={att.caption || ''}
                                onChange={(e) => handleUpdateCaption(att.id, e.target.value)}
                                placeholder="Ghi chú thích cho tư liệu này..."
                                className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800 outline-none focus:ring-1 focus:ring-slate-500"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between pt-2 border-t border-slate-200 gap-3">
                    <p className="text-[11px] text-slate-500 italic">
                      * Sau khi nộp, Báo cáo và Tư liệu sẽ được gửi tới BTV. Bạn cần chờ BTV phát lệnh yêu cầu viết bài để chuyển sang bước soạn thảo.
                    </p>
                    <button
                      type="button"
                      onClick={handleSubmitVerification}
                      className="w-full sm:w-auto px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>NỘP BÁO CÁO KIỂM CHỨNG & TƯ LIỆU CHO BTV</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* SCREEN 2: TRẠNG THÁI ĐÃ GỬI BÁO CÁO - ĐANG CHỜ BTV DUYỆT & PHÁT LỆNH     */}
              {/* Screen viết bài BỊ KHÓA, CTV không thể chuyển qua cho đến khi BTV yêu cầu  */}
              {/* ========================================================================= */}
              {isWaitingEditorDirective && (
                <div className="p-6 bg-gradient-to-r from-slate-50 via-slate-50 to-amber-50 rounded-lg border-2 border-slate-300 space-y-5 animate-fade-in">
                  <div className="flex items-start sm:items-center gap-3.5 pb-4 border-b border-slate-200/80">
                    <div className="w-12 h-12 rounded-lg bg-slate-600 text-white flex items-center justify-center shrink-0 shadow-md">
                      <Clock className="w-6 h-6 animate-spin" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-200 text-slate-900 border border-slate-300">
                          ĐÃ NỘP BÁO CÁO KIỂM CHỨNG
                        </span>
                        <span className="text-xs font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                          ĐANG CHỜ BTV PHÁT LỆNH VIẾT BÀI
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                        BÁO CÁO ĐÃ ĐƯỢC CHUYỂN TỚI BÀN BIÊN TẬP
                      </h3>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        Bạn đã hoàn tất kiểm chứng hiện trường và nộp <strong>{evidenceAttachments.length} tư liệu (hình ảnh & video)</strong>. Theo quy trình tòa soạn, Biên tập viên sẽ thẩm định tính xác thực và phát lệnh yêu cầu viết bài trước khi bạn có thể mở màn hình viết bài.
                      </p>
                    </div>
                  </div>

                  {/* Summary of submitted verification */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-900 border-b border-slate-100 pb-2">
                      <span className="flex items-center gap-1.5 text-slate-700">
                        <ShieldCheck className="w-4 h-4" />
                        Tóm tắt báo cáo kiểm chứng đã gửi:
                      </span>
                      <span className="text-slate-500 font-mono text-[11px]">
                        {activeSub.fieldVerification?.verifiedAt}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-slate-700">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Kết luận:</span>
                        <strong className="text-emerald-700">{activeSub.fieldVerification?.status}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Số nhân chứng:</span>
                        <strong>{activeSub.fieldVerification?.witnessCount || witnessCount} người</strong>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold mb-0.5">Nội dung ghi nhận:</span>
                      <p className="text-slate-800 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        "{activeSub.fieldVerification?.findingSummary || findingSummary}"
                      </p>
                    </div>

                    {/* Preview attached media */}
                    {evidenceAttachments.length > 0 && (
                      <div className="pt-2">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1.5">
                          Hình ảnh & Video đã nộp ({evidenceAttachments.length}):
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                          {evidenceAttachments.map((att) => (
                            <div key={att.id} className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-100 h-20">
                              {att.type === 'video' ? (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white text-[10px]">
                                  <Video className="w-5 h-5 text-slate-400 mb-0.5" />
                                  <span>Video MP4</span>
                                </div>
                              ) : (
                                <img src={att.url} alt={att.name} className="w-full h-full object-cover" />
                              )}
                              <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] px-1 truncate">
                                {att.caption || att.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Lock Screen Notice */}
                  <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-xl space-y-3">
                    <div className="flex items-start gap-2.5 text-xs text-amber-900">
                      <Lock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-amber-950 text-sm">
                          MÀN HÌNH SOẠN THẢO BÀI VIẾT ĐANG TẠM KHÓA
                        </div>
                        <p className="mt-0.5 leading-relaxed text-amber-800">
                          Theo quy trình tòa soạn: Cộng tác viên đã gửi đầy đủ tư liệu hình ảnh và video đối chứng. Bạn cần chờ Biên tập viên kiểm tra tính xác thực của tư liệu và bấm nút <strong>"Phê duyệt & Yêu cầu CTV viết bài"</strong> trên Bàn Biên Tập thì màn hình Soạn thảo bài viết mới được mở khóa.
                        </p>
                      </div>
                    </div>

                    {onSwitchRole && (
                      <div className="pt-2.5 border-t border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="text-[11px] text-amber-800 font-medium">
                          Bạn có thể chuyển sang vai trò BTV để trải nghiệm phê duyệt ngay:
                        </span>
                        <button
                          type="button"
                          onClick={() => onSwitchRole('EDITOR')}
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shrink-0"
                        >
                          <span>👉 Chuyển sang Bàn BTV để phê duyệt & phát lệnh</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* SCREEN 3: SOẠN THẢO BÀI VIẾT HIỆN TRƯỜNG (BTV ĐÃ PHÁT LỆNH YÊU CẦU VIẾT)   */}
              {/* Chỉ hiển thị khi BTV đã phát lệnh (ARTICLE_DRAFTING hoặc nộp lại bản thảo)   */}
              {/* ========================================================================= */}
              {canWriteArticle && (
                <div className="p-5 sm:p-6 bg-white rounded-lg border-2 border-emerald-400 shadow-md space-y-4 animate-fade-in">
                  {/* Banner status: Drafting vs Submitted vs Published */}
                  {isPublished ? (
                    <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                      <div className="flex items-center gap-2 text-emerald-900 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>✓ BÀI BÁO ĐÃ ĐƯỢC LÃNH ĐẠO TÒA SOẠN DUYỆT VÀ XUẤT BẢN CHÍNH THỨC</span>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-800 font-black bg-white px-2 py-0.5 rounded border border-emerald-300 self-start sm:self-auto">
                        ĐÃ XUẤT BẢN CÔNG KHAI
                      </span>
                    </div>
                  ) : isArticleSubmitted ? (
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                      <div className="flex items-center gap-2 text-slate-900 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-slate-600 shrink-0" />
                        <span>✓ BẢN THẢO BÀI VIẾT ĐÃ ĐƯỢC GỬI LÊN BAN BIÊN TẬP (VÒNG {activeSub.articleDraft?.revisionRound || 1})</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-800 font-bold bg-white px-2 py-0.5 rounded border border-slate-200 self-start sm:self-auto">
                        Đang chờ BTV & AI Review
                      </span>
                    </div>
                  ) : (
                    <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                      <div className="flex items-center gap-2 text-emerald-900 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>BIÊN TẬP VIÊN ĐÃ DUYỆT BÁO CÁO KIỂM CHỨNG & PHÁT LỆNH YÊU CẦU VIẾT BÀI</span>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-700 font-bold bg-white px-2 py-0.5 rounded border border-emerald-200 self-start sm:self-auto">
                        Đã mở khóa viết bài
                      </span>
                    </div>
                  )}

                  {/* BTV Directive Note (if any) */}
                  {activeSub.editorInitialNote && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 space-y-0.5">
                      <span className="font-bold text-slate-950 block">Chỉ đạo định hướng từ Ban Biên Tập:</span>
                      <p className="italic text-slate-800">
                        "{activeSub.editorInitialNote}"
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-600" />
                      SOẠN THẢO BÀI VIẾT HIỆN TRƯỜNG
                    </h3>
                    <button
                      type="button"
                      onClick={handlePrefillDraft}
                      className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 transition"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Điền mẫu bài viết nhanh</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tiêu đề bài báo *
                    </label>
                    <input
                      type="text"
                      value={articleTitle}
                      onChange={(e) => setArticleTitle(e.target.value)}
                      placeholder="Tiêu đề bài viết phản ánh hiện trường..."
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Đoạn Sapo (Mở đầu tóm tắt) *
                    </label>
                    <input
                      type="text"
                      value={articleSapo}
                      onChange={(e) => setArticleSapo(e.target.value)}
                      placeholder="Đoạn văn mở đầu 1-2 câu nêu bật bối cảnh và diễn biến quan trọng nhất..."
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs italic text-slate-800 outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nội dung chi tiết bài viết hiện trường *
                    </label>
                    <textarea
                      rows={8}
                      value={articleContent}
                      onChange={(e) => setArticleContent(e.target.value)}
                      placeholder="Soạn thảo toàn văn bài viết theo chuẩn mực báo chí..."
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 leading-relaxed font-sans outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  {/* Summary of Evidence Attachments available for this article */}
                  {evidenceAttachments.length > 0 && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <span className="font-bold text-slate-700 block mb-1">
                        Tư liệu hình ảnh & video đã xác thực sẽ xuất bản kèm bài viết ({evidenceAttachments.length} mục):
                      </span>
                      <div className="flex items-center gap-2 overflow-x-auto py-1">
                        {evidenceAttachments.map((att) => (
                          <div key={att.id} className="flex items-center gap-1.5 px-2 py-1 rounded bg-white border border-slate-200 shrink-0 text-[11px]">
                            {att.type === 'video' ? <Video className="w-3 h-3 text-slate-600" /> : <ImageIcon className="w-3 h-3 text-slate-600" />}
                            <span className="font-mono text-slate-600 truncate max-w-[120px]">{att.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-center justify-between pt-2 border-t border-slate-100 gap-3">
                    <span className="text-[11px] text-slate-400">
                      Bản thảo sẽ được chuyển tới BTV trực ban để chạy AI Review và trình lãnh đạo duyệt xuất bản.
                    </span>
                    <button
                      type="button"
                      onClick={handleSubmitArticle}
                      className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>NỘP BÀI VIẾT CHO BAN BIÊN TẬP</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center text-slate-400">
              Chọn một nhiệm vụ bên trái để bắt đầu kiểm chứng hoặc viết bài
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
