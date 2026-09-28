import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  ArrowUpRight, 
  ShieldAlert, 
  Lock, 
  KeyRound, 
  Eye, 
  FileText, 
  Sparkles, 
  Flame, 
  AlertTriangle,
  Globe,
  Share2,
  Edit3
} from 'lucide-react';
import { Submission, Role } from '../types';
import { calculatePriority } from '../data/criteria';

interface LeadershipDeskProps {
  currentRole: 'DEPUTY_EIC' | 'EIC';
  submissions: Submission[];
  onUpdateSubmission: (updated: Submission) => void;
  onSelectSubmission: (submission: Submission) => void;
  onOpenEditProfile?: () => void;
}

export const LeadershipDesk: React.FC<LeadershipDeskProps> = ({
  currentRole,
  submissions,
  onUpdateSubmission,
  onSelectSubmission,
  onOpenEditProfile,
}) => {
  const [selectedSubId, setSelectedSubId] = useState<string>(submissions[0]?.id || '');
  const [leadershipNote, setLeadershipNote] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState('');

  const isDeputy = currentRole === 'DEPUTY_EIC';
  const isEIC = currentRole === 'EIC';

  // Task Category Filter ('ALL' | 'TIN_NONG' | 'KHIEU_NAI')
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'TIN_NONG' | 'KHIEU_NAI'>('ALL');
  // Priority Filter
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | 'BREAKING' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  // Status Filter
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'PUBLISHED' | 'REJECTED'>('ALL');

  // Filter queue based on role
  const roleSubmissions = submissions.filter((s) => {
    if (isDeputy) {
      return s.stage === 'DEPUTY_PENDING' || s.stage === 'AI_REVIEW_COMPLETED' || s.stage === 'PUBLISHED' || s.stage === 'REJECTED';
    }
    // EIC
    return s.stage === 'EIC_PENDING' || s.priority === 'BREAKING' || s.stage === 'PUBLISHED' || s.stage === 'REJECTED';
  });

  const queue = roleSubmissions.filter((s) => {
    // 1. Category Filter
    if (categoryFilter !== 'ALL') {
      const cat = s.category || 'TIN_NONG';
      if (cat !== categoryFilter) return false;
    }
    // 2. Priority Filter
    if (priorityFilter !== 'ALL' && s.priority !== priorityFilter) return false;
    // 3. Status Filter
    if (statusFilter === 'PENDING') {
      if (isDeputy && s.stage !== 'DEPUTY_PENDING' && s.stage !== 'AI_REVIEW_COMPLETED') return false;
      if (isEIC && s.stage !== 'EIC_PENDING' && s.priority !== 'BREAKING') return false;
    } else if (statusFilter === 'PUBLISHED') {
      if (s.stage !== 'PUBLISHED') return false;
    } else if (statusFilter === 'REJECTED') {
      if (s.stage !== 'REJECTED') return false;
    }
    return true;
  });

  const selectedSub = queue.find((s) => s.id === selectedSubId) || queue[0] || submissions[0];

  // Deputy approves or escalates
  const handleDeputyDecision = (action: 'APPROVE' | 'ESCALATE' | 'REJECT') => {
    if (!selectedSub) return;

    if (action === 'APPROVE') {
      // Allowed if LOW or MEDIUM
      const updated: Submission = {
        ...selectedSub,
        stage: 'PUBLISHED',
        deputyReview: {
          reviewerName: 'Trần Văn Đức (Phó Tổng Biên Tập)',
          reviewerId: 'DEP-01',
          reviewedAt: new Date().toLocaleString('sv-SE').slice(0, 16).replace('T', ' '),
          decision: 'APPROVED',
          editorialDirective: leadershipNote || 'Đã kiểm duyệt chuyên môn. Cho phép xuất bản trên cổng thông tin.',
        },
      };
      onUpdateSubmission(updated);
      alert('Phó Tổng Biên Tập đã duyệt xuất bản thành công!');
    } else if (action === 'ESCALATE') {
      // High or Breaking -> Escalate to EIC
      const updated: Submission = {
        ...selectedSub,
        stage: 'EIC_PENDING',
        deputyReview: {
          reviewerName: 'Trần Văn Đức (Phó Tổng Biên Tập)',
          reviewerId: 'DEP-01',
          reviewedAt: new Date().toLocaleString('sv-SE').slice(0, 16).replace('T', ' '),
          decision: 'ESCALATE_TO_EIC',
          editorialDirective: leadershipNote || 'Vụ việc quy mô lớn/khẩn cấp. Kính trình Tổng biên tập thẩm định và phê duyệt cuối cùng.',
        },
      };
      onUpdateSubmission(updated);
      alert('Đã chuyển hồ sơ lên Tổng Biên Tập (EIC) phê duyệt cuối cùng!');
    } else {
      // Reject
      const updated: Submission = {
        ...selectedSub,
        stage: 'REJECTED',
        deputyReview: {
          reviewerName: 'Trần Văn Đức (Phó Tổng Biên Tập)',
          reviewerId: 'DEP-01',
          reviewedAt: new Date().toLocaleString('sv-SE').slice(0, 16).replace('T', ' '),
          decision: 'REJECTED',
          editorialDirective: leadershipNote || 'Hồ sơ chưa đủ căn cứ xác thực hoặc không phù hợp định hướng báo chí.',
        },
      };
      onUpdateSubmission(updated);
      alert('Đã từ chối bài viết!');
    }
  };

  // EIC Final Approval
  const handleEICDecision = (action: 'PUBLISH' | 'TAKEDOWN') => {
    if (!selectedSub) return;

    if (action === 'PUBLISH') {
      const updated: Submission = {
        ...selectedSub,
        stage: 'PUBLISHED',
        eicApproval: {
          eicName: 'Nguyễn Quang Vinh (Tổng Biên Tập)',
          approvedAt: new Date().toLocaleString('sv-SE').slice(0, 16).replace('T', ' '),
          decision: 'APPROVED_AND_PUBLISHED',
          directive: leadershipNote || 'Phê duyệt xuất bản đặc biệt. Yêu cầu bám sát diễn tiến sự việc.',
        },
      };
      onUpdateSubmission(updated);
      alert('TỔNG BIÊN TẬP ĐÃ KÝ DUYỆT XUẤT BẢN TIN CHÍNH THỨC!');
    } else {
      const updated: Submission = {
        ...selectedSub,
        stage: 'REJECTED',
        eicApproval: {
          eicName: 'Nguyễn Quang Vinh (Tổng Biên Tập)',
          approvedAt: new Date().toLocaleString('sv-SE').slice(0, 16).replace('T', ' '),
          decision: 'TAKEDOWN',
          directive: leadershipNote || 'Lệnh gỡ bỏ hoặc bảo lưu điều tra thêm.',
        },
      };
      onUpdateSubmission(updated);
      alert('Tổng biên tập đã quyết định bảo lưu/từ chối xuất bản bài viết.');
    }
  };

  // OTP Decryption for Anonymous Citizen (BREAKING LEVEL)
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput.trim() === '889900' || otpInput.trim().length === 6) {
      setIsOtpVerified(true);
      setOtpError('');
    } else {
      setOtpError('Mã OTP không chính xác. Mã thử nghiệm hợp lệ là: 889900');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg ${
              isEIC ? 'bg-red-600' : 'bg-indigo-600'
            }`}>
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black">
                  {isEIC ? 'PHÒNG TỔNG BIÊN TẬP (EIC OFFICE)' : 'PHÒNG PHÓ TỔNG BIÊN TẬP (DEPUTY EIC)'}
                </h1>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                  isEIC ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                }`}>
                  {isEIC ? 'QUYỀN PHÊ DUYỆT TỐI CAO' : 'KIỂM DUYỆT CHUYÊN MÔN'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isEIC
                  ? 'Quyết định duyệt xuất bản cuối cùng mức HIGH & BREAKING • Giải mật danh tính báo tin bằng OTP'
                  : 'Kiểm duyệt tính pháp lý bài viết • Phê duyệt tin LOW/MEDIUM hoặc Escalate lên Tổng Biên Tập'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 text-xs">
            {onOpenEditProfile && (
              <button
                type="button"
                onClick={onOpenEditProfile}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white rounded-xl text-xs font-bold border border-slate-700 hover:border-amber-400 transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                title="Chỉnh sửa thông tin hồ sơ Lãnh đạo"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                <span>{isEIC ? 'Sửa hồ sơ Tổng Biên Tập' : 'Sửa hồ sơ Phó TBT'}</span>
              </button>
            )}

            <div className="text-right">
              <span className="text-slate-400">Hồ sơ đang chờ xử lý:</span>
              <span className="ml-2 px-2.5 py-1 rounded-full bg-slate-800 text-white font-mono font-bold">
                {queue.length} vụ việc
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Hàng đợi kiểm duyệt
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-700 font-mono">
                {queue.length} hồ sơ
              </span>
            </div>

            {/* Filter 1: Lọc theo loại nhiệm vụ / loại tin */}
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-slate-600 flex justify-between">
                <span>Lọc theo loại nhiệm vụ:</span>
              </div>
              <div className="grid grid-cols-3 gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => setCategoryFilter('ALL')}
                  className={`py-1.5 px-1 rounded-lg text-[11px] font-bold text-center transition cursor-pointer ${
                    categoryFilter === 'ALL'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Tất cả loại
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryFilter('TIN_NONG')}
                  className={`py-1.5 px-1 rounded-lg text-[11px] font-bold text-center transition cursor-pointer truncate ${
                    categoryFilter === 'TIN_NONG'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200/60'
                  }`}
                >
                  🚨 Tin nóng
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryFilter('KHIEU_NAI')}
                  className={`py-1.5 px-1 rounded-lg text-[11px] font-bold text-center transition cursor-pointer truncate ${
                    categoryFilter === 'KHIEU_NAI'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/60'
                  }`}
                >
                  📋 Khiếu nại
                </button>
              </div>
            </div>

            {/* Filter 2: Mức ưu tiên & Trạng thái */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                  Mức độ:
                </label>
                <select
                  value={priorityFilter}
                  onChange={(e: any) => setPriorityFilter(e.target.value)}
                  className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none"
                >
                  <option value="ALL">Tất cả mức</option>
                  <option value="BREAKING">BREAKING</option>
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="LOW">LOW</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                  Trạng thái:
                </label>
                <select
                  value={statusFilter}
                  onChange={(e: any) => setStatusFilter(e.target.value)}
                  className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none"
                >
                  <option value="ALL">Tất cả</option>
                  <option value="PENDING">Chờ phê duyệt</option>
                  <option value="PUBLISHED">Đã xuất bản</option>
                  <option value="REJECTED">Đã từ chối</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
            {queue.length === 0 ? (
              <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-400 space-y-2">
                <p className="text-xs">Không có hồ sơ nào phù hợp bộ lọc.</p>
                <button
                  type="button"
                  onClick={() => {
                    setCategoryFilter('ALL');
                    setPriorityFilter('ALL');
                    setStatusFilter('ALL');
                  }}
                  className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold shadow"
                >
                  Đặt lại bộ lọc
                </button>
              </div>
            ) : (
              queue.map((sub) => {
              const isSelected = selectedSub?.id === sub.id;
              const priorityObj = calculatePriority(sub.totalScore);
              const isKhieuNai = sub.category === 'KHIEU_NAI';

              return (
                <div
                  key={sub.id}
                  onClick={() => {
                    setSelectedSubId(sub.id);
                    setIsOtpVerified(false);
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${priorityObj.bgLight} ${priorityObj.color} ${priorityObj.borderColor}`}>
                        {sub.priority} ({sub.totalScore}đ)
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                        isKhieuNai ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {isKhieuNai ? 'Khiếu nại' : 'Tin nóng'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{sub.trackingCode}</span>
                  </div>

                  <h4 className="font-bold text-xs text-slate-900 line-clamp-2 leading-snug">
                    {sub.title}
                  </h4>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                    <span className="truncate">{sub.province}</span>
                    <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                      {sub.stage}
                    </span>
                  </div>
                </div>
              );
            }))}
          </div>
        </div>

        {/* Right Detail */}
        <div className="lg:col-span-8">
          {selectedSub ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <span className="font-mono font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                      {selectedSub.trackingCode}
                    </span>
                    <span>• {selectedSub.location}</span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900 leading-snug">
                    {selectedSub.title}
                  </h2>
                </div>

                <div className="text-right shrink-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-black border ${
                    selectedSub.priority === 'BREAKING'
                      ? 'bg-red-600 text-white border-red-700 animate-pulse'
                      : 'bg-orange-100 text-orange-900 border-orange-300'
                  }`}>
                    {selectedSub.priority} ({selectedSub.totalScore}đ)
                  </span>
                </div>
              </div>

              {/* ARTICLE DRAFT REVIEW */}
              {selectedSub.articleDraft ? (
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-300 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      Nội dung bản thảo bài viết báo chí
                    </span>
                    <span className="text-xs text-slate-500">
                      Tác giả: <strong>{selectedSub.articleDraft.authorName}</strong>
                    </span>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                    <h3 className="text-base font-black text-slate-900">
                      {selectedSub.articleDraft.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-700 italic border-l-3 border-indigo-500 pl-3 leading-relaxed">
                      {selectedSub.articleDraft.sapo}
                    </p>
                    <div className="text-xs text-slate-800 whitespace-pre-line leading-relaxed pt-2 border-t border-slate-100">
                      {selectedSub.articleDraft.content}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
                  Chưa có bản thảo bài viết. Vụ việc đang được BTV rà soát từ báo cáo của người dân.
                </div>
              )}

              {/* AI REVIEW SUMMARY (GEMINI FLASH) */}
              {selectedSub.aiReview && (
                <div className="p-4 bg-purple-50/80 rounded-xl border border-purple-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      Đánh Giá Hỗ Trợ Của Hệ Thống AI (Gemini)
                    </span>
                    <span className="font-bold text-purple-700">
                      Độ tin cậy: {selectedSub.aiReview.factualConsistencyScore}%
                    </span>
                  </div>
                  <p className="text-slate-700">{selectedSub.aiReview.summary}</p>
                </div>
              )}

              {/* SPECIAL EIC FEATURE: DE-ANONYMIZE OTP DECRYPTION FOR BREAKING INCIDENTS */}
              {isEIC && selectedSub.isAnonymous && (
                <div className="p-5 bg-gradient-to-r from-red-50 to-amber-50 rounded-xl border-2 border-red-400 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-red-900 font-bold text-sm">
                      <ShieldAlert className="w-5 h-5 text-red-600" />
                      <span>GIẢI MẬT DANH TÍNH NGƯỜI BÁO TIN BẰNG MÃ OTP (CHỈ DÀNH CHO TỔNG BIÊN TẬP)</span>
                    </div>
                    <span className="text-[10px] font-mono text-red-700 bg-red-100 px-2 py-0.5 rounded font-bold">
                      BẢO MẬT CẤP ĐỘ KHẨN
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    Sự việc được phân cấp mức <strong>BREAKING ({selectedSub.totalScore}đ)</strong> đe dọa sinh mạng hoặc an ninh nghiêm trọng. 
                    Để phối hợp cơ quan điều tra, Tổng biên tập nhập mã OTP giải mật được gửi tới số điện thoại người báo tin hoặc mã ủy quyền của Tòa soạn.
                  </p>

                  {!isOtpVerified ? (
                    <form onSubmit={handleVerifyOtp} className="flex items-center gap-2 max-w-md">
                      <div className="relative flex-1">
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={otpInput}
                          onChange={(e) => setOtpInput(e.target.value)}
                          placeholder="Nhập 6 số OTP (Thử: 889900)..."
                          className="w-full pl-9 pr-3 py-2 bg-white border border-red-300 rounded-lg text-xs font-mono font-bold tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                      >
                        Xác Thực OTP
                      </button>
                    </form>
                  ) : (
                    <div className="p-4 bg-white rounded-xl border border-red-300 space-y-2 animate-fade-in">
                      <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> ĐÃ GIẢI MẬT DANH TÍNH THÀNH CÔNG:
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-800">
                        <div><strong>Họ tên thật:</strong> {selectedSub.citizenName || 'Lê Văn Bảy'}</div>
                        <div><strong>Số điện thoại:</strong> {selectedSub.citizenPhone}</div>
                        <div><strong>Email:</strong> {selectedSub.citizenEmail || 'Chưa cung cấp'}</div>
                        <div><strong>Thời điểm báo tin:</strong> {selectedSub.createdAt}</div>
                      </div>
                    </div>
                  )}

                  {otpError && (
                    <p className="text-xs text-red-600 font-medium">{otpError}</p>
                  )}
                </div>
              )}

              {/* LEADERSHIP DIRECTIVE INPUT */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Chỉ đạo biên tập của {isEIC ? 'Tổng Biên Tập' : 'Phó Tổng Biên Tập'} *
                </label>
                <textarea
                  rows={2}
                  value={leadershipNote}
                  onChange={(e) => setLeadershipNote(e.target.value)}
                  placeholder="Ghi rõ ý kiến chỉ đạo, định hướng thông tin hoặc yêu cầu lưu ý..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* DECISION BUTTONS */}
              <div className="pt-2 flex items-center justify-between flex-wrap gap-3 border-t border-slate-200">
                {isDeputy ? (
                  <>
                    <button
                      onClick={() => handleDeputyDecision('REJECT')}
                      className="px-4 py-2 bg-slate-100 hover:bg-red-100 text-slate-700 hover:text-red-700 rounded-lg text-xs font-bold transition cursor-pointer"
                    >
                      ✕ Không Duyệt
                    </button>

                    <div className="flex items-center gap-2">
                      {/* If LOW or MEDIUM -> Can directly approve */}
                      {(selectedSub.priority === 'LOW' || selectedSub.priority === 'MEDIUM') && (
                        <button
                          onClick={() => handleDeputyDecision('APPROVE')}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Phó TBT Duyệt & Xuất Bản Ngay (LOW/MEDIUM)</span>
                        </button>
                      )}

                      {/* If HIGH or BREAKING -> Must escalate to EIC */}
                      {(selectedSub.priority === 'HIGH' || selectedSub.priority === 'BREAKING') && (
                        <button
                          onClick={() => handleDeputyDecision('ESCALATE')}
                          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                          <span>Thẩm Định & Escalate Lên Tổng Biên Tập (EIC)</span>
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEICDecision('TAKEDOWN')}
                      className="px-4 py-2 bg-slate-100 hover:bg-red-100 text-slate-700 hover:text-red-700 rounded-lg text-xs font-bold transition cursor-pointer"
                    >
                      ✕ Bảo Lưu / Gỡ Bỏ
                    </button>

                    <button
                      onClick={() => handleEICDecision('PUBLISH')}
                      className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black tracking-wide transition flex items-center gap-2 cursor-pointer shadow-lg shadow-red-900/30"
                    >
                      <Globe className="w-4 h-4 text-amber-300" />
                      <span>TỔNG BIÊN TẬP KÝ DUYỆT XUẤT BẢN TOÀN CỔNG TIN</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              Chọn một vụ việc trong danh sách để thẩm định
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
