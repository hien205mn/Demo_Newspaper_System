import React, { useState } from 'react';
import { 
  UserCheck, 
  AlertTriangle, 
  Send, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  Radio, 
  MessageSquare, 
  Eye, 
  Clock, 
  MapPin, 
  ChevronRight, 
  ShieldCheck, 
  Bot, 
  Flame, 
  ArrowRight, 
  Lock, 
  Phone, 
  Mail, 
  ShieldAlert, 
  UserX, 
  MailCheck, 
  SendHorizontal, 
  RotateCcw,
  Check,
  PhoneCall,
  Edit3,
  Camera,
  GraduationCap,
  Film,
  Video
} from 'lucide-react';
import { Submission, FieldAssignment, AIReviewResult, EditorialArticle } from '../types';
import { calculatePriority, MOCK_REPORTERS } from '../data/criteria';
import { INITIAL_EDITORIAL_ARTICLES } from '../data/initialArticles';
import { EditorArticleWorkspace } from './EditorArticleWorkspace';

export type EditorSubScreen = 
  | 'CITIZEN_SUBMISSIONS'
  | 'CTV_ARTICLES'
  | 'EXPERT_ARTICLES';

interface EditorDeskProps {
  submissions: Submission[];
  onUpdateSubmission: (updated: Submission) => void;
  onSelectSubmission: (submission: Submission) => void;
  onOpenEditProfile?: () => void;
}

