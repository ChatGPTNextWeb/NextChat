# Cloudflare Pages 部署指南

## 如何建立新專案

在 GitHub 上 fork 此專案，然後登入 dash.cloudflare.com，並前往 Pages 頁面。

1. 點擊 "Create a project"。
2. 選擇 "Connect to Git"。
3. 將 Cloudflare Pages 連接至您的 GitHub 帳號。
4. 選擇您 fork 的專案。
5. 點擊 "Begin setup"。
6. 對於 "Project name" 和 "Production branch"，可以使用預設值，也可以根據需要進行更改。
7. 在 "Build Settings" 中，選擇 "Framework presets" 選項並選擇 "Next.js"。
8. 由於 node:buffer 錯誤，請不要使用預設的 "Build command"。請改用以下指令：
    ```
    npx @cloudflare/next-on-pages --experimental-minify
    ```
9. 對於 "Build output directory"，請使用預設值並且不要修改。
10. 不要修改 "Root Directory"。
11. 對於 "Environment variables"，點擊 ">" 然後點擊 "Add variable"。填入以下資訊：

      - `NODE_VERSION=20.1`
      - `NEXT_TELEMETRY_DISABLE=1`
      - `OPENAI_API_KEY=您自己的API Key`
      - `YARN_VERSION=1.22.19`
      - `PHP_VERSION=7.4`

    您可以根據您的需求，選填以下資訊：

      - `CODE= 選填，存取密碼，多個密碼可用逗號分隔`
      - `OPENAI_ORG_ID= 選填，指定 OpenAI 中的組織 ID`
      - `HIDE_USER_API_KEY=1 選填，不允許使用者輸入他們自己的 API 密鑰`
      - `DISABLE_GPT4=1 選填，不允許使用者使用 GPT-4`
      - `ENABLE_BALANCE_QUERY=1 選填，允許使用者查詢餘額`
      - `DISABLE_FAST_LINK=1 選填，禁用從 URL 解析設定`
      - `OPENAI_SB=1 選填，使用第三方 OpenAI-SB API`

12. 點擊 "Save and Deploy"。
13. 點擊 "Cancel deployment"，因為您需要填寫 "Compatibility flags"。
14. 前往 "Build settings"，"Functions"，並找到 "Compatibility flags"。
15. 在 "Configure Production compatibility flag"和"Configure Preview compatibility flag"中，填入 "nodejs_compat"。
16. 前往 "Deployments"，然後點擊 "Retry deployment"。
17. Enjoy。
