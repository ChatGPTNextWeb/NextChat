# Cloudflare Pages 導入ガイド

## 新規プロジェクトの作成方法
GitHub でこのプロジェクトをフォークし、dash.cloudflare.com にログインして Pages にアクセスします。

1. "Create a project" をクリックする。
2. "Connect to Git" を選択する。
3. Cloudflare Pages を GitHub アカウントに接続します。
4. フォークしたプロジェクトを選択します。
5. "Begin setup" をクリックする。
6. "Project name" と "Production branch" はデフォルト値を使用するか、必要に応じて変更してください。
7. "Build Settings" で、"Framework presets" オプションを選択し、"Next.js" を選択します。
8. node:buffer のバグのため、デフォルトの "Build command" は使用しないでください。代わりに、以下のコマンドを使用してください:
    ```
    npx @cloudflare/next-on-pages --experimental-minify
    ```
9. "Build output directory" はデフォルト値を使用し、変更しない。
10. "Root Directory" を変更しない。
11. "Environment variables" は、">" をクリックし、"Add variable" をクリックします。そして以下の情報を入力します:
    - `NODE_VERSION=20.1`
    - `NEXT_TELEMETRY_DISABLE=1`
    - `OPENAI_API_KEY=your_own_API_key`
    - `YARN_VERSION=1.22.19`
    - `PHP_VERSION=7.4`

    必要に応じて、以下の項目を入力してください:

    - `CODE= Optional, access passwords, multiple passwords can be separated by commas`
    - `OPENAI_ORG_ID= Optional, specify the organization ID in OpenAI`
    - `HIDE_USER_API_KEY=1 Optional, do not allow users to enter their own API key`
    - `DISABLE_GPT4=1 Optional, do not allow users to use GPT-4`

12. "Save and Deploy" をクリックする。
13. 互換性フラグを記入する必要があるため、"Cancel deployment" をクリックする。
14. "Build settings" の "Functions" から "Compatibility flags" を見つける。
15. "Configure Production compatibility flag" と "Configure Preview compatibility flag" の両方に "nodejs_compat "を記入する。
16. "Deployments" に移動し、"Retry deployment" をクリックします。
17. お楽しみください。
