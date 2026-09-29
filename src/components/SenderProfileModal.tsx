import React from 'react';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Star, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  Sparkles, 
  Award, 
  ExternalLink,
  PhoneCall,
  Calendar,
  CreditCard
} from 'lucide-react';
import { Submission } from '../types';

interface SenderProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: Submission | null;
  isOtpVerified?: boolean;
}

export const SenderProfileModal: React.FC<SenderProfileModalProps> = ({
  isOpen,
  onClose,
  submission,
  isOtpVerified = false,
}) => {
  if (!isOpen || !submission) return null;

  const isAnonymous = submission.isAnonymous && !isOtpVerified;
  const citizenName = isAnonymous 
    ? 'Người báo tin ẩn danh (Bảo mật theo Luật Báo chí)' 
    : submission.citizenName || 'Phạm Minh Trí';
  
  const citizenPhone = isAnonymous ? '0983.***.*** (Đã mã hóa)' : submission.citizenPhone || '0918.442.119';
  const citizenEmail = isAnonymous ? 'anonym***@proton.me' : submission.citizenEmail || 'minhtri.dalat@gmail.com';
  const location = submission.location || `${submission.ward || ''}, ${submission.district || ''}, ${submission.province || 'Lâm Đồng'}`;

  // Calculated reputation based on submission or preset
  const reputationScore = isAnonymous ? 85 : 95;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-lg max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-scale-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-md shrink-0">
              <User className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/30 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-400/40">
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                Hồ Sơ Định Danh Người Gửi Tin Báo Dân Sinh
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                {citizenName}
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Dữ liệu đối soát nguồn tin dành riêng cho <strong>Ban Biên Tập & Tổng Biên Tập</strong> để thẩm tra mức độ tin cậy và liên lạc trực tiếp khi cần thiết.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-7 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Anonymity Alert */}
          {isAnonymous ? (
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong>Chế độ bảo vệ nguồn tin:</strong> Người dân yêu cầu giữ bí mật danh tính theo Điều 38 Luật Báo chí. Tổng Biên Tập có thể nhập mã OTP giải mật tại Bàn Tổng Biên Tập nếu cần phục vụ điều tra khẩn cấp cấp độ BREAKING.
              </div>
            </div>
          ) : (
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong>Tài khoản đã xác thực VNeID:</strong> Thông tin người gửi tin đã đối soát với Cơ sở dữ liệu định danh điện tử, nguồn tin có tính xác thực cao.
              </div>
            </div>
          )}

          {/* Personal Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs">
            <div className="space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">
                Số điện thoại liên hệ
              </span>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-mono font-bold text-slate-900 text-sm">{citizenPhone}</span>
                {!isAnonymous && (
                  <a
                    href={`tel:${citizenPhone.replace(/[^0-9]/g, '')}`}
                    className="ml-auto px-2 py-0.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded font-semibold text-[10px] flex items-center gap-1 transition"
                  >
                    <PhoneCall className="w-3 h-3" /> Gọi xác minh
                  </a>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">
                Email công dân
              </span>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-medium text-slate-800 truncate">{citizenEmail}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">
                Địa bàn phản ánh
              </span>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span className="font-medium text-slate-800">{location}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">
                Mã định danh hệ thống
              </span>
              <div className="flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-mono font-bold text-slate-700 bg-slate-50 px-2 py-0.5 rounded">
                  CIT-2026-9921
                </span>
              </div>
            </div>
          </div>

          {/* Reputation Score & Credibility Bar */}
          <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  ĐIỂM UY TÍN NGUỒN TIN (REPUTATION SCORE)
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-slate-900 font-mono">
                  {reputationScore}
                </span>
                <span className="text-xs font-bold text-slate-400">/100đ</span>
              </div>
            </div>

            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${reputationScore}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
              <div className="p-2 bg-slate-50 rounded-xl">
                <div className="text-lg font-black text-slate-900 font-mono">5</div>
                <div className="text-[10px] text-slate-500 font-medium">Tin đã gửi</div>
              </div>
              <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="text-lg font-black text-emerald-700 font-mono">100%</div>
                <div className="text-[10px] text-emerald-600 font-medium">Xác thực đúng</div>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-lg font-black text-slate-700 font-mono">0</div>
                <div className="text-[10px] text-slate-600 font-medium">Tin giả / Sai lệch</div>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Huy hiệu tín nhiệm cộng đồng
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                <span className="text-base">👁️</span>
                <div>
                  <div className="font-bold text-slate-900 text-[11px]">Tai Mắt Cộng Đồng</div>
                  <div className="text-[10px] text-slate-500">Đã gửi nhiều tin chính xác</div>
                </div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                <span className="text-base">🛡️</span>
                <div>
                  <div className="font-bold text-slate-900 text-[11px]">Chính Trực & Xác Thực</div>
                  <div className="text-[10px] text-slate-500">Không có lịch sử báo tin giả</div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Submission Context */}
          <div className="p-3.5 bg-slate-50/70 rounded-lg border border-slate-200 text-xs space-y-1">
            <span className="text-[10px] font-bold text-slate-700 uppercase block">
              Tin báo hiện tại đang được thẩm định:
            </span>
            <div className="font-bold text-slate-900">{submission.title}</div>
            <div className="text-slate-500 text-[11px]">
              Mã hồ sơ: <span className="font-mono font-bold text-slate-800">{submission.trackingCode}</span> • Gửi lúc: {submission.createdAt}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Hệ thống đối soát nguồn tin Tòa soạn Tin Nóng Dân Sinh
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
