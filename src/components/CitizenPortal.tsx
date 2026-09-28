import React, { useState } from 'react';
import { 
  Flame, 
  Search, 
  Send, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Eye, 
  ShieldAlert, 
  ChevronRight, 
  Radio, 
  Users, 
  AlertOctagon, 
  FileText,
  TrendingUp,
  Sparkles,
  Building2,
  Award,
  Scale,
  ShieldCheck,
  Newspaper,
  Star,
  User,
  Edit3,
  GraduationCap
} from 'lucide-react';
import { Submission, PriorityLevel } from '../types';
import { calculatePriority } from '../data/criteria';

interface CitizenPortalProps {
  onOpenSubmit: () => void;
  onOpenTrack: (code?: string) => void;
  onOpenProfile: () => void;
  onOpenApplyExpert?: () => void;
  onOpenEditProfile?: () => void;
  reputationScore?: number;
  submissions: Submission[];
  onSelectSubmission: (submission: Submission) => void;
}

export const CitizenPortal: React.FC<CitizenPortalProps> = ({
  onOpenSubmit,
  onOpenTrack,
  onOpenProfile,
  onOpenApplyExpert,
  onOpenEditProfile,
  reputationScore = 95,
  submissions,
  onSelectSubmission,
}) => {
  const [searchTrackingInput, setSearchTrackingInput] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'TIN_NONG' | 'KHIEU_NAI'>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'IN_PROGRESS' | 'PUBLISHED'>('ALL');

  // Filtered submissions list for citizen view
  const filteredSubmissions = submissions.filter((s) => {
    if (filterCategory !== 'ALL' && (s.category || 'TIN_NONG') !== filterCategory) return false;
    if (filterPriority !== 'ALL' && s.priority !== filterPriority) return false;
    if (filterStatus === 'PUBLISHED' && s.stage !== 'PUBLISHED') return false;
    if (filterStatus === 'IN_PROGRESS' && (s.stage === 'PUBLISHED' || s.stage === 'REJECTED')) return false;
    return true;
  });

  const handleSearchTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTrackingInput.trim()) {
      onOpenTrack(searchTrackingInput.trim());
    }
  };

  const getBadgeStyle = (priority: PriorityLevel) => {
    switch (priority) {
      case 'BREAKING':
        return 'bg-red-600 text-white border-red-700 animate-pulse';
      case 'HIGH':
        return 'bg-orange-500 text-white border-orange-600';
      case 'MEDIUM':
        return 'bg-amber-500 text-white border-amber-600';
      case 'LOW':
        return 'bg-emerald-600 text-white border-emerald-700';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* HERO BANNER: CỔNG THÔNG TIN DÂN SINH */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-bold uppercase tracking-wider">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400"></span>
              </span>
              Kênh tiếp nhận & phản hồi chính thức của Tòa soạn
            </div>

            {/* Citizen Reputation Score Chip */}
            <button
              onClick={onOpenProfile}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 hover:bg-slate-750 border border-amber-500/50 text-xs text-amber-200 cursor-pointer transition shadow-md group"
            >
              <div className="w-4 h-4 rounded-full bg-amber-500/30 text-amber-400 flex items-center justify-center">
                <Star className="w-3 h-3 fill-current" />
              </div>
              <span>Điểm uy tín của bạn: <strong className="text-amber-300 font-mono text-sm">{reputationScore}/100đ</strong></span>
              <span className="text-slate-400">•</span>
              <span className="text-amber-400 underline font-semibold text-[11px] group-hover:text-white">
                Xem hồ sơ & Xin xét duyệt CTV →
              </span>
            </button>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
            CỔNG TIẾP NHẬN & XÁC THỰC <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-amber-400 to-red-400">
              TIN NÓNG DÂN SINH 24/7
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Mỗi người dân là một "tai mắt" của cộng đồng. Khi phát hiện sự cố, tai nạn, sạt lở, ô nhiễm môi trường hay sai phạm dân sinh, hãy gửi ngay thông tin để Tòa soạn thẩm định, điều phối phóng viên xác minh và can thiệp kịp thời.
          </p>

          {/* PROMINENT BUTTONS: GỬI TIN NÓNG • XEM PROFILE & ĐIỂM UY TÍN • TRA CỨU */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 flex-wrap">
            <button
              onClick={onOpenSubmit}
              className="w-full sm:w-auto px-7 py-4 bg-gradient-to-r from-red-600 via-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white rounded-2xl text-base font-black tracking-wide shadow-xl shadow-red-950/60 hover:shadow-2xl hover:shadow-red-700/30 border border-red-400/40 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Flame className="w-5 h-5 text-amber-300 animate-bounce" />
              <span>🚨 BẤM ĐỂ GỬI TIN NÓNG KHẨN CẤP</span>
            </button>

            {/* BUTTON XEM PROFILE & HIỂN THỊ ĐIỂM UY TÍN */}
            <button
              onClick={onOpenProfile}
              className="w-full sm:w-auto px-6 py-4 bg-gradient-to-r from-slate-800 via-slate-800 to-amber-950/60 hover:from-slate-750 hover:to-slate-700 text-white rounded-2xl text-sm font-bold border border-amber-500/50 hover:border-amber-400 flex items-center justify-center gap-3 transition shadow-lg shadow-black/30 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs border border-amber-400/40 shrink-0">
                <Star className="w-4 h-4 fill-current text-amber-400" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5 leading-none">
                  <span>Xem Hồ Sơ & Điểm Uy Tín</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-black bg-amber-400 text-slate-950 font-mono">
                    {reputationScore}đ
                  </span>
                </div>
                <div className="text-[10px] text-amber-200/80 font-normal mt-1">
                  Đủ điều kiện xét duyệt CTV báo chí
                </div>
              </div>
            </button>

            {/* BUTTON XÉT DUYỆT CHUYÊN GIA */}
            <button
              onClick={onOpenApplyExpert || onOpenProfile}
              className="w-full sm:w-auto px-6 py-4 bg-gradient-to-r from-indigo-900 via-indigo-850 to-purple-950 hover:from-indigo-800 hover:to-purple-900 text-white rounded-2xl text-sm font-bold border border-indigo-400/50 hover:border-indigo-300 flex items-center justify-center gap-3 transition shadow-lg shadow-indigo-950/40 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-500/30 text-indigo-300 flex items-center justify-center font-bold text-xs border border-indigo-400/40 shrink-0 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-4 h-4 text-indigo-300" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5 leading-none">
                  <span>Xét Duyệt Chuyên Gia</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-400 text-slate-950 uppercase">
                    Mới
                  </span>
                </div>
                <div className="text-[10px] text-indigo-200/80 font-normal mt-1">
                  Đăng ký phản biện & viết bài báo chí
                </div>
              </div>
            </button>

            <button
              onClick={() => onOpenTrack()}
              className="w-full sm:w-auto px-5 py-4 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white rounded-2xl text-sm font-bold border border-slate-700 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span>Tra Cứu Mã Hồ Sơ</span>
            </button>

            {onOpenEditProfile && (
              <button
                onClick={onOpenEditProfile}
                className="w-full sm:w-auto px-4 py-4 bg-slate-800/90 hover:bg-slate-700 text-amber-300 hover:text-white rounded-2xl text-sm font-bold border border-amber-500/40 hover:border-amber-400 flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
                title="Chỉnh sửa thông tin hồ sơ người dân"
              >
                <Edit3 className="w-4 h-4 text-amber-400" />
                <span>Sửa hồ sơ</span>
              </button>
            )}
          </div>

          {/* Quick Tracking Search Bar */}
          <div className="pt-2 max-w-md mx-auto">
            <form onSubmit={handleSearchTrack} className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700">
              <Search className="w-4 h-4 text-slate-400 ml-2.5" />
              <input
                type="text"
                value={searchTrackingInput}
                onChange={(e) => setSearchTrackingInput(e.target.value)}
                placeholder="Nhập mã hồ sơ (ví dụ: TN-2026-8891)..."
                className="bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none flex-1 px-1"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition cursor-pointer"
              >
                Tra cứu
              </button>
            </form>
          </div>
        </div>

        {/* Live System Counter */}
        {(() => {
          const tinNongCount = submissions.filter((s) => s.category !== 'KHIEU_NAI').length;
          const khieuNaiCount = submissions.filter((s) => s.category === 'KHIEU_NAI').length;
          return (
            <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="bg-slate-800/90 hover:bg-slate-800/100 transition p-4 rounded-xl border border-red-500/30 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center border border-red-500/30 shrink-0">
                    <Flame className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-slate-200">
                      Số lượng tin nóng trong ngày
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Sự cố khẩn cấp, hỏa hoạn, sạt lở, an toàn dân sinh
                    </div>
                  </div>
                </div>
                <div className="text-3xl font-black text-white font-mono pl-3 shrink-0">
                  {tinNongCount}
                </div>
              </div>

              <div className="bg-slate-800/90 hover:bg-slate-800/100 transition p-4 rounded-xl border border-amber-500/30 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-slate-200">
                      Số lượng tin khiếu nại trong ngày
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Phản ánh ô nhiễm, hạ tầng, vi phạm trật tự đô thị
                    </div>
                  </div>
                </div>
                <div className="text-3xl font-black text-amber-400 font-mono pl-3 shrink-0">
                  {khieuNaiCount}
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* SECTION: 3 TIÊU CHUẨN CHẤM ĐIỂM MINH BẠCH DÀNH CHO NGƯỜI DÂN */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-red-600 uppercase tracking-wide">
              Công Khai & Minh Bạch
            </span>
            <h2 className="text-xl font-black text-slate-900">
              QUY CHUẨN ĐÁNH GIÁ THANG ĐIỂM TÁC ĐỘNG (IMPACT SCORE 30 – 130 ĐIỂM)
            </h2>
          </div>
          <button
            onClick={onOpenSubmit}
            className="self-start sm:self-auto text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Báo cáo sự việc ngay</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              Khu Vực Xảy Ra (Location Scope)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Thang điểm từ 10 đến 40 điểm dựa trên phạm vi tác động địa lý của sự cố:
            </p>
            <ul className="text-xs space-y-2 text-slate-700">
              <li className="flex justify-between pb-1 border-b border-blue-200/60">
                <span>Phường, Xã / Cục bộ</span>
                <strong className="text-blue-700">10 điểm</strong>
              </li>
              <li className="flex justify-between pb-1 border-b border-blue-200/60">
                <span>Cấp Quận, Huyện, Thị xã</span>
                <strong className="text-blue-700">20 điểm</strong>
              </li>
              <li className="flex justify-between pb-1 border-b border-blue-200/60">
                <span>Cấp Tỉnh, Thành phố lớn</span>
                <strong className="text-blue-700">30 điểm</strong>
              </li>
              <li className="flex justify-between">
                <span>Liên tỉnh / Toàn quốc</span>
                <strong className="text-blue-700">40 điểm</strong>
              </li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              Quy Mô Dân Số (Affected Population)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Thang điểm từ 10 đến 40 điểm theo số lượng người chịu tác động trực tiếp:
            </p>
            <ul className="text-xs space-y-2 text-slate-700">
              <li className="flex justify-between pb-1 border-b border-amber-200/60">
                <span>Cá nhân / Hẹp (&lt; 10 người)</span>
                <strong className="text-amber-700">10 điểm</strong>
              </li>
              <li className="flex justify-between pb-1 border-b border-amber-200/60">
                <span>Quy mô nhỏ (10 – 100 người)</span>
                <strong className="text-amber-700">20 điểm</strong>
              </li>
              <li className="flex justify-between pb-1 border-b border-amber-200/60">
                <span>Quy mô vừa (100 – 1.000 người)</span>
                <strong className="text-amber-700">30 điểm</strong>
              </li>
              <li className="flex justify-between">
                <span>Quy mô lớn (&gt; 1.000 người / Cộng đồng)</span>
                <strong className="text-amber-700">40 điểm</strong>
              </li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="p-5 rounded-2xl bg-red-50/50 border border-red-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              Loại Tính Chất (Severity & Nature)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Thang điểm từ 10 đến 50 điểm đánh giá mức độ khẩn cấp và nguy hiểm:
            </p>
            <ul className="text-xs space-y-2 text-slate-700">
              <li className="flex justify-between pb-1 border-b border-red-200/60">
                <span>Đời sống / Ý kiến thường nhật</span>
                <strong className="text-red-700">10 điểm</strong>
              </li>
              <li className="flex justify-between pb-1 border-b border-red-200/60">
                <span>Tranh chấp / Thiệt hại kinh tế</span>
                <strong className="text-red-700">20 điểm</strong>
              </li>
              <li className="flex justify-between pb-1 border-b border-red-200/60">
                <span>Ô nhiễm / An toàn / Rủi ro pháp lý</span>
                <strong className="text-red-700">35 điểm</strong>
              </li>
              <li className="flex justify-between">
                <span>Thiệt hại nhân mạng / Khủng hoảng</span>
                <strong className="text-red-700">50 điểm</strong>
              </li>
            </ul>
          </div>
        </div>

        {/* 4 Priority Levels explanation bar */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
            4 Cấp Độ Phân Loại Xử Lý Tương Ứng:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-white rounded-lg border border-emerald-200">
              <div className="font-black text-emerald-700">Mức 1: LOW (30 - 50đ)</div>
              <p className="text-slate-600 mt-1">Ảnh hưởng nhỏ, đời sống dân sinh. BTV biên tập ➔ Phó TBT duyệt ➔ Xuất bản.</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-amber-200">
              <div className="font-black text-amber-700">Mức 2: MEDIUM (55 - 75đ)</div>
              <p className="text-slate-600 mt-1">Quy mô vừa cấp huyện/tỉnh. BTV rà soát ➔ Phó TBT kiểm duyệt ➔ Phê duyệt.</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-orange-200">
              <div className="font-black text-orange-700">Mức 3: HIGH (80 - 100đ)</div>
              <p className="text-slate-600 mt-1">Vụ việc phức tạp. <strong>Bắt buộc điều phối CTV xác minh</strong> ➔ BTV ➔ Phó TBT escalate ➔ TBT duyệt.</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-red-200">
              <div className="font-black text-red-700">Mức 4: BREAKING (105 - 130đ)</div>
              <p className="text-slate-600 mt-1">Đặc biệt nghiêm trọng. <strong>Broadcast khẩn CTV</strong> ➔ Phó TBT ➔ Tổng biên tập trực tiếp chỉ đạo (kèm OTP giải mật).</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: BẢNG THEO DÕI VÀ LỌC TIN BÁO DÂN SINH THEO TỪNG LOẠI */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-red-600 uppercase tracking-wide">
              Cập Nhật Thực Địa 24/7
            </span>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Flame className="w-5 h-5 text-red-600" />
              THEO DÕI VÀ LỌC CÁC VỤ VIỆC DÂN SINH ({filteredSubmissions.length} VỤ VIỆC)
            </h2>
          </div>
          <button
            onClick={onOpenSubmit}
            className="self-start sm:self-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow transition cursor-pointer"
          >
            + Gửi Tin Báo Mới
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Lọc theo loại nhiệm vụ / loại tin */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="font-bold text-slate-700 mr-1">Lọc theo loại:</span>
              <button
                type="button"
                onClick={() => setFilterCategory('ALL')}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  filterCategory === 'ALL'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Tất cả loại ({submissions.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterCategory('TIN_NONG')}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  filterCategory === 'TIN_NONG'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-red-700 hover:bg-red-50'
                }`}
              >
                🚨 Tin nóng khẩn cấp ({submissions.filter(s => (s.category || 'TIN_NONG') === 'TIN_NONG').length})
              </button>
              <button
                type="button"
                onClick={() => setFilterCategory('KHIEU_NAI')}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  filterCategory === 'KHIEU_NAI'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-amber-800 hover:bg-amber-50'
                }`}
              >
                📋 Khiếu nại dân sinh ({submissions.filter(s => s.category === 'KHIEU_NAI').length})
              </button>
            </div>

            {/* Lọc theo trạng thái */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="font-bold text-slate-700 mr-1">Trạng thái:</span>
              <button
                type="button"
                onClick={() => setFilterStatus('ALL')}
                className={`px-2.5 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  filterStatus === 'ALL'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Tất cả
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('IN_PROGRESS')}
                className={`px-2.5 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  filterStatus === 'IN_PROGRESS'
                    ? 'bg-amber-600 text-white'
                    : 'bg-white border border-slate-200 text-amber-700 hover:bg-amber-50'
                }`}
              >
                Đang thụ lý & Kiểm chứng
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('PUBLISHED')}
                className={`px-2.5 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  filterStatus === 'PUBLISHED'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white border border-slate-200 text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                Đã xuất bản
              </button>
            </div>
          </div>
        </div>

        {/* Submissions Cards Grid */}
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-10 text-slate-400 space-y-2">
            <p className="text-xs">Không có tin báo nào phù hợp với bộ lọc hiện tại.</p>
            <button
              type="button"
              onClick={() => {
                setFilterCategory('ALL');
                setFilterPriority('ALL');
                setFilterStatus('ALL');
              }}
              className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-bold"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSubmissions.map((sub) => {
              const isPublished = sub.stage === 'PUBLISHED';
              const isKhieuNai = sub.category === 'KHIEU_NAI';
              return (
                <div
                  key={sub.id}
                  onClick={() => onSelectSubmission(sub)}
                  className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition cursor-pointer space-y-2.5 flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                          {sub.trackingCode}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded font-black uppercase text-[9px] ${
                          isKhieuNai ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {isKhieuNai ? 'Khiếu nại' : 'Tin nóng'}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded font-black text-[9px] uppercase ${getBadgeStyle(sub.priority)}`}>
                        {sub.priority} ({sub.totalScore}đ)
                      </span>
                    </div>

                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
                      {sub.title}
                    </h4>

                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {sub.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="truncate max-w-[140px]">{sub.location}</span>
                    {isPublished ? (
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Đã xuất bản
                      </span>
                    ) : (
                      <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded flex items-center gap-1 border border-amber-200">
                        <Clock className="w-3 h-3" /> {sub.stage === 'FIELD_ASSIGNED' ? 'Đang kiểm chứng' : sub.stage === 'FIELD_VERIFIED' ? 'Đã kiểm chứng' : sub.stage}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* SECTION: GIỚI THIỆU VỀ TÒA SOẠN TIN NÓNG DÂN SINH */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-red-600 uppercase tracking-wide">
                Cơ Quan Báo Chí Đa Phương Tiện
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                GP số 188/GP-BTTTT
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5 mt-0.5">
              <Building2 className="w-6 h-6 text-red-600" />
              GIỚI THIỆU VỀ TÒA SOẠN TIN NÓNG DÂN SINH
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-md sm:text-right">
            Diễn đàn tin cậy của nhân dân — Cầu nối chuyển tải tiếng nói, phản ánh và khiếu nại tới các cơ quan quản lý nhà nước
          </p>
        </div>

        {/* Hero editorial card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/30 border border-red-500/40 text-red-300 text-xs font-bold uppercase tracking-wider">
              <Newspaper className="w-3.5 h-3.5 text-amber-400" />
              Tôn chỉ: Nhanh chóng • Trung thực • Khách quan • Vì quyền lợi cộng đồng
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
              TIÊN PHONG CHUYỂN ĐỔI SỐ BÁO CHÍ — TÁC NGHIỆP VÌ DÂN SINH
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed">
              Báo điện tử <strong>Tin Nóng Dân Sinh</strong> được thành lập với sứ mệnh lắng nghe, tiếp nhận và xác thực mọi thông tin phản ánh từ cơ sở. Chúng tôi ứng dụng quy trình thẩm định <strong>Impact Score</strong> khoa học cùng công nghệ kiểm chứng thực địa, đảm bảo mỗi tin báo của bạn đọc đều được xác minh độc lập, biên tập nghiêm túc và đồng hành giải quyết đến cùng.
            </p>

            {/* Key stats row */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800 text-center">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">63</div>
                <div className="text-[11px] text-slate-400">Tỉnh thành phủ sóng</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">500+</div>
                <div className="text-[11px] text-slate-400">Phóng viên & CTV</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="text-xl sm:text-2xl font-black text-blue-400 font-mono">24/7</div>
                <div className="text-[11px] text-slate-400">Trực ban tiếp nhận</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="text-xl sm:text-2xl font-black text-red-400 font-mono">&lt; 30'</div>
                <div className="text-[11px] text-slate-400">Tiếp cận hiện trường</div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2.5 hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Bảo Vệ Nguồn Tin Tuyệt Đối</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mã hóa thông tin cá nhân và dữ liệu người gửi tin ẩn danh theo Điều 38 Luật Báo chí. Chỉ giải mật khi có lệnh tối cao của Tổng Biên tập và xác thực OTP 2 lớp.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2.5 hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Mạng Lưới Tác Nghiệp Rộng Khắp</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Đội ngũ phóng viên thường trú tại 3 miền Bắc - Trung - Nam kết hợp mạng lưới cộng tác viên cơ sở, sẵn sàng có mặt ghi nhận hiện trường tức thì.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2.5 hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Thang Điểm Impact Score Khoa Học</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Định lượng hóa mức độ nghiêm trọng từ 30 đến 130 điểm theo 3 tiêu chí minh bạch, loại bỏ hoàn toàn yếu tố cảm tính và kích hoạt quy trình phù hợp.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2.5 hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Đồng Hành Xử Lý Đến Cùng</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Không chỉ đưa tin, Tòa soạn phối hợp chuyển hồ sơ khiếu nại tới các cơ quan quản lý, UBND và cơ quan thanh tra để có văn bản phản hồi chính thức cho người dân.
            </p>
          </div>
        </div>

        {/* Editorial Departments & Divisions */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cơ Cấu Nghiệp Vụ</span>
              <h3 className="text-lg font-black text-slate-900">CÁC BAN CHUYÊN MÔN TRỰC THUỘC TÒA SOẠN</h3>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Làm việc liên tục 24/7/365</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-red-600/10 text-red-600 flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">Ban Thời Sự & Tin Nóng Khẩn Cấp</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tiếp nhận phản ánh 24/7 về các sự cố hỏa hoạn, tai nạn, sạt lở đất, thiên tai, dịch bệnh và an ninh trật tự. Thực hiện điều phối CTV khẩn cấp và cập nhật trực tiếp tại hiện trường.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-amber-600/10 text-amber-600 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">Ban Bạn Đọc & Tiếp Nhận Khiếu Nại Dân Sinh</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Thụ lý các vụ việc khiếu nại về trật tự đô thị, ô nhiễm môi trường, quy hoạch đất đai, hạ tầng hư hỏng và các hành vi tiêu cực nhằm bảo vệ quyền và lợi ích hợp pháp của bạn đọc.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">Trung Tâm Điều Phối Phóng Viên Hiện Trường</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Chỉ đạo tác nghiệp mạng lưới phóng viên và cộng tác viên cơ sở; kiểm tra chéo tọa độ GPS, vật chứng hình ảnh/video, nhân chứng để xác minh tính chân thực của thông tin.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-600/10 text-emerald-600 flex items-center justify-center shrink-0">
                <Scale className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">Hội Đồng Thẩm Định Pháp Lý & Trực Ban Biên Tập</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Thẩm định chuyên môn, rà soát rủi ro pháp lý theo Luật Báo chí, phối hợp cùng hệ thống AI Review và báo cáo Lãnh đạo Tòa soạn phê duyệt xuất bản hoặc chuyển cơ quan chức năng.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Commitments banner */}
        <div className="bg-red-50 rounded-2xl p-6 border border-red-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-sm sm:text-base">
                CAM KẾT "4 KHÔNG - 4 CÓ" CỦA TÒA SOẠN TIN NÓNG DÂN SINH
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                <strong>4 Không:</strong> Không sai sự thật • Không giật gân phản cảm • Không che giấu tiêu cực • Không lộ danh tính người báo tin.
                <br />
                <strong>4 Có:</strong> Có xác thực thực địa • Có phản hồi kết quả • Có trách nhiệm xã hội • Có đồng hành cùng nhân dân.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenSubmit}
            className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-red-900/30 whitespace-nowrap transition cursor-pointer shrink-0"
          >
            Gửi Phản Ánh Tới Tòa Soạn Ngay
          </button>
        </div>
      </section>
    </div>
  );
};
