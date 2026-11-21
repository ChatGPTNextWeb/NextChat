import { type FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useNavigate } from "react-router-dom";
import BotIcon from "../icons/nextchat-bot.svg";
import { SITE_NAME } from "../config/site";
import { Path } from "../constant";
import { accountRequest, useAccountStore } from "../store/account";
import { useAccessStore } from "../store/access";
import styles from "./account.module.scss";

function message(error: unknown) {
  return error instanceof Error ? error.message : "操作失败，请稍后重试。";
}

export function AccountEntry() {
  const navigate = useNavigate();
  const setUser = useAccountStore((state) => state.setUser);
  const access = useAccessStore();
  const [registering, setRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sending, setSending] = useState(false);
  const [until, setUntil] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!until) return;
    const update = () =>
      setSeconds(Math.max(0, Math.ceil((until - Date.now()) / 1000)));
    update();
    const timer = window.setInterval(update, 200);
    return () => window.clearInterval(timer);
  }, [until]);

  async function send() {
    setError("");
    setNotice("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("请输入有效的邮箱地址。");
      return;
    }
    setSending(true);
    try {
      await accountRequest("send-code", { email });
      setUntil(Date.now() + 60_000);
      setNotice("验证码已发送，请查收邮箱。");
    } catch (error) {
      setError(message(error));
    } finally {
      setSending(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    setBusy(true);
    setError("");
    try {
      const result = await accountRequest(
        registering ? "register" : "login",
        data,
      );
      if (!result.user) throw new Error("登录未完成，请重试。");
      setUser(result.user);
      navigate(Path.Chat, { replace: true });
    } catch (error) {
      setError(message(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className={styles.entry} lang="zh-CN">
      <div className={styles.card}>
        <div className={styles.brand}>
          <BotIcon aria-hidden="true" />
          <h1>{SITE_NAME}</h1>
        </div>
        <div className={styles.tabs} aria-label="账号操作">
          {["登录", "注册"].map((label, index) => (
            <button
              key={label}
              type="button"
              aria-pressed={registering === Boolean(index)}
              disabled={busy || sending}
              onClick={() => {
                setRegistering(Boolean(index));
                setNotice("");
                setError("");
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <form
          key={String(registering)}
          onSubmit={submit}
          className={styles.form}
        >
          {registering && (
            <>
              <label htmlFor="account-email">邮箱</label>
              <div className={styles.row}>
                <input
                  id="account-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.currentTarget.value)}
                />
                <button
                  type="button"
                  onClick={send}
                  disabled={sending || seconds > 0}
                >
                  {seconds
                    ? seconds + " 秒"
                    : sending
                    ? "发送中…"
                    : "发送验证码"}
                </button>
              </div>
              <label htmlFor="account-code">邮箱验证码</label>
              <input
                id="account-code"
                name="verification"
                required
                autoComplete="one-time-code"
                maxLength={32}
              />
            </>
          )}
          <label htmlFor="account-username">
            {registering ? "用户名" : "用户名或邮箱"}
          </label>
          <input
            id="account-username"
            name="username"
            autoComplete="username"
            required
            maxLength={registering ? 20 : 254}
          />
          <label htmlFor="account-password">密码</label>
          <input
            id="account-password"
            name="password"
            type="password"
            autoComplete={registering ? "new-password" : "current-password"}
            minLength={registering ? 8 : 1}
            maxLength={128}
            required
          />
          {notice && (
            <p role="status" className={styles.notice}>
              {notice}
            </p>
          )}
          {error && (
            <p role="alert" className={styles.error}>
              {error}
            </p>
          )}
          <button className={styles.primary} disabled={busy || sending}>
            {busy ? "请稍候…" : registering ? "注册并开聊" : "登录"}
          </button>
        </form>
        <details className={styles.legacy}>
          <summary>已有专属体验链接或访问码？</summary>
          <p>专属体验链接可直接打开。使用共享体验额度时，在这里输入访问码。</p>
          <form
            className={styles.form}
            onSubmit={(event) => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              access.update((state) => {
                state.accessCode = String(data.get("accessCode") ?? "").trim();
              });
              navigate(Path.Chat, { replace: true });
            }}
          >
            <label htmlFor="account-access-code">共享访问码</label>
            <input
              id="account-access-code"
              name="accessCode"
              type="password"
              required
            />
            <button>进入体验</button>
          </form>
        </details>
        <Link href="/recharge">查看额度与充值说明</Link>
      </div>
    </main>
  );
}

export function AccountPanel({ narrow }: { narrow: boolean }) {
  const { user, setUser, refresh } = useAccountStore();
  const enabled = useAccessStore((state) => state.accountEnabled);
  const navigate = useNavigate();
  const dialog = useRef<HTMLDialogElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function doRedeem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const key = new FormData(form).get("key");
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const result = await accountRequest("redeem", { key });
      if (result.user) setUser(result.user);
      else await refresh();
      form.reset();
      dialog.current?.close();
      setNotice("兑换成功");
    } catch (error) {
      setError(message(error));
    } finally {
      setBusy(false);
    }
  }

  async function doLogout() {
    setBusy(true);
    setError("");
    try {
      await accountRequest("logout");
      setUser(null);
      navigate(Path.Auth, { replace: true });
    } catch (error) {
      setError(message(error));
    } finally {
      setBusy(false);
    }
  }

  if (!enabled) return null;
  if (!user)
    return (
      <button
        className={styles.accountLogin}
        onClick={() => navigate(Path.Auth)}
      >
        {narrow ? "登录" : "登录个人账号"}
      </button>
    );

  const balance = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(user.balanceUsd);
  return (
    <section className={styles.panel} aria-label="个人账号">
      {!narrow && <strong title={user.username}>{user.username}</strong>}
      <span title="个人剩余额度" aria-label="个人剩余额度">
        {balance}
      </span>
      {!narrow && (
        <div className={styles.row}>
          <button
            disabled={busy}
            onClick={() => {
              setError("");
              setNotice("");
              dialog.current?.showModal();
            }}
          >
            兑换充值
          </button>
          <button disabled={busy} onClick={doLogout}>
            退出登录
          </button>
        </div>
      )}
      {narrow && (
        <button
          disabled={busy}
          onClick={() => {
            setError("");
            dialog.current?.showModal();
          }}
        >
          账户
        </button>
      )}
      {notice && (
        <p role="status" className={styles.notice}>
          {notice}
        </p>
      )}
      <dialog
        ref={dialog}
        className={styles.dialog}
        aria-labelledby="account-redeem-title"
        onClose={() => setError("")}
      >
        <form onSubmit={doRedeem} className={styles.form}>
          <h2 id="account-redeem-title">兑换充值</h2>
          <label htmlFor="account-redeem">兑换码</label>
          <input
            id="account-redeem"
            name="key"
            autoComplete="off"
            required
            maxLength={128}
          />
          {error && (
            <p role="alert" className={styles.error}>
              {error}
            </p>
          )}
          <div className={styles.row}>
            <button
              type="button"
              disabled={busy}
              onClick={() => dialog.current?.close()}
            >
              关闭
            </button>
            {narrow && (
              <button type="button" disabled={busy} onClick={doLogout}>
                退出登录
              </button>
            )}
            <button className={styles.primary} disabled={busy}>
              {busy ? "请稍候…" : "兑换"}
            </button>
          </div>
        </form>
      </dialog>
      {error && !dialog.current?.open && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}
    </section>
  );
}
