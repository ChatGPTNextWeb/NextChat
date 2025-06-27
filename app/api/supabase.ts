import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

export async function checkAuth(req: NextRequest) {
  // Use NextRequest.cookies API
  const authToken = req.cookies.get("sb-access-token")?.value;

  // console.log("[Supabase] authToken", authToken);

  if (!authToken) {
    // Không tìm thấy token xác thực
    console.log("[Supabase] No auth token found");
    return null;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
  });

  try {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) {
      // Lỗi khi lấy thông tin người dùng
      console.error("[Supabase] Error getting user:", error);
      return null;
    }

    // Đã xác thực thành công, trả về thông tin người dùng
    console.log("[Supabase] Authenticated user:", data.user);
    return data.user;
  } catch (err) {
    // Lỗi khi lấy dữ liệu người dùng
    console.error("[Supabase] Error fetching user data:", err);
    return null;
  }
}
