import React from 'react';
import { 
  Building2, 
  PhoneCall, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  FileText, 
  Award, 
  Scale, 
  Clock, 
  Flame, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs">
      {/* Top emergency announcement bar in footer */}
      <div className="bg-red-950/70 border-b border-red-900/50 py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-red-200">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="p-1 rounded bg-red-600 text-white font-black text-[10px] uppercase tracking-wider">
              ĐƯỜNG DÂY NÓNG
            </span>
            <span className="font-semibold text-xs sm:text-sm text-white">
              Tổng đài trực ban tiếp nhận phản ánh & tố giác dân sinh 24/7:
            </span>
            <strong className="text-amber-400 font-mono text-sm sm:text-base">1900 6868</strong>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-red-300">
            <span>• Miễn cước cuộc gọi khẩn cấp</span>
            <span>• Bảo mật tuyệt đối người cung cấp tin</span>
          </div>
        </div>
      </div>

      {/* Main Footer Information Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          
          {/* Column 1: Cơ quan chủ quản & Giấy phép */}
          <div className="space-y-3.5">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center text-white shadow-md">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <span className="text-white font-black text-sm tracking-tight uppercase block leading-none">
                  TIN NÓNG DÂN SINH
                </span>
                <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider">
                  BÁO ĐIỆN TỬ DÂN NGUYỆN & PHÁP CHẾ
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Cơ quan báo chí điện tử đa phương tiện, tiếng nói của người dân, diễn đàn phản ánh kiến nghị, bảo vệ công lý và trật tự an toàn xã hội.
            </p>

            <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-[11px] text-slate-300">
              <div>
                <strong className="text-slate-200">Cơ quan chủ quản:</strong> Liên hiệp các Hội Khoa học & Kỹ thuật Việt Nam
              </div>
              <div>
                <strong className="text-slate-200">Giấy phép hoạt động Báo điện tử:</strong> Số 188/GP-BTTTT do Bộ Thông tin và Truyền thông cấp ngày 15/04/2021
              </div>
              <div>
                <strong className="text-slate-200">Mã chỉ số quốc tế:</strong> ISSN 2815-5920
              </div>
            </div>
          </div>

          {/* Column 2: Ban Lãnh đạo & Tổ chức tòa soạn */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wide border-b border-slate-800 pb-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Ban Lãnh Đạo Tòa Soạn</span>
            </div>

            <ul className="space-y-2 text-[11px] text-slate-300">
              <li className="flex flex-col">
                <span className="text-slate-400">Tổng Biên Tập:</span>
                <strong className="text-white font-semibold">Nhà báo Nguyễn Hoàng Long</strong>
              </li>
              <li className="flex flex-col">
                <span className="text-slate-400">Phó Tổng Biên Tập Thường trực:</span>
                <strong className="text-white font-semibold">Nhà báo Trần Quang Huy</strong>
              </li>
              <li className="flex flex-col">
                <span className="text-slate-400">Trưởng Ban Thời sự & Điều phối Tin nóng:</span>
                <strong className="text-white font-semibold">Nhà báo Nguyễn Thu Trang</strong>
              </li>
              <li className="flex flex-col">
                <span className="text-slate-400">Hội đồng Thẩm định Pháp lý & Bạn đọc:</span>
                <span className="text-slate-300 font-medium">Luật sư Lê Tuấn Hưng (Đoàn Luật sư TP. Hà Nội)</span>
              </li>
            </ul>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Quy chuẩn Đạo đức Báo chí:</span>
              </div>
              <p>Cam kết bảo mật nguồn tin theo Điều 38 Luật Báo chí 2016 và quy định giải mật danh tính nghiêm ngặt.</p>
            </div>
          </div>

          {/* Column 3: Trụ sở & Mạng lưới văn phòng */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wide border-b border-slate-800 pb-2">
              <Building2 className="w-4 h-4 text-blue-400" />
              <span>Trụ Sở & Văn Phòng Đại Diện</span>
            </div>

            <div className="space-y-2.5 text-[11px] text-slate-300">
              <div>
                <div className="text-white font-bold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>Trụ sở chính Tòa soạn (Hà Nội):</span>
                </div>
                <p className="text-slate-400 pl-5 mt-0.5">
                  Tòa nhà Báo chí, Số 45 Phố Lý Thường Kiệt, Phường Trần Hưng Đạo, Quận Hoàn Kiếm, TP. Hà Nội
                </p>
              </div>

              <div>
                <div className="text-white font-bold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Cơ quan đại diện phía Nam (TP.HCM):</span>
                </div>
                <p className="text-slate-400 pl-5 mt-0.5">
                  Tòa nhà Thông tấn, Số 120 Đường Nguyễn Thị Minh Khai, Phường Võ Thị Sáu, Quận 3, TP. Hồ Chí Minh
                </p>
              </div>

              <div>
                <div className="text-white font-bold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Cơ quan đại diện miền Trung (Đà Nẵng):</span>
                </div>
                <p className="text-slate-400 pl-5 mt-0.5">
                  Số 58 Đường Bạch Đằng, Phường Hải Châu 1, Quận Hải Châu, TP. Đà Nẵng
                </p>
              </div>
            </div>
          </div>

          {/* Column 4: Liên hệ & Tiếp nhận thông tin */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wide border-b border-slate-800 pb-2">
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>Liên Hệ & Tiếp Nhận Phản Ánh</span>
            </div>

            <ul className="space-y-2 text-[11px]">
              <li className="flex items-start gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400">Đường dây nóng 24/7: </span>
                  <strong className="text-white font-mono">1900 6868</strong>
                  <div className="text-[10px] text-slate-400">(Nhánh 1: Tin nóng khẩn cấp | Nhánh 2: Khiếu nại)</div>
                </div>
              </li>

              <li className="flex items-start gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400">Trực ban tòa soạn: </span>
                  <span className="text-slate-200 font-mono">(024) 3825.9999</span>
                </div>
              </li>

              <li className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400">Hộp thư tòa soạn: </span>
                  <span className="text-amber-300 font-mono">toasoan@tinnongdansinh.vn</span>
                </div>
              </li>

              <li className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400">Ban Bạn đọc & Pháp chế: </span>
                  <span className="text-slate-200 font-mono">bandoc@tinnongdansinh.vn</span>
                </div>
              </li>

              <li className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400">Thời gian tiếp công dân: </span>
                  <span className="text-slate-200">Từ 08:00 - 17:00 (Thứ 2 đến Thứ 6)</span>
                </div>
              </li>
            </ul>

            <div className="pt-2 flex flex-wrap gap-2 text-[10px]">
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                Thang điểm Impact Score 30 - 130
              </span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                AI Gemini Flash Hỗ Trợ
              </span>
            </div>
          </div>
        </div>

        {/* Middle Quick Links */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-400">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="hover:text-white transition cursor-pointer">Quy chế hoạt động Tòa soạn</span>
            <span className="text-slate-700">•</span>
            <span className="hover:text-white transition cursor-pointer">Chính sách bảo mật người cung cấp tin</span>
            <span className="text-slate-700">•</span>
            <span className="hover:text-white transition cursor-pointer">Quy trình tiếp nhận & xử lý đơn thư khiếu nại</span>
            <span className="text-slate-700">•</span>
            <span className="hover:text-white transition cursor-pointer">Hướng dẫn tra cứu tiến độ hồ sơ</span>
            <span className="text-slate-700">•</span>
            <span className="hover:text-white transition cursor-pointer">Liên hệ công tác & Quảng cáo</span>
          </div>

          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Hệ thống tòa soạn đang trực tuyến 24/7</span>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="bg-slate-900/90 border-t border-slate-800/60 py-4 px-4 sm:px-6 text-slate-400 text-center text-[11px]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            © 2026 <strong>BÁO ĐIỆN TỬ TIN NÓNG DÂN SINH</strong> — Bảo lưu mọi quyền theo quy định của pháp luật Việt Nam.
          </div>
          <div className="text-slate-400 text-[10px]">
            Mọi hành vi sao chép, trích dẫn nội dung phải ghi rõ nguồn: <em>"Theo Báo điện tử Tin Nóng Dân Sinh"</em>.
          </div>
        </div>
      </div>
    </footer>
  );
};
