/**
 * Mô hình dữ liệu quản trị HCM-UTE TechDoc
 * Tuân thủ quy chuẩn dự án HCM-UTE và phân tách mô-đun < 300 dòng
 */

export type LuongType = 'A' | 'B' | 'C' | 'TONG_QUAN' | 'HE_THONG';

export interface DocSectionItem {
  id: string;
  slug: string;
  chapterNumber: number;
  chapterTitle: string;
  pageTitle: string;
  pageSlug: string;
  summary: string;
  luong: LuongType;
  isVisible: boolean;
  viewCount: number;
  readingTimeMinutes: number;
  lastUpdated: string;
  tags: string[];
}

export type CriterionRating = 'pass' | 'warning' | 'fail' | 'none';

export interface EvaluationCriterion {
  id: string;
  code: string;
  name: string;
  description: string;
  weight: number; // Tỷ trọng phần trăm (ví dụ: 15, 20)
  passCondition: string;
  warningCondition: string;
  failCondition: string;
  isCustom?: boolean; // Tiêu chí do quản trị viên tự thêm
}

export type UnitGroupType = 'khoa-vien' | 'phong-ban' | 'trung-tam' | 'doan-the';

export interface UnitWebsiteItem {
  id: number;
  stt: number;
  group: UnitGroupType;
  groupLabel: string;
  name: string;
  domain: string;
  isNewWeb: boolean; // true = trỏ IP .189, false = web cũ .181 hoặc nxdomain
  staff: string; // Cán bộ phụ trách (Phi, Cal, Nhân, Ngân)
  criteriaRatings: Record<string, CriterionRating>;
  criteriaNotes?: Record<string, string>;
  completenessScore: number; // 0 - 100%
  prevRank?: number; // Thứ hạng kỳ trước (dùng tính biến động tăng/tụt hạng)
  notes?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface ProjectPhase {
  phaseId: number;
  title: string;
  timeFrame: string;
  target: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  completionRate: number; // %
}

export type AdminTab = 'overview' | 'units' | 'analytics' | 'progress' | 'content' | 'issues';

export type IssueStatus = 'khong_xu_ly' | 'da_xu_ly' | 'dang_xu_ly';

export type IssuePriority = 1 | 2 | 3; // 1: Cấp độ 1 (Khẩn cấp/Cao), 2: Cấp độ 2 (Trung bình), 3: Cấp độ 3 (Thấp)

export interface SystemIssueItem {
  id: string;
  stt: number;
  status: IssueStatus;
  content: string; // Nội dung (Text)
  images: string[]; // Danh sách ảnh (data URL hoặc link ảnh đính kèm)
  solutionPlan: string; // PA Chỉnh sửa (Phương án xử lý)
  priority: IssuePriority; // Ưu tiên (cấp độ 1, 2, 3)
  notes: string; // Note (Ghi chú thêm)
  reporterName?: string; // Người ghi chú
  createdAt?: string;
  updatedAt?: string;
}

