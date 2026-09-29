import React, { useState } from 'react';
import { 
  Flame, 
  ShieldAlert, 
  Send, 
  UserCheck, 
  Camera, 
  Award, 
  Crown, 
  Search, 
  PhoneCall, 
  Clock, 
  LogIn, 
  LogOut, 
  User as UserIcon, 
  ChevronDown, 
  Star,
  GraduationCap
} from 'lucide-react';
import { AppRole, AuthUser } from '../types';

interface HeaderProps {
  currentRole: AppRole;
  onSelectRole: (role: AppRole) => void;
  onOpenSubmit: () => void;
  onOpenTrack: () => void;
  pendingCount: number;
  currentUser: AuthUser | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenProfile?: () => void;
  onOpenEditProfile?: () => void;
  reputationScore?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onSelectRole,
  onOpenSubmit,
  onOpenTrack,
  pendingCount,
  currentUser,
  onOpenLogin,
  onLogout,
  onOpenProfile,
  onOpenEditProfile,
  reputationScore = 95,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const roles: { id: AppRole; label: string; icon: React.ReactNode; desc: string }[] = [
    { 
      id: 'CITIZEN', 
      label: 'Cổng Người Dân', 
      icon: <Send className="w-4 h-4" />, 
      desc: 'Cổng thông tin & Gửi tin nóng' 
    },
    { 
      id: 'EXPERT', 
      label: 'Chuyên Gia', 
      icon: <GraduationCap className="w-4 h-4" />, 
      desc: 'Bình luận, phân tích chuyên môn, viết bài & chỉnh sửa' 
    },
    { 
      id: 'EDITOR', 
      label: 'Bàn Biên Tập (BTV)', 
      icon: <UserCheck className="w-4 h-4" />, 
      desc: 'Phân loại, điều phối CTV, AI Review' 
    },
    { 
      id: 'REPORTER', 
      label: 'CTV Hiện Trường', 
      icon: <Camera className="w-4 h-4" />, 
      desc: 'Xác thực & viết bài hiện trường' 
    },
    { 
      id: 'DEPUTY_EIC', 
      label: 'Phó Tổng Biên Tập', 
      icon: <Award className="w-4 h-4" />, 
      desc: 'Thẩm định chuyên môn, duyệt & chuyển cấp' 
    },
    { 
      id: 'EIC', 
      label: 'Tổng Biên Tập (EIC)', 
      icon: <Crown className="w-4 h-4" />, 
      desc: 'Duyệt tối cao, giải mật OTP, ký xuất bản' 
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-ink border-b border-slate-800 text-white shadow-lg">
      {/* Top Banner Ticker */}
      <div className="bg-breaking text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2 font-medium">
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-white text-red-700 text-[11px] font-bold tracking-wide uppercase">
              HOTLINE 24/7
            </span>
            <span className="flex items-center gap-1">
              <PhoneCall className="w-3.5 h-3.5" /> 1900 6868 - 024.3825.9999
            </span>
            <span className="hidden md:inline text-red-200">|</span>
            <span className="hidden md:inline text-red-100">
              Tiếp nhận phản ánh sự cố, an toàn, thiên tai, đời sống và tiêu cực dân sinh
            </span>
          </div>
          <div className="flex items-center space-x-3 text-[11px] text-red-100">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> Trực ban tòa soạn 24/7
            </span>
            <button
              onClick={onOpenTrack}
              className="hover:text-white underline cursor-pointer font-semibold flex items-center gap-1"
            >
              <Search className="w-3 h-3" /> Tra cứu mã hồ sơ
            </button>
            <span className="text-red-300">|</span>
            <button
              onClick={onOpenLogin}
              className="hover:text-amber-300 cursor-pointer font-bold flex items-center gap-1 bg-red-800/70 hover:bg-red-800 px-2 py-0.5 rounded transition"
            >
              <LogIn className="w-3 h-3 text-amber-300" />
              <span>{currentUser ? currentUser.name : 'Login'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center justify-between">
          <div 
            onClick={() => onSelectRole('CITIZEN')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-md bg-breaking flex items-center justify-center shadow-md shadow-red-900/30 group-hover:scale-[1.01] transition-all">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-white uppercase">
                  TIN NÓNG DÂN SINH
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30 rounded">
                  HỆ THỐNG TÒA SOẠN
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Tiếp nhận thông tin • Chấm điểm Impact Score • Điều phối tác nghiệp đa cấp
              </p>
            </div>
          </div>

          {/* Mobile Right Actions: Profile + Login + Gửi tin */}
          <div className="md:hidden flex items-center gap-1.5">
            {onOpenProfile && (
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-1 px-2 py-1.5 bg-slate-800 text-amber-300 rounded-lg text-xs font-bold border border-amber-500/40"
                title="Xem và chỉnh sửa hồ sơ"
              >
                {currentRole === 'CITIZEN' ? (
                  <>
                    <Star className="w-3 h-3 fill-current text-amber-400" />
                    <span>{reputationScore}đ</span>
                  </>
                ) : (
                  <>
                    <UserIcon className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-[10px]">Hồ sơ</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold border border-slate-700 transition cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentUser ? currentUser.name.split(' ').pop() : 'Login'}</span>
            </button>

            <button
              onClick={onOpenSubmit}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow transition"
            >
              <Flame className="w-4 h-4 text-amber-300 animate-pulse" />
              Gửi tin
            </button>
          </div>
        </div>

        {/* Right action group: Big CTA + Login Button */}
        <div className="flex items-center gap-3">
          {/* Profile Button for ALL ROLES */}
          {onOpenProfile && (
            <button
              onClick={onOpenProfile}
              className="hidden lg:flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white rounded-xl text-xs font-bold border border-slate-700 hover:border-amber-400 transition cursor-pointer shadow-sm group"
              title="Xem và chỉnh sửa hồ sơ cá nhân"
            >
              <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px]">
                {currentRole === 'CITIZEN' ? (
                  <Star className="w-3 h-3 fill-current text-amber-400" />
                ) : currentRole === 'EXPERT' ? (
                  <GraduationCap className="w-3 h-3 text-slate-400" />
                ) : (
                  <UserIcon className="w-3 h-3 text-amber-400" />
                )}
              </div>
              <div className="text-left">
                <span className="text-slate-300 group-hover:text-white">
                  {currentRole === 'CITIZEN' ? 'Profile' : 
                   currentRole === 'EXPERT' ? 'Hồ sơ Chuyên gia' :
                   currentRole === 'EDITOR' ? 'Hồ sơ BTV' :
                   currentRole === 'REPORTER' ? 'Hồ sơ CTV' :
                   currentRole === 'DEPUTY_EIC' ? 'Hồ sơ Phó TBT' : 'Hồ sơ TBT'}
                </span>
                {currentRole === 'CITIZEN' ? (
                  <span className="ml-1.5 px-1.5 py-0.2 rounded text-[10px] font-mono font-black bg-amber-400 text-slate-950">
                    {reputationScore}đ
                  </span>
                ) : currentRole === 'EXPERT' ? (
                  <span className="ml-1.5 px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-500/30 text-slate-300 border border-slate-500/40">
                    Chuyên gia
                  </span>
                ) : (
                  <span className="ml-1.5 text-[10px] text-amber-400 font-semibold group-hover:underline">
                    Sửa hồ sơ
                  </span>
                )}
              </div>
            </button>
          )}

          {/* Action button: Gửi tin nóng (Citizen highlight) */}
          <button
            onClick={onOpenSubmit}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg text-sm font-bold shadow-md shadow-red-950/40 border border-red-500/50 hover:shadow-lg transition-all transform active:scale-95 cursor-pointer"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
            </span>
            <span>🚨 GỬI TIN NÓNG KHẨN CẤP</span>
          </button>

          {/* Login / User Profile Button at Top Screen Corner */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700/80 px-3 py-1.5 rounded-xl border border-slate-700 hover:border-slate-600 transition cursor-pointer text-left shadow-sm"
              >
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-slate-600 shrink-0"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-white leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-amber-400 font-medium">
                    {currentUser.title || currentUser.role}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 text-xs animate-fade-in">
                  <div className="px-3.5 py-2 border-b border-slate-800">
                    <div className="font-bold text-white">{currentUser.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{currentUser.email}</div>
                    <div className="mt-1 inline-block px-1.5 py-0.5 rounded bg-slate-500/20 text-slate-400 font-mono text-[10px]">
                      {currentUser.title || currentUser.role}
                    </div>
                  </div>

                  {currentRole === 'CITIZEN' && onOpenProfile && (
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenProfile();
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-800 text-amber-300 flex items-center gap-2 transition cursor-pointer"
                    >
                      <Star className="w-4 h-4 text-amber-400 fill-current" />
                      <span>Hồ sơ & Điểm uy tín ({reputationScore}đ)</span>
                    </button>
                  )}

                  {(onOpenEditProfile || onOpenProfile) && (
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        if (onOpenEditProfile) onOpenEditProfile();
                        else if (onOpenProfile) onOpenProfile();
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2 transition cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4 text-amber-400" />
                      <span>Chỉnh sửa hồ sơ cá nhân</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenLogin();
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-800 text-slate-200 flex items-center gap-2 transition cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4 text-slate-400" />
                    <span>Đổi tài khoản / Vai trò</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-red-950/40 text-red-400 hover:text-red-300 flex items-center gap-2 transition cursor-pointer border-t border-slate-800 mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Đăng xuất (Logout)</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-3.5 py-2 bg-gradient-to-r from-slate-800 via-slate-800 to-slate-750 hover:from-slate-700 hover:to-slate-700 text-white rounded-xl text-xs sm:text-sm font-bold border border-slate-700 hover:border-slate-500 shadow-md flex items-center gap-2 transition cursor-pointer active:scale-95"
            >
              <LogIn className="w-4 h-4 text-amber-400" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Role Switcher Toolbar */}
      <div className="bg-slate-950/80 border-t border-slate-800/80 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-x-auto scrollbar-none text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-medium whitespace-nowrap pr-2">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">Trải nghiệm vai trò:</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            {roles.map((r) => {
              const isActive = currentRole === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => onSelectRole(r.id)}
                  title={r.desc}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer text-xs ${
                    isActive
                      ? 'bg-breaking text-white shadow-sm shadow-red-900/40 font-semibold'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
                  }`}
                >
                  {r.icon}
                  <span>{r.label}</span>
                  {r.id === 'EDITOR' && pendingCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 bg-amber-500 text-slate-950 font-black rounded-full text-[10px]">
                      {pendingCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
