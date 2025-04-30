import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Path } from "../constant";
import styles from "./WechatLogin.module.scss";
import LoadingIcon from "../icons/loading.svg";
// import QRCodeImage from "../icons/wechat-qrcode-mock.svg"; // 假设有一个模拟的二维码SVG
import SuccessIcon from "../icons/confirm.svg";
import ErrorIcon from "../icons/close.svg";
import Locale from "../locales";
import { useAccessStore } from "../store";
import { safeLocalStorage } from "../utils";

// 登录状态枚举
enum LoginStatus {
  LOADING = "loading",
  READY = "ready",
  SCANNED = "scanned",
  CONFIRMED = "confirmed",
  SUCCESS = "success",
  ERROR = "error",
}

export function WechatLogin() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<LoginStatus>(LoginStatus.LOADING);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const accessStore = useAccessStore();
  const storage = safeLocalStorage();

  // 模拟登录流程
  useEffect(() => {
    // 初始加载
    const timer1 = setTimeout(() => {
      setStatus(LoginStatus.READY);
    }, 1000);

    return () => {
      clearTimeout(timer1);
    };
  }, []);

  // 模拟二维码扫描和确认过程
  const simulateLogin = () => {
    // 模拟扫码
    setStatus(LoginStatus.SCANNED);

    // 模拟确认
    setTimeout(() => {
      setStatus(LoginStatus.CONFIRMED);

      // 模拟登录成功
      setTimeout(() => {
        setStatus(LoginStatus.SUCCESS);

        // 存储登录信息
        const mockUserInfo = {
          id: "wx_" + Math.floor(Math.random() * 1000000),
          nickname: "微信用户",
          avatar: "https://placekitten.com/100/100", // 模拟头像
          accessToken: "mock_token_" + Date.now(),
        };

        storage.setItem("wechat_user_info", JSON.stringify(mockUserInfo));

        // 更新访问状态
        accessStore.update((access) => {
          access.accessToken = mockUserInfo.accessToken;
          access.wechatLoggedIn = true;
        });

        // 登录成功后跳转
        setTimeout(() => {
          navigate(Path.Chat);
        }, 2000);
      }, 1000);
    }, 2000);
  };

  // 刷新二维码
  const refreshQRCode = () => {
    setStatus(LoginStatus.LOADING);
    setTimeout(() => {
      setStatus(LoginStatus.READY);
    }, 1000);
  };

  // 处理登录错误
  const handleLoginError = () => {
    setStatus(LoginStatus.ERROR);
    setErrorMessage("登录失败，请稍后重试");
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h2>{Locale.Auth.Title}</h2>
          <p className={styles.subtitle}>使用微信扫码登录</p>
        </div>

        <div className={styles.qrcodeContainer}>
          {status === LoginStatus.LOADING && (
            <div className={styles.loadingWrapper}>
              <LoadingIcon className={styles.loadingIcon} />
              <p>正在加载二维码...</p>
            </div>
          )}

          {status === LoginStatus.READY && (
            <div className={styles.qrcodeWrapper} onClick={simulateLogin}>
              {/* <QRCodeImage className={styles.qrcode} /> */}
              <div className={styles.qrcodeOverlay}>
                <p>点击模拟扫码</p>
              </div>
              <p className={styles.qrcodeHint}>请使用微信扫描二维码登录</p>
            </div>
          )}

          {status === LoginStatus.SCANNED && (
            <div className={styles.statusWrapper}>
              <div className={styles.statusIcon}>
                <LoadingIcon className={styles.loadingIcon} />
              </div>
              <p className={styles.statusText}>已扫码，请在微信上确认</p>
            </div>
          )}

          {status === LoginStatus.CONFIRMED && (
            <div className={styles.statusWrapper}>
              <div className={styles.statusIcon}>
                <LoadingIcon className={styles.loadingIcon} />
              </div>
              <p className={styles.statusText}>已确认，正在登录...</p>
            </div>
          )}

          {status === LoginStatus.SUCCESS && (
            <div className={styles.statusWrapper}>
              <div className={styles.statusIcon}>
                <SuccessIcon className={styles.successIcon} />
              </div>
              <p className={styles.statusText}>登录成功，正在跳转...</p>
            </div>
          )}

          {status === LoginStatus.ERROR && (
            <div className={styles.statusWrapper}>
              <div className={styles.statusIcon}>
                <ErrorIcon className={styles.errorIcon} />
              </div>
              <p className={styles.statusText}>{errorMessage}</p>
              <button className={styles.refreshButton} onClick={refreshQRCode}>
                刷新二维码
              </button>
            </div>
          )}
        </div>

        {(status === LoginStatus.READY || status === LoginStatus.LOADING) && (
          <div className={styles.footer}>
            <p className={styles.expireHint}>二维码有效期为2分钟，请尽快扫码</p>
            <button
              className={styles.refreshButton}
              onClick={refreshQRCode}
              disabled={status === LoginStatus.LOADING}
            >
              刷新二维码
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
