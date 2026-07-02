terraform {
  required_version = ">= 1.6.0"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.40"
    }
    github = {
      source  = "integrations/github"
      version = "~> 6.3"
    }
  }

  # 状態ファイルをローカルに残したくない場合はリモートバックエンドを推奨
  # (例: Cloudflare R2 を backend "s3" 互換で使う、または Terraform Cloud)
  # backend "s3" {
  #   bucket = "your-tfstate-bucket"
  #   key    = "nextchat/terraform.tfstate"
  #   ...
  # }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

provider "github" {
  token = var.github_token
  owner = var.github_owner
}
