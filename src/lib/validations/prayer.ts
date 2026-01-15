import { z } from "zod";

export const prayerSchema = z.object({
  type: z.enum(["request", "testimony"], {
    required_error: "기도 유형을 선택해주세요",
  }),
  title: z
    .string()
    .min(2, "제목은 2자 이상 입력해주세요")
    .max(100, "제목은 100자 이내로 입력해주세요"),
  content: z
    .string()
    .min(10, "내용은 10자 이상 입력해주세요")
    .max(5000, "내용은 5000자 이내로 입력해주세요"),
  category: z.enum(["general", "health", "family", "work", "study", "etc"], {
    required_error: "카테고리를 선택해주세요",
  }),
  visibility: z.enum(["public", "pastor_only"], {
    required_error: "공개 범위를 선택해주세요",
  }),
  isAnonymous: z.boolean().default(false),
});

export const prayerCommentSchema = z.object({
  content: z
    .string()
    .min(1, "댓글을 입력해주세요")
    .max(1000, "댓글은 1000자 이내로 입력해주세요"),
  isAnonymous: z.boolean().default(false),
});

export const pastorResponseSchema = z.object({
  content: z
    .string()
    .min(1, "답변을 입력해주세요")
    .max(5000, "답변은 5000자 이내로 입력해주세요"),
});

export type PrayerInput = z.infer<typeof prayerSchema>;
export type PrayerCommentInput = z.infer<typeof prayerCommentSchema>;
export type PastorResponseInput = z.infer<typeof pastorResponseSchema>;
