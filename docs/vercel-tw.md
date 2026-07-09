# Vercel 使用指南

## 如何建立新專案
當您從 Github fork 這個專案之後，您需要在 Vercel 重新建立一個全新的 Vercel 專案來進行部署。請依照下列步驟進行操作：

![vercel-create-1](./images/vercel/vercel-create-1.jpg)
1.  進入 Vercel 控制台首頁。
2.  點擊 Add New。
3.  選擇 Project。

![vercel-create-2](./images/vercel/vercel-create-2.jpg)
1.  在 Import Git Repository 處，搜尋 chatgpt-next-web。
2.  選中您新 fork 的專案，點擊 Import 。

![vercel-create-3](./images/vercel/vercel-create-3.jpg)
1.  在專案配置頁面，點開 Environment Variables 開始配置環境變數。
2.  依序新增名為 OPENAI_API_KEY 和 CODE ([Access Code](https://github.com/Yidadaa/ChatGPT-Next-Web/blob/357296986609c14de10bf210871d30e2f67a8784/docs/faq-cn.md#%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F-code-%E6%98%AF%E4%BB%80%E4%B9%88%E5%BF%85%E9%A1%BB%E8%AE%BE%E7%BD%AE%E5%90%97)) 的環境變數。
3.  填入環境變數對應的值。
4.  點擊 Add 確認增加環境變數。
5.  請確保您已新增 OPENAI_API_KEY，否則無法使用。
6.  點擊 Deploy，專案即建立完成，請耐心等待約 5 分鐘左右部署完成。

## 如何增加自訂網域
[TODO]

## 如何更改環境變數
![vercel-env-edit](./images/vercel/vercel-env-edit.jpg)
1.  進入 Vercel 專案的內部控制台，點擊頂部的 Settings 按鈕。
2.  點擊左側的 Environment Variables。
3.  點擊已有條目的右側按鈕。
4.  選擇 Edit 進行修改，然後儲存即可。

⚠️ 注意：每次修改完環境變數，您都需要[重新部署專案](#如何重新部署)才能讓變更生效！

## 如何重新部署
![vercel-redeploy](./images/vercel/vercel-redeploy.jpg)
1.  進入 Vercel 專案的內部控制台，點擊頂部的 Deployments 按鈕。
2.  選擇列表最上方一條部署記錄的右側按鈕。
3.  點擊 Redeploy 即可重新部署。

