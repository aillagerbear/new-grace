export type PrayerType = "request" | "testimony";
export type PrayerVisibility = "public" | "pastor_only";
export type PrayerCategory = "general" | "health" | "family" | "work" | "study" | "etc";

export interface Prayer {
  id: string;
  type: PrayerType;
  title: string;
  content: string;
  category: PrayerCategory;
  visibility: PrayerVisibility;
  authorId: string;
  authorName: string;
  authorImage?: string;
  isAnonymous: boolean;
  prayerCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PrayerComment {
  id: string;
  prayerId: string;
  authorId: string;
  authorName: string;
  authorImage?: string;
  content: string;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PrayerReaction {
  id: string;
  prayerId: string;
  userId: string;
  createdAt: string;
}

export interface PastorResponse {
  id: string;
  prayerId: string;
  pastorId: string;
  pastorName: string;
  pastorImage?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface PrayerWithDetails extends Prayer {
  pastorResponse?: PastorResponse;
  userHasPrayed?: boolean;
  comments?: PrayerComment[];
}

// API 응답 타입
export interface PrayerListResponse {
  prayers: Prayer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 카테고리 및 유형 라벨
export const PRAYER_TYPE_LABELS: Record<PrayerType, string> = {
  request: "기도제목",
  testimony: "기도 응답 간증",
};

export const PRAYER_VISIBILITY_LABELS: Record<PrayerVisibility, string> = {
  public: "전체 공개",
  pastor_only: "목사님께만",
};

export const PRAYER_CATEGORY_LABELS: Record<PrayerCategory, string> = {
  general: "일반",
  health: "건강",
  family: "가족",
  work: "직장",
  study: "학업",
  etc: "기타",
};
