# Cloudflare Pages 部署指南

## 如何新建项目

在 Github 上 fork 本项目，然后登录到 dash.cloudflare.com 并进入 Pages。

1. 点击 "Create a project"。
2. 选择 "Connect to Git"。
3. 关联 Cloudflare Pages 和你的 GitHub 账号。
4. 选中你 fork 的此项目。
5. 点击 "Begin setup"。
6. 对于 "Project name" 和 "Production branch"，可以使用默认值，也可以根据需要进行更改。
7. 在 "Build Settings" 中，选择 "Framework presets" 选项并选择 "Next.js"。
8. 由于 node:buffer 的 bug，暂时不要使用默认的 "Build command"。请使用以下命令：
   ```
   npx @cloudflare/next-on-pages --experimental-minify
   ```
9. 对于 "Build output directory"，使用默认值并且不要修改。
10. 不要修改 "Root Directory"。
11. 对于 "Environment variables"，点击 ">" 然后点击 "Add variable"。按照以下信息填写：

    - `NODE_VERSION=20.1`
    - `NEXT_TELEMETRY_DISABLE=1`
    - `OPENAI_API_KEY=你自己的API Key`
    - `YARN_VERSION=1.22.19`
    - `PHP_VERSION=7.4`

    根据实际需要，可以选择填写以下选项：

    - `CODE= 可选填，访问密码，可以使用逗号隔开多个密码`
    - `OPENAI_ORG_ID= 可选填，指定 OpenAI 中的组织 ID`
    - `HIDE_USER_API_KEY=1 可选，不让用户自行填入 API Key`
    - `DISABLE_GPT4=1 可选，不让用户使用 GPT-4`
    - `ENABLE_BALANCE_QUERY=1 可选，启用余额查询功能`
    - `DISABLE_FAST_LINK=1 可选，禁用从链接解析预制设置`

12. 点击 "Save and Deploy"。
13. 点击 "Cancel deployment"，因为需要填写 Compatibility flags。
14. 前往 "Build settings"、"Functions"，找到 "Compatibility flags"。
15. 在 "Configure Production compatibility flag" 和 "Configure Preview compatibility flag" 中填写 "nodejs_compat"。
16. 前往 "Deployments"，点击 "Retry deployment"。
17. Enjoy.
