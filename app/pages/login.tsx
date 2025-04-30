import React from "react";
import { WechatLogin } from "../components/WechatLogin";
import { useNavigate } from "react-router-dom";
import { Path } from "../constant";
import { useAccessStore } from "../store";
import { useEffect } from "react";
import { safeLocalStorage } from "../utils";

export default function LoginPage() {
  const navigate = useNavigate();
  const accessStore = useAccessStore();
  const storage = safeLocalStorage();

  // 检查是否已登录
  useEffect(() => {
    const userInfoStr = storage.getItem("wechat_user_info");
    if (userInfoStr && accessStore.wechatLoggedIn) {
      navigate(Path.Chat);
    }
  }, [navigate, accessStore.wechatLoggedIn]);

  return <WechatLogin />;
}
