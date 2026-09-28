export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'BREAKING';

export type WorkflowStage =
  | 'CITIZEN_SUBMITTED'         // Người dân gửi tin
  | 'EDITOR_REVIEWING'          // BTV rà soát, phân loại
  | 'AWAITING_FIELD_ASSIGN'     // Tin HIGH/BREAKING cần điều phối CTV
  | 'FIELD_ASSIGNED'            // CTV đã nhận việc (broadcast hoặc chỉ định)
  | 'FIELD_VERIFIED'            // CTV đã gửi báo cáo kiểm chứng hiện trường
  | 'ARTICLE_DRAFTING'          // CTV đang viết bài tại hiện trường
  | 'ARTICLE_SUBMITTED'         // CTV nộp bài
  | 'EDITOR_REVISION_REQUESTED' // BTV yêu cầu viết lại kèm ghi chú lỗi
  | 'AI_REVIEW_COMPLETED'       // Đã qua AI review & BTV duyệt
  | 'DEPUTY_PENDING'            // Chờ Phó TBT duyệt
  | 'EIC_PENDING'               // Chờ Tổng biên tập duyệt (cho HIGH & BREAKING)
  | 'READY_FOR_PUBLISHING'      // Đã phê duyệt, sẵn sàng lên cổng
  | 'PUBLISHED'                 // Đã xuất bản lên Cổng thông tin
  | 'REJECTED';                 // Bác bỏ do tin giả / không phù hợp

export interface ImpactOption {
  value: number;
  label: string;
  sublabel: string;
  description: string;
}

export interface ImpactCategory {
  id: 'locationScope' | 'affectedPopulation' | 'severity';
  title: string;
  order: number;
  options: ImpactOption[];
}

export interface MediaAttachment {
  id: string;
  name: string;
  type: 'image' | 'video';
  url: string;
  size?: string;
  caption?: string;
}

export interface FieldAssignment {
  method: 'BROADCAST' | 'DIRECT';
  regionTarget?: string;
  assignedReporterId?: string;
  assignedReporterName?: string;
  assignedReporterEmail?: string;
  assignedAt?: string;
  claimedAt?: string;
}

export interface FieldVerification {
  verifiedAt: string;
  reporterId: string;
  reporterName: string;
  evidenceAttachments: MediaAttachment[];
  locationGps?: string;
  witnessCount?: number;
  findingSummary: string;
  status: 'CONFIRMED_TRUE' | 'EXAGGERATED' | 'FALSE_REPORT';
  editorNotes?: string;
}

export interface ArticleDraft {
  title: string;
  sapo: string;
  content: string;
  authorName: string;
  authorId: string;
  updatedAt: string;
  revisionRound: number;
  editorFeedbackNote?: string;
  flaggedSections?: { section: string; note: string }[];
}

export interface AIReviewResult {
  summary: string;
  strengths: string[];
  editorialWarnings: string[];
  factualConsistencyScore: number;
  legalRiskAssessment: string;
  suggestedHeadline: string;
  recommendation: 'APPROVE_FOR_DEPUTY_REVIEW' | 'REQUEST_EDITS';
  reviewedAt: string;
}

export type AppRole = 'CITIZEN' | 'EXPERT' | 'EDITOR' | 'REPORTER' | 'DEPUTY_EIC' | 'EIC';
export type Role = AppRole;

export interface ExpertApplication {
  id: string;
  code: string;
  citizenName: string;
  phone: string;
  email: string;
  academicTitle: string; // e.g. PGS. TS, Thạc sĩ, Kỹ sư trưởng, Luật sư, Chuyên gia cao cấp
  organization: string; // Viện nghiên cứu, Trường đại học, Đoàn luật sư...
  fieldSpecialties: string[]; // Lĩnh vực chuyên môn
  bio: string;
  portfolioUrl?: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
  approvedAt?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  avatar?: string;
  title?: string;
  phone?: string;
  address?: string;
  penName?: string;
  department?: string;
}

export interface CTVApplication {
  id: string;
  applicationCode: string; // e.g. CTV-2026-8812
  citizenName: string;
  penName?: string;
  citizenPhone: string;
  citizenEmail: string;
  citizenIdCard: string; // CCCD
  birthDate?: string;
  address: string;
  province: string;
  district: string;
  profession: string;
  education: string;
  fieldSpecialties: string[];
  equipment: string[];
  experienceDescription: string;
  portfolioLinks?: string;
  submittedAt: string;
  reputationScoreAtApplication: number;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  reviewNote?: string;
}

