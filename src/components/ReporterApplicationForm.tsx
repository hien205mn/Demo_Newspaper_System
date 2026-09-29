import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Camera, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  MapPin, 
  Upload, 
  FileText, 
  Send, 
  Phone, 
  Mail, 
  User, 
  CreditCard, 
  AlertCircle, 
  Sparkles,
  Check,
  Building2,
  FileCheck2
} from 'lucide-react';
import { CTVApplication } from '../types';
import { VIETNAM_REGIONS } from '../data/criteria';

interface ReporterApplicationFormProps {
  onBack: () => void;
  onSubmitSuccess: (application: CTVApplication) => void;
  reputationScore?: number;
  initialApplication?: CTVApplication | null;
}

export const ReporterApplicationForm: React.FC<ReporterApplicationFormProps> = ({
  onBack,
  onSubmitSuccess,
  reputationScore = 95,
  initialApplication,
}) => {
  // Form fields
  const [fullName, setFullName] = useState(initialApplication?.citizenName || 'Phạm Minh Trí');
  const [penName, setPenName] = useState(initialApplication?.penName || 'Minh Trí');
  const [phone, setPhone] = useState(initialApplication?.citizenPhone || '0918.442.119');
  const [email, setEmail] = useState(initialApplication?.citizenEmail || 'minhtri.dalat@gmail.com');
  const [idCard, setIdCard] = useState(initialApplication?.citizenIdCard || '068096001824');
  const [birthDate, setBirthDate] = useState(initialApplication?.birthDate || '1992-08-15');
  
  const [selectedProvince, setSelectedProvince] = useState(initialApplication?.province || 'Lâm Đồng');
  const [selectedDistrict, setSelectedDistrict] = useState(initialApplication?.district || 'TP. Đà Lạt');
  const [address, setAddress] = useState(initialApplication?.address || 'Số 18 Đường Trần Phú, Phường 3, TP. Đà Lạt');

  const [profession, setProfession] = useState(initialApplication?.profession || 'Nhiếp ảnh gia tự do & Hướng dẫn viên du lịch');
  const [education, setEducation] = useState(initialApplication?.education || 'Đại học - Chuyên ngành Truyền thông Đa phương tiện');

  // Specialties
  const [specialties, setSpecialties] = useState<string[]>(
    initialApplication?.fieldSpecialties || [
      'Thời sự - Cứu hộ - Tai nạn - Thiên tai',
      'Đời sống - Dân sinh - Hạ tầng đô thị',
      'Môi trường - Rác thải - Ô nhiễm'
    ]
  );

  // Equipment
  const [equipmentList, setEquipmentList] = useState<string[]>(
    initialApplication?.equipment || [
      'Máy ảnh chuyên dụng (Sony A7 IV / Canon EOS)',
      'Smartphone quay 4K chống rung',
      'Flycam/Drone tác nghiệp trên cao',
      'Xe máy/Ô tô cơ động tiếp cận hiện trường nhanh'
    ]
  );

  const [experienceDescription, setExperienceDescription] = useState(
    initialApplication?.experienceDescription || 
    'Đã từng cộng tác gửi tin ảnh cho Báo Lâm Đồng và cổng Dân sinh. Thường xuyên di chuyển trên các cung đèo và khu vực Tây Nguyên, có thể tiếp cận nhanh các điểm sạt lở, cứu nạn trong vòng 20 phút.'
  );

  const [portfolioLinks, setPortfolioLinks] = useState(
    initialApplication?.portfolioLinks || 'https://drive.google.com/drive/folders/samples-dalat-reporter-portfolio'
  );

  const [hasAgreedTerms, setHasAgreedTerms] = useState(true);
  const [hasAgreedEmergencyDuty, setHasAgreedEmergencyDuty] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<CTVApplication | null>(null);

  const currentDistricts = VIETNAM_REGIONS.find((r) => r.province === selectedProvince)?.districts || [
    'TP. Đà Lạt', 'TP. Bảo Lộc', 'Đức Trọng', 'Di Linh'
  ];

  const toggleSpecialty = (item: string) => {
    setSpecialties((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleEquipment = (item: string) => {
    setEquipmentList((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasAgreedTerms) {
      alert('Vui lòng đồng ý với cam kết đạo đức báo chí trước khi gửi đơn.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const codeDigits = Math.floor(1000 + Math.random() * 9000);
      const appCode = `CTV-2026-${codeDigits}`;
      const newApp: CTVApplication = {
        id: `ctv-app-${Date.now()}`,
        applicationCode: appCode,
        citizenName: fullName,
        penName: penName || fullName,
        citizenPhone: phone,
        citizenEmail: email,
        citizenIdCard: idCard,
        birthDate,
        address,
        province: selectedProvince,
        district: selectedDistrict,
        profession,
        education,
        fieldSpecialties: specialties,
        equipment: equipmentList,
        experienceDescription,
        portfolioLinks,
        submittedAt: new Date().toLocaleString('sv-SE').slice(0, 16).replace('T', ' '),
        reputationScoreAtApplication: reputationScore,
        status: 'PENDING_REVIEW',
        reviewNote: 'Hồ sơ đạt điểm tín nhiệm cao (95đ). Đã chuyển Ban Trị Sự & Điều Phối Phóng Viên thẩm định cấp thẻ tác nghiệp.',
      };

      setIsSubmitting(false);
      setSubmittedResult(newApp);
      onSubmitSuccess(newApp);
    }, 700);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 transition cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Hồ Sơ Công Dân</span>
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Tiêu chuẩn tín nhiệm:</span>
          <span className="font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded">
            Uy Tín: {reputationScore}/100đ (ĐỦ ĐIỀU KIỆN)
          </span>
        </div>
      </div>

      {/* Success Notification View */}
      {submittedResult ? (
        <div className="bg-white rounded-lg p-8 sm:p-10 border border-emerald-200 shadow-xl text-center space-y-6 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <FileCheck2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
              Nộp Đơn Thành Công
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              ĐƠN XIN XÉT DUYỆT CỘNG TÁC VIÊN ĐÃ ĐƯỢC TIẾP NHẬN!
            </h2>
            <p className="text-slate-600 text-sm max-w-xl mx-auto leading-relaxed">
              Hồ sơ đăng ký CTV hiện trường của bạn đã chuyển tới <strong>Ban Trị Sự & Trung Tâm Điều Phối Phóng Viên</strong>. Ban Biên Tập sẽ thẩm định và phản hồi kết quả trong vòng 24 - 48 giờ làm việc.
            </p>
          </div>

          <div className="bg-slate-50 rounded-lg p-6 border border-slate-200 text-left max-w-xl mx-auto space-y-3.5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase">Mã Hồ Sơ Xét Duyệt CTV:</span>
              <span className="font-mono text-xl font-black text-red-600 tracking-wider">
                {submittedResult.applicationCode}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500">Họ tên ứng viên:</span>
                <div className="font-bold text-slate-900">{submittedResult.citizenName}</div>
              </div>
              <div>
                <span className="text-slate-500">Bút danh tác nghiệp:</span>
                <div className="font-bold text-slate-900">{submittedResult.penName}</div>
              </div>
              <div>
                <span className="text-slate-500">Địa bàn đăng ký:</span>
                <div className="font-bold text-slate-900">{submittedResult.district}, {submittedResult.province}</div>
              </div>
              <div>
                <span className="text-slate-500">Điểm uy tín tích lũy:</span>
                <div className="font-bold text-emerald-600">{submittedResult.reputationScoreAtApplication}/100đ</div>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-600 bg-white p-3.5 rounded-xl border border-slate-200">
              <strong className="text-slate-900">Quy trình cấp thẻ CTV:</strong> Sau khi xét duyệt, Tòa soạn sẽ cấp <em>Mã thẻ CTV điện tử</em> tích hợp mã QR xác thực và liên kết tài khoản để bạn nhận lệnh điều phối trực tiếp từ Biên tập viên trực ban.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={onBack}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition cursor-pointer shadow-md"
            >
              Xem Trạng Thái Trong Hồ Sơ Cá Nhân
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-red-950 rounded-lg p-6 sm:p-8 text-white shadow-xl border border-red-900/40 relative overflow-hidden">
            <div className="relative z-10 max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/30 border border-red-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Camera className="w-3.5 h-3.5" />
                Tuyển Chọn Phóng Viên & Cộng Tác Viên Thực Địa 2026
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                ĐƠN ĐĂNG KÝ XÉT DUYỆT CỘNG TÁC VIÊN BÁO CHÍ
              </h1>

              <p className="text-sm text-slate-300 leading-relaxed">
                Tòa soạn Báo điện tử <strong>Tin Nóng Dân Sinh</strong> trân trọng mời các công dân có uy tín cao, tinh thần trách nhiệm và năng lực tác nghiệp hiện trường gia nhập mạng lưới CTV chính thức tại 63 tỉnh thành.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Cấp thẻ CTV tác nghiệp
                </span>
                <span className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" /> Nhuận bút tin bài hấp dẫn
                </span>
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-slate-400" /> Tòa soạn bảo trợ pháp lý
                </span>
              </div>
            </div>
          </div>

          {/* Section 1: Thông tin nhân thân & Địa bàn tác nghiệp */}
          <div className="bg-white rounded-lg p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Thông Tin Nhân Thân & Địa Bàn Tác Nghiệp Thường Trực
                </h3>
                <p className="text-xs text-slate-500">
                  Địa bàn để Ban Biên tập phát lệnh điều động khẩn cấp khi có tin nóng xảy ra
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Họ và tên ứng viên (theo CCCD) *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Bút danh mong muốn đứng tên bài viết *
                </label>
                <input
                  type="text"
                  required
                  value={penName}
                  onChange={(e) => setPenName(e.target.value)}
                  placeholder="Ví dụ: Minh Trí, Trí Lâm Đồng, Hải Đăng..."
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Số điện thoại liên hệ tác nghiệp 24/7 *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hộp thư điện tử (Email nhận thông báo tác nghiệp) *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Số Căn Cước Công Dân (CCCD) *
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={idCard}
                    onChange={(e) => setIdCard(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ngày sinh *
                </label>
                <input
                  type="date"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tỉnh / Thành phố đăng ký tác nghiệp chính *
                </label>
                <select
                  value={selectedProvince}
                  onChange={(e) => {
                    setSelectedProvince(e.target.value);
                    const newDists = VIETNAM_REGIONS.find((r) => r.province === e.target.value)?.districts || [];
                    if (newDists.length > 0) setSelectedDistrict(newDists[0]);
                  }}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                >
                  {VIETNAM_REGIONS.map((r) => (
                    <option key={r.province} value={r.province}>
                      {r.province}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Quận / Huyện đăng ký thường trực *
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                >
                  {currentDistricts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Địa chỉ nơi cư trú hiện tại *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Chuyên môn, Trang thiết bị & Kinh nghiệm */}
          <div className="bg-white rounded-lg p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Năng Lực Chuyên Môn, Lĩnh Vực Đăng Ký & Thiết Bị Tác Nghiệp
                </h3>
                <p className="text-xs text-slate-500">
                  Cơ sở để phân loại đề tài và phối hợp trang thiết bị tác nghiệp thực địa
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nghề nghiệp / Công việc hiện tại *
                </label>
                <input
                  type="text"
                  required
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Trình độ học vấn / Chuyên ngành đào tạo *
                </label>
                <input
                  type="text"
                  required
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
            </div>

            {/* Specialties Checkboxes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Các mảng đề tài đăng ký tác nghiệp chuyên sâu (chọn ít nhất 1):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  'Thời sự - Cứu hộ - Tai nạn - Thiên tai',
                  'Đời sống - Dân sinh - Hạ tầng đô thị',
                  'Môi trường - Rác thải - Ô nhiễm',
                  'Tiêu cực - Điều tra - Khiếu nại bạn đọc',
                  'An toàn giao thông & Trật tự xã hội',
                  'Văn hóa - Giáo dục - Y tế cộng đồng'
                ].map((spec) => {
                  const isChecked = specialties.includes(spec);
                  return (
                    <button
                      type="button"
                      key={spec}
                      onClick={() => toggleSpecialty(spec)}
                      className={`p-3 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition cursor-pointer ${
                        isChecked
                          ? 'bg-red-50 border-red-500 text-red-900 font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>{spec}</span>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ml-2 ${
                        isChecked ? 'bg-red-600 border-red-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Equipment Checkboxes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Phương tiện & Trang thiết bị tác nghiệp sở hữu:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  'Máy ảnh chuyên dụng (Sony A7 IV / Canon EOS)',
                  'Smartphone quay 4K chống rung',
                  'Flycam/Drone tác nghiệp trên cao',
                  'Xe máy/Ô tô cơ động tiếp cận hiện trường nhanh',
                  'Máy ghi âm / Mic thu âm hiện trường',
                  'Laptop / Máy tính bảng biên tập nhanh tại chỗ'
                ].map((eq) => {
                  const isChecked = equipmentList.includes(eq);
                  return (
                    <button
                      type="button"
                      key={eq}
                      onClick={() => toggleEquipment(eq)}
                      className={`p-3 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition cursor-pointer ${
                        isChecked
                          ? 'bg-slate-50 border-slate-500 text-slate-900 font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>{eq}</span>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ml-2 ${
                        isChecked ? 'bg-slate-600 border-slate-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kinh nghiệm tác nghiệp / Giới thiệu năng lực bản thân *
              </label>
              <textarea
                rows={3}
                required
                value={experienceDescription}
                onChange={(e) => setExperienceDescription(e.target.value)}
                placeholder="Mô tả kinh nghiệm ghi hình, chụp ảnh, viết bài phản ánh hoặc sự quen thuộc địa bàn..."
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-red-500 outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Đường dẫn portfolio / Bài viết, hình ảnh tác phẩm mẫu (nếu có)
              </label>
              <input
                type="url"
                value={portfolioLinks}
                onChange={(e) => setPortfolioLinks(e.target.value)}
                placeholder="https://drive.google.com/... hoặc link bài báo đã đăng"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
          </div>

          {/* Section 3: Cam kết Đạo đức báo chí */}
          <div className="bg-white rounded-lg p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Cam Kết Chuẩn Mực Đạo Đức & Quy Chế Tác Nghiệp Của Tòa Soạn
                </h3>
                <p className="text-xs text-slate-500">
                  Tuân thủ Luật Báo chí 2016 và quy định bảo vệ danh dự nghề nghiệp
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-200 leading-relaxed">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={hasAgreedTerms}
                  onChange={(e) => setHasAgreedTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500 cursor-pointer"
                />
                <span>
                  <strong>Cam kết trung thực & khách quan:</strong> Tôi cam kết mọi thông tin, hình ảnh và tư liệu cung cấp cho Tòa soạn đều là sự thật diễn ra tại hiện trường, không dàn dựng, không xuyên tạc, chịu hoàn toàn trách nhiệm trước pháp luật.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={hasAgreedEmergencyDuty}
                  onChange={(e) => setHasAgreedEmergencyDuty(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500 cursor-pointer"
                />
                <span>
                  <strong>Chấp hành lệnh điều động tác nghiệp:</strong> Khi nhận được thông báo điều phối tin nóng khẩn cấp trên địa bàn đăng ký, tôi sẵn sàng phối hợp tiếp cận hiện trường xác minh và gửi báo cáo cho Ban Biên Tập.
                </span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={onBack}
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-sm font-bold border border-slate-300 transition cursor-pointer"
            >
              Hủy Bỏ & Quay Lại Hồ Sơ
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:from-red-500 hover:to-amber-500 text-white rounded-lg text-base font-black tracking-wide shadow-xl shadow-red-950/60 flex items-center justify-center gap-3 transition-all transform active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-5 h-5 text-amber-300" />
              <span>{isSubmitting ? 'ĐANG GỬI HỒ SƠ...' : 'GỬI ĐƠN XIN XÉT DUYỆT CỘNG TÁC VIÊN'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
