import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Award, 
  ShieldCheck, 
  Star, 
  Flame, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Camera, 
  ChevronRight, 
  Sparkles,
  ExternalLink,
  Send,
  Compass,
  CreditCard,
  Edit3,
  X,
  Upload,
  Check,
  Image as ImageIcon,
  Lock,
  GraduationCap
} from 'lucide-react';
import { Submission, CTVApplication, CitizenProfileData, ExpertApplication } from '../types';

interface CitizenProfileProps {
  onBack: () => void;
  onOpenApplyCTV: () => void;
  onOpenApplyExpert?: () => void;
  onOpenSubmitNews: () => void;
  onSelectSubmission: (submission: Submission) => void;
  submissions: Submission[];
  ctvApplication: CTVApplication | null;
  expertApplication?: ExpertApplication | null;
  reputationScore?: number;
}

const PRESET_AVATARS = [
  { label: 'Nam 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' },
  { label: 'Nam 2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' },
  { label: 'Nữ 1', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80' },
  { label: 'Ký giả', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80' },
  { label: 'Chuyên viên', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80' },
];

export const CitizenProfile: React.FC<CitizenProfileProps> = ({
  onBack,
  onOpenApplyCTV,
  onOpenApplyExpert,
  onOpenSubmitNews,
  onSelectSubmission,
  submissions,
  ctvApplication,
  expertApplication,
  reputationScore = 95,
}) => {
  // Filter submissions by this citizen or sample submissions
  const citizenSubmissions = submissions.filter(
    (s) => !s.isAnonymous || s.citizenPhone === '0918.442.119' || s.id === 'sub-001'
  );

  // Task Category & Status filter for Citizen's submitted news
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'TIN_NONG' | 'KHIEU_NAI'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'PUBLISHED'>('ALL');

  const filteredCitizenSubmissions = citizenSubmissions.filter((s) => {
    if (categoryFilter !== 'ALL' && (s.category || 'TIN_NONG') !== categoryFilter) return false;
    if (statusFilter === 'PUBLISHED' && s.stage !== 'PUBLISHED') return false;
    if (statusFilter === 'PENDING' && s.stage === 'PUBLISHED') return false;
    return true;
  });

  // Manage editable profile data with localStorage persistence
  const [profileData, setProfileData] = useState<CitizenProfileData>(() => {
    try {
      const saved = localStorage.getItem('news_portal_citizen_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return {
      id: 'cit-9921',
      name: 'Phạm Minh Trí',
      penName: 'Minh Trí (Cộng Tác Viên Tiềm Năng)',
      phone: '0918.442.119',
      email: 'minhtri.dalat@gmail.com',
      idCard: '068096001824',
      address: 'Số 18 Đường Trần Phú, Phường 3, TP. Đà Lạt',
      province: 'Lâm Đồng',
      district: 'TP. Đà Lạt',
      joinedDate: '15/01/2025',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      reputationScore,
      verifiedCount: 4,
      inProgressCount: 1,
      falseReportCount: 0,
      badges: [
        { label: 'Tai Mắt Cộng Đồng', icon: '👁️', desc: 'Đã gửi trên 3 tin báo chính xác được xuất bản' },
        { label: 'Phản Ánh Kịp Thời', icon: '⚡', desc: 'Có mặt tại hiện trường thiên tai/sạt lở dưới 15 phút' },
        { label: 'Chính Trực & Xác Thực', icon: '🛡️', desc: '100% tin báo được kiểm chứng thực địa không có tin giả' },
        { label: 'Đủ Điều Kiện CTV', icon: '🎖️', desc: 'Đạt điểm uy tín ≥ 80 điểm để xin cấp thẻ CTV báo chí' },
      ],
      ctvApplication,
    };
  });

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editPhone, setEditPhone] = useState(profileData.phone);
  const [editAddress, setEditAddress] = useState(profileData.address);
  const [editEmail, setEditEmail] = useState(profileData.email);
  const [editAvatar, setEditAvatar] = useState(profileData.avatar);
  const [editName, setEditName] = useState(profileData.name);
  const [editPenName, setEditPenName] = useState(profileData.penName || '');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  const handleOpenEdit = () => {
    setEditPhone(profileData.phone);
    setEditAddress(profileData.address);
    setEditEmail(profileData.email);
    setEditAvatar(profileData.avatar);
    setEditName(profileData.name);
    setEditPenName(profileData.penName || '');
    setIsEditModalOpen(true);
  };

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setEditAvatar(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: CitizenProfileData = {
      ...profileData,
      name: editName.trim() || profileData.name,
      penName: profileData.penName, // Citizen cannot edit pen name
      phone: editPhone.trim() || profileData.phone,
      address: editAddress.trim() || profileData.address,
      email: editEmail.trim() || profileData.email,
      avatar: editAvatar.trim() || profileData.avatar,
    };

    setProfileData(updated);
    try {
      localStorage.setItem('news_portal_citizen_profile', JSON.stringify(updated));
    } catch (err) {
      console.warn(err);
    }
    setIsEditModalOpen(false);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3500);
  };

  const isEligibleForCTV = reputationScore >= 80;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Save Success Alert */}
      {saveSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-bold">
              Đã cập nhật thông tin hồ sơ cá nhân thành công!
            </span>
          </div>
          <button 
            onClick={() => setSaveSuccessMsg(false)} 
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold underline cursor-pointer"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 transition cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Cổng Thông Tin Dân Sinh</span>
        </button>

        <div className="flex items-center gap-2">
          {onOpenApplyExpert && (
            <button
              onClick={onOpenApplyExpert}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-indigo-900 to-purple-900 hover:from-indigo-800 hover:to-purple-800 text-white rounded-xl text-xs font-bold border border-indigo-400/40 shadow-sm transition cursor-pointer"
            >
              <GraduationCap className="w-3.5 h-3.5 text-indigo-300" />
              <span>Xét duyệt Chuyên gia</span>
            </button>
          )}

          <button
            onClick={handleOpenEdit}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-bold border border-slate-300 shadow-sm transition cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-600" />
            <span>Chỉnh sửa hồ sơ</span>
          </button>

          <div className="hidden sm:flex items-center gap-1.5 text-xs">
            <span className="text-slate-500">Mã định danh:</span>
            <span className="font-mono font-bold bg-slate-200/80 px-2 py-0.5 rounded text-slate-800">
              CIT-2026-9921
            </span>
          </div>
        </div>
      </div>

      {/* Hero Profile Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div 
              className="relative shrink-0 group cursor-pointer" 
              onClick={handleOpenEdit}
              title="Bấm để đổi ảnh đại diện"
            >
              <img
                src={profileData.avatar}
                alt={profileData.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-amber-400 shadow-xl group-hover:opacity-90 transition"
              />
              <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs font-bold text-white transition">
                <Camera className="w-5 h-5 text-amber-300" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-amber-500 text-slate-950 p-1.5 rounded-xl font-bold text-xs shadow flex items-center gap-1 border border-white/20">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{reputationScore}đ</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {profileData.name}
                </h1>
                
                <button
                  type="button"
                  onClick={handleOpenEdit}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white rounded-lg text-xs font-semibold border border-slate-700 hover:border-amber-400 transition cursor-pointer shadow-sm"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sửa thông tin</span>
                </button>
              </div>

              <p className="text-xs text-slate-400 font-medium">
                Bút danh: <span className="text-slate-200">{profileData.penName}</span> • Thành viên từ: {profileData.joinedDate}
              </p>

              <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-y-1.5 gap-x-4 text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>{profileData.phone}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>{profileData.email}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-400" />
                  <span>{profileData.address}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Submission Action */}
          <div className="w-full md:w-auto shrink-0 flex flex-col gap-2">
            <button
              onClick={onOpenSubmitNews}
              className="w-full px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-red-950/50 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Flame className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>Gửi Tin Nóng Mới</span>
            </button>
            <span className="text-[11px] text-center text-slate-400">
              Mỗi tin đúng sự thật được cộng +20đ uy tín
            </span>
          </div>
        </div>
      </div>

      {/* CORE HIGHLIGHT: CARD ĐIỂM UY TÍN & XIN XÉT DUYỆT CỘNG TÁC VIÊN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Điểm uy tín Card (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                Chỉ Số Tín Nhiệm Báo Chí
              </span>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Award className="w-6 h-6 text-amber-500" />
                ĐIỂM UY TÍN CÔNG DÂN (REPUTATION SCORE)
              </h2>
            </div>

            <div className="text-right">
              <span className="text-3xl font-black text-slate-900 font-mono">
                {reputationScore}
              </span>
              <span className="text-sm font-bold text-slate-400">/100</span>
            </div>
          </div>

          {/* Score Gauge / Progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-600">Thang đo mức độ tin cậy nguồn tin</span>
              <span className="text-amber-600 font-mono">{reputationScore}% Tối đa</span>
            </div>
            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${reputationScore}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>0đ (Mới tạo)</span>
              <span>50đ (Cơ bản)</span>
              <span className="text-amber-600 font-bold">80đ (Mốc xét duyệt CTV)</span>
              <span className="text-emerald-600 font-bold">100đ (Tối đa)</span>
            </div>
          </div>

          {/* Breakdown breakdown list */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Lịch sử tích lũy điểm uy tín:
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <strong className="text-slate-900">Tin sạt lở đèo Prenn (TN-2026-8891)</strong>
                    <div className="text-[11px] text-slate-500">CTV xác thực đúng 100% & Báo xuất bản bài viết</div>
                  </div>
                </div>
                <span className="font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-xs">
                  +30 Điểm
                </span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <strong className="text-slate-900">Ổ gà ngã tư Hoàng Hoa Thám (TN-2026-3398)</strong>
                    <div className="text-[11px] text-slate-500">Thông tin phản ánh chính xác, cơ quan đã giặm vá</div>
                  </div>
                </div>
                <span className="font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-xs">
                  +25 Điểm
                </span>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Compass className="w-4 h-4 text-blue-600 shrink-0" />
                  <div>
                    <strong className="text-slate-900">Cung cấp tọa độ GPS thực địa & Video sắc nét</strong>
                    <div className="text-[11px] text-slate-500">Giúp phóng viên tiếp cận hiện trường nhanh dưới 20 phút</div>
                  </div>
                </div>
                <span className="font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded text-xs">
                  +20 Điểm
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-slate-600 shrink-0" />
                  <div>
                    <strong className="text-slate-900">Xác thực số định danh CCCD chính chủ</strong>
                    <div className="text-[11px] text-slate-500">Đã đối chiếu với Cổng thông tin xác thực dân cư</div>
                  </div>
                </div>
                <span className="font-mono font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded text-xs">
                  +20 Điểm
                </span>
              </div>
            </div>
          </div>

          {/* Rule note */}
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong>Quy chế điểm uy tín:</strong> Điểm uy tín phản ánh mức độ xác thực của các tin báo bạn đã gửi. Khi đạt từ <strong>80 điểm trở lên</strong>, bạn được quyền nộp đơn xin cấp thẻ Cộng tác viên (CTV) tác nghiệp thực địa cho Tòa soạn.
            </div>
          </div>
        </div>

        {/* Right Column: CTA Xin xét duyệt Cộng tác viên (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* CTV Application Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-red-950 rounded-3xl p-6 sm:p-7 border border-red-900/40 text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                  CƠ HỘI NGHỀ NGHIỆP BÁO CHÍ
                </span>
                <span className="text-xs text-amber-300 font-bold">
                  {isEligibleForCTV ? '✓ ĐỦ ĐIỀU KIỆN' : 'CHƯA ĐỦ ĐIỂM'}
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  XÉT DUYỆT CỘNG TÁC VIÊN HIỆN TRƯỜNG (CTV)
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Trở thành CTV chính thức của Tòa soạn Tin Nóng Dân Sinh: Được cấp thẻ tác nghiệp điện tử, nhận tin phân công độc quyền theo khu vực và hưởng nhuận bút tác phẩm hấp dẫn.
                </p>
              </div>

              {/* Status if already applied */}
              {ctvApplication ? (
                <div className="p-4 rounded-2xl bg-amber-950/60 border border-amber-500/50 space-y-2">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase">
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>Hồ Sơ Đang Trong Quy Trình Thẩm Định</span>
                  </div>
                  <div className="text-xs text-slate-200">
                    Mã hồ sơ CTV: <strong className="text-amber-400 font-mono">{ctvApplication.applicationCode}</strong>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Ngày nộp đơn: {ctvApplication.submittedAt} • Ban Trị Sự & Điều Phối Phóng Viên đang xem xét chuyên môn.
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Điểm uy tín: <strong>{reputationScore}/100</strong> (Yêu cầu: ≥ 80đ)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Có phương tiện & thiết bị ghi hình tại chỗ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Cam kết chuẩn mực đạo đức người làm báo</span>
                  </div>
                </div>
              )}
            </div>

            {/* BUTTON XIN XÉT DUYỆT CỘNG TÁC VIÊN */}
            <div className="pt-6">
              <button
                onClick={onOpenApplyCTV}
                className="w-full py-4 px-6 bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:from-red-500 hover:to-amber-500 text-white rounded-2xl font-black text-sm sm:text-base tracking-wide shadow-xl shadow-red-950/80 hover:shadow-red-700/40 border border-amber-400/50 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer group"
              >
                <Camera className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform" />
                <span>
                  {ctvApplication ? 'XEM LẠI / CẬP NHẬT ĐƠN XÉT DUYỆT CTV' : 'XIN XÉT DUYỆT CỘNG TÁC VIÊN'}
                </span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-[11px] text-center text-slate-400 mt-2">
                Hồ sơ xét duyệt được Ban Lãnh đạo Tòa soạn thẩm định trong 24h
              </p>
            </div>
          </div>

          {/* EXPERT APPLICATION CARD */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-7 border border-indigo-500/40 text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/30 text-indigo-300 border border-indigo-400/40">
                  HỘI ĐỒNG PHẢN BIỆN CHUYÊN MÔN
                </span>
                <span className="text-xs text-indigo-300 font-bold">
                  {expertApplication?.status === 'APPROVED' ? '✓ ĐÃ KIỂM ĐỊNH' : 'MỞ XÉT DUYỆT'}
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  XÉT DUYỆT CHUYÊN GIA BÁO CHÍ
                </h3>
                <p className="text-xs text-indigo-200/80 mt-2 leading-relaxed">
                  Dành cho các học giả, nhà nghiên cứu, luật sư và kỹ sư đầu ngành: Mở quyền <strong>viết bài phân tích chuyên sâu</strong>, <strong>theo dõi tiến độ tòa soạn</strong> và <strong>chỉnh sửa bài viết</strong> trực tiếp với Ban Biên Tập.
                </p>
              </div>

              {expertApplication && expertApplication.status === 'APPROVED' ? (
                <div className="p-3.5 rounded-2xl bg-indigo-900/60 border border-indigo-400/50 space-y-1.5 text-xs text-indigo-100">
                  <div className="flex items-center gap-2 font-bold text-amber-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Đã Được Cấp Quyền Chuyên Gia Chính Thức</span>
                  </div>
                  <div>Học hàm: <strong>{expertApplication.academicTitle}</strong></div>
                  <div className="text-[11px] text-indigo-200">Đơn vị: {expertApplication.organization}</div>
                </div>
              ) : (
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Học vị Thạc sĩ, Tiến sĩ hoặc chuyên gia trên 5 năm kinh nghiệm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Được hưởng mức nhuận bút Chuyên Gia theo khung đặc biệt</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Toàn quyền sử dụng chức năng Người dân + Viết bài phân tích</span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-5">
              <button
                onClick={onOpenApplyExpert}
                className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-black text-sm sm:text-base tracking-wide shadow-xl shadow-indigo-950/80 hover:shadow-indigo-700/40 border border-indigo-300/40 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer group"
              >
                <GraduationCap className="w-5 h-5 text-indigo-200 group-hover:rotate-12 transition-transform" />
                <span>
                  {expertApplication?.status === 'APPROVED' ? 'VÀO BÀN TÁC NGHIỆP CHUYÊN GIA' : 'XÉT DUYỆT CHUYÊN GIA NGAY'}
                </span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Badges Box */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Huy Hiệu Đạt Được ({profileData.badges?.length || 4})
            </h4>

            <div className="grid grid-cols-2 gap-2.5">
              {(profileData.badges || []).map((b, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-left space-y-1"
                >
                  <div className="text-base">{b.icon}</div>
                  <div className="font-bold text-slate-900 text-xs">{b.label}</div>
                  <div className="text-[10px] text-slate-500 leading-tight line-clamp-2">
                    {b.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: LỊCH SỬ TIN BÁO DÂN SINH ĐÃ GỬI */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
              Theo Dõi Tiến Trình
            </span>
            <h3 className="text-xl font-black text-slate-900">
              CÁC TIN BÁO & PHẢN ÁNH DO BẠN ĐÃ CUNG CẤP
            </h3>
          </div>
          <div className="text-xs text-slate-500">
            Tổng cộng: <strong className="text-slate-900">{citizenSubmissions.length}</strong> vụ việc ({filteredCitizenSubmissions.length} hiển thị)
          </div>
        </div>

        {/* Filter controls: Lọc theo loại nhiệm vụ và trạng thái */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="font-bold text-slate-600 mr-1">Lọc theo loại tin:</span>
            <button
              type="button"
              onClick={() => setCategoryFilter('ALL')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                categoryFilter === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Tất cả loại ({citizenSubmissions.length})
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('TIN_NONG')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                categoryFilter === 'TIN_NONG'
                  ? 'bg-red-600 text-white'
                  : 'bg-white border border-slate-200 text-red-700 hover:bg-red-50'
              }`}
            >
              🚨 Tin nóng ({citizenSubmissions.filter(s => (s.category || 'TIN_NONG') === 'TIN_NONG').length})
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('KHIEU_NAI')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                categoryFilter === 'KHIEU_NAI'
                  ? 'bg-amber-600 text-white'
                  : 'bg-white border border-slate-200 text-amber-800 hover:bg-amber-50'
              }`}
            >
              📋 Khiếu nại ({citizenSubmissions.filter(s => s.category === 'KHIEU_NAI').length})
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-slate-600 mr-1">Trạng thái:</span>
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                statusFilter === 'ALL'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Tất cả
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('PENDING')}
              className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                statusFilter === 'PENDING'
                  ? 'bg-amber-600 text-white'
                  : 'bg-white border border-slate-200 text-amber-700 hover:bg-amber-50'
              }`}
            >
              Đang thụ lý
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('PUBLISHED')}
              className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                statusFilter === 'PUBLISHED'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border border-slate-200 text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              Đã xuất bản
            </button>
          </div>
        </div>

        {filteredCitizenSubmissions.length === 0 ? (
          <div className="text-center py-10 text-slate-500 space-y-3">
            <p className="text-sm">Không tìm thấy tin báo nào phù hợp với bộ lọc.</p>
            <button
              onClick={() => {
                setCategoryFilter('ALL');
                setStatusFilter('ALL');
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCitizenSubmissions.map((sub) => {
              const isPublished = sub.stage === 'PUBLISHED';
              const isKhieuNai = sub.category === 'KHIEU_NAI';
              return (
                <div
                  key={sub.id}
                  onClick={() => onSelectSubmission(sub)}
                  className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-red-600 bg-red-100/80 px-2 py-0.5 rounded">
                        {sub.trackingCode}
                      </span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        isKhieuNai ? 'bg-amber-100 text-amber-900' : 'bg-red-100 text-red-900'
                      }`}>
                        {isKhieuNai ? 'Khiếu nại dân sinh' : 'Tin nóng khẩn cấp'}
                      </span>
                      <span className="text-xs font-extrabold uppercase px-2 py-0.5 rounded bg-slate-800 text-amber-300">
                        {sub.priority} ({sub.totalScore}đ)
                      </span>
                      {isPublished ? (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Đã Xác Minh & Xuất Bản
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Đang Thụ Lý ({sub.stage})
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-1">
                      {sub.title}
                    </h4>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {sub.location}
                      </span>
                      <span>•</span>
                      <span>Thời điểm gửi: {sub.createdAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                    <div className="text-right">
                      <div className="text-xs font-bold text-emerald-600 font-mono">+25đ Uy Tín</div>
                      <div className="text-[10px] text-slate-400">Đã cộng vào hồ sơ</div>
                    </div>
                    <span className="text-xs font-bold text-red-600 group-hover:translate-x-1 transition-transform flex items-center">
                      Xem chi tiết <ChevronRight className="w-4 h-4 ml-0.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL CHỈNH SỬA THÔNG TIN HỒ SƠ */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Chỉnh Sửa Thông Tin Cá Nhân
                  </h3>
                  <p className="text-xs text-slate-500">
                    Cập nhật số điện thoại, địa chỉ, email và ảnh đại diện
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveProfile} className="p-6 overflow-y-auto space-y-5 flex-1">
              {/* Avatar section */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">
                  Ảnh đại diện (Avatar) *
                </label>

                <div className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={editAvatar}
                      alt="Xem trước ảnh"
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';
                      }}
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <input
                      type="url"
                      value={editAvatar}
                      onChange={(e) => setEditAvatar(e.target.value)}
                      placeholder="Dán đường dẫn ảnh URL (https://...)"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
                    />

                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer border border-slate-200 transition">
                        <Upload className="w-3.5 h-3.5 text-slate-600" />
                        <span>Tải ảnh từ máy</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarFileUpload}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[11px] text-slate-400">hoặc chọn mẫu:</span>
                    </div>
                  </div>
                </div>

                {/* Quick preset avatars */}
                <div className="flex items-center gap-2 pt-1 overflow-x-auto pb-1">
                  {PRESET_AVATARS.map((av, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setEditAvatar(av.url)}
                      className={`relative rounded-xl overflow-hidden border-2 transition cursor-pointer shrink-0 ${
                        editAvatar === av.url ? 'border-amber-500 ring-2 ring-amber-400/40' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={av.url} alt={av.label} className="w-10 h-10 object-cover" />
                      {editAvatar === av.url && (
                        <div className="absolute inset-0 bg-amber-500/30 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Số điện thoại liên hệ *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="Ví dụ: 0918.442.119"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Số điện thoại để Tòa soạn gửi mã OTP và liên hệ xác minh thông tin.
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Địa chỉ Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="Ví dụ: minhtri.dalat@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              {/* Địa chỉ nơi ở */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Địa chỉ nơi ở hiện tại *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    placeholder="Ví dụ: Số 18 Đường Trần Phú, Phường 3, TP. Đà Lạt"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              {/* Họ tên & Bút danh */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none font-medium"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-500">
                      Bút danh tác nghiệp
                    </label>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1 font-semibold">
                      <Lock className="w-3 h-3 text-slate-400" /> Cố định (Không được sửa)
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      disabled
                      value={profileData.penName || ''}
                      title="Bút danh cố định gắn liền với mã định danh hồ sơ công dân, không được tự ý sửa đổi"
                      className="w-full pl-3 pr-8 py-2 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 font-medium cursor-not-allowed select-none"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5" />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Bút danh do Tòa soạn bảo trợ định danh, công dân không thể tự sửa.
                  </p>
                </div>
              </div>

              {/* Modal Footer actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-900/30 transition cursor-pointer"
                >
                  Lưu Thay Đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

