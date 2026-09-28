import React from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  User, 
  Phone, 
  Flame, 
  CheckCircle2, 
  Bot, 
  Camera, 
  FileText, 
  Award,
  Globe
} from 'lucide-react';
import { Submission } from '../types';
import { calculatePriority } from '../data/criteria';

interface SubmissionDetailModalProps {
  submission: Submission | null;
  onClose: () => void;
}

export const SubmissionDetailModal: React.FC<SubmissionDetailModalProps> = ({
  submission,
  onClose,
}) => {
  if (!submission) return null;

  const priorityObj = calculatePriority(submission.totalScore);
  const isPublished = submission.stage === 'PUBLISHED';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="font-mono text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                {submission.trackingCode}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${priorityObj.bgLight} ${priorityObj.color} ${priorityObj.borderColor}`}>
                {submission.priority} ({submission.totalScore}đ)
              </span>
              {isPublished && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> ĐÃ XUẤT BẢN CHÍNH THỨC
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
              {submission.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Incident Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <span className="text-slate-400 font-bold uppercase text-[10px]">Vị trí xảy ra:</span>
            <div className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span>{submission.location}</span>
            </div>
            {submission.gpsCoordinates && (
              <div className="text-[11px] font-mono text-slate-500 mt-1">
                GPS: {submission.gpsCoordinates}
              </div>
            )}
          </div>

          <div>
            <span className="text-slate-400 font-bold uppercase text-[10px]">Thời gian tiếp nhận:</span>
            <div className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{submission.createdAt}</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Người báo: {submission.isAnonymous ? 'Ẩn danh (Đã mã hóa)' : submission.citizenName}
            </div>
          </div>
        </div>

        {/* 3 Impact Score Criteria Breakdown */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wide">
            Chi Tiết Thang Điểm Tác Động (Impact Score Matrix)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-100">
              <span className="text-[10px] text-blue-600 font-bold block">1. KHU VỰC (SCOPE)</span>
              <strong className="text-slate-900">{submission.locationScope.label}</strong>
              <div className="text-blue-700 font-mono font-bold mt-1">+{submission.locationScope.score} điểm</div>
            </div>
            <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-100">
              <span className="text-[10px] text-amber-700 font-bold block">2. DÂN SỐ ẢNH HƯỞNG</span>
              <strong className="text-slate-900">{submission.affectedPopulation.label}</strong>
              <div className="text-amber-700 font-mono font-bold mt-1">+{submission.affectedPopulation.score} điểm</div>
            </div>
            <div className="p-2.5 bg-red-50 rounded-lg border border-red-100">
              <span className="text-[10px] text-red-600 font-bold block">3. TÍNH CHẤT NGUY CƠ</span>
              <strong className="text-slate-900">{submission.severity.label}</strong>
              <div className="text-red-700 font-mono font-bold mt-1">+{submission.severity.score} điểm</div>
            </div>
          </div>
        </div>

        {/* Media Attachments */}
        {submission.attachments && submission.attachments.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-700 uppercase">
              Bằng chứng hình ảnh/video hiện trường ({submission.attachments.length} tệp)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {submission.attachments.map((att) => (
                <div key={att.id} className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                  <img src={att.url} alt={att.name} className="h-32 w-full object-cover" />
                  <p className="p-2 text-[11px] text-slate-700 truncate bg-white font-medium">
                    {att.caption || att.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Article Draft (if written) */}
        {submission.articleDraft && (
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-purple-600" />
                Bài Báo Đã Được Biên Tập & Xuất Bản
              </span>
              <span className="text-xs text-slate-500">
                Tác giả: <strong>{submission.articleDraft.authorName}</strong>
              </span>
            </div>

            <h3 className="text-lg font-black text-slate-900">
              {submission.articleDraft.title}
            </h3>

            <p className="text-xs font-medium text-slate-700 italic border-l-3 border-purple-500 pl-3 leading-relaxed">
              {submission.articleDraft.sapo}
            </p>

            <div className="text-xs text-slate-800 whitespace-pre-line leading-relaxed pt-2">
              {submission.articleDraft.content}
            </div>
          </div>
        )}

        {/* Field Verification info */}
        {submission.fieldVerification && (
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-emerald-800">
              <Camera className="w-4 h-4" />
              <span>Kiểm chứng thực địa bởi CTV: {submission.fieldVerification.reporterName} ({submission.fieldVerification.reporterId})</span>
            </div>
            <p className="text-slate-700 pt-1 leading-relaxed">
              {submission.fieldVerification.findingSummary}
            </p>
          </div>
        )}

        {/* AI Review Summary */}
        {submission.aiReview && (
          <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-xs space-y-1.5">
            <div className="font-bold text-purple-900 flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-purple-600" />
              <span>Đánh giá từ AI Tòa soạn (Gemini Flash): Độ tin cậy {submission.aiReview.factualConsistencyScore}%</span>
            </div>
            <p className="text-slate-700">{submission.aiReview.summary}</p>
          </div>
        )}
      </div>
    </div>
  );
};
