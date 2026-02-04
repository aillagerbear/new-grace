import { betterAuth } from "better-auth";
import { genericOAuth } from "better-auth/plugins";

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001",

  // 데이터베이스 설정 - connectionString 직접 전달
  database: {
    provider: "pg",
    url: process.env.DATABASE_URL!,
  },

  // 신뢰할 수 있는 origin 설정
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://port-next-new-grace-mi84sw7cd03bef80.sel3.cloudtype.app",
  ],

  // 소셜 로그인 프로바이더 설정
  socialProviders: {
    // 구글 로그인
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    // 카카오 로그인
    kakao: {
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    },
  },

  // 세션 설정
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7일
    updateAge: 60 * 60 * 24, // 1일마다 갱신
  },

  // 플러그인 설정 (네이버 로그인용)
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "naver",
          clientId: process.env.NAVER_CLIENT_ID!,
          clientSecret: process.env.NAVER_CLIENT_SECRET!,
          authorizationUrl: "https://nid.naver.com/oauth2.0/authorize",
          tokenUrl: "https://nid.naver.com/oauth2.0/token",
          userInfoUrl: "https://openapi.naver.com/v1/nid/me",
          redirectURI: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/oauth2/callback/naver`,
          scopes: ["profile", "email"],
          getUserInfo: async (tokens) => {
            const response = await fetch(
              "https://openapi.naver.com/v1/nid/me",
              {
                headers: {
                  Authorization: `Bearer ${tokens.accessToken}`,
                },
              }
            );
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
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;
