// /app/api/auth/check/route.ts
import { NextRequest } from "next/server";
import { checkAuth } from "../../supabase";

export async function GET(req: NextRequest) {
  const user = await checkAuth(req);

  console.log("[Auth] user ", user);

  if (!user) {
    return new Response(JSON.stringify({ authenticated: false }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ authenticated: true, user }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