export const EditorDesk: React.FC<EditorDeskProps> = ({
  submissions,
  onUpdateSubmission,
  onSelectSubmission,
  onOpenEditProfile,
}) => {
  // Screen Switcher: 3 separate screens (Tin Dân Sinh, Bài Viết CTV, Bài Chuyên Gia)
  const [activeScreen, setActiveScreen] = useState<EditorSubScreen>('CITIZEN_SUBMISSIONS');

  // Editorial Articles State (CTV, Expert)
  const [articles, setArticles] = useState<EditorialArticle[]>(() => {
    try {
      const saved = localStorage.getItem('news_portal_editorial_articles');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return INITIAL_EDITORIAL_ARTICLES;
  });

  const handleUpdateArticle = (updated: EditorialArticle) => {
    setArticles((prev) => {
      const next = prev.map((a) => (a.id === updated.id ? updated : a));
      try {
        localStorage.setItem('news_portal_editorial_articles', JSON.stringify(next));
      } catch (e) {
        console.warn(e);
      }
      return next;
    });
  };

  const ctvArticlesCount = articles.filter((a) => a.sourceType === 'CTV').length;
  const expertArticlesCount = articles.filter((a) => a.sourceType === 'EXPERT').length;

  // 4 Levels Filter - DEFAULT TO 'BREAKING'
  const [levelFilter, setLevelFilter] = useState<'BREAKING' | 'HIGH' | 'MEDIUM' | 'LOW' | 'ALL'>('BREAKING');

  // Task Category Filter (Lọc nhiệm vụ thành từng loại: Tin nóng khẩn cấp vs Khiếu nại dân sinh)
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'TIN_NONG' | 'KHIEU_NAI'>('ALL');

  const breakingCount = submissions.filter((s) => s.priority === 'BREAKING').length;
  const highCount = submissions.filter((s) => s.priority === 'HIGH').length;
  const mediumCount = submissions.filter((s) => s.priority === 'MEDIUM').length;
  const lowCount = submissions.filter((s) => s.priority === 'LOW').length;

  // Pick first BREAKING submission by default if available
  const defaultSub = submissions.find((s) => s.priority === 'BREAKING') || submissions[0];
  const [selectedSubId, setSelectedSubId] = useState<string>(defaultSub?.id || '');

  // Sub-step for current submission in Editor Desk:
  // 'VERIFY_SENDER' (Xác nhận thông tin người gửi / Báo cáo) 
  // vs 'COORDINATE_CTV' (Screen điều phối CTV với cả 2 buttons)
  // vs 'VERIFY_REPORT' (Thẩm định báo cáo kiểm chứng & tư liệu ảnh/video CTV gửi)
  // vs 'ARTICLE_STAGE' (Thẩm định bài viết hoàn thiện của CTV & AI Review)
  const [editorSubView, setEditorSubView] = useState<'VERIFY_SENDER' | 'COORDINATE_CTV' | 'VERIFY_REPORT' | 'ARTICLE_STAGE'>('VERIFY_SENDER');

  // Report User / Sanction Modal State
  const [showSanctionModal, setShowSanctionModal] = useState(false);
  const [violationType, setViolationType] = useState<string>('Gửi tin giả mạo / Bịa đặt thông tin sai sự thật (Điều 101 NĐ 15/2020/NĐ-CP)');
  const [sanctionLevel, setSanctionLevel] = useState<string>('Khóa số điện thoại & đưa vào Danh sách đen (Blacklist)');
  const [sanctionReason, setSanctionReason] = useState<string>('');

  // Coordination States
  const [selectedReporterId, setSelectedReporterId] = useState<string>(MOCK_REPORTERS[0].id);
  const [editorDirectiveNote, setEditorDirectiveNote] = useState<string>('');
  const [isSendingGmail, setIsSendingGmail] = useState(false);
  const [isDirectAssigning, setIsDirectAssigning] = useState(false);

  // Article Rejection & Revision State
  const [rejectionNote, setRejectionNote] = useState('');
  const [showRejectBox, setShowRejectBox] = useState(false);

  // AI Review loading state
  const [isAiReviewing, setIsAiReviewing] = useState(false);

  // Filter submissions by the 4 priority levels and category type
  const filteredList = submissions.filter((s) => {
    // 1. Level Filter
    if (levelFilter === 'BREAKING' && s.priority !== 'BREAKING') return false;
    if (levelFilter === 'HIGH' && s.priority !== 'HIGH') return false;
    if (levelFilter === 'MEDIUM' && s.priority !== 'MEDIUM') return false;
    if (levelFilter === 'LOW' && s.priority !== 'LOW') return false;

    // 2. Category Filter (Loại nhiệm vụ / loại tin)
    if (categoryFilter !== 'ALL') {
      const cat = s.category || 'TIN_NONG';
      if (cat !== categoryFilter) return false;
    }

    return true;
  });

  const selectedSub = filteredList.find((s) => s.id === selectedSubId) || filteredList[0] || submissions[0];

  const [actionToast, setActionToast] = useState<string>('');
  const [verifyDirectiveInput, setVerifyDirectiveInput] = useState<string>(
    'BTV đã phê duyệt hồ sơ kiểm chứng hiện trường. Đề nghị CTV khẩn trương viết bài phản ánh thực tế, nêu bật các hình ảnh và video đối chứng.'
  );

  const triggerToast = (msg: string) => {
    setActionToast(msg);
    setTimeout(() => setActionToast(''), 5000);
  };

  // Action for BTV: Duyệt Báo Cáo Kiểm Chứng & Phát Lệnh Yêu Cầu CTV Viết Bài
  const handleApproveVerificationAndRequestWriting = (customDirective?: string) => {
    if (!selectedSub) return;

    const directive = (customDirective !== undefined && customDirective.trim() !== '')
      ? customDirective.trim()
      : verifyDirectiveInput.trim() || selectedSub.editorInitialNote || 'BTV đã phê duyệt hồ sơ kiểm chứng hiện trường. Đề nghị CTV khẩn trương viết bài phản ánh thực tế, nêu bật các hình ảnh và video đối chứng.';

    const updated: Submission = {
      ...selectedSub,
      stage: 'ARTICLE_DRAFTING',
      editorInitialNote: directive,
    };

    onUpdateSubmission(updated);
    triggerToast(
      `✓ ĐÃ PHÊ DUYỆT KIỂM CHỨNG & PHÁT LỆNH YÊU CẦU VIẾT BÀI! Màn hình viết bài trên bàn CTV ${selectedSub.fieldVerification?.reporterName || 'Hiện trường'} đã được mở khóa.`
    );
  };

  // Automatically determine default view when switching submissions
  const isBreakingOrHigh = selectedSub?.priority === 'BREAKING' || selectedSub?.priority === 'HIGH';
  const hasSenderBeenConfirmed = Boolean(selectedSub?.senderConfirmedAt);
  const hasFieldAssignment = Boolean(selectedSub?.fieldAssignment);
  const hasFieldVerification = Boolean(selectedSub?.fieldVerification);
  const hasArticleDraft = Boolean(selectedSub?.articleDraft);

  // ACTION 1: BTV clicks "XÁC NHẬN" (Xác nhận thông tin từ người gửi)
  // Sau khi xác nhận thì chuyển ngay đến Screen Điều Phối CTV!
  const handleConfirmSenderInfo = () => {
    if (!selectedSub) return;

    const updated: Submission = {
      ...selectedSub,
      senderConfirmedAt: new Date().toLocaleString('sv-SE').slice(0, 16).replace('T', ' '),
      senderConfirmedBy: 'BTV Nguyễn Thu Trang (Bàn Trực Ban)',
      stage: selectedSub.stage === 'CITIZEN_SUBMITTED' ? 'EDITOR_REVIEWING' : selectedSub.stage,
      editorInitialNote: selectedSub.editorInitialNote || 'Đã kiểm tra sơ bộ nguồn tin từ người gửi, thông tin xác thực và có căn cứ.',
    };

    onUpdateSubmission(updated);
    // Chuyển sang Screen Điều Phối CTV
    setEditorSubView('COORDINATE_CTV');
    alert(`✓ ĐÃ XÁC NHẬN THÔNG TIN TỪ NGƯỜI GỬI!\nHệ thống chuyển sang màn hình Điều Phối Cộng Tác Viên tác nghiệp hiện trường.`);
  };

  // ACTION 2: BTV clicks "BÁO CÁO NGƯỜI DÙNG" -> Xử phạt
  const handleApplySanction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;

    if (!sanctionReason.trim()) {
      alert('Vui lòng nhập lý do cụ thể và căn cứ xử phạt người dùng.');
      return;
    }

    const updated: Submission = {
      ...selectedSub,
      stage: 'REJECTED',
      senderSanctionReport: {
        violationType,
        sanctionLevel,
        reason: sanctionReason,
        reportedAt: new Date().toLocaleString('sv-SE').slice(0, 16).replace('T', ' '),
        reportedBy: 'BTV Nguyễn Thu Trang (ID: BTV-01)',
      },
    };

    onUpdateSubmission(updated);
    setShowSanctionModal(false);
    setSanctionReason('');
    alert(
      `🚨 ĐÃ BÁO CÁO VÀ ÁP DỤNG HÌNH THỨC XỬ PHẠT:\n` +
      `- Hành vi: ${violationType}\n` +
      `- Mức xử phạt: ${sanctionLevel}\n` +
      `Tin phản ánh đã được chuyển sang trạng thái BÁC BỎ (REJECTED). Số điện thoại người gửi đã được đưa vào danh sách kiểm soát.`
    );
  };

  // COORDINATION BUTTON 1: "Chỉ định cụ thể 1 cộng tác viên"
  const handleAssignSpecificReporter = () => {
    if (!selectedSub) return;
    setIsDirectAssigning(true);

    const reporter = MOCK_REPORTERS.find((r) => r.id === selectedReporterId) || MOCK_REPORTERS[0];

    setTimeout(() => {
      const assignment: FieldAssignment = {
        method: 'DIRECT',
        regionTarget: selectedSub.province,
        assignedReporterId: reporter.id,
        assignedReporterName: reporter.name,
        assignedReporterEmail: reporter.email,
        assignedAt: new Date().toLocaleString('sv-SE').slice(0, 16).replace('T', ' '),
        claimedAt: new Date().toLocaleString('sv-SE').slice(0, 16).replace('T', ' '),
      };

      const updated: Submission = {
        ...selectedSub,
        fieldAssignment: assignment,
        stage: 'FIELD_ASSIGNED',
        editorInitialNote: editorDirectiveNote || `Chỉ định trực tiếp CTV ${reporter.name} (${reporter.id}) tới hiện trường vụ việc ${selectedSub.location}.`,
      };

      onUpdateSubmission(updated);
      setIsDirectAssigning(false);
      alert(
        `🎯 ĐÃ CHỈ ĐỊNH THÀNH CÔNG!\n` +
        `- Cộng tác viên: ${reporter.name} (${reporter.id})\n` +
        `- Email: ${reporter.email}\n` +
        `- Khu vực: ${reporter.region}\n` +
        `Lệnh tác nghiệp đã được gửi đến thiết bị của CTV. CTV đang tiến hành di chuyển tới hiện trường.`
      );
    }, 400);
  };

  // COORDINATION BUTTON 2: "Gửi Gmail tự động đến tất cả người trong khu vực"
  const handleSendAutomaticGmailToAllInRegion = () => {
    if (!selectedSub) return;
    setIsSendingGmail(true);

    setTimeout(() => {
      const assignment: FieldAssignment = {
        method: 'BROADCAST',
        regionTarget: selectedSub.province,
        assignedAt: new Date().toLocaleString('sv-SE').slice(0, 16).replace('T', ' '),
      };

      const updated: Submission = {
        ...selectedSub,
        fieldAssignment: assignment,
        stage: 'AWAITING_FIELD_ASSIGN',
        editorInitialNote: editorDirectiveNote || `Đã phát lệnh broadcast tự động qua Gmail cho toàn bộ CTV khu vực ${selectedSub.province}.`,
      };

      onUpdateSubmission(updated);
      setIsSendingGmail(false);
      alert(
        `✉️ ĐÃ GỬI GMAIL TỰ ĐỘNG ĐẾN TOÀN BỘ CTV KHU VỰC ${selectedSub.province.toUpperCase()}!\n\n` +
        `Tiêu đề: [BREAKING - HỎA TỐC] LỆNH TÁC NGHIỆP HIỆN TRƯỜNG: ${selectedSub.title}\n` +
        `Người nhận: toan_bo_ctv_${selectedSub.province.toLowerCase().replace(/\s+/g, '')}@baochi.vn\n\n` +
        `Hệ thống đã phát lệnh. Cộng tác viên nào vào web bấm xác nhận sớm nhất sẽ được giao nhiệm vụ tác nghiệp tại hiện trường!`
      );
    }, 500);
  };

  // For LOW/MEDIUM: Directly approve or draft by editor
  const handleEditorDirectApprove = () => {
    if (!selectedSub) return;

    const updated: Submission = {
      ...selectedSub,
      editorId: 'BTV-01',
      editorName: 'Nguyễn Thu Trang',
      stage: 'DEPUTY_PENDING',
      articleDraft: selectedSub.articleDraft || {
        title: selectedSub.title,
        sapo: selectedSub.description.slice(0, 150) + '...',
        content: selectedSub.description,
        authorName: 'Nguyễn Thu Trang (BTV)',
        authorId: 'BTV-01',
        updatedAt: new Date().toLocaleString('sv-SE').slice(0, 16).replace('T', ' '),
        revisionRound: 1,
      },
      editorInitialNote: 'Tin mức LOW/MEDIUM không cần CTV hiện trường. BTV đã hoàn tất thẩm định hồ sơ và chuyển Phó TBT duyệt.',
    };

    onUpdateSubmission(updated);
    alert('Đã chuyển hồ sơ lên Phó Tổng Biên Tập duyệt!');
  };

  // Reject article and request revision
  const handleRejectArticle = () => {
    if (!selectedSub || !rejectionNote.trim()) {
      alert('Vui lòng nhập ghi chú cụ thể phần sai sót cần CTV sửa đổi.');
      return;
    }

    const updated: Submission = {
      ...selectedSub,
      stage: 'EDITOR_REVISION_REQUESTED',
      articleDraft: selectedSub.articleDraft
        ? {
            ...selectedSub.articleDraft,
            editorFeedbackNote: rejectionNote,
            revisionRound: selectedSub.articleDraft.revisionRound + 1,
          }
        : undefined,
    };

    onUpdateSubmission(updated);
    setShowRejectBox(false);
    setRejectionNote('');
    alert('Đã từ chối bản thảo và gửi yêu cầu viết lại kèm ghi chú cho CTV!');
  };

  // Run AI Review via Gemini API
  const handleRunAiReview = async () => {
    if (!selectedSub) return;
    setIsAiReviewing(true);

    try {
      const response = await fetch('/api/ai/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submission: selectedSub,
          article: selectedSub.articleDraft,
          verification: selectedSub.fieldVerification,
        }),
      });

      const aiData = await response.json();
      const aiResult: AIReviewResult = {
        summary: aiData.summary || 'Tóm tắt vụ việc hoàn tất.',
        strengths: aiData.strengths || ['Dữ liệu hiện trường đầy đủ'],
        editorialWarnings: aiData.editorialWarnings || ['Kiểm tra bảo mật hình ảnh'],
        factualConsistencyScore: aiData.factualConsistencyScore || 95,
        legalRiskAssessment: aiData.legalRiskAssessment || 'Thấp',
        suggestedHeadline: aiData.suggestedHeadline || selectedSub.title,
        recommendation: aiData.recommendation || 'APPROVE_FOR_DEPUTY_REVIEW',
        reviewedAt: new Date().toLocaleString('sv-SE').slice(0, 16).replace('T', ' '),
      };

      const updated: Submission = {
        ...selectedSub,
        aiReview: aiResult,
        stage: 'AI_REVIEW_COMPLETED',
      };

      onUpdateSubmission(updated);
    } catch (err) {
      console.error(err);
      const fallbackAi: AIReviewResult = {
        summary: `Tóm tắt sự việc: ${selectedSub.title}. Vụ việc tại ${selectedSub.location}, quy mô ${selectedSub.priority}. Đã đối chiếu bằng chứng CTV.`,
        strengths: ['Bằng chứng hiện trường rõ ràng', 'Cấu trúc bài viết chặt chẽ'],
        editorialWarnings: ['Kiểm tra lại số liệu thiệt hại'],
        factualConsistencyScore: 92,
        legalRiskAssessment: 'Thấp - Có xác nhận tại hiện trường',
        suggestedHeadline: `[${selectedSub.priority}] ${selectedSub.title}`,
        recommendation: 'APPROVE_FOR_DEPUTY_REVIEW',
        reviewedAt: new Date().toLocaleString('sv-SE').slice(0, 16).replace('T', ' '),
      };
      const updated: Submission = {
        ...selectedSub,
        aiReview: fallbackAi,
        stage: 'AI_REVIEW_COMPLETED',
      };
      onUpdateSubmission(updated);
    } finally {
      setIsAiReviewing(false);
    }
  };

  // Forward to Deputy Editor
  const handleForwardToDeputy = () => {
    if (!selectedSub) return;
    const updated: Submission = {
      ...selectedSub,
      stage: 'DEPUTY_PENDING',
    };
    onUpdateSubmission(updated);
    alert('Đã gửi hồ sơ kèm đánh giá AI lên Phó Tổng Biên Tập thẩm định!');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {actionToast && (
        <div className="p-4 bg-emerald-600 text-white rounded-lg shadow-xl flex items-center justify-between text-xs font-bold animate-fade-in border border-emerald-400">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
            <span>{actionToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionToast('')}
            className="text-white hover:text-emerald-200 font-bold ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 3 DEDICATED SCREENS NAVIGATION */}
      <div className="bg-slate-900 text-white rounded-lg p-3 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between px-2 pb-2.5 mb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-amber-400">
              Không Gian Làm Việc Biên Tập Viên
            </span>
            <span className="text-[10px] text-slate-400">• Chọn màn hình chuyên trách</span>
          </div>
          {onOpenEditProfile && (
            <button
              type="button"
              onClick={onOpenEditProfile}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white rounded-xl text-xs font-bold border border-slate-700 hover:border-amber-400 transition cursor-pointer shadow-sm"
              title="Chỉnh sửa thông tin hồ sơ Biên tập viên"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-400" />
              <span>Sửa hồ sơ BTV</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Màn hình 1: Tin Phản Ánh Dân Sinh */}
          <button
            type="button"
            onClick={() => setActiveScreen('CITIZEN_SUBMISSIONS')}
            className={`p-3.5 rounded-lg transition-all cursor-pointer flex items-center gap-3 text-left ${
              activeScreen === 'CITIZEN_SUBMISSIONS'
                ? 'bg-red-600 text-white shadow-lg shadow-red-950/50 ring-2 ring-red-400/40'
                : 'bg-slate-800/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              activeScreen === 'CITIZEN_SUBMISSIONS' ? 'bg-red-700 text-white' : 'bg-slate-700/80 text-red-400'
            }`}>
              <Flame className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-black uppercase tracking-wide truncate">
                  1. Tin Dân Sinh
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black ${
                  activeScreen === 'CITIZEN_SUBMISSIONS' ? 'bg-red-800 text-white' : 'bg-slate-700 text-red-300'
                }`}>
                  {submissions.length}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 truncate mt-0.5">
                Tiếp nhận & điều phối
              </p>
            </div>
          </button>

          {/* Màn hình 2: Bài Viết Cộng Tác Viên */}
          <button
            type="button"
            onClick={() => setActiveScreen('CTV_ARTICLES')}
            className={`p-3.5 rounded-lg transition-all cursor-pointer flex items-center gap-3 text-left ${
              activeScreen === 'CTV_ARTICLES'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50 ring-2 ring-emerald-400/40'
                : 'bg-slate-800/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              activeScreen === 'CTV_ARTICLES' ? 'bg-emerald-700 text-white' : 'bg-slate-700/80 text-emerald-400'
            }`}>
              <Camera className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-black uppercase tracking-wide truncate">
                  2. Bài Viết CTV
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black ${
                  activeScreen === 'CTV_ARTICLES' ? 'bg-emerald-800 text-white' : 'bg-slate-700 text-emerald-300'
                }`}>
                  {ctvArticlesCount}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 truncate mt-0.5">
                Phóng sự hiện trường
              </p>
            </div>
          </button>

          {/* Màn hình 3: Bài Viết Chuyên Gia */}
          <button
            type="button"
            onClick={() => setActiveScreen('EXPERT_ARTICLES')}
            className={`p-3.5 rounded-lg transition-all cursor-pointer flex items-center gap-3 text-left ${
              activeScreen === 'EXPERT_ARTICLES'
                ? 'bg-slate-600 text-white shadow-lg shadow-slate-950/50 ring-2 ring-slate-400/40'
                : 'bg-slate-800/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              activeScreen === 'EXPERT_ARTICLES' ? 'bg-slate-700 text-white' : 'bg-slate-700/80 text-slate-400'
            }`}>
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-black uppercase tracking-wide truncate">
                  3. Bài Chuyên Gia
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black ${
                  activeScreen === 'EXPERT_ARTICLES' ? 'bg-slate-800 text-white' : 'bg-slate-700 text-slate-300'
                }`}>
                  {expertArticlesCount}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 truncate mt-0.5">
                Xã luận & phân tích sâu
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* SCREEN 2: BÀI VIẾT CỘNG TÁC VIÊN */}
      {activeScreen === 'CTV_ARTICLES' && (
        <EditorArticleWorkspace
          sourceType="CTV"
          articles={articles}
          onUpdateArticle={handleUpdateArticle}
        />
      )}

      {/* SCREEN 3: BÀI VIẾT CHUYÊN GIA & HỌC GIẢ */}
      {activeScreen === 'EXPERT_ARTICLES' && (
        <EditorArticleWorkspace
          sourceType="EXPERT"
          articles={articles}
          onUpdateArticle={handleUpdateArticle}
        />
      )}

      {/* SCREEN 1: TIẾP NHẬN TIN PHẢN ÁNH DÂN SINH & ĐIỀU PHỐI KHẨN CẤP */}
      {activeScreen === 'CITIZEN_SUBMISSIONS' && (
        <>
          {/* Header Banner */}
          <div className="bg-slate-900 text-white rounded-lg p-6 border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-600 flex items-center justify-center text-white shadow-lg">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black">BÀN BIÊN TẬP VIÊN (BTV DESK)</h1>
                <span className="px-2 py-0.5 rounded bg-slate-500/20 text-slate-300 text-[10px] font-bold border border-slate-500/30">
                  QUY TRÌNH BIÊN TẬP
                </span>
                {onOpenEditProfile && (
                  <button
                    type="button"
                    onClick={onOpenEditProfile}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white rounded-lg text-xs font-semibold border border-slate-700 hover:border-amber-400 transition cursor-pointer"
                    title="Chỉnh sửa thông tin hồ sơ Biên tập viên"
                  >
                    <Edit3 className="w-3 h-3 text-amber-400" />
                    <span>Sửa hồ sơ BTV</span>
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Xác nhận nguồn tin • Báo cáo xử phạt vi phạm • Điều phối CTV (Chỉ định / Gửi Gmail khu vực) • AI Review
              </p>
            </div>
          </div>

          {/* 4 Levels Filter in Header */}
          <div className="flex items-center gap-1.5 overflow-x-auto bg-slate-800/90 p-1.5 rounded-xl border border-slate-700">
            <span className="text-[11px] text-slate-400 font-semibold px-2 hidden sm:inline">Lọc mức độ:</span>

            <button
              onClick={() => {
                setLevelFilter('BREAKING');
                const first = submissions.find((s) => s.priority === 'BREAKING');
                if (first) setSelectedSubId(first.id);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer flex items-center gap-1.5 shadow-sm ${
                levelFilter === 'BREAKING'
                  ? 'bg-red-600 text-white ring-2 ring-red-400/50'
                  : 'text-red-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>BREAKING ({breakingCount})</span>
            </button>

            <button
              onClick={() => {
                setLevelFilter('HIGH');
                const first = submissions.find((s) => s.priority === 'HIGH');
                if (first) setSelectedSubId(first.id);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                levelFilter === 'HIGH'
                  ? 'bg-orange-600 text-white ring-2 ring-orange-400/50'
                  : 'text-orange-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <span>HIGH ({highCount})</span>
            </button>

            <button
              onClick={() => {
                setLevelFilter('MEDIUM');
                const first = submissions.find((s) => s.priority === 'MEDIUM');
                if (first) setSelectedSubId(first.id);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                levelFilter === 'MEDIUM'
                  ? 'bg-amber-600 text-white ring-2 ring-amber-400/50'
                  : 'text-amber-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <span>MEDIUM ({mediumCount})</span>
            </button>

            <button
              onClick={() => {
                setLevelFilter('LOW');
                const first = submissions.find((s) => s.priority === 'LOW');
                if (first) setSelectedSubId(first.id);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                levelFilter === 'LOW'
                  ? 'bg-slate-600 text-white ring-2 ring-slate-400/50'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <span>LOW ({lowCount})</span>
            </button>

            <button
              onClick={() => setLevelFilter('ALL')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                levelFilter === 'ALL'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tất cả ({submissions.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left List (4 cols), Right Active Workspace (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Submissions List */}
        <div className="lg:col-span-4 space-y-3">
          {/* Level Filter Bar dedicated for Danh Sách Tin Phản Ánh */}
          <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Danh sách tin phản ánh
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-red-700 font-mono">
                  {filteredList.length} tin
                </span>
              </div>
            </div>

            {/* 4 Level Tabs */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>Lọc nhanh 4 mức độ:</span>
                <button
                  type="button"
                  onClick={() => setLevelFilter('ALL')}
                  className={`text-[10px] font-semibold cursor-pointer ${
                    levelFilter === 'ALL' ? 'text-slate-600 font-bold underline' : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  Xem tất cả ({submissions.length})
                </button>
              </div>

              <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-xl">
                {/* 1. BREAKING (DEFAULT) */}
                <button
                  type="button"
                  onClick={() => {
                    setLevelFilter('BREAKING');
                    const first = submissions.find((s) => s.priority === 'BREAKING');
                    if (first) setSelectedSubId(first.id);
                  }}
                  className={`py-2 px-1 rounded-lg text-center font-extrabold text-[11px] transition cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                    levelFilter === 'BREAKING'
                      ? 'bg-red-600 text-white shadow-md shadow-red-900/30'
                      : 'text-slate-700 hover:bg-white/80 hover:text-red-600'
                  }`}
                >
                  <div className="flex items-center gap-0.5 text-[10px]">
                    <Flame className={`w-3 h-3 ${levelFilter === 'BREAKING' ? 'text-amber-300' : 'text-red-500'}`} />
                    <span>BREAKING</span>
                  </div>
                  <span className={`text-[10px] font-mono font-bold ${levelFilter === 'BREAKING' ? 'text-red-100' : 'text-slate-500'}`}>
                    {breakingCount} tin
                  </span>
                </button>

                {/* 2. HIGH */}
                <button
                  type="button"
                  onClick={() => {
                    setLevelFilter('HIGH');
                    const first = submissions.find((s) => s.priority === 'HIGH');
                    if (first) setSelectedSubId(first.id);
                  }}
                  className={`py-2 px-1 rounded-lg text-center font-extrabold text-[11px] transition cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                    levelFilter === 'HIGH'
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-900/30'
                      : 'text-slate-700 hover:bg-white/80 hover:text-orange-600'
                  }`}
                >
                  <span className="text-[10px]">HIGH</span>
                  <span className={`text-[10px] font-mono font-bold ${levelFilter === 'HIGH' ? 'text-orange-100' : 'text-slate-500'}`}>
                    {highCount} tin
                  </span>
                </button>

                {/* 3. MEDIUM */}
                <button
                  type="button"
                  onClick={() => {
                    setLevelFilter('MEDIUM');
                    const first = submissions.find((s) => s.priority === 'MEDIUM');
                    if (first) setSelectedSubId(first.id);
                  }}
                  className={`py-2 px-1 rounded-lg text-center font-extrabold text-[11px] transition cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                    levelFilter === 'MEDIUM'
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-900/30'
                      : 'text-slate-700 hover:bg-white/80 hover:text-amber-600'
                  }`}
                >
                  <span className="text-[10px]">MEDIUM</span>
                  <span className={`text-[10px] font-mono font-bold ${levelFilter === 'MEDIUM' ? 'text-amber-100' : 'text-slate-500'}`}>
                    {mediumCount} tin
                  </span>
                </button>

                {/* 4. LOW */}
                <button
                  type="button"
                  onClick={() => {
                    setLevelFilter('LOW');
                    const first = submissions.find((s) => s.priority === 'LOW');
                    if (first) setSelectedSubId(first.id);
                  }}
                  className={`py-2 px-1 rounded-lg text-center font-extrabold text-[11px] transition cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                    levelFilter === 'LOW'
                      ? 'bg-slate-600 text-white shadow-md shadow-slate-900/30'
                      : 'text-slate-700 hover:bg-white/80 hover:text-slate-600'
                  }`}
                >
                  <span className="text-[10px]">LOW</span>
                  <span className={`text-[10px] font-mono font-bold ${levelFilter === 'LOW' ? 'text-slate-100' : 'text-slate-500'}`}>
                    {lowCount} tin
                  </span>
                </button>
              </div>

              {/* Category Filter for Editor: Lọc nhiệm vụ thành từng loại */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mb-1.5">
                  <span>Lọc theo loại nhiệm vụ:</span>
                  <span className="text-[10px] text-slate-400 font-bold font-mono">
                    {filteredList.length} tin hiển thị
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    type="button"
                    onClick={() => setCategoryFilter('ALL')}
                    className={`py-1.5 px-1.5 rounded-lg text-[11px] font-bold text-center transition cursor-pointer ${
                      categoryFilter === 'ALL'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Tất cả loại
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategoryFilter('TIN_NONG')}
                    className={`py-1.5 px-1.5 rounded-lg text-[11px] font-bold text-center transition cursor-pointer truncate ${
                      categoryFilter === 'TIN_NONG'
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-red-700 hover:bg-red-50'
                    }`}
                  >
                    🚨 Tin nóng ({submissions.filter(s => (s.category || 'TIN_NONG') === 'TIN_NONG').length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategoryFilter('KHIEU_NAI')}
                    className={`py-1.5 px-1.5 rounded-lg text-[11px] font-bold text-center transition cursor-pointer truncate ${
                      categoryFilter === 'KHIEU_NAI'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-amber-800 hover:bg-amber-50'
                    }`}
                  >
                    📋 Khiếu nại ({submissions.filter(s => s.category === 'KHIEU_NAI').length})
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 max-h-[720px] overflow-y-auto pr-1">
            {filteredList.length === 0 ? (
              <div className="p-8 bg-white rounded-lg border border-slate-200 text-center text-slate-500 space-y-3">
                <p className="text-xs">Không có tin phản ánh nào phù hợp bộ lọc.</p>
                <button
                  type="button"
                  onClick={() => {
                    setLevelFilter('ALL');
                    setCategoryFilter('ALL');
                  }}
                  className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold shadow cursor-pointer"
                >
                  Đặt lại bộ lọc
                </button>
              </div>
            ) : (
              filteredList.map((sub) => {
              const isSelected = selectedSub?.id === sub.id;
              const priorityObj = calculatePriority(sub.totalScore);
              const isBreaking = sub.priority === 'BREAKING';

              return (
                <div
                  key={sub.id}
                  onClick={() => {
                    setSelectedSubId(sub.id);
                    // Reset to appropriate subview
                    if (sub.stage === 'FIELD_VERIFIED') {
                      setEditorSubView('VERIFY_REPORT');
                    } else if (!sub.senderConfirmedAt && (sub.priority === 'BREAKING' || sub.priority === 'HIGH')) {
                      setEditorSubView('VERIFY_SENDER');
                    } else if (sub.articleDraft || sub.stage === 'ARTICLE_SUBMITTED') {
                      setEditorSubView('ARTICLE_STAGE');
                    } else {
                      setEditorSubView('COORDINATE_CTV');
                    }
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-white border-slate-500 ring-2 ring-slate-500/20 shadow-md'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${priorityObj.bgLight} ${priorityObj.color} ${priorityObj.borderColor} flex items-center gap-1`}>
                        {isBreaking && <Flame className="w-3 h-3 text-red-600 animate-pulse" />}
                        <span>{sub.priority} ({sub.totalScore}đ)</span>
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                        sub.category === 'KHIEU_NAI' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {sub.category === 'KHIEU_NAI' ? 'Khiếu nại' : 'Tin nóng'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{sub.trackingCode}</span>
                  </div>

                  <h4 className="font-bold text-xs text-slate-900 line-clamp-2 leading-snug">
                    {sub.title}
                  </h4>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-1.5 border-t border-slate-100">
                    <span className="truncate max-w-[140px]">{sub.province}</span>
                    <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                      {sub.stage}
                    </span>
                  </div>
                </div>
              );
            }))}
          </div>
        </div>

        {/* RIGHT COLUMN: Active Submission Workspace */}
        <div className="lg:col-span-8">
          {selectedSub ? (
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 space-y-6">
              {/* Submission Header Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-mono text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                      {selectedSub.trackingCode}
                    </span>
                    <span className="text-xs text-slate-500">• {selectedSub.createdAt}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      Trạng thái: {selectedSub.stage}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                    {selectedSub.title}
                  </h2>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[11px] text-slate-400 font-bold uppercase">Impact Score</div>
                  <div className="text-2xl font-black text-slate-900 font-mono">
                    {selectedSub.totalScore} <span className="text-xs text-slate-500 font-normal">/ 130</span>
                  </div>
                  <span className={`inline-block px-2.5 py-0.5 text-xs font-black rounded uppercase border ${calculatePriority(selectedSub.totalScore).bgLight} ${calculatePriority(selectedSub.totalScore).color} ${calculatePriority(selectedSub.totalScore).borderColor}`}>
                    {selectedSub.priority}
                  </span>
                </div>
              </div>

              {/* SPECIAL BANNER FOR BREAKING NEWS */}
              {selectedSub.priority === 'BREAKING' && (
                <div className="p-4 bg-gradient-to-r from-red-600 to-amber-600 rounded-xl text-white shadow-md flex items-start gap-3 animate-fade-in">
                  <Flame className="w-6 h-6 text-amber-300 shrink-0 mt-0.5 animate-bounce" />
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-wide flex items-center gap-2">
                      <span>VỤ VIỆC ĐẠT CẤP ĐỘ BREAKING KHẨN CẤP ({selectedSub.totalScore}/130 ĐIỂM)</span>
                    </h3>
                    <p className="text-xs text-red-100 mt-1 leading-relaxed">
                      Quy trình xử lý BTV: Xem thông tin người gửi (hoặc ẩn danh), bấm <strong>"Xác nhận"</strong> hoặc <strong>"Báo cáo người dùng"</strong>. Sau khi xác nhận ➔ Chuyển ngay đến <strong>Điều phối CTV</strong> với 2 tùy chọn: <em>Chỉ định cụ thể 1 CTV</em> HOẶC <em>Gửi Gmail tự động đến tất cả CTV trong khu vực</em>.
                    </p>
                  </div>
                </div>
              )}

              {/* REJECTED / SANCTION BANNER IF THIS USER WAS SANCTIONED */}
              {selectedSub.senderSanctionReport && (
                <div className="p-4 bg-red-50 rounded-xl border-2 border-red-300 text-xs space-y-2">
                  <div className="font-bold text-red-800 flex items-center gap-2 text-sm">
                    <ShieldAlert className="w-5 h-5 text-red-600" />
                    <span>HỒ SƠ BỊ BÁC BỎ VÀ ĐÃ ÁP DỤNG BIỆN PHÁP XỬ PHẠT NGƯỜI GỬI</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-red-200 text-slate-800 space-y-1">
                    <div><strong>Hành vi vi phạm:</strong> {selectedSub.senderSanctionReport.violationType}</div>
                    <div><strong>Hình thức xử phạt:</strong> <span className="font-bold text-red-700">{selectedSub.senderSanctionReport.sanctionLevel}</span></div>
                    <div><strong>Căn cứ / Ghi chú BTV:</strong> {selectedSub.senderSanctionReport.reason}</div>
                    <div className="text-slate-500 text-[11px] pt-1">Người lập biên bản: {selectedSub.senderSanctionReport.reportedBy} • Lúc {selectedSub.senderSanctionReport.reportedAt}</div>
                  </div>
                </div>
              )}

              {/* URGENT BANNER: CTV SUBMITTED VERIFICATION WITH PHOTOS/VIDEOS -> WAITING FOR BTV APPROVAL */}
              {selectedSub.stage === 'FIELD_VERIFIED' && (
                <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border-2 border-emerald-400 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md animate-fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow">
                      <Film className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black uppercase text-emerald-950">
                          CTV ĐÃ NỘP BÁO CÁO KIỂM CHỨNG & TƯ LIỆU ẢNH/VIDEO HIỆN TRƯỜNG
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900 border border-amber-300 animate-pulse">
                          ĐANG CHỜ BTV DUYỆT & PHÁT LỆNH VIẾT
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
                        CTV <strong>{selectedSub.fieldVerification?.reporterName || 'Hiện trường'}</strong> đã gửi <strong>{selectedSub.fieldVerification?.evidenceAttachments?.length || 0} tư liệu đối chứng</strong>. CTV đang bị khóa màn hình viết bài và cần lệnh của BTV để mở khóa.
                      </p>
                    </div>
                  </div>
                  {editorSubView !== 'VERIFY_REPORT' && (
                    <button
                      type="button"
                      onClick={() => setEditorSubView('VERIFY_REPORT')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <span>Xem tư liệu & Phát lệnh viết ngay →</span>
                    </button>
                  )}
                </div>
              )}

              {/* NAVIGATION WORKFLOW TABS FOR BTV */}
              <div className="flex border-b border-slate-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setEditorSubView('VERIFY_SENDER')}
                  className={`pb-3 px-4 border-b-2 transition flex items-center gap-2 cursor-pointer ${
                    editorSubView === 'VERIFY_SENDER'
                      ? 'border-slate-600 text-slate-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[10px]">1</span>
                  <span>Xem Người Gửi, Xác Nhận & Báo Cáo</span>
                  {selectedSub.senderConfirmedAt && (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                </button>

                {(isBreakingOrHigh || selectedSub.senderConfirmedAt) && (
                  <button
                    type="button"
                    onClick={() => setEditorSubView('COORDINATE_CTV')}
                    className={`pb-3 px-4 border-b-2 transition flex items-center gap-2 cursor-pointer ${
                      editorSubView === 'COORDINATE_CTV'
                        ? 'border-slate-600 text-slate-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[10px]">2</span>
                    <span>Screen Điều Phối CTV (2 Nút Lựa Chọn)</span>
                    {selectedSub.fieldAssignment && (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                  </button>
                )}

                {(hasFieldVerification || selectedSub.stage === 'FIELD_VERIFIED' || selectedSub.stage === 'ARTICLE_DRAFTING') && (
                  <button
                    type="button"
                    onClick={() => setEditorSubView('VERIFY_REPORT')}
                    className={`pb-3 px-4 border-b-2 transition flex items-center gap-2 cursor-pointer ${
                      editorSubView === 'VERIFY_REPORT'
                        ? 'border-emerald-600 text-emerald-700 font-bold'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px]">3</span>
                    <span>Báo Cáo Kiểm Chứng & Tư Liệu CTV</span>
                    {selectedSub.stage === 'FIELD_VERIFIED' ? (
                      <span className="px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 border border-amber-300 text-[9px] font-black uppercase animate-pulse">
                        Cần duyệt & giao viết
                      </span>
                    ) : selectedSub.stage === 'ARTICLE_DRAFTING' || selectedSub.articleDraft ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    )}
                  </button>
                )}

                {selectedSub.articleDraft && (
                  <button
                    type="button"
                    onClick={() => setEditorSubView('ARTICLE_STAGE')}
                    className={`pb-3 px-4 border-b-2 transition flex items-center gap-2 cursor-pointer ${
                      editorSubView === 'ARTICLE_STAGE'
                        ? 'border-slate-600 text-slate-600 font-bold'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[10px]">4</span>
                    <span>Thẩm Định Bài Viết CTV & AI Review</span>
                  </button>
                )}
              </div>

              {/* ========================================================================= */}
              {/* STEP 1: XEM THÔNG TIN NGƯỜI GỬI, BUTTON XÁC NHẬN, BUTTON BÁO CÁO        */}
              {/* ========================================================================= */}
              {editorSubView === 'VERIFY_SENDER' && (
                <div className="space-y-5 animate-fade-in">
                  <div className="p-5 rounded-lg bg-slate-50 border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-slate-600" />
                        <h3 className="font-bold text-slate-900 text-sm uppercase">
                          THÔNG TIN NGƯỜI BÁO TIN & THẨM ĐỊNH BAN ĐẦU
                        </h3>
                      </div>

                      {selectedSub.senderConfirmedAt ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Đã xác nhận ({selectedSub.senderConfirmedAt})
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          Chờ BTV thẩm định nguồn tin
                        </span>
                      )}
                    </div>

                    {/* SENDER IDENTITY CARD */}
                    {selectedSub.isAnonymous ? (
                      /* Anonymous Sender */
                      <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-300 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                            <Lock className="w-4 h-4 text-amber-600" />
                            <span>NGƯỜI BÁO TIN ẨN DANH (DANH TÍNH ĐƯỢC BẢO MẬT THEO LUẬT BÁO CHÍ)</span>
                          </div>
                          <span className="text-[11px] font-bold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded">
                            Chế độ Ẩn Danh
                          </span>
                        </div>

                        <p className="text-xs text-amber-900 leading-relaxed">
                          Người dân đã tick chọn <em>"Bảo mật danh tính"</em> khi gửi tin nóng. Tên thật đã được mã hóa trong cơ sở dữ liệu.
                          Nếu vụ việc nghiêm trọng cấp <strong>BREAKING</strong>, Tổng Biên Tập có thẩm quyền nhập mã OTP để giải mật danh tính phục vụ cơ quan an ninh.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-800">
                          <div className="p-2.5 bg-white rounded-lg border border-amber-200 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-slate-500 block">Số điện thoại liên hệ xác thực:</span>
                              <strong className="font-mono text-sm text-slate-900">{selectedSub.citizenPhone}</strong>
                            </div>
                            <button
                              type="button"
                              onClick={() => alert(`Đang kết nối cuộc gọi xác thực với người báo tin: ${selectedSub.citizenPhone}...`)}
                              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <PhoneCall className="w-3 h-3" />
                              <span>Gọi xác minh</span>
                            </button>
                          </div>

                          <div className="p-2.5 bg-white rounded-lg border border-amber-200">
                            <span className="text-[10px] text-slate-500 block">Email thông báo:</span>
                            <span className="font-mono text-xs text-slate-700">
                              {selectedSub.citizenEmail || 'Không cung cấp email'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Identified Sender */
                      <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 space-y-2 text-xs">
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-slate-600" />
                          <span>NGƯỜI BÁO TIN CÔNG KHAI DANH TÍNH</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                          <div className="p-2.5 bg-white rounded-lg border border-slate-100">
                            <span className="text-[10px] text-slate-400 block font-bold">Họ và tên:</span>
                            <strong className="text-slate-900 text-sm">{selectedSub.citizenName || 'Lê Văn Bảy'}</strong>
                          </div>
                          <div className="p-2.5 bg-white rounded-lg border border-slate-100">
                            <span className="text-[10px] text-slate-400 block font-bold">Số điện thoại:</span>
                            <strong className="font-mono text-slate-900 text-sm">{selectedSub.citizenPhone}</strong>
                          </div>
                          <div className="p-2.5 bg-white rounded-lg border border-slate-100">
                            <span className="text-[10px] text-slate-400 block font-bold">Email:</span>
                            <span className="text-slate-700 text-xs">{selectedSub.citizenEmail || 'Chưa cung cấp'}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* INCIDENT DETAILS & MEDIA ATTACHMENTS */}
                    <div className="space-y-3 pt-2">
                      <div className="text-xs text-slate-700 bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                        <div className="font-bold text-slate-900">Nội dung báo cáo sơ bộ:</div>
                        <p className="leading-relaxed text-slate-700">{selectedSub.description}</p>
                        <div className="pt-2 flex flex-wrap gap-4 text-slate-500 text-[11px] border-t border-slate-100">
                          <div>📍 <strong>Địa điểm:</strong> {selectedSub.location}</div>
                          <div>🧭 <strong>Tọa độ GPS:</strong> {selectedSub.gpsCoordinates || 'Chưa có'}</div>
                          <div>⏰ <strong>Thời gian sự việc:</strong> {selectedSub.incidentTime}</div>
                        </div>
                      </div>

                      {/* Attachments */}
                      {selectedSub.attachments && selectedSub.attachments.length > 0 && (
                        <div>
                          <div className="text-xs font-bold text-slate-700 mb-1.5">
                            Hình ảnh/video hiện trường do người dân gửi:
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {selectedSub.attachments.map((att) => (
                              <div key={att.id} className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                                <img src={att.url} alt={att.name} className="h-20 w-full object-cover" />
                                <div className="p-1 text-[10px] text-slate-600 truncate bg-white font-medium">
                                  {att.caption || att.name}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* TWO PRIMARY BUTTONS AS EXPLICITLY REQUESTED:
                        1. BUTTON "Báo cáo người dùng"
                        2. BUTTON "Xác nhận" -> Chuyển sang Screen Điều Phối CTV
                    */}
                    <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                      {/* BUTTON BÁO CÁO NGƯỜI DÙNG */}
                      <button
                        type="button"
                        onClick={() => setShowSanctionModal(true)}
                        className="w-full sm:w-auto px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <UserX className="w-4 h-4 text-red-600" />
                        <span>Báo cáo người dùng</span>
                      </button>

                      {/* BUTTON XÁC NHẬN */}
                      <button
                        type="button"
                        onClick={handleConfirmSenderInfo}
                        className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-black tracking-wide shadow-md transition flex items-center justify-center gap-2 cursor-pointer transform active:scale-95"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                        <span>Xác nhận</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* STEP 2: SCREEN ĐIỀU PHỐI CTV VỚI CẢ 2 BUTTON XUẤT HIỆN SONG SONG         */}
              {/* Button 1: "Chỉ định cụ thể 1 cộng tác viên"                                */}
              {/* Button 2: "Gửi Gmail tự động đến tất cả CTV trong khu vực"                 */}
              {/* ========================================================================= */}
              {editorSubView === 'COORDINATE_CTV' && (
                <div className="space-y-6 animate-fade-in">
                  {/* Confirmed banner */}
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
                    <div className="flex items-center gap-2 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>ĐÃ XÁC NHẬN THÔNG TIN TỪ NGƯỜI GỬI HỢP LỆ (BTV Nguyễn Thu Trang)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditorSubView('VERIFY_SENDER')}
                      className="text-[11px] text-emerald-700 hover:underline font-semibold cursor-pointer"
                    >
                      ← Xem lại thông tin người gửi
                    </button>
                  </div>

                  {/* MAIN COORDINATION SCREEN */}
                  <div className="p-6 rounded-lg bg-white border-2 border-slate-500/40 shadow-lg space-y-6">
                    <div className="border-b border-slate-200 pb-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-slate-600" />
                          <h3 className="text-base font-black text-slate-900 uppercase">
                            MÀN HÌNH ĐIỀU PHỐI CỘNG TÁC VIÊN (CTV) TÁC NGHIỆP HIỆN TRƯỜNG
                          </h3>
                        </div>
                        <span className="px-2.5 py-0.5 rounded text-xs font-extrabold uppercase bg-red-100 text-red-700 border border-red-300">
                          {selectedSub.priority} ({selectedSub.totalScore}đ)
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Khu vực tác nghiệp: <strong>{selectedSub.province}</strong> ({selectedSub.district}). Lựa chọn 1 trong 2 hình thức điều phối dưới đây:
                      </p>
                    </div>

                    {/* Ghi chú chỉ đạo tác nghiệp của BTV */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Yêu cầu / Ghi chú chỉ đạo của BTV gửi CTV tác nghiệp:
                      </label>
                      <input
                        type="text"
                        value={editorDirectiveNote}
                        onChange={(e) => setEditorDirectiveNote(e.target.value)}
                        placeholder="Ví dụ: Có mặt tại hiện trường trước 07h30, phỏng vấn nhân chứng và ghi hình góc quay toàn cảnh..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500"
                      />
                    </div>

                    {/* CẢ 2 BUTTON / KHỐI ĐIỀU PHỐI XUẤT HIỆN RÕ RÀNG */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                      {/* KHỐI 1: CHỈ ĐỊNH CỤ THỂ 1 CỘNG TÁC VIÊN */}
                      <div className="p-5 bg-slate-50/60 rounded-lg border-2 border-slate-200 hover:border-slate-400 transition space-y-4 flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
                            <div className="w-7 h-7 rounded-lg bg-slate-600 text-white flex items-center justify-center font-bold text-xs">
                              1
                            </div>
                            <span>CHỈ ĐỊNH CỤ THỂ 1 CỘNG TÁC VIÊN</span>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            BTV chủ động chọn đích danh 1 CTV từ danh sách nhân sự tòa soạn hoặc nhập Mã CTV để giao trực tiếp nhiệm vụ này.
                          </p>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Chọn CTV từ danh sách:
                            </label>
                            <select
                              value={selectedReporterId}
                              onChange={(e) => setSelectedReporterId(e.target.value)}
                              className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 font-medium"
                            >
                              {MOCK_REPORTERS.map((r) => (
                                <option key={r.id} value={r.id}>
                                  {r.id} - {r.name} ({r.region} • {r.status})
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Selected reporter card */}
                          {(() => {
                            const rep = MOCK_REPORTERS.find((r) => r.id === selectedReporterId);
                            if (!rep) return null;
                            return (
                              <div className="p-2.5 bg-white rounded-lg border border-slate-100 flex items-center gap-3 text-xs">
                                <img src={rep.avatar} alt={rep.name} className="w-10 h-10 rounded-full object-cover border" />
                                <div>
                                  <div className="font-bold text-slate-900">{rep.name} ({rep.id})</div>
                                  <div className="text-[11px] text-slate-500">Khu vực: {rep.region} • ĐT: {rep.phone}</div>
                                  <div className="text-[10px] text-emerald-700 font-medium">● {rep.status}</div>
                                </div>
                              </div>
                            );
                          })()}
                        </div>

                        {/* BUTTON 1 */}
                        <button
                          type="button"
                          disabled={isDirectAssigning}
                          onClick={handleAssignSpecificReporter}
                          className="w-full py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-xl text-xs font-black shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          <UserCheck className="w-4 h-4" />
                          <span>
                            {isDirectAssigning
                              ? 'Đang phát lệnh chỉ định...'
                              : '🎯 CHỈ ĐỊNH CỤ THỂ 1 CỘNG TÁC VIÊN NÀY'}
                          </span>
                        </button>
                      </div>

                      {/* KHỐI 2: GỬI GMAIL TỰ ĐỘNG ĐẾN TẤT CẢ CTV TRONG KHU VỰC */}
                      <div className="p-5 bg-gradient-to-br from-amber-50 to-red-50 rounded-lg border-2 border-red-200 hover:border-red-400 transition space-y-4 flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-red-900 font-black text-sm">
                            <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-xs">
                              2
                            </div>
                            <span>GỬI GMAIL TỰ ĐỘNG ĐẾN TẤT CẢ CTV KHU VỰC</span>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            Hệ thống tự động phát email broadcast khẩn tới toàn bộ CTV phụ trách <strong>{selectedSub.province}</strong>. Ai vào web bấm xác nhận sớm nhất sẽ được giao việc.
                          </p>

                          {/* Email Preview Box */}
                          <div className="p-3 bg-white rounded-xl border border-red-200 text-xs space-y-1.5 shadow-inner">
                            <div className="flex items-center justify-between text-[11px] pb-1 border-b border-slate-100">
                              <span className="text-slate-500 font-medium">Gửi tới:</span>
                              <span className="font-mono text-red-700 font-bold">
                                toan_bo_ctv_{selectedSub.province.toLowerCase().replace(/\s+/g, '')}@baochi.vn
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-700">
                              <strong>Tiêu đề:</strong> [BREAKING - HỎA TỐC] LỆNH TÁC NGHIỆP: {selectedSub.title.slice(0, 40)}...
                            </div>
                            <div className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
                              Hiện trường: {selectedSub.location}. Yêu cầu CTV trong bán kính 15km xác nhận tác nghiệp.
                            </div>
                          </div>
                        </div>

                        {/* BUTTON 2 */}
                        <button
                          type="button"
                          disabled={isSendingGmail}
                          onClick={handleSendAutomaticGmailToAllInRegion}
                          className="w-full py-3 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white rounded-xl text-xs font-black shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          <MailCheck className="w-4 h-4 text-amber-200" />
                          <span>
                            {isSendingGmail
                              ? 'Đang gửi Gmail tự động...'
                              : '✉️ GỬI GMAIL TỰ ĐỘNG ĐẾN TẤT CẢ CTV KHU VỰC'}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Current Assignment Status (If already assigned) */}
                    {selectedSub.fieldAssignment && (
                      <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-300 text-xs text-emerald-900 space-y-1">
                        <div className="font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>TRẠNG THÁI ĐIỀU PHỐI HIỆN TẠI:</span>
                        </div>
                        <div>
                          Phương thức: <strong>{selectedSub.fieldAssignment.method === 'DIRECT' ? 'Chỉ định trực tiếp' : 'Broadcast Gmail khu vực'}</strong>
                        </div>
                        {selectedSub.fieldAssignment.assignedReporterName && (
                          <div>
                            CTV đảm nhiệm: <strong>{selectedSub.fieldAssignment.assignedReporterName} ({selectedSub.fieldAssignment.assignedReporterId})</strong>
                          </div>
                        )}
                        <div className="text-slate-500 text-[11px]">
                          Thời điểm phát lệnh: {selectedSub.fieldAssignment.assignedAt}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* STEP 3: THẨM ĐỊNH BÁO CÁO KIỂM CHỨNG & TƯ LIỆU CTV (ẢNH & VIDEO)         */}
              {/* BTV KIỂM TRA HÌNH ẢNH, VIDEO VÀ BẤM PHÁT LỆNH YÊU CẦU CTV VIẾT BÀI         */}
              {/* ========================================================================= */}
              {editorSubView === 'VERIFY_REPORT' && selectedSub.fieldVerification && (
                <div className="space-y-5 animate-fade-in">
                  <div className="p-6 rounded-lg bg-white border-2 border-emerald-500/40 shadow-lg space-y-5">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                          <Camera className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-black text-slate-900 uppercase">
                            BÁO CÁO KIỂM CHỨNG HIỆN TRƯỜNG TỪ CỘNG TÁC VIÊN
                          </h3>
                          <p className="text-xs text-slate-500">
                            CTV thực địa: <strong>{selectedSub.fieldVerification.reporterName} ({selectedSub.fieldVerification.reporterId})</strong> • Tọa độ: {selectedSub.fieldVerification.locationGps || selectedSub.location}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                          selectedSub.fieldVerification.status === 'CONFIRMED_TRUE'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : selectedSub.fieldVerification.status === 'EXAGGERATED'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-red-100 text-red-800 border-red-300'
                        }`}>
                          {selectedSub.fieldVerification.status === 'CONFIRMED_TRUE'
                            ? '✓ Xác thực đúng 100%'
                            : selectedSub.fieldVerification.status === 'EXAGGERATED'
                            ? '⚠ Phóng đại một phần'
                            : '✕ Tin giả / Bịa đặt'}
                        </span>
                      </div>
                    </div>

                    {/* Stats & Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Thời điểm xác thực:</span>
                        <strong className="text-slate-800 font-mono">{selectedSub.fieldVerification.verifiedAt}</strong>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Số nhân chứng phỏng vấn:</span>
                        <strong className="text-slate-700 text-sm">{selectedSub.fieldVerification.witnessCount ?? 0} người</strong>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Số lượng tư liệu gửi kèm:</span>
                        <strong className="text-slate-700 text-sm">
                          {selectedSub.fieldVerification.evidenceAttachments?.length || 0} mục (Ảnh & Video)
                        </strong>
                      </div>
                    </div>

                    {/* CTV Detailed Report */}
                    <div>
                      <span className="text-xs font-bold text-slate-700 block mb-1">
                        Báo cáo chi tiết hiện trường của CTV:
                      </span>
                      <p className="text-xs text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200 whitespace-pre-line font-medium">
                        {selectedSub.fieldVerification.findingSummary}
                      </p>
                    </div>

                    {/* GALLERY HÌNH ẢNH VÀ VIDEO DO CTV GỬI LÊN */}
                    {selectedSub.fieldVerification.evidenceAttachments && selectedSub.fieldVerification.evidenceAttachments.length > 0 && (
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center gap-2">
                          <Film className="w-4 h-4 text-slate-600" />
                          <span className="text-xs font-black text-slate-900 uppercase">
                            Hồ Sơ Hình Ảnh & Video Hiện Trường ({selectedSub.fieldVerification.evidenceAttachments.length})
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          {selectedSub.fieldVerification.evidenceAttachments.map((att) => (
                            <div
                              key={att.id}
                              className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50 shadow-sm flex flex-col justify-between"
                            >
                              <div className="relative bg-black flex items-center justify-center h-44 overflow-hidden">
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
                                <span className={`absolute top-2 left-2 px-2.5 py-0.5 rounded text-[10px] font-black uppercase text-white shadow ${
                                  att.type === 'video' ? 'bg-slate-600' : 'bg-slate-600'
                                }`}>
                                  {att.type === 'video' ? '🎥 Video hiện trường' : '📸 Ảnh đối chứng'}
                                </span>
                              </div>
                              <div className="p-3 text-xs bg-white space-y-1">
                                <div className="font-semibold text-slate-800">
                                  {att.caption || att.name}
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">
                                  {att.name}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* BTV ACTION: PHÁT LỆNH YÊU CẦU CTV VIẾT BÀI */}
                    <div className="pt-4 border-t border-slate-200 space-y-3">
                      {selectedSub.stage === 'FIELD_VERIFIED' ? (
                        <div className="p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 rounded-lg border-2 border-emerald-300 space-y-4">
                          <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            <span>XÁC NHẬN BÁO CÁO HỢP LỆ & PHÁT LỆNH YÊU CẦU CTV VIẾT BÀI</span>
                          </div>

                          <p className="text-xs text-emerald-900 leading-relaxed">
                            Báo cáo kiểm chứng và các hình ảnh/video của CTV đã được xác thực đạt yêu cầu. Bạn có thể bổ sung chỉ đạo định hướng bài viết dưới đây. Sau khi bấm, <strong>screen soạn thảo bài viết trên bàn CTV sẽ được mở khóa ngay lập tức</strong>.
                          </p>

                          <div>
                            <label className="block text-xs font-bold text-emerald-950 mb-1">
                              Chỉ đạo định hướng bài viết gửi CTV (tùy chỉnh):
                            </label>
                            <textarea
                              rows={2}
                              value={verifyDirectiveInput}
                              onChange={(e) => setVerifyDirectiveInput(e.target.value)}
                              placeholder="Nhập định hướng bài viết gửi CTV..."
                              className="w-full p-2.5 bg-white border border-emerald-300 rounded-xl text-xs text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
                            />
                          </div>

                          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                            <span className="text-[11px] text-slate-500 italic">
                              * CTV sẽ nhận được thông báo chỉ đạo và bắt đầu soạn thảo bài viết.
                            </span>
                            <button
                              type="button"
                              onClick={() => handleApproveVerificationAndRequestWriting(verifyDirectiveInput)}
                              className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-950/20 transition flex items-center justify-center gap-2 cursor-pointer transform active:scale-95"
                            >
                              <Send className="w-4 h-4 text-emerald-200" />
                              <span>✓ PHÊ DUYỆT KIỂM CHỨNG & YÊU CẦU CTV VIẾT BÀI</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-emerald-900 gap-2">
                          <div className="flex items-center gap-2 font-bold">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>BTV ĐÃ PHÁT LỆNH YÊU CẦU VIẾT BÀI TỚI CTV ({selectedSub.stage})</span>
                          </div>
                          {selectedSub.articleDraft ? (
                            <button
                              type="button"
                              onClick={() => setEditorSubView('ARTICLE_STAGE')}
                              className="px-3 py-1.5 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <span>Xem bản thảo CTV nộp →</span>
                            </button>
                          ) : (
                            <span className="text-slate-500 font-mono text-[11px]">
                              Đang chờ CTV nộp bài...
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* STEP 4: ARTICLE DRAFT REVIEW, REJECTION & AI REVIEW                      */}
              {/* ========================================================================= */}
              {editorSubView === 'ARTICLE_STAGE' && selectedSub.articleDraft && (
                <div className="space-y-4 animate-fade-in">
                  <div className="p-5 bg-slate-50 rounded-xl border border-slate-300 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                        <FileText className="w-4 h-4 text-slate-600" />
                        <span>KIỂM TRA BÀI VIẾT TỪ HIỆN TRƯỜNG (BẢN THẢO VÒNG {selectedSub.articleDraft.revisionRound})</span>
                      </div>
                      <span className="text-xs text-slate-700 font-semibold bg-slate-50 px-2.5 py-0.5 rounded border border-slate-200">
                        Tác giả: {selectedSub.articleDraft.authorName}
                      </span>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                      <h3 className="font-bold text-sm text-slate-900">
                        {selectedSub.articleDraft.title}
                      </h3>
                      <p className="text-xs text-slate-700 italic border-l-2 border-slate-300 pl-3">
                        {selectedSub.articleDraft.sapo}
                      </p>
                      <div className="text-xs text-slate-600 whitespace-pre-line pt-2 border-t border-slate-100">
                        {selectedSub.articleDraft.content}
                      </div>
                    </div>

                    {/* AI Review Result */}
                    {selectedSub.aiReview && (
                      <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                            <Bot className="w-4 h-4 text-slate-600" />
                            <span>KẾT QUẢ AI REVIEW & TÓM TẮT NỘI DUNG (GEMINI FLASH)</span>
                          </div>
                          <span className="text-[11px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                            Độ khớp sự thật: {selectedSub.aiReview.factualConsistencyScore}%
                          </span>
                        </div>

                        <p className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-100">
                          <strong>Tóm tắt vụ việc:</strong> {selectedSub.aiReview.summary}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                          <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                            <strong className="text-emerald-700 block mb-1">✓ Điểm mạnh bài viết:</strong>
                            <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                              {selectedSub.aiReview.strengths.map((s, i) => (
                                <li key={i}>{s}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                            <strong className="text-amber-700 block mb-1">⚠ Cảnh báo biên tập & Pháp lý:</strong>
                            <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                              {selectedSub.aiReview.editorialWarnings.map((w, i) => (
                                <li key={i}>{w}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions: Reject or Run AI & Approve */}
                    <div className="pt-2 flex items-center justify-between flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setShowRejectBox(!showRejectBox)}
                        className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg text-xs font-bold transition cursor-pointer"
                      >
                        ✕ Không Đạt: Yêu cầu CTV viết lại (Có note)
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleRunAiReview}
                          disabled={isAiReviewing}
                          className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>{isAiReviewing ? 'AI Đang Phân Tích...' : 'Chạy AI Review & Tóm Tắt'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleForwardToDeputy}
                          className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <span>Gửi Trình Phó Tổng Biên Tập</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Rejection Note Box */}
                    {showRejectBox && (
                      <div className="p-4 bg-red-50 rounded-xl border border-red-200 space-y-2 animate-fade-in">
                        <label className="block text-xs font-bold text-red-900">
                          Ghi chú phần nào sai sót để CTV sửa lại:
                        </label>
                        <textarea
                          rows={3}
                          value={rejectionNote}
                          onChange={(e) => setRejectionNote(e.target.value)}
                          placeholder="Ghi chú cụ thể: Cần bổ sung lời khai của nhân chứng tại ngã tư; số liệu xe máy ngập chưa rõ ràng; chỉnh sửa lại tiêu đề tránh giật gân..."
                          className="w-full p-2.5 bg-white border border-red-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setShowRejectBox(false)}
                            className="px-3 py-1.5 text-xs text-slate-600 font-medium"
                          >
                            Hủy
                          </button>
                          <button
                            type="button"
                            onClick={handleRejectArticle}
                            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition cursor-pointer"
                          >
                            Xác nhận gửi trả bài
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center text-slate-400">
              Chọn một tin phản ánh bên trái để xử lý
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: BÁO CÁO NGƯỜI DÙNG & CHỌN LOẠI HÀNH VI ĐỂ XỬ PHẠT                  */}
      {/* ========================================================================= */}
      {showSanctionModal && selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-lg max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-red-600">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="font-black text-base text-slate-900">
                  BÁO CÁO NGƯỜI DÙNG & QUYẾT ĐỊNH XỬ PHẠT
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSanctionModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApplySanction} className="space-y-4 text-xs">
              <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-slate-700 space-y-1">
                <div><strong>Hồ sơ phản ánh:</strong> {selectedSub.title}</div>
                <div>
                  <strong>Đối tượng:</strong> {selectedSub.isAnonymous ? 'Người gửi ẩn danh' : selectedSub.citizenName} (SĐT: {selectedSub.citizenPhone})
                </div>
              </div>

              {/* 1. CHỌN LOẠI HÀNH VI VI PHẠM */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  1. Chọn loại hành vi vi phạm *
                </label>
                <div className="space-y-2">
                  {[
                    'Gửi tin giả mạo / Bịa đặt thông tin sai sự thật (Điều 101 NĐ 15/2020/NĐ-CP)',
                    'Spam / Quấy rối đường dây nóng khẩn cấp của Tòa soạn',
                    'Lợi dụng tình trạng khẩn cấp / thiên tai để trục lợi, gây hoang mang dư luận',
                    'Vu khống, bôi nhọ uy tín của tổ chức hoặc cá nhân khác',
                    'Dàn dựng, cắt ghép hình ảnh / video hiện trường giả mạo'
                  ].map((act) => (
                    <label
                      key={act}
                      className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition ${
                        violationType === act
                          ? 'bg-red-50/80 border-red-500 font-bold text-red-950 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="violationType"
                        checked={violationType === act}
                        onChange={() => setViolationType(act)}
                        className="w-4 h-4 text-red-600 mt-0.5"
                      />
                      <span className="text-xs leading-snug">{act}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 2. CHỌN HÌNH THỨC / MỨC ĐỘ XỬ PHẠT */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  2. Chọn mức độ / hình thức xử phạt *
                </label>
                <div className="space-y-2">
                  {[
                    'Cảnh cáo & gửi tin nhắn SMS / Email nhắc nhở vi phạm',
                    'Khóa số điện thoại & đưa vào Danh sách đen (Blacklist - Chặn gửi tin vĩnh viễn)',
                    'Chuyển hồ sơ sang Cơ quan An ninh / Thanh tra Sở TT&TT xử phạt hành chính (Phạt 10 - 20 triệu VNĐ)'
                  ].map((level) => (
                    <label
                      key={level}
                      className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition ${
                        sanctionLevel === level
                          ? 'bg-amber-50/80 border-amber-500 font-bold text-amber-950 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="sanctionLevel"
                        checked={sanctionLevel === level}
                        onChange={() => setSanctionLevel(level)}
                        className="w-4 h-4 text-amber-600 mt-0.5"
                      />
                      <span className="text-xs leading-snug">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 3. LÝ DO / CĂN CỨ CHI TIẾT */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  3. Ghi rõ căn cứ / Lý do lập biên bản báo cáo *
                </label>
                <textarea
                  rows={3}
                  value={sanctionReason}
                  onChange={(e) => setSanctionReason(e.target.value)}
                  placeholder="Ghi rõ lý do phát hiện vi phạm: Gọi điện thoại xác minh số máy thuê bao không đúng, kiểm tra ảnh chụp là ảnh cũ lấy trên mạng, hoặc có dấu hiệu dàn dựng quấy rối..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowSanctionModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow transition"
                >
                  Xác Nhận Xử Phạt & Bác Bỏ Tin Nóng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};
