# 使用 UpStash 同步聊天記錄
## 前置準備
- Github 帳號
- 已架設好的 ChatGPT-Next-Web 伺服器
- [UpStash](https://upstash.com)

## 開始使用
1. 註冊 UpStash 帳號。
2. 創建資料庫。

    ![註冊與登入](./images/upstash-1.png)

    ![創建資料庫](./images/upstash-2.png)

    ![選擇伺服器](./images/upstash-3.png)

3. 找到 REST API，分別複製 UPSTASH_REDIS_REST_URL 和 UPSTASH_REDIS_REST_TOKEN（⚠切記⚠：不要洩漏 Token!）

    ![複製](./images/upstash-4.png)

4. UPSTASH_REDIS_REST_URL 和 UPSTASH_REDIS_REST_TOKEN 複製到你的同步配置，點擊**檢查可用性**

    ![同步1](./images/upstash-5.png)

    如果沒什麼問題，那就成功了

    ![同步可用性完成](./images/upstash-6.png)

5. Success!

    ![好耶~！](./images/upstash-7.png)


