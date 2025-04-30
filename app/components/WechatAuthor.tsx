import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./WechatAuthor.module.scss";
import { Path } from "../constant";
import { useAccessStore } from "../store";
import { safeLocalStorage } from "../utils";
import { showConfirm } from "./ui-lib";

interface WechatUserInfo {
  id: string;
  nickname: string;
  avatar: string;
  accessToken: string;
}

export function WechatAuthor() {
  const navigate = useNavigate();
  const accessStore = useAccessStore();
  const storage = safeLocalStorage();
  const [userInfo, setUserInfo] = useState<WechatUserInfo | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  // 加载用户信息
  useEffect(() => {
    const userInfoStr = storage.getItem("wechat_user_info");
    if (userInfoStr) {
      try {
        const parsedInfo = JSON.parse(userInfoStr);
        setUserInfo(parsedInfo);
      } catch (e) {
        console.error("Failed to parse user info", e);
      }
    }
  }, []);

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 处理登出
  const handleLogout = async () => {
    const confirmed = await showConfirm("确定要退出登录吗？");
    if (confirmed) {
      // 清除登录信息
      storage.removeItem("wechat_user_info");

      // 更新访问状态
      accessStore.update((access) => {
        access.accessToken = "";
        access.wechatLoggedIn = false;
      });

      // 跳转到登录页
      navigate(Path.Home);
    }
    setShowMenu(false);
  };

  // 如果没有用户信息，显示登录按钮
  if (!accessStore.wechatLoggedIn) {
    return (
      <div className={styles.container}>
        <div
          className={styles.loginPrompt}
          onClick={() => navigate(Path.Login)}
        >
          点击登录
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div
        className={styles.avatarContainer}
        onClick={() => setShowMenu(true)}
        onContextMenu={(e) => {
          e.preventDefault();
          setShowMenu(true);
        }}
      >
        <img
          src={userInfo?.avatar}
          alt={userInfo?.nickname}
          className={styles.avatar}
        />
        <div className={styles.userInfo}>
          <div className={styles.nickname}>{userInfo?.nickname}</div>
          <div className={styles.userId}>ID: {userInfo?.id}</div>
        </div>
      </div>

      {showMenu && (
        <div className={styles.menu} ref={menuRef}>
          <div className={styles.menuItem} onClick={handleLogout}>
            退出登录
          </div>
        </div>
      )}
    </div>
  );
}
