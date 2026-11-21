import Link from "next/link";
import { RECHARGE_GUIDE_LABEL, SITE_NAME } from "../config/site";
import styles from "./recharge.module.scss";

export const metadata = { title: `${RECHARGE_GUIDE_LABEL} · ${SITE_NAME}` };

export default function RechargeGuide() {
  return (
    <main className={styles.guide} lang="zh-CN">
      <Link href="/#/chat">返回聊天</Link>
      <h1>{RECHARGE_GUIDE_LABEL}</h1>
      <h2>个人额度与兑换</h2>
      <p>
        <Link href="/#/auth">登录或注册个人账号</Link>
        ，然后在聊天侧栏选择「兑换充值」，输入兑换码并确认。到账后，侧栏会显示最新余额。
      </p>
      <p>
        登录后，同源聊天使用个人余额。使用专属链接时，优先扣减该链接的额度。
      </p>
      <h2>用专属链接开聊</h2>
      <ol>
        <li>
          在浏览器打开试点管理员发给你的专属链接。首次使用会自动载入密钥。
        </li>
        <li>选择卡片支持的模型，输入消息并发送。无需注册或填写站点访问码。</li>
      </ol>
      <p>专属链接使用卡片自己的额度，与公共体验池分开。请妥善保管链接。</p>
      <p>试点资格由管理员发放，购买入口暂未开放。</p>
      <h2>公共体验</h2>
      <p>
        在登录页展开共享访问码入口，可使用公共体验额度。公共池和个人余额独立。
      </p>
    </main>
  );
}
