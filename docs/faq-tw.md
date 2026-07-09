# 常見問題 (FAQ)

## 如何快速獲得幫助？

1. 詢問 ChatGPT / Bing / 百度 / Google 等。
2. 向線上朋友求助。請提供背景資訊與詳細的問題描述。高品質的問題更容易獲得有用的答案。

# 部署相關問題

## 為什麼 Docker 部署版本總是提示更新？

Docker 版本等同於穩定版，最新的 Docker 版本始終與最新釋出版本保持一致。目前，我們的釋出頻率為一到兩天一次，因此 Docker 版本通常會比最新提交落後一到兩天，這是符合預期的。

## 如何在 Vercel 上部署？

1. 註冊 Github 帳號並 fork 此專案。
2. 註冊 Vercel（需要手機驗證，中國號碼可用），並連結你的 Github 帳號。
3. 在 Vercel 上建立新專案，選擇你在 Github fork 的專案，填寫必要的環境變數並開始部署。部署完成後，你可以透過 Vercel 提供的網域存取你的專案。（中國大陸需要代理）

- 如果需要在中國直接存取：請在你的 DNS 服務商處，為該網域名稱新增一條 CNAME 記錄，指向 `cname.vercel-dns.com`。然後在 Vercel 上設定你的網域存取。

## 如何修改 Vercel 環境變數？

- 進入 Vercel 控制台頁面；
- 選擇你的 chatgpt-next-web 專案；
- 點擊頁面頂部的 Settings 選項；
- 在側邊欄找到 Environment Variables 選項；
- 按需修改對應的值。

## 環境變數 CODE 是什麼？需要設定嗎？

這是你的自訂存取密碼，你可以選擇：

