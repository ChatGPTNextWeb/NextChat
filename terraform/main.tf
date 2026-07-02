############################################
# Cloudflare Pages プロジェクト（Direct Upload方式）
#
# GitHub Actions 側で `next-on-pages` によるビルドと
# `wrangler pages deploy` を行う構成のため、ここでは
# Git連携（source ブロック）は張らず、箱（プロジェクト）と
# ランタイム設定（環境変数・互換フラグ）だけを Terraform で管理する。
############################################

resource "cloudflare_pages_project" "nextchat" {
  account_id        = var.cloudflare_account_id
  name              = var.project_name
  production_branch = var.production_branch

  deployment_configs {
    production {
      compatibility_date  = "2025-03-07"
      compatibility_flags = ["nodejs_compat"]

      environment_variables = {
        NODE_VERSION             = "20.1"
        NEXT_TELEMETRY_DISABLE   = "1"
        HIDE_USER_API_KEY        = var.hide_user_api_key
        DISABLE_GPT4             = var.disable_gpt4
        ENABLE_BALANCE_QUERY     = var.enable_balance_query
        DISABLE_FAST_LINK        = var.disable_fast_link
      }
    }

    preview {
      compatibility_date  = "2025-03-07"
      compatibility_flags = ["nodejs_compat"]

      environment_variables = {
        NODE_VERSION           = "20.1"
        NEXT_TELEMETRY_DISABLE = "1"
      }
    }
  }

  lifecycle {
    # OPENAI_API_KEY 等の秘匿値は Terraform では管理しない
    # (README参照: `wrangler pages secret put` で登録する)
    ignore_changes = []
  }
}

############################################
# 独自ドメイン（任意）
############################################

resource "cloudflare_pages_domain" "custom_domain" {
  count        = var.custom_domain != "" ? 1 : 0
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.nextchat.name
  domain       = var.custom_domain
}
