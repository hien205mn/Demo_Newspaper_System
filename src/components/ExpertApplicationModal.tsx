import React, { useState } from 'react';
import { 
  X, 
  GraduationCap, 
  Award, 
  Building2, 
  BookOpen, 
  CheckCircle2, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  FileText,
  User,
  Phone,
  Mail,
  ExternalLink
} from 'lucide-react';
import { ExpertApplication } from '../types';

interface ExpertApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApproveAndSwitch: (app: ExpertApplication) => void;
  existingApplication?: ExpertApplication | null;
  citizenName?: string;
  citizenPhone?: string;
  citizenEmail?: string;
}

const EXPERTISE_FIELDS = [
  'Quy hoạch đô thị & Hạ tầng',
  'Môi trường & Biến đổi khí hậu',
  'Pháp lý & Quyền dân sinh',
  'Giao thông công cộng & An toàn giao thông',
  'Kinh tế vĩ mô & Bất động sản',
  'An ninh mạng & Kinh tế số',
  'Y tế công cộng & An toàn thực phẩm',
  'Giáo dục & Xã hội'
];

const ACADEMIC_TITLES = [
  'PGS. TS (Phó Giáo sư, Tiến sĩ)',
  'TS (Tiến sĩ khoa học)',
  'Thạc sĩ chuyên ngành',
  'Luật sư cao cấp',
  'Kỹ sư trưởng / Kiến trúc sư trưởng',
  'Chuyên gia phản biện độc lập'
];

export const ExpertApplicationModal: React.FC<ExpertApplicationModalProps> = ({
  isOpen,
  onClose,
  onApproveAndSwitch,
  existingApplication,
  citizenName = 'Phạm Minh Trí',
  citizenPhone = '0918.442.119',
  citizenEmail = 'minhtri.dalat@gmail.com',
}) => {
  const [name, setName] = useState(existingApplication?.citizenName || citizenName);
  const [phone, setPhone] = useState(existingApplication?.phone || citizenPhone);
  const [email, setEmail] = useState(existingApplication?.email || citizenEmail);
  const [academicTitle, setAcademicTitle] = useState(
    existingApplication?.academicTitle || 'TS (Tiến sĩ khoa học)'
  );
  const [organization, setOrganization] = useState(
    existingApplication?.organization || 'Viện Nghiên cứu Đô thị & Thủy văn Biến đổi Khí hậu'
  );
  const [bio, setBio] = useState(
    existingApplication?.bio ||
      'Hơn 12 năm kinh nghiệm nghiên cứu thủy văn đô thị và chính sách thích ứng biến đổi khí hậu tại các tỉnh miền Trung và Tây Nguyên.'
  );
  const [portfolioUrl, setPortfolioUrl] = useState(
    existingApplication?.portfolioUrl || 'https://scholar.google.com/citations?user=vietnam_urban'
  );
  const [selectedFields, setSelectedFields] = useState<string[]>(
    existingApplication?.fieldSpecialties || [
      'Quy hoạch đô thị & Hạ tầng',
      'Môi trường & Biến đổi khí hậu'
    ]
  );
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const toggleField = (field: string) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  const handleQuickApprove = (e: React.FormEvent) => {
    e.preventDefault();
    const app: ExpertApplication = {
      id: existingApplication?.id || `exp-app-${Date.now()}`,
      code: existingApplication?.code || `EXP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      citizenName: name,
      phone,
      email,
      academicTitle,
      organization,
      fieldSpecialties: selectedFields.length > 0 ? selectedFields : ['Quy hoạch đô thị & Hạ tầng'],
      bio,
      portfolioUrl,
      status: 'APPROVED',
      submittedAt: existingApplication?.submittedAt || new Date().toISOString().replace('T', ' ').slice(0, 16),
      approvedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    setIsSuccess(true);
    setTimeout(() => {
      onApproveAndSwitch(app);
      setIsSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-scale-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shadow-md">
              <GraduationCap className="w-7 h-7 text-indigo-400" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 text-[10px] font-bold uppercase tracking-wider border border-indigo-500/40">
                <Sparkles className="w-3 h-3" />
                Đặc Quyền Tác Nghiệp Báo Chí
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
                XÉT DUYỆT & KÍCH HOẠT VAI TRÒ CHUYÊN GIA
              </h2>
            </div>
          </div>
          <p className="text-xs text-indigo-200/80 mt-2 leading-relaxed">
            Chuyên gia là vai trò bao trọn toàn bộ tính năng của Người dân (gửi tin, tra cứu, theo dõi dân sinh) đồng thời mở khóa quyền năng <strong>viết bài phân tích chuyên sâu</strong>, <strong>theo dõi tiến độ duyệt bài</strong> và <strong>chỉnh sửa bài viết</strong> trực tiếp với Ban Biên Tập.
          </p>
        </div>

        {/* Success Alert */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">
              Đã Xét Duyệt & Kích Hoạt Thành Công!
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Hồ sơ của bạn đã được kiểm định chính thức. Đang chuyển đổi sang giao diện <strong>Chuyên gia</strong> với đầy đủ công cụ viết bài, theo dõi và chỉnh sửa bài viết...
            </p>
          </div>
        ) : (
          <form onSubmit={handleQuickApprove} className="p-6 sm:p-7 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Qualification Banner */}
            <div className="p-4 bg-indigo-50/80 rounded-2xl border border-indigo-100 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div className="text-xs text-indigo-950 leading-relaxed">
                <strong>Quy chuẩn xét duyệt:</strong> Dành cho các học giả, nhà nghiên cứu, luật sư, kỹ sư đầu ngành và các chuyên gia có uy tín xã hội tham gia phản biện chính sách và giải đáp vấn đề dân sinh cùng Tòa soạn.
              </div>
            </div>

            {/* Personal Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  Họ và tên chuyên gia
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-semibold text-slate-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                  Học hàm / Học vị / Chức danh
                </label>
                <select
                  value={academicTitle}
                  onChange={(e) => setAcademicTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-semibold text-slate-900 bg-white"
                >
                  {ACADEMIC_TITLES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  Cơ quan / Viện nghiên cứu / Tổ chức
                </label>
                <input
                  type="text"
                  required
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-900 bg-white"
                  placeholder="Ví dụ: Viện Hàn lâm KH&CN, Đại học Quốc gia..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  Số điện thoại xác thực
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono text-slate-900 bg-white"
                />
              </div>
            </div>

            {/* Field Specialties */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                Lĩnh vực chuyên môn phản biện (Chọn một hoặc nhiều)
              </label>
              <div className="flex flex-wrap gap-2">
                {EXPERTISE_FIELDS.map((field) => {
                  const isSelected = selectedFields.includes(field);
                  return (
                    <button
                      type="button"
                      key={field}
                      onClick={() => toggleField(field)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      <span>{field}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Tóm tắt kinh nghiệm & Năng lực nghiên cứu
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xs text-slate-800 bg-white"
                placeholder="Mô tả các đề tài nghiên cứu, kinh nghiệm cố vấn hoặc các vụ việc dân sinh đã tham gia hỗ trợ..."
              />
            </div>

            {/* Portfolio Link */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                Liên kết bài viết / Hồ sơ khoa học (Google Scholar, ResearchGate, Website...)
              </label>
              <input
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xs text-slate-800 font-mono bg-white"
                placeholder="https://..."
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
              >
                Hủy bỏ
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-900/30 flex items-center justify-center gap-2 transition transform active:scale-95 cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-indigo-200" />
                <span>PHÊ DUYỆT & CHUYỂN SANG VAI TRÒ CHUYÊN GIA NGAY</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