export interface CitizenProfileData {
  id: string;
  name: string;
  penName?: string;
  phone: string;
  email: string;
  idCard: string;
  address: string;
  province: string;
  district: string;
  joinedDate: string;
  avatar: string;
  reputationScore: number;
  tier?: string;
  verifiedCount: number;
  inProgressCount: number;
  falseReportCount: number;
  badges: { label: string; icon: string; desc: string }[];
  ctvApplication?: CTVApplication | null;
}

export interface DeputyReview {
  reviewerName: string;
  reviewerId: string;
  reviewedAt: string;
  decision: 'APPROVED' | 'ESCALATE_TO_EIC' | 'REJECTED';
  editorialDirective: string;
}

export interface EICApproval {
  eicName: string;
  approvedAt: string;
  decision: 'APPROVED_AND_PUBLISHED' | 'TAKEDOWN';
  directive: string;
}

export interface Submission {
  id: string;
  trackingCode: string; // e.g. TN-2026-9812
  createdAt: string;
  category?: 'TIN_NONG' | 'KHIEU_NAI'; // Phân loại: Tin nóng khẩn cấp vs Khiếu nại/Phản ánh dân sinh
  
  // Citizen inputs
  title: string;
  description: string;
  location: string;
  province: string;
  district: string;
  ward: string;
  gpsCoordinates?: string;
  incidentTime: string;
  
  citizenName?: string;
  citizenPhone: string;
  citizenEmail?: string;
  isAnonymous: boolean;
  
  attachments: MediaAttachment[];
  
  // 3 Impact Criteria
  locationScope: {
    score: number;
    label: string;
  };
  affectedPopulation: {
    score: number;
    label: string;
  };
  severity: {
    score: number;
    label: string;
  };
  
  totalScore: number; // 30 - 130
  priority: PriorityLevel;
  
  // Workflow fields
  stage: WorkflowStage;
  editorId?: string;
  editorName?: string;
  editorInitialNote?: string;
  
  senderConfirmedAt?: string;
  senderConfirmedBy?: string;
  senderSanctionReport?: {
    violationType: string;
    sanctionLevel: string;
    reason: string;
    reportedAt: string;
    reportedBy: string;
  };
  
  fieldAssignment?: FieldAssignment;
  fieldVerification?: FieldVerification;
  articleDraft?: ArticleDraft;
  aiReview?: AIReviewResult;
  
  deputyReview?: DeputyReview;
  deputyReviewNote?: string;
  deputyApprovedAt?: string;
  
  eicApproval?: EICApproval;
  eicReviewNote?: string;
  eicApprovedAt?: string;
  eicDeAnonymized?: boolean; // OTP verification used to uncover citizen identity
  
  publishedAt?: string;
  viewCount?: number;
}

export type ArticleSourceType = 'CTV' | 'EXPERT' | 'JOURNALIST';

export type EditorialArticleStatus = 
  | 'PENDING_REVIEW'           // Chờ BTV tiếp nhận & thẩm định
  | 'EDITING'                  // Đang biên tập / hiệu đính
  | 'REVISION_REQUESTED'       // Yêu cầu tác giả chỉnh sửa / bổ sung tư liệu
  | 'TRANSFERRED_TO_DEPUTY'    // Đã chuyển Phó Tổng Biên Tập duyệt
  | 'APPROVED'                 // Đã duyệt xuất bản
  | 'PUBLISHED'                // Đã lên trang chính thức
  | 'REJECTED';                // Trả bài / từ chối xuất bản

export type RoyaltyTier = 'TIER_A' | 'TIER_B' | 'TIER_C' | 'SPECIAL';

export interface EditorialArticle {
  id: string;
  code: string; // Mã bài viết, ví dụ: CTV-2026-001, EXP-2026-002, JRN-2026-003
  sourceType: ArticleSourceType;
  title: string;
  sapo: string;
  content: string;
  category: string;
  tags: string[];
  
  // Thông tin tác giả
  authorName: string;
  authorPenName?: string;
  authorTitle: string; // Chức danh / Học hàm / Bút danh
  authorAvatar: string;
  authorOrganization?: string; // Cơ quan, Viện nghiên cứu, Tòa soạn
  authorPhone: string;
  authorEmail: string;
  
  submittedAt: string;
  updatedAt?: string;
  
  // Trạng thái tòa soạn & kiểm duyệt
  status: EditorialArticleStatus;
  royaltyTier?: RoyaltyTier;
  royaltyAmount?: number;
  
  editorNote?: string;
  editorId?: string;
  editorName?: string;
  revisionRequestNote?: string;
  
  attachments: {
    id: string;
    name: string;
    url: string;
    caption: string;
    type: 'image' | 'document';
  }[];
  
  relatedSubmissionCode?: string;
  factCheckScore?: number;
  factCheckNotes?: string;
}
