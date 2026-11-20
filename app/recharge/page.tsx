import Link from "next/link";
import { RECHARGE_GUIDE_LABEL, SITE_NAME } from "../config/site";
import styles from "./recharge.module.scss";

export const metadata = { title: `${RECHARGE_GUIDE_LABEL} · ${SITE_NAME}` };

export default function RechargeGuide() {
  return (
    <main className={styles.guide} lang="zh-CN">
      <Link href="/#/chat">返回聊天</Link>
      <h1>{RECHARGE_GUIDE_LABEL}</h1>
      <h2>开始对话</h2>
      <p>
        输入站点访问码后，选择可用模型并发送消息。体验对话使用站点共享额度。
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
      <h2>个人充值</h2>
      <p>
        个人充值暂未开放。已有兑换码的测试用户可通过管理员提供的钱包入口兑换，额度计入该账户。
      </p>
      <p>使用共享访问码聊天时，个人余额不会用于这些对话。</p>
    </main>
  );
}
