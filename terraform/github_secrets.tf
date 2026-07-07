############################################
# GitHub Actions Secrets（暗号化されリポジトリに保存される）
#
# ここが今回の「シークレット設定の自動化」の本体。
# `terraform apply` を1回実行するだけで、GitHub Actionsの
# deploy.yml が参照する secrets.* が全て設定される。
############################################

resource "github_actions_secret" "cloudflare_api_token" {
  repository      = var.github_repo
  secret_name     = "CLOUDFLARE_API_TOKEN"
  plaintext_value = var.cloudflare_api_token
}

resource "github_actions_secret" "cloudflare_account_id" {
  repository      = var.github_repo
  secret_name     = "CLOUDFLARE_ACCOUNT_ID"
  plaintext_value = var.cloudflare_account_id
}

resource "github_actions_secret" "openai_api_key" {
  count           = var.openai_api_key != "" ? 1 : 0
  repository      = var.github_repo
  secret_name     = "OPENAI_API_KEY"
  plaintext_value = var.openai_api_key
}

resource "github_actions_secret" "openai_org_id" {
  count           = var.openai_org_id != "" ? 1 : 0
  repository      = var.github_repo
  secret_name     = "OPENAI_ORG_ID"
  plaintext_value = var.openai_org_id
}

resource "github_actions_secret" "nextchat_access_code" {
  count           = var.nextchat_access_code != "" ? 1 : 0
  repository      = var.github_repo
  secret_name     = "NEXTCHAT_ACCESS_CODE"
  plaintext_value = var.nextchat_access_code
}

############################################
# GitHub Actions Variables（平文でよい設定値。Actionsのvars.*で参照）
############################################

resource "github_actions_variable" "cf_pages_project_name" {
  repository    = var.github_repo
  variable_name = "CF_PAGES_PROJECT_NAME"
  value         = var.project_name
}

resource "github_actions_variable" "hide_user_api_key" {
  repository    = var.github_repo
  variable_name = "HIDE_USER_API_KEY"
  value         = var.hide_user_api_key
}

resource "github_actions_variable" "disable_gpt4" {
  repository    = var.github_repo
  variable_name = "DISABLE_GPT4"
  value         = var.disable_gpt4
}

resource "github_actions_variable" "enable_balance_query" {
  repository    = var.github_repo
  variable_name = "ENABLE_BALANCE_QUERY"
  value         = var.enable_balance_query
}

resource "github_actions_variable" "disable_fast_link" {
  repository    = var.github_repo
  variable_name = "DISABLE_FAST_LINK"
  value         = var.disable_fast_link
}
