import { betterAuth } from "better-auth";
import { genericOAuth } from "better-auth/plugins";
import pool from "./db";

const socialProviders = {
  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
      }
    : {}),
  ...(process.env.KAKAO_CLIENT_ID && process.env.KAKAO_CLIENT_SECRET
    ? {
        kakao: {
          clientId: process.env.KAKAO_CLIENT_ID,
          clientSecret: process.env.KAKAO_CLIENT_SECRET,
        },
      }
    : {}),
};

const plugins = [];
if (process.env.NAVER_CLIENT_ID && process.env.NAVER_CLIENT_SECRET && process.env.NEXT_PUBLIC_APP_URL) {
  plugins.push(
    genericOAuth({
      config: [
        {
          providerId: "naver",
          clientId: process.env.NAVER_CLIENT_ID,
          clientSecret: process.env.NAVER_CLIENT_SECRET,
          authorizationUrl: "https://nid.naver.com/oauth2.0/authorize",
          tokenUrl: "https://nid.naver.com/oauth2.0/token",
          userInfoUrl: "https://openapi.naver.com/v1/nid/me",
          redirectURI: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/oauth2/callback/naver`,
          scopes: ["profile", "email"],
          getUserInfo: async (tokens) => {
            const response = await fetch("https://openapi.naver.com/v1/nid/me", {
              headers: {
                Authorization: `Bearer ${tokens.accessToken}`,
              },
            });
            if (!response.ok) {
              throw new Error(`Naver user info request failed: ${response.status}`);
            }
            const data = await response.json();
            const user = data.response;
            return {
              id: user.id,
              email: user.email,
              emailVerified: false,
              name: user.name || user.nickname,
              image: user.profile_image,
            };
          },
        },
      ],
    })
  );
}

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  // 데이터베이스 설정
  database: pool,

  // 신뢰할 수 있는 origin 설정
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL,
    "http://localhost:3000",
    "http://localhost:3001",
  ].filter((origin): origin is string => Boolean(origin)),

  // 소셜 로그인 프로바이더 설정
  socialProviders,

  // 세션 설정
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7일
    updateAge: 60 * 60 * 24, // 1일마다 갱신
  },

  // 플러그인 설정 (네이버 로그인용)
  plugins,
});

export type Session = typeof auth.$Infer.Session;
