# Grace Church New

Grace Church 커뮤니티 웹사이트

## 기능

- 📱 반응형 디자인
- 🔐 소셜 로그인 (Google, Kakao, Naver)
- 🎨 Modern UI with Tailwind CSS
- ⚡ Next.js 15 + Turbopack

## 로컬 개발 환경 설정

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.example` 파일을 복사하여 `.env.local` 파일을 생성합니다:

```bash
cp .env.example .env.local
```

`.env.local` 파일을 열어 소셜 로그인 API 키를 입력합니다:

```env
# 앱 URL
NEXT_PUBLIC_APP_URL=http://localhost:3001

# 데이터베이스
DATABASE_URL=file:./db.sqlite

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Kakao Login
KAKAO_CLIENT_ID=your_kakao_rest_api_key
KAKAO_CLIENT_SECRET=your_kakao_client_secret

# Naver Login
NAVER_CLIENT_ID=your_naver_client_id
NAVER_CLIENT_SECRET=your_naver_client_secret
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3001](http://localhost:3001)을 엽니다.

## Cloudtype 배포 가이드

### 1. GitHub 저장소 연결

1. [Cloudtype](https://cloudtype.io/) 접속 및 로그인
2. 새 프로젝트 생성
3. GitHub 저장소 연결 선택
4. `aillagerbear/new-grace` 저장소 선택

### 2. 환경 변수 설정

Cloudtype 프로젝트 설정 > **환경 변수** 탭에서 다음 변수들을 추가합니다:

#### 필수 환경 변수

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `NEXT_PUBLIC_APP_URL` | 배포된 앱의 URL | `https://your-app.cloudtype.app` |
| `DATABASE_URL` | 데이터베이스 경로 | `file:./db.sqlite` |

#### Google 로그인 (선택)

| 변수명 | 설명 |
|--------|------|
| `GOOGLE_CLIENT_ID` | Google OAuth 클라이언트 ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 시크릿 |

**발급 방법:**
1. [Google Cloud Console](https://console.cloud.google.com/apis/credentials) 접속
2. OAuth 2.0 클라이언트 ID 생성
3. 승인된 리디렉션 URI: `https://your-app.cloudtype.app/api/auth/callback/google`

#### Kakao 로그인 (선택)

| 변수명 | 설명 |
|--------|------|
| `KAKAO_CLIENT_ID` | Kakao REST API 키 |
| `KAKAO_CLIENT_SECRET` | Kakao Client Secret |

**발급 방법:**
1. [Kakao Developers](https://developers.kakao.com/console/app) 접속
2. 애플리케이션 생성 및 카카오 로그인 활성화
3. Redirect URI: `https://your-app.cloudtype.app/api/auth/callback/kakao`

#### Naver 로그인 (선택)

| 변수명 | 설명 |
|--------|------|
| `NAVER_CLIENT_ID` | Naver 클라이언트 ID |
| `NAVER_CLIENT_SECRET` | Naver 클라이언트 시크릿 |

**발급 방법:**
1. [NAVER Developers](https://developers.naver.com/apps) 접속
2. 애플리케이션 등록
3. 서비스 URL: `https://your-app.cloudtype.app`
4. Callback URL: `https://your-app.cloudtype.app/api/auth/callback/naver`

### 3. 빌드 설정

Cloudtype에서 자동으로 감지하지만, 필요시 다음 설정을 확인합니다:

- **빌드 명령어**: `npm run build`
- **시작 명령어**: `npm run start`
- **포트**: `3000` (Next.js 기본 포트)

### 4. 배포

1. 모든 설정 완료 후 **배포** 버튼 클릭
2. 빌드 로그 확인
3. 배포 완료 후 제공된 URL로 접속

### 5. 도메인 연결 (선택)

Cloudtype 프로젝트 설정 > **도메인** 탭에서 커스텀 도메인을 연결할 수 있습니다.

## 소셜 로그인 콜백 URL 정리

배포 후 각 플랫폼의 개발자 콘솔에서 콜백 URL을 업데이트해야 합니다:

- **Google**: `https://your-app.cloudtype.app/api/auth/callback/google`
- **Kakao**: `https://your-app.cloudtype.app/api/auth/callback/kakao`
- **Naver**: `https://your-app.cloudtype.app/api/auth/callback/naver`

## 기술 스택

- **Framework**: Next.js 15
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI, shadcn/ui
- **Authentication**: Better Auth
- **Database**: SQLite (Better-SQLite3)
- **Animations**: Framer Motion
- **Icons**: Lucide React, Tabler Icons

## 프로젝트 구조

```
grace-church-new/
├── src/
│   ├── app/              # Next.js 앱 라우터
│   │   ├── api/          # API 라우트
│   │   │   └── auth/     # 인증 API
│   │   ├── layout.tsx    # 루트 레이아웃
│   │   ├── page.tsx      # 메인 페이지
│   │   └── globals.css   # 글로벌 스타일
│   ├── components/       # React 컴포넌트
│   │   ├── auth/         # 인증 관련 컴포넌트
│   │   ├── sections/     # 페이지 섹션
│   │   └── ui/           # UI 컴포넌트
│   └── lib/              # 유틸리티 함수
│       ├── auth.ts       # 인증 서버 설정
│       ├── auth-client.ts # 인증 클라이언트 훅
│       └── utils.ts      # 공통 유틸
├── public/               # 정적 파일
├── .env.example          # 환경 변수 예시
└── .env.local            # 로컬 환경 변수 (Git 제외)
```

## 라이선스

MIT
