# NextChat → Cloudflare Pages CI/CD 一式

NextChat (ChatGPTNextWeb) を Cloudflare Pages に、GitHub Actions + Terraform で
デプロイ／運用するための構成一式です。

## 構成

```
.github/workflows/deploy.yml   # main push で build → deploy を自動実行
terraform/
  providers.tf                 # cloudflare / github プロバイダ
  variables.tf                 # 入力変数
  main.tf                      # Cloudflare Pagesプロジェクト（Direct Upload）
  github_secrets.tf            # ★ GitHub Secrets / Variables を自動投入
  outputs.tf
  terraform.tfvars.example
```

## できること・できないこと（重要）

- Terraform を **1回 `apply`** すれば、Cloudflare Pages プロジェクトの作成と、
  GitHub Actions が必要とする Secrets（`CLOUDFLARE_API_TOKEN` など）・Variables の
  登録まで自動化されます。ダッシュボードで手動コピペする作業は不要です。
- ただし **その `terraform apply` を実行する最初の1回だけ**、あなた自身が
  Cloudflare API Token と GitHub の Personal Access Token（PAT）を用意する必要が
  あります。この「最初の鍵」はどこかの人間が持たなければならず、完全に人手ゼロには
  できません（これはTerraform/CI全般に共通する制約です）。
- OpenAI の API キーのような実行時シークレットは、Terraform の state に残さない
  ため、`cloudflare_pages_project` には含めず GitHub Actions の中で
  `wrangler pages secret put` により都度同期する設計にしています。

## セットアップ手順

### 1. 事前準備（あなたが1回だけ行う）

1. [GitHub](https://github.com/ChatGPTNextWeb/NextChat) の NextChat を Fork する
2. 本一式（`.github/workflows/deploy.yml` と `terraform/`）をForkしたリポジトリに追加してpush
3. Cloudflare API Token を発行（[dash.cloudflare.com](https://dash.cloudflare.com/profile/api-tokens) → 「Pages 編集」権限を持つカスタムトークン）
4. GitHub の Fine-grained PAT を発行
   （対象リポジトリに対して **Secrets: Read & write** / **Variables: Read & write** / **Administration: Read & write** 権限）

### 2. Terraform 実行

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# terraform.tfvars を編集して各値を埋める（絶対にコミットしない）

terraform init
terraform plan
terraform apply
```

これで以下が自動的に行われます。

- Cloudflare Pages プロジェクト `nextchat` の作成（compatibility flag: `nodejs_compat` 設定済み）
- GitHub Secrets 登録: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`,
  `OPENAI_API_KEY`（指定時）, `OPENAI_ORG_ID`（指定時）, `NEXTCHAT_ACCESS_CODE`（指定時）
- GitHub Variables 登録: `CF_PAGES_PROJECT_NAME`, `HIDE_USER_API_KEY`,
  `DISABLE_GPT4`, `ENABLE_BALANCE_QUERY`, `DISABLE_FAST_LINK`

### 3. デプロイ確認

`main` ブランチに push するか、GitHub上で Actions → `Deploy NextChat to Cloudflare Pages` →
`Run workflow` を実行すると、ビルドとデプロイが走ります。
完了後、Terraformの出力 `pages_default_domain`（`https://<project>.pages.dev`）でアクセスできます。

## 補足

- Node.js は `20.1`、ビルドコマンドは NextChat 公式ドキュメント推奨の
  `npx @cloudflare/next-on-pages --experimental-minify` を使用しています
  （通常の `next build` は既知の `node:buffer` バグでPages上では動きません）。
- ロックファイル（`pnpm-lock.yaml` / `yarn.lock`）を見てパッケージマネージャを
  自動判定するようにしているので、Fork元のバージョン差異に強くしてあります。
- 独自ドメインを使う場合は `terraform.tfvars` の `custom_domain` を設定してください
  （対象ドメインが同じCloudflareアカウントにゾーンとして存在している必要があります）。
- `terraform.tfstate` には機密値を含む可能性があるため、ローカル保管ではなく
  リモートバックエンド（Terraform Cloud等）＋アクセス制御を推奨します
  （`providers.tf` にコメントアウトの雛形あり）。