1. 不設定，刪除該環境變數。注意：此時任何人都能存取你的專案。
2. 在部署專案時設定環境變數 CODE（支援多組密碼，以逗號分隔）。設定後，使用者需要在設定頁面輸入存取密碼才能使用。詳見 [相關說明](https://github.com/Yidadaa/ChatGPT-Next-Web#access-password)。

## 為什麼我部署的版本沒有串流回應？

> 相關討論：[#386](https://github.com/Yidadaa/ChatGPT-Next-Web/issues/386)

如果你使用 nginx 反向代理，需要在設定檔中加入以下內容：

```
# 不快取，支援串流輸出
proxy_cache off;                # 關閉快取
proxy_buffering off;            # 關閉代理緩衝區
chunked_transfer_encoding on;   # 開啟分塊傳輸編碼
tcp_nopush on;                  # 開啟 TCP NOPUSH 選項，停用 Nagle 演算法
tcp_nodelay on;                 # 開啟 TCP NODELAY 選項，停用延遲 ACK 演算法
keepalive_timeout 300;          # 設定 keep-alive 逾時為 65 秒
```

如果你部署在 Netlify，此問題仍待解決，請耐心等待。

## 我已經部署好了，但無法存取

請檢查並排除以下問題：

- 服務是否已啟動？
- 埠號是否正確映射？
- 防火牆埠是否開放？
- 伺服器路由是否正常？
- 網域名稱解析是否正確？

## 你可能會遇到 "Error: Loading CSS chunk xxx failed..."

為了減少初始白屏時間，Next.js 預設啟用 chunk 分割。技術細節可參考：

- https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading
- https://stackoverflow.com/questions/55993890/how-can-i-disable-chunkcode-splitting-with-webpack4
- https://github.com/vercel/next.js/issues/38507
- https://stackoverflow.com/questions/55993890/how-can-i-disable-chunkcode-splitting-with-webpack4

然而，Next.js 對舊版瀏覽器的相容性有限，可能導致此錯誤。

你可以在建置時停用 chunk 分割。

在 Vercel 平台上，你可以將 `DISABLE_CHUNK=1` 新增到環境變數並重新部署。 
對於自行部署的專案，可以在建置過程中使用 `DISABLE_CHUNK=1 yarn build` 。
至於 Docker 使用者，由於建置已在打包時完成，目前不支援停用此功能。

注意：停用後，所有資源會在使用者首次訪問時一次性載入。如果使用者網路不佳，可能導致白屏時間更長，影響體驗。請在決策時考慮此因素。

# 使用相關問題

## 為什麼總是提示 "An error occurred, please try again later"

可能原因很多，請依序檢查：

- 確認程式碼版本是否為最新，更新後再試；
- 檢查 API Key 是否正確設定，環境變數名稱必須大寫並用底線；
- 檢查 API Key 是否可用；
- 若仍無法判斷問題，請在 issue 區提交新 issue，並附上 Vercel 或 Docker 執行日誌。

## 為什麼 ChatGPT 的回覆會是亂碼？

在設定頁面 → 模型設定中，有一個 `temperature` 參數。如果此值大於 1，可能導致亂碼。請調整回 1 以內。

## 使用時提示 "Now it's unauthorized, please enter the access password on the settings page" ？

專案透過環境變數 CODE 設定了存取密碼。首次使用時需要在設定頁面輸入存取碼。

## 使用時提示 "You exceeded your current quota, ..." ？

API Key 有問題，餘額不足。

## 什麼是代理？如何使用？

由於 OpenAI 的 IP 限制，中國及部分地區無法直接連線，需要透過代理。

- 正向代理：例如 VPN 。Docker 部署時可設定環境變數 `HTTP_PROXY` 為代理地址 ( http://address:port )。
- 反向代理：可使用他人的代理地址，或透過 Cloudflare 免費設定。將專案環境變數 `BASE_URL` 設為代理地址。

## 可以在中國伺服器部署嗎？

可以，但需注意：

- 需代理才能連線 Github 與 OpenAI；
- 網域解析需在中國伺服器備案；
- 中國政策限制代理存取境外網站/ChatGPT 應用，可能被封鎖。

# 網路服務相關問題

## 什麼是 Cloudflare？

Cloudflare (CF) 是網路服務商，提供 CDN、網域管理、靜態頁面託管、邊緣運算等。常見用途：購買/託管網域、套用 CDN、部署網站 (CF Pages)。大部分服務免費。

## 什麼是 Vercel？

Vercel 是全球雲平台，幫助開發者快速建置與部署現代 Web 應用。本專案及許多 Web 應用可一鍵免費部署到 Vercel。缺點是中國需綁定網域才能無限制存取。

## 如何取得網域名稱？

1. 註冊網域供應商：Namesilo（支援支付寶）、Cloudflare（國際）、萬網（中國）。
2. 免費網域供應商：eu.org（二級網域）等。
3. 向朋友索取免費二級網域。

## 如何取得伺服器？

- 國際伺服器供應商：AWS、Google Cloud、Vultr、Bandwagon、Hostdare 等。  
  注意：伺服器線路影響中國存取速度，推薦 CN2 GIA 或 CN2 線路。若存取困難，可嘗試 CDN（如 Cloudflare）。
- 中國伺服器供應商：阿里雲、騰訊等。  
  注意：網域解析需備案；國內伺服器頻寬昂貴；存取境外網站需代理。

# OpenAI 相關問題

## 如何註冊 OpenAI 帳號？

前往 chat.openai.com 註冊，需要：

- 穩定 VPN（僅支援特定區域原生 IP）
- 支援的 Email（如: Gmail、公司/學校信箱，不支援 Outlook 或 QQ）
- 可接收簡訊驗證的方式（如: SMS-activate）

## 如何啟用 OpenAI API？如何查詢餘額？

官方網站（需 VPN）：https://platform.openai.com/account/usage  ，部分用戶透過代理查詢餘額，請確認來源可靠以避免 API Key 洩漏。

## 為什麼新帳號沒有 API 餘額？

（2025/4/6 更新）新註冊帳號通常會在 24 小時內顯示 API 餘額。目前新帳號會獲得 5 美元餘額。

## 如何儲值 OpenAI API？

OpenAI 僅接受指定地區的信用卡（中國信用卡不可用）。若你的地區不支援，可選擇：

1. Depay 虛擬信用卡
2. 申請外國信用卡
3. 找人代儲

## 如何存取 GPT-4 API？

（2025/4/6 更新）存取 GPT-4 API 需要單獨申請。前往以下地址並填寫資訊加入候補清單（需準備 OpenAI 組織 ID）：https://openai.com/waitlist/gpt-4-api
，之後等待郵件通知。

## 如何使用 Azure OpenAI 介面？

請參考：[#371](https://github.com/Yidadaa/ChatGPT-Next-Web/issues/371)

## 為什麼我的 Token 消耗很快？

> 相關討論：[#518](https://github.com/Yidadaa/ChatGPT-Next-Web/issues/518)

- 如果你有 GPT-4 存取權並經常使用，帳單金額會快速增加，因為 GPT-4 價格約為 GPT-3.5 的 15 倍；
- 如果你使用 GPT-3.5 並不頻繁，但仍發現帳單金額快速增加，請立即排查：
  - 在 OpenAI 網站檢查 API Key 消耗紀錄；若每小時消耗數萬 Token，代表 API Key 已洩漏。請立即刪除並重新生成。**不要在隨機網站查詢餘額。**
  - 如果密碼過短（如: 5 位以下），暴力破解成本很低。建議檢查 Docker 日誌，確認是否有人嘗試大量密碼組合。關鍵字: got access code
- 透過以上兩種方法，你可以定位 Token 快速消耗的原因：
  - 若 OpenAI 消耗紀錄異常但 Docker 日誌正常 → API Key 洩漏；
  - 若 Docker 日誌顯示大量暴力破解嘗試 → 密碼已被破解。
