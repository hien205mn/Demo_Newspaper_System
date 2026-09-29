import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  ShieldCheck, 
  User, 
  Lock, 
  Check, 
  UserCheck, 
  Camera, 
  Award, 
  Crown, 
  Send,
  AlertCircle,
  GraduationCap
} from 'lucide-react';
import { AppRole, AuthUser } from '../types';

export const DEMO_ACCOUNTS: (AuthUser & { passwordHint: string; description: string; icon: React.ReactNode })[] = [
  {
    id: 'user-expert-01',
    name: 'PGS. TS Trần Đình Khiêm',
    email: 'khiem.tran@vast.ac.vn',
    role: 'EXPERT',
    title: 'Chuyên Gia Đô Thị & Thủy Văn',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    passwordHint: 'expert@123',
    description: 'Bình luận chuyên sâu, viết bài phân tích, theo dõi & chỉnh sửa bài viết',
    icon: <GraduationCap className="w-5 h-5 text-slate-500" />
  },
  {
    id: 'user-btv-01',
    name: 'Nguyễn Thu Trang',
    email: 'thutrang.editor@toasoan.vn',
    role: 'EDITOR',
    title: 'Biên Tập Viên Trực Ban',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    passwordHint: 'editor@123',
    description: 'Phân loại tin nóng, xác nhận người gửi, điều phối CTV, AI Review',
    icon: <UserCheck className="w-5 h-5 text-slate-500" />
  },
  {
    id: 'user-ctv-04',
    name: 'Vũ Quốc Bảo',
    email: 'bao.vu@press.vn',
    role: 'REPORTER',
    title: 'Phóng Viên / CTV Hiện Trường',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    passwordHint: 'ctv@123',
    description: 'Nhận lệnh tác nghiệp, xác thực hiện trường & nộp bài phản ánh',
    icon: <Camera className="w-5 h-5 text-emerald-500" />
  },
  {
    id: 'user-deputy-01',
    name: 'Trần Quang Huy',
    email: 'quanghuy.deputy@toasoan.vn',
    role: 'DEPUTY_EIC',
    title: 'Phó Tổng Biên Tập',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    passwordHint: 'deputy@123',
    description: 'Thẩm định chuyên môn bài viết, duyệt xuất bản hoặc chuyển cấp',
    icon: <Award className="w-5 h-5 text-slate-500" />
  },
  {
    id: 'user-eic-01',
    name: 'Nguyễn Hoàng Long',
    email: 'hoanglong.eic@toasoan.vn',
    role: 'EIC',
    title: 'Tổng Biên Tập (EIC)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    passwordHint: 'eic@123',
    description: 'Phê duyệt tối cao tin BREAKING/HIGH, giải mật OTP danh tính',
    icon: <Crown className="w-5 h-5 text-amber-500" />
  },
  {
    id: 'user-citizen-01',
    name: 'Công Dân / Độc Giả',
    email: 'docgia.dansinh@gmail.com',
    role: 'CITIZEN',
    title: 'Người Dân Gửi Phản Ánh',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    passwordHint: 'citizen@123',
    description: 'Gửi tin nóng dân sinh, tính điểm tác động và tra cứu tiến độ hồ sơ',
    icon: <Send className="w-5 h-5 text-red-500" />
  }
];

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: AuthUser) => void;
  currentUser: AuthUser | null;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  currentUser,
}) => {
  const [activeTab, setActiveTab] = useState<'QUICK' | 'FORM'>('QUICK');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSelectQuickAccount = (acc: AuthUser) => {
    onLogin(acc);
    onClose();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Vui lòng nhập địa chỉ email hoặc tên đăng nhập');
      return;
    }

    // Try finding matching account or construct one
    const found = DEMO_ACCOUNTS.find(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (found) {
      onLogin(found);
      onClose();
      return;
    }

    // Fallback: create dynamic editor/citizen session
    const dynamicUser: AuthUser = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0] || 'Cán Bộ Tòa Soạn',
      email: email.trim(),
      role: email.includes('editor') ? 'EDITOR' : email.includes('ctv') ? 'REPORTER' : 'CITIZEN',
      title: email.includes('editor') ? 'Biên Tập Viên' : 'Người Dùng Tòa Soạn'
    };

    onLogin(dynamicUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-lg w-full max-w-lg shadow-2xl overflow-hidden text-white">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
              <LogIn className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide uppercase">
                Đăng Nhập Hệ Thống
              </h2>
              <p className="text-xs text-slate-400">
                Cổng Tòa Soạn & Điều Phối Tác Nghiệp Báo Chí
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1.5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('QUICK')}
            className={`flex-1 py-2 px-3 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'QUICK'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Đăng Nhập Nhanh Theo Vai Trò (Khuyên dùng)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('FORM')}
            className={`flex-1 py-2 px-3 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'FORM'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Email / Mật Khẩu</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[70vh] overflow-y-auto">
          {activeTab === 'QUICK' ? (
            <div className="space-y-2.5">
              <p className="text-xs text-slate-400 mb-3">
                Chọn tài khoản để trải nghiệm quyền hạn nghiệp vụ tương ứng ngay lập tức:
              </p>

              {DEMO_ACCOUNTS.map((acc) => {
                const isCurrent = currentUser?.id === acc.id;
                return (
                  <button
                    key={acc.id}
                    onClick={() => handleSelectQuickAccount(acc)}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition cursor-pointer group ${
                      isCurrent
                        ? 'bg-slate-950/40 border-slate-500/80 ring-1 ring-slate-500/30'
                        : 'bg-slate-800/70 border-slate-700/70 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={acc.avatar}
                          alt={acc.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-600"
                        />
                        <div className="absolute -bottom-1 -right-1 p-0.5 bg-slate-900 rounded-full">
                          {acc.icon}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                            {acc.name}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-slate-700/80 text-slate-300">
                            {acc.title}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                          {acc.description}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pl-2 shrink-0">
                      {isCurrent ? (
                        <span className="px-2 py-1 bg-slate-600 text-white text-[10px] font-bold rounded-lg flex items-center gap-1">
                          <Check className="w-3 h-3" /> Đang dùng
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 group-hover:text-white font-medium">
                          Chọn →
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-900/40 border border-red-500/50 rounded-xl text-xs text-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Email / Tên đăng nhập
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ví dụ: thutrang.editor@toasoan.vn"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Gợi ý: Nhập bất kỳ email demo từ danh sách hoặc mật khẩu bất kỳ để đăng nhập.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-900/40 transition cursor-pointer"
                >
                  Đăng Nhập
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/70 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Hệ thống quản lý tòa soạn phân quyền đa cấp</span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white underline cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
