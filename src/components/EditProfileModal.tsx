import React, { useState, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Check, 
  Phone, 
  Mail, 
  MapPin, 
  User, 
  Building2, 
  Lock, 
  Sparkles, 
  Camera, 
  CheckCircle2, 
  ShieldCheck, 
  Award,
  Crown
} from 'lucide-react';
import { AppRole, AuthUser } from '../types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: AppRole;
  currentUser: AuthUser | null;
  onSave: (updatedUser: AuthUser) => void;
}

const PRESET_AVATARS = [
  { label: 'Ký giả Nam', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' },
  { label: 'BTV Nữ', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80' },
  { label: 'Lãnh đạo', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' },
  { label: 'Tổng Biên Tập', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80' },
  { label: 'Phóng viên', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80' },
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  currentUser,
  onSave,
}) => {
  // Determine baseline data according to role
  const getInitialData = () => {
    if (currentUser) {
      return {
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || (currentRole === 'CITIZEN' ? '0918.442.119' : currentRole === 'EXPERT' ? '0903.456.789' : '0903.228.911'),
        address: currentUser.address || (currentRole === 'CITIZEN' ? 'Số 18 Đường Trần Phú, Phường 3, TP. Đà Lạt' : currentRole === 'EXPERT' ? 'Viện Nghiên cứu Đô thị, Cầu Giấy, Hà Nội' : 'Tòa soạn Báo - 45 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội'),
        avatar: currentUser.avatar || (currentRole === 'EXPERT' ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'),
        title: currentUser.title || (
          currentRole === 'EXPERT' ? 'Chuyên Gia Đô Thị & Thủy Văn' :
          currentRole === 'EDITOR' ? 'Biên Tập Viên Trực Ban' :
          currentRole === 'REPORTER' ? 'Phóng Viên / CTV Hiện Trường' :
          currentRole === 'DEPUTY_EIC' ? 'Phó Tổng Biên Tập' :
          currentRole === 'EIC' ? 'Tổng Biên Tập' : 'Người Dân / Độc Giả'
        ),
        penName: currentUser.penName || (currentRole === 'CITIZEN' ? 'Minh Trí (Cộng Tác Viên Tiềm Năng)' : currentRole === 'EXPERT' ? 'PGS. TS Trần Đình Khiêm' : 'Quốc Bảo (CTV 04)'),
        department: currentUser.department || (
          currentRole === 'EXPERT' ? 'Hội đồng Chuyên gia Cố vấn & Phản biện Chính sách' :
          currentRole === 'EDITOR' ? 'Ban Thời Sự & Tin Nóng Khẩn Cấp' :
          currentRole === 'REPORTER' ? 'Trung Tâm Điều Phối Phóng Viên Hiện Trường' :
          currentRole === 'DEPUTY_EIC' ? 'Hội Đồng Thẩm Định Pháp Lý & Xuất Bản' :
          currentRole === 'EIC' ? 'Ban Lãnh Đạo Tối Cao Tòa Soạn' : 'Ban Bạn Đọc & Dân Sinh'
        )
      };
    }

    // Role defaults when not logged in
    switch (currentRole) {
      case 'EXPERT':
        return {
          name: 'PGS. TS Trần Đình Khiêm',
          email: 'khiem.tran@vast.ac.vn',
          phone: '0903.456.789',
          address: 'Viện Nghiên cứu Đô thị & Thủy văn, Cầu Giấy, Hà Nội',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
          title: 'Viện trưởng / Chuyên Gia Phản Biện Đô Thị',
          penName: 'PGS. TS Trần Đình Khiêm',
          department: 'Hội đồng Chuyên gia Cố vấn & Phản biện Chính sách',
        };
      case 'EDITOR':
        return {
          name: 'Nguyễn Thu Trang',
          email: 'thutrang.editor@toasoan.vn',
          phone: '0903.228.911',
          address: 'Tòa soạn Báo - 45 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
          title: 'Biên Tập Viên Trực Ban',
          penName: 'Thu Trang (BTV)',
          department: 'Ban Thời Sự & Tin Nóng Khẩn Cấp',
        };
      case 'REPORTER':
        return {
          name: 'Vũ Quốc Bảo',
          email: 'bao.vu@press.vn',
          phone: '0978.334.556',
          address: 'Thường trú Tây Nguyên & Lâm Đồng',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
          title: 'Phóng Viên / CTV Hiện Trường',
          penName: 'Quốc Bảo (Hiện Trường)',
          department: 'Trung Tâm Điều Phối Phóng Viên Hiện Trường',
        };
      case 'DEPUTY_EIC':
        return {
          name: 'Trần Quang Huy',
          email: 'quanghuy.deputy@toasoan.vn',
          phone: '0912.888.777',
          address: 'Ban Biên Tập Tòa Soạn Trung Ương',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
          title: 'Phó Tổng Biên Tập',
          penName: 'Quang Huy',
          department: 'Hội Đồng Thẩm Định Pháp Lý & Xuất Bản',
        };
      case 'EIC':
        return {
          name: 'Nguyễn Hoàng Long',
          email: 'hoanglong.eic@toasoan.vn',
          phone: '0909.999.888',
          address: 'Trụ sở chính Tòa Soạn - 45 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
          title: 'Tổng Biên Tập (EIC)',
          penName: 'Hoàng Long',
          department: 'Ban Lãnh Đạo Tối Cao Tòa Soạn',
        };
      default: // CITIZEN
        return {
          name: 'Phạm Minh Trí',
          email: 'minhtri.dalat@gmail.com',
          phone: '0918.442.119',
          address: 'Số 18 Đường Trần Phú, Phường 3, TP. Đà Lạt',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          title: 'Người Dân / Độc Giả',
          penName: 'Minh Trí (Cộng Tác Viên Tiềm Năng)',
          department: 'Ban Bạn Đọc & Dân Sinh',
        };
    }
  };

  const [formData, setFormData] = useState(getInitialData);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialData());
      setSaveSuccess(false);
    }
  }, [isOpen, currentRole, currentUser]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormData((prev) => ({ ...prev, avatar: event.target!.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: AuthUser = {
      id: currentUser?.id || `user-${currentRole.toLowerCase()}-${Date.now()}`,
      name: formData.name.trim() || 'Người dùng',
      email: formData.email.trim(),
      role: currentRole,
      avatar: formData.avatar,
      title: formData.title,
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      // Citizen cannot change pen name; other roles keep or update their pen name
      penName: currentRole === 'CITIZEN' ? (currentUser?.penName || 'Minh Trí (Cộng Tác Viên Tiềm Năng)') : formData.penName.trim(),
      department: formData.department.trim(),
    };

    onSave(updatedUser);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 900);
  };

  const getRoleHeaderInfo = () => {
    switch (currentRole) {
      case 'EDITOR':
        return {
          badge: 'Biên Tập Viên',
          badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: <ShieldCheck className="w-5 h-5 text-blue-600" />,
          desc: 'Quản trị hồ sơ BTV trực ban tiếp nhận, điều phối phóng viên & duyệt bài',
        };
      case 'REPORTER':
        return {
          badge: 'Phóng Viên / CTV',
          badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          icon: <Camera className="w-5 h-5 text-emerald-600" />,
          desc: 'Quản trị hồ sơ phóng viên thực địa tác nghiệp, số điện thoại khẩn cấp & địa bàn',
        };
      case 'DEPUTY_EIC':
        return {
          badge: 'Phó Tổng Biên Tập',
          badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
          icon: <Award className="w-5 h-5 text-purple-600" />,
          desc: 'Quản trị hồ sơ Lãnh đạo phụ trách thẩm định chuyên môn & duyệt xuất bản',
        };
      case 'EIC':
        return {
          badge: 'Tổng Biên Tập',
          badgeColor: 'bg-red-100 text-red-800 border-red-200',
          icon: <Crown className="w-5 h-5 text-red-600" />,
          desc: 'Quản trị hồ sơ Lãnh đạo tối cao Tòa soạn, phê duyệt tin Breaking & OTP',
        };
      default:
        return {
          badge: 'Công Dân',
          badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
          icon: <User className="w-5 h-5 text-amber-600" />,
          desc: 'Quản trị thông tin cá nhân, liên hệ nhận phản hồi & thẩm định CTV',
        };
    }
  };

  const roleInfo = getRoleHeaderInfo();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center">
              {roleInfo.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-900 text-base">
                  Chỉnh Sửa Hồ Sơ Cá Nhân
                </h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${roleInfo.badgeColor}`}>
                  {roleInfo.badge}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                {roleInfo.desc}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Banner */}
        {saveSuccess && (
          <div className="bg-emerald-50 px-5 py-3 border-b border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Đã cập nhật thông tin hồ sơ thành công! Đang đồng bộ...</span>
          </div>
        )}

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Avatar Section */}
          <div className="space-y-2.5">
            <label className="block font-bold text-slate-700">
              Ảnh đại diện (Avatar) *
            </label>

            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <img
                  src={formData.avatar}
                  alt="Avatar"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-300 shadow-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';
                  }}
                />
              </div>

              <div className="flex-1 space-y-2">
                <input
                  type="url"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  placeholder="Dán link ảnh URL (https://...)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                />

                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer border border-slate-200 transition">
                    <Upload className="w-3.5 h-3.5 text-slate-600" />
                    <span>Tải ảnh từ máy</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-slate-400">hoặc chọn mẫu:</span>
                </div>
              </div>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-2 pt-1 overflow-x-auto pb-1">
              {PRESET_AVATARS.map((av, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setFormData({ ...formData, avatar: av.url })}
                  className={`relative rounded-xl overflow-hidden border-2 transition cursor-pointer shrink-0 ${
                    formData.avatar === av.url ? 'border-red-600 ring-2 ring-red-400/40' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                  title={av.label}
                >
                  <img src={av.url} alt={av.label} className="w-9 h-9 object-cover" />
                  {formData.avatar === av.url && (
                    <div className="absolute inset-0 bg-red-600/30 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Họ và tên & Chức danh */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Họ và tên *
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Chức danh / Vị trí công tác
              </label>
              <div className="relative">
                <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Số điện thoại */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Số điện thoại liên lạc / trực ban *
            </label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Ví dụ: 0903.228.911"
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-medium text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Địa chỉ Email liên hệ / công vụ *
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Ví dụ: hoten@toasoan.vn"
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
          </div>

          {/* Địa chỉ / Cơ quan công tác */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              {currentRole === 'CITIZEN' ? 'Địa chỉ nơi ở hiện tại *' : 'Địa chỉ trụ sở / Địa bàn thường trực *'}
            </label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Địa chỉ liên hệ công tác..."
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
          </div>

          {/* Bút danh & Phòng ban */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Bút danh */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-slate-700">
                  Bút danh tác nghiệp
                </label>
                {currentRole === 'CITIZEN' && (
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 font-semibold">
                    <Lock className="w-3 h-3 text-slate-400" /> Cố định
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  disabled={currentRole === 'CITIZEN'}
                  value={formData.penName}
                  onChange={(e) => setFormData({ ...formData, penName: e.target.value })}
                  title={currentRole === 'CITIZEN' ? 'Bút danh cố định gắn liền với mã định danh hồ sơ công dân' : 'Bút danh khi xuất bản bài viết'}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-medium border ${
                    currentRole === 'CITIZEN'
                      ? 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed select-none'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:ring-2 focus:ring-red-500 outline-none'
                  }`}
                />
                {currentRole === 'CITIZEN' && (
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
                )}
              </div>
              {currentRole === 'CITIZEN' && (
                <p className="text-[10px] text-slate-400 mt-1">
                  Người dân không được sửa bút danh.
                </p>
              )}
            </div>

            {/* Phòng ban / Đơn vị */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Phòng ban / Đơn vị chuyên môn
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition cursor-pointer"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-900/30 transition cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Lưu Thông Tin Hồ Sơ</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
