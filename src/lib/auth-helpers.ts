import { headers } from "next/headers";
import { auth } from "./auth";
import pool from "./db";

export type UserRole = "user" | "pastor" | "admin";

export interface SessionWithRole {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: UserRole;
  };
  session: {
    id: string;
    expiresAt: Date;
  };
}

/**
 * 세션과 사용자 역할을 함께 가져옵니다.
 */
export async function getSessionWithRole(): Promise<SessionWithRole | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) return null;

    const result = await pool.query(
      `SELECT role FROM "user" WHERE id = $1`,
      [session.user.id]
    );

    const role = (result.rows[0]?.role as UserRole) || "user";

    return {
      user: {
        id: session.user.id,
        name: session.user.name || session.user.email || "사용자",
        email: session.user.email || "",
        image: session.user.image || undefined,
        role,
      },
      session: {
        id: session.session.id,
        expiresAt: session.session.expiresAt,
      },
    };
  } catch {
    return null;
  }
}

/**
 * 목사 또는 관리자인지 확인합니다.
 */
export async function verifyPastorOrAdminSession(): Promise<boolean> {
  const session = await getSessionWithRole();
  if (!session) return false;
  return session.user.role === "pastor" || session.user.role === "admin";
}

/**
 * 관리자인지 확인합니다.
 */
export async function verifyAdminSession(): Promise<boolean> {
  const session = await getSessionWithRole();
  if (!session) return false;
  return session.user.role === "admin";
}

/**
 * 로그인한 사용자인지 확인합니다.
 */
export async function verifyLoggedInSession(): Promise<boolean> {
  const session = await getSessionWithRole();
  return session !== null;
}

// 권한 체크 유틸리티
export const canViewPrayer = (
  prayerVisibility: "public" | "pastor_only",
  userRole: UserRole,
  isAuthor: boolean
): boolean => {
  if (isAuthor) return true;
  if (prayerVisibility === "public") return true;
  if (prayerVisibility === "pastor_only") {
    return userRole === "pastor" || userRole === "admin";
  }
  return false;
};

export const canRespondAsPastor = (userRole: UserRole): boolean => {
  return userRole === "pastor" || userRole === "admin";
};

export const canDeletePrayer = (
  userRole: UserRole,
  isAuthor: boolean
): boolean => {
  return isAuthor || userRole === "admin";
};

export const canEditPrayer = (isAuthor: boolean): boolean => {
  return isAuthor;
};

export const canDeleteComment = (
  userRole: UserRole,
  isAuthor: boolean
): boolean => {
  return isAuthor || userRole === "admin";
};
