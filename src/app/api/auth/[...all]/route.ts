import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handlers = toNextJsHandler(auth);

// CORS 헤더 추가
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://port-next-new-grace-mi84sw7cd03bef80.sel3.cloudtype.app",
];

function getCorsHeaders(origin?: string | null) {
  const allowedOrigin = origin && allowedOrigins.includes(origin) ? origin : "*";
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };
}

// OPTIONS 핸들러 (CORS preflight)
export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin");
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}

// GET 핸들러
export async function GET(request: Request) {
  const url = new URL(request.url);
  console.log("[AUTH GET]", url.pathname);

  const origin = request.headers.get("origin");
  try {
    const response = await handlers.GET(request);
    console.log("[AUTH GET] Response status:", response.status);
    const corsHeaders = getCorsHeaders(origin);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  } catch (error) {
    console.error("[AUTH GET] Error:", error);
    throw error;
  }
}

// POST 핸들러
export async function POST(request: Request) {
  const url = new URL(request.url);
  console.log("[AUTH POST]", url.pathname);

  const origin = request.headers.get("origin");
  try {
    const response = await handlers.POST(request);
    console.log("[AUTH POST] Response status:", response.status);
    const corsHeaders = getCorsHeaders(origin);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  } catch (error) {
    console.error("[AUTH POST] Error:", error);
    throw error;
  }
}
