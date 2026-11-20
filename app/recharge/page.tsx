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
      <h2>个人充值</h2>
      <p>
        个人充值暂未开放。已有兑换码的测试用户可通过管理员提供的钱包入口兑换，额度计入该账户。
      </p>
      <p>使用共享访问码聊天时，个人余额不会用于这些对话。</p>
    </main>
  );
}
