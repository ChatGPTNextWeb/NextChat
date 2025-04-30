import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Path } from "../constant";
import { useAccessStore } from "../store";
import { safeLocalStorage } from "../utils";

// 不需要登录就可以访问的路径
const PUBLIC_PATHS = [Path.Home, Path.Login];

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const accessStore = useAccessStore();
  const storage = safeLocalStorage();

  useEffect(() => {
    // 检查当前路径是否需要登录
    const isPublicPath = PUBLIC_PATHS.includes(location.pathname as Path);

    // 检查是否已登录
    const userInfoStr = storage.getItem("wechat_user_info");
    const isLoggedIn = userInfoStr && accessStore.wechatLoggedIn;

    // 如果需要登录但未登录，重定向到登录页
    if (!isPublicPath && !isLoggedIn) {
      navigate(Path.Login);
    }
  }, [location.pathname, navigate, accessStore.wechatLoggedIn]);

  return <>{children}</>;
}
