############################################
# ブートストラップ用クレデンシャル
# （terraform apply を実行するあなたの手元/CI にのみ必要。リポジトリにはコミットしない）
############################################

variable "cloudflare_api_token" {
  description = "Cloudflare API Token (Pages:Edit, Account:Read 権限が必要)"
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Cloudflare Account ID"
  type        = string
}

variable "github_token" {
  description = "GitHub Personal Access Token (Fine-grained PAT: repo administration + secrets 書き込み権限)"
  type        = string
  sensitive   = true
}

variable "github_owner" {
  description = "GitHubのユーザー名 or Organization名"
  type        = string
}

variable "github_repo" {
  description = "NextChatをフォークしたリポジトリ名"
  type        = string
}

############################################
# Cloudflare Pages プロジェクト設定
############################################

variable "project_name" {
  description = "Cloudflare Pages のプロジェクト名（deploy.ymlのCF_PAGES_PROJECT_NAMEと一致させる）"
  type        = string
  default     = "nextchat"
}

variable "production_branch" {
  description = "本番デプロイ対象のGitブランチ"
  type        = string
  default     = "main"
}

variable "custom_domain" {
  description = "独自ドメインを割り当てる場合に指定（未指定なら *.pages.dev のみ）"
  type        = string
  default     = ""
}

############################################
# NextChat アプリケーション設定（Secretsとして GitHub に登録される）
############################################

variable "openai_api_key" {
  description = "NextChatが使用するOpenAI APIキー"
  type        = string
  sensitive   = true
  default     = ""
}

variable "openai_org_id" {
  description = "OpenAI Organization ID（任意）"
  type        = string
  default     = ""
}

variable "nextchat_access_code" {
  description = "NextChatのアクセスパスワード（CODE環境変数、カンマ区切りで複数可・任意）"
  type        = string
  sensitive   = true
  default     = ""
}

variable "hide_user_api_key" {
  description = "1にするとユーザーが自分のAPIキーを入力できなくなる（任意）"
  type        = string
  default     = "0"
}

variable "disable_gpt4" {
  description = "1にするとGPT-4の利用を禁止する（任意）"
  type        = string
  default     = "0"
}

variable "enable_balance_query" {
  description = "1にすると残高照会を許可する（任意）"
  type        = string
  default     = "0"
}

variable "disable_fast_link" {
  description = "1にするとURL経由の設定読み込みを無効化する（任意）"
  type        = string
  default     = "0"
}
