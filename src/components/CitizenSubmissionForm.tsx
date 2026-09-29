import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  Image as ImageIcon, 
  Video, 
  Trash2, 
  MapPin, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  Compass, 
  Flame,
  Info,
  ExternalLink,
  FileText
} from 'lucide-react';
import { MediaAttachment, Submission, PriorityLevel } from '../types';
import { IMPACT_CATEGORIES, calculatePriority, VIETNAM_REGIONS } from '../data/criteria';

interface CitizenSubmissionFormProps {
  onBack: () => void;
  onSubmitSuccess: (newSubmission: Submission) => void;
}

export const CitizenSubmissionForm: React.FC<CitizenSubmissionFormProps> = ({
  onBack,
  onSubmitSuccess,
}) => {
  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'TIN_NONG' | 'KHIEU_NAI'>('TIN_NONG');
  const [description, setDescription] = useState('');
  const [locationDetail, setLocationDetail] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('Hà Nội');
  const [selectedDistrict, setSelectedDistrict] = useState('Nam Từ Liêm');
  const [ward, setWard] = useState('Phường Mỹ Đình 1');
  const [gpsCoordinates, setGpsCoordinates] = useState('');
  const [isGettingGps, setIsGettingGps] = useState(false);
  const [incidentTime, setIncidentTime] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  });

  // Citizen info
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [citizenEmail, setCitizenEmail] = useState('');

  // Attachments
  const [attachments, setAttachments] = useState<MediaAttachment[]>([]);
  const [uploadCaption, setUploadCaption] = useState('');

  // 3 Criteria with Radio choices
  const [locationScore, setLocationScore] = useState<number>(20); // Default: Cấp Quận/Huyện (20đ)
  const [affectedScore, setAffectedScore] = useState<number>(30); // Default: Quy mô vừa (30đ)
  const [severityScore, setSeverityScore] = useState<number>(35); // Default: Ô nhiễm/Rủi ro cao (35đ)

  // Submitting state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<Submission | null>(null);

  // Total Impact Score calculation
  const totalScore = locationScore + affectedScore + severityScore;
  const priorityInfo = calculatePriority(totalScore);

  // Handle GPS Auto-detect
  const handleGetGps = () => {
    if (!navigator.geolocation) {
      alert('Trình duyệt của bạn không hỗ trợ định vị GPS.');
      return;
    }
    setIsGettingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsGettingGps(false);
        const lat = pos.coords.latitude.toFixed(4);
        const lng = pos.coords.longitude.toFixed(4);
        setGpsCoordinates(`${lat}° N, ${lng}° E`);
      },
      (err) => {
        setIsGettingGps(false);
        // Fallback default coordinate for demonstration
        setGpsCoordinates('21.0285° N, 105.8542° E (Tọa độ mẫu)');
      }
    );
  };

  // Add sample media for quick test
  const handleAddSampleMedia = (type: 'fire' | 'flood' | 'pollution') => {
    const samples = {
      fire: {
        id: `att-${Date.now()}-1`,
        name: 'hien_truong_chay_kho.jpg',
        type: 'image' as const,
        url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80',
        caption: 'Hiện trường sự cố được ghi lại trực tiếp',
      },
      flood: {
        id: `att-${Date.now()}-2`,
        name: 'ngap_ung_sau.jpg',
        type: 'image' as const,
        url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop&q=80',
        caption: 'Nước ngập cô lập tuyến đường dân sinh',
      },
      pollution: {
        id: `att-${Date.now()}-3`,
        name: 'xa_thai_den_ngom.jpg',
        type: 'image' as const,
        url: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=800&auto=format&fit=crop&q=80',
        caption: 'Dòng nước xả thải đen ngòm bốc mùi nồng nặc',
      },
    };

    setAttachments((prev) => [...prev, samples[type]]);
  };

  // Handle file input
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isVideo = file.type.startsWith('video/');
      const newAtt: MediaAttachment = {
        id: `att-${Date.now()}-${i}`,
        name: file.name,
        type: isVideo ? 'video' : 'image',
        url: URL.createObjectURL(file),
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        caption: uploadCaption || 'Tài liệu do người dân cung cấp',
      };
      setAttachments((prev) => [...prev, newAtt]);
    }
    setUploadCaption('');
  };

  // Remove attachment
  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  // Auto fill demo scenario
  const handleFillSampleIncident = () => {
    setTitle('Phát hiện nhà máy xả trộm nước thải màu tím ra kênh tưới tiêu nông nghiệp');
    setDescription('Vào khoảng 05h30 sáng nay, người dân thôn Thượng phát hiện ống cống ngầm đường kính 80cm của cụm công nghiệp liên tục phun nước màu tím sủi bọt trắng ra kênh mương nội đồng. Cá tôm chết trắng hàng loạt nổi trên mặt nước, mùi hóa chất hắc nồng nặc khiến người già và trẻ em bị tức ngực, khó thở.');
    setLocationDetail('Cống xả ngầm giáp mương tưới tiêu Cụm công nghiệp Nam Từ Liêm, Km 12');
    setSelectedProvince('Hà Nội');
    setSelectedDistrict('Nam Từ Liêm');
    setWard('Phường Tây Mỗ');
    setGpsCoordinates('21.0021° N, 105.7410° E');
    setCitizenName('Lê Văn Bảy (Trưởng xóm thôn Thượng)');
    setCitizenPhone('0912.778.899');
    setCitizenEmail('bay.levan@gmail.com');
    setIsAnonymous(false);
    
    // Set high criteria
    setLocationScore(20); // Cấp Quận/Huyện
    setAffectedScore(30); // Quy mô vừa (100 - 1000 người)
    setSeverityScore(35); // Ô nhiễm / An toàn / Rủi ro pháp lý cao -> Tổng 85đ (HIGH)
    
    handleAddSampleMedia('pollution');
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Vui lòng nhập tiêu đề vụ việc phản ánh.');
      return;
    }
    if (!description.trim()) {
      alert('Vui lòng nhập mô tả sơ bộ nội dung sự việc.');
      return;
    }
    if (!locationDetail.trim()) {
      alert('Vui lòng nhập vị trí cụ thể xảy ra sự việc.');
      return;
    }
    if (!citizenPhone.trim()) {
      alert('Vui lòng cung cấp số điện thoại liên hệ để Tòa soạn xác minh hoặc nhận mã OTP giải mật khi cần thiết.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Find selected labels
      const locOpt = IMPACT_CATEGORIES[0].options.find((o) => o.value === locationScore);
      const affOpt = IMPACT_CATEGORIES[1].options.find((o) => o.value === affectedScore);
      const sevOpt = IMPACT_CATEGORIES[2].options.find((o) => o.value === severityScore);

      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const trackingCode = `TN-2026-${randomDigits}`;

      const newSub: Submission = {
        id: `sub-${Date.now()}`,
        trackingCode,
        createdAt: new Date().toLocaleString('sv-SE').slice(0, 16).replace('T', ' '),
        category,
        title,
        description,
        location: `${locationDetail}, ${ward}, ${selectedDistrict}, ${selectedProvince}`,
        province: selectedProvince,
        district: selectedDistrict,
        ward,
        gpsCoordinates: gpsCoordinates || 'Chưa định vị',
        incidentTime,
        citizenName: isAnonymous ? 'Người báo tin ẩn danh' : (citizenName || 'Người dân phản ánh'),
        citizenPhone,
        citizenEmail,
        isAnonymous,
        attachments: attachments.length > 0 ? attachments : [
          {
            id: `att-${Date.now()}`,
            name: 'anh_hien_truong.jpg',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80',
            caption: 'Ảnh hiện trường do hệ thống ghi nhận'
          }
        ],
        locationScope: {
          score: locationScore,
          label: locOpt?.label || '',
        },
        affectedPopulation: {
          score: affectedScore,
          label: affOpt?.label || '',
        },
        severity: {
          score: severityScore,
          label: sevOpt?.label || '',
        },
        totalScore,
        priority: priorityInfo.level,
        // Workflow Rule: HIGH and BREAKING go to AWAITING_FIELD_ASSIGN, LOW/MEDIUM go to EDITOR_REVIEWING
        stage: (priorityInfo.level === 'HIGH' || priorityInfo.level === 'BREAKING')
          ? 'AWAITING_FIELD_ASSIGN'
          : 'EDITOR_REVIEWING',
      };

      setIsSubmitting(false);
      setSubmittedResult(newSub);
      onSubmitSuccess(newSub);
    }, 600);
  };

  const currentDistricts = VIETNAM_REGIONS.find((r) => r.province === selectedProvince)?.districts || [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 px-3.5 py-2 rounded-lg border border-slate-200 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Cổng Thông Tin</span>
        </button>

        <button
          type="button"
          onClick={handleFillSampleIncident}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 transition cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Điền nhanh vụ việc mẫu</span>
        </button>
      </div>

      {/* Success Modal / Banner when submitted */}
      {submittedResult ? (
        <div className="bg-white rounded-lg p-8 border border-emerald-200 shadow-xl text-center max-w-2xl mx-auto animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">
            GỬI TIN NÓNG THÀNH CÔNG!
          </h2>
          <p className="text-slate-600 text-sm mb-6">
            Thông tin đã được tiếp nhận vào hệ thống điều phối tác nghiệp của Tòa soạn Báo chí.
          </p>

          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-left mb-6 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase">Mã Hồ Sơ Tra Cứu:</span>
              <span className="font-mono text-lg font-black text-red-600 tracking-wider">
                {submittedResult.trackingCode}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">Tổng điểm Impact Score:</span>
              <span className="font-bold text-slate-900 text-sm">{submittedResult.totalScore}/130 điểm</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">Phân cấp mức độ:</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase border ${priorityInfo.bgLight} ${priorityInfo.color} ${priorityInfo.borderColor}`}>
                {priorityInfo.name}
              </span>
            </div>
            <div className="pt-2 text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200">
              <strong>Quy trình xử lý tiếp theo:</strong> {priorityInfo.workflowSummary}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onBack}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition cursor-pointer"
            >
              Về Trang Chủ Cổng Thông Tin
            </button>
            <button
              onClick={() => {
                setSubmittedResult(null);
                // Switch role to EDITOR to see how BTV handles it!
                const event = new CustomEvent('app:switch-role', { detail: 'EDITOR' });
                window.dispatchEvent(event);
              }}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-600 hover:bg-slate-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
            >
              <span>Xem BTV Tiếp Nhận & Xử Lý Tin Này</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Hero Form Header */}
          <div className="bg-gradient-to-r from-red-600 via-red-700 to-amber-700 rounded-lg p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 text-amber-200 text-xs font-bold uppercase tracking-wider mb-3">
                <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                Cổng Tiếp Nhận Báo Cáo Khẩn Cấp 24/7
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
                BÁO CÁO TIN NÓNG & TÍNH ĐIỂM TÁC ĐỘNG (IMPACT SCORE)
              </h1>
              <p className="text-red-100 text-sm leading-relaxed">
                Người dân cung cấp hình ảnh, video, ghi chú vị trí và chọn các tiêu chí đánh giá mức độ tác động.
                Hệ thống tòa soạn sẽ tự động phân loại mức độ và kích hoạt quy trình điều phối phóng viên/CTV tác nghiệp hiện trường.
              </p>
            </div>
          </div>

          {/* SECTION 1: MEDIA UPLOAD */}
          <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Đính kèm tài liệu hiện trường (Hình ảnh & Video)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Bằng chứng hình ảnh/video là căn cứ xác thực quan trọng nhất của tòa soạn
                  </p>
                </div>
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Đã tải lên: <span className="font-bold text-slate-900">{attachments.length}</span> tệp
              </div>
            </div>

            {/* Dropzone & Picker */}
            <div className="border-2 border-dashed border-slate-300 hover:border-red-500 rounded-xl p-6 text-center bg-slate-50/70 transition group">
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileUpload}
                id="file-upload"
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center justify-center space-y-2"
              >
                <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-slate-800">
                  Kéo thả ảnh/video hoặc <span className="text-red-600 underline">bấm vào đây để chọn</span>
                </div>
                <p className="text-xs text-slate-500">
                  Hỗ trợ JPG, PNG, MP4, MOV (Tối đa 50MB/tệp). Có thể chọn nhiều tệp cùng lúc.
                </p>
              </label>

              {/* Quick sample buttons for fast preview */}
              <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-center gap-2 text-xs">
                <span className="text-slate-500 font-medium">Dùng ảnh mẫu thử nghiệm:</span>
                <button
                  type="button"
                  onClick={() => handleAddSampleMedia('fire')}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-700 font-medium cursor-pointer"
                >
                  + Hiện trường tai nạn/sạt lở
                </button>
                <button
                  type="button"
                  onClick={() => handleAddSampleMedia('pollution')}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-700 font-medium cursor-pointer"
                >
                  + Xả thải ô nhiễm
                </button>
                <button
                  type="button"
                  onClick={() => handleAddSampleMedia('flood')}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-700 font-medium cursor-pointer"
                >
                  + Ngập lụt dân sinh
                </button>
              </div>
            </div>

            {/* Attachments Preview Grid */}
            {attachments.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                {attachments.map((att) => (
                  <div key={att.id} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                    <div className="h-28 w-full bg-slate-900 flex items-center justify-center overflow-hidden">
                      {att.type === 'video' ? (
                        <div className="flex flex-col items-center text-slate-400">
                          <Video className="w-8 h-8 text-red-500 mb-1" />
                          <span className="text-[11px] font-mono">Video Clip</span>
                        </div>
                      ) : (
                        <img
                          src={att.url}
                          alt={att.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      )}
                    </div>
                    <div className="p-2 bg-white">
                      <p className="text-[11px] font-medium text-slate-800 truncate" title={att.name}>
                        {att.name}
                      </p>
                      {att.caption && (
                        <p className="text-[10px] text-slate-500 truncate">{att.caption}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(att.id)}
                      className="absolute top-1.5 right-1.5 p-1 bg-red-600/90 hover:bg-red-700 text-white rounded-md shadow transition cursor-pointer"
                      title="Xóa tệp"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 2: LOCATION & TIME */}
          <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Vị trí xảy ra & Thời gian diễn ra sự việc
                </h3>
                <p className="text-xs text-slate-500">
                  Giúp tòa soạn định vị và phát lệnh tác nghiệp cho CTV khu vực gần nhất
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tỉnh / Thành phố *
                </label>
                <select
                  value={selectedProvince}
                  onChange={(e) => {
                    setSelectedProvince(e.target.value);
                    const newDistricts = VIETNAM_REGIONS.find((r) => r.province === e.target.value)?.districts || [];
                    if (newDistricts.length > 0) setSelectedDistrict(newDistricts[0]);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
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
                  Quận / Huyện / Thị xã *
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                >
                  {currentDistricts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phường / Xã / Thị trấn *
                </label>
                <input
                  type="text"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  placeholder="Ví dụ: Phường 3, Xã Tân Hội..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ghi chú vị trí cụ thể (Số nhà, đường phố, mốc địa danh gần nhất) *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={locationDetail}
                  onChange={(e) => setLocationDetail(e.target.value)}
                  placeholder="Ví dụ: Cạnh cổng chào ngõ 45 đường Phạm Hùng hoặc Km 12+300 Quốc lộ..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tọa độ GPS (Tùy chọn)
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Compass className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={gpsCoordinates}
                      onChange={(e) => setGpsCoordinates(e.target.value)}
                      placeholder="Ví dụ: 21.0285° N, 105.8542° E"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleGetGps}
                    disabled={isGettingGps}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-1 cursor-pointer transition"
                  >
                    <Compass className={`w-3.5 h-3.5 ${isGettingGps ? 'animate-spin' : ''}`} />
                    <span>{isGettingGps ? 'Đang lấy...' : 'Lấy GPS'}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Thời điểm diễn ra sự việc *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="datetime-local"
                    value={incidentTime}
                    onChange={(e) => setIncidentTime(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: PRELIMINARY REPORT */}
          <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Báo cáo sơ bộ về vụ việc
                </h3>
                <p className="text-xs text-slate-500">
                  Tóm tắt diễn biến, mức độ nghiêm trọng và diễn tiến hiện trường
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Phân loại hồ sơ tiếp nhận *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCategory('TIN_NONG')}
                  className={`p-3 rounded-xl border text-left flex items-start gap-3 transition cursor-pointer ${
                    category === 'TIN_NONG'
                      ? 'bg-red-50/80 border-red-500 ring-2 ring-red-500/20'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    category === 'TIN_NONG' ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">🚨 Tin Nóng Khẩn Cấp</div>
                    <div className="text-[11px] text-slate-500 leading-tight">Sự cố, hỏa hoạn, sạt lở, tai nạn, an toàn khẩn cấp</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setCategory('KHIEU_NAI')}
                  className={`p-3 rounded-xl border text-left flex items-start gap-3 transition cursor-pointer ${
                    category === 'KHIEU_NAI'
                      ? 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-500/20'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    category === 'KHIEU_NAI' ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">📋 Tin Khiếu Nại Dân Sinh</div>
                    <div className="text-[11px] text-slate-500 leading-tight">Phản ánh rác thải, lấn chiếm, ô nhiễm, hạ tầng</div>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tiêu đề vụ việc phản ánh *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Vỡ cống thoát nước ngập sâu khu dân cư, xe cộ chết máy hàng loạt..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mô tả chi tiết nội dung sự việc *
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả cụ thể: Vụ việc diễn ra như thế nào? Ai là người bị ảnh hưởng? Có cơ quan chức năng nào tới chưa? Thiệt hại ước tính..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-red-500 outline-none leading-relaxed"
              />
            </div>

            {/* Citizen Contact & Privacy */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Thông tin người báo tin
                </span>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                  />
                  <span className="text-xs font-semibold text-slate-700">
                    Bảo mật danh tính (Báo tin ẩn danh)
                  </span>
                </label>
              </div>

              {isAnonymous && (
                <div className="mb-3 p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Chính sách ẩn danh:</strong> Danh tính của bạn sẽ được mã hóa trên hệ thống. 
                    Chỉ trong trường hợp sự cố đặc biệt nghiêm trọng cấp <strong>BREAKING</strong> (khủng hoảng an ninh, đe dọa sinh mạng), Tổng biên tập mới có thể kích hoạt quy trình giải mật danh tính qua mã xác thực OTP phục vụ cơ quan điều tra.
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {!isAnonymous && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Họ và tên</label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={citizenName}
                        onChange={(e) => setCitizenName(e.target.value)}
                        placeholder="Nguyễn Văn A"
                        className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                      />
                    </div>
                  </div>
                )}

                <div className={isAnonymous ? 'sm:col-span-2' : ''}>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Số điện thoại liên hệ * <span className="text-red-500">(Bắt buộc)</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      value={citizenPhone}
                      onChange={(e) => setCitizenPhone(e.target.value)}
                      placeholder="0912.xxx.xxx (để nhận OTP/xác minh)"
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Email nhận thông báo</label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={citizenEmail}
                      onChange={(e) => setCitizenEmail(e.target.value)}
                      placeholder="email@domain.com"
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: IMPACT SCORE EVALUATION MATRIX (TICK CHỌN BẰNG RADIO) */}
          <div className="bg-white rounded-lg p-6 sm:p-8 border-2 border-red-500/30 shadow-lg space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-base shadow-sm">
                    4
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                      ĐÁNH GIÁ THANG ĐIỂM TÁC ĐỘNG (IMPACT SCORE)
                    </h2>
                    <p className="text-xs text-slate-500">
                      Tick chọn radio button cho từng tiêu chuẩn thành phần theo đúng quy định phân cấp của Tòa soạn
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600">Tổng điểm hiện tại:</span>
                  <span className="px-3 py-1 rounded-lg bg-slate-900 text-white font-mono text-base font-black">
                    {totalScore} / 130
                  </span>
                </div>
              </div>
            </div>

            {/* Render 3 Criteria Categories */}
            <div className="space-y-6">
              {/* Tiêu chuẩn 1: Location Scope */}
              <div className="bg-slate-50/70 p-4 sm:p-5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-white text-xs flex items-center justify-center font-bold">
                      1
                    </span>
                    Khu vực xảy ra (Location Scope)
                  </h4>
                  <span className="text-xs font-bold text-slate-700 bg-slate-50 px-2.5 py-0.5 rounded border border-slate-200">
                    Đã chọn: +{locationScore} điểm
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {IMPACT_CATEGORIES[0].options.map((opt) => {
                    const isSelected = locationScore === opt.value;
                    return (
                      <label
                        key={opt.value}
                        className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-50/80 border-slate-500 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="locationScope"
                          value={opt.value}
                          checked={isSelected}
                          onChange={() => setLocationScore(opt.value)}
                          className="w-4 h-4 text-slate-600 mt-1 focus:ring-slate-500 cursor-pointer"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-900">
                              {opt.label}
                            </span>
                            <span className="text-[11px] font-black text-slate-600 bg-slate-100/60 px-1.5 py-0.5 rounded">
                              {opt.sublabel}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                            {opt.description}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Tiêu chuẩn 2: Affected Population */}
              <div className="bg-slate-50/70 p-4 sm:p-5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-white text-xs flex items-center justify-center font-bold">
                      2
                    </span>
                    Quy mô số người bị ảnh hưởng (Affected Population)
                  </h4>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                    Đã chọn: +{affectedScore} điểm
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {IMPACT_CATEGORIES[1].options.map((opt) => {
                    const isSelected = affectedScore === opt.value;
                    return (
                      <label
                        key={opt.value}
                        className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-50/80 border-amber-500 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="affectedPopulation"
                          value={opt.value}
                          checked={isSelected}
                          onChange={() => setAffectedScore(opt.value)}
                          className="w-4 h-4 text-amber-600 mt-1 focus:ring-amber-500 cursor-pointer"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-900">
                              {opt.label}
                            </span>
                            <span className="text-[11px] font-black text-amber-700 bg-amber-100/60 px-1.5 py-0.5 rounded">
                              {opt.sublabel}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                            {opt.description}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Tiêu chuẩn 3: Severity & Nature */}
              <div className="bg-slate-50/70 p-4 sm:p-5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-white text-xs flex items-center justify-center font-bold">
                      3
                    </span>
                    Loại tính chất vấn đề (Severity & Nature)
                  </h4>
                  <span className="text-xs font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded border border-red-200">
                    Đã chọn: +{severityScore} điểm
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {IMPACT_CATEGORIES[2].options.map((opt) => {
                    const isSelected = severityScore === opt.value;
                    return (
                      <label
                        key={opt.value}
                        className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-red-50/80 border-red-500 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="severity"
                          value={opt.value}
                          checked={isSelected}
                          onChange={() => setSeverityScore(opt.value)}
                          className="w-4 h-4 text-red-600 mt-1 focus:ring-red-500 cursor-pointer"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-900">
                              {opt.label}
                            </span>
                            <span className="text-[11px] font-black text-red-700 bg-red-100/60 px-1.5 py-0.5 rounded">
                              {opt.sublabel}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                            {opt.description}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* DYNAMIC SCORE CALCULATION & PRIORITY SUMMARY */}
            <div className={`p-5 rounded-xl border-2 transition-all ${priorityInfo.bgLight} ${priorityInfo.borderColor}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    Kết Quả Phân Cấp Mức Độ Tự Động
                  </span>
                  <div className="flex items-center gap-3 mt-1">
                    <h3 className={`text-xl sm:text-2xl font-black ${priorityInfo.color}`}>
                      {priorityInfo.name}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded font-mono text-sm font-black bg-white shadow-sm border border-slate-200">
                      {totalScore} / 130 điểm
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-500">Công thức tính:</div>
                  <div className="font-mono text-xs font-bold text-slate-700">
                    {locationScore}đ (Vị trí) + {affectedScore}đ (Dân số) + {severityScore}đ (Tính chất) = {totalScore}đ
                  </div>
                </div>
              </div>

              {/* Priority Bar Visualization */}
              <div className="mt-4">
                <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1.5">
                  <span>LOW (30-50đ)</span>
                  <span>MEDIUM (55-75đ)</span>
                  <span>HIGH (80-100đ)</span>
                  <span>BREAKING (105-130đ)</span>
                </div>
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex">
                  <div 
                    className="h-full bg-emerald-500 transition-all"
                    style={{ width: `${(Math.min(totalScore, 50) - 30) / (130 - 30) * 100}%` }}
                    title="Vùng LOW"
                  />
                  <div 
                    className="h-full bg-amber-500 transition-all"
                    style={{ width: `${Math.max(0, Math.min(totalScore, 75) - 50) / (130 - 30) * 100}%` }}
                    title="Vùng MEDIUM"
                  />
                  <div 
                    className="h-full bg-orange-500 transition-all"
                    style={{ width: `${Math.max(0, Math.min(totalScore, 100) - 75) / (130 - 30) * 100}%` }}
                    title="Vùng HIGH"
                  />
                  <div 
                    className="h-full bg-red-600 transition-all"
                    style={{ width: `${Math.max(0, totalScore - 100) / (130 - 30) * 100}%` }}
                    title="Vùng BREAKING"
                  />
                </div>
              </div>

              {/* Standard definition and Next Steps info */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white/90 rounded-lg border border-slate-200">
                  <strong className="text-slate-900 block mb-1">📌 Tiêu chuẩn đánh giá:</strong>
                  <p className="text-slate-600 leading-relaxed">{priorityInfo.standard}</p>
                </div>
                <div className="p-3 bg-white/90 rounded-lg border border-slate-200">
                  <strong className="text-slate-900 block mb-1">⚙️ Quy trình xử lý tương ứng:</strong>
                  <p className="text-slate-600 leading-relaxed">{priorityInfo.workflowSummary}</p>
                </div>
              </div>

              {priorityInfo.requiresFieldReporter && (
                <div className="mt-3 flex items-center gap-2 text-xs font-bold text-red-700 bg-red-100/60 p-2.5 rounded-lg border border-red-200">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>
                    Hệ thống nhận diện mức độ nghiêm trọng: Sẽ kích hoạt lệnh điều phối Cộng tác viên (CTV) đến hiện trường xác minh và thu thập bằng chứng thực tế.
                  </span>
                </div>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-4 flex items-center justify-between flex-wrap gap-4 border-t border-slate-200">
              <button
                type="button"
                onClick={onBack}
                className="px-5 py-3 text-slate-600 hover:text-slate-900 font-bold text-sm transition cursor-pointer"
              >
                Hủy bỏ
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3.5 bg-gradient-to-r from-red-600 via-red-700 to-amber-700 hover:from-red-700 hover:to-amber-800 text-white rounded-xl font-black text-sm tracking-wide shadow-lg shadow-red-900/30 hover:shadow-xl transition-all transform active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>ĐANG GỬI TIN & SINH MÃ HỒ SƠ...</span>
                  </>
                ) : (
                  <>
                    <Flame className="w-5 h-5 text-amber-300" />
                    <span>GỬI TIN NÓNG VỀ TÒA SOẠN ({totalScore} ĐIỂM - {priorityInfo.level})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
