output "pages_project_name" {
  value = cloudflare_pages_project.nextchat.name
}

output "pages_default_domain" {
  description = "*.pages.dev のデフォルトURL"
  value       = "https://${cloudflare_pages_project.nextchat.name}.pages.dev"
}

output "pages_custom_domain" {
  value = var.custom_domain != "" ? var.custom_domain : "未設定"
}

output "github_secrets_configured" {
  description = "自動投入されたGitHub Actions Secretsの一覧"
  value = compact([
    "CLOUDFLARE_API_TOKEN",
    "CLOUDFLARE_ACCOUNT_ID",
    var.openai_api_key != "" ? "OPENAI_API_KEY" : "",
    var.openai_org_id != "" ? "OPENAI_ORG_ID" : "",
    var.nextchat_access_code != "" ? "NEXTCHAT_ACCESS_CODE" : "",
  ])
}
