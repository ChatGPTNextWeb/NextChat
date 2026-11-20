import styles from "./auth.module.scss";
import { IconButton } from "./button";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Link from "next/link";
import { Path } from "../constant";
import {
  RECHARGE_GUIDE_LABEL,
  RECHARGE_GUIDE_PATH,
  SITE_NAME,
} from "../config/site";
import { useAccessStore } from "../store";
import Locale from "../locales";
import BotIcon from "../icons/nextchat-bot.svg";
import { getClientConfig } from "../config/client";
import { PasswordInput } from "./ui-lib";
import LeftIcon from "@/app/icons/left.svg";
import clsx from "clsx";

export function AuthPage() {
  const navigate = useNavigate();
  const accessStore = useAccessStore();
  const goChat = () => navigate(Path.Chat);

  useEffect(() => {
    if (getClientConfig()?.isApp) {
      navigate(Path.Settings);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles["auth-page"]}>
      <div className={styles["auth-header"]}>
        <IconButton
          icon={<LeftIcon />}
          text={Locale.Auth.Return}
          onClick={() => navigate(Path.Home)}
        ></IconButton>
      </div>
      <div className={clsx("no-dark", styles["auth-logo"])}>
        <BotIcon />
      </div>

      <h1 className={styles["auth-title"]}>{SITE_NAME}</h1>
      <div className={styles["auth-tips"]}>输入站点访问码即可开始体验。</div>

      <PasswordInput
        style={{ marginTop: "3vh", marginBottom: "3vh" }}
        aria={Locale.Settings.ShowPassword}
        aria-label={Locale.Auth.Input}
        value={accessStore.accessCode}
        type="text"
        placeholder={Locale.Auth.Input}
        onChange={(e) => {
          accessStore.update(
            (access) => (access.accessCode = e.currentTarget.value),
          );
        }}
      />

      {!accessStore.hideUserApiKey ? (
        <details className={styles["auth-advanced"]}>
          <summary>高级连接设置</summary>
          <div className={styles["auth-tips"]}>{Locale.Auth.SubTips}</div>
          <PasswordInput
            style={{ marginTop: "3vh", marginBottom: "3vh" }}
            aria={Locale.Settings.ShowPassword}
            aria-label={Locale.Settings.Access.OpenAI.ApiKey.Placeholder}
            value={accessStore.openaiApiKey}
            type="text"
            placeholder={Locale.Settings.Access.OpenAI.ApiKey.Placeholder}
            onChange={(e) => {
              accessStore.update(
                (access) => (access.openaiApiKey = e.currentTarget.value),
              );
            }}
          />
          <PasswordInput
            style={{ marginTop: "3vh", marginBottom: "3vh" }}
            aria={Locale.Settings.ShowPassword}
            aria-label={Locale.Settings.Access.Google.ApiKey.Placeholder}
            value={accessStore.googleApiKey}
            type="text"
            placeholder={Locale.Settings.Access.Google.ApiKey.Placeholder}
            onChange={(e) => {
              accessStore.update(
                (access) => (access.googleApiKey = e.currentTarget.value),
              );
            }}
          />
        </details>
      ) : null}

      <div className={styles["auth-actions"]}>
        <IconButton text="开始对话" type="primary" onClick={goChat} />
        <Link href={RECHARGE_GUIDE_PATH}>{RECHARGE_GUIDE_LABEL}</Link>
      </div>
    </div>
  );
}
