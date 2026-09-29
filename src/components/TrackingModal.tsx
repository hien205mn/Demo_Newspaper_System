import React, { useState } from 'react';
import { 
  X, 
  Search, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Flame, 
  ShieldCheck, 
  Camera, 
  UserCheck, 
  Award,
  Globe
} from 'lucide-react';
import { Submission, PriorityLevel } from '../types';
import { calculatePriority } from '../data/criteria';

interface TrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  submissions: Submission[];
  initialCode?: string;
}

export const TrackingModal: React.FC<TrackingModalProps> = ({
  isOpen,
  onClose,
  submissions,
  initialCode = '',
}) => {
  const [trackingCode, setTrackingCode] = useState(initialCode);
  const [searchedCode, setSearchedCode] = useState(initialCode);

  if (!isOpen) return null;

  const foundSubmission = submissions.find(
    (s) => s.trackingCode.toLowerCase() === searchedCode.trim().toLowerCase()
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchedCode(trackingCode);
  };

  const stepsTimeline = [
    { key: 'SUBMITTED', title: 'Tiếp nhận tin nóng & Tính Impact Score', done: true },
    { 
      key: 'EDITOR_REVIEW', 
      title: 'BTV tiếp nhận phân loại', 
      done: Boolean(foundSubmission?.editorId || foundSubmission?.fieldAssignment || foundSubmission?.stage !== 'CITIZEN_SUBMITTED') 
    },
    { 
      key: 'FIELD_ASSIGN', 
      title: 'Phát lệnh điều phối CTV hiện trường', 
      done: Boolean(foundSubmission?.fieldAssignment) 
    },
    { 
      key: 'FIELD_VERIFY', 
      title: 'CTV xác minh & viết bài tại chỗ', 
      done: Boolean(foundSubmission?.fieldVerification || foundSubmission?.articleDraft) 
    },
    { 
      key: 'AI_REVIEW', 
      title: 'BTV kiểm duyệt & AI Review', 
      done: Boolean(foundSubmission?.aiReview || foundSubmission?.stage === 'DEPUTY_PENDING' || foundSubmission?.stage === 'PUBLISHED') 
    },
    { 
      key: 'PUBLISHED', 
      title: 'Lãnh đạo phê duyệt & Xuất bản', 
      done: foundSubmission?.stage === 'PUBLISHED' 
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              TRA CỨU TIẾN ĐỘ XỬ LÝ HỒ SƠ BÁO CHÍ
            </h2>
            <p className="text-xs text-slate-500">
              Theo dõi tình trạng xác minh, thẩm định và xuất bản theo thời gian thực
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              placeholder="Nhập mã hồ sơ (ví dụ: TN-2026-8891, TN-2026-7731)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Tìm kiếm
          </button>
        </form>

        {/* Result Area */}
        {foundSubmission ? (
          <div className="space-y-6">
            {/* Status Card */}
            <div className="p-5 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Mã Hồ Sơ</span>
                  <div className="text-lg font-black font-mono text-red-600">
                    {foundSubmission.trackingCode}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Impact Score</span>
                  <div className="text-lg font-black text-slate-900">
                    {foundSubmission.totalScore}/130đ ({foundSubmission.priority})
                  </div>
                </div>
              </div>

              <h3 className="font-bold text-slate-900 text-sm">
                {foundSubmission.title}
              </h3>

              <div className="text-xs text-slate-600 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{foundSubmission.location}</span>
              </div>
            </div>

            {/* Step-by-Step Progress Timeline */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Tiến Trình Xử Lý Hồ Sơ Nghiệp Vụ
              </div>
              <div className="space-y-2">
                {stepsTimeline.map((step, idx) => (
                  <div
                    key={step.key}
                    className={`p-3 rounded-xl border flex items-center gap-3 text-xs transition ${
                      step.done
                        ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        step.done
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {step.done ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <span className="font-semibold">{step.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Stage Explanation */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 space-y-1">
              <div className="font-bold">Trạng thái nghiệp vụ hiện tại: {foundSubmission.stage}</div>
              <p className="text-slate-800 leading-relaxed">
                {foundSubmission.stage === 'PUBLISHED'
                  ? 'Tin đã được thẩm định và xuất bản chính thức trên Cổng thông tin Tòa soạn.'
                  : foundSubmission.stage === 'EIC_PENDING'
                  ? 'Hồ sơ đã qua kiểm duyệt chuyên môn của Phó TBT và đang trình Tổng biên tập ký duyệt cuối cùng.'
                  : foundSubmission.stage === 'FIELD_VERIFIED'
                  ? 'CTV đã hoàn tất xác minh thực địa và đang chuyển bài viết cho BTV thẩm định.'
                  : 'Hồ sơ đang trong luồng kiểm chứng và xử lý nghiệp vụ của Ban biên tập.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 text-xs">
            {searchedCode
              ? `Không tìm thấy hồ sơ có mã "${searchedCode}". Vui lòng kiểm tra lại.`
              : 'Hãy nhập mã hồ sơ tra cứu được cấp khi gửi tin để xem tiến độ.'}
          </div>
        )}
      </div>
    </div>
  );
};
